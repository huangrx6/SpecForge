import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { summarizeOutput } from "./lib/artifact-summary.mjs";
import { diagnoseWorkItem, diagnoseWorkspace, gateLine } from "./lib/diagnostics.mjs";
import { abs, localDateIso, resolveWorkItem } from "./lib/specforge.mjs";

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

function artifactLine(artifact) {
  const deps = artifact.requires.length > 0 ? artifact.requires.join(", ") : "none";
  const missing = artifact.missingDeps.length > 0 ? `; missing=${artifact.missingDeps.join(", ")}` : "";
  const gate = artifact.gate ? `; gate=${artifact.gate}:${artifact.gateStatus}` : "";
  return `${artifact.id}: ${artifact.status} (stage=${artifact.stage}; requires=${deps}${missing}${gate})`;
}

function artifactSummaryLines(workItemBase, artifacts) {
  const lines = [];
  for (const artifact of artifacts) {
    const summaries = artifact.outputs.map((output) => summarizeOutput(workItemBase, output.output, 6));
    if (summaries.every((summary) => !summary.exists)) continue;
    lines.push(`### ${artifact.id}`);
    for (const summary of summaries) {
      if (!summary.exists) continue;
      lines.push(`- ${summary.path} (${summary.heading})`);
      for (const line of summary.lines) lines.push(`  ${line}`);
    }
    lines.push("");
  }
  return lines.length > 0 ? lines.join("\n") : "- none";
}

function markdown(diagnosis) {
  if (!diagnosis.work_item) {
    return `# SpecForge Handoff\n\nNo active work item.\n\n- Route: ${diagnosis.route}\n- Reason: ${diagnosis.route_reason}\n`;
  }

  const item = diagnosis.work_item;
  const checkpoints = diagnosis.decision_checkpoints;
  const done = diagnosis.progress.done;
  const total = diagnosis.progress.total;
  const generated = localDateIso();

  return `# SpecForge Handoff: ${item.id}

## Snapshot

- Title: ${item.title || "N/A"}
- Path: ${item.path}
- Workflow: ${item.workflow}@${diagnosis.schema.version}
- Stage: ${item.stage}
- Status: ${item.status}
- Progress: ${done}/${total}
- Ready artifact: ${diagnosis.ready_artifact ?? "none"}
- Route: ${diagnosis.route}
- Generated: ${generated}

## Next Step

${diagnosis.route_reason}

Recommended commands:

\`\`\`bash
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/instructions.mjs
node .specforge/core/scripts/decision-checkpoints.mjs
node .specforge/core/scripts/artifact-graph-status.mjs
\`\`\`

## Blockers

${bullet(diagnosis.blockers, "none", (blocker) => `[${blocker.severity}] ${blocker.message} (route=${blocker.route}; owner=${blocker.owner_artifact})`)}

## Decision Checkpoints

- Open: ${checkpoints.summary.open}
- Confirmed: ${checkpoints.summary.confirmed}
- Risk acceptance candidates: ${checkpoints.summary.risk_acceptance}

Open decisions:

${bullet(checkpoints.open.slice(0, 8), "none", (entry) => `${entry.marker}: ${entry.path}:${entry.line} - ${entry.text}`)}

Risk acceptance candidates:

${bullet(checkpoints.risk_acceptance.slice(0, 8), "none", (entry) => `${entry.path}:${entry.line} - ${entry.text}`)}

## Quality Warnings

${bullet(diagnosis.quality_warnings, "none", (warning) => `[${warning.severity}] ${warning.message} (owner=${warning.owner_artifact}; missing=${(warning.missing_sections ?? []).join(", ") || "N/A"})`)}

## Gates

- ${gateLine(diagnosis.gates)}

${bullet(diagnosis.gates, "none", (gate) => `${gate.gate}: ${gate.status}; evidence=${gate.evidence ?? "N/A"}; exists=${gate.evidenceExists ? "yes" : "no"}`)}

## Artifact Graph

${bullet(diagnosis.artifacts, "none", artifactLine)}

## Artifact Summaries

${artifactSummaryLines(item.path, diagnosis.artifacts)}

## Source Of Truth

- Markdown artifacts in ${item.path}
- HTML report: ${item.path}/07-report/work-summary.html
- Handoff file: ${item.path}/07-report/handoff.md
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
    console.log(JSON.stringify(diagnosis, null, 2));
    process.exit(0);
  }

  const content = markdown(diagnosis);
  if (output) {
    mkdirSync(dirname(abs(output)), { recursive: true });
    writeFileSync(abs(output), content, "utf8");
    console.log(`Wrote SpecForge handoff summary: ${output}`);
  } else {
    console.log(content);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
