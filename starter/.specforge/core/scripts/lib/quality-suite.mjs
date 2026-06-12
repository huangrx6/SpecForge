import { artifactQualitySummary } from "./artifact-quality.mjs";
import { closureQualitySummary } from "./closure-quality.mjs";
import { decisionQualitySummary } from "./decision-quality.mjs";
import { evidenceSummary } from "./evidence.mjs";
import { implementationQualitySummary } from "./implementation-quality.mjs";
import { sourceQualitySummary } from "./source-quality.mjs";
import { exists } from "./specforge.mjs";
import { testCaseQualitySummary } from "./test-case-quality.mjs";
import { normalizeTraceabilityPolicy, traceabilityGapChecks } from "./traceability.mjs";
import { wikiQualitySummary } from "./wiki-quality.mjs";

const stageOrder = [
  "intake",
  "research",
  "gap_report",
  "requirements",
  "ui_design",
  "technical_design",
  "tasks",
  "spec_review",
  "implementation",
  "code_review",
  "verification",
  "wiki_sync",
  "closure",
];

const routesByCheck = {
  "artifact-quality": "artifact-quality",
  "decision-quality": "decision-quality",
  "source-quality": "source-quality",
  traceability: "sf-tasking",
  "implementation-quality": "implementation-quality",
  "test-case-quality": "test-case-quality",
  "evidence-summary": "evidence-summary",
  "wiki-quality": "wiki-quality",
  "closure-quality": "closure-quality",
};

const commandsByCheck = {
  "artifact-quality": ["node .specforge/core/scripts/artifact-quality.mjs"],
  "decision-quality": ["node .specforge/core/scripts/decision-brief.mjs", "node .specforge/core/scripts/decision-quality.mjs"],
  "source-quality": ["node .specforge/core/scripts/source-quality.mjs"],
  traceability: ["node .specforge/core/scripts/traceability-summary.mjs"],
  "implementation-quality": ["node .specforge/core/scripts/implementation-quality.mjs"],
  "test-case-quality": ["node .specforge/core/scripts/test-case-quality.mjs"],
  "evidence-summary": ["node .specforge/core/scripts/evidence-summary.mjs"],
  "wiki-quality": ["node .specforge/core/scripts/wiki-quality.mjs"],
  "closure-quality": ["node .specforge/core/scripts/closure-quality.mjs"],
};

function countIssues(issues = []) {
  return {
    failures: issues.filter((issue) => issue.severity === "FAIL").length,
    warnings: issues.filter((issue) => issue.severity === "WARN").length,
  };
}

function check(id, title, status, message, details = {}) {
  return {
    id,
    title,
    status,
    route: details.route ?? routesByCheck[id] ?? null,
    message,
    failures: details.failures ?? 0,
    warnings: details.warnings ?? 0,
    issues: details.issues ?? [],
    data: details.data ?? null,
  };
}

function statusFromCounts(failures, warnings) {
  if (failures > 0) return "FAIL";
  if (warnings > 0) return "WARN";
  return "PASS";
}

function statusFromIssues(issues = []) {
  const counts = countIssues(issues);
  return statusFromCounts(counts.failures, counts.warnings);
}

function artifactIndex(diagnosis, artifactId) {
  return (diagnosis.artifacts ?? []).findIndex((artifact) => artifact.id === artifactId);
}

function readyArtifactIndex(diagnosis) {
  const index = artifactIndex(diagnosis, diagnosis.ready_artifact);
  if (index !== -1) return index;
  const fallback = stageOrder.indexOf(diagnosis.ready_artifact);
  return fallback === -1 ? -1 : fallback;
}

function artifactReached(diagnosis, artifactId) {
  const target = artifactIndex(diagnosis, artifactId);
  const current = readyArtifactIndex(diagnosis);
  if (target !== -1 && current !== -1) return current >= target;
  const targetStage = stageOrder.indexOf(artifactId);
  return targetStage !== -1 && current >= targetStage;
}

function artifactOutputExists(diagnosis, artifactId) {
  const artifact = (diagnosis.artifacts ?? []).find((item) => item.id === artifactId);
  if (!artifact || !diagnosis.work_item) return false;
  return (artifact.outputs ?? []).some((outputEntry) => {
    const outputPath = typeof outputEntry === "string" ? outputEntry : outputEntry.output;
    return outputPath && exists(`${diagnosis.work_item.path}/${outputPath}`);
  });
}

