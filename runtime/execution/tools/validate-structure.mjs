import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { effectiveSchema, layout, parseRegistryEntries, parseField, templateByOutput, validateSchema } from "./lib/specforge.mjs";

const root = process.cwd();
const errors = [];
const workflowIds = ["standard", "feature", "lite", "bugfix", "refactor", "discovery"];

const sourceRequiredPaths = [
  "skills/sf-router/SKILL.md",
  "skills/sf-onboard/SKILL.md",
  "skills/sf-intake/SKILL.md",
  "skills/sf-discovery/SKILL.md",
  "skills/sf-prd/SKILL.md",
  "skills/sf-requirements/SKILL.md",
  "skills/sf-ui-design/SKILL.md",
  "skills/sf-tech-design/SKILL.md",
  "skills/sf-tasking/SKILL.md",
  "skills/sf-spec-review/SKILL.md",
  "skills/sf-implement/SKILL.md",
  "skills/sf-code-review/SKILL.md",
  "skills/sf-verify/SKILL.md",
  "skills/sf-close/SKILL.md",
  "skills/sf-doctor/SKILL.md",
  "skills/sf-work/SKILL.md",
  "runtime/AGENTS.md",
  "runtime/PROTOCOL.md",
  "runtime/attention.md",
  "runtime/manifest.yaml",
  "runtime/registry.yaml",
  "runtime/starter.manifest.json",
  "runtime/policy/rules/index.md",
  "runtime/policy/rules/analysis-workflow/README.md",
  "runtime/policy/rules/product-discovery/README.md",
  "runtime/policy/rules/experience-design/README.md",
  "runtime/policy/rules/experience-design/references/ui-mockup-protocol.md",
  "runtime/policy/rules/experience-design/references/visual-style.md",
  "runtime/policy/rules/experience-design/references/pencil.md",
  "runtime/policy/rules/experience-design/references/figma.md",
  "runtime/policy/rules/experience-design/references/html-mockup.md",
  "runtime/policy/rules/experience-design/references/ascii-mockup.md",
  "runtime/policy/tech-profiles/README.md",
  "runtime/policy/tech-profiles/database/rdbms-postgresql.md",
  "runtime/policy/tech-profiles/database/rdbms-mysql.md",
  "runtime/policy/tech-profiles/database/embedded-sqlite.md",
  "runtime/policy/workflows/standard.yaml",
  "runtime/policy/workflows/feature.yaml",
  "runtime/policy/workflows/lite.yaml",
  "runtime/policy/workflows/bugfix.yaml",
  "runtime/policy/workflows/refactor.yaml",
  "runtime/policy/workflows/discovery.yaml",
  "runtime/artifacts/schemas/standard.json",
  "runtime/artifacts/schemas/feature.json",
  "runtime/artifacts/schemas/lite.json",
  "runtime/artifacts/schemas/bugfix.json",
  "runtime/artifacts/schemas/refactor.json",
  "runtime/artifacts/schemas/discovery.json",
  "runtime/artifacts/templates/brief.md",
  "runtime/artifacts/templates/work-item.yaml",
  "runtime/artifacts/templates/original-request.md",
  "runtime/artifacts/templates/gap-report.md",
  "runtime/artifacts/templates/research.md",
  "runtime/artifacts/templates/requirements.md",
  "runtime/artifacts/templates/ui-design.md",
  "runtime/artifacts/templates/technical-design.md",
  "runtime/artifacts/templates/tasks.md",
  "runtime/artifacts/templates/spec-review.md",
  "runtime/artifacts/templates/implementation-plan.md",
  "runtime/artifacts/templates/implementation-report.md",
  "runtime/artifacts/templates/changed-files.md",
  "runtime/artifacts/templates/code-review.md",
  "runtime/artifacts/templates/verification-report.md",
  "runtime/artifacts/templates/ci-result.md",
  "runtime/artifacts/templates/ssot-sync.md",
  "runtime/artifacts/templates/release.md",
  "runtime/artifacts/templates/rollback.md",
  "runtime/execution/stages/README.md",
  "runtime/execution/stages/discovery/SKILL.md",
  "runtime/execution/stages/requirements/SKILL.md",
  "runtime/execution/stages/ui-design/SKILL.md",
  "runtime/execution/stages/technical-design/SKILL.md",
  "runtime/execution/stages/gap-report/SKILL.md",
  "runtime/execution/stages/research/SKILL.md",
  "runtime/execution/stages/technical-design/domain-design.md",
  "runtime/execution/stages/technical-design/api-design.md",
  "runtime/execution/stages/technical-design/data-design.md",
  "runtime/execution/stages/technical-design/nfr-design.md",
  "runtime/execution/stages/task-planning/SKILL.md",
  "runtime/execution/stages/spec-review/SKILL.md",
  "runtime/execution/stages/implementation/SKILL.md",
  "runtime/execution/stages/code-review/SKILL.md",
  "runtime/execution/stages/verification/SKILL.md",
  "runtime/execution/stages/ssot-sync/SKILL.md",
  "runtime/execution/stages/status/SKILL.md",
  "runtime/execution/stages/steering/SKILL.md",
  "runtime/execution/tools/lib/specforge.mjs",
  "runtime/execution/tools/archive-work-item.mjs",
  "runtime/execution/tools/artifact-graph-status.md",
  "runtime/execution/tools/artifact-graph-status.mjs",
  "runtime/execution/tools/create-work-item.mjs",
  "runtime/execution/tools/create-artifact.mjs",
  "runtime/execution/tools/instructions.mjs",
  "runtime/execution/tools/gate.mjs",
  "runtime/execution/tools/doctor.mjs",
  "runtime/execution/tools/install-agent-skills.mjs",
  "runtime/execution/tools/self-test.mjs",
  "runtime/execution/tools/status.mjs",
  "runtime/execution/tools/sync-codex-skills.mjs",
  "runtime/execution/tools/sync-starter-assets.mjs",
  "runtime/execution/tools/validate-skills.mjs",
  "runtime/execution/tools/validate-structure.mjs",
  "runtime/execution/hooks/README.md",
  "runtime/execution/hooks/pre-gate.mjs",
  "runtime/execution/hooks/post-gate.mjs",
  "runtime/execution/hooks/pre-implement.mjs",
  "runtime/execution/hooks/post-implement.mjs",
  "runtime/execution/hooks/pre-close.mjs",
  "runtime/execution/hooks/on-close.mjs",
  "runtime/execution/commands/sf-status.md",
  "runtime/execution/commands/sf-next.md",
  "runtime/execution/commands/sf-spec-review.md",
  "runtime/execution/commands/sf-code-review.md",
  "runtime/workspace/knowledge/README.md",
  "runtime/workspace/work-items/inbox",
  "runtime/workspace/work-items/active",
  "runtime/workspace/work-items/archive",
  "starter/README.md",
  "starter/.specforge/AGENTS.md",
  "starter/.specforge/policy/rules/index.md",
  "starter/.specforge/policy/tech-profiles/README.md",
  "starter/.specforge/policy/tech-profiles/database/rdbms-postgresql.md",
  "starter/.specforge/policy/tech-profiles/database/rdbms-mysql.md",
  "starter/.specforge/policy/tech-profiles/database/embedded-sqlite.md",
  "starter/.specforge/artifacts/templates/requirements.md",
  "starter/.specforge/artifacts/templates/ui-design.md",
  "starter/.specforge/artifacts/templates/technical-design.md",
  "starter/.specforge/artifacts/templates/gap-report.md",
  "starter/.specforge/artifacts/templates/research.md",
  "starter/.specforge/execution/tools/doctor.mjs",
  "starter/.specforge/execution/tools/create-work-item.mjs",
  "docs/README.md",
  "docs/AGENTS.md",
  "docs/CLAUDE.md",
  "docs/adapters/README.md",
  "cli/specforge.mjs",
];

