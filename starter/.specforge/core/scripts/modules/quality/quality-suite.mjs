#!/usr/bin/env node

import { diagnoseWorkItem, diagnoseWorkspace } from "../../lib/diagnostics.mjs";
import { qualitySuiteSummary } from "../../lib/quality-suite.mjs";
import { resolveWorkItem } from "../../lib/specforge.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function bullet(items, emptyText, renderItem) {
  if (!items || items.length === 0) return `- ${emptyText}`;
  return items.map((item) => `- ${renderItem(item)}`).join("\n");
}

function markdown(diagnosis, suite) {
  if (!diagnosis.work_item) {
    return `# SpecForge Quality Suite

No active work item.

- Route: ${diagnosis.route}
- Reason: ${diagnosis.route_reason}
`;
  }

  const issueLines = suite.checks.flatMap((qualityCheck) =>
    (qualityCheck.issues ?? []).map((issue) => ({
      check: qualityCheck.id,
      route: issue.route ?? qualityCheck.route,
      severity: issue.severity,
      path: issue.path ?? issue.file ?? "-",
      message: issue.message,
    })),
  );

  return `# SpecForge Quality Suite: ${diagnosis.work_item.id}

## Summary

- Overall: ${suite.summary.overall}
- Ready artifact: ${suite.ready_artifact ?? "none"}
- Route: ${suite.route}
- Checks: ${suite.summary.checked}
- Skipped by stage: ${suite.summary.skipped}
- Failures: ${suite.summary.failures}
- Warnings: ${suite.summary.warnings}

## Checks

| Check | Status | Fail | Warn | Route | Message |
|---|---:|---:|---:|---|---|
${suite.checks.map((item) => `| ${item.title} | ${item.status} | ${item.failures} | ${item.warnings} | ${item.route ?? "-"} | ${item.message.replace(/\|/g, "\\|")} |`).join("\n")}

## Recommended Commands

\`\`\`bash
${suite.recommended_commands.length > 0 ? suite.recommended_commands.join("\n") : "# none"}
\`\`\`

## Issues

${bullet(issueLines, "none", (issue) => `[${issue.severity}] ${issue.check} ${issue.path}: ${issue.message} (route=${issue.route ?? "-"})`)}
`;
}

try {
  const requestedWorkItem = argValue("--work-item");
  let diagnosis;

  if (requestedWorkItem) {
    const workItem = resolveWorkItem({ workItem: requestedWorkItem, activeOnly: false });
    diagnosis = diagnoseWorkItem({ workItem: workItem.name, activeOnly: false });
  } else {
    diagnosis = diagnoseWorkspace();
  }

  const suite = qualitySuiteSummary(diagnosis);

  if (json) {
    console.log(JSON.stringify({ work_item: diagnosis.work_item, quality_suite: suite }, null, 2));
  } else {
    console.log(markdown(diagnosis, suite));
  }

  process.exit(suite.summary.overall === "FAIL" ? 1 : 0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
