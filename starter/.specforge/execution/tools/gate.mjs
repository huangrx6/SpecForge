import {
  artifactById,
  exists,
  gateStatus,
  loadSchema,
  parseField,
  readText,
  resolveChange,
  runHook,
  updateChangeStage,
  updateGate,
} from "./lib/specforge.mjs";

const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positionalArgs() {
  const values = [];
  const optionsWithValues = new Set(["--change", "--evidence"]);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      if (optionsWithValues.has(arg)) i += 1;
      continue;
    }
    values.push(arg);
  }
  return values;
}

const [gateName, status] = positionalArgs();
const requestedChange = argValue("--change");
const evidence = argValue("--evidence");
const validStatuses = new Set(["APPROVED", "REQUEST_CHANGES", "REJECTED", "PENDING"]);
const strictHooks = args.includes("--strict-hooks");

if (!gateName || !status || !validStatuses.has(status)) {
  console.error("Usage: node .specforge/execution/tools/gate.mjs <gate> <APPROVED|REQUEST_CHANGES|REJECTED|PENDING> --evidence <path> [--change <id>] [--strict-hooks]");
  process.exit(1);
}

try {
  const change = resolveChange({ change: requestedChange, activeOnly: true });
  const changeYaml = readText(`${change.base}/change.yaml`);
  const workflow = parseField(changeYaml, "workflow") || "standard";
  const schema = loadSchema(workflow);
  const artifact = schema.artifacts.find((item) => item.gate === gateName);

  if (!artifact) throw new Error(`Unknown gate for workflow ${workflow}: ${gateName}`);
  if (status === "APPROVED") {
    if (!evidence) throw new Error("APPROVED gate requires --evidence <path>.");
    if (!exists(`${change.base}/${evidence}`)) throw new Error(`Evidence does not exist: ${evidence}`);
  }

  const gateArtifact = artifactById(schema, artifact.id);
  const payload = { change: change.name, changeBase: change.base, gate: gateName, status, evidence };
  const preHook = await runHook("pre-gate", payload);
  if (preHook && preHook.ok === false) {
    throw new Error(`pre-gate hook blocked gate update: ${preHook.message ?? "no message"}`);
  }

  updateGate(change.base, gateName, status, status === "APPROVED" ? evidence : null);
  updateChangeStage(change.base, gateArtifact.stage);

  const updatedYaml = readText(`${change.base}/change.yaml`);
  const postHook = await runHook("post-gate", payload);
  if (postHook && postHook.ok === false) {
    const message = `post-gate hook failed: ${postHook.message ?? "no message"}`;
    if (strictHooks) throw new Error(message);
    console.error(message);
  }

  console.log(`Gate updated: ${gateName} = ${gateStatus(updatedYaml, gateName)}`);
  console.log(`Change: ${change.name}`);
  console.log(`Stage: ${gateArtifact.stage}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