const projectRequiredPaths = [
  ".specforge/AGENTS.md",
  ".specforge/attention.md",
  ".specforge/manifest.yaml",
  ".specforge/registry.yaml",
  ".specforge/policy/rules/index.md",
  ".specforge/policy/rules/experience-design/README.md",
  ".specforge/policy/rules/experience-design/references/ui-mockup-protocol.md",
  ".specforge/policy/rules/experience-design/references/visual-style.md",
  ".specforge/policy/rules/experience-design/references/pencil.md",
  ".specforge/policy/rules/experience-design/references/figma.md",
  ".specforge/policy/rules/experience-design/references/html-mockup.md",
  ".specforge/policy/rules/experience-design/references/ascii-mockup.md",
  ".specforge/policy/tech-profiles/README.md",
  ".specforge/policy/tech-profiles/database/rdbms-postgresql.md",
  ".specforge/policy/tech-profiles/database/rdbms-mysql.md",
  ".specforge/policy/tech-profiles/database/embedded-sqlite.md",
  ".specforge/policy/workflows/standard.yaml",
  ".specforge/policy/workflows/feature.yaml",
  ".specforge/policy/workflows/lite.yaml",
  ".specforge/policy/workflows/bugfix.yaml",
  ".specforge/policy/workflows/refactor.yaml",
  ".specforge/policy/workflows/discovery.yaml",
  ".specforge/artifacts/schemas/standard.json",
  ".specforge/artifacts/schemas/feature.json",
  ".specforge/artifacts/schemas/lite.json",
  ".specforge/artifacts/schemas/bugfix.json",
  ".specforge/artifacts/schemas/refactor.json",
  ".specforge/artifacts/schemas/discovery.json",
  ".specforge/artifacts/templates/brief.md",
  ".specforge/artifacts/templates/work-item.yaml",
  ".specforge/artifacts/templates/original-request.md",
  ".specforge/artifacts/templates/requirements.md",
  ".specforge/artifacts/templates/ui-design.md",
  ".specforge/artifacts/templates/technical-design.md",
  ".specforge/artifacts/templates/tasks.md",
  ".specforge/artifacts/templates/gap-report.md",
  ".specforge/artifacts/templates/research.md",
  ".specforge/artifacts/templates/spec-review.md",
  ".specforge/artifacts/templates/implementation-plan.md",
  ".specforge/artifacts/templates/implementation-report.md",
  ".specforge/artifacts/templates/changed-files.md",
  ".specforge/artifacts/templates/code-review.md",
  ".specforge/artifacts/templates/verification-report.md",
  ".specforge/artifacts/templates/ci-result.md",
  ".specforge/artifacts/templates/ssot-sync.md",
  ".specforge/artifacts/templates/release.md",
  ".specforge/artifacts/templates/rollback.md",
  ".specforge/execution/stages/README.md",
  ".specforge/execution/stages/discovery/SKILL.md",
  ".specforge/execution/stages/requirements/SKILL.md",
  ".specforge/execution/stages/ui-design/SKILL.md",
  ".specforge/execution/stages/technical-design/SKILL.md",
  ".specforge/execution/stages/gap-report/SKILL.md",
  ".specforge/execution/stages/research/SKILL.md",
  ".specforge/execution/stages/technical-design/domain-design.md",
  ".specforge/execution/stages/technical-design/api-design.md",
  ".specforge/execution/stages/technical-design/data-design.md",
  ".specforge/execution/stages/technical-design/nfr-design.md",
  ".specforge/execution/stages/task-planning/SKILL.md",
  ".specforge/execution/stages/spec-review/SKILL.md",
  ".specforge/execution/stages/implementation/SKILL.md",
  ".specforge/execution/stages/code-review/SKILL.md",
  ".specforge/execution/stages/verification/SKILL.md",
  ".specforge/execution/stages/ssot-sync/SKILL.md",
  ".specforge/execution/stages/status/SKILL.md",
  ".specforge/execution/stages/steering/SKILL.md",
  ".specforge/execution/tools/archive-work-item.mjs",
  ".specforge/execution/tools/artifact-graph-status.md",
  ".specforge/execution/tools/artifact-graph-status.mjs",
  ".specforge/execution/tools/create-artifact.mjs",
  ".specforge/execution/tools/create-work-item.mjs",
  ".specforge/execution/tools/doctor.mjs",
  ".specforge/execution/tools/gate.mjs",
  ".specforge/execution/tools/instructions.mjs",
  ".specforge/execution/tools/lib/specforge.mjs",
  ".specforge/execution/tools/self-test.mjs",
  ".specforge/execution/tools/status.mjs",
  ".specforge/execution/tools/validate-structure.mjs",
  ".specforge/execution/hooks/README.md",
  ".specforge/execution/hooks/pre-gate.mjs",
  ".specforge/execution/hooks/post-gate.mjs",
  ".specforge/execution/hooks/pre-implement.mjs",
  ".specforge/execution/hooks/post-implement.mjs",
  ".specforge/execution/hooks/pre-close.mjs",
  ".specforge/execution/hooks/on-close.mjs",
  ".specforge/execution/commands/sf-status.md",
  ".specforge/execution/commands/sf-next.md",
  ".specforge/execution/commands/sf-spec-review.md",
  ".specforge/execution/commands/sf-code-review.md",
  ".specforge/workspace/work-items/inbox",
  ".specforge/workspace/work-items/active",
  ".specforge/workspace/work-items/archive",
];

