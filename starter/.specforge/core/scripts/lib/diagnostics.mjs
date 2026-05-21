import {
  computeArtifactStates,
  componentEnabled,
  effectiveSchema,
  exists,
  gateEvidence,
  gateStatus,
  layout,
  listWorkItems,
  loadSchema,
  nextReadyArtifact,
  parseComponents,
  parseField,
  readText,
  resolveWorkItem,
} from "./specforge.mjs";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const routeByArtifact = {
  intake: "sf-intake",
  gap_report: "sf-discovery",
  research: "sf-discovery",
  requirements: "sf-requirements",
  ui_design: "sf-ui-design",
  technical_design: "sf-tech-design",
  tasks: "sf-tasking",
  spec_review: "sf-spec-review",
  implementation: "sf-implement",
  code_review: "sf-code-review",
  verification: "sf-verify",
  wiki_sync: "sf-wiki",
  closure: "sf-close",
};

const gateReturnRoute = {
  spec_review: "sf-spec-review",
  code_review: "sf-implement",
  verification: "sf-verify",
  wiki_sync: "sf-wiki",
};

const sourceExtensions = new Set([
  ".c",
  ".cc",
  ".cjs",
  ".cpp",
  ".cs",
  ".dart",
  ".ex",
  ".exs",
  ".go",
  ".java",
  ".js",
  ".jsx",
  ".kt",
  ".mjs",
  ".php",
  ".py",
  ".rb",
  ".rs",
  ".scala",
  ".swift",
  ".ts",
  ".tsx",
  ".vue",
]);

const ignoredCodeDirs = new Set([
  ".git",
  ".specforge",
  ".claude",
  ".next",
  ".nuxt",
  ".venv",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "target",
]);

function safeRead(relativePath) {
  return exists(relativePath) ? readText(relativePath) : "";
}

function wikiBaselineMissing() {
  const overview = safeRead(`${layout.workspace}/wiki/project-overview.md`);
  const architecture = safeRead(`${layout.workspace}/wiki/architecture.md`);
  return /暂无/.test(overview) || /暂无/.test(architecture) || !overview || !architecture;
}

function repositoryHasSourceCode(limit = 3000) {
  if (layout.kind !== "project") return false;
  let scanned = 0;

  function walk(relativeDirectory) {
    if (scanned >= limit) return false;
    let entries = [];
    try {
      entries = readdirSync(join(process.cwd(), relativeDirectory), { withFileTypes: true });
    } catch {
      return false;
    }

    for (const entry of entries) {
      if (ignoredCodeDirs.has(entry.name)) continue;
      const relativePath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (walk(relativePath)) return true;
        continue;
      }
      if (!entry.isFile()) continue;
      scanned += 1;
      const dotIndex = entry.name.lastIndexOf(".");
      const ext = dotIndex === -1 ? "" : entry.name.slice(dotIndex).toLowerCase();
      if (sourceExtensions.has(ext) && statSync(join(process.cwd(), relativePath)).size > 0) return true;
    }
    return false;
  }

  return walk("");
}

function prdRequired(workItemBase) {
  const brief = safeRead(`${workItemBase}/00-intake/brief.md`);
  if (!brief) return false;
  return brief.split(/\r?\n/).some((line) => {
    const normalized = line.toLowerCase();
    return (
      /prd\s+required\s*:\s*(yes|true|required)/i.test(line) ||
      /\|\s*prd\s+required\s*\|\s*(yes|true|required)\s*\|/i.test(normalized)
    );
  });
}

function prdReady(workItemBase) {
  const prdPath = `${workItemBase}/00-intake/prd.md`;
  if (!exists(prdPath)) return false;
  const prd = readText(prdPath);
  if (/\[NEEDS PRODUCT DECISION\]/i.test(prd)) return false;
  const decision = prd.match(/^Decision Status:\s*(.+)$/im)?.[1]?.trim();
  return !decision || decision === "approved-for-requirements";
}

function technicalUnknownRows(workItemBase) {
  const designPath = `${workItemBase}/01-spec/technical-design.md`;
  if (!exists(designPath)) return [];
  return readText(designPath)
    .split(/\r?\n/)
    .filter((line) => /^\|/.test(line) && /\|\s*unknown\s*\|/i.test(line))
    .filter((line) => !/yes\s*\/\s*no\s*\/\s*unknown/i.test(line));
}

