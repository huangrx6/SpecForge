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

function markdown(diagnosis, traceability, policy) {
  if (!diagnosis.work_item) {
    return `# SpecForge Traceability\n\nNo active work item.\n\n- Route: ${diagnosis.route}\n- Reason: ${diagnosis.route_reason}\n`;
  }

  const summary = traceability.summary;
  return `# SpecForge Traceability: ${diagnosis.work_item.id}

## Summary

- Source items: ${summary.source_items}
- Tasks: ${summary.tasks}
- Verification items: ${summary.verification_items}
- Uncovered source items: ${summary.uncovered_sources}
- Tasks missing trace: ${summary.tasks_missing_trace}
- Tasks missing verification: ${summary.tasks_missing_verification}
- Tasks without testcase link: ${summary.tasks_without_testcase}
- Policy mode: ${policy?.mode ?? "advisory"}
- Enforced gates: ${policy?.enforced_gates?.length ? policy.enforced_gates.join(", ") : "none"}

## Uncovered Source Items

${bullet(traceability.gaps.uncovered_sources.slice(0, 20), "none", (item) => `${item.id} ${item.path}:${item.line} - ${item.text}`)}

## Tasks Missing Trace

${bullet(traceability.gaps.tasks_missing_trace.slice(0, 20), "none", (task) => `${task.id} ${task.path}:${task.line} - ${task.title}`)}

## Tasks Missing Verification

${bullet(traceability.gaps.tasks_missing_verification.slice(0, 20), "none", (task) => `${task.id} ${task.path}:${task.line} - ${task.title}`)}

## Tasks Without Test Case Link

${bullet(traceability.gaps.tasks_without_testcase.slice(0, 20), "none", (task) => `${task.id} ${task.path}:${task.line} - ${task.title}`)}

## Verification IDs

${bullet(traceability.gaps.verification_ids, "none", (id) => id)}
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

  const traceability = diagnosis.work_item ? diagnosis.traceability : null;
  const policy = diagnosis.traceability_policy;
  if (json) {
    console.log(JSON.stringify({ work_item: diagnosis.work_item, traceability_policy: policy, traceability }, null, 2));
    process.exit(0);
  }

  console.log(markdown(diagnosis, traceability, policy));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
