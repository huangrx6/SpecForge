#!/usr/bin/env node

import { diagnoseWorkItem, diagnoseWorkspace } from "../../lib/diagnostics.mjs";
import { resolveWorkItem } from "../../lib/specforge.mjs";
import { testCaseQualitySummary } from "../../lib/test-case-quality.mjs";

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

function markdown(diagnosis, quality) {
  if (!diagnosis.work_item) {
    return `# SpecForge Test Case Quality\n\nNo active work item.\n\n- Route: ${diagnosis.route}\n- Reason: ${diagnosis.route_reason}\n`;
  }

  return `# SpecForge Test Case Quality: ${diagnosis.work_item.id}

## Summary

- Test cases: ${quality.summary?.test_cases ?? 0}
- Playwright cases: ${quality.summary?.playwright_cases ?? 0}
- Test design artifacts: ${quality.summary?.test_design_artifacts ?? 0}
- Report case ids: ${quality.summary?.report_case_ids ?? 0}
- Report Playwright ids: ${quality.summary?.report_playwright_ids ?? 0}
- Issues: ${quality.issues.length}

## Issues

${bullet(quality.issues, "none", (issue) => `[${issue.severity}] ${issue.code}: ${issue.message}`)}

## Cases

| ID | Source | Automation | Evidence target | Risk |
|---|---|---|---|---|
${quality.test_cases.map((item) => `| ${item.id} | ${item.source} | ${item.automation} | ${item.evidence_strength_target} | ${item.risk} |`).join("\n")}

## Playwright

| ID | Flow | Role | States | Evidence |
|---|---|---|---|---|
${quality.playwright_cases.map((item) => `| ${item.id} | ${item.flow} | ${item.role} | ${item.states} | ${item.evidence} |`).join("\n")}
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

  const quality = diagnosis.work_item
    ? testCaseQualitySummary(diagnosis.work_item.path)
    : { path: null, exists: false, test_cases: [], playwright_cases: [], test_design_artifacts: [], issues: [] };

  if (json) {
    console.log(JSON.stringify({ work_item: diagnosis.work_item, test_case_quality: quality }, null, 2));
    process.exit(0);
  }

  console.log(markdown(diagnosis, quality));
  process.exit(quality.issues.some((issue) => issue.severity === "FAIL") ? 1 : 0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
