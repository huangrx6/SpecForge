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
import { diagnoseWorkItem, diagnoseWorkspace } from "./lib/diagnostics.mjs";

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

function printQualityWarnings(warnings = []) {
  if (warnings.length === 0) return;
  console.log("");
  console.log("Quality warnings:");
  for (const warning of warnings) {
    console.log(`- [${warning.severity}] ${warning.message}`);
    console.log(`  route: ${warning.route}; owner: ${warning.owner_artifact}`);
    if (warning.missing_sections?.length > 0) console.log(`  missing: ${warning.missing_sections.join(", ")}`);
  }
}

function printDecisionCheckpoints(checkpoints) {
  const summary = checkpoints?.summary ?? { open: 0, confirmed: 0, risk_acceptance: 0 };
  if (summary.open === 0 && summary.risk_acceptance === 0) return;
  console.log("");
  console.log(`Decision checkpoints: open=${summary.open}, confirmed=${summary.confirmed}, risk_acceptance=${summary.risk_acceptance}`);
  for (const item of (checkpoints?.open ?? []).slice(0, 5)) {
    console.log(`- ${item.marker}: ${item.path}:${item.line}`);
    console.log(`  ${item.text}`);
  }
  if (summary.open > 5) console.log(`- ... ${summary.open - 5} more open decision(s)`);
}

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
  intake: [standard("workflow.md"), standard("stage-playbook.md"), standard("product.md"), standard("ai-toolkit.md")],
  gap_report: [standard("workflow.md"), standard("stage-playbook.md"), standard("product.md"), standard("engineering.md"), standard("ai-toolkit.md")],
  research: [standard("workflow.md"), standard("stage-playbook.md"), standard("product.md"), standard("engineering.md"), standard("ai-toolkit.md")],
  requirements: [standard("workflow.md"), standard("stage-playbook.md"), standard("product.md"), standard("ai-toolkit.md")],
  ui_design: [standard("workflow.md"), standard("stage-playbook.md"), standard("product.md"), standard("design.md"), standard("ai-toolkit.md")],
  technical_design: [standard("workflow.md"), standard("stage-playbook.md"), standard("engineering.md"), standard("ai-toolkit.md")],
  tasks: [standard("workflow.md"), standard("stage-playbook.md"), standard("engineering.md"), standard("ai-toolkit.md")],
  spec_review: [standard("workflow.md"), standard("stage-playbook.md"), standard("product.md"), standard("design.md"), standard("engineering.md")],
  implementation: [standard("workflow.md"), standard("stage-playbook.md"), standard("engineering.md")],
  code_review: [standard("workflow.md"), standard("stage-playbook.md"), standard("engineering.md")],
  verification: [standard("workflow.md"), standard("stage-playbook.md"), standard("engineering.md"), standard("ai-toolkit.md")],
  wiki_sync: [standard("workflow.md"), standard("stage-playbook.md"), standard("wiki.md"), standard("ai-toolkit.md")],
  closure: [standard("workflow.md"), standard("stage-playbook.md"), standard("wiki.md"), standard("ai-toolkit.md")],
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

function suggestedEvidencePath(artifact, gate) {
  if (gate?.evidence) return gate.evidence;
  const preferredByGate = {
    spec_review: "spec-review-v1.md",
    code_review: "code-review-v1.md",
    verification: "report.md",
    wiki_sync: "wiki-sync.md",
  };
  const preferred = preferredByGate[gate?.name];
  if (preferred) {
    const match = artifact.outputs.find((output) => output.path.endsWith(preferred));
    if (match) return match.path;
  }
  return artifact.outputs[0]?.path ?? "<evidence-path>";
}

let workItem;

