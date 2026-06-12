import { diagnoseWorkItem, diagnoseWorkspace } from "./lib/diagnostics.mjs";
import { implementationQualitySummary } from "./lib/implementation-quality.mjs";
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
    return `# SpecForge Implementation Quality\n\nNo active work item.\n\n- Route: ${diagnosis.route}\n- Reason: ${diagnosis.route_reason}\n`;
  }

  return `# SpecForge Implementation Quality: ${diagnosis.work_item.id}

## Summary

- Tasks: ${quality.summary.tasks}
- Implementation rows: ${quality.summary.implementation_rows}
- Changed files: ${quality.summary.changed_files}
- Excluded files: ${quality.summary.excluded_files}
- Git files: ${quality.summary.git_files}${quality.git.available ? "" : " (git unavailable)"}
- Failures: ${quality.summary.fail}
- Warnings: ${quality.summary.warn}

## Issues

${bullet(quality.issues, "none", (issue) => `[${issue.severity}] ${issue.path}: ${issue.message} (route=${issue.route})`)}
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

  const quality = diagnosis.work_item ? implementationQualitySummary(diagnosis.work_item.path) : null;

  if (json) {
    console.log(JSON.stringify({ work_item: diagnosis.work_item, implementation_quality: quality }, null, 2));
  } else {
    console.log(markdown(diagnosis, quality));
  }

  process.exit(quality?.summary.fail > 0 ? 1 : 0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