function technicalNeedsDecision(workItemBase) {
  const designPath = `${workItemBase}/01-spec/technical-design.md`;
  return exists(designPath) && /\[NEEDS (TECH|DEPENDENCY|TOOLING) DECISION\]/i.test(readText(designPath));
}

function technicalCoreReviewUnconfirmed(workItemBase) {
  const designPath = `${workItemBase}/01-spec/technical-design.md`;
  if (!exists(designPath)) return false;
  const design = readText(designPath);
  if (/\[TECH DESIGN REVIEW CONFIRMED\]/i.test(design)) return false;
  const status = design.match(/^Core Decision Review Status:\s*(.+)$/im)?.[1]?.trim();
  if (/^(confirmed|delegated_default|not_required|n\/a|N\/A)$/i.test(status ?? "")) return false;
  const tableStatus = design.match(/\|\s*Core Decision Review Status\s*\|\s*([^|]+)\|/i)?.[1]?.trim();
  return !/^(confirmed|delegated_default|not_required|n\/a|N\/A)$/i.test(tableStatus ?? "");
}

function hasUiDecisionConfirmation(text) {
  if (!text) return false;
  return [
    /\[UI DECISION CONFIRMED\]/i,
    /^UI Direction Status:\s*(confirmed|approved|user-confirmed|已确认)$/im,
    /^体验方向状态[:：]\s*(confirmed|approved|user-confirmed|已确认)$/im,
    /\|\s*UI direction confirmed\s*\|\s*(yes|true|confirmed|approved)\s*\|/i,
    /\|\s*体验方向已确认\s*\|\s*(yes|true|confirmed|approved|是|已确认)\s*\|/i,
    /用户确认.{0,40}(UI|视觉|体验|交互|信息架构|设计方向)/i,
  ].some((pattern) => pattern.test(text));
}

function uiDirectionConfirmed(workItemBase) {
  const upstreamFiles = [
    "00-intake/brief.md",
    "00-intake/brainstorm.md",
    "00-intake/prd.md",
    "01-spec/requirements.md",
  ];

  return upstreamFiles.some((file) => hasUiDecisionConfirmation(safeRead(`${workItemBase}/${file}`)));
}

function hasTechDecisionConfirmation(text) {
  if (!text) return false;
  return [
    /\[TECH DECISION CONFIRMED\]/i,
    /^Tech Direction Status:\s*(confirmed|approved|user-confirmed|delegated_default|existing_stack|scaffold_confirmed|已确认)$/im,
    /^技术方向状态[:：]\s*(confirmed|approved|user-confirmed|delegated_default|existing_stack|scaffold_confirmed|已确认)$/im,
    /\|\s*Tech direction confirmed\s*\|\s*(yes|true|confirmed|approved)\s*\|/i,
    /\|\s*技术方向已确认\s*\|\s*(yes|true|confirmed|approved|是|已确认)\s*\|/i,
    /用户确认.{0,60}(技术栈|技术选型|架构方向|数据库|调度器|AI provider|模型供应商|部署方式)/i,
    /用户授权.{0,40}(默认|推荐方案|Agent recommendation)/i,
  ].some((pattern) => pattern.test(text));
}

function techDirectionConfirmed(workItemBase) {
  const upstreamFiles = [
    "00-intake/brief.md",
    "00-intake/brainstorm.md",
    "00-intake/prd.md",
    "01-spec/requirements.md",
    "01-spec/ui-design.md",
  ];

  return upstreamFiles.some((file) => hasTechDecisionConfirmation(safeRead(`${workItemBase}/${file}`)));
}

function upstreamText(workItemBase) {
  return [
    "00-intake/brief.md",
    "00-intake/brainstorm.md",
    "00-intake/prd.md",
    "01-spec/requirements.md",
    "01-spec/ui-design.md",
  ]
    .map((file) => safeRead(`${workItemBase}/${file}`))
    .filter(Boolean)
    .join("\n\n");
}