function anyOutputExists(diagnosis, artifactIds) {
  return artifactIds.some((artifactId) => artifactOutputExists(diagnosis, artifactId));
}

function pSeverityToStatus(severity) {
  if (["P0", "P1", "FAIL"].includes(severity)) return "FAIL";
  return "WARN";
}

function traceabilityChecks(diagnosis) {
  const policy = diagnosis.traceability_policy?.mode
    ? diagnosis.traceability_policy
    : normalizeTraceabilityPolicy(diagnosis.traceability_policy ?? {});
  const gaps = traceabilityGapChecks(diagnosis.traceability, policy);
  const issues = gaps.map((gap) => ({
    severity: pSeverityToStatus(gap.severity),
    code: gap.key,
    path: gap.path,
    message: gap.message,
    route: gap.route,
    policy_severity: gap.severity,
  }));
  const counts = countIssues(issues);
  return check(
    "traceability",
    "Traceability",
    statusFromCounts(counts.failures, counts.warnings),
    gaps.length === 0
      ? `Traceability policy ${policy.mode} has no current gaps.`
      : `Traceability policy ${policy.mode} found ${gaps.length} gap(s).`,
    {
      route: gaps[0]?.route ?? "sf-tasking",
      failures: counts.failures,
      warnings: counts.warnings,
      issues,
      data: { policy_mode: policy.mode, gaps },
    },
  );
}

function artifactQualityCheck(diagnosis) {
  const quality = artifactQualitySummary(diagnosis);
  const counts = countIssues(quality.issues);
  return check(
    "artifact-quality",
    "Artifact Readability",
    statusFromCounts(counts.failures, counts.warnings),
    `Checked ${quality.outputs.filter((output) => output.exists).length} existing output(s), ${quality.issues.length} issue(s).`,
    {
      failures: counts.failures,
      warnings: counts.warnings,
      issues: quality.issues,
      data: quality,
    },
  );
}

function decisionQualityCheck(diagnosis) {
  const quality = decisionQualitySummary(diagnosis);
  return check(
    "decision-quality",
    "Decision Closure",
    statusFromCounts(quality.summary.fail, quality.summary.warn),
    `Open=${quality.summary.open}, confirmed=${quality.summary.confirmed}, risk_acceptance=${quality.summary.risk_acceptance}.`,
    {
      failures: quality.summary.fail,
      warnings: quality.summary.warn,
      issues: quality.issues,
      data: quality,
    },
  );
}

function sourceQualityCheck(diagnosis) {
  const quality = sourceQualitySummary(diagnosis.work_item.path);
  return check(
    "source-quality",
    "Source Quality",
    statusFromCounts(quality.summary.fail, quality.summary.warn),
    `Checked ${quality.summary.checked_artifacts} source-bearing artifact(s).`,
    {
      failures: quality.summary.fail,
      warnings: quality.summary.warn,
      issues: quality.issues,
      data: quality,
    },
  );
}

function implementationQualityCheck(diagnosis) {
  const quality = implementationQualitySummary(diagnosis.work_item.path);
  return check(
    "implementation-quality",
    "Implementation Ledger",
    statusFromCounts(quality.summary.fail, quality.summary.warn),
    `Tasks=${quality.summary.tasks}, report=${quality.summary.implementation_rows}, changed=${quality.summary.changed_files}, git=${quality.summary.git_files}.`,
    {
      failures: quality.summary.fail,
      warnings: quality.summary.warn,
      issues: quality.issues,
      data: quality,
    },
  );
}

function evidenceCheck(diagnosis) {
  const summary = evidenceSummary(diagnosis.work_item.path);
  const counts = countIssues(summary.issues);
  return check(
    "evidence-summary",
    "Verification Evidence",
    statusFromCounts(counts.failures, counts.warnings),
    `Evidence levels: proven=${summary.counts.proven}, mocked=${summary.counts.mocked}, manual=${summary.counts["manual-confirmed"]}, deferred=${summary.counts.deferred}, missing=${summary.counts.missing}.`,
    {
      failures: counts.failures,
      warnings: counts.warnings,
      issues: summary.issues,
      data: summary,
    },
  );
}

