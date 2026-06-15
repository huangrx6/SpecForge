const contractByArtifact = {
  intake: {
    goal: "把原始请求转成一个有边界、可路由、可继续的 work item。",
    read: ["original request", "existing wiki index", "similar archived work items when relevant"],
    produce: ["00-intake/original-request.md", "00-intake/brief.md", "workflow / components decision"],
    human_decisions: ["workflow choice", "scope split", "PRD required", "high-impact unknowns"],
    must_prove: ["the next route is clear", "scope and non-goals are explicit", "active work item is unique"],
    exit: "brief is readable in one page and downstream artifact can start without guessing the request.",
  },
  research: {
    goal: "用来源证据、PoC 或事实核验降低未知，形成可进入 requirements / design 的结论。",
    read: ["brief", "official docs or primary sources", "repo evidence", "logs / reproduction notes when applicable"],
    produce: ["01-spec/research.md", "source quality grading", "ADR candidate or N/A"],
    human_decisions: ["continue / split / stop", "accept source limitations", "choose direction when evidence conflicts"],
    must_prove: ["source quality is labeled", "claims are separated from inference", "next workflow path is explicit"],
    exit: "research conclusion is strong enough to write requirements or intentionally stop.",
  },
  gap_report: {
    goal: "复现或定位当前缺口，说明实际行为、预期行为、根因候选和修复方向。",
    read: ["brief", "logs", "code paths", "reproduction steps", "current behavior evidence"],
    produce: ["01-spec/gap-report.md", "root cause / unknowns", "regression seeds"],
    human_decisions: ["whether to fix now", "scope of regression", "risk acceptance for unavailable reproduction"],
    must_prove: ["gap is observable or explicitly unobservable", "expected behavior is anchored", "regression path exists"],
    exit: "tasks can be written without rediscovering the bug.",
  },
  requirements: {
    goal: "把目标和边界转成可测试、可追踪、无核心冲突的行为规格。",
    read: ["brief", "PRD when present", "brainstorm confirmations", "research / gap report", "wiki product rules", "requirements capability package"],
    produce: ["01-spec/requirements.md", "REQ-* / AC-* / NFR-* IDs", "source trace", "impact flags", "downstream handoff"],
    human_decisions: ["MVP", "acceptance meaning", "dependency / tooling decision signals", "conflicting requirements"],
    must_prove: ["every MUST is confirmed and testable", "REQ / AC trace is complete", "non-goals are explicit", "impact flags match the request"],
    exit: "UI / technical design or tasks can start without inventing behavior.",
  },
  ui_design: {
    goal: "定义用户可见流程、状态、交互、视觉方向和原型证据。",
    read: ["requirements", "design standards", "design mode routing", "existing UI patterns", "Pencil / screenshot evidence when used"],
    produce: ["01-spec/ui-design.md", "Design Contract JSON with color_system", "component contract files when needed", "state matrix", "prototype or N/A evidence"],
    human_decisions: ["visual direction", "critical flow", "prototype fidelity", "accessibility / responsive tradeoff"],
    must_prove: ["design mode matches the surface", "color system has palette scale, usage ratio, contrast checks, and avoid rules", "empty / loading / error / permission / boundary states are covered", "UI direction is confirmed or N/A", "handoff contract is machine-readable"],
    exit: "frontend implementation can proceed without re-deciding UX.",
  },
  technical_design: {
    goal: "给实现者最小充分的工程方案、影响面、契约、风险和验证策略。",
    read: ["requirements", "ui design when applicable", "Design Contract JSON with color_system when UI applies", "component contract files", "wiki architecture", "official docs for new technology"],
    produce: ["01-spec/technical-design.md", "impact scan", "contracts", "ADR / N/A", "verification strategy"],
    human_decisions: ["new dependency", "tooling", "architecture choice", "core design review"],
    must_prove: ["no high-impact unknown remains", "new dependencies are confirmed", "contracts are testable"],
    exit: "tasks can be decomposed without choosing architecture during implementation.",
  },
  tasks: {
    goal: "把 approved spec 拆成可执行、可并行、可验证、可回滚的任务图。",
    read: ["requirements", "ui design", "Design Contract JSON with color_system", "component contract files", "technical design", "wiki context", "workflow schema"],
    produce: ["01-spec/tasks.md", "source coverage matrix", "Txxx tasks", "verification tasks"],
    human_decisions: ["scope expansion", "parallel ownership", "defer / follow-up items"],
    must_prove: ["source items map to tasks", "each task has Trace / Files / Verification / Rollback / Risk", "testcase links are planned"],
    exit: "implementation can proceed task-by-task without guessing files, order, or verification.",
  },
  spec_review: {
    goal: "审查规格是否足以进入实现，优先发现断链、越界、未确认决策和缺验证。",
    read: ["all spec artifacts", "tasks", "traceability summary", "decision checkpoints"],
    produce: ["02-spec-review/spec-review-v1.md", "findings", "gate recommendation"],
    human_decisions: ["accept low-risk residuals", "return path for P0/P1", "scope split"],
    must_prove: ["P0/P1 issues are absent or explicitly returned", "gate evidence exists", "traceability gaps are understood"],
    exit: "spec_review gate can be APPROVED with evidence or REQUEST_CHANGES with a precise return path.",
  },
  implementation: {
    goal: "按任务图实现，并记录真实 diff、任务对账、验证结果和偏离。",
    read: ["approved tasks", "Design Contract JSON with color_system when UI applies", "component contract files", "spec review evidence", "wiki entries", "current git status"],
    produce: ["code changes", "03-implementation/plan.md", "03-implementation/report.md", "03-implementation/changed-files.md"],
    human_decisions: ["spec gap discovered", "scope expansion", "unavailable external verification"],
    must_prove: ["diff maps back to tasks", "tests or smoke checks ran where feasible", "unrelated user changes are preserved"],
    exit: "code_review can inspect concrete changes and evidence without reconstructing implementation history.",
  },
  code_review: {
    goal: "以缺陷、风险、规格偏离和缺测为主审查实现。",
    read: ["git diff", "approved specs", "tasks", "implementation report", "test output"],
    produce: ["04-code-review/code-review-v1.md", "findings-first review", "gate recommendation"],
    human_decisions: ["fix now / defer", "risk acceptance", "return to spec or implementation"],
    must_prove: ["findings are file/line grounded", "task-diff alignment is checked", "test gaps are named"],
    exit: "code_review gate can be approved or returned with actionable findings.",
  },
  verification: {
    goal: "用证据证明行为、风险和回滚关切已经覆盖到匹配强度。",
    read: ["test cases", "Design Contract JSON with color_system when UI applies", "component contract files", "code review notes", "tasks", "CI / local / Playwright / logs"],
    produce: ["05-verification/test-cases.md", "05-verification/report.md", "05-verification/ci-result.md when applicable"],
    human_decisions: ["manual-confirmed evidence", "deferred external proof", "risk acceptance"],
    must_prove: ["evidence strength matches risk", "skips have owner and revalidation trigger", "missing evidence is not approved"],
    exit: "verification gate can explain exactly what is proven, mocked, deferred, or manually accepted.",
  },
  wiki_sync: {
    goal: "把长期有效的事实回写 wiki，避免下次重读全仓。",
    read: ["implementation report", "verification report", "changed files", "existing wiki"],
    produce: ["06-close/wiki-sync.md", "updated wiki files or N/A rationale"],
    human_decisions: ["which facts are long-lived", "risk / technical debt ownership"],
    must_prove: ["wiki is current and non-duplicative", "temporary process noise is excluded", "source work is recorded"],
    exit: "wiki_sync gate proves future agents have the needed project context.",
  },
  closure: {
    goal: "完成 release、rollback、report 和 archive 准备。",
    read: ["all gates", "verification", "wiki sync", "doctor", "workflow audit"],
    produce: ["06-close/release.md", "06-close/rollback.md", "07-report/work-summary.html", "archive-ready state"],
    human_decisions: ["release decision", "rollback readiness", "residual risk owner"],
    must_prove: ["doctor passes", "rollback is documented", "remaining risks have owner and trigger"],
    exit: "work item can be archived and later understood from evidence alone.",
  },
};

