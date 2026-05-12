import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const schemaPath = join(root, ".specforge/schemas/standard.json");
const activeRoot = join(root, ".specforge/changes/active");
const archiveRoot = join(root, ".specforge/changes/archive");

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function parseField(text, name) {
  return text.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? "";
}

function gateStatus(text, gateName) {
  const marker = `  ${gateName}:\n`;
  const start = text.indexOf(marker);
  if (start === -1) return "MISSING";
  const rest = text.slice(start + marker.length);
  const next = rest.search(/\n  [a-z_]+:\n/);
  const block = next === -1 ? rest : rest.slice(0, next);
  return block.match(/status:\s*([A-Z_]+)/)?.[1] ?? "UNKNOWN";
}

function listActiveChanges() {
  if (!existsSync(activeRoot)) return [];
  return readdirSync(activeRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("CHG-"))
    .map((entry) => entry.name)
    .sort();
}

function listArchivedChanges() {
  if (!existsSync(archiveRoot)) return [];
  return readdirSync(archiveRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("CHG-"))
    .map((entry) => entry.name)
    .sort();
}

function resolveChangeName() {
  const requested = process.argv[2];
  if (requested) return requested;
  const active = listActiveChanges();
  if (active.length === 0) {
    const archived = listArchivedChanges();
    if (archived.length === 0) {
      console.log("Artifact graph: no changes yet.");
      console.log("Create the first change with:");
      console.log("node .specforge/tools/create-change.mjs \"Change title\"");
      process.exit(0);
    }
    return archived[archived.length - 1];
  }
  if (active.length > 1) {
    console.error("Multiple active changes found. Pass one change id:");
    for (const change of active) console.error(`- ${change}`);
    process.exit(1);
  }
  return active[0];
}

function resolveChangeBase(changeName) {
  const activeBase = `.specforge/changes/active/${changeName}`;
  if (existsSync(join(root, activeBase, "change.yaml"))) return activeBase;
  const archiveBase = `.specforge/changes/archive/${changeName}`;
  if (existsSync(join(root, archiveBase, "change.yaml"))) return archiveBase;
  console.error(`Change not found in active or archive: ${changeName}`);
  process.exit(1);
}

function outputsExist(changeBase, outputs) {
  return outputs.every((output) => existsSync(join(root, changeBase, output)));
}

function artifactState(schema, changeYaml, changeBase, artifact, states) {
  const depsDone = artifact.requires.every((id) => states.get(id) === "done");
  const filesExist = outputsExist(changeBase, artifact.outputs);

  if (artifact.gate) {
    const status = gateStatus(changeYaml, artifact.gate);
    if (status === "APPROVED") return "done";
    if (!depsDone) return "blocked";
    if (!filesExist) return "ready";
    return depsDone ? "ready" : "blocked";
  }

  if (!depsDone) return "blocked";
  if (filesExist) return "done";
  return "ready";
}

if (!existsSync(schemaPath)) {
  console.error("Missing .specforge/schemas/standard.json");
  process.exit(1);
}

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const changeName = resolveChangeName();
const changeBase = resolveChangeBase(changeName);
const changeYamlPath = `${changeBase}/change.yaml`;

if (!existsSync(join(root, changeYamlPath))) {
  console.error(`Missing change.yaml for ${changeName}`);
  process.exit(1);
}

const changeYaml = read(changeYamlPath);
const states = new Map();

for (const artifact of schema.artifacts) {
  states.set(artifact.id, artifactState(schema, changeYaml, changeBase, artifact, states));
}

console.log(`Artifact graph: ${schema.id}@${schema.version}`);
console.log(`Change: ${changeName}`);
console.log(`Path: ${changeBase}`);
console.log(`Stage: ${parseField(changeYaml, "stage")}`);
console.log("");

for (const artifact of schema.artifacts) {
  const state = states.get(artifact.id);
  const deps = artifact.requires.length > 0 ? artifact.requires.join(", ") : "none";
  const gate = artifact.gate ? `, gate=${artifact.gate}:${gateStatus(changeYaml, artifact.gate)}` : "";
  console.log(`- ${artifact.id}: ${state} (requires=${deps}${gate})`);
}