function hasDependencyDecisionConfirmation(text) {
  if (!text) return false;
  return [
    /\[DEPENDENCY DECISION CONFIRMED\]/i,
    /^Dependency Decision Status:\s*(confirmed|approved|user-confirmed|delegated_default|scaffold_confirmed|not_required|已确认)$/im,
    /^依赖决策状态[:：]\s*(confirmed|approved|user-confirmed|delegated_default|scaffold_confirmed|not_required|已确认)$/im,
    /\|\s*Dependency decision confirmed\s*\|\s*(yes|true|confirmed|approved)\s*\|/i,
    /\|\s*新增依赖已确认\s*\|\s*(yes|true|confirmed|approved|是|已确认)\s*\|/i,
    /用户确认.{0,80}(新增依赖|引入依赖|SDK|插件|组件库|ORM|驱动|测试库|浏览器自动化库|AI SDK)/i,
  ].some((pattern) => pattern.test(text));
}

function dependencyDecisionRequired(text) {
  if (!text) return false;
  return [
    /\[NEEDS DEPENDENCY DECISION\]/i,
    /\[DEPENDENCY DECISION REQUIRED\]/i,
    /^Dependency Decision Required:\s*(yes|true|required)$/im,
    /^新增依赖决策[:：]\s*(yes|true|required|需要|是)$/im,
    /\|\s*Dependency decision required\s*\|\s*(yes|true|required)\s*\|/i,
    /(新增|引入|添加|安装|升级|替换|采用|使用).{0,24}(直接依赖|依赖包|SDK|插件|组件库|ORM|驱动|测试库|浏览器自动化库|AI SDK|npm package|pip package)/i,
    /(add|introduce|install|upgrade|replace|use).{0,32}(direct dependenc|SDK|plugin|component library|ORM|driver|test library|browser automation|package)/i,
  ].some((pattern) => pattern.test(text));
}

function hasToolingDecisionConfirmation(text) {
  if (!text) return false;
  return [
    /\[TOOLING DECISION CONFIRMED\]/i,
    /^Tooling Decision Status:\s*(confirmed|approved|user-confirmed|delegated_default|existing_stack|scaffold_confirmed|not_required|已确认)$/im,
    /^工具链决策状态[:：]\s*(confirmed|approved|user-confirmed|delegated_default|existing_stack|scaffold_confirmed|not_required|已确认)$/im,
    /\|\s*Tooling decision confirmed\s*\|\s*(yes|true|confirmed|approved)\s*\|/i,
    /\|\s*工具链决策已确认\s*\|\s*(yes|true|confirmed|approved|是|已确认)\s*\|/i,
    /用户确认.{0,100}(包管理器|依赖管理|虚拟环境|UI 组件库|组件库|样式方案|构建工具|脚手架|测试工具|任务运行器|monorepo|npm|pnpm|yarn|bun|uv|poetry|pip|conda)/i,
  ].some((pattern) => pattern.test(text));
}

function toolingDecisionRequired(text) {
  if (!text) return false;
  return [
    /\[NEEDS TOOLING DECISION\]/i,
    /\[TOOLING DECISION REQUIRED\]/i,
    /^Tooling Decision Required:\s*(yes|true|required)$/im,
    /^工具链决策[:：]\s*(yes|true|required|需要|是)$/im,
    /\|\s*Tooling decision required\s*\|\s*(yes|true|required)\s*\|/i,
    /(选择|确认|决定|采用|使用|切换|替换).{0,32}(包管理器|前端包管理器|依赖管理|虚拟环境|UI 组件库|组件库|样式方案|CSS 方案|构建工具|脚手架|测试工具|测试框架|任务运行器|monorepo 工具|npm|pnpm|yarn|bun|uv|poetry|pip|conda|ant design|antd|mui|material ui|chakra|shadcn|tailwind|bootstrap|vite|webpack|pytest|ruff)/i,
    /(choose|select|decide|use|switch|replace).{0,40}(package manager|dependency manager|virtualenv|virtual environment|UI library|component library|styling|CSS framework|build tool|scaffold|test runner|test framework|task runner|monorepo|npm|pnpm|yarn|bun|uv|poetry|pip|conda|antd|mui|chakra|shadcn|tailwind|vite|webpack|pytest|ruff)/i,
  ].some((pattern) => pattern.test(text));
}

function technicalDirectionNeedsConfirmation(workItemYaml) {
  if (!workItemYaml) return !repositoryHasSourceCode();
  const technicalFlags = [
    "has_ui",
    "has_api",
    "has_db",
    "has_domain",
    "has_ai",
    "has_nfr",
    "has_security",
    "has_integration",
    "has_infra",
    "has_background_job",
  ];
  const components = parseComponents(workItemYaml);
  const hasTechnicalScope = technicalFlags.some((flag) => componentEnabled(components, flag));
  return hasTechnicalScope && !repositoryHasSourceCode();
}