const executionByArtifact = {
  intake: {
    tools: ["sf-intake", "status.mjs", "create-work.mjs", "codebase-index.mjs when repo context is unclear"],
    commands: ["node .specforge/core/scripts/status.mjs", "node .specforge/core/scripts/create-work.mjs --workflow <workflow> \"<title>\""],
  },
  research: {
    tools: ["sf-discovery", "official docs / primary sources", "repo search", "PoC or logs when available", "quality-suite.mjs"],
    commands: [
      "node .specforge/core/scripts/create-artifact.mjs research",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/source-quality.mjs",
      "node .specforge/core/scripts/decision-brief.mjs",
    ],
  },
  gap_report: {
    tools: ["sf-discovery", "logs", "reproduction steps", "repo search", "quality-suite.mjs"],
    commands: [
      "node .specforge/core/scripts/create-artifact.mjs gap_report",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/decision-brief.mjs",
    ],
  },
  requirements: {
    tools: ["sf-requirements", "requirements capability package", "decision-checkpoints.mjs", "decision-quality.mjs", "quality-suite.mjs", "wiki product rules"],
    commands: [
      "node .specforge/core/scripts/create-artifact.mjs requirements",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/decision-checkpoints.mjs",
      "node .specforge/core/scripts/decision-quality.mjs",
    ],
  },
  ui_design: {
    tools: ["sf-ui-design", "Pencil", "design-system routing", "Design Contract JSON", "design standards", "visual verification screenshots", "quality-suite.mjs"],
    commands: [
      "node .specforge/core/scripts/create-artifact.mjs ui_design",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/stage-contract.mjs --artifact ui_design",
    ],
  },
  technical_design: {
    tools: ["sf-tech-design", "profiles", "official docs", "wiki architecture", "quality-suite.mjs"],
    commands: [
      "node .specforge/core/scripts/create-artifact.mjs technical_design",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/source-quality.mjs",
      "node .specforge/core/scripts/stage-contract.mjs --artifact technical_design",
    ],
  },
  tasks: {
    tools: ["sf-tasking", "traceability-summary.mjs", "quality-suite.mjs", "artifact graph"],
    commands: [
      "node .specforge/core/scripts/create-artifact.mjs tasks",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/traceability-summary.mjs",
    ],
  },
  spec_review: {
    tools: ["sf-spec-review", "traceability-summary.mjs", "quality-suite.mjs", "source-quality.mjs", "decision-quality.mjs", "decision-checkpoints.mjs", "gate-preflight.mjs"],
    commands: [
      "node .specforge/core/scripts/create-artifact.mjs spec_review",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/source-quality.mjs",
      "node .specforge/core/scripts/decision-quality.mjs",
      "node .specforge/core/scripts/gate-preflight.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md",
    ],
  },
  implementation: {
    tools: ["sf-implement", "Codex / Trae / SOLO", "instructions.mjs apply", "quality-suite.mjs", "implementation-quality.mjs", "git diff"],
    commands: [
      "node .specforge/core/scripts/instructions.mjs apply",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/implementation-quality.mjs",
      "git status --short --untracked-files=all",
    ],
  },
  code_review: {
    tools: ["sf-code-review", "git diff", "test output", "quality-suite.mjs", "implementation-quality.mjs", "gate-preflight.mjs"],
    commands: [
      "node .specforge/core/scripts/create-artifact.mjs code_review",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/implementation-quality.mjs",
      "node .specforge/core/scripts/gate-preflight.mjs code_review APPROVED --evidence 04-code-review/code-review-v1.md",
    ],
  },
  verification: {
    tools: ["sf-verify", "CI", "Playwright", "logs", "mock / real environment evidence", "quality-suite.mjs", "decision-quality.mjs"],
    commands: [
      "node .specforge/core/scripts/create-artifact.mjs verification",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/evidence-summary.mjs",
      "node .specforge/core/scripts/decision-quality.mjs",
      "node .specforge/core/scripts/gate-preflight.mjs verification APPROVED --evidence 05-verification/report.md",
    ],
  },
  wiki_sync: {
    tools: ["sf-wiki", "sync-wiki.mjs", "quality-suite.mjs", "wiki-quality.mjs", "wiki index", "gate-preflight.mjs"],
    commands: [
      "node .specforge/core/scripts/sync-wiki.mjs",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/wiki-quality.mjs",
      "node .specforge/core/scripts/gate-preflight.mjs wiki_sync APPROVED --evidence 06-close/wiki-sync.md",
    ],
  },
  closure: {
    tools: ["sf-close", "doctor.mjs", "quality-suite.mjs", "decision-quality.mjs", "closure-quality.mjs", "workflow-package.mjs", "archive-work.mjs"],
    commands: [
      "node .specforge/core/scripts/workflow-package.mjs",
      "node .specforge/core/scripts/quality-suite.mjs",
      "node .specforge/core/scripts/decision-quality.mjs",
      "node .specforge/core/scripts/closure-quality.mjs",
      "node .specforge/core/scripts/doctor.mjs",
      "node .specforge/core/scripts/archive-work.mjs --dry-run",
    ],
  },
};

