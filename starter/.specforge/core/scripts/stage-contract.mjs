import { diagnoseWorkspace, diagnoseWorkItem } from "./lib/diagnostics.mjs";
import { contractsForSchema, contractForArtifact, focusArtifactId } from "./lib/stage-contracts.mjs";
import { effectiveSchema, loadSchema, parseField, readText, resolveWorkItem } from "./lib/specforge.mjs";
import { actionCommands, actionReason, actionState, traceGapCount, traceabilityPolicyLine } from "./lib/action-board.mjs";
import { workflowHealth } from "./lib/workflow-health.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function bullet(items, emptyText, renderItem = (item) => item) {
  if (!items || items.length === 0) return `- ${emptyText}`;
  return items.map((item) => `- ${renderItem(item)}`).join("\n");
}

function cell(value) {
  return String(value ?? "N/A").replaceAll("|", "\\|").replace(/\r?\n/g, "<br>");
}

function roadmapRows(diagnosis, contracts) {
  const artifactStatus = new Map((diagnosis.artifacts ?? []).map((artifact) => [artifact.id, artifact]));
  return contracts.map((contract) => {
    const artifact = artifactStatus.get(contract.id);
    return {
      artifact: contract.id,
      title: contract.title,
      status: artifact?.status ?? "unknown",
      stage: contract.stage,
      gate: contract.gate ?? "N/A",
      tools: contract.execution?.tools ?? [],
      commands: contract.execution?.commands ?? [],
      human_decisions: contract.human_decisions ?? [],
      exit: contract.exit,
    };
  });
}

export function contractMarkdown(contract) {
  if (!contract) return "# SpecForge Stage Contract\n\nNo stage contract available.\n";

  return `# SpecForge Stage Contract: ${contract.id}

- Title: ${contract.title}
- Stage: ${contract.stage}
- Gate: ${contract.gate ?? "N/A"}
- Requires: ${contract.requires.length > 0 ? contract.requires.join(", ") : "none"}
- Outputs: ${contract.outputs.join(", ")}

## Goal

${contract.goal}

## Read First

${bullet(contract.read, "N/A")}

## Produce

${bullet(contract.produce, "N/A")}

## Recommended Tools

${bullet(contract.execution?.tools, "N/A")}

## Recommended Commands

\`\`\`bash
${(contract.execution?.commands ?? ["node .specforge/core/scripts/stage-contract.mjs"]).join("\n")}
\`\`\`

## Human Decisions

${bullet(contract.human_decisions, "none")}

## Must Prove

${bullet(contract.must_prove, "N/A")}

## Quality Checks

${bullet(contract.quality_checks, "none", (check) => `[${check.severity ?? "P2"}] ${(check.sections ?? []).join(", ")} - ${check.message ?? "quality check"}`)}

## Exit Standard

${contract.exit}
`;
}

function workflowOverviewMarkdown(diagnosis, contracts) {
  if (!diagnosis.work_item) {
    return `# SpecForge Workflow Roadmap

No active work item.

- Route: ${diagnosis.route}
- Reason: ${diagnosis.route_reason}

Start with:

\`\`\`bash
node .specforge/core/scripts/status.mjs
node .specforge/core/scripts/create-work.mjs --workflow <workflow> "<title>"
\`\`\`
`;
  }

  const health = workflowHealth(diagnosis);
  const rows = roadmapRows(diagnosis, contracts);

  return `# SpecForge Workflow Roadmap: ${diagnosis.work_item.id}

- Workflow: ${diagnosis.work_item.workflow}@${diagnosis.schema.version}
- Ready artifact: ${diagnosis.ready_artifact ?? "none"}
- Route: ${diagnosis.route}
- Health: ${health.score}/100 (${health.level})

## Action Summary

- State: ${actionState(diagnosis, health)}
- Next: ${actionReason(diagnosis)}
- Open decisions: ${diagnosis.decision_checkpoints?.summary?.open ?? 0}
- Blockers: ${diagnosis.blockers?.length ?? 0}
- Trace gaps: ${traceGapCount(diagnosis.traceability)}
- Traceability policy: ${traceabilityPolicyLine(diagnosis.traceability_policy)}

Recommended commands:

\`\`\`bash
${actionCommands(diagnosis).join("\n")}
\`\`\`

## Roadmap

| Artifact | Status | Stage | Gate | Tools | Commands | Human Decisions | Exit |
|---|---|---|---|---|---|---|---|
${rows.map((row) => `| ${cell(row.artifact)} | ${cell(row.status)} | ${cell(row.stage)} | ${cell(row.gate)} | ${cell(row.tools.join("<br>") || "N/A")} | ${cell(row.commands.join("<br>") || "N/A")} | ${cell(row.human_decisions.join("<br>") || "none")} | ${cell(row.exit)} |`).join("\n")}

## Legend

- done: source artifact exists and dependencies are satisfied.
- ready: this is the next artifact to create or approve.
- blocked: upstream artifact or gate evidence is missing.
`;
}

function activeSchemaForDiagnosis(diagnosis) {
  if (!diagnosis.work_item) return null;
  const workItemYaml = readText(`${diagnosis.work_item.path}/work.yaml`);
  const workflow = parseField(workItemYaml, "workflow") || "standard";
  return effectiveSchema(loadSchema(workflow), workItemYaml);
}

try {
  const requestedWorkItem = argValue("--work-item");
  const requestedArtifact = argValue("--artifact");
  const overview = args.includes("--overview");
  let diagnosis;

  if (requestedWorkItem) {
    const workItem = resolveWorkItem({ workItem: requestedWorkItem, activeOnly: false });
    diagnosis = diagnoseWorkItem({ workItem: workItem.name, activeOnly: false });
  } else {
    diagnosis = diagnoseWorkspace();
  }

  const schema = activeSchemaForDiagnosis(diagnosis);
  const artifactId = requestedArtifact ?? focusArtifactId(diagnosis);
  const contract = schema && artifactId ? contractForArtifact(schema, artifactId) : null;
  const contracts = schema ? contractsForSchema(schema) : [];

  if (json) {
    const health = workflowHealth(diagnosis);
    console.log(
      JSON.stringify(
        {
          work_item: diagnosis.work_item,
          focus_artifact: artifactId,
          contract,
          contracts: overview ? contracts : undefined,
          health: overview ? health : undefined,
          roadmap: overview && diagnosis.work_item ? roadmapRows(diagnosis, contracts) : undefined,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  console.log(overview ? workflowOverviewMarkdown(diagnosis, contracts) : contractMarkdown(contract));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
