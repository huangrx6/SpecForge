import {
  artifactById,
  computeArtifactStates,
  exists,
  loadSchema,
  nextReadyArtifact,
  parseField,
  readText,
  renderOutput,
  resolveChange,
  updateChangeStage,
  writeText,
} from "./lib/specforge.mjs";

const args = process.argv.slice(2);
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positionalArgs() {
  const values = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      if (["--change"].includes(arg)) i += 1;
      continue;
    }
    values.push(arg);
  }
  return values;
}

const requestedChange = argValue("--change");
const artifactId = positionalArgs()[0];

try {
  const change = resolveChange({ change: requestedChange, activeOnly: true });
  const changeYaml = readText(`${change.base}/change.yaml`);
  const workflow = parseField(changeYaml, "workflow") || "standard";
  const schema = loadSchema(workflow);
  const states = computeArtifactStates(schema, changeYaml, change.base);
  const artifact = artifactId ? artifactById(schema, artifactId) : nextReadyArtifact(schema, states);

  if (!artifact) throw new Error(artifactId ? `Unknown artifact: ${artifactId}` : "No ready artifact found.");

  const state = states.get(artifact.id);
  if (state === "blocked") {
    throw new Error(`Artifact is blocked: ${artifact.id}\nRequires: ${artifact.requires.join(", ") || "none"}`);
  }
  if (state === "done" && !force) {
    console.log(`Artifact already exists or is approved: ${artifact.id}`);
    console.log("Use --force to recreate output files.");
    process.exit(0);
  }

  const planned = [];
  for (const output of artifact.outputs) {
    if (exists(`${change.base}/${output}`) && !force) {
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
    writeText(`${change.base}/${item.output}`, renderOutput(item.output));
  }

  updateChangeStage(change.base, artifact.stage);

  console.log(`Artifact ready: ${artifact.id}`);
  for (const item of planned) console.log(`- ${item.action}: ${item.output}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
