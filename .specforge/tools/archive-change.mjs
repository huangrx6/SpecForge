import {
  appendArchiveRegistryEntry,
  computeArtifactStates,
  loadSchema,
  makeArchiveRegistryEntry,
  movePath,
  normalizeEmptyActive,
  parseField,
  readText,
  removeRegistryEntry,
  resolveChange,
  updateChangeStatus,
  writeText,
} from "./lib/specforge.mjs";

const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

try {
  const requestedChange = argValue("--change");
  const dryRun = args.includes("--dry-run");
  const change = resolveChange({ change: requestedChange, activeOnly: true });
  const yaml = readText(`${change.base}/change.yaml`);
  const workflow = parseField(yaml, "workflow") || "standard";
  const schema = loadSchema(workflow);
  const states = computeArtifactStates(schema, yaml, change.base);
  const required = schema.archive?.requires ?? schema.artifacts.map((artifact) => artifact.id);
  const blocked = required.filter((id) => states.get(id) !== "done");

  if (blocked.length > 0) {
    console.error(`Cannot archive ${change.name}. Required artifacts are not done:`);
    for (const id of blocked) console.error(`- ${id}: ${states.get(id)}`);
    process.exit(1);
  }

  const missingArtifacts = schema.artifacts.filter((artifact) => states.get(artifact.id) !== "done");
  if (missingArtifacts.length > 0) {
    console.error(`Cannot archive ${change.name}. Workflow artifacts are incomplete:`);
    for (const artifact of missingArtifacts) console.error(`- ${artifact.id}: ${states.get(artifact.id)}`);
    process.exit(1);
  }

  const archiveBase = `.specforge/changes/archive/${change.name}`;
  if (dryRun) {
    console.log(`Would archive ${change.name}`);
    console.log(`${change.base} -> ${archiveBase}`);
    process.exit(0);
  }

  updateChangeStatus(change.base, "ARCHIVED");
  const archivedYaml = readText(`${change.base}/change.yaml`);
  movePath(change.base, archiveBase);

  let registry = readText(".specforge/registry.yaml");
  registry = removeRegistryEntry(registry, change.name);
  registry = normalizeEmptyActive(registry);
  registry = appendArchiveRegistryEntry(registry, makeArchiveRegistryEntry(change.name, archivedYaml, archiveBase));
  writeText(".specforge/registry.yaml", `${registry.trimEnd()}\n`);

  console.log(`Archived ${change.name}`);
  console.log(archiveBase);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
