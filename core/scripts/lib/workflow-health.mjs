function severityWeight(severity) {
  if (severity === "P0") return 40;
  if (severity === "P1") return 25;
  if (severity === "P2") return 8;
  if (severity === "P3") return 3;
  return 5;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function addPriority(priorities, severity, area, message, route = "") {
  priorities.push({ severity, area, message, route });
}

function healthLevel(score, diagnosis) {
  if (diagnosis.blockers?.some((blocker) => ["P0", "P1"].includes(blocker.severity))) return "blocked";
  if ((diagnosis.decision_checkpoints?.summary?.open ?? 0) > 0) return "needs_decision";
  if (score < 70) return "at_risk";
  if (score < 90 || (diagnosis.quality_warnings?.length ?? 0) > 0) return "needs_attention";
  return "healthy";
}

function traceabilityPenalty(traceability) {
  if (!traceability) return 0;
  const summary = traceability.summary;
  return clamp(
    summary.uncovered_sources * 3 +
      summary.tasks_missing_trace * 3 +
      summary.tasks_missing_verification * 2 +
      summary.tasks_without_testcase,
    0,
    30,
  );
}

function gatePenalty(gates = []) {
  let penalty = 0;
  for (const gate of gates) {
    if (["REQUEST_CHANGES", "REJECTED"].includes(gate.status)) penalty += 30;
    if (gate.status === "APPROVED" && (!gate.evidence || !gate.evidenceExists)) penalty += 20;
  }
  return clamp(penalty, 0, 35);
}

export function workflowHealth(diagnosis) {
  if (!diagnosis.work_item) {
    return {
      score: null,
      level: diagnosis.blockers?.length > 0 ? "blocked" : "ready_for_intake",
      summary: diagnosis.route_reason,
      dimensions: [],
      priorities: diagnosis.blockers?.map((blocker) => ({
        severity: blocker.severity,
        area: "workspace",
        message: blocker.message,
        route: blocker.route,
      })) ?? [],
    };
  }

  const blockers = diagnosis.blockers ?? [];
  const warnings = diagnosis.quality_warnings ?? [];
  const nonTraceWarnings = warnings.filter((warning) => !String(warning.code ?? "").startsWith("traceability-"));
  const checkpoints = diagnosis.decision_checkpoints?.summary ?? { open: 0, risk_acceptance: 0 };
  const tracePolicy = diagnosis.traceability_policy ?? { mode: "advisory" };
  const traceability = tracePolicy.mode === "off" ? null : diagnosis.traceability;
  const priorities = [];

  const blockerPenalty = clamp(blockers.reduce((sum, blocker) => sum + severityWeight(blocker.severity), 0), 0, 60);
  const decisionPenalty = clamp(checkpoints.open * 15 + checkpoints.risk_acceptance * 4, 0, 35);
  const warningPenalty = clamp(nonTraceWarnings.reduce((sum, warning) => sum + severityWeight(warning.severity), 0), 0, 30);
  const tracePenalty = traceabilityPenalty(traceability);
  const gatesPenalty = gatePenalty(diagnosis.gates);
  const score = clamp(100 - blockerPenalty - decisionPenalty - warningPenalty - tracePenalty - gatesPenalty, 0, 100);

  for (const blocker of blockers.slice(0, 5)) {
    addPriority(priorities, blocker.severity, "blocker", blocker.message, blocker.route);
  }

  for (const decision of diagnosis.decision_checkpoints?.open?.slice(0, 3) ?? []) {
    addPriority(priorities, "P1", "decision", `${decision.marker}: ${decision.path}:${decision.line}`, "decision-brief");
  }

  const traceSummary = traceability?.summary;
  if (traceSummary) {
    if (traceSummary.uncovered_sources > 0) {
      addPriority(priorities, "P2", "traceability", `${traceSummary.uncovered_sources} source item(s) are not covered by task _Trace:_ fields.`, "sf-tasking");
    }
    if (traceSummary.tasks_missing_verification > 0) {
      addPriority(priorities, "P2", "verification", `${traceSummary.tasks_missing_verification} task(s) are missing _Verification:_ fields.`, "sf-tasking");
    }
    if (traceSummary.tasks_without_testcase > 0) {
      addPriority(priorities, "P3", "testcase", `${traceSummary.tasks_without_testcase} task(s) do not link to TC/PW IDs yet.`, "sf-verify");
    }
  }

  for (const warning of nonTraceWarnings.slice(0, 5)) {
    addPriority(priorities, warning.severity, "quality", warning.message, warning.route);
  }

  if (priorities.length === 0 && diagnosis.ready_artifact) {
    addPriority(priorities, "P3", "next", `${diagnosis.ready_artifact} is ready; continue with ${diagnosis.route}.`, diagnosis.route);
  }

  const dimensions = [
    {
      name: "blockers",
      status: blockers.length === 0 ? "pass" : "fail",
      count: blockers.length,
      penalty: blockerPenalty,
    },
    {
      name: "human_decisions",
      status: checkpoints.open === 0 ? "pass" : "needs_decision",
      count: checkpoints.open,
      penalty: decisionPenalty,
    },
    {
      name: "quality_warnings",
      status: nonTraceWarnings.length === 0 ? "pass" : "needs_attention",
      count: nonTraceWarnings.length,
      penalty: warningPenalty,
    },
    {
      name: "traceability",
      status: tracePenalty === 0 ? "pass" : "needs_attention",
      count:
        (traceSummary?.uncovered_sources ?? 0) +
        (traceSummary?.tasks_missing_trace ?? 0) +
        (traceSummary?.tasks_missing_verification ?? 0) +
        (traceSummary?.tasks_without_testcase ?? 0),
      penalty: tracePenalty,
    },
    {
      name: "gates",
      status: gatesPenalty === 0 ? "pass" : "fail",
      count: diagnosis.gates?.filter((gate) => ["REQUEST_CHANGES", "REJECTED"].includes(gate.status)).length ?? 0,
      penalty: gatesPenalty,
    },
  ];

  return {
    score,
    level: healthLevel(score, diagnosis),
    summary: `score=${score}/100; level=${healthLevel(score, diagnosis)}; route=${diagnosis.route}`,
    dimensions,
    priorities: priorities.slice(0, 10),
  };
}
