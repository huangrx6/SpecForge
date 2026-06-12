import { artifactById, effectiveSchema, exists, loadSchema, parseField, readText } from "./specforge.mjs";
import { normalizeTraceabilityPolicy, traceabilityGapChecks } from "./traceability.mjs";
import { workflowHealth } from "./workflow-health.mjs";

function add(checks, status, code, message, route = "") {
  checks.push({ status, code, message, route });
}

function normalizeStatus(status = "APPROVED") {
  const normalized = String(status || "APPROVED").toUpperCase();
  return ["APPROVED", "REQUEST_CHANGES", "REJECTED", "PENDING"].includes(normalized) ? normalized : "APPROVED";
}

function overall(checks) {
  if (checks.some((check) => check.status === "FAIL")) return "FAIL";
  if (checks.some((check) => check.status === "WARN")) return "WARN";
  return "PASS";
}

export function gatePreflight(diagnosis, options = {}) {
  const gate = options.gate;
  const targetStatus = normalizeStatus(options.status);
  const evidence = options.evidence ?? "";
  const checks = [];

  if (!diagnosis.work_item) {
    add(checks, "FAIL", "no-work-item", "No active work item is available for gate preflight.", "sf-intake");
    return { gate, target_status: targetStatus, overall: overall(checks), checks, health: workflowHealth(diagnosis), artifact: null };
  }

  const yaml = readText(`${diagnosis.work_item.path}/work.yaml`);
  const workflow = parseField(yaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), yaml);
  const gateArtifact = schema.artifacts.find((artifact) => artifact.gate === gate);
  const artifact = gateArtifact ? artifactById(schema, gateArtifact.id) : null;
  const artifactStatus = diagnosis.artifacts.find((item) => item.id === gateArtifact?.id)?.status ?? "unknown";
  const health = workflowHealth(diagnosis);

  if (!gateArtifact) {
    add(checks, "FAIL", "unknown-gate", `Unknown gate for workflow ${workflow}: ${gate}.`, "sf-doctor");
  } else {
    add(checks, "PASS", "gate-known", `Gate ${gate} belongs to artifact ${gateArtifact.id}.`, "");
  }

  if (targetStatus === "APPROVED") {
    if (!evidence) {
      add(checks, "FAIL", "missing-evidence-argument", "APPROVED gate requires --evidence <path>.", "sf-doctor");
    } else if (!exists(`${diagnosis.work_item.path}/${evidence}`)) {
      add(checks, "FAIL", "missing-evidence-file", `Evidence file does not exist: ${evidence}.`, "sf-doctor");
    } else {
      add(checks, "PASS", "evidence-exists", `Evidence exists: ${evidence}.`, "");
    }

    if (artifactStatus === "blocked") {
      add(checks, "FAIL", "artifact-blocked", `${gateArtifact?.id ?? gate} is still blocked by upstream artifacts.`, "sf-doctor");
    } else if (artifactStatus === "partial") {
      add(checks, "WARN", "artifact-partial", `${gateArtifact?.id ?? gate} is partial; confirm all required outputs are intentional.`, "sf-doctor");
    } else if (artifactStatus === "ready") {
      add(checks, "PASS", "artifact-ready", `${gateArtifact?.id ?? gate} is ready for gate review.`, "");
    }

    for (const blocker of diagnosis.blockers ?? []) {
      const status = ["P0", "P1"].includes(blocker.severity) ? "FAIL" : "WARN";
      add(checks, status, `blocker-${blocker.code}`, blocker.message, blocker.route);
    }

    const openDecisions = diagnosis.decision_checkpoints?.summary?.open ?? 0;
    if (openDecisions > 0) {
      add(checks, "FAIL", "open-decisions", `${openDecisions} open decision marker(s) remain. Generate a decision brief before approval.`, "decision-brief");
    }

    const tracePolicy = normalizeTraceabilityPolicy(schema);
    const traceChecks = traceabilityGapChecks(diagnosis.traceability, tracePolicy);
    const traceStrict = tracePolicy.mode === "strict" && tracePolicy.enforced_gates.includes(gate);
    if (traceChecks.length > 0 && gate !== "spec_review") {
      for (const traceCheck of traceChecks) {
        add(
          checks,
          traceStrict ? "FAIL" : "WARN",
          `traceability-${traceCheck.key.replaceAll("_", "-")}`,
          traceStrict
            ? `${traceCheck.message} traceability_policy=strict for gate ${gate}.`
            : `${traceCheck.message} traceability_policy=${tracePolicy.mode}.`,
          traceCheck.route,
        );
      }
    }

    if (health.score !== null && health.score < 70) {
      add(checks, "WARN", "low-health-score", `Workflow health score is ${health.score}/100 (${health.level}).`, "workflow-health");
    }
  } else {
    add(checks, "PASS", "non-approval-status", `${targetStatus} does not require approval evidence preflight.`, "");
  }

  if ((diagnosis.quality_warnings ?? []).length > 0) {
    add(checks, "WARN", "quality-warnings", `${diagnosis.quality_warnings.length} quality warning(s) are present.`, "workflow-health");
  }

  return {
    gate,
    target_status: targetStatus,
    evidence: evidence || null,
    overall: overall(checks),
    artifact: artifact
      ? {
          id: artifact.id,
          title: artifact.title,
          stage: artifact.stage,
          status: artifactStatus,
        }
      : null,
    health,
    checks,
  };
}
