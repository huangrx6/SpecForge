import { spawnSync } from "node:child_process";
import { isAbsolute, join } from "node:path";
import { abs, exists, gateStatus, layout, readText, resolveWorkItem } from "./specforge.mjs";

const PLACEHOLDER_PATTERN = /(暂无|未确认|TBD|TODO|待补充)/gi;
const WIKI_TARGETS = {
  overview: "01-project-overview.md",
  product_rules: "02-product-rules.md",
  architecture: "03-architecture.md",
  data_model: "04-data-model.md",
  operations: "05-operations.md",
  external_interfaces: "external-interfaces.md",
  config_env: "config-env.md",
  security_auth: "security-auth.md",
  jobs_events: "jobs-events.md",
  design_system: "design-system.md",
  risks: "08-risks.md",
  api: "api-<domain>.md",
  module: "module-<name>.md",
};

function readIfExists(path) {
  if (!path) return "";
  return exists(path) ? readText(path) : "";
}

function countPlaceholders(text) {
  return [...String(text ?? "").matchAll(PLACEHOLDER_PATTERN)].length;
}

function lineCount(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .filter((line) => line.trim()).length;
}

function firstNonEmptyLines(text, limit = 12) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("---"))
    .slice(0, limit);
}

function safeJsonSummary(text) {
  const match = String(text ?? "").match(/## 9\. 原始 JSON 摘要[\s\S]*?```json\r?\n([\s\S]*?)\r?\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

export function codebaseIntelligenceSummary(path) {
  const text = readIfExists(path);
  if (!text) return null;
  return safeJsonSummary(text);
}

function tryResolveWorkItem(options = {}) {
  if (options.workItemBase) {
    return {
      name: options.workItem ?? options.workItemBase.split("/").filter(Boolean).at(-1) ?? "unknown",
      base: options.workItemBase,
      lifecycle: options.lifecycle ?? "active",
    };
  }
  try {
    return resolveWorkItem({
      workItem: options.workItem,
      activeOnly: false,
      defaultToLatestArchive: true,
    });
  } catch {
    return null;
  }
}

function artifactPath(workItem, relativePath) {
  return workItem ? `${workItem.base}/${relativePath}` : "";
}

function loadArtifacts(workItem) {
  const paths = {
    brief: "00-intake/brief.md",
    prd: "00-intake/prd.md",
    requirements: "01-spec/requirements.md",
    ui_design: "01-spec/ui-design.md",
    technical_design: "01-spec/technical-design.md",
    implementation_report: "03-implementation/report.md",
    changed_files: "03-implementation/changed-files.md",
    code_review: "04-code-review/code-review-v1.md",
    verification_report: "05-verification/report.md",
    wiki_sync: "06-close/wiki-sync.md",
    codebase_intelligence: "00-steering/codebase-intelligence.md",
  };
  return Object.fromEntries(
    Object.entries(paths).map(([key, path]) => [
      key,
      {
        path: artifactPath(workItem, path),
        text: readIfExists(artifactPath(workItem, path)),
      },
    ]),
  );
}

function currentGitChangedFiles() {
  const result = spawnSync("git", ["diff", "--name-only", "HEAD"], {
    cwd: abs(""),
    encoding: "utf8",
    timeout: 3000,
  });
  if (result.status !== 0) return [];
  return result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function changedFilesFromArtifact(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .flatMap((line) => {
      const backtick = [...line.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
      if (backtick.length > 0) return backtick;
      const bullet = line.match(/^[-*]\s+(.+)$/)?.[1];
      return bullet && /[./]/.test(bullet) ? [bullet.split(/\s+/)[0]] : [];
    })
    .map((file) => file.replace(/^["']|["']$/g, ""))
    .filter((file) => file && !file.includes(" "));
}

function detectWikiState(wikiRoot) {
  const files = [
    "00-index.md",
    "01-project-overview.md",
    "02-product-rules.md",
    "03-architecture.md",
    "04-data-model.md",
    "05-operations.md",
    "08-risks.md",
  ];
  const existing = files.filter((file) => exists(`${wikiRoot}/${file}`));
  if (existing.length === 0) return { status: "missing", files: existing, placeholders: 0, thin_files: files };

  let placeholders = 0;
  const thinFiles = [];
  for (const file of existing) {
    const text = readText(`${wikiRoot}/${file}`);
    placeholders += countPlaceholders(text);
    if (lineCount(text) < 14) thinFiles.push(file);
  }

  const critical = ["00-index.md", "01-project-overview.md", "03-architecture.md"];
  const criticalPlaceholder = critical.some((file) => exists(`${wikiRoot}/${file}`) && countPlaceholders(readText(`${wikiRoot}/${file}`)) >= 1);
  const status = placeholders >= 6 || criticalPlaceholder ? "bootstrap" : thinFiles.length >= 3 ? "partial" : "current";
  return { status, files: existing, placeholders, thin_files: thinFiles };
}

function hasApprovedVerification(workItem, artifacts) {
  if (!workItem || !exists(`${workItem.base}/work.yaml`)) return false;
  const yaml = readText(`${workItem.base}/work.yaml`);
  return gateStatus(yaml, "verification") === "APPROVED" || /verification\s+approved|验证通过|APPROVED/i.test(artifacts.verification_report.text);
}

function candidate(id, target, confidence, evidence, reason, sourcePath) {
  return {
    id,
    target,
    confidence,
    evidence,
    reason,
    source: sourcePath,
  };
}

function pathSuggests(patterns, files) {
  return files.some((file) => patterns.some((pattern) => pattern.test(file)));
}

function hasGroupedData(wikiSeed, groups) {
  const source = wikiSeed?.data_model?.groups ?? {};
  return groups.some((group) => Array.isArray(source[group]) && source[group].length > 0);
}

function extractCandidates(artifacts, changedFiles, wikiSeed = null) {
  const candidates = [];
  const allProduct = `${artifacts.brief.text}\n${artifacts.prd.text}\n${artifacts.requirements.text}`;
  const allTech = `${artifacts.technical_design.text}\n${artifacts.implementation_report.text}`;
  const allOps = `${allTech}\n${artifacts.verification_report.text}`;

  if (allProduct.trim()) {
    candidates.push(candidate(
      "product-overview",
      WIKI_TARGETS.overview,
      "likely",
      "brief / prd / requirements",
      "产品目标、用户或需求边界会被后续 work item 复用。",
      artifacts.requirements.text ? artifacts.requirements.path : artifacts.prd.path || artifacts.brief.path,
    ));
  }

  if (/REQ-|AC-|角色|权限|审批|状态|流程|规则|边界|out of scope|不在范围/i.test(allProduct)) {
    candidates.push(candidate(
      "product-rules",
      WIKI_TARGETS.product_rules,
      "likely",
      "requirements / prd",
      "需求中包含长期产品规则、角色权限、状态机或范围边界。",
      artifacts.requirements.path || artifacts.prd.path,
    ));
  }

  if (allTech.trim() || pathSuggests([/src\//, /app\//, /server\//, /core\//, /skills\//, /lib\//], changedFiles)) {
    candidates.push(candidate(
      "architecture",
      WIKI_TARGETS.architecture,
      "confirmed",
      "technical design / implementation / changed files",
      "实现或技术设计改变了模块、边界、入口或关键链路。",
      artifacts.technical_design.path || artifacts.implementation_report.path,
    ));
  }

  if (/API|route|controller|endpoint|webhook|SDK|GraphQL|gRPC|RPC|CLI|public export|导入|导出|接口|集成/i.test(allTech) || pathSuggests([/api/i, /route/i, /controller/i, /webhook/i, /graphql/i, /grpc/i, /sdk/i, /cli/i], changedFiles) || (wikiSeed?.architecture?.api_candidates ?? []).length > 0) {
    candidates.push(candidate(
      "external-interfaces",
      WIKI_TARGETS.external_interfaces,
      "likely",
      "technical design / changed files",
      "出现 API、Webhook、CLI、SDK、文件导入导出或第三方集成接口变化。",
      artifacts.technical_design.path || artifacts.changed_files.path,
    ));
  }

  if (/schema|model|migration|database|table|prisma|typeorm|sql|数据/i.test(allTech) || pathSuggests([/migration/i, /schema/i, /model/i, /prisma/i, /sql/i, /db/i], changedFiles) || hasGroupedData(wikiSeed, ["schema_authorities", "active_models", "repositories", "migration_artifacts", "seed_or_init", "legacy_sql_candidates", "untrusted_sql"])) {
    candidates.push(candidate(
      "data-model",
      WIKI_TARGETS.data_model,
      "likely",
      "technical design / changed files",
      "出现实体、表、迁移、索引、生命周期或数据读写变化。",
      artifacts.technical_design.path || artifacts.changed_files.path,
    ));
  }

  if (/legacy sql|old ddl|backup sql|dump|历史 SQL|旧 DDL|备份脚本/i.test(allTech) || hasGroupedData(wikiSeed, ["legacy_sql_candidates", "untrusted_sql"])) {
    candidates.push(candidate(
      "untrusted-sql",
      WIKI_TARGETS.data_model,
      "likely",
      "codebase-intelligence data_candidate_groups",
      "发现历史 / 未受信 SQL 候选；只能进入“历史 / 未受信 SQL 产物”或风险记录，不能写成当前数据事实。",
      artifacts.codebase_intelligence.path || artifacts.technical_design.path,
    ));
  }

  if (/env|config|deploy|build|test|ci|rollback|observability|log|metric|runbook|启动|部署|回滚|监控|验证/i.test(allOps) || pathSuggests([/package\.json$/, /Dockerfile/i, /compose/i, /ci/i, /workflow/i, /config/i, /\.env/i], changedFiles) || (wikiSeed?.operations?.candidates ?? []).length > 0 || (wikiSeed?.operations?.test_candidates ?? []).length > 0) {
    candidates.push(candidate(
      "operations",
      WIKI_TARGETS.operations,
      "likely",
      "technical design / implementation / verification / changed files",
      "出现运行、配置、验证、部署、观测或回滚事实。",
      artifacts.technical_design.path || artifacts.verification_report.path || artifacts.changed_files.path,
    ));
  }

  if (/env|secret|config|feature flag|配置|环境变量|密钥|开关/i.test(allOps) || pathSuggests([/\.env/i, /config/i, /secret/i, /feature/i, /flag/i], changedFiles)) {
    candidates.push(candidate(
      "config-env",
      WIKI_TARGETS.config_env,
      "likely",
      "technical design / changed files",
      "出现配置、环境变量、secret 或 feature flag 长期事实。",
      artifacts.technical_design.path || artifacts.changed_files.path,
    ));
  }

  if (/auth|permission|role|policy|security|token|session|PII|敏感|认证|授权|权限|安全/i.test(`${allProduct}\n${allTech}`) || pathSuggests([/auth/i, /permission/i, /policy/i, /security/i, /session/i, /token/i], changedFiles)) {
    candidates.push(candidate(
      "security-auth",
      WIKI_TARGETS.security_auth,
      "likely",
      "requirements / technical design / changed files",
      "出现认证、授权、权限、敏感数据或安全边界长期事实。",
      artifacts.technical_design.path || artifacts.requirements.path || artifacts.changed_files.path,
    ));
  }

  if (/job|queue|event|cron|scheduler|worker|message|topic|DLQ|retry|任务|队列|事件|定时/i.test(allTech) || pathSuggests([/job/i, /queue/i, /event/i, /cron/i, /scheduler/i, /worker/i, /message/i], changedFiles)) {
    candidates.push(candidate(
      "jobs-events",
      WIKI_TARGETS.jobs_events,
      "likely",
      "technical design / changed files",
      "出现后台任务、队列、事件、定时任务或消息契约长期事实。",
      artifacts.technical_design.path || artifacts.changed_files.path,
    ));
  }

  if (/Design Contract|design_mode|palette|token|component|UI|视觉|交互|动效/i.test(artifacts.ui_design.text)) {
    candidates.push(candidate(
      "design-system",
      WIKI_TARGETS.design_system,
      "likely",
      "ui-design",
      "UI 设计产物包含可复用设计模式、token、组件契约或视觉约束。",
      artifacts.ui_design.path,
    ));
  }

  if (/risk|debt|follow-up|pending|unknown|REQUEST_CHANGES|风险|技术债|未决|未知|后续/i.test(`${allTech}\n${artifacts.code_review.text}\n${artifacts.verification_report.text}`)) {
    candidates.push(candidate(
      "risks",
      WIKI_TARGETS.risks,
      "likely",
      "technical design / code review / verification",
      "存在后续 work item 需要知道的风险、债务、缺口或复查触发条件。",
      artifacts.code_review.path || artifacts.verification_report.path || artifacts.technical_design.path,
    ));
  }

  const seedTargets = wikiSeed?.suggested_files ?? wikiSeed?.wiki_targets ?? [];
  for (const target of Array.isArray(seedTargets) ? seedTargets : []) {
    const targetPath = typeof target === "string" ? target : target.path ?? target.file;
    if (!targetPath) continue;
    candidates.push(candidate(
      `steering-${targetPath}`,
      targetPath.replace(/^\.specforge\/wiki\//, ""),
      "confirmed",
      "codebase-intelligence wiki_seed",
      "steering 扫描已给出可回写 wiki 目标。",
      artifacts.codebase_intelligence.path,
    ));
  }

  return candidates;
}

function requiredTargets(candidates, wikiState, verificationApproved) {
  const targets = new Map();
  for (const item of candidates) {
    if (!item.target || item.target.includes("<")) continue;
    targets.set(item.target, {
      file: item.target,
      reason: item.reason,
      candidate: item.id,
      confidence: item.confidence,
    });
  }

  if ((wikiState.status === "missing" || wikiState.status === "bootstrap") && verificationApproved) {
    for (const file of [WIKI_TARGETS.overview, WIKI_TARGETS.architecture, WIKI_TARGETS.operations]) {
      if (!targets.has(file)) {
        targets.set(file, {
          file,
          reason: "首个已验证 work item 不能让核心 wiki 继续停留在 bootstrap 空壳。",
          candidate: "verified-work-bootstrap-hydration",
          confidence: "confirmed",
        });
      }
    }
  }

  return [...targets.values()].sort((a, b) => a.file.localeCompare(b.file));
}

function blockingGaps(targets, wikiRoot) {
  return targets
    .filter((target) => {
      const path = `${wikiRoot}/${target.file}`;
      if (!exists(path)) return true;
      const text = readText(path);
      return countPlaceholders(text) >= 2 || lineCount(text) < 14;
    })
    .map((target) => ({
      target: target.file,
      reason: exists(`${wikiRoot}/${target.file}`)
        ? "目标 wiki 仍是 placeholder 或内容过薄，需要 hydrate / update。"
        : "目标 wiki 文件不存在，需要创建或由 sync-wiki bootstrap 后 hydrate。",
    }));
}

export function wikiUpdatePlan(options = {}) {
  const wikiRoot = options.wikiRoot ?? `${layout.workspace}/wiki`;
  const workItem = tryResolveWorkItem(options);
  const artifacts = loadArtifacts(workItem);
  const changedFiles = [
    ...changedFilesFromArtifact(artifacts.changed_files.text),
    ...currentGitChangedFiles(),
  ].filter((item, index, list) => list.indexOf(item) === index);
  const intelligenceSummary = safeJsonSummary(artifacts.codebase_intelligence.text);
  const wikiSeed = intelligenceSummary?.wiki_seed ?? null;
  const wikiState = detectWikiState(wikiRoot);
  const verificationApproved = hasApprovedVerification(workItem, artifacts);
  const candidates = extractCandidates(artifacts, changedFiles, wikiSeed);
  const targets = requiredTargets(candidates, wikiState, verificationApproved);
  const gaps = blockingGaps(targets, wikiRoot);
  const existingWikiSync = artifacts.wiki_sync.text;
  const wroteNa = /N\/A|无长期事实|不回写|无需回写/i.test(existingWikiSync);

  return {
    work_item: workItem
      ? {
          id: workItem.name,
          path: workItem.base,
          lifecycle: workItem.lifecycle,
          verification_approved: verificationApproved,
        }
      : null,
    wiki_state: wikiState,
    changed_files: changedFiles,
    long_term_fact_candidates: candidates,
    required_targets: targets,
    can_write_na: targets.length === 0,
    blocking_gaps: gaps,
    existing_wiki_sync_na_conflict: wroteNa && targets.length > 0,
  };
}

export function readPackageScripts() {
  const packagePath = "package.json";
  if (!exists(packagePath)) return [];
  try {
    const payload = JSON.parse(readText(packagePath));
    return Object.keys(payload.scripts ?? {}).sort();
  } catch {
    return [];
  }
}

export function wikiPathForRoot(wikiRoot, file) {
  return isAbsolute(wikiRoot) ? join(wikiRoot, file) : `${wikiRoot}/${file}`;
}

export function relativeWikiPath(file) {
  return `.specforge/wiki/${file}`;
}
