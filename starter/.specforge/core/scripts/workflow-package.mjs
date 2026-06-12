import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { artifactLine, diagnoseWorkspace, diagnoseWorkItem, gateLine } from "./lib/diagnostics.mjs";
import { contractForArtifact, focusArtifactId } from "./lib/stage-contracts.mjs";
import { workflowHealth } from "./lib/workflow-health.mjs";
import { actionCommands, actionReason, actionState, readingOrder, traceGapCount, traceabilityPolicyLine } from "./lib/action-board.mjs";
import { qualitySuiteSummary } from "./lib/quality-suite.mjs";
import {
  abs,
  effectiveSchema,
  layout,
  loadSchema,
  localDateIso,
  parseField,
  readText,
  resolveWorkItem,
} from "./lib/specforge.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");
const skipDerived = args.includes("--skip-derived");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function bullet(items, emptyText, renderItem) {
  if (!items || items.length === 0) return `- ${emptyText}`;
  return items.map((item) => `- ${renderItem(item)}`).join("\n");
}

function activeContract(diagnosis) {
  if (!diagnosis.work_item) return null;
  const yaml = readText(`${diagnosis.work_item.path}/work.yaml`);
  const workflow = parseField(yaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), yaml);
  return contractForArtifact(schema, focusArtifactId(diagnosis));
}

