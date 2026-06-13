import { closureQualitySummary } from "../../lib/closure-quality.mjs";
import { diagnoseWorkItem, diagnoseWorkspace } from "../../lib/diagnostics.mjs";
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

function markdown(diagnosis, quality) {
  if (!diagnosis.work_item) {
    return `# SpecForge Closure Quality\n\nNo active work item.\n\n- Route: ${diagnosis.route}\n- Reason: ${diagnosis.route_reason}\n`;
  }

  return `# SpecForge Closure Quality: ${diagnosis.work_item.id}

## Summary

- Release exists: ${quality.exists.release ? "yes" : "no"}
- Rollback exists: ${quality.exists.rollback ? "yes" : "no"}
- Wiki sync exists: ${quality.exists.wiki_sync ? "yes" : "no"}
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

  const quality = diagnosis.work_item ? closureQualitySummary(diagnosis.work_item.path) : null;

  if (json) {
    console.log(JSON.stringify({ work_item: diagnosis.work_item, closure_quality: quality }, null, 2));
  } else {
    console.log(markdown(diagnosis, quality));
  }

  process.exit(quality?.summary.fail > 0 ? 1 : 0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