try {
  if (!requestedWorkItem) {
    const workspaceDiagnosis = diagnoseWorkspace();
    if (!workspaceDiagnosis.work_item) {
      const payload = {
        mode: "workspace",
        route: workspaceDiagnosis.route,
        reason: workspaceDiagnosis.route_reason,
        active_count: workspaceDiagnosis.active_count,
        active_items: workspaceDiagnosis.active_items,
        blockers: workspaceDiagnosis.blockers,
        quality_warnings: workspaceDiagnosis.quality_warnings ?? [],
        decision_checkpoints: workspaceDiagnosis.decision_checkpoints,
      };

      if (json) {
        console.log(JSON.stringify(payload, null, 2));
      } else {
        console.log("Instructions unavailable");
        console.log(`Active work items: ${payload.active_count}`);
        if (payload.active_items.length > 0) {
          for (const item of payload.active_items) console.log(`- ${item.id}: ${item.path}`);
        }
        console.log(`Route: ${payload.route}`);
        console.log(`Reason: ${payload.reason}`);
        if (payload.blockers.length > 0) {
          console.log("");
          console.log("Blockers:");
          for (const blocker of payload.blockers) console.log(`- [${blocker.severity}] ${blocker.message}`);
        }
        printQualityWarnings(payload.quality_warnings);
        printDecisionCheckpoints(payload.decision_checkpoints);
      }
      process.exit(0);
    }
  }

  workItem = resolveWorkItem({
    workItem: requestedWorkItem,
    activeOnly: false,
    defaultToLatestArchive: false,
  });

  const workItemYaml = readText(`${workItem.base}/work.yaml`);
  const workflow = parseField(workItemYaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), workItemYaml);
  const states = computeArtifactStates(schema, workItemYaml, workItem.base);
  const diagnosis = diagnoseWorkItem({ workItem: workItem.name, activeOnly: false });

  if (!requestedArtifact && !applyMode && diagnosis.blockers.length > 0) {
    const payload = {
      mode: "blocked",
      work_item: workItem.name,
      path: workItem.base,
      workflow: `${schema.id}@${schema.version}`,
      current_stage: parseField(workItemYaml, "stage"),
      ready_artifact: diagnosis.ready_artifact,
      route: diagnosis.route,
      reason: diagnosis.route_reason,
      blockers: diagnosis.blockers,
      quality_warnings: diagnosis.quality_warnings,
      decision_checkpoints: diagnosis.decision_checkpoints,
    };

    if (json) {
      console.log(JSON.stringify(payload, null, 2));
    } else {
      console.log(`Instructions blocked for ${payload.work_item}`);
      console.log(`Workflow: ${payload.workflow}`);
      console.log(`Current stage: ${payload.current_stage}`);
      console.log(`Ready artifact: ${payload.ready_artifact ?? "none"}`);
      console.log(`Route: ${payload.route}`);
      console.log(`Reason: ${payload.reason}`);
      console.log("");
      console.log("Blockers:");
      for (const blocker of payload.blockers) {
        console.log(`- [${blocker.severity}] ${blocker.message}`);
        console.log(`  owner: ${blocker.owner_artifact}`);
      }
      printQualityWarnings(payload.quality_warnings);
      printDecisionCheckpoints(payload.decision_checkpoints);
    }
    process.exit(0);
  }

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
      route: diagnosis.route,
      blockers: diagnosis.blockers,
      quality_warnings: diagnosis.quality_warnings,
      decision_checkpoints: diagnosis.decision_checkpoints,
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
      if (payload.blockers.length > 0) {
        console.log("Diagnostic blockers:");
        for (const blocker of payload.blockers) console.log(`- [${blocker.severity}] ${blocker.message} -> ${blocker.route}`);
      }
      printQualityWarnings(payload.quality_warnings);
      printDecisionCheckpoints(payload.decision_checkpoints);
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
    quality_warnings: diagnosis.quality_warnings,
    decision_checkpoints: diagnosis.decision_checkpoints,
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
      const suggestedEvidence = suggestedEvidencePath(payload.artifact, payload.artifact.gate);
      console.log("");
      console.log(`Gate: ${payload.artifact.gate.name} = ${payload.artifact.gate.status}`);
      console.log(`Evidence: ${payload.artifact.gate.evidence ?? "null"}`);
      console.log("Gate commands:");
      console.log(`- node .specforge/core/scripts/gate-preflight.mjs ${payload.artifact.gate.name} APPROVED --evidence ${suggestedEvidence}`);
      console.log(`- specforge gate --dir . ${payload.artifact.gate.name} APPROVED --evidence ${suggestedEvidence}`);
    }
    printQualityWarnings(payload.quality_warnings);
    printDecisionCheckpoints(payload.decision_checkpoints);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
