import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  appendArchiveRegistryEntry,
  makeArchiveRegistryEntry,
  normalizeEmptyActive,
  parseRegistryEntries,
  removeRegistryEntry,
  layout,
  root,
  validateSchema,
} from "../../lib/specforge.mjs";
import { artifactQualitySummary } from "../../lib/artifact-quality.mjs";
import { wikiQualitySummary } from "../../lib/wiki-quality.mjs";
import { wikiUpdatePlan } from "../../lib/wiki-plan.mjs";

function writeFixture(path, content) {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function skillStageOwners() {
  const skillsRoot = join(root, layout.skills);
  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const packagePath = join(skillsRoot, entry.name, "skill-package.json");
      if (!existsSync(packagePath)) return [];
      const manifest = JSON.parse(readFileSync(packagePath, "utf8"));
      return (manifest.owns?.stages ?? []).map((owned) => ({
        stage: owned.stage,
        owner: entry.name,
        path: join(skillsRoot, entry.name, owned.path),
      }));
    })
    .sort((a, b) => a.stage.localeCompare(b.stage));
}

function testRegistrySingleActiveRemoval() {
  const registry = `active:\n  - id: 20260512-feat-001-demo\n    title: Demo\n    type: FEATURE\n    status: INTAKE\n    path: .specforge/work/active/20260512-feat-001-demo\n\nblocked: []\narchive: []\n`;
  const next = normalizeEmptyActive(removeRegistryEntry(registry, "20260512-feat-001-demo"));
  assert.equal(next.includes(".specforge/work/active/20260512-feat-001-demo"), false);
  assert.equal(parseRegistryEntries(next, "active").length, 0);
  assert.match(next, /^active:\s*\[\]/m);
}

function testRegistryKeepsOtherActiveEntries() {
  const registry = `active:\n  - id: 20260512-feat-001-first\n    title: First\n    type: FEATURE\n    status: INTAKE\n    path: .specforge/work/active/20260512-feat-001-first\n  - id: 20260512-feat-002-second\n    title: Second\n    type: FEATURE\n    status: INTAKE\n    path: .specforge/work/active/20260512-feat-002-second\n\nblocked: []\narchive: []\n`;
  const next = removeRegistryEntry(registry, "20260512-feat-001-first");
  const active = parseRegistryEntries(next, "active");
  assert.deepEqual(active.map((entry) => entry.id), ["20260512-feat-002-second"]);
  assert.equal(next.includes("20260512-feat-001-first"), false);
}

function testArchiveAppend() {
  const registry = "active: []\n\nblocked: []\narchive:\n";
  const yaml = "title: Demo Archive\ntype: FEATURE\n";
  const entry = makeArchiveRegistryEntry("20260512-feat-003-demo", yaml, ".specforge/work/archive/20260512-feat-003-demo");
  const next = appendArchiveRegistryEntry(registry, entry);
  const archive = parseRegistryEntries(next, "archive");
  assert.equal(archive.length, 1);
  assert.equal(archive[0].id, "20260512-feat-003-demo");
  assert.equal(archive[0].status, "ARCHIVED");
}

function testQualityPolicyValidation() {
  const valid = validateSchema({
    id: "quality-policy-valid",
    artifacts: [
      {
        id: "requirements",
        stage: "01-spec",
        title: "Requirements",
        outputs: ["01-spec/requirements.md"],
        requires: [],
      },
    ],
    quality_policy: {
      section_checks: [
        {
          artifact: "requirements",
          path: "01-spec/requirements.md",
          sections: ["Spec Quality Gate"],
          severity: "P2",
        },
      ],
    },
  });
  assert.deepEqual(valid, []);

  const invalid = validateSchema({
    id: "quality-policy-invalid",
    artifacts: [
      {
        id: "requirements",
        stage: "01-spec",
        title: "Requirements",
        outputs: ["01-spec/requirements.md"],
        requires: [],
      },
    ],
    quality_policy: {
      section_checks: [
        {
          artifact: "missing",
          path: "01-spec/not-owned.md",
          sections: [],
          severity: "P9",
        },
      ],
    },
  });
  assert.ok(invalid.some((error) => error.includes("unknown artifact")));
  assert.ok(invalid.some((error) => error.includes("path must match an output of its artifact")));
  assert.ok(invalid.some((error) => error.includes("sections must be a non-empty array")));
  assert.ok(invalid.some((error) => error.includes("severity must be P0, P1, P2, or P3")));
}

