import { diagnoseWorkspace, diagnoseWorkItem } from "./lib/diagnostics.mjs";
import { resolveWorkItem } from "./lib/specforge.mjs";
import { workflowHealth } from "./lib/workflow-health.mjs";

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

function markdown(diagnosis, health) {
  if (!diagnosis.work_item) {
    return `# SpecForge Workflow Health

- Level: ${health.level}
- Route: ${diagnosis.route}
- Reason: ${diagnosis.route_reason}

## Priorities

${bullet(health.priorities, "none", (item) => `[${item.severity}] ${item.message} (route=${item.route || "N/A"})`)}
`;
  }

  return `# SpecForge Workflow Health: ${diagnosis.work_item.id}

## Summary

- Score: ${health.score}/100
- Level: ${health.level}
- Route: ${diagnosis.route}
- Ready artifact: ${diagnosis.ready_artifact ?? "none"}

## Dimensions

| Dimension | Status | Count | Penalty |
|---|---|---|---|
${health.dimensions.map((item) => `| ${item.name} | ${item.status} | ${item.count} | ${item.penalty} |`).join("\n")}

## Top Priorities

${bullet(health.priorities, "none", (item) => `[${item.severity}] ${item.area}: ${item.message} (route=${item.route || "N/A"})`)}
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

  const health = workflowHealth(diagnosis);
  if (json) {
    console.log(JSON.stringify({ work_item: diagnosis.work_item, health }, null, 2));
    process.exit(0);
  }

  console.log(markdown(diagnosis, health));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
