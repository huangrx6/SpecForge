export function actionState(diagnosis, health = {}) {
  if (diagnosis.blockers?.some((blocker) => ["P0", "P1"].includes(blocker.severity))) return "BLOCKED";
  if ((diagnosis.decision_checkpoints?.summary?.open ?? 0) > 0) return "NEEDS_DECISION";
  if ((diagnosis.quality_warnings ?? []).length > 0 || ["needs_attention", "at_risk"].includes(health.level)) {
    return "NEEDS_ATTENTION";
  }
  if (!diagnosis.work_item) return "READY_FOR_INTAKE";
  return "READY";
}

export function traceGapCount(traceability) {
  const summary = traceability?.summary;
  return (
    (summary?.uncovered_sources ?? 0) +
    (summary?.tasks_missing_trace ?? 0) +
    (summary?.tasks_missing_verification ?? 0)
  );
}

export function traceabilityPolicyLine(policy) {
  if (!policy) return "mode=advisory; enforced_gates=none";
  return `mode=${policy.mode}; enforced_gates=${policy.enforced_gates?.length ? policy.enforced_gates.join(", ") : "none"}`;
}

export function actionReason(diagnosis) {
  if (diagnosis.blockers?.[0]) return diagnosis.blockers[0].message;
  const decision = diagnosis.decision_checkpoints?.open?.[0];
  if (decision) return `Resolve ${decision.marker} at ${decision.path}:${decision.line}`;
  return diagnosis.route_reason;
}

export function actionCommands(diagnosis) {
  const commands = ["node .specforge/core/scripts/workflow-audit.mjs", "node .specforge/core/scripts/stage-contract.mjs"];
  if (diagnosis.blockers?.length > 0) commands.push(`node .specforge/core/scripts/instructions.mjs ${diagnosis.blockers[0].owner_artifact ?? ""}`.trim());
  if ((diagnosis.decision_checkpoints?.summary?.open ?? 0) > 0) commands.push("node .specforge/core/scripts/decision-brief.mjs");
  if (traceGapCount(diagnosis.traceability) > 0) commands.push("node .specforge/core/scripts/traceability-summary.mjs");
  if (diagnosis.ready_artifact) commands.push("node .specforge/core/scripts/instructions.mjs");
  if (diagnosis.work_item) commands.push("node .specforge/core/scripts/workflow-package.mjs");
  return [...new Set(commands)];
}

export function readingOrder() {
  return [
    "Resolve P0 / P1 blockers and the top open decision.",
    "Read the current stage contract and ready artifact.",
    "Check traceability before implementation or verification gates.",
    "Use artifact excerpts only after the action summary is clear.",
  ];
}
