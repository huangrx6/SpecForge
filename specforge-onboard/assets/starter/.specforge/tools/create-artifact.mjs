import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

const requestedChange = argValue("--change");
const artifactId = args.find((arg) => !arg.startsWith("--") && arg !== requestedChange);

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function write(relativePath, content) {
  const path = join(root, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
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
  const dir = join(root, ".specforge/changes/active");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("CHG-"))
    .map((entry) => entry.name)
    .sort();
}

function resolveChangeName() {
  if (requestedChange) return requestedChange;
  const active = listActiveChanges();
  if (active.length === 0) {
    console.error("No active changes found.");
    process.exit(1);
  }
  if (active.length > 1) {
    console.error("Multiple active changes found. Pass --change <id>:");
    for (const change of active) console.error(`- ${change}`);
    process.exit(1);
  }
  return active[0];
}

function resolveChangeBase(changeName) {
  const activeBase = `.specforge/changes/active/${changeName}`;
  if (existsSync(join(root, activeBase, "change.yaml"))) return activeBase;
  console.error(`Active change not found: ${changeName}`);
  process.exit(1);
}

function loadSchema(workflow) {
  const schemaPath = `.specforge/schemas/${workflow}.json`;
  if (!existsSync(join(root, schemaPath))) {
    console.error(`Missing workflow schema: ${schemaPath}`);
    process.exit(1);
  }
  return JSON.parse(read(schemaPath));
}

function outputsExist(changeBase, outputs) {
  return outputs.every((output) => existsSync(join(root, changeBase, output)));
}

function artifactState(changeYaml, changeBase, artifact, states) {
  const depsDone = artifact.requires.every((id) => states.get(id) === "done");
  const filesExist = outputsExist(changeBase, artifact.outputs);

  if (artifact.gate) {
    if (gateStatus(changeYaml, artifact.gate) === "APPROVED") return "done";
    return depsDone ? "ready" : "blocked";
  }

  if (!depsDone) return "blocked";
  if (filesExist) return "done";
  return "ready";
}

const templateByOutput = new Map([
  ["00-intake/brief.md", "brief.md"],
  ["01-spec/requirements.md", "requirements.md"],
  ["01-spec/design.md", "design.md"],
  ["01-spec/tasks.md", "tasks.md"],
  ["02-spec-review/spec-review-v1.md", "spec-review.md"],
  ["03-implementation/plan.md", "implementation-plan.md"],
  ["03-implementation/report.md", "implementation-report.md"],
  ["03-implementation/changed-files.md", "changed-files.md"],
  ["04-code-review/code-review-v1.md", "code-review.md"],
  ["05-verification/report.md", "verification-report.md"],
  ["05-verification/ci-result.md", "ci-result.md"],
  ["06-closure/release.md", "release.md"],
  ["06-closure/rollback.md", "rollback.md"],
  ["06-closure/ssot-sync.md", "ssot-sync.md"],
]);

function renderOutput(output) {
  if (output === "00-intake/original-request.md") {
    return "# 原始请求\n\n";
  }
  const templateName = templateByOutput.get(output);
  if (!templateName) {
    console.error(`No template mapped for output: ${output}`);
    process.exit(1);
  }
  return read(`.specforge/templates/${templateName}`);
}

function updateChangeStage(changeBase, artifactStage) {
  const path = `${changeBase}/change.yaml`;
  let yaml = read(path);
  yaml = yaml.replace(/^stage:\s*.+$/m, `stage: ${artifactStage}`);
  const today = new Date().toISOString().slice(0, 10);
  yaml = yaml.replace(/^updated_at:\s*.+$/m, `updated_at: ${today}`);
  write(path, yaml);
}

const changeName = resolveChangeName();
const changeBase = resolveChangeBase(changeName);
const changeYamlPath = `${changeBase}/change.yaml`;
const changeYaml = read(changeYamlPath);
const workflow = parseField(changeYaml, "workflow") || "standard";
const schema = loadSchema(workflow);
const states = new Map();

for (const artifact of schema.artifacts) {
  states.set(artifact.id, artifactState(changeYaml, changeBase, artifact, states));
}

const artifact = artifactId
  ? schema.artifacts.find((item) => item.id === artifactId)
  : schema.artifacts.find((item) => states.get(item.id) === "ready");

if (!artifact) {
  console.error(artifactId ? `Unknown artifact: ${artifactId}` : "No ready artifact found.");
  process.exit(1);
}

const state = states.get(artifact.id);
if (state === "blocked") {
  console.error(`Artifact is blocked: ${artifact.id}`);
  console.error(`Requires: ${artifact.requires.join(", ") || "none"}`);
  process.exit(1);
}
if (state === "done" && !force) {
  console.log(`Artifact already exists or is approved: ${artifact.id}`);
  console.log("Use --force to recreate output files.");
  process.exit(0);
}

const planned = [];
for (const output of artifact.outputs) {
  const target = `${changeBase}/${output}`;
  if (existsSync(join(root, target)) && !force) {
    planned.push({ output, action: "skip" });
    continue;
  }
  planned.push({ output, action: "write" });
}

if (dryRun) {
  console.log(`Would create artifact: ${artifact.id}`);
  for (const item of planned) console.log(`- ${item.action}: ${item.output}`);
  process.exit(0);
}

for (const item of planned) {
  if (item.action === "skip") continue;
  write(`${changeBase}/${item.output}`, renderOutput(item.output));
}

updateChangeStage(changeBase, artifact.stage);

console.log(`Artifact ready: ${artifact.id}`);
for (const item of planned) console.log(`- ${item.action}: ${item.output}`);
