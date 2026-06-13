import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  appendArchiveRegistryEntry,
  makeArchiveRegistryEntry,
  normalizeEmptyActive,
  parseRegistryEntries,
  removeRegistryEntry,
  root,
  validateSchema,
} from "../../lib/specforge.mjs";
import { artifactQualitySummary } from "../../lib/artifact-quality.mjs";
import { wikiQualitySummary } from "../../lib/wiki-quality.mjs";

function writeFixture(path, content) {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function skillStageOwners() {
  const skillsRoot = join(root, "skills");
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

function testStageEvalFixturesCoverStages() {
  const fixturesPath = join(root, "skills/sf-router/workflow/eval-fixtures.json");
  const payload = JSON.parse(readFileSync(fixturesPath, "utf8"));
  assert.equal(payload.version, 1);

  const stageDirs = skillStageOwners().map((entry) => entry.stage);
  const fixtures = payload.fixtures ?? [];
  const fixtureStages = fixtures.map((fixture) => fixture.stage).sort();
  assert.deepEqual(fixtureStages, stageDirs);

  const artifactIds = new Set();
  for (const file of readdirSync(join(root, "core/artifacts/schemas")).filter((name) => name.endsWith(".json"))) {
    const schema = JSON.parse(readFileSync(join(root, "core/artifacts/schemas", file), "utf8"));
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
  const rubricPath = join(root, "skills/sf-router/workflow/score-rubric.json");
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
  const rulesPath = join(root, "skills/sf-router/workflow/drift-rules.json");
  const payload = JSON.parse(readFileSync(rulesPath, "utf8"));
  assert.equal(payload.version, 1);
  assert.ok(payload.gate_rules.length >= 4);
  assert.ok(payload.artifact_terms.length >= 8);

  const catalog = JSON.parse(readFileSync(join(root, "skills/catalog.json"), "utf8"));
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
    const publicSkill = readFileSync(join(root, "skills", rule.public_skill, "SKILL.md"), "utf8");
    const packagedStage = join(root, "skills", rule.public_skill, "stages", rule.stage, "SKILL.md");
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
    assert.equal(passing.issues.some((issue) => issue.severity === "FAIL"), false);
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
    assert.equal(passing.issues.some((issue) => issue.severity === "FAIL"), false);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

testRegistrySingleActiveRemoval();
testRegistryKeepsOtherActiveEntries();
testArchiveAppend();
testQualityPolicyValidation();
testWikiQualityGraphFactReferences();
testStageEvalFixturesCoverStages();
testStageScoreRubricCoversStages();
testPromptSkillDriftRules();
testArtifactQualityProfiles();
testTechnicalDesignContractQuality();

console.log("SpecForge self-test passed.");
