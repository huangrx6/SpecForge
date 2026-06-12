#!/usr/bin/env node

import { diagnoseWorkspace, diagnoseWorkItem } from "./lib/diagnostics.mjs";
import { gatePreflight } from "./lib/gate-preflight.mjs";
import { resolveWorkItem } from "./lib/specforge.mjs";

const args = process.argv.slice(2);
const validStatuses = new Set(["APPROVED", "REQUEST_CHANGES", "REJECTED", "PENDING"]);

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positionalArgs() {
  const values = [];
  const optionsWithValues = new Set(["--work-item", "--evidence"]);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      if (optionsWithValues.has(arg)) i += 1;
      continue;
    }
    values.push(arg);
  }
  return values;
}

function bullet(items, emptyText, renderItem) {
  if (!items || items.length === 0) return `- ${emptyText}`;
  return items.map((item) => `- ${renderItem(item)}`).join("\n");
}

function nextSteps(result) {
  const blockers = result.checks.filter((check) => check.status === "FAIL");
  const warnings = result.checks.filter((check) => check.status === "WARN");
  if (blockers.length > 0) {
    return bullet(blockers, "none", (check) => `Fix ${check.code}${check.route ? ` via ${check.route}` : ""}: ${check.message}`);
  }
  if (warnings.length > 0) {
    return bullet(warnings, "none", (check) => `Review ${check.code}${check.route ? ` via ${check.route}` : ""}: ${check.message}`);
  }
  return "- Gate can proceed with the requested status.";
}

function markdown(diagnosis, result) {
  const workItem = diagnosis.work_item?.id ?? "none";
  const artifact = result.artifact ? `${result.artifact.id} (${result.artifact.status})` : "none";
  const health = result.health.score === null ? result.health.level : `${result.health.score}/100 (${result.health.level})`;

  return `# SpecForge Gate Preflight: ${result.gate}

## Summary

- Work item: ${workItem}
- Target status: ${result.target_status}
- Overall: ${result.overall}
- Evidence: ${result.evidence ?? "N/A"}
- Artifact: ${artifact}
- Health: ${health}
- Quality suite: ${result.quality_suite?.summary?.overall ?? "N/A"}; fail=${result.quality_suite?.summary?.failures ?? 0}; warn=${result.quality_suite?.summary?.warnings ?? 0}

## Checks

${bullet(result.checks, "none", (check) => `[${check.status}] ${check.code}: ${check.message}${check.route ? ` (route=${check.route})` : ""}`)}

## Quality Suite Commands

\`\`\`bash
${result.quality_suite?.recommended_commands?.length > 0 ? result.quality_suite.recommended_commands.join("\n") : "# none"}
\`\`\`

## Recommended Next

${nextSteps(result)}
`;
}

function usage() {
  console.error("Usage: node .specforge/core/scripts/gate-preflight.mjs <gate> [APPROVED|REQUEST_CHANGES|REJECTED|PENDING] --evidence <path> [--work-item <id>] [--json] [--strict]");
}

const [gateName, statusArg] = positionalArgs();
const targetStatus = statusArg ?? "APPROVED";

if (!gateName || !validStatuses.has(targetStatus)) {
  usage();
  process.exit(1);
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

  const result = gatePreflight(diagnosis, {
    gate: gateName,
    status: targetStatus,
    evidence: argValue("--evidence"),
  });

  if (args.includes("--json")) {
    console.log(JSON.stringify({ work_item: diagnosis.work_item, preflight: result }, null, 2));
  } else {
    console.log(markdown(diagnosis, result));
  }

  if (result.overall === "FAIL") process.exit(1);
  if (result.overall === "WARN" && args.includes("--strict")) process.exit(1);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
