import { artifactQualitySummary } from "./lib/artifact-quality.mjs";
import { diagnoseWorkItem, diagnoseWorkspace } from "./lib/diagnostics.mjs";
import { resolveWorkItem } from "./lib/specforge.mjs";

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
    return `# SpecForge Artifact Quality\n\nNo active work item.\n\n- Route: ${diagnosis.route}\n- Reason: ${diagnosis.route_reason}\n`;
  }

  const existingOutputs = quality.outputs.filter((output) => output.exists);
  const outputsWithSummary = existingOutputs.filter((output) => output.summary);

  return `# SpecForge Artifact Quality: ${diagnosis.work_item.id}

## Summary

- Existing outputs: ${existingOutputs.length}
- Outputs with summary: ${outputsWithSummary.length}
- Issues: ${quality.issues.length}

## Issues

${bullet(quality.issues, "none", (issue) => `[${issue.severity}] ${issue.artifact}/${issue.path}: ${issue.message}`)}

## Outputs

| Artifact | Output | Exists | Lines | Summary |
|---|---|---|---|---|
${quality.outputs.map((output) => `| ${output.artifact} | ${output.path} | ${output.exists ? "yes" : "no"} | ${output.non_empty_lines} | ${output.summary ? `${output.summary.heading} (${output.summary.lines} lines)` : "none"} |`).join("\n")}
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

  const quality = artifactQualitySummary(diagnosis);

  if (json) {
    console.log(JSON.stringify({ work_item: diagnosis.work_item, artifact_quality: quality }, null, 2));
    process.exit(0);
  }

  console.log(markdown(diagnosis, quality));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
