import {
  computeArtifactStates,
  exists,
  gateEvidence,
  gateStatus,
  layout,
  listChanges,
  loadSchema,
  parseField,
  readText,
  resolveChange,
} from "./lib/specforge.mjs";

const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positionalArgs() {
  const values = [];
  const optionsWithValues = new Set(["--change"]);
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
  console.log("Artifact graph: no changes yet.");
  console.log("Create the first change with:");
  console.log(`node ${layout.tools}/create-change.mjs "Change title"`);
}

const json = args.includes("--json");
const requestedChange = argValue("--change") ?? positionalArgs()[0];

try {
  if (!requestedChange && listChanges("active").length === 0 && listChanges("archive").length === 0) {
    printNoChanges();
    process.exit(0);
  }

  const change = resolveChange({
    change: requestedChange,
    activeOnly: false,
    defaultToLatestArchive: !requestedChange,
  });
  const changeYaml = readText(`${change.base}/change.yaml`);
  const workflow = parseField(changeYaml, "workflow") || "standard";
  const schema = loadSchema(workflow);
  const states = computeArtifactStates(schema, changeYaml, change.base);

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
        exists: exists(`${change.base}/${output}`),
      })),
      gate: artifact.gate ?? "",
      gateStatus: artifact.gate ? gateStatus(changeYaml, artifact.gate) : "",
      gateEvidence: artifact.gate ? gateEvidence(changeYaml, artifact.gate) : null,
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
          change: {
            id: change.name,
            path: change.base,
            lifecycle: change.lifecycle,
            stage: parseField(changeYaml, "stage"),
          },
          progress: {
            done: doneCount,
            total: artifactSummaries.length,
          },
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
  console.log(`Change: ${change.name}`);
  console.log(`Path: ${change.base}`);
  console.log(`Stage: ${parseField(changeYaml, "stage")}`);
  console.log(`Progress: ${doneCount}/${artifactSummaries.length} done`);
  console.log(`Ready: ${readyArtifacts.length > 0 ? readyArtifacts.join(", ") : "none"}`);
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
