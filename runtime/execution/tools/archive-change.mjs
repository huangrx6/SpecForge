import {
  appendArchiveRegistryEntry,
  computeArtifactStates,
  layout,
  loadSchema,
  makeArchiveRegistryEntry,
  movePath,
  normalizeEmptyActive,
  parseField,
  readText,
  removeRegistryEntry,
  resolveChange,
  runHook,
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
  const strictHooks = args.includes("--strict-hooks");
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

  const archiveBase = `${layout.changes}/archive/${change.name}`;
  if (dryRun) {
    console.log(`Would archive ${change.name}`);
    console.log(`${change.base} -> ${archiveBase}`);
    process.exit(0);
  }

  const payload = { change: change.name, changeBase: change.base, archiveBase, workflow };
  const preHook = await runHook("pre-close", payload);
  if (preHook && preHook.ok === false) {
    throw new Error(`pre-close hook blocked archive: ${preHook.message ?? "no message"}`);
  }

  updateChangeStatus(change.base, "ARCHIVED");
  const archivedYaml = readText(`${change.base}/change.yaml`);
  movePath(change.base, archiveBase);

  let registry = readText(layout.registry);
  registry = removeRegistryEntry(registry, change.name);
  registry = normalizeEmptyActive(registry);
  registry = appendArchiveRegistryEntry(registry, makeArchiveRegistryEntry(change.name, archivedYaml, archiveBase));
  writeText(layout.registry, `${registry.trimEnd()}\n`);

  const postHook = await runHook("on-close", { ...payload, changeBase: archiveBase });
  if (postHook && postHook.ok === false) {
    const message = `on-close hook failed: ${postHook.message ?? "no message"}`;
    if (strictHooks) throw new Error(message);
    console.error(message);
  }

  console.log(`Archived ${change.name}`);
  console.log(archiveBase);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
