import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { artifactLine, diagnoseWorkspace, diagnoseWorkItem, gateLine } from "./lib/diagnostics.mjs";
import { contractForArtifact, focusArtifactId } from "./lib/stage-contracts.mjs";
import { abs, effectiveSchema, loadSchema, localDateIso, parseField, readText, resolveWorkItem } from "./lib/specforge.mjs";
import { workflowHealth } from "./lib/workflow-health.mjs";
import { actionCommands, actionReason, actionState, readingOrder, traceGapCount, traceabilityPolicyLine } from "./lib/action-board.mjs";

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

function topQualityWarnings(warnings) {
  return bullet(warnings?.slice(0, 8), "none", (warning) => {
    const missing = warning.missing_sections?.length > 0 ? `; missing=${warning.missing_sections.join(", ")}` : "";
    return `[${warning.severity}] ${warning.message} (route=${warning.route}; owner=${warning.owner_artifact}${missing})`;
  });
}

function traceabilityLine(traceability) {
  if (!traceability) return "unavailable";
  const s = traceability.summary;
  return `sources=${s.source_items}, tasks=${s.tasks}, verification=${s.verification_items}, uncovered=${s.uncovered_sources}, missing_trace=${s.tasks_missing_trace}, missing_verification=${s.tasks_missing_verification}, missing_testcase=${s.tasks_without_testcase}`;
}

function activeContract(diagnosis) {
  if (!diagnosis.work_item) return null;
  const workItemYaml = readText(`${diagnosis.work_item.path}/work.yaml`);
  const workflow = parseField(workItemYaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), workItemYaml);
  return contractForArtifact(schema, focusArtifactId(diagnosis));
}

function shortList(items) {
  if (!items || items.length === 0) return "- N/A";
  return items.slice(0, 5).map((item) => `- ${item}`).join("\n");
}

function suggestedEvidencePath(contract) {
  const preferredByGate = {
    spec_review: "spec-review-v1.md",
    code_review: "code-review-v1.md",
    verification: "report.md",
    wiki_sync: "wiki-sync.md",
  };
  const preferred = preferredByGate[contract?.gate];
  if (preferred) {
    const match = contract.outputs?.find((output) => output.endsWith(preferred));
    if (match) return match;
  }
  return contract?.outputs?.[0] ?? "<evidence-path>";
}

function priorityList(health) {
  return bullet(health.priorities?.slice(0, 5), "none", (item) => `[${item.severity}] ${item.area}: ${item.message} (route=${item.route || "N/A"})`);
}

function auditCommands(diagnosis) {
  return actionCommands(diagnosis).filter((command) => !command.includes("workflow-audit.mjs"));
}

function markdown(diagnosis) {
  const generated = localDateIso();
  const health = workflowHealth(diagnosis);
  const status = actionState(diagnosis, health);

  if (!diagnosis.work_item) {
    return `# SpecForge Workflow Audit

## Action Summary

- Audit status: ${status}
- Health level: ${health.level}
- Route: ${diagnosis.route}
- Next: ${actionReason(diagnosis)}
- Generated: ${generated}

## Checks

- Blockers: ${diagnosis.blockers?.length ?? 0}
- Quality warnings: ${diagnosis.quality_warnings?.length ?? 0}
- Open decisions: ${diagnosis.decision_checkpoints?.summary?.open ?? 0}

## Top Priorities

${priorityList(health)}

## Recommended Commands

\`\`\`bash
${auditCommands(diagnosis).join("\n")}
\`\`\`
`;
  }

  const item = diagnosis.work_item;
  const contract = activeContract(diagnosis);
  return `# SpecForge Workflow Audit: ${item.id}

## Snapshot

- Audit status: ${status}
- Health score: ${health.score}/100
- Health level: ${health.level}
- Title: ${item.title || "N/A"}
- Path: ${item.path}
- Workflow: ${item.workflow}@${diagnosis.schema.version}
- Stage: ${item.stage}
- Progress: ${diagnosis.progress.done}/${diagnosis.progress.total}
- Ready artifact: ${diagnosis.ready_artifact ?? "none"}
- Route: ${diagnosis.route}
- Generated: ${generated}

## Action Summary

- State: ${status}
- Next: ${actionReason(diagnosis)}
- Health: ${health.score}/100 (${health.level})
- Open decisions: ${diagnosis.decision_checkpoints?.summary?.open ?? 0}
- Blockers: ${diagnosis.blockers?.length ?? 0}
- Trace gaps: ${traceGapCount(diagnosis.traceability)}
- Traceability policy: ${traceabilityPolicyLine(diagnosis.traceability_policy)}

Top priorities:

${priorityList(health)}

Recommended commands:

\`\`\`bash
${auditCommands(diagnosis).join("\n")}
\`\`\`

Read first:

${bullet(readingOrder(), "N/A", (item) => item)}

## Current Stage Contract

${contract ? `- Artifact: ${contract.id} · ${contract.title}
- Goal: ${contract.goal}
- Exit: ${contract.exit}

Must prove:

${shortList(contract.must_prove)}

Gate commands:

${contract.gate ? `\`\`\`bash
node .specforge/core/scripts/gate-preflight.mjs ${contract.gate} APPROVED --evidence ${suggestedEvidencePath(contract)}
specforge gate --dir . ${contract.gate} APPROVED --evidence ${suggestedEvidencePath(contract)}
\`\`\`` : "- N/A"}` : "- N/A"}

## Gate And Graph

- Gates: ${gateLine(diagnosis.gates)}
- Graph: ${artifactLine(diagnosis.artifacts)}

## Blockers

${bullet(diagnosis.blockers, "none", (blocker) => `[${blocker.severity}] ${blocker.message} (route=${blocker.route}; owner=${blocker.owner_artifact})`)}

## Human Decisions

- Open: ${diagnosis.decision_checkpoints?.summary?.open ?? 0}
- Confirmed: ${diagnosis.decision_checkpoints?.summary?.confirmed ?? 0}
- Risk acceptance candidates: ${diagnosis.decision_checkpoints?.summary?.risk_acceptance ?? 0}

${bullet(diagnosis.decision_checkpoints?.open?.slice(0, 8), "none", (entry) => `${entry.marker}: ${entry.path}:${entry.line} - ${entry.text}`)}

## Traceability

- ${traceabilityLine(diagnosis.traceability)}

Top trace gaps:

${bullet(diagnosis.traceability?.gaps?.uncovered_sources?.slice(0, 5), "none", (item) => `${item.id} ${item.path}:${item.line}`)}

## Quality Warnings

${topQualityWarnings(diagnosis.quality_warnings)}

## Reading Order

${readingOrder().map((item, index) => `${index + 1}. ${item}`).join("\n")}
`;
}

try {
  const requestedWorkItem = argValue("--work-item");
  const output = argValue("--output");
  let diagnosis;

  if (requestedWorkItem) {
    const workItem = resolveWorkItem({ workItem: requestedWorkItem, activeOnly: false });
    diagnosis = diagnoseWorkItem({ workItem: workItem.name, activeOnly: false });
  } else {
    diagnosis = diagnoseWorkspace();
  }

  if (json) {
    const health = workflowHealth(diagnosis);
    console.log(JSON.stringify({ audit_status: actionState(diagnosis, health), health, action_commands: auditCommands(diagnosis), diagnosis }, null, 2));
    process.exit(0);
  }

  const content = markdown(diagnosis);
  if (output) {
    mkdirSync(dirname(abs(output)), { recursive: true });
    writeFileSync(abs(output), content, "utf8");
    console.log(`Wrote SpecForge workflow audit: ${output}`);
  } else {
    console.log(content);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