function testWikiQualityGraphFactReferences() {
  const base = mkdtempSync("tmp-specforge-selftest-");
  try {
    const wikiRoot = `${base}/wiki`;
    const reportPath = `${base}/codebase-intelligence.md`;
    mkdirSync(wikiRoot, { recursive: true });
    writeFixture(
      `${wikiRoot}/00-index.md`,
      "---\ntitle: Index\nkind: index\nowner: test\nlast_updated: 2026-06-13\nsource_work: test\nstatus: current\n---\n\n# Index\n\n- [Architecture](03-architecture.md)\n",
    );
    writeFixture(
      `${wikiRoot}/03-architecture.md`,
      "---\ntitle: Architecture\nkind: architecture\nowner: test\nlast_updated: 2026-06-13\nsource_work: test\nstatus: current\n---\n\n# Architecture\n\n## Code navigation\n\n- path: src/orders/service.ts\n- command: npm test\n",
    );
    writeFixture(
      reportPath,
      `# Codebase Intelligence\n\n## 9. 原始 JSON 摘要\n\n\`\`\`json\n${JSON.stringify({
        graph_facts: [
          {
            id: "GF-TEST-001",
            type: "call",
            subject: "orders.submit",
            relation: "calls",
            object: "payment.authorize",
            provider: "codegraph",
            confidence: "high",
            source_paths: ["src/orders/service.ts"],
            used_for_wiki: true,
          },
        ],
      })}\n\`\`\`\n`,
    );

    const missingReference = wikiQualitySummary({ wikiRoot, graphFactReports: [reportPath] });
    assert.ok(missingReference.issues.some((issue) => issue.code === "graph-fact-wiki-reference-missing"));

    writeFixture(
      `${wikiRoot}/03-architecture.md`,
      "---\ntitle: Architecture\nkind: architecture\nowner: test\nlast_updated: 2026-06-13\nsource_work: test\nstatus: current\n---\n\n# Architecture\n\n## Code navigation\n\n- GF-TEST-001: orders.submit calls payment.authorize, source `src/orders/service.ts`.\n",
    );
    const referenced = wikiQualitySummary({ wikiRoot, graphFactReports: [reportPath] });
    assert.equal(referenced.graph_facts.referenced_candidates, 1);
    assert.equal(referenced.issues.some((issue) => issue.code === "graph-fact-wiki-reference-missing"), false);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

function testWikiQualityStrictModesBlockBootstrap() {
  const base = mkdtempSync("tmp-specforge-wiki-strict-");
  try {
    const wikiRoot = `${base}/wiki`;
    mkdirSync(wikiRoot, { recursive: true });
    writeFixture(
      `${wikiRoot}/00-index.md`,
      "---\ntitle: Index\nkind: index\nowner: test\nlast_updated: YYYY-MM-DD\nsource_work: bootstrap\nstatus: current\n---\n\n# Index\n\n暂无。\n",
    );
    writeFixture(
      `${wikiRoot}/01-project-overview.md`,
      "---\ntitle: Project\nkind: project\nowner: test\nlast_updated: YYYY-MM-DD\nsource_work: bootstrap\nstatus: current\n---\n\n# Project\n\n暂无。\n\n未确认。\n\n待补充。\n",
    );
    writeFixture(
      `${wikiRoot}/03-architecture.md`,
      "---\ntitle: Architecture\nkind: architecture\nowner: test\nlast_updated: YYYY-MM-DD\nsource_work: bootstrap\nstatus: current\n---\n\n# Architecture\n\n暂无。\n\n未确认。\n\n待补充。\n",
    );

    const bootstrap = wikiQualitySummary({ wikiRoot, mode: "bootstrap" });
    assert.equal(bootstrap.issues.some((issue) => issue.code === "placeholder-heavy" && issue.severity === "FAIL"), false);

    const steering = wikiQualitySummary({ wikiRoot, mode: "steering" });
    assert.ok(steering.issues.some((issue) => issue.code === "placeholder-heavy" && issue.severity === "FAIL"));
    assert.ok(steering.issues.some((issue) => issue.code === "index-summary-placeholder"));
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

function testWikiUpdatePlanBlocksNaForVerifiedWork() {
  const base = mkdtempSync("tmp-specforge-wiki-plan-");
  try {
    const work = `${base}/work/active/20260616-feat-001-wiki`;
    const wikiRoot = `${base}/wiki`;
    mkdirSync(wikiRoot, { recursive: true });
    writeFixture(
      `${work}/work.yaml`,
      "id: 20260616-feat-001-wiki\nupdated_at: 2026-06-16\ngates:\n  verification:\n    status: APPROVED\n    evidence: 05-verification/report.md\n",
    );
    writeFixture(
      `${work}/01-spec/requirements.md`,
      "# Requirements\n\nREQ-001 MUST: WHEN user opens dashboard, THE SYSTEM SHALL show account status.\n",
    );
    writeFixture(
      `${work}/01-spec/technical-design.md`,
      "# Technical Design\n\n## 7.1 Architecture Contract\nBoundary: dashboard service and API route.\n",
    );
    writeFixture(
      `${work}/03-implementation/changed-files.md`,
      "# Changed Files\n\n- `src/dashboard/service.ts`\n- `src/api/dashboard/route.ts`\n",
    );
    writeFixture(`${work}/05-verification/report.md`, "# Verification\n\nAPPROVED\n");
    writeFixture(`${wikiRoot}/00-index.md`, "# Index\n\n暂无。\n");
    writeFixture(`${wikiRoot}/01-project-overview.md`, "# Project\n\n暂无。\n");
    writeFixture(`${wikiRoot}/03-architecture.md`, "# Architecture\n\n暂无。\n");

    const plan = wikiUpdatePlan({ workItemBase: work, workItem: "20260616-feat-001-wiki", wikiRoot });
    assert.equal(plan.can_write_na, false);
    assert.ok(plan.required_targets.some((target) => target.file === "03-architecture.md"));
    assert.ok(plan.required_targets.some((target) => target.file === "05-operations.md"));
    assert.ok(plan.blocking_gaps.length > 0);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

function testCodebaseMapClassifiesDataCandidates() {
  const base = mkdtempSync("tmp-specforge-data-map-");
  try {
    writeFixture(`${base}/src/models/user.ts`, "export interface User { id: string }\n");
    writeFixture(`${base}/src/repositories/user-repository.ts`, "export const repo = {};\n");
    writeFixture(`${base}/prisma/schema.prisma`, "model User { id String @id }\n");
    writeFixture(`${base}/prisma/migrations/001_init/migration.sql`, "create table users(id text);\n");
    writeFixture(`${base}/db/legacy/old.sql`, "create table old_users(id text);\n");
    writeFixture(`${base}/database/backup_2019.sql`, "create table backup_users(id text);\n");

    const result = spawnSync(process.execPath, [`${layout.tools}/codebase-map.mjs`, "--json"], {
      cwd: root,
      encoding: "utf8",
      timeout: 10000,
      maxBuffer: 4 * 1024 * 1024,
    });
    assert.equal(result.status, 0, `codebase-map failed\n${result.stderr}`);
    const payload = JSON.parse(result.stdout);
    const groups = payload.candidates.data;
    assert.ok(groups.active_models.some((path) => path.endsWith("src/models/user.ts")));
    assert.ok(groups.repositories.some((path) => path.endsWith("src/repositories/user-repository.ts")));
    assert.ok(groups.schema_authorities.some((path) => path.endsWith("prisma/schema.prisma")));
    assert.ok(groups.migration_artifacts.some((path) => path.endsWith("prisma/migrations/001_init/migration.sql")));
    assert.ok(groups.legacy_sql_candidates.some((path) => path.endsWith("db/legacy/old.sql")));
    assert.ok(groups.legacy_sql_candidates.some((path) => path.endsWith("database/backup_2019.sql")));
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

function testWikiQualityBlocksUntrustedSqlInCurrentEntities() {
  const base = mkdtempSync("tmp-specforge-wiki-sql-");
  try {
    const wikiRoot = `${base}/wiki`;
    const reportPath = `${base}/codebase-intelligence.md`;
    mkdirSync(wikiRoot, { recursive: true });
    writeFixture(
      `${wikiRoot}/00-index.md`,
      "---\ntitle: 索引\nkind: index\nowner: test\nlast_updated: 2026-06-16\nsource_work: test\nstatus: current\n---\n\n# 索引\n\n- [数据模型](04-data-model.md)\n",
    );
    writeFixture(
      `${wikiRoot}/04-data-model.md`,
      "---\ntitle: 数据模型\nkind: data\nowner: test\nlast_updated: 2026-06-16\nsource_work: test\nstatus: current\n---\n\n# 数据模型\n\n## 1. 当前数据权威\n\n| 权威来源 | 路径 / 工具 | 角色 | 证据 | 置信度 |\n|---|---|---|---|---|\n| ORM | `src/models/user.ts` | 当前 schema 来源 | code | 已确认 |\n\n## 3. 当前实体 / 表\n\n| 实体 / 表 | 用途 | 关键字段 | 状态字段 | 读取路径 | 写入路径 | 测试 | 证据 | 置信度 |\n|---|---|---|---|---|---|---|---|---|\n| old_users | legacy table | id | none | `db/legacy/old.sql` | `db/legacy/old.sql` | none | legacy SQL | 可能 |\n\n## 6. 历史 / 未受信 SQL 产物\n\n| 文件 | 不作为当前事实的原因 | 已扫描证据 | 下一步验证 |\n|---|---|---|---|\n| `db/legacy/old.sql` | 未被引用 | 已扫描 | 询问 owner |\n",
    );
    writeFixture(
      reportPath,
      `# Codebase Intelligence\n\n## 9. 原始 JSON 摘要\n\n\`\`\`json\n${JSON.stringify({
        normalized_context: {
          data_candidate_groups: {
            active_models: ["src/models/user.ts"],
            legacy_sql_candidates: ["db/legacy/old.sql"],
            untrusted_sql: [],
          },
        },
      })}\n\`\`\`\n`,
    );

    const quality = wikiQualitySummary({ wikiRoot, graphFactReports: [reportPath], mode: "steering" });
    assert.ok(quality.issues.some((issue) => issue.code === "untrusted-sql-in-current-entities"));
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

function testWikiHydrateCliSmoke() {
  const result = spawnSync(process.execPath, [`${layout.tools}/wiki-hydrate.mjs`, "--mode", "close", "--json"], {
    cwd: root,
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 2 * 1024 * 1024,
  });
  assert.equal(
    result.status,
    0,
    `wiki-hydrate smoke failed\nSTDOUT:\n${result.stdout ?? ""}\nSTDERR:\n${result.stderr ?? ""}`,
  );
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.wiki_hydrate.mode, "close");
  assert.equal(Array.isArray(payload.wiki_hydrate.writes), true);
}

function testCodeIntelligenceCliSmoke() {
  const freshness = spawnSync(process.execPath, [`${layout.tools}/graph-freshness.mjs`, "--json"], {
    cwd: root,
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 2 * 1024 * 1024,
  });
  assert.equal(
    freshness.status,
    0,
    `graph-freshness smoke failed\nSTDOUT:\n${freshness.stdout ?? ""}\nSTDERR:\n${freshness.stderr ?? ""}`,
  );
  const freshnessPayload = JSON.parse(freshness.stdout);
  assert.equal(freshnessPayload.graph_freshness.provider, "codegraph");
  assert.equal(typeof freshnessPayload.graph_freshness.ready, "boolean");

  const impact = spawnSync(
    process.execPath,
    [`${layout.tools}/graph-impact.mjs`, "--changed-files", "src/api/auth.ts,src/auth/session.ts", "--json"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10000,
      maxBuffer: 2 * 1024 * 1024,
    },
  );
  assert.equal(
    impact.status,
    0,
    `graph-impact smoke failed\nSTDOUT:\n${impact.stdout ?? ""}\nSTDERR:\n${impact.stderr ?? ""}`,
  );
  const impactPayload = JSON.parse(impact.stdout);
  assert.deepEqual(impactPayload.graph_impact.changed_files, ["src/api/auth.ts", "src/auth/session.ts"]);
  assert.equal(Array.isArray(impactPayload.graph_impact.affected_tests), true);

  const wikiPlan = spawnSync(
    process.execPath,
    [`${layout.tools}/wiki-refresh-plan.mjs`, "--changed-files", "src/api/auth.ts,prisma/schema.prisma", "--json"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10000,
      maxBuffer: 2 * 1024 * 1024,
    },
  );
  assert.equal(
    wikiPlan.status,
    0,
    `wiki-refresh-plan smoke failed\nSTDOUT:\n${wikiPlan.stdout ?? ""}\nSTDERR:\n${wikiPlan.stderr ?? ""}`,
  );
  const wikiPayload = JSON.parse(wikiPlan.stdout);
  const targets = wikiPayload.wiki_refresh_plan.targets.map((target) => target.file);
  assert.ok(targets.includes("external-interfaces.md"));
  assert.ok(targets.includes("04-data-model.md"));
}

function testStageEvalFixturesCoverStages() {
  const fixturesPath = join(root, layout.skills, "sf-router/workflow/eval-fixtures.json");
  const payload = JSON.parse(readFileSync(fixturesPath, "utf8"));
  assert.equal(payload.version, 1);

  const stageDirs = skillStageOwners().map((entry) => entry.stage);
  const fixtures = payload.fixtures ?? [];
  const fixtureStages = fixtures.map((fixture) => fixture.stage).sort();
  assert.deepEqual(fixtureStages, stageDirs);

  const artifactIds = new Set();
  for (const file of readdirSync(join(root, layout.schemas)).filter((name) => name.endsWith(".json"))) {
    const schema = JSON.parse(readFileSync(join(root, layout.schemas, file), "utf8"));
    for (const artifact of schema.artifacts ?? []) artifactIds.add(artifact.id);
  }

  for (const fixture of fixtures) {
    assert.ok(fixture.pass?.given?.length > 0, `${fixture.stage} pass fixture must define given`);
    assert.ok(fixture.pass?.expect?.length > 0, `${fixture.stage} pass fixture must define expect`);
    assert.ok(fixture.pass?.assertions?.length > 0, `${fixture.stage} pass fixture must define assertions`);
    assert.ok(fixture.fail?.given?.length > 0, `${fixture.stage} fail fixture must define given`);
    assert.ok(fixture.fail?.expect_signal, `${fixture.stage} fail fixture must define expect_signal`);
    if (fixture.artifact_id !== null) {
      assert.ok(artifactIds.has(fixture.artifact_id), `${fixture.stage} references unknown artifact ${fixture.artifact_id}`);
    }
  }
}

function testStageScoreRubricCoversStages() {
  const rubricPath = join(root, layout.skills, "sf-router/workflow/score-rubric.json");
  const payload = JSON.parse(readFileSync(rubricPath, "utf8"));
  assert.equal(payload.version, 1);
  assert.ok(payload.dimensions.length >= 5);

  const dimensionIds = new Set(payload.dimensions.map((dimension) => dimension.id));
  for (const dimension of payload.dimensions) {
    assert.ok(dimension.description, `${dimension.id} must define description`);
    assert.ok(dimension.strong_signals.length > 0, `${dimension.id} must define strong_signals`);
    assert.ok(dimension.failure_signals.length > 0, `${dimension.id} must define failure_signals`);
  }

  const stageDirs = skillStageOwners().map((entry) => entry.stage);
  assert.deepEqual(Object.keys(payload.stage_focus).sort(), stageDirs);
  for (const [stage, focus] of Object.entries(payload.stage_focus)) {
    assert.ok(focus.length >= payload.minimum_focus_dimensions, `${stage} must have enough score focus dimensions`);
    for (const dimensionId of focus) {
      assert.ok(dimensionIds.has(dimensionId), `${stage} references unknown score dimension ${dimensionId}`);
    }
  }
}

function testPromptSkillDriftRules() {
  const rulesPath = join(root, layout.skills, "sf-router/workflow/drift-rules.json");
  const payload = JSON.parse(readFileSync(rulesPath, "utf8"));
  assert.equal(payload.version, 1);
  assert.ok(payload.gate_rules.length >= 4);
  assert.ok(payload.artifact_terms.length >= 8);

  const catalog = JSON.parse(readFileSync(join(root, layout.skills, "catalog.json"), "utf8"));
  const catalogSkills = new Map(catalog.skills.map((skill) => [skill.id, skill]));
  const owners = new Map(skillStageOwners().map((entry) => [entry.stage, entry]));

  for (const rule of payload.gate_rules) {
    assert.ok(rule.gate, "gate rule must define gate");
    assert.ok(rule.stage, `${rule.gate} must define stage`);
    assert.ok(rule.public_skill, `${rule.gate} must define public_skill`);
    assert.ok(rule.evidence, `${rule.gate} must define evidence`);
    assert.ok(rule.approved_command.includes(`gate.mjs ${rule.gate} APPROVED --evidence ${rule.evidence}`));

    const stageOwner = owners.get(rule.stage);
    assert.ok(stageOwner, `${rule.stage} must have a skill package owner`);
    const stageSkill = readFileSync(stageOwner.path, "utf8");
    const publicSkill = readFileSync(join(root, layout.skills, rule.public_skill, "SKILL.md"), "utf8");
    const packagedStage = join(root, layout.skills, rule.public_skill, "stages", rule.stage, "SKILL.md");
    assert.ok(stageSkill.includes(rule.gate), `${rule.stage} core skill must mention ${rule.gate}`);
    assert.ok(stageSkill.includes(rule.evidence), `${rule.stage} core skill must mention ${rule.evidence}`);
    assert.ok(readFileSync(packagedStage, "utf8").includes(rule.evidence), `${rule.public_skill} packaged stage must mention ${rule.evidence}`);
    assert.ok(publicSkill.includes(`.specforge/skills/${rule.public_skill}/stages/${rule.stage}/SKILL.md`));
    assert.ok(publicSkill.includes(rule.evidence), `${rule.public_skill} must mention ${rule.evidence}`);

    const catalogSkill = catalogSkills.get(rule.public_skill);
    assert.equal(catalogSkill.primary_stage, rule.stage);
    assert.ok(catalogSkill.core_stages.includes(rule.stage));
  }

  for (const term of payload.artifact_terms) {
    const catalogSkill = catalogSkills.get(term.public_skill);
    assert.equal(catalogSkill.primary_stage, term.stage);
    assert.ok(catalogSkill.core_stages.includes(term.stage));
  }
}

function testArtifactQualityProfiles() {
  const base = mkdtempSync("tmp-specforge-artifact-quality-");
  try {
    const workItem = {
      id: "20260613-feat-001-quality",
      path: base,
    };
    const diagnosis = {
      work_item: workItem,
      artifacts: [
        {
          id: "requirements",
          status: "ready",
          outputs: ["01-spec/requirements.md"],
        },
        {
          id: "tasks",
          status: "ready",
          outputs: ["01-spec/tasks.md"],
        },
      ],
    };

    writeFixture(
      `${base}/01-spec/requirements.md`,
      `# Requirements\n\n## 0.1 Spec Quality Gate\n\n## 边界\n\n## 影响面确认\n\n## 功能需求\n\n- [NEEDS CLARIFICATION: who is the user?]\n\n## 行为覆盖矩阵\n\n## 验收标准\n`,
    );
    writeFixture(
      `${base}/01-spec/tasks.md`,
      `# Tasks\n\n## 1. 规划输入\n\n## 2. 来源审计与覆盖矩阵\n\n## 4. 并行波次\n\n## 5. 任务列表\n\n- [ ] T001 [W0][实现] Do it.\n  _Trace:_ REQ\n  _Files:_ src/demo.ts\n\n## 6. 验证计划\n`,
    );

    const failing = artifactQualitySummary(diagnosis);
    assert.ok(failing.issues.some((issue) => issue.code === "open-requirements-decision"));
    assert.ok(failing.issues.some((issue) => issue.code === "requirements-no-real-req"));
    assert.ok(failing.issues.some((issue) => issue.code === "task-core-field-missing"));

    writeFixture(
      `${base}/01-spec/requirements.md`,
      `# Requirements\n\n## 0.1 Spec Quality Gate\n\n## 边界\n\n## 影响面确认\n\n## 功能需求\n\n| ID | 需求 | 来源 | 优先级 | 验收标准 |\n|---|---|---|---|---|\n| REQ-001 | WHEN user submits the form, THE SYSTEM SHALL save the request. | brief | MUST | AC-001 |\n\n## 行为覆盖矩阵\n\n| REQ | 正常路径 | 失败 / 空状态 | 边界值 | 权限差异 | 对应 AC |\n|---|---|---|---|---|---|\n| REQ-001 | save succeeds | save fails | empty title | same role | AC-001 |\n\n## 验收标准\n\n| ID | Given | When | Then | 验证方式 |\n|---|---|---|---|---|\n| AC-001 | valid request | submit | saved | automated test |\n`,
    );
    writeFixture(
      `${base}/01-spec/tasks.md`,
      `# Tasks\n\n## 1. 规划输入\n\n## 2. 来源审计与覆盖矩阵\n\n## 4. 并行波次\n\n## 5. 任务列表\n\n- [ ] T001 [W0][实现] Save request.\n  _Trace:_ REQ-001\n  _Files:_ src/demo.ts\n  _Verification:_ npm test -- save-request\n  _Rollback:_ revert src/demo.ts\n  _Risk:_ save regression\n\n## 6. 验证计划\n`,
    );

    const passing = artifactQualitySummary(diagnosis);
    const unexpectedFailures = passing.issues.filter((issue) => issue.severity === "FAIL");
    assert.equal(
      unexpectedFailures.length > 0,
      false,
      `Unexpected artifact quality failures:\n${JSON.stringify(unexpectedFailures, null, 2)}`,
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

function testTechnicalDesignContractQuality() {
  const base = mkdtempSync("tmp-specforge-tech-quality-");
  try {
    const diagnosis = {
      work_item: {
        id: "20260613-feat-002-tech-quality",
        path: base,
      },
      artifacts: [
        {
          id: "technical_design",
          status: "ready",
          outputs: ["01-spec/technical-design.md"],
        },
      ],
    };

    writeFixture(
      `${base}/01-spec/technical-design.md`,
      `# Technical Design\n\n## 0. 影响面与读取计划\n\n## 0.1 Design Quality Gate\n\n## 1. 技术选型与依赖确认\nCore Decision Review Status: confirmed\n\n## 3. Requirements Trace\n\n| Requirement | Design Response | Verification |\n|---|---|---|\n| REQ-001 | keep existing service | unit test |\n\n## 7. 总体架构与边界承诺\n\n## 16. 技术验证策略\n`,
    );

    const missingContracts = artifactQualitySummary(diagnosis);
    assert.ok(missingContracts.issues.some((issue) => issue.code === "technical-design-architecture-contract-empty"));
    assert.ok(missingContracts.issues.some((issue) => issue.code === "technical-design-implementation-handoff-empty"));
    assert.ok(missingContracts.issues.some((issue) => issue.code === "technical-design-operability-maintenance-empty"));

    writeFixture(
      `${base}/01-spec/technical-design.md`,
      `# Technical Design\n\n## 0. 影响面与读取计划\n\n## 0.1 Design Quality Gate\n\n## 1. 技术选型与依赖确认\nCore Decision Review Status: confirmed\n\n## 3. Requirements Trace\n\n| Requirement | Design Response | Verification |\n|---|---|---|\n| REQ-001 | keep existing service | unit test |\n\n## 7. 总体架构与边界承诺\n\n## 7.1 Architecture Contract\n| 维度 | 结论 | 证据 / N/A |\n|---|---|---|\n| Boundary | service layer only | src/service.ts |\n\n## Implementation Handoff\n| 项 | 内容 |\n|---|---|\n| Change slices | service update, unit test |\n| Rollback seam | revert service change |\n\n## 12. Operability & Maintenance\n| 项 | 设计 |\n|---|---|\n| Owner / owning module | orders service |\n| Revisit trigger | error rate rises after release |\n\n## 16. 技术验证策略\n`,
    );

    const passing = artifactQualitySummary(diagnosis);
    const unexpectedFailures = passing.issues.filter((issue) => issue.severity === "FAIL");
    assert.equal(
      unexpectedFailures.length > 0,
      false,
      `Unexpected technical design quality failures:\n${JSON.stringify(unexpectedFailures, null, 2)}`,
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

function testUiDesignContractQuality() {
  const base = mkdtempSync("tmp-specforge-ui-quality-");
  try {
    const diagnosis = {
      work_item: {
        id: "20260613-feat-003-ui-quality",
        path: base,
      },
      artifacts: [
        {
          id: "ui_design",
          status: "ready",
          outputs: ["01-spec/ui-design.md"],
        },
      ],
    };

    writeFixture(
      `${base}/01-spec/ui-design.md`,
      `# UI Design\n\n## Design Contract Summary\n\nDesign Contract JSON:\n\n\`\`\`json\n{\"design_mode\":\"Avatar-IP / Empty State\"}\n\`\`\`\n\n## 13. Visual QA Detectors\n| Detector | Result | Evidence | Fix / Accepted reason |\n| --- | --- | --- | --- |\n| Generic SaaS shell | issue | screenshot | |\n`,
    );

    const failing = artifactQualitySummary(diagnosis);
    assert.ok(failing.issues.some((issue) => issue.code === "design-contract-json-missing" || issue.code === "design-contract-invalid-design-mode"));
    assert.ok(failing.issues.some((issue) => issue.code === "ui-design-high-visual-qa-unresolved"));

    const contract = {
      scan_manifest: {
        profile: "product-page",
        workflow: ["creative_direction", "mode", "source", "font", "color", "composition", "advanced_interaction", "product_ui_signature", "component", "qa", "output"],
        scanned_files: [
          {
            path: "references/read-profiles.md",
            purpose: "控制面与读取路径裁剪",
            status: "scanned",
            finding: "Product UI 使用 creative direction + signature pattern，不展开全量参考库",
          },
          {
            path: "references/read-profiles.md#Full-System Orchestration",
            purpose: "设计流程编排",
            status: "scanned",
            finding: "使用完整 Design Scan Manifest",
          },
          {
            path: "references/read-profiles.md#Design Mode Routing",
            purpose: "模式路由",
            status: "scanned",
            finding: "Product UI",
          },
          {
            path: "references/design-composition.md",
            purpose: "组合配方",
            status: "scanned",
            finding: "system-cn-ui + product-compact + compact + product-border-first",
          },
          {
            path: "references/creative-direction.md",
            purpose: "创意方向",
            status: "scanned",
            finding: "先拒绝固定后台壳，再选择 split-panel evidence desk",
          },
          {
            path: "references/product-ui-signature-patterns.md",
            purpose: "Product UI signature",
            status: "scanned",
            finding: "采用 Object Inspector + Evidence Timeline 的混合工作台",
          },
        ],
        selected_data: {
          palette_id: "minimal-tech",
          font_source_id: "system-cn-ui",
          font_pairing_id: "system-productive-cn",
          type_scale_id: "product-compact",
          spacing_density_id: "compact",
          radius_shadow_recipe_id: "product-border-first",
          motion_recipe_id: "product-crisp",
          advanced_interaction_recipe_id: "none-product-ui",
        },
        selection_rationale: {
          palette: {
            id: "minimal-tech",
            why: "Neutral surfaces plus restrained blue/teal accents support dense operational scanning.",
            rejected: ["warm-editorial rejected because it weakens product-table hierarchy"],
            risk: "Changing the palette can reduce contrast and make status accents compete with actions.",
            confidence: "confirmed",
          },
          font_source: {
            id: "system-cn-ui",
            why: "System Chinese UI fonts keep text crisp in compact tables and avoid extra font loading.",
            rejected: ["display-serif rejected because it is unsuitable for high-frequency admin workflows"],
            risk: "Replacing the font source may change row height and table density.",
            confidence: "confirmed",
          },
          font_pairing: {
            id: "system-productive-cn",
            why: "Productive system pairing keeps headings restrained and body copy readable in Chinese and English.",
            rejected: ["marketing-display-pairing rejected because it over-emphasizes section titles"],
            risk: "A decorative pairing could create overflow in filters, tabs, and table cells.",
            confidence: "confirmed",
          },
          type_scale: {
            id: "product-compact",
            why: "Compact scale matches resource-management screens where comparison is more important than hero emphasis.",
            rejected: ["editorial-large-scale rejected because it reduces first-screen data density"],
            risk: "Larger scales can push filters and state evidence below the fold.",
            confidence: "confirmed",
          },
          spacing_density: {
            id: "compact",
            why: "Compact spacing keeps table, filters, and detail panel visible together.",
            rejected: ["comfortable-marketing-spacing rejected because it creates empty surface gaps"],
            risk: "Increasing spacing may turn the work surface into a sparse dashboard shell.",
            confidence: "confirmed",
          },
          radius_shadow: {
            id: "product-border-first",
            why: "Border-first surfaces separate dense regions without decorative card stacking.",
            rejected: ["premium-shadow-stack rejected because it risks card-soup layout"],
            risk: "Heavy shadows can make repeated panels look like floating cards.",
            confidence: "confirmed",
          },
          motion: {
            id: "product-crisp",
            why: "Small state changes support feedback without distracting from table review.",
            rejected: ["expressive-page-transitions rejected because they add motion noise"],
            risk: "Replacing motion with large transitions can slow repeated review workflows.",
            confidence: "confirmed",
          },
          advanced_interaction: {
            id: "none-product-ui",
            why: "The fixture validates a practical Product UI contract and does not need GSAP or 3D interaction.",
            rejected: ["threejs-signature rejected because the workflow is table-centric"],
            risk: "Adding advanced interaction would increase verification cost without improving the self-test contract.",
            confidence: "confirmed",
          },
        },
        skipped_with_reason: [
          {
            path: "reference_selection",
            reason: "no external reference requested",
          },
          {
            path: "references/reference-workflow.md#Live Evidence Protocol",
            reason: "自测 fixture 不访问外部网站，只验证本地 Product UI 合同完整性",
          },
          {
            path: "references/motion-block-library.md#Asset Brief Add-on",
            reason: "Product UI 自测不需要生成图片、3D、视频或纹理素材",
          },
          {
            path: "data/foundation-recipes.csv#advanced_interaction",
            reason: "Product UI 高频后台选择 none-product-ui，不使用 GSAP / Three.js signature",
          },
          {
            path: "references/motion-block-library.md",
            reason: "advanced_interaction_recipe_id 为 none-product-ui，不需要 interaction_signature",
          },
        ],
      },
      creative_direction: {
        selected: "split-panel evidence desk",
        why: "The Product UI centers on inspecting and resolving resource quality records, so the signature should be the relationship between table rows, detail evidence, and resolution actions rather than a generic dashboard shell.",
        alternatives: [
          {
            id: "command-cockpit",
            positioning: "Toolbar-led command center for fast bulk actions",
            fit: "Useful when operators mostly batch-edit records",
            risk: "May hide detailed evidence needed by the self-test fixture",
          },
          {
            id: "anomaly-board",
            positioning: "Grouped issue lanes with severity clustering",
            fit: "Useful when triage order matters more than row comparison",
            risk: "Can become a card board if records need dense table scanning",
          },
        ],
        rejected_defaults: ["fixed sidebar + KPI cards + generic data table", "hero-like admin dashboard header"],
        signature_carrier: "structure",
      },
      design_mode: "Product UI",
      aesthetic_direction: "极简科技风",
      human_confirmation: {
        required: false,
        reason: "Self-test uses a low-risk Product UI default to validate contract completeness.",
        options_presented: ["compact-product-ui-default"],
        selected: "compact-product-ui-default",
        status: "defaulted",
        default_reversibility: "Only the fixture contract is affected; no project IA, schema, permissions, or migration changes.",
      },
      signature: {
        type: "structural",
        description: "Dense split-panel workflow with status-first table hierarchy.",
      },
      color_system: {
        palette_id: "minimal-tech",
        aesthetic_direction: "极简科技风",
        design_mode: "Product UI",
        tokens: {
          background: "#F8FAFC",
          surface: "#FFFFFF",
          surface_muted: "#EEF4FF",
          text: "#0F172A",
          text_muted: "#64748B",
          primary: "#2563EB",
          secondary: "#DBEAFE",
          accent: "#14B8A6",
          border: "#CBD5E1",
          success: "#16A34A",
          warning: "#F59E0B",
          danger: "#DC2626",
          chart: ["#2563EB", "#14B8A6", "#7C3AED"],
        },
        usage_rules: {
          primary_usage: "主行动、当前状态和关键高亮；不铺满页面",
          accent_usage: "诊断链路、局部高亮和图表辅助",
          background_usage: "工作区保持 neutral surface",
          avoid: ["default enterprise blue template"],
        },
        accessibility: {
          requires_contrast_check: true,
          dark_mode_ready: false,
          contrast_checks: [
            {
              pair: "text_on_surface",
              ratio: "12.1",
              status: "pass",
            },
            {
              pair: "text_muted_on_surface",
              ratio: "4.8",
              status: "pass",
            },
          ],
        },
        source: "Tailwind Colors",
        source_url: "https://tailwindcss.com/docs/customizing-colors",
        license_note: "curated token mapping; verify source license before redistribution",
      },
      foundation_system: {
        source_basis: [
          {
            source: "Carbon productive type",
            adopt: "Product UI 紧凑层级",
            adapt: "映射到本地 system font 和中文行高",
            avoid: "复制 Carbon 视觉身份",
          },
          {
            source: "Fluent spacing / proximity",
            adopt: "用空间表达同组和层级",
            adapt: "映射到 4px / 8px grid",
            avoid: "所有 gap 一样",
          },
        ],
        typography: {
          font_family: "system-ui, PingFang SC, Microsoft YaHei, sans-serif",
          scale: "product-compact",
          line_height: "14px body / 22px line-height; table cells 13px / 20px",
          numeric: "tabular numbers for metrics and amounts",
          usage_rules: ["页面标题克制", "muted 文案不承载关键事实"],
        },
        spacing: {
          density: "compact",
          grid: "4px / 8px",
          page_padding: "24px",
          section_gap: "16px",
          component_gap: "12px",
          usage_rules: ["首屏必须有 primary work surface", "表格行高 40px"],
        },
        radius_shadow: {
          radius_scale: "control 6px / panel 8px / overlay 10px",
          surface_treatment: "border-first neutral surfaces",
          overlay_shadow: "0 16px 40px rgba(15, 23, 42, 0.14)",
          usage_rules: ["页面卡片不使用重阴影", "浮层阴影统一"],
        },
        motion: {
          motion_personality: "product-crisp",
          css_tokens: ["--duration-fast", "--duration-base", "--duration-moderate", "--ease-standard"],
          gsap_signature: "N/A for high-frequency table workflow",
          reduced_motion: "keep state changes, remove travel",
        },
      },
      token_source: "existing",
      token_delivery_hint: {
        css_variables: ["--sf-bg", "--sf-surface", "--sf-text", "--sf-primary", "--sf-radius-panel", "--sf-duration-fast"],
        tailwind_mapping: {
          "colors.background": "var(--sf-bg)",
          "colors.surface": "var(--sf-surface)",
          "colors.primary": "var(--sf-primary)",
          "borderRadius.panel": "var(--sf-radius-panel)",
        },
        pencil_variables: ["color.background", "color.surface", "color.text", "color.primary", "radius.panel", "motion.fast"],
        notes: "Design-system token output is a hint; final CSS, Tailwind, and Pencil delivery remains owned by sf-tech-design.",
      },
      component_strategy: "primitive + wrapper",
      shadcn_vue: {
        primitive_layer: ["Table", "Button"],
        project_wrapper_layer: ["ResourceTable"],
      },
      layout: {
        navigation_decision: "left navigation plus compact toolbar filters",
        layout_archetype: "Object Inspector + Evidence Timeline",
        primary_work_surface: "resource table with split detail panel and inline status controls",
        scroll_regions: ["main table scroll", "right evidence panel scroll"],
        responsive_strategy: "desktop keeps table and inspector side by side; narrow viewport stacks filters, table, then evidence drawer",
      },
      state_matrix: {
        required_states: ["default", "loading", "empty", "error", "permission", "success"],
        owner: "sf-ui-design",
      },
      product_ui_quality: {
        primary_user: "operations reviewer",
        primary_object: "resource quality record",
        primary_job: "scan, filter, inspect, and resolve resource quality issues",
        kpi_actionability: "pass",
        content_budget: "pass",
        right_rail_purpose: "shows evidence, decision history, and next action for the selected record",
        rejected_filler: ["decorative KPI wallpaper", "empty marketing hero", "nested card dashboard shell"],
      },
      motion: {
        layer_1_css: ["button active"],
        layer_2_motion_vue: [],
        layer_3_gsap: [],
        reduced_motion: "remove travel / keep opacity",
      },
      visual_qa: [
        {
          detector: "Generic SaaS shell",
          result: "ok",
          severity: "high",
          evidence: {
            artifact: "ui-design self-test fixture",
            viewport: "desktop 1440px",
            region: "primary work surface",
          },
          fix: "not present after self-test review",
          status: "fixed",
          owner: "sf-ui-design",
        },
        {
          detector: "Card soup",
          result: "ok",
          severity: "high",
          evidence: {
            artifact: "ui-design self-test fixture",
            viewport: "desktop 1440px",
            region: "content panels",
          },
          fix: "not present after self-test review",
          status: "fixed",
          owner: "sf-ui-design",
        },
        {
          detector: "Fake premium gradient",
          result: "ok",
          severity: "high",
          evidence: {
            artifact: "ui-design self-test fixture",
            viewport: "desktop 1440px",
            region: "surface tokens",
          },
          fix: "not present after self-test review",
          status: "fixed",
          owner: "sf-ui-design",
        },
        {
          detector: "Motion noise",
          result: "ok",
          severity: "high",
          evidence: {
            artifact: "ui-design self-test fixture",
            viewport: "desktop 1440px",
            region: "interaction states",
          },
          fix: "not present after self-test review",
          status: "fixed",
          owner: "sf-ui-design",
        },
        {
          detector: "State missing",
          result: "ok",
          severity: "high",
          evidence: {
            artifact: "ui-design self-test fixture",
            viewport: "desktop 1440px",
            region: "state matrix",
          },
          fix: "not present after self-test review",
          status: "fixed",
          owner: "sf-ui-design",
        },
      ],
      verification_hooks: ["screenshot default/loading/empty/error/permission states"],
      anti_slop_rules: ["no card soup", "no fake premium gradient"],
    };

    writeFixture(
      `${base}/01-spec/ui-design.md`,
      `# UI Design\n\n## Design Contract Summary\n\nDesign Contract JSON:\n\n\`\`\`json\n${JSON.stringify(contract, null, 2)}\n\`\`\`\n\n## 13. Visual QA Detectors\n| Detector | Result | Evidence | Fix / Accepted reason |\n| --- | --- | --- | --- |\n| Generic SaaS shell | ok | screenshot | not present |\n| Card soup | ok | screenshot | not present |\n| Fake premium gradient | ok | screenshot | not present |\n| Motion noise | ok | motion review | not present |\n| State missing | ok | state matrix | all required states covered |\n`,
    );

    const passing = artifactQualitySummary(diagnosis);
    const unexpectedFailures = passing.issues.filter((issue) => issue.severity === "FAIL");
    assert.equal(
      unexpectedFailures.length > 0,
      false,
      `Unexpected UI design quality failures:\n${JSON.stringify(unexpectedFailures, null, 2)}`,
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

function testProjectInitDoctorSmoke() {
  if (layout.kind !== "source") return;

  const target = mkdtempSync(join(tmpdir(), "specforge-init-smoke-"));
  try {
    const result = spawnSync(process.execPath, ["cli/specforge.mjs", "init", "--dir", target], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
    assert.equal(
      result.status,
      0,
      `specforge init smoke failed\nERROR: ${result.error?.message ?? "none"}\nSIGNAL: ${result.signal ?? "none"}\nSTDOUT:\n${result.stdout ?? ""}\nSTDERR:\n${result.stderr ?? ""}`,
    );
    assert.equal(existsSync(join(target, ".specforge/core/scripts/doctor.mjs")), true);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
}

function testProjectUpgradePreservesProjectFacts() {
  if (layout.kind !== "source") return;

  const target = mkdtempSync(join(tmpdir(), "specforge-upgrade-smoke-"));
  try {
    const init = spawnSync(process.execPath, ["cli/specforge.mjs", "init", "--dir", target], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
    assert.equal(init.status, 0, `specforge init for upgrade smoke failed\n${init.stderr ?? ""}`);

    const registry = "active:\n  - id: keep-me\n    title: Keep\n    type: FEATURE\n    status: INTAKE\n    path: .specforge/work/active/keep-me\nblocked: []\narchive: []\n";
    const wiki = "---\ntitle: Custom Wiki\nkind: index\nowner: Team\nlast_updated: 2026-06-22\nsource_work: human\nstatus: current\n---\n\n# Custom Wiki\n";
    const project = "name: custom-project\nprofile: custom\n";
    const agents = "# Custom Agents\n\nKeep local instructions.\n";

    writeFixture(`${target}/.specforge/registry.yaml`, registry);
    writeFixture(`${target}/.specforge/wiki/00-index.md`, wiki);
    writeFixture(`${target}/.specforge/project.yaml`, project);
    writeFixture(`${target}/.specforge/AGENTS.md`, agents);
    writeFixture(`${target}/.specforge/core/scripts/doctor.mjs`, "#!/usr/bin/env node\nthrow new Error('old runtime');\n");

    const dryRun = spawnSync(process.execPath, ["cli/specforge.mjs", "upgrade", "--dir", target, "--dry-run", "--json"], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
    assert.equal(dryRun.status, 0, `specforge upgrade dry-run failed\n${dryRun.stderr ?? ""}`);
    assert.equal(readFileSync(`${target}/.specforge/core/scripts/doctor.mjs`, "utf8").includes("old runtime"), true);

    const upgrade = spawnSync(process.execPath, ["cli/specforge.mjs", "upgrade", "--dir", target, "--skip-doctor"], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
    assert.equal(
      upgrade.status,
      0,
      `specforge upgrade smoke failed\nERROR: ${upgrade.error?.message ?? "none"}\nSTDOUT:\n${upgrade.stdout ?? ""}\nSTDERR:\n${upgrade.stderr ?? ""}`,
    );

    assert.equal(readFileSync(`${target}/.specforge/registry.yaml`, "utf8"), registry);
    assert.equal(readFileSync(`${target}/.specforge/wiki/00-index.md`, "utf8"), wiki);
    assert.equal(readFileSync(`${target}/.specforge/project.yaml`, "utf8"), project);
    assert.equal(readFileSync(`${target}/.specforge/AGENTS.md`, "utf8"), agents);
    assert.equal(readFileSync(`${target}/.specforge/core/scripts/doctor.mjs`, "utf8").includes("old runtime"), false);
    assert.equal(existsSync(`${target}/.specforge/core/scripts/upgrade-runtime.mjs`), true);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
}

testRegistrySingleActiveRemoval();
testRegistryKeepsOtherActiveEntries();
testArchiveAppend();
testQualityPolicyValidation();
testWikiQualityGraphFactReferences();
testWikiQualityStrictModesBlockBootstrap();
testWikiUpdatePlanBlocksNaForVerifiedWork();
testCodebaseMapClassifiesDataCandidates();
testWikiQualityBlocksUntrustedSqlInCurrentEntities();
testWikiHydrateCliSmoke();
testCodeIntelligenceCliSmoke();
testStageEvalFixturesCoverStages();
testStageScoreRubricCoversStages();
testPromptSkillDriftRules();
testArtifactQualityProfiles();
testTechnicalDesignContractQuality();
testUiDesignContractQuality();
testProjectInitDoctorSmoke();
testProjectUpgradePreservesProjectFacts();

console.log("SpecForge self-test passed.");
