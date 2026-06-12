import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { artifactLine, diagnoseWorkspace, diagnoseWorkItem, gateLine } from "./lib/diagnostics.mjs";
import { contractForArtifact, focusArtifactId } from "./lib/stage-contracts.mjs";
import { abs, effectiveSchema, loadSchema, localDateIso, parseField, readText, resolveWorkItem } from "./lib/specforge.mjs";

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

function auditStatus(diagnosis) {
  if (diagnosis.blockers?.some((blocker) => ["P0", "P1"].includes(blocker.severity))) return "BLOCKED";
  if ((diagnosis.decision_checkpoints?.summary?.open ?? 0) > 0) return "NEEDS_DECISION";
  if ((diagnosis.quality_warnings ?? []).length > 0) return "NEEDS_ATTENTION";
  if (!diagnosis.work_item) return "READY_FOR_INTAKE";
  return "READY";
}

function recommendedCommands(diagnosis) {
  const commands = [
    "node .specforge/core/scripts/doctor.mjs",
    "node .specforge/core/scripts/stage-contract.mjs",
    "node .specforge/core/scripts/instructions.mjs",
    "node .specforge/core/scripts/decision-checkpoints.mjs",
    "node .specforge/core/scripts/traceability-summary.mjs",
  ];

  if (diagnosis.work_item) {
    commands.push("node .specforge/core/scripts/render-work-report.mjs");
    commands.push("node .specforge/core/scripts/handoff-summary.mjs --output <work-item>/07-report/handoff.md");
  }

  return commands;
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

function markdown(diagnosis) {
  const generated = localDateIso();
  const status = auditStatus(diagnosis);

  if (!diagnosis.work_item) {
    return `# SpecForge Workflow Audit

- Audit status: ${status}
- Route: ${diagnosis.route}
- Generated: ${generated}

## Why

${diagnosis.route_reason}

## Checks

- Blockers: ${diagnosis.blockers?.length ?? 0}
- Quality warnings: ${diagnosis.quality_warnings?.length ?? 0}
- Open decisions: ${diagnosis.decision_checkpoints?.summary?.open ?? 0}

## Recommended Commands

\`\`\`bash
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/instructions.mjs
\`\`\`
`;
  }

  const item = diagnosis.work_item;
  const contract = activeContract(diagnosis);
  return `# SpecForge Workflow Audit: ${item.id}

## Snapshot

- Audit status: ${status}
- Title: ${item.title || "N/A"}
- Path: ${item.path}
- Workflow: ${item.workflow}@${diagnosis.schema.version}
- Stage: ${item.stage}
- Progress: ${diagnosis.progress.done}/${diagnosis.progress.total}
- Ready artifact: ${diagnosis.ready_artifact ?? "none"}
- Route: ${diagnosis.route}
- Generated: ${generated}

## Next Move

${diagnosis.route_reason}

Recommended commands:

\`\`\`bash
${recommendedCommands(diagnosis).join("\n")}
\`\`\`

## Current Stage Contract

${contract ? `- Artifact: ${contract.id} · ${contract.title}
- Goal: ${contract.goal}
- Exit: ${contract.exit}

Must prove:

${shortList(contract.must_prove)}` : "- N/A"}

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

1. Resolve P0/P1 blockers or open decisions.
2. Read the ready artifact and its immediate dependencies.
3. Check traceability before implementation or verification.
4. Generate HTML report only when handing off, reviewing, or closing.
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
    console.log(JSON.stringify({ audit_status: auditStatus(diagnosis), diagnosis }, null, 2));
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
