import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { layout } from "./lib/specforge.mjs";

const root = process.cwd();
const schemaPath = join(root, layout.schemas, "standard.json");
const activeRoot = join(root, layout.changes, "active");
const archiveRoot = join(root, layout.changes, "archive");

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function parseField(text, name) {
  return text.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? "";
}

function gateStatus(text, gateName) {
  const markerMatch = text.match(new RegExp(`(?:^|\\r?\\n)  ${gateName}:\\r?\\n`));
  if (!markerMatch || markerMatch.index === undefined) return "MISSING";
  const rest = text.slice(markerMatch.index + markerMatch[0].length);
  const next = rest.search(/\r?\n  [a-z_]+:\r?\n/);
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

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    json: args.includes("--json"),
    changeName: args.find((arg) => !arg.startsWith("--")) ?? "",
  };
}

const args = parseArgs();

function resolveChangeName() {
  const requested = args.changeName;
  if (requested) return requested;
  const active = listActiveChanges();
  if (active.length === 0) {
    const archived = listArchivedChanges();
    if (archived.length === 0) {
      console.log("Artifact graph: no changes yet.");
      console.log("Create the first change with:");
      console.log(`node ${layout.tools}/create-change.mjs "Change title"`);
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
  const activeBase = `${layout.changes}/active/${changeName}`;
  if (existsSync(join(root, activeBase, "change.yaml"))) return activeBase;
  const archiveBase = `${layout.changes}/archive/${changeName}`;
  if (existsSync(join(root, archiveBase, "change.yaml"))) return archiveBase;
  console.error(`Change not found in active or archive: ${changeName}`);
  process.exit(1);
}

function outputsPresent(changeBase, outputs) {
  const presence = outputs.map((output) => ({
    output,
    exists: existsSync(join(root, changeBase, output)),
  }));
  return {
    outputs: presence,
    any: presence.some((item) => item.exists),
    all: presence.every((item) => item.exists),
  };
}

function artifactState(changeYaml, changeBase, artifact, states) {
  const missingDeps = artifact.requires.filter((id) => states.get(id)?.status !== "done");
  const depsDone = missingDeps.length === 0;
  const outputState = outputsPresent(changeBase, artifact.outputs);
  const status = artifact.gate ? gateStatus(changeYaml, artifact.gate) : "";

  if (artifact.gate) {
    if (!depsDone) {
      return { status: "blocked", missingDeps, gateStatus: status, outputState };
    }
    if (status === "APPROVED" && outputState.all) {
      return { status: "done", missingDeps, gateStatus: status, outputState };
    }
    if (outputState.any) {
      return { status: "partial", missingDeps, gateStatus: status, outputState };
    }
    return { status: "ready", missingDeps, gateStatus: status, outputState };
  }

  if (!depsDone) return { status: "blocked", missingDeps, gateStatus: "", outputState };
  if (outputState.all) return { status: "done", missingDeps, gateStatus: "", outputState };
  if (outputState.any) return { status: "partial", missingDeps, gateStatus: "", outputState };
  return { status: "ready", missingDeps, gateStatus: "", outputState };
}

if (!existsSync(schemaPath)) {
  console.error(`Missing ${layout.schemas}/standard.json`);
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
  states.set(artifact.id, artifactState(changeYaml, changeBase, artifact, states));
}

const artifactSummaries = schema.artifacts.map((artifact) => {
  const state = states.get(artifact.id);
  return {
    id: artifact.id,
    title: artifact.title,
    stage: artifact.stage,
    status: state.status,
    requires: artifact.requires,
    missingDeps: state.missingDeps,
    outputs: state.outputState.outputs,
    gate: artifact.gate ?? "",
    gateStatus: state.gateStatus,
  };
});

const doneCount = artifactSummaries.filter((artifact) => artifact.status === "done").length;
const readyArtifacts = artifactSummaries.filter((artifact) => artifact.status === "ready").map((artifact) => artifact.id);
const blockedArtifacts = artifactSummaries
  .filter((artifact) => artifact.status === "blocked")
  .map((artifact) => ({ id: artifact.id, missingDeps: artifact.missingDeps }));

if (args.json) {
  console.log(JSON.stringify({
    schema: { id: schema.id, version: schema.version },
    change: {
      id: changeName,
      path: changeBase,
      stage: parseField(changeYaml, "stage"),
    },
    progress: {
      done: doneCount,
      total: artifactSummaries.length,
    },
    readyArtifacts,
    blockedArtifacts,
    artifacts: artifactSummaries,
  }, null, 2));
  process.exit(0);
}

console.log(`Artifact graph: ${schema.id}@${schema.version}`);
console.log(`Change: ${changeName}`);
console.log(`Path: ${changeBase}`);
console.log(`Stage: ${parseField(changeYaml, "stage")}`);
console.log(`Progress: ${doneCount}/${artifactSummaries.length} done`);
console.log(`Ready: ${readyArtifacts.length > 0 ? readyArtifacts.join(", ") : "none"}`);
console.log("");

for (const artifact of artifactSummaries) {
  const deps = artifact.requires.length > 0 ? artifact.requires.join(", ") : "none";
  const missing = artifact.missingDeps.length > 0 ? `, missing=${artifact.missingDeps.join(", ")}` : "";
  const gate = artifact.gate ? `, gate=${artifact.gate}:${artifact.gateStatus}` : "";
  console.log(`- ${artifact.id}: ${artifact.status} (requires=${deps}${missing}${gate})`);
}
