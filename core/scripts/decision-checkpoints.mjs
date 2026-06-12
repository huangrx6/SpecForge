import { diagnoseWorkItem, diagnoseWorkspace } from "./lib/diagnostics.mjs";
import { resolveWorkItem } from "./lib/specforge.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function printItems(title, items = [], emptyText) {
  console.log("");
  console.log(title);
  if (items.length === 0) {
    console.log(`- ${emptyText}`);
    return;
  }
  for (const item of items) {
    const marker = item.marker ? `${item.marker} ` : "";
    console.log(`- ${marker}${item.path}:${item.line}`);
    console.log(`  ${item.text}`);
  }
}

try {
  const requestedWorkItem = argValue("--work-item");
  let diagnosis;

  if (requestedWorkItem) {
    const workItem = resolveWorkItem({ workItem: requestedWorkItem, activeOnly: false });
    diagnosis = diagnoseWorkItem({ workItem: workItem.name, activeOnly: false });
  } else {
    const workspace = diagnoseWorkspace();
    if (!workspace.work_item) {
      if (json) {
        console.log(JSON.stringify(workspace.decision_checkpoints, null, 2));
      } else {
        console.log("Decision checkpoints unavailable.");
        console.log(workspace.route_reason);
      }
      process.exit(0);
    }
    diagnosis = workspace;
  }

  const checkpoints = diagnosis.decision_checkpoints;
  if (json) {
    console.log(JSON.stringify({ work_item: diagnosis.work_item, decision_checkpoints: checkpoints }, null, 2));
    process.exit(0);
  }

  console.log("SpecForge Decision Checkpoints");
  console.log(`Work item: ${diagnosis.work_item.id}`);
  console.log(`Path: ${diagnosis.work_item.path}`);
  console.log(
    `Summary: open=${checkpoints.summary.open}, confirmed=${checkpoints.summary.confirmed}, risk_acceptance=${checkpoints.summary.risk_acceptance}`,
  );
  printItems("Open decisions", checkpoints.open, "none");
  printItems("Confirmed decisions", checkpoints.confirmed, "none");
  printItems("Risk acceptance candidates", checkpoints.risk_acceptance, "none");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
