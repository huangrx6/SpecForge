import { artifactById, effectiveSchema, exists, loadSchema, parseField, readText } from "./specforge.mjs";
import { decisionQualitySummary } from "./decision-quality.mjs";
import { evidenceSummary } from "./evidence.mjs";
import { implementationQualitySummary } from "./implementation-quality.mjs";
import { sourceQualitySummary } from "./source-quality.mjs";
import { normalizeTraceabilityPolicy, traceabilityGapChecks } from "./traceability.mjs";
import { wikiQualitySummary } from "./wiki-quality.mjs";
import { workflowHealth } from "./workflow-health.mjs";
import { qualitySuiteSummary } from "./quality-suite.mjs";

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
    const qualitySuite = qualitySuiteSummary(diagnosis);
    return { gate, target_status: targetStatus, overall: overall(checks), checks, health: workflowHealth(diagnosis, { qualitySuite }), quality_suite: qualitySuite, artifact: null };
  }

  const yaml = readText(`${diagnosis.work_item.path}/work.yaml`);
  const workflow = parseField(yaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), yaml);
  const gateArtifact = schema.artifacts.find((artifact) => artifact.gate === gate);
  const artifact = gateArtifact ? artifactById(schema, gateArtifact.id) : null;
  const artifactStatus = diagnosis.artifacts.find((item) => item.id === gateArtifact?.id)?.status ?? "unknown";
  const qualitySuite = qualitySuiteSummary(diagnosis);
  const health = workflowHealth(diagnosis, { qualitySuite });

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

    const decisionQuality = decisionQualitySummary(diagnosis);
    add(
      checks,
      decisionQuality.summary.fail === 0 ? (decisionQuality.summary.warn === 0 ? "PASS" : "WARN") : "FAIL",
      "decision-quality",
      `Decision quality: open=${decisionQuality.summary.open}, confirmed=${decisionQuality.summary.confirmed}, risk=${decisionQuality.summary.risk_acceptance}, fail=${decisionQuality.summary.fail}, warn=${decisionQuality.summary.warn}.`,
      "decision-quality",
    );
    for (const decisionIssue of decisionQuality.issues) {
      add(
        checks,
        decisionIssue.severity,
        `decision-${decisionIssue.code}`,
        `${decisionIssue.path}:${decisionIssue.line} ${decisionIssue.message}`,
        decisionIssue.route,
      );
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

    add(
      checks,
      qualitySuite.summary.overall === "PASS" ? "PASS" : qualitySuite.summary.overall,
      "quality-suite",
      `Quality suite: ${qualitySuite.summary.overall}; checks=${qualitySuite.summary.checked}; fail=${qualitySuite.summary.failures}; warn=${qualitySuite.summary.warnings}.`,
      "quality-suite",
    );

    if (gate === "verification") {
      const evidence = evidenceSummary(diagnosis.work_item.path);
      add(
        checks,
        evidence.exists ? "PASS" : "FAIL",
        evidence.exists ? "verification-report-exists" : "verification-report-missing",
        evidence.exists ? `Verification report exists: ${evidence.report_path}.` : `Verification report is missing: ${evidence.report_path}.`,
        "evidence-summary",
      );
      add(
        checks,
        evidence.rows.length > 0 ? "PASS" : "FAIL",
        evidence.rows.length > 0 ? "graded-evidence-present" : "graded-evidence-missing",
        evidence.rows.length > 0
          ? `Evidence grading rows found: ${evidence.rows.length}.`
          : "No parseable evidence grading rows found in verification report.",
        "evidence-summary",
      );
      for (const issue of evidence.issues) {
        add(checks, issue.severity, `evidence-${issue.code}`, issue.message, "evidence-summary");
      }
    }

    if (gate === "spec_review") {
      const sourceQuality = sourceQualitySummary(diagnosis.work_item.path);
      add(
        checks,
        sourceQuality.summary.checked_artifacts > 0 ? "PASS" : "WARN",
        sourceQuality.summary.checked_artifacts > 0 ? "source-quality-artifacts-checked" : "source-quality-no-artifacts",
        sourceQuality.summary.checked_artifacts > 0
          ? `Source quality checked ${sourceQuality.summary.checked_artifacts} artifact(s).`
          : "No research or technical design artifact is available for source quality checks.",
        "source-quality",
      );
      for (const sourceIssue of sourceQuality.issues) {
        add(checks, sourceIssue.severity, `source-${sourceIssue.code}`, `${sourceIssue.path}: ${sourceIssue.message}`, "source-quality");
      }
    }

    if (gate === "code_review") {
      const implementationQuality = implementationQualitySummary(diagnosis.work_item.path);
      add(
        checks,
        implementationQuality.summary.fail === 0 ? (implementationQuality.summary.warn === 0 ? "PASS" : "WARN") : "FAIL",
        "implementation-quality",
        `Implementation quality: tasks=${implementationQuality.summary.tasks}, report=${implementationQuality.summary.implementation_rows}, changed=${implementationQuality.summary.changed_files}, git=${implementationQuality.summary.git_files}, fail=${implementationQuality.summary.fail}, warn=${implementationQuality.summary.warn}.`,
        "implementation-quality",
      );
      for (const implementationIssue of implementationQuality.issues) {
        add(
          checks,
          implementationIssue.severity,
          `implementation-${implementationIssue.code}`,
          `${implementationIssue.path}: ${implementationIssue.message}`,
          implementationIssue.route,
        );
      }
    }

    if (gate === "wiki_sync") {
      const wikiQuality = wikiQualitySummary();
      add(
        checks,
        wikiQuality.exists ? "PASS" : "FAIL",
        wikiQuality.exists ? "wiki-root-exists" : "wiki-root-missing",
        wikiQuality.exists ? `Wiki root exists: ${wikiQuality.wiki_root}.` : `Wiki root is missing: ${wikiQuality.wiki_root}.`,
        "wiki-quality",
      );
      add(
        checks,
        wikiQuality.files.includes("00-index.md") ? "PASS" : "FAIL",
        wikiQuality.files.includes("00-index.md") ? "wiki-index-exists" : "wiki-index-missing",
        wikiQuality.files.includes("00-index.md") ? "Wiki index exists: 00-index.md." : "Wiki index is missing: 00-index.md.",
        "wiki-quality",
      );
      for (const wikiIssue of wikiQuality.issues) {
        add(checks, wikiIssue.severity, `wiki-${wikiIssue.code}`, `${wikiIssue.file}: ${wikiIssue.message}`, "wiki-quality");
      }
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
    quality_suite: qualitySuite,
    checks,
  };
}
