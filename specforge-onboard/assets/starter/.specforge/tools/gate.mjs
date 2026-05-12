import {
  artifactById,
  exists,
  gateStatus,
  loadSchema,
  parseField,
  readText,
  resolveChange,
  updateChangeStage,
  updateGate,
} from "./lib/specforge.mjs";

const args = process.argv.slice(2);
const gateName = args.find((arg) => !arg.startsWith("--"));
const status = args.find((arg, index) => index > 0 && !arg.startsWith("--"));

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

const requestedChange = argValue("--change");
const evidence = argValue("--evidence");
const validStatuses = new Set(["APPROVED", "REQUEST_CHANGES", "REJECTED", "PENDING"]);

if (!gateName || !status || !validStatuses.has(status)) {
  console.error("Usage: node .specforge/tools/gate.mjs <gate> <APPROVED|REQUEST_CHANGES|REJECTED|PENDING> --evidence <path> [--change <id>]");
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
  updateGate(change.base, gateName, status, status === "APPROVED" ? evidence : null);
  updateChangeStage(change.base, gateArtifact.stage);

  const updatedYaml = readText(`${change.base}/change.yaml`);
  console.log(`Gate updated: ${gateName} = ${gateStatus(updatedYaml, gateName)}`);
  console.log(`Change: ${change.name}`);
  console.log(`Stage: ${gateArtifact.stage}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