function taskFieldSummary(workItemBase) {
  const tasksPath = `${workItemBase}/01-spec/tasks.md`;
  if (!exists(tasksPath)) return { exists: false, taskCount: 0, missingCore: [] };
  const tasks = readText(tasksPath);
  const taskCount = tasks.match(/^\s*[-*]\s+\[[ xX]\]\s+/gm)?.length ?? 0;
  const coreFields = ["Trace", "Files", "Verification", "Rollback", "Risk"];
  const counts = Object.fromEntries(
    coreFields.map((field) => [field, tasks.match(new RegExp(`^\\s*_${field}:_`, "gmi"))?.length ?? 0]),
  );
  return {
    exists: true,
    taskCount,
    counts,
    missingCore: coreFields.filter((field) => taskCount > 0 && counts[field] < taskCount),
  };
}

function artifactSummaries(schema, states, workItemBase, workItemYaml) {
  return schema.artifacts.map((artifact) => {
    const missingDeps = artifact.requires.filter((id) => states.get(id) !== "done");
    return {
      id: artifact.id,
      title: artifact.title,
      stage: artifact.stage,
      status: states.get(artifact.id),
      requires: artifact.requires,
      missingDeps,
      outputs: artifact.outputs.map((output) => ({
        output,
        exists: exists(`${workItemBase}/${output}`),
      })),
      gate: artifact.gate ?? "",
      gateStatus: artifact.gate ? gateStatus(workItemYaml, artifact.gate) : "",
      gateEvidence: artifact.gate ? gateEvidence(workItemYaml, artifact.gate) : null,
    };
  });
}

function gateSummaries(schema, workItemYaml, workItemBase) {
  return schema.artifacts
    .filter((artifact) => artifact.gate)
    .map((artifact) => {
      const evidence = gateEvidence(workItemYaml, artifact.gate);
      return {
        gate: artifact.gate,
        artifact: artifact.id,
        route: gateReturnRoute[artifact.gate] ?? routeByArtifact[artifact.id] ?? "sf-doctor",
        status: gateStatus(workItemYaml, artifact.gate),
        evidence,
        evidenceExists: evidence ? exists(`${workItemBase}/${evidence}`) : false,
      };
    });
}