const requiredPaths = layout.kind === "source" ? sourceRequiredPaths : projectRequiredPaths;

function exists(relativePath) {
  return existsSync(join(root, relativePath));
}

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

for (const path of requiredPaths) {
  if (!exists(path)) errors.push(`Missing required path: ${path}`);
}

function loadSchema(workflow) {
  const schemaPath = `${layout.schemas}/${workflow}.json`;
  if (!exists(schemaPath)) {
    errors.push(`Missing workflow schema: ${schemaPath}`);
    return null;
  }
  try {
    return JSON.parse(read(schemaPath));
  } catch (error) {
    errors.push(`${schemaPath}: invalid JSON (${error.message})`);
    return null;
  }
}

function getGateBlock(yaml, gateName) {
  const markerMatch = yaml.match(new RegExp(`(?:^|\\r?\\n)  ${gateName}:\\r?\\n`));
  if (!markerMatch || markerMatch.index === undefined) return null;
  const rest = yaml.slice(markerMatch.index + markerMatch[0].length);
  const nextGate = rest.search(/\r?\n  [a-z_]+:\r?\n/);
  return nextGate === -1 ? rest : rest.slice(0, nextGate);
}

function outputsExist(relativeBase, outputs) {
  return outputs.every((output) => exists(`${relativeBase}/${output}`));
}

