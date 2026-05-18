import {
  computeArtifactStates,
  effectiveSchema,
  exists,
  gateEvidence,
  gateStatus,
  layout,
  listWorkItems,
  loadSchema,
  nextReadyArtifact,
  parseField,
  readText,
  resolveWorkItem,
} from "./specforge.mjs";

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

function safeRead(relativePath) {
  return exists(relativePath) ? readText(relativePath) : "";
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

function taskImpactSummary(workItemBase) {
  const tasksPath = `${workItemBase}/01-spec/tasks.md`;
  if (!exists(tasksPath)) return { exists: false, taskCount: 0, impactCount: 0, missing: false };
  const tasks = readText(tasksPath);
  const taskCount = tasks.match(/^\s*[-*]\s+\[[ xX]\]\s+/gm)?.length ?? 0;
  const impactCount = tasks.match(/^\s*_Impact:_/gm)?.length ?? 0;
  return {
    exists: true,
    taskCount,
    impactCount,
    missing: taskCount > 0 && impactCount < taskCount,
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

function buildBlockers({ readyArtifact, gates, workItemBase }) {
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

    const taskImpact = taskImpactSummary(workItemBase);
    if (taskImpact.missing) {
      blockers.push({
        severity: "P1",
        code: "tasks-impact-missing",
        route: "sf-tasking",
        owner_artifact: "tasks",
        message: `tasks.md 有 ${taskImpact.taskCount} 个任务，但只有 ${taskImpact.impactCount} 个 _Impact:_ 标注。`,
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
  const blockers = buildBlockers({ readyArtifact, gates, workItemBase: workItem.base });
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
