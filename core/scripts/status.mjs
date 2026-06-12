import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  artifactLine,
  diagnoseWorkspace,
  diagnoseWorkItem,
  gateLine,
} from "./lib/diagnostics.mjs";
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

const args = process.argv.slice(2);
const json = args.includes("--json");
const showGraph = args.includes("--graph") || args.includes("-g") || args.includes("--work-item");
const root = process.cwd();
const archiveRoot = join(root, layout.workItems, "archive");

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function field(text, name) {
  return text.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? "unknown";
}

function archivedWorkItems() {
  if (!existsSync(archiveRoot)) return [];
  return readdirSync(archiveRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(archiveRoot, entry.name, "work.yaml")))
    .map((entry) => {
      const yamlPath = `${layout.workItems}/archive/${entry.name}/work.yaml`;
      const yaml = read(yamlPath);
      return {
        id: field(yaml, "id") || entry.name,
        title: field(yaml, "title"),
        type: field(yaml, "type"),
        workflow: field(yaml, "workflow") || "standard",
        path: yamlPath.replace(/\/work\.yaml$/, ""),
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function printBlockers(blockers) {
  if (!blockers || blockers.length === 0) {
    console.log("Blockers: none");
    return;
  }
  console.log("Blockers:");
  for (const blocker of blockers) {
    console.log(`- [${blocker.severity}] ${blocker.message}`);
    console.log(`  route: ${blocker.route}`);
  }
}

function printQualityWarnings(warnings) {
  if (!warnings || warnings.length === 0) {
    console.log("Quality warnings: none");
    return;
  }
  console.log("Quality warnings:");
  for (const warning of warnings) {
    console.log(`- [${warning.severity}] ${warning.message}`);
    console.log(`  owner: ${warning.owner_artifact}, route: ${warning.route}`);
    if (warning.missing_sections?.length > 0) {
      console.log(`  missing: ${warning.missing_sections.join(", ")}`);
    }
  }
}

function printDecisionCheckpoints(checkpoints) {
  const summary = checkpoints?.summary ?? { open: 0, confirmed: 0, risk_acceptance: 0 };
  console.log(`Decision checkpoints: open=${summary.open}, confirmed=${summary.confirmed}, risk_acceptance=${summary.risk_acceptance}`);
  if (!checkpoints || summary.open === 0) return;
  for (const item of checkpoints.open.slice(0, 5)) {
    console.log(`- ${item.marker}: ${item.path}:${item.line}`);
    console.log(`  ${item.text}`);
  }
  if (summary.open > 5) console.log(`- ... ${summary.open - 5} more open decision(s)`);
}

function printTraceability(traceability) {
  if (!traceability) {
    console.log("Traceability: unavailable");
    return;
  }
  const summary = traceability.summary;
  console.log(
    `Traceability: sources=${summary.source_items}, tasks=${summary.tasks}, verification=${summary.verification_items}, uncovered=${summary.uncovered_sources}, missing_trace=${summary.tasks_missing_trace}, missing_verification=${summary.tasks_missing_verification}, missing_testcase=${summary.tasks_without_testcase}`,
  );
}

function printActiveSummary(diagnosis) {
  if (!diagnosis.work_item) {
    console.log(`Active work items: ${diagnosis.active_count}`);
    if (diagnosis.active_items.length > 0) {
      for (const item of diagnosis.active_items) console.log(`- ${item.id}: ${item.path}`);
    }
    console.log(`Route: ${diagnosis.route}`);
    console.log(`Reason: ${diagnosis.route_reason}`);
    printBlockers(diagnosis.blockers);
    printQualityWarnings(diagnosis.quality_warnings);
    printDecisionCheckpoints(diagnosis.decision_checkpoints);
    return;
  }

  const item = diagnosis.work_item;
  console.log(`Active: ${item.id}`);
  console.log(`Path: ${item.path}`);
  console.log(`Title: ${item.title}`);
  console.log(`Type: ${item.type}`);
  console.log(`Workflow: ${item.workflow}@${diagnosis.schema.version}`);
  console.log(`Stage: ${item.stage}`);
  console.log(`Status: ${item.status}`);
  console.log(`Progress: ${diagnosis.progress.done}/${diagnosis.progress.total} done`);
  console.log(`Ready artifact: ${diagnosis.ready_artifact ?? "none"}`);
  console.log(`Route: ${diagnosis.route}`);
  console.log(`Reason: ${diagnosis.route_reason}`);
  console.log(`Gates: ${gateLine(diagnosis.gates)}`);
  console.log(`Graph: ${artifactLine(diagnosis.artifacts)}`);
  printTraceability(diagnosis.traceability);
  printBlockers(diagnosis.blockers);
  printQualityWarnings(diagnosis.quality_warnings);
  printDecisionCheckpoints(diagnosis.decision_checkpoints);
}

function printArchiveSummary(items) {
  console.log("");
  console.log(`Archived work items: ${items.length}`);
  if (items.length === 0) {
    console.log("- none");
    return;
  }
  for (const item of items) console.log(`- ${item.id}: ${item.title} (${item.workflow}, ${item.type})`);
}

function runStandardStatus() {
  const diagnosis = diagnoseWorkspace();
  const archive = archivedWorkItems();

  if (json) {
    console.log(JSON.stringify({ ...diagnosis, archive }, null, 2));
    process.exit(0);
  }

  console.log("SpecForge Status");
  console.log("");
  console.log(`Connection: ${diagnosis.workspace_kind}`);
  printActiveSummary(diagnosis);
  printArchiveSummary(archive);
}

function runGraphStatus() {
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

  const requestedWorkItem = argValue("--work-item") ?? positionalArgs().filter(a => a !== "--graph" && a !== "-g" && a !== "--json")[0];

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
          quality_warnings: diagnosis.quality_warnings,
          traceability: diagnosis.traceability,
          decision_checkpoints: diagnosis.decision_checkpoints,
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
  printTraceability(diagnosis.traceability);
  if (diagnosis.blockers.length > 0) {
    console.log("Blockers:");
    for (const blocker of diagnosis.blockers) {
      console.log(`- [${blocker.severity}] ${blocker.message} -> ${blocker.route}`);
    }
  }
  if (diagnosis.quality_warnings?.length > 0) {
    console.log("Quality warnings:");
    for (const warning of diagnosis.quality_warnings) {
      console.log(`- [${warning.severity}] ${warning.message} -> ${warning.route}`);
    }
  }
  printDecisionCheckpoints(diagnosis.decision_checkpoints);
  console.log("");

  for (const artifact of artifactSummaries) {
    const deps = artifact.requires.length > 0 ? artifact.requires.join(", ") : "none";
    const missing = artifact.missingDeps.length > 0 ? `, missing=${artifact.missingDeps.join(", ")}` : "";
    const gate = artifact.gate ? `, gate=${artifact.gate}:${artifact.gateStatus}` : "";
    console.log(`- ${artifact.id}: ${artifact.status} (requires=${deps}${missing}${gate})`);
  }
}

try {
  if (showGraph) {
    runGraphStatus();
  } else {
    runStandardStatus();
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
