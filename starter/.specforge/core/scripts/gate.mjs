import {
  artifactById,
  effectiveSchema,
  exists,
  gateStatus,
  loadSchema,
  parseField,
  readText,
  resolveWorkItem,
  runHook,
  updateWorkItemStage,
  updateGate,
} from "./lib/specforge.mjs";

const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positionalArgs() {
  const values = [];
  const optionsWithValues = new Set(["--work-item", "--evidence"]);
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
const requestedWorkItem = argValue("--work-item");
const evidence = argValue("--evidence");
const validStatuses = new Set(["APPROVED", "REQUEST_CHANGES", "REJECTED", "PENDING"]);
const strictHooks = args.includes("--strict-hooks");

if (!gateName || !status || !validStatuses.has(status)) {
  console.error("Usage: node .specforge/core/scripts/gate.mjs <gate> <APPROVED|REQUEST_CHANGES|REJECTED|PENDING> --evidence <path> [--work-item <id>] [--strict-hooks]");
  process.exit(1);
}

try {
  const workItem = resolveWorkItem({ workItem: requestedWorkItem, activeOnly: true });
  const workItemYaml = readText(`${workItem.base}/work.yaml`);
  const workflow = parseField(workItemYaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), workItemYaml);
  const artifact = schema.artifacts.find((item) => item.gate === gateName);

  if (!artifact) throw new Error(`Unknown gate for workflow ${workflow}: ${gateName}`);
  if (status === "APPROVED") {
    if (!evidence) throw new Error("APPROVED gate requires --evidence <path>.");
    if (!exists(`${workItem.base}/${evidence}`)) throw new Error(`Evidence does not exist: ${evidence}`);
  }

  const gateArtifact = artifactById(schema, artifact.id);
  const payload = { workItem: workItem.name, workItemBase: workItem.base, gate: gateName, status, evidence };
  const preHook = await runHook("pre-gate", payload);
  if (preHook && preHook.ok === false) {
    throw new Error(`pre-gate hook blocked gate update: ${preHook.message ?? "no message"}`);
  }

  updateGate(workItem.base, gateName, status, status === "APPROVED" ? evidence : null);
  updateWorkItemStage(workItem.base, gateArtifact.stage);

  const updatedYaml = readText(`${workItem.base}/work.yaml`);
  const postHook = await runHook("post-gate", payload);
  if (postHook && postHook.ok === false) {
    const message = `post-gate hook failed: ${postHook.message ?? "no message"}`;
    if (strictHooks) throw new Error(message);
    console.error(message);
  }

  console.log(`Gate updated: ${gateName} = ${gateStatus(updatedYaml, gateName)}`);
  console.log(`Work item: ${workItem.name}`);
  console.log(`Stage: ${gateArtifact.stage}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
