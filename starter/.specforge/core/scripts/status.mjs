import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { layout } from "./lib/specforge.mjs";

const root = process.cwd();
const activeRoot = join(root, layout.workItems, "active");
const archiveRoot = join(root, layout.workItems, "archive");

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function field(text, name) {
  return text.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? "unknown";
}

function gateStatus(text, gateName) {
  const markerMatch = text.match(new RegExp(`(?:^|\\r?\\n)  ${gateName}:\\r?\\n`));
  if (!markerMatch || markerMatch.index === undefined) return "missing";
  const rest = text.slice(markerMatch.index + markerMatch[0].length);
  const next = rest.search(/\r?\n  [a-z_]+:\r?\n/);
  const block = next === -1 ? rest : rest.slice(0, next);
  return block.match(/status:\s*([A-Z_]+)/)?.[1] ?? "unknown";
}

function listWorkItems(label, relativeRoot, absoluteRoot) {
  console.log(label);
  if (!existsSync(absoluteRoot)) {
    console.log("- missing directory");
    console.log("");
    return;
  }
  const workItems = readdirSync(absoluteRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(absoluteRoot, entry.name, "work.yaml")))
    .map((entry) => entry.name)
    .sort();

  if (workItems.length === 0) {
    console.log("- none");
    console.log("");
    return;
  }

  for (const workItem of workItems) {
    const yamlPath = `${relativeRoot}/${workItem}/work.yaml`;
    if (!existsSync(join(root, yamlPath))) {
      console.log(`- ${workItem}: missing work.yaml`);
      continue;
    }
    const yaml = read(yamlPath);
    console.log(`- ${field(yaml, "id")}`);
    console.log(`  title: ${field(yaml, "title")}`);
    console.log(`  type: ${field(yaml, "type")}`);
    console.log(`  workflow: ${field(yaml, "workflow") || "standard"}`);
    console.log(`  stage: ${field(yaml, "stage")}`);
    console.log(`  gates: spec=${gateStatus(yaml, "spec_review")}, code=${gateStatus(yaml, "code_review")}, verification=${gateStatus(yaml, "verification")}, wiki=${gateStatus(yaml, "wiki_sync")}`);
  }
  console.log("");
}

console.log("SpecForge Status");
console.log("");

listWorkItems("Active work items", `${layout.workItems}/active`, activeRoot);
listWorkItems("Archived work items", `${layout.workItems}/archive`, archiveRoot);