function buildBlockers({ readyArtifact, gates, workItemBase, workItemYaml }) {
  const blockers = [];

  for (const gate of gates) {
    if (["REQUEST_CHANGES", "REJECTED"].includes(gate.status)) {
      blockers.push({
        severity: "P0",
        code: "gate-return",
        route: gate.route,
        owner_artifact: gate.artifact,
        message: `${gate.gate}=${gate.status}，先处理退回意见，不进入下游阶段。`,
      });
    }

    if (gate.status === "APPROVED" && !gate.evidence) {
      blockers.push({
        severity: "P0",
        code: "approved-gate-missing-evidence",
        route: routeByArtifact[gate.artifact] ?? "sf-doctor",
        owner_artifact: gate.artifact,
        message: `${gate.gate}=APPROVED 但缺少 evidence 路径，需要补齐门禁证据。`,
      });
    }

    if (gate.status === "APPROVED" && gate.evidence && !gate.evidenceExists) {
      blockers.push({
        severity: "P0",
        code: "approved-gate-evidence-missing-file",
        route: routeByArtifact[gate.artifact] ?? "sf-doctor",
        owner_artifact: gate.artifact,
        message: `${gate.gate}=APPROVED 但 evidence 文件不存在：${gate.evidence}。`,
      });
    }
  }

  if (!readyArtifact) return blockers;

  if (readyArtifact.id === "requirements" && prdRequired(workItemBase) && !prdReady(workItemBase)) {
    blockers.push({
      severity: "P1",
      code: "prd-required",
      route: "sf-prd",
      owner_artifact: "requirements",
      message: "brief 标记需要 PRD，但 00-intake/prd.md 尚未批准到 requirements。",
    });
  }

  if (readyArtifact.id === "ui_design" && !uiDirectionConfirmed(workItemBase)) {
    blockers.push({
      severity: "P1",
      code: "ui-direction-unconfirmed",
      route: "sf-brainstorm",
      owner_artifact: "ui_design",
      message: "ui_design 已 ready，但上游没有用户确认的 UI / 视觉 / 体验方向；先做 UI 方向取舍，不要直接创建 UI design 或 Pencil 原型。",
    });
  }

  if (
    readyArtifact.id === "technical_design" &&
    technicalDirectionNeedsConfirmation(workItemYaml) &&
    !techDirectionConfirmed(workItemBase)
  ) {
    blockers.push({
      severity: "P1",
      code: "tech-direction-unconfirmed",
      route: "sf-brainstorm",
      owner_artifact: "technical_design",
      message: "technical_design 已 ready，但这是空仓库/新项目路径，上游没有用户确认的技术栈、数据库、调度器、AI provider、部署或依赖方向；先做技术路线取舍，不要直接创建 technical design。",
    });
  }

  const upstream = upstreamText(workItemBase);
  if (readyArtifact.id === "technical_design" && dependencyDecisionRequired(upstream) && !hasDependencyDecisionConfirmation(upstream)) {
    blockers.push({
      severity: "P1",
      code: "dependency-decision-unconfirmed",
      route: "sf-brainstorm",
      owner_artifact: "technical_design",
      message: "technical_design 已 ready，但上游显示本次需要新增/替换直接依赖、SDK、插件、组件库、ORM、驱动或测试库，且没有用户确认或授权默认；先确认依赖取舍，不要直接创建 technical design。",
    });
  }

  if (readyArtifact.id === "technical_design" && toolingDecisionRequired(upstream) && !hasToolingDecisionConfirmation(upstream)) {
    blockers.push({
      severity: "P1",
      code: "tooling-decision-unconfirmed",
      route: "sf-brainstorm",
      owner_artifact: "technical_design",
      message: "technical_design 已 ready，但上游显示本次需要选择或变更工程工具链（包管理器、UI 组件库、样式方案、依赖管理、虚拟环境、构建/测试工具等），且没有用户确认或授权默认；先确认工具链取舍，不要直接创建 technical design。",
    });
  }

  if (["tasks", "spec_review", "implementation"].includes(readyArtifact.id) && technicalNeedsDecision(workItemBase)) {
    blockers.push({
      severity: "P1",
      code: "technical-selection-unconfirmed",
      route: "sf-tech-design",
      owner_artifact: "technical_design",
      message: "technical-design.md 仍有 [NEEDS TECH DECISION]、[NEEDS DEPENDENCY DECISION] 或 [NEEDS TOOLING DECISION]，关键技术选型、新增依赖或工具链未确认，不能进入下游阶段。",
    });
  }

  if (["tasks", "spec_review", "implementation"].includes(readyArtifact.id) && technicalCoreReviewUnconfirmed(workItemBase)) {
    blockers.push({
      severity: "P1",
      code: "technical-design-review-unconfirmed",
      route: "sf-tech-design",
      owner_artifact: "technical_design",
      message: "technical-design.md 的核心决策摘要尚未用户确认、授权默认或标记为 N/A，不能进入 tasking、spec_review approval 或 implementation。",
    });
  }

  if (readyArtifact.id === "implementation") {
    const unknownRows = technicalUnknownRows(workItemBase);
    if (unknownRows.length > 0) {
      blockers.push({
        severity: "P1",
        code: "technical-design-unknown",
        route: "sf-tech-design",
        owner_artifact: "technical_design",
        message: `technical-design.md 仍有 ${unknownRows.length} 个 unknown 影响面，不能直接进入实现。`,
      });
    }

    const taskFields = taskFieldSummary(workItemBase);
    if (taskFields.missingCore.length > 0) {
      blockers.push({
        severity: "P1",
        code: "tasks-core-fields-missing",
        route: "sf-tasking",
        owner_artifact: "tasks",
        message: `tasks.md 有 ${taskFields.taskCount} 个任务，但核心字段缺失或数量不足：${taskFields.missingCore.map((field) => `_${field}:_`).join(", ")}。`,
      });
    }
  }

  return blockers;
}

