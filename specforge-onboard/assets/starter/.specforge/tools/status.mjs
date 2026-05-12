import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const activeRoot = join(root, ".specforge/changes/active");
const archiveRoot = join(root, ".specforge/changes/archive");

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

function listChanges(label, relativeRoot, absoluteRoot) {
  console.log(label);
  if (!existsSync(absoluteRoot)) {
    console.log("- missing directory");
    console.log("");
    return;
  }
  const changes = readdirSync(absoluteRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("CHG-"))
    .map((entry) => entry.name)
    .sort();

  if (changes.length === 0) {
    console.log("- none");
    console.log("");
    return;
  }

  for (const change of changes) {
    const yamlPath = `${relativeRoot}/${change}/change.yaml`;
    if (!existsSync(join(root, yamlPath))) {
      console.log(`- ${change}: missing change.yaml`);
      continue;
    }
    const yaml = read(yamlPath);
    console.log(`- ${field(yaml, "id")}`);
    console.log(`  title: ${field(yaml, "title")}`);
    console.log(`  type: ${field(yaml, "type")}`);
    console.log(`  stage: ${field(yaml, "stage")}`);
    console.log(`  gates: spec=${gateStatus(yaml, "spec_review")}, code=${gateStatus(yaml, "code_review")}, verification=${gateStatus(yaml, "verification")}, ssot=${gateStatus(yaml, "ssot_sync")}`);
  }
  console.log("");
}

console.log("SpecForge Status");
console.log("");

listChanges("Active changes", ".specforge/changes/active", activeRoot);
listChanges("Archived changes", ".specforge/changes/archive", archiveRoot);
