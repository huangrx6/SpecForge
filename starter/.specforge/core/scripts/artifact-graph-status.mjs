import {
  computeArtifactStates,
  effectiveSchema,
  exists,
  gateEvidence,
  gateStatus,
  layout,
  listWorkItems,
  loadSchema,
  parseField,
  readText,
  resolveWorkItem,
} from "./lib/specforge.mjs";
import { diagnoseWorkItem } from "./lib/diagnostics.mjs";

const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positionalArgs() {
  const values = [];
  const optionsWithValues = new Set(["--work-item"]);
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

function printNoChanges() {
  console.log("Artifact graph: no work items yet.");
  console.log("Create the first work item with:");
  console.log(`node ${layout.tools}/create-work.mjs "Work item title"`);
}

const json = args.includes("--json");
const requestedWorkItem = argValue("--work-item") ?? positionalArgs()[0];

try {
  if (!requestedWorkItem && listWorkItems("active").length === 0) {
    printNoChanges();
    process.exit(0);
  }

  const workItem = resolveWorkItem({
    workItem: requestedWorkItem,
    activeOnly: false,
    defaultToLatestArchive: false,
  });
  const diagnosis = diagnoseWorkItem({ workItem: workItem.name, activeOnly: false });
  const workItemYaml = readText(`${workItem.base}/work.yaml`);
  const workflow = parseField(workItemYaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), workItemYaml);
  const states = computeArtifactStates(schema, workItemYaml, workItem.base);

  const artifactSummaries = schema.artifacts.map((artifact) => {
    const missingDeps = artifact.requires.filter((id) => states.get(id) !== "done");
    return {
      id: artifact.id,
      title: artifact.title,
      stage: artifact.stage,
      status: states.get(artifact.id),
      requires: artifact.requires,
      missingDeps,
      outputs: artifact.outputs.map((output) => ({
        output,
        exists: exists(`${workItem.base}/${output}`),
      })),
      gate: artifact.gate ?? "",
      gateStatus: artifact.gate ? gateStatus(workItemYaml, artifact.gate) : "",
      gateEvidence: artifact.gate ? gateEvidence(workItemYaml, artifact.gate) : null,
    };
  });

  const doneCount = artifactSummaries.filter((artifact) => artifact.status === "done").length;
  const readyArtifacts = artifactSummaries.filter((artifact) => artifact.status === "ready").map((artifact) => artifact.id);
  const blockedArtifacts = artifactSummaries
    .filter((artifact) => artifact.status === "blocked")
    .map((artifact) => ({ id: artifact.id, missingDeps: artifact.missingDeps }));

  if (json) {
    console.log(
      JSON.stringify(
        {
          schema: { id: schema.id, version: schema.version },
          components: schema.components ?? {},
          work_item: {
            id: workItem.name,
            path: workItem.base,
            lifecycle: workItem.lifecycle,
            stage: parseField(workItemYaml, "stage"),
          },
          progress: {
            done: doneCount,
            total: artifactSummaries.length,
          },
          route: diagnosis.route,
          route_reason: diagnosis.route_reason,
          blockers: diagnosis.blockers,
          readyArtifacts,
          blockedArtifacts,
          artifacts: artifactSummaries,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  console.log(`Artifact graph: ${schema.id}@${schema.version}`);
  const componentEntries = Object.entries(schema.components ?? {});
  if (componentEntries.length > 0) {
    console.log(`Components: ${componentEntries.map(([key, value]) => `${key}=${value}`).join(", ")}`);
  }
  console.log(`Work item: ${workItem.name}`);
  console.log(`Path: ${workItem.base}`);
  console.log(`Stage: ${parseField(workItemYaml, "stage")}`);
  console.log(`Progress: ${doneCount}/${artifactSummaries.length} done`);
  console.log(`Ready: ${readyArtifacts.length > 0 ? readyArtifacts.join(", ") : "none"}`);
  console.log(`Route: ${diagnosis.route}`);
  console.log(`Reason: ${diagnosis.route_reason}`);
  if (diagnosis.blockers.length > 0) {
    console.log("Blockers:");
    for (const blocker of diagnosis.blockers) console.log(`- [${blocker.severity}] ${blocker.message} -> ${blocker.route}`);
  }
  console.log("");

  for (const artifact of artifactSummaries) {
    const deps = artifact.requires.length > 0 ? artifact.requires.join(", ") : "none";
    const missing = artifact.missingDeps.length > 0 ? `, missing=${artifact.missingDeps.join(", ")}` : "";
    const gate = artifact.gate ? `, gate=${artifact.gate}:${artifact.gateStatus}` : "";
    console.log(`- ${artifact.id}: ${artifact.status} (requires=${deps}${missing}${gate})`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
