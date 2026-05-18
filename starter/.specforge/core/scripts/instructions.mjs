import {
  artifactById,
  computeArtifactStates,
  effectiveSchema,
  exists,
  gateEvidence,
  gateStatus,
  layout,
  loadSchema,
  nextReadyArtifact,
  parseField,
  parseTasks,
  readText,
  resolveWorkItem,
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
const requestedWorkItem = argValue("--work-item");

const standard = (path) => `${layout.standards}/${path}`;
const stageSkill = (path) => `${layout.stages}/${path}`;

const stageSkillByArtifact = {
  intake: stageSkill("discovery/SKILL.md"),
  gap_report: stageSkill("gap-report/SKILL.md"),
  research: stageSkill("research/SKILL.md"),
  requirements: stageSkill("requirements/SKILL.md"),
  ui_design: stageSkill("ui-design/SKILL.md"),
  technical_design: stageSkill("technical-design/SKILL.md"),
  tasks: stageSkill("task-planning/SKILL.md"),
  spec_review: stageSkill("spec-review/SKILL.md"),
  implementation: stageSkill("implementation/SKILL.md"),
  code_review: stageSkill("code-review/SKILL.md"),
  verification: stageSkill("verification/SKILL.md"),
  wiki_sync: stageSkill("wiki-sync/SKILL.md"),
  closure: stageSkill("closure/SKILL.md"),
};

const contextByArtifact = {
  technical_design: [`${layout.techProfiles}/README.md`],
  spec_review: [`${layout.techProfiles}/README.md`],
};

const standardsByArtifact = {
  intake: [standard("workflow.md"), standard("product.md")],
  gap_report: [standard("workflow.md"), standard("product.md"), standard("engineering.md")],
  research: [standard("workflow.md"), standard("product.md"), standard("engineering.md")],
  requirements: [standard("workflow.md"), standard("product.md")],
  ui_design: [standard("workflow.md"), standard("product.md"), standard("design.md")],
  technical_design: [standard("workflow.md"), standard("engineering.md")],
  tasks: [standard("workflow.md"), standard("engineering.md")],
  spec_review: [standard("workflow.md"), standard("product.md"), standard("design.md"), standard("engineering.md")],
  implementation: [standard("workflow.md"), standard("engineering.md")],
  code_review: [standard("workflow.md"), standard("engineering.md")],
  verification: [standard("workflow.md"), standard("engineering.md")],
  wiki_sync: [standard("workflow.md"), standard("wiki.md")],
  closure: [standard("workflow.md"), standard("wiki.md")],
};

function dependencyRows(schema, states, artifact) {
  return artifact.requires.map((id) => {
    const dep = artifactById(schema, id);
    return {
      id,
      state: states.get(id),
      outputs: dep.outputs.map((output) => ({
        path: output,
        exists: exists(`${workItem.base}/${output}`),
      })),
    };
  });
}

function outputRows(artifact) {
  return artifact.outputs.map((output) => ({
    path: output,
    template: templateByOutput.get(output) ?? null,
    exists: exists(`${workItem.base}/${output}`),
  }));
}

let workItem;

try {
  workItem = resolveWorkItem({
    workItem: requestedWorkItem,
    activeOnly: false,
    defaultToLatestArchive: false,
  });

  const workItemYaml = readText(`${workItem.base}/work.yaml`);
  const workflow = parseField(workItemYaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), workItemYaml);
  const states = computeArtifactStates(schema, workItemYaml, workItem.base);

  if (applyMode) {
    const required = schema.apply?.requires ?? [];
    const blocked = required.filter((id) => states.get(id) !== "done");
    const tracks = schema.apply?.tracks;
    const tasks = tracks && exists(`${workItem.base}/${tracks}`) ? parseTasks(readText(`${workItem.base}/${tracks}`)) : [];
    const payload = {
      mode: "apply",
      work_item: workItem.name,
      path: workItem.base,
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
        .filter((output) => exists(`${workItem.base}/${output}`)),
    };

    if (json) {
      console.log(JSON.stringify(payload, null, 2));
    } else {
      console.log(`Apply instructions for ${payload.work_item}`);
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
    work_item: workItem.name,
    path: workItem.base,
    workflow: `${schema.id}@${schema.version}`,
    components: schema.components ?? {},
    current_stage: parseField(workItemYaml, "stage"),
    artifact: {
      id: artifact.id,
      title: artifact.title,
      description: artifact.description,
      stage: artifact.stage,
      state: states.get(artifact.id),
      gate: artifact.gate
        ? {
            name: artifact.gate,
            status: gateStatus(workItemYaml, artifact.gate),
            evidence: gateEvidence(workItemYaml, artifact.gate),
          }
        : null,
      dependencies: dependencyRows(schema, states, artifact),
      outputs: outputRows(artifact),
      standards: standardsByArtifact[artifact.id] ?? [standard("index.md")],
      stage_skill: stageSkillByArtifact[artifact.id] ?? null,
      context: contextByArtifact[artifact.id] ?? [],
    },
    next_ready: schema.artifacts
      .filter((item) => states.get(item.id) === "ready")
      .map((item) => item.id),
  };

  if (json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    console.log(`Instructions for ${payload.work_item}`);
    console.log(`Workflow: ${payload.workflow}`);
    const componentEntries = Object.entries(payload.components);
    if (componentEntries.length > 0) {
      console.log(`Components: ${componentEntries.map(([key, value]) => `${key}=${value}`).join(", ")}`);
    }
    console.log(`Current stage: ${payload.current_stage}`);
    console.log("");
    console.log(`${artifact.id}: ${artifact.title}`);
    console.log(`State: ${states.get(artifact.id)}`);
    console.log(artifact.description);
    console.log("");
    if (payload.artifact.stage_skill) {
      console.log("Read stage skill:");
      console.log(`- ${payload.artifact.stage_skill}`);
      console.log("");
    }
    if (payload.artifact.context.length > 0) {
      console.log("Read context:");
      for (const file of payload.artifact.context) console.log(`- ${file}`);
      console.log("");
    }
    console.log("Read standards:");
    for (const standard of payload.artifact.standards) console.log(`- ${standard}`);
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