function testCaseQualityCheck(diagnosis) {
  const quality = testCaseQualitySummary(diagnosis.work_item.path);
  const counts = countIssues(quality.issues);
  return check(
    "test-case-quality",
    "Test Case Quality",
    statusFromCounts(counts.failures, counts.warnings),
    `Test cases=${quality.summary?.test_cases ?? 0}, Playwright=${quality.summary?.playwright_cases ?? 0}, design artifacts=${quality.summary?.test_design_artifacts ?? 0}.`,
    {
      failures: counts.failures,
      warnings: counts.warnings,
      issues: quality.issues,
      data: quality,
    },
  );
}

function wikiQualityCheck() {
  const quality = wikiQualitySummary();
  return check(
    "wiki-quality",
    "Wiki Reuse Quality",
    statusFromCounts(quality.summary.fail, quality.summary.warn),
    `Wiki files=${quality.summary.total_files}, current=${quality.summary.current_files}.`,
    {
      failures: quality.summary.fail,
      warnings: quality.summary.warn,
      issues: quality.issues,
      data: quality,
    },
  );
}

function closureQualityCheck(diagnosis) {
  const quality = closureQualitySummary(diagnosis.work_item.path);
  return check(
    "closure-quality",
    "Closure Readiness",
    statusFromCounts(quality.summary.fail, quality.summary.warn),
    `Release=${quality.exists.release ? "yes" : "no"}, rollback=${quality.exists.rollback ? "yes" : "no"}, wiki_sync=${quality.exists.wiki_sync ? "yes" : "no"}.`,
    {
      failures: quality.summary.fail,
      warnings: quality.summary.warn,
      issues: quality.issues,
      data: quality,
    },
  );
}

function overallStatus(checks) {
  if (checks.some((item) => item.status === "FAIL")) return "FAIL";
  if (checks.some((item) => item.status === "WARN")) return "WARN";
  return "PASS";
}

function recommendedCommands(checks) {
  return [
    ...new Set(
      checks
        .filter((item) => ["FAIL", "WARN"].includes(item.status))
        .flatMap((item) => commandsByCheck[item.id] ?? []),
    ),
  ];
}

export function qualitySuiteSummary(diagnosis) {
  if (!diagnosis.work_item) {
    return {
      work_item: null,
      route: diagnosis.route,
      ready_artifact: diagnosis.ready_artifact ?? null,
      checks: [],
      summary: {
        overall: "PASS",
        failures: 0,
        warnings: 0,
        checked: 0,
        skipped: 0,
      },
      recommended_commands: [],
    };
  }

  const checks = [artifactQualityCheck(diagnosis), decisionQualityCheck(diagnosis), traceabilityChecks(diagnosis)];

  if (artifactReached(diagnosis, "technical_design") || anyOutputExists(diagnosis, ["research", "technical_design"])) {
    checks.push(sourceQualityCheck(diagnosis));
  }

  if (
    artifactReached(diagnosis, "code_review") ||
    anyOutputExists(diagnosis, ["implementation"]) ||
    ["implementation", "code_review"].includes(diagnosis.ready_artifact)
  ) {
    checks.push(implementationQualityCheck(diagnosis));
  }

  if (artifactReached(diagnosis, "verification") || anyOutputExists(diagnosis, ["verification"])) {
    checks.push(testCaseQualityCheck(diagnosis));
    checks.push(evidenceCheck(diagnosis));
  }

  if (artifactReached(diagnosis, "wiki_sync") || anyOutputExists(diagnosis, ["wiki_sync"])) {
    checks.push(wikiQualityCheck());
  }

  if (artifactReached(diagnosis, "closure") || anyOutputExists(diagnosis, ["closure"])) {
    checks.push(closureQualityCheck(diagnosis));
  }

  const failures = checks.reduce((total, item) => total + item.failures, 0);
  const warnings = checks.reduce((total, item) => total + item.warnings, 0);

  return {
    work_item: diagnosis.work_item,
    route: diagnosis.route,
    ready_artifact: diagnosis.ready_artifact,
    checks,
    recommended_commands: recommendedCommands(checks),
    summary: {
      overall: overallStatus(checks),
      failures,
      warnings,
      checked: checks.length,
      skipped: Math.max(0, Object.keys(routesByCheck).length - checks.length),
    },
  };
}