function anyOutputExists(relativeBase, outputs) {
  return outputs.some((output) => exists(`${relativeBase}/${output}`));
}

function artifactOutputsComplete(relativeBase, artifact) {
  return outputsExist(relativeBase, artifact.outputs);
}

function artifactOutputsPartial(relativeBase, artifact) {
  const hasAny = anyOutputExists(relativeBase, artifact.outputs);
  const hasAll = outputsExist(relativeBase, artifact.outputs);
  return hasAny && !hasAll;
}

function validateGates(relativeBase, yaml, schema, requireApproved) {
  for (const artifact of schema.artifacts.filter((item) => item.gate)) {
    const block = getGateBlock(yaml, artifact.gate);
    if (!block) {
      errors.push(`${relativeBase}: missing gate ${artifact.gate}`);
      continue;
    }
    const status = block.match(/status:\s*([A-Z_]+)/)?.[1];
    const evidence = block.match(/evidence:\s*(.+)/)?.[1]?.trim();
    if (!status) errors.push(`${relativeBase}: gate ${artifact.gate} is missing status`);
    if (requireApproved && status !== "APPROVED") {
      errors.push(`${relativeBase}: archived gate ${artifact.gate} must be APPROVED`);
    }
    if (status === "APPROVED") {
      if (!evidence || evidence === "null") {
        errors.push(`${relativeBase}: approved gate ${artifact.gate} has no evidence`);
      } else if (!exists(`${relativeBase}/${evidence}`)) {
        errors.push(`${relativeBase}: approved gate ${artifact.gate} evidence does not exist: ${evidence}`);
      }
    }
  }
}

function validateWorkItem(relativeBase, lifecycle) {
  if (!exists(`${relativeBase}/work-item.yaml`)) {
    errors.push(`${relativeBase}: missing work-item.yaml`);
    return;
  }

  const yaml = read(`${relativeBase}/work-item.yaml`);
  const workflow = parseField(yaml, "workflow") || "standard";
  const status = parseField(yaml, "status");
  const stage = parseField(yaml, "stage");
  const id = parseField(yaml, "id");
  const rawSchema = loadSchema(workflow);
  if (!rawSchema) return;
  const schema = effectiveSchema(rawSchema, yaml);

  if (!relativeBase.endsWith(id)) errors.push(`${relativeBase}: work-item.yaml id does not match directory name ${id}`);
  const stageSet = new Set(schema.artifacts.map((artifact) => artifact.stage));
  if (!stageSet.has(stage)) errors.push(`${relativeBase}: unknown stage ${stage}`);

  const isArchived = lifecycle === "archive" || status === "ARCHIVED";
  if (lifecycle === "active" && status === "ARCHIVED") errors.push(`${relativeBase}: active work item must not have ARCHIVED status`);
  if (lifecycle === "archive" && status !== "ARCHIVED") errors.push(`${relativeBase}: archived work item must have ARCHIVED status`);

  for (const artifact of schema.artifacts) {
    const hasAll = artifactOutputsComplete(relativeBase, artifact);
    const hasPartial = artifactOutputsPartial(relativeBase, artifact);
    if (isArchived && id.startsWith("WI-") && !hasAll) errors.push(`${relativeBase}: archived work item missing artifact ${artifact.id}`);
    else if (hasPartial && !hasAll) errors.push(`${relativeBase}: partially written artifact ${artifact.id}`);
  }

  validateGates(relativeBase, yaml, schema, isArchived);
}

