import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { layout, parseRegistryEntries, parseField, templateByOutput, validateSchema } from "./lib/specforge.mjs";

const root = process.cwd();
const errors = [];

const sourceRequiredPaths = [
  "skills/sf-router/SKILL.md",
  "skills/sf-onboard/SKILL.md",
  "skills/sf-intake/SKILL.md",
  "skills/sf-spec/SKILL.md",
  "skills/sf-implement/SKILL.md",
  "skills/sf-review/SKILL.md",
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
  "runtime/policy/tech-profiles/README.md",
  "runtime/policy/workflows/standard.yaml",
  "runtime/artifacts/schemas/standard.json",
  "runtime/artifacts/templates/brief.md",
  "runtime/artifacts/templates/requirements.md",
  "runtime/artifacts/templates/design.md",
  "runtime/artifacts/templates/tasks.md",
  "runtime/execution/stages/README.md",
  "runtime/execution/stages/discovery/SKILL.md",
  "runtime/execution/stages/requirements/SKILL.md",
  "runtime/execution/stages/design/SKILL.md",
  "runtime/execution/stages/task-planning/SKILL.md",
  "runtime/execution/stages/spec-review/SKILL.md",
  "runtime/execution/tools/lib/specforge.mjs",
  "runtime/execution/tools/create-change.mjs",
  "runtime/execution/tools/create-artifact.mjs",
  "runtime/execution/tools/instructions.mjs",
  "runtime/execution/tools/gate.mjs",
  "runtime/execution/tools/doctor.mjs",
  "runtime/execution/tools/validate-structure.mjs",
  "runtime/execution/hooks/pre-gate.mjs",
  "runtime/execution/hooks/post-gate.mjs",
  "runtime/execution/hooks/pre-implement.mjs",
  "runtime/execution/hooks/post-implement.mjs",
  "runtime/execution/hooks/pre-close.mjs",
  "runtime/execution/hooks/on-close.mjs",
  "runtime/execution/commands/sf-status.md",
  "runtime/execution/commands/sf-next.md",
  "runtime/execution/commands/sf-review.md",
  "runtime/workspace/knowledge/README.md",
  "runtime/workspace/changes/inbox",
  "runtime/workspace/changes/active",
  "runtime/workspace/changes/archive",
  "starter/README.md",
  "starter/.specforge/AGENTS.md",
  "starter/.specforge/policy/rules/index.md",
  "starter/.specforge/artifacts/templates/requirements.md",
  "starter/.specforge/execution/tools/doctor.mjs",
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
  ".specforge/artifacts/templates/requirements.md",
  ".specforge/execution/tools/doctor.mjs",
  ".specforge/execution/hooks/pre-gate.mjs",
  ".specforge/workspace/changes/inbox",
  ".specforge/workspace/changes/active",
  ".specforge/workspace/changes/archive",
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

function validateChange(relativeBase, lifecycle) {
  if (!exists(`${relativeBase}/change.yaml`)) {
    errors.push(`${relativeBase}: missing change.yaml`);
    return;
  }

  const yaml = read(`${relativeBase}/change.yaml`);
  const workflow = parseField(yaml, "workflow") || "standard";
  const status = parseField(yaml, "status");
  const stage = parseField(yaml, "stage");
  const id = parseField(yaml, "id");
  const schema = loadSchema(workflow);
  if (!schema) return;

  if (!relativeBase.endsWith(id)) errors.push(`${relativeBase}: change.yaml id does not match directory name ${id}`);
  const stageSet = new Set(schema.artifacts.map((artifact) => artifact.stage));
  if (!stageSet.has(stage)) errors.push(`${relativeBase}: unknown stage ${stage}`);

  const isArchived = lifecycle === "archive" || status === "ARCHIVED";
  if (lifecycle === "active" && status === "ARCHIVED") errors.push(`${relativeBase}: active change must not have ARCHIVED status`);
  if (lifecycle === "archive" && status !== "ARCHIVED") errors.push(`${relativeBase}: archived change must have ARCHIVED status`);

  for (const artifact of schema.artifacts) {
    const hasAny = anyOutputExists(relativeBase, artifact.outputs);
    const hasAll = outputsExist(relativeBase, artifact.outputs);
    if (isArchived && !hasAll) errors.push(`${relativeBase}: archived change missing artifact ${artifact.id}`);
    else if (hasAny && !hasAll) errors.push(`${relativeBase}: partially written artifact ${artifact.id}`);
  }

  validateGates(relativeBase, yaml, schema, isArchived);
}

const schema = loadSchema("standard");
for (const error of validateSchema(schema, `${layout.schemas}/standard.json`)) errors.push(error);

for (const kind of ["active", "archive"]) {
  const changesRoot = `${layout.changes}/${kind}`;
  if (!exists(changesRoot)) continue;
  for (const entry of readdirSync(join(root, changesRoot), { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith("CHG-")) validateChange(`${changesRoot}/${entry.name}`, kind);
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
    const expectedPath = `${layout.changes}/${kind}/${entry.id}`;
    if (!entry.path.includes(expectedSegment)) {
      errors.push(`registry ${sectionName} entry points to wrong lifecycle path: ${entry.path}`);
    }
    if (entry.path !== expectedPath) {
      errors.push(`registry ${sectionName} entry path mismatch for ${entry.id}: expected ${expectedPath}, got ${entry.path}`);
    }
  }

  const directory = join(root, layout.changes, kind);
  if (existsSync(directory)) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.startsWith("CHG-") && !seen.has(entry.name)) {
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
console.log(`Checked ${requiredPaths.length} required paths for ${layout.kind} layout, workflow schema, registry paths, and change evidence.`);