function qualityChecksForArtifact(schema, artifactId) {
  return (schema.quality_policy?.section_checks ?? []).filter((check) => check.artifact === artifactId);
}

export function focusArtifactId(diagnosis) {
  const blockerOwner = diagnosis.blockers?.find((blocker) => blocker.owner_artifact)?.owner_artifact;
  return blockerOwner ?? diagnosis.ready_artifact ?? diagnosis.partial_artifacts?.[0] ?? null;
}

export function contractForArtifact(schema, artifactId) {
  const artifact = schema.artifacts.find((item) => item.id === artifactId);
  if (!artifact) return null;
  const base = contractByArtifact[artifactId] ?? {
    goal: artifact.description || artifact.title,
    read: ["upstream artifacts", "workflow schema", "project wiki"],
    produce: artifact.outputs ?? [],
    human_decisions: ["scope / risk / evidence decisions when applicable"],
    must_prove: ["outputs exist", "dependencies are satisfied", "next route is clear"],
    exit: "artifact is sufficient for the next stage.",
  };

  return {
    id: artifact.id,
    title: artifact.title,
    stage: artifact.stage,
    description: artifact.description,
    outputs: artifact.outputs ?? [],
    requires: artifact.requires ?? [],
    gate: artifact.gate ?? null,
    quality_checks: qualityChecksForArtifact(schema, artifactId),
    execution: executionByArtifact[artifactId] ?? {
      tools: ["stage skill", "workflow schema", "project wiki"],
      commands: ["node .specforge/core/scripts/stage-contract.mjs"],
    },
    ...base,
  };
}

export function contractsForSchema(schema) {
  return schema.artifacts.map((artifact) => contractForArtifact(schema, artifact.id)).filter(Boolean);
}
