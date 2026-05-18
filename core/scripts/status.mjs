import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { artifactLine, diagnoseWorkspace, gateLine } from "./lib/diagnostics.mjs";
import { layout } from "./lib/specforge.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");
const root = process.cwd();
const archiveRoot = join(root, layout.workItems, "archive");

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function field(text, name) {
  return text.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? "unknown";
}

function archivedWorkItems() {
  if (!existsSync(archiveRoot)) return [];
  return readdirSync(archiveRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(archiveRoot, entry.name, "work.yaml")))
    .map((entry) => {
      const yamlPath = `${layout.workItems}/archive/${entry.name}/work.yaml`;
      const yaml = read(yamlPath);
      return {
        id: field(yaml, "id") || entry.name,
        title: field(yaml, "title"),
        type: field(yaml, "type"),
        workflow: field(yaml, "workflow") || "standard",
        path: yamlPath.replace(/\/work\.yaml$/, ""),
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function printBlockers(blockers) {
  if (!blockers || blockers.length === 0) {
    console.log("Blockers: none");
    return;
  }
  console.log("Blockers:");
  for (const blocker of blockers) {
    console.log(`- [${blocker.severity}] ${blocker.message}`);
    console.log(`  route: ${blocker.route}`);
  }
}

function printActiveSummary(diagnosis) {
  if (!diagnosis.work_item) {
    console.log(`Active work items: ${diagnosis.active_count}`);
    if (diagnosis.active_items.length > 0) {
      for (const item of diagnosis.active_items) console.log(`- ${item.id}: ${item.path}`);
    }
    console.log(`Route: ${diagnosis.route}`);
    console.log(`Reason: ${diagnosis.route_reason}`);
    printBlockers(diagnosis.blockers);
    return;
  }

  const item = diagnosis.work_item;
  console.log(`Active: ${item.id}`);
  console.log(`Path: ${item.path}`);
  console.log(`Title: ${item.title}`);
  console.log(`Type: ${item.type}`);
  console.log(`Workflow: ${item.workflow}@${diagnosis.schema.version}`);
  console.log(`Stage: ${item.stage}`);
  console.log(`Status: ${item.status}`);
  console.log(`Progress: ${diagnosis.progress.done}/${diagnosis.progress.total} done`);
  console.log(`Ready artifact: ${diagnosis.ready_artifact ?? "none"}`);
  console.log(`Route: ${diagnosis.route}`);
  console.log(`Reason: ${diagnosis.route_reason}`);
  console.log(`Gates: ${gateLine(diagnosis.gates)}`);
  console.log(`Graph: ${artifactLine(diagnosis.artifacts)}`);
  printBlockers(diagnosis.blockers);
}

function printArchiveSummary(items) {
  console.log("");
  console.log(`Archived work items: ${items.length}`);
  if (items.length === 0) {
    console.log("- none");
    return;
  }
  for (const item of items) console.log(`- ${item.id}: ${item.title} (${item.workflow}, ${item.type})`);
}

try {
  const diagnosis = diagnoseWorkspace();
  const archive = archivedWorkItems();

  if (json) {
    console.log(JSON.stringify({ ...diagnosis, archive }, null, 2));
    process.exit(0);
  }

  console.log("SpecForge Status");
  console.log("");
  console.log(`Connection: ${diagnosis.workspace_kind}`);
  printActiveSummary(diagnosis);
  printArchiveSummary(archive);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