const manifestPath = `${layout.runtime}/manifest.yaml`;
const manifest = exists(manifestPath) ? read(manifestPath) : "";
for (const workflowId of workflowIds) {
  if (!manifest.includes(`    - ${workflowId}`)) errors.push(`${manifestPath}: workflow.available missing ${workflowId}`);

  const workflowPath = `${layout.workflows}/${workflowId}.yaml`;
  if (exists(workflowPath)) {
    const workflowDescriptorId = parseField(read(workflowPath), "id");
    if (workflowDescriptorId !== workflowId) {
      errors.push(`${workflowPath}: id must be ${workflowId}, got ${workflowDescriptorId || "missing"}`);
    }
  }

  const schema = loadSchema(workflowId);
  if (!schema) continue;
  if (schema.id !== workflowId) errors.push(`${layout.schemas}/${workflowId}.json: id must be ${workflowId}, got ${schema.id || "missing"}`);
  for (const error of validateSchema(schema, `${layout.schemas}/${workflowId}.json`)) errors.push(error);
}

for (const kind of ["active", "archive"]) {
  const workItemsRoot = `${layout.workItems}/${kind}`;
  if (!exists(workItemsRoot)) continue;
  for (const entry of readdirSync(join(root, workItemsRoot), { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith("WI-")) validateWorkItem(`${workItemsRoot}/${entry.name}`, kind);
  }
}

const registry = exists(layout.registry) ? read(layout.registry) : "";

for (const match of registry.matchAll(/^\s*path:\s*(.+)$/gm)) {
  const registryPath = match[1].trim();
  if (!exists(registryPath)) errors.push(`registry path does not exist: ${registryPath}`);
}

for (const [sectionName, kind] of [["active", "active"], ["archive", "archive"]]) {
  const expectedSegment = `/${kind}/`;
  const entries = parseRegistryEntries(registry, sectionName);
  const seen = new Set();

  for (const entry of entries) {
    if (seen.has(entry.id)) errors.push(`registry ${sectionName} has duplicate id: ${entry.id}`);
    seen.add(entry.id);
    const expectedPath = `${layout.workItems}/${kind}/${entry.id}`;
    if (!entry.path.includes(expectedSegment)) {
      errors.push(`registry ${sectionName} entry points to wrong lifecycle path: ${entry.path}`);
    }
    if (entry.path !== expectedPath) {
      errors.push(`registry ${sectionName} entry path mismatch for ${entry.id}: expected ${expectedPath}, got ${entry.path}`);
    }
  }

  const directory = join(root, layout.workItems, kind);
  if (existsSync(directory)) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.startsWith("WI-") && !seen.has(entry.name)) {
        errors.push(`registry ${sectionName} missing directory entry: ${entry.name}`);
      }
    }
  }
}

if (layout.kind === "source" && exists("starter")) {
  const syncCheck = spawnSync(process.execPath, [`${layout.tools}/sync-starter-assets.mjs`, "--check"], {
    cwd: root,
    encoding: "utf8",
  });
  if (syncCheck.status !== 0) {
    const output = `${syncCheck.stdout ?? ""}${syncCheck.stderr ?? ""}`
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);
    for (const line of output) errors.push(line);
  }
}

for (const output of templateByOutput.values()) {
  if (!exists(`${layout.templates}/${output}`)) errors.push(`template mapping target missing: ${layout.templates}/${output}`);
}

if (errors.length > 0) {
  console.error("SpecForge validation failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SpecForge validation passed.");
console.log(`Checked ${requiredPaths.length} required paths for ${layout.kind} layout, workflow schema, registry paths, and work item evidence.`);