export function diagnoseWorkItem(options = {}) {
  const workItem = resolveWorkItem({
    workItem: options.workItem,
    activeOnly: options.activeOnly ?? false,
    defaultToLatestArchive: options.defaultToLatestArchive ?? false,
  });
  const workItemYaml = readText(`${workItem.base}/work.yaml`);
  const workflow = parseField(workItemYaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), workItemYaml);
  const states = computeArtifactStates(schema, workItemYaml, workItem.base);
  const artifacts = artifactSummaries(schema, states, workItem.base, workItemYaml);
  const gates = gateSummaries(schema, workItemYaml, workItem.base);
  const readyArtifact = nextReadyArtifact(schema, states);
  const blockers = buildBlockers({ readyArtifact, gates, workItemBase: workItem.base, workItemYaml });
  const doneCount = artifacts.filter((artifact) => artifact.status === "done").length;
  const readyArtifacts = artifacts.filter((artifact) => artifact.status === "ready").map((artifact) => artifact.id);
  const partialArtifacts = artifacts.filter((artifact) => artifact.status === "partial").map((artifact) => artifact.id);
  const blockedArtifacts = artifacts
    .filter((artifact) => artifact.status === "blocked")
    .map((artifact) => ({ id: artifact.id, missingDeps: artifact.missingDeps }));
  const route = blockers[0]?.route ?? (readyArtifact ? routeByArtifact[readyArtifact.id] : "sf-doctor");
  const routeReason = blockers[0]?.message ?? (readyArtifact ? `${readyArtifact.id} 已 ready。` : "没有 ready artifact，需查看 artifact graph 的阻断依赖。");

  return {
    workspace_kind: layout.kind,
    work_item: {
      id: workItem.name,
      path: workItem.base,
      lifecycle: workItem.lifecycle,
      title: parseField(workItemYaml, "title"),
      type: parseField(workItemYaml, "type"),
      kind: parseField(workItemYaml, "kind"),
      status: parseField(workItemYaml, "status"),
      stage: parseField(workItemYaml, "stage"),
      workflow,
    },
    schema: { id: schema.id, version: schema.version },
    components: schema.components ?? {},
    progress: { done: doneCount, total: artifacts.length },
    ready_artifact: readyArtifact?.id ?? null,
    ready_artifacts: readyArtifacts,
    blocked_artifacts: blockedArtifacts,
    partial_artifacts: partialArtifacts,
    gates,
    blockers,
    route,
    route_reason: routeReason,
    artifacts,
  };
}

export function diagnoseWorkspace() {
  const active = listWorkItems("active");
  const archive = listWorkItems("archive");

  if (active.length === 0) {
    if (repositoryHasSourceCode() && wikiBaselineMissing()) {
      return {
        workspace_kind: layout.kind,
        active_count: 0,
        active_items: [],
        archive_count: archive.length,
        route: "sf-steering",
        route_reason: "当前没有 active work item，但这是已有代码项目且 wiki 基线仍为空；应先建立项目画像。",
        blockers: [],
        work_item: null,
      };
    }

    return {
      workspace_kind: layout.kind,
      active_count: 0,
      active_items: [],
      archive_count: archive.length,
      route: "sf-intake",
      route_reason: "当前没有 active work item；下一步应创建或整理一个新工作事项。",
      blockers: [],
      work_item: null,
    };
  }

  if (active.length > 1) {
    return {
      workspace_kind: layout.kind,
      active_count: active.length,
      active_items: active.map((id) => ({ id, path: `${layout.workItems}/active/${id}` })),
      archive_count: archive.length,
      route: "sf-doctor",
      route_reason: "存在多个 active work item，不能猜测要继续哪一个。",
      blockers: [
        {
          severity: "P0",
          code: "multiple-active-work-items",
          route: "sf-doctor",
          owner_artifact: "workspace",
          message: "请显式指定 --work-item <id>，或先关闭/归档不继续的工作事项。",
        },
      ],
      work_item: null,
    };
  }

  return {
    active_count: 1,
    active_items: active.map((id) => ({ id, path: `${layout.workItems}/active/${id}` })),
    archive_count: archive.length,
    ...diagnoseWorkItem({ workItem: active[0], activeOnly: true }),
  };
}

export function gateLine(gates) {
  if (gates.length === 0) return "none";
  return gates.map((gate) => `${gate.gate}=${gate.status}${gate.evidence ? `(${gate.evidence})` : ""}`).join(", ");
}

export function artifactLine(artifacts) {
  return artifacts.map((artifact) => `${artifact.id}:${artifact.status}`).join(", ");
}
