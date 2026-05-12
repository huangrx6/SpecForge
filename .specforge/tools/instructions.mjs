import {
  artifactById,
  computeArtifactStates,
  exists,
  gateEvidence,
  gateStatus,
  loadSchema,
  nextReadyArtifact,
  parseField,
  parseTasks,
  readText,
  resolveChange,
  templateByOutput,
} from "./lib/specforge.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");
const applyMode = args.includes("apply");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positionalArgs() {
  const values = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      if (argValue(arg) && !["--json"].includes(arg)) i += 1;
      continue;
    }
    if (arg !== "apply") values.push(arg);
  }
  return values;
}

const requestedArtifact = positionalArgs()[0];
const requestedChange = argValue("--change");

const rulesByArtifact = {
  intake: [".specforge/rules/context.md", ".specforge/rules/boundaries.md"],
  requirements: [".specforge/rules/spec-quality.md", ".specforge/rules/boundaries.md"],
  design: [".specforge/rules/engineering.md", ".specforge/rules/security.md", ".specforge/rules/boundaries.md"],
  tasks: [".specforge/rules/artifact-graph.md", ".specforge/rules/testing.md"],
  spec_review: [".specforge/rules/gates.md", ".specforge/rules/spec-quality.md"],
  implementation: [".specforge/rules/engineering.md", ".specforge/rules/testing.md"],
  code_review: [".specforge/rules/gates.md", ".specforge/rules/security.md", ".specforge/rules/testing.md"],
  verification: [".specforge/rules/testing.md", ".specforge/rules/gates.md"],
  ssot_sync: [".specforge/rules/artifact-graph.md", ".specforge/rules/gates.md"],
  closure: [".specforge/rules/gates.md"],
};

function dependencyRows(schema, states, artifact) {
  return artifact.requires.map((id) => {
    const dep = artifactById(schema, id);
    return {
      id,
      state: states.get(id),
      outputs: dep.outputs.map((output) => ({
        path: output,
        exists: exists(`${change.base}/${output}`),
      })),
    };
  });
}

function outputRows(artifact) {
  return artifact.outputs.map((output) => ({
    path: output,
    template: templateByOutput.get(output) ?? null,
    exists: exists(`${change.base}/${output}`),
  }));
}

let change;

try {
  change = resolveChange({
    change: requestedChange,
    activeOnly: false,
    defaultToLatestArchive: !requestedChange,
  });

  const changeYaml = readText(`${change.base}/change.yaml`);
  const workflow = parseField(changeYaml, "workflow") || "standard";
  const schema = loadSchema(workflow);
  const states = computeArtifactStates(schema, changeYaml, change.base);

  if (applyMode) {
    const required = schema.apply?.requires ?? [];
    const blocked = required.filter((id) => states.get(id) !== "done");
    const tracks = schema.apply?.tracks;
    const tasks = tracks && exists(`${change.base}/${tracks}`) ? parseTasks(readText(`${change.base}/${tracks}`)) : [];
    const payload = {
      mode: "apply",
      change: change.name,
      path: change.base,
      ready: blocked.length === 0,
      required: required.map((id) => ({ id, state: states.get(id) })),
      blocked_by: blocked,
      tracks,
      task_progress: {
        total: tasks.length,
        done: tasks.filter((task) => task.done).length,
        pending: tasks.filter((task) => !task.done).map((task) => task.title),
      },
      context_files: schema.artifacts
        .flatMap((artifact) => artifact.outputs)
        .filter((output) => exists(`${change.base}/${output}`)),
    };

    if (json) {
      console.log(JSON.stringify(payload, null, 2));
    } else {
      console.log(`Apply instructions for ${payload.change}`);
      console.log(`Path: ${payload.path}`);
      console.log(`Ready: ${payload.ready ? "yes" : "no"}`);
      if (blocked.length > 0) console.log(`Blocked by: ${blocked.join(", ")}`);
      console.log(`Tasks: ${payload.task_progress.done}/${payload.task_progress.total} done`);
      for (const task of payload.task_progress.pending) console.log(`- [ ] ${task}`);
      console.log("");
      console.log("Context files:");
      for (const file of payload.context_files) console.log(`- ${file}`);
    }
    process.exit(0);
  }

  const artifact = requestedArtifact ? artifactById(schema, requestedArtifact) : nextReadyArtifact(schema, states);
  if (!artifact) {
    throw new Error(requestedArtifact ? `Unknown artifact: ${requestedArtifact}` : "No ready artifact found.");
  }

  const payload = {
    mode: "artifact",
    change: change.name,
    path: change.base,
    workflow: `${schema.id}@${schema.version}`,
    current_stage: parseField(changeYaml, "stage"),
    artifact: {
      id: artifact.id,
      title: artifact.title,
      description: artifact.description,
      stage: artifact.stage,
      state: states.get(artifact.id),
      gate: artifact.gate
        ? {
            name: artifact.gate,
            status: gateStatus(changeYaml, artifact.gate),
            evidence: gateEvidence(changeYaml, artifact.gate),
          }
        : null,
      dependencies: dependencyRows(schema, states, artifact),
      outputs: outputRows(artifact),
      rules: rulesByArtifact[artifact.id] ?? [".specforge/rules/index.md"],
    },
    next_ready: schema.artifacts
      .filter((item) => states.get(item.id) === "ready")
      .map((item) => item.id),
  };

  if (json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    console.log(`Instructions for ${payload.change}`);
    console.log(`Workflow: ${payload.workflow}`);
    console.log(`Current stage: ${payload.current_stage}`);
    console.log("");
    console.log(`${artifact.id}: ${artifact.title}`);
    console.log(`State: ${states.get(artifact.id)}`);
    console.log(artifact.description);
    console.log("");
    console.log("Read rules:");
    for (const rule of payload.artifact.rules) console.log(`- ${rule}`);
    console.log("");
    console.log("Dependencies:");
    if (payload.artifact.dependencies.length === 0) {
      console.log("- none");
    } else {
      for (const dep of payload.artifact.dependencies) console.log(`- ${dep.id}: ${dep.state}`);
    }
    console.log("");
    console.log("Outputs:");
    for (const output of payload.artifact.outputs) {
      console.log(`- ${output.path} (${output.exists ? "exists" : `template=${output.template}`})`);
    }
    if (payload.artifact.gate) {
      console.log("");
      console.log(`Gate: ${payload.artifact.gate.name} = ${payload.artifact.gate.status}`);
      console.log(`Evidence: ${payload.artifact.gate.evidence ?? "null"}`);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
