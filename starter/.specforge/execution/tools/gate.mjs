import {
  artifactById,
  exists,
  gateStatus,
  layout,
  loadSchema,
  parseField,
  readText,
  resolveChange,
  updateChangeStage,
  updateGate,
} from "./lib/specforge.mjs";
import { pathToFileURL } from "node:url";

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
const strictHooks = args.includes("--strict-hooks");

if (!gateName || !status || !validStatuses.has(status)) {
  console.error("Usage: node .specforge/execution/tools/gate.mjs <gate> <APPROVED|REQUEST_CHANGES|REJECTED|PENDING> --evidence <path> [--change <id>]");
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

async function runHook(name, payload) {
  const candidates = [...new Set([`${layout.projectHooks}/${name}.mjs`, `${layout.hooks}/${name}.mjs`])];
  for (const candidate of candidates) {
    if (!exists(candidate)) continue;
    const mod = await import(pathToFileURL(`${process.cwd()}/${candidate}`).href);
    if (typeof mod.run !== "function") return { ok: true };
    return await mod.run(payload);
  }
  return { ok: true };
}
