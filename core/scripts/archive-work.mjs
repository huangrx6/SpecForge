import {
  appendArchiveRegistryEntry,
  computeArtifactStates,
  effectiveSchema,
  layout,
  loadSchema,
  makeArchiveRegistryEntry,
  movePath,
  normalizeEmptyActive,
  parseField,
  readText,
  removeRegistryEntry,
  resolveWorkItem,
  runHook,
  updateWorkItemStatus,
  writeText,
} from "./lib/specforge.mjs";

const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

try {
  const requestedWorkItem = argValue("--work-item");
  const dryRun = args.includes("--dry-run");
  const strictHooks = args.includes("--strict-hooks");
  const workItem = resolveWorkItem({ workItem: requestedWorkItem, activeOnly: true });
  const yaml = readText(`${workItem.base}/work.yaml`);
  const workflow = parseField(yaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), yaml);
  const states = computeArtifactStates(schema, yaml, workItem.base);
  const required = schema.archive?.requires ?? schema.artifacts.map((artifact) => artifact.id);
  const blocked = required.filter((id) => states.get(id) !== "done");

  if (blocked.length > 0) {
    console.error(`Cannot archive ${workItem.name}. Required artifacts are not done:`);
    for (const id of blocked) console.error(`- ${id}: ${states.get(id)}`);
    process.exit(1);
  }

  const missingArtifacts = schema.artifacts.filter((artifact) => states.get(artifact.id) !== "done");
  if (missingArtifacts.length > 0) {
    console.error(`Cannot archive ${workItem.name}. Workflow artifacts are incomplete:`);
    for (const artifact of missingArtifacts) console.error(`- ${artifact.id}: ${states.get(artifact.id)}`);
    process.exit(1);
  }

  const archiveBase = `${layout.workItems}/archive/${workItem.name}`;
  if (dryRun) {
    console.log(`Would archive ${workItem.name}`);
    console.log(`${workItem.base} -> ${archiveBase}`);
    process.exit(0);
  }

  const payload = { workItem: workItem.name, workItemBase: workItem.base, archiveBase, workflow };
  const preHook = await runHook("pre-close", payload);
  if (preHook && preHook.ok === false) {
    throw new Error(`pre-close hook blocked archive: ${preHook.message ?? "no message"}`);
  }

  updateWorkItemStatus(workItem.base, "ARCHIVED");
  const archivedYaml = readText(`${workItem.base}/work.yaml`);
  movePath(workItem.base, archiveBase);

  let registry = readText(layout.registry);
  registry = removeRegistryEntry(registry, workItem.name);
  registry = normalizeEmptyActive(registry);
  registry = appendArchiveRegistryEntry(registry, makeArchiveRegistryEntry(workItem.name, archivedYaml, archiveBase));
  writeText(layout.registry, `${registry.trimEnd()}\n`);

  const postHook = await runHook("on-close", { ...payload, workItemBase: archiveBase });
  if (postHook && postHook.ok === false) {
    const message = `on-close hook failed: ${postHook.message ?? "no message"}`;
    if (strictHooks) throw new Error(message);
    console.error(message);
  }

  console.log(`Archived ${workItem.name}`);
  console.log(archiveBase);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