function runScript(script, scriptArgs) {
  const result = spawnSync(process.execPath, [`${layout.tools}/${script}`, ...scriptArgs], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  if (result.status !== 0) {
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
    throw new Error(`${script} failed${output ? `: ${output}` : ""}`);
  }
}

function traceabilityLine(traceability) {
  const summary = traceability.summary;
  return `sources=${summary.source_items}, tasks=${summary.tasks}, verification=${summary.verification_items}, uncovered=${summary.uncovered_sources}, missing_trace=${summary.tasks_missing_trace}, missing_verification=${summary.tasks_missing_verification}, missing_testcase=${summary.tasks_without_testcase}`;
}

function qualitySuiteLine(qualitySuite) {
  if (!qualitySuite?.work_item) return "not applicable";
  return `${qualitySuite.summary.overall}; checks=${qualitySuite.summary.checked}; fail=${qualitySuite.summary.failures}; warn=${qualitySuite.summary.warnings}`;
}

function reviewPackageMarkdown(diagnosis, health, contract, traceability, qualitySuite, generatedAt) {
  const item = diagnosis.work_item;
  const state = actionState(diagnosis, health);
  const commands = [...new Set([...actionCommands(diagnosis), ...(qualitySuite.recommended_commands ?? [])])];
  return `# SpecForge Review Package: ${item.id}

## Snapshot

- Title: ${item.title || "N/A"}
- Path: ${item.path}
- Workflow: ${item.workflow}@${diagnosis.schema.version}
- Stage: ${item.stage}
- Status: ${item.status}
- Progress: ${diagnosis.progress.done}/${diagnosis.progress.total}
- Ready artifact: ${diagnosis.ready_artifact ?? "none"}
- Route: ${diagnosis.route}
- Generated: ${generatedAt}

## Action Summary

- State: ${state}
- Next: ${actionReason(diagnosis)}
- Health: ${health.score}/100 (${health.level})
- Open decisions: ${diagnosis.decision_checkpoints.summary.open}
- Blockers: ${diagnosis.blockers.length}
- Trace gaps: ${traceGapCount(traceability)}
- Quality suite: ${qualitySuiteLine(qualitySuite)}
- Traceability policy: ${traceabilityPolicyLine(diagnosis.traceability_policy)}

Next commands:

\`\`\`bash
${commands.join("\n")}
\`\`\`

Read first:

${bullet(readingOrder(), "N/A", (item) => item)}

## Readiness

- Health score: ${health.score}/100
- Health level: ${health.level}
- Gates: ${gateLine(diagnosis.gates)}
- Traceability: ${traceabilityLine(traceability)}
- Quality suite: ${qualitySuiteLine(qualitySuite)}

Top priorities:

${bullet(health.priorities, "none", (item) => `[${item.severity}] ${item.area}: ${item.message} (route=${item.route || "N/A"})`)}

## Current Stage Contract

${contract ? `- Artifact: ${contract.id} · ${contract.title}
- Goal: ${contract.goal}
- Exit standard: ${contract.exit}

Must prove:

${bullet(contract.must_prove, "N/A", (item) => item)}` : "- N/A"}

## Human Decisions

- Open: ${diagnosis.decision_checkpoints.summary.open}
- Confirmed: ${diagnosis.decision_checkpoints.summary.confirmed}
- Risk acceptance candidates: ${diagnosis.decision_checkpoints.summary.risk_acceptance}

Open decisions:

${bullet(diagnosis.decision_checkpoints.open.slice(0, 10), "none", (entry) => `${entry.marker}: ${entry.path}:${entry.line} - ${entry.text}`)}

Risk acceptance candidates:

${bullet(diagnosis.decision_checkpoints.risk_acceptance.slice(0, 10), "none", (entry) => `${entry.path}:${entry.line} - ${entry.text}`)}

## Blockers And Quality

Blockers:

${bullet(diagnosis.blockers, "none", (blocker) => `[${blocker.severity}] ${blocker.message} (route=${blocker.route}; owner=${blocker.owner_artifact})`)}

Quality warnings:

${bullet(diagnosis.quality_warnings.slice(0, 12), "none", (warning) => `[${warning.severity}] ${warning.message} (route=${warning.route}; owner=${warning.owner_artifact})`)}

## Quality Suite

- Overall: ${qualitySuite.summary.overall}
- Checks: ${qualitySuite.summary.checked}
- Skipped by stage: ${qualitySuite.summary.skipped}
- Failures: ${qualitySuite.summary.failures}
- Warnings: ${qualitySuite.summary.warnings}

Recommended quality commands:

\`\`\`bash
${qualitySuite.recommended_commands.length > 0 ? qualitySuite.recommended_commands.join("\n") : "# none"}
\`\`\`

Checks:

${bullet(qualitySuite.checks, "none", (item) => `[${item.status}] ${item.title}: fail=${item.failures}, warn=${item.warnings}; route=${item.route ?? "N/A"}; ${item.message}`)}

## Artifact Graph

- ${artifactLine(diagnosis.artifacts)}

## Generated Review Assets

- HTML report: ${item.path}/07-report/work-summary.html
- Handoff summary: ${item.path}/07-report/handoff.md
- Review package: ${item.path}/07-report/review-package.md

## Recommended Next Commands

\`\`\`bash
${commands.join("\n")}
\`\`\`
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

  if (!diagnosis.work_item) {
    const payload = {
      work_item: null,
      route: diagnosis.route,
      route_reason: diagnosis.route_reason,
      blockers: diagnosis.blockers,
    };
    if (json) {
      console.log(JSON.stringify(payload, null, 2));
    } else {
      console.log("# SpecForge Review Package");
      console.log("");
      console.log("No active work item.");
      console.log("");
      console.log(`- Route: ${diagnosis.route}`);
      console.log(`- Reason: ${diagnosis.route_reason}`);
    }
    process.exit(0);
  }

  const item = diagnosis.work_item;
  const reportDir = `${item.path}/07-report`;
  const packagePath = `${reportDir}/review-package.md`;
  const htmlPath = `${reportDir}/work-summary.html`;
  const handoffPath = `${reportDir}/handoff.md`;
  const qualitySuite = qualitySuiteSummary(diagnosis);
  const health = workflowHealth(diagnosis, { qualitySuite });
  const contract = activeContract(diagnosis);
  const traceability = diagnosis.traceability;
  const generatedAt = localDateIso();

  mkdirSync(dirname(abs(packagePath)), { recursive: true });
  writeFileSync(abs(packagePath), reviewPackageMarkdown(diagnosis, health, contract, traceability, qualitySuite, generatedAt), "utf8");

  if (!skipDerived) {
    runScript("render-work-report.mjs", ["--work-item", item.id, "--output", htmlPath]);
    runScript("handoff-summary.mjs", ["--work-item", item.id, "--output", handoffPath]);
  }

  const result = {
    work_item: item,
    review_package: packagePath,
    html_report: skipDerived ? null : htmlPath,
    handoff: skipDerived ? null : handoffPath,
    health,
    quality_suite: qualitySuite,
  };

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Wrote SpecForge review package: ${packagePath}`);
    if (!skipDerived) {
      console.log(`Rendered HTML report: ${htmlPath}`);
      console.log(`Wrote handoff summary: ${handoffPath}`);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
