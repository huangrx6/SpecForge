import { diagnoseWorkspace, diagnoseWorkItem } from "./lib/diagnostics.mjs";
import { contractsForSchema, contractForArtifact, focusArtifactId } from "./lib/stage-contracts.mjs";
import { effectiveSchema, loadSchema, parseField, readText, resolveWorkItem } from "./lib/specforge.mjs";

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
    return `# SpecForge Stage Contracts\n\nNo active work item.\n\n- Route: ${diagnosis.route}\n- Reason: ${diagnosis.route_reason}\n`;
  }

  return `# SpecForge Stage Contracts: ${diagnosis.work_item.id}

- Workflow: ${diagnosis.work_item.workflow}@${diagnosis.schema.version}
- Ready artifact: ${diagnosis.ready_artifact ?? "none"}
- Route: ${diagnosis.route}

| Artifact | Stage | Gate | Tools | Outputs | Exit |
|---|---|---|---|---|---|
${contracts.map((contract) => `| ${contract.id} | ${contract.stage} | ${contract.gate ?? "N/A"} | ${(contract.execution?.tools ?? []).join("<br>")} | ${contract.outputs.join("<br>")} | ${contract.exit} |`).join("\n")}
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
    console.log(
      JSON.stringify(
        {
          work_item: diagnosis.work_item,
          focus_artifact: artifactId,
          contract,
          contracts: overview ? contracts : undefined,
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
