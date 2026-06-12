import { diagnoseWorkspace, diagnoseWorkItem } from "./lib/diagnostics.mjs";
import { contractForArtifact, focusArtifactId } from "./lib/stage-contracts.mjs";
import { effectiveSchema, loadSchema, localDateIso, parseField, readText, resolveWorkItem } from "./lib/specforge.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function bullet(items, emptyText, renderItem = (item) => item) {
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

function decisionKind(marker = "") {
  const normalized = marker.toUpperCase();
  if (normalized.includes("DEPENDENCY")) return "dependency";
  if (normalized.includes("TOOLING")) return "tooling";
  if (normalized.includes("TECH")) return "technical direction";
  if (normalized.includes("UI")) return "UI direction";
  if (normalized.includes("PRODUCT")) return "product direction";
  if (normalized.includes("CLARIFICATION")) return "clarification";
  return "decision";
}

function responseOptions(marker = "") {
  const kind = decisionKind(marker);
  if (kind === "dependency") return "approve dependency / reject dependency / ask for alternatives / defer with owner";
  if (kind === "tooling") return "approve tooling / keep existing tooling / ask for comparison / defer with trigger";
  if (kind === "technical direction") return "approve design direction / choose simpler option / ask for ADR / defer";
  if (kind === "UI direction") return "approve direction / request prototype / choose alternate flow / mark no UI impact";
  if (kind === "product direction") return "approve MVP / narrow scope / split follow-up / reject";
  if (kind === "clarification") return "answer question / mark N/A / authorize default / defer";
  return "approve / reject / ask for more evidence / defer";
}

function topDecision(checkpoints) {
  return checkpoints?.open?.[0] ?? null;
}

function traceabilitySummaryLine(traceability) {
  if (!traceability) return "unavailable";
  const summary = traceability.summary;
  return `sources=${summary.source_items}, tasks=${summary.tasks}, verification=${summary.verification_items}, uncovered=${summary.uncovered_sources}, missing_trace=${summary.tasks_missing_trace}, missing_verification=${summary.tasks_missing_verification}, missing_testcase=${summary.tasks_without_testcase}`;
}

function markdown(diagnosis) {
  const generated = localDateIso();
  if (!diagnosis.work_item) {
    return `# SpecForge Decision Brief

No active work item.

- Route: ${diagnosis.route}
- Reason: ${diagnosis.route_reason}
- Generated: ${generated}
`;
  }

  const item = diagnosis.work_item;
  const checkpoints = diagnosis.decision_checkpoints;
  const contract = activeContract(diagnosis);
  const decision = topDecision(checkpoints);
  const options = responseOptions(decision?.marker);

  return `# SpecForge Decision Brief: ${item.id}

## Snapshot

- Title: ${item.title || "N/A"}
- Path: ${item.path}
- Workflow: ${item.workflow}@${diagnosis.schema.version}
- Stage: ${item.stage}
- Route: ${diagnosis.route}
- Generated: ${generated}

## Decision Needed

${decision ? `- Marker: ${decision.marker}
- Location: ${decision.path}:${decision.line}
- Question / context: ${decision.text}
- Decision kind: ${decisionKind(decision.marker)}
- Acceptable responses: ${options}` : "- No open decision markers."}

## Recommended Reply Format

\`\`\`text
Decision: approve / reject / choose option / defer / ask for more evidence
Scope:
Rationale:
Risk acceptance: yes / no / N/A
Owner:
Revalidation trigger:
\`\`\`

## Current Stage Context

${contract ? `- Artifact: ${contract.id} · ${contract.title}
- Goal: ${contract.goal}
- Exit standard: ${contract.exit}

Must prove:

${bullet(contract.must_prove, "N/A")}` : "- N/A"}

## Evidence Snapshot

- Traceability: ${traceabilitySummaryLine(diagnosis.traceability)}
- Blockers: ${diagnosis.blockers.length}
- Quality warnings: ${diagnosis.quality_warnings.length}
- Open decisions: ${checkpoints.summary.open}
- Risk acceptance candidates: ${checkpoints.summary.risk_acceptance}

## Open Decisions

${bullet(checkpoints.open.slice(0, 10), "none", (entry) => `${entry.marker}: ${entry.path}:${entry.line} - ${entry.text}`)}

## Risk Acceptance Candidates

${bullet(checkpoints.risk_acceptance.slice(0, 10), "none", (entry) => `${entry.path}:${entry.line} - ${entry.text}`)}

## Blockers And Quality Warnings

Blockers:

${bullet(diagnosis.blockers.slice(0, 8), "none", (blocker) => `[${blocker.severity}] ${blocker.message} (route=${blocker.route}; owner=${blocker.owner_artifact})`)}

Quality warnings:

${bullet(diagnosis.quality_warnings.slice(0, 8), "none", (warning) => `[${warning.severity}] ${warning.message} (route=${warning.route}; owner=${warning.owner_artifact})`)}
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

  if (json) {
    console.log(
      JSON.stringify(
        {
          work_item: diagnosis.work_item,
          top_decision: topDecision(diagnosis.decision_checkpoints),
          decision_checkpoints: diagnosis.decision_checkpoints,
          contract: activeContract(diagnosis),
          traceability: diagnosis.traceability,
          blockers: diagnosis.blockers,
          quality_warnings: diagnosis.quality_warnings,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  console.log(markdown(diagnosis));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
