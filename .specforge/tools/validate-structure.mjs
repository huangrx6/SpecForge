import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseRegistryEntries, templateByOutput } from "./lib/specforge.mjs";

const root = process.cwd();

const requiredPaths = [
  ".specforge/AGENTS.md",
  ".specforge/attention.md",
  ".specforge/manifest.yaml",
  ".specforge/workflows/lite.yaml",
  ".specforge/workflows/standard.yaml",
  ".specforge/workflows/bugfix.yaml",
  ".specforge/schemas/standard.json",
  ".specforge/agents/loading.md",
  ".specforge/agents/roles/orchestrator.md",
  ".specforge/agents/roles/developer.md",
  ".specforge/agents/roles/reviewer.md",
  ".specforge/agents/roles/qa.md",
  ".specforge/rules/index.md",
  ".specforge/rules/api-design.md",
  ".specforge/rules/boundaries.md",
  ".specforge/rules/context.md",
  ".specforge/rules/delivery.md",
  ".specforge/rules/engineering.md",
  ".specforge/rules/gates.md",
  ".specforge/rules/artifact-graph.md",
  ".specforge/rules/localization.md",
  ".specforge/rules/review.md",
  ".specforge/rules/security.md",
  ".specforge/rules/spec-quality.md",
  ".specforge/rules/testing.md",
  ".specforge/commands/specforge.discovery.md",
  ".specforge/commands/specforge.spec.md",
  ".specforge/commands/specforge.tasks.md",
  ".specforge/commands/specforge.status.md",
  ".specforge/commands/specforge.validate.md",
  ".specforge/commands/specforge.doctor.md",
  ".specforge/commands/specforge.work.md",
  ".specforge/templates/change.yaml",
  ".specforge/templates/original-request.md",
  ".specforge/templates/brief.md",
  ".specforge/templates/requirements.md",
  ".specforge/templates/design.md",
  ".specforge/templates/tasks.md",
  ".specforge/templates/spec-review.md",
  ".specforge/templates/implementation-plan.md",
  ".specforge/templates/implementation-report.md",
  ".specforge/templates/changed-files.md",
  ".specforge/templates/code-review.md",
  ".specforge/templates/verification-report.md",
  ".specforge/templates/ci-result.md",
  ".specforge/templates/release.md",
  ".specforge/templates/rollback.md",
  ".specforge/templates/ssot-sync.md",
  ".specforge/tools/create-change.mjs",
  ".specforge/tools/create-artifact.mjs",
  ".specforge/tools/instructions.mjs",
  ".specforge/tools/gate.mjs",
  ".specforge/tools/archive-change.mjs",
  ".specforge/tools/self-test.mjs",
  ".specforge/tools/doctor.mjs",
  ".specforge/tools/lib/specforge.mjs",
  ".specforge/tools/artifact-graph-status.mjs",
  ".specforge/tools/status.mjs",
  ".specforge/tools/validate-structure.mjs",
  ".specforge/registry.yaml",
  ".specforge/project/README.md",
  ".specforge/project/constitution.md",
  ".specforge/project/glossary.md",
  ".specforge/project/product/vision.md",
  ".specforge/project/product/feature-list.md",
  ".specforge/project/product/positioning.md",
  ".specforge/project/engineering/architecture.md",
  ".specforge/project/engineering/project-structure.md",
  ".specforge/project/engineering/validation-model.md",
  ".specforge/project/decisions",
  ".specforge/project/risks.md",
  ".specforge/changes/inbox",
  ".specforge/changes/active",
  ".specforge/changes/archive",
  ".specforge/reference/system-overview.md",
  ".specforge/reference/getting-started.md",
  ".specforge/reference/ai-usage.md",
];

const sourceOnlyPaths = [
  "specforge/SKILL.md",
  "specforge-onboard/SKILL.md",
  "specforge-intake/SKILL.md",
  "specforge-spec/SKILL.md",
  "specforge-implement/SKILL.md",
  "specforge-review/SKILL.md",
  "specforge-verify/SKILL.md",
  "specforge-close/SKILL.md",
  "specforge-doctor/SKILL.md",
  "specforge-work/SKILL.md",
  ".specforge/adapters/README.md",
  ".specforge/adapters/codex.md",
  ".specforge/adapters/claude-code.md",
  ".specforge/stage-guides",
  ".specforge/tools/install-agent-skills.mjs",
  ".specforge/tools/sync-codex-skills.mjs",
  "bin/specforge.mjs",
];

if (existsSync(join(root, "specforge/SKILL.md"))) {
  requiredPaths.push(...sourceOnlyPaths);
}

const errors = [];
const missing = requiredPaths.filter((path) => !existsSync(join(root, path)));

if (missing.length > 0) {
  for (const path of missing) errors.push(`Missing required path: ${path}`);
}

function readText(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function parseField(text, name) {
  return text.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? "";
}

function getGateBlock(yaml, gateName) {
  const marker = `  ${gateName}:\n`;
  const start = yaml.indexOf(marker);
  if (start === -1) return null;
  const rest = yaml.slice(start + marker.length);
  const nextGate = rest.search(/\n  [a-z_]+:\n/);
  return nextGate === -1 ? rest : rest.slice(0, nextGate);
}

function loadSchema(workflow) {
  const schemaPath = `.specforge/schemas/${workflow}.json`;
  if (!existsSync(join(root, schemaPath))) {
    errors.push(`Missing workflow schema: ${schemaPath}`);
    return null;
  }
  try {
    return JSON.parse(readText(schemaPath));
  } catch (error) {
    errors.push(`${schemaPath}: invalid JSON (${error.message})`);
    return null;
  }
}

function validateSchema(schema, schemaName) {
  if (!schema) return;
  if (!schema.id) errors.push(`${schemaName}: missing id`);
  if (!Array.isArray(schema.artifacts) || schema.artifacts.length === 0) {
    errors.push(`${schemaName}: artifacts must be a non-empty array`);
    return;
  }

  const ids = new Set();
  const byId = new Map();
  for (const artifact of schema.artifacts) {
    if (!artifact.id) errors.push(`${schemaName}: artifact is missing id`);
    if (ids.has(artifact.id)) errors.push(`${schemaName}: duplicate artifact id ${artifact.id}`);
    ids.add(artifact.id);
    if (artifact.id) byId.set(artifact.id, artifact);
    if (!artifact.stage) errors.push(`${schemaName}: artifact ${artifact.id} is missing stage`);
    if (!artifact.title) errors.push(`${schemaName}: artifact ${artifact.id} is missing title`);
    if (!Array.isArray(artifact.outputs) || artifact.outputs.length === 0) {
      errors.push(`${schemaName}: artifact ${artifact.id} outputs must be non-empty`);
    }
    if (!Array.isArray(artifact.requires)) {
      errors.push(`${schemaName}: artifact ${artifact.id} requires must be an array`);
    }
    for (const output of artifact.outputs ?? []) {
      if (!templateByOutput.has(output)) {
        errors.push(`${schemaName}: output has no template mapping: ${output}`);
      }
    }
  }

  for (const artifact of schema.artifacts) {
    for (const dep of artifact.requires ?? []) {
      if (!ids.has(dep)) errors.push(`${schemaName}: artifact ${artifact.id} has unknown dependency ${dep}`);
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(id, stack) {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      errors.push(`${schemaName}: dependency cycle detected: ${[...stack, id].join(" -> ")}`);
      return;
    }
    visiting.add(id);
    for (const dep of byId.get(id)?.requires ?? []) visit(dep, [...stack, id]);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of ids) visit(id, []);

  for (const [section, config] of Object.entries({ apply: schema.apply, archive: schema.archive })) {
    for (const dep of config?.requires ?? []) {
      if (!ids.has(dep)) errors.push(`${schemaName}: ${section}.requires has unknown artifact ${dep}`);
    }
  }
}

function outputsExist(relativeBase, outputs) {
  return outputs.every((output) => existsSync(join(root, relativeBase, output)));
}

function anyOutputExists(relativeBase, outputs) {
  return outputs.some((output) => existsSync(join(root, relativeBase, output)));
}

function validateGates(relativeBase, yaml, schema, requireApproved) {
  const gateArtifacts = schema.artifacts.filter((artifact) => artifact.gate);
  for (const artifact of gateArtifacts) {
    const gate = artifact.gate;
    const block = getGateBlock(yaml, gate);
    if (!block) {
      errors.push(`${relativeBase}: missing gate ${gate}`);
      continue;
    }
    const status = block.match(/status:\s*([A-Z_]+)/)?.[1];
    const evidence = block.match(/evidence:\s*(.+)/)?.[1]?.trim();
    if (!status) errors.push(`${relativeBase}: gate ${gate} is missing status`);
    if (requireApproved && status !== "APPROVED") {
      errors.push(`${relativeBase}: archived gate ${gate} must be APPROVED`);
    }
    if (status === "APPROVED") {
      if (!evidence || evidence === "null") {
        errors.push(`${relativeBase}: approved gate ${gate} has no evidence`);
      } else if (!existsSync(join(root, relativeBase, evidence))) {
        errors.push(`${relativeBase}: approved gate ${gate} evidence does not exist: ${evidence}`);
      }
    }
  }
}

function validateChange(relativeBase, lifecycle) {
  const changeYamlPath = join(root, relativeBase, "change.yaml");
  if (!existsSync(changeYamlPath)) {
    errors.push(`${relativeBase}: missing change.yaml`);
    return;
  }

  const yaml = readText(`${relativeBase}/change.yaml`);
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
  if (lifecycle === "active" && status === "ARCHIVED") {
    errors.push(`${relativeBase}: active change must not have ARCHIVED status`);
  }
  if (lifecycle === "archive" && status !== "ARCHIVED") {
    errors.push(`${relativeBase}: archived change must have ARCHIVED status`);
  }

  for (const artifact of schema.artifacts) {
    const hasAny = anyOutputExists(relativeBase, artifact.outputs);
    const hasAll = outputsExist(relativeBase, artifact.outputs);
    if (isArchived && !hasAll) {
      errors.push(`${relativeBase}: archived change missing artifact ${artifact.id}`);
    } else if (hasAny && !hasAll) {
      errors.push(`${relativeBase}: partially written artifact ${artifact.id}`);
    }
  }

  validateGates(relativeBase, yaml, schema, isArchived);
}

const builtInSchema = loadSchema("standard");
validateSchema(builtInSchema, ".specforge/schemas/standard.json");

for (const relativeRoot of [".specforge/changes/active", ".specforge/changes/archive"]) {
  const absoluteRoot = join(root, relativeRoot);
  if (!existsSync(absoluteRoot)) continue;
  for (const entry of readdirSync(absoluteRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith("CHG-")) {
      validateChange(`${relativeRoot}/${entry.name}`, relativeRoot.endsWith("archive") ? "archive" : "active");
    }
  }
}

const registry = existsSync(join(root, ".specforge/registry.yaml")) ? readText(".specforge/registry.yaml") : "";
for (const match of registry.matchAll(/^\s*path:\s*(.+)$/gm)) {
  const registryPath = match[1].trim();
  if (!existsSync(join(root, registryPath))) {
    errors.push(`registry path does not exist: ${registryPath}`);
  } else if (registryPath.includes("/active/") && !registry.includes(`active:\n`)) {
    errors.push(`registry active path found without active section: ${registryPath}`);
  }
}

function registrySection(text, sectionName) {
  const marker = `${sectionName}:`;
  const start = text.indexOf(marker);
  if (start === -1) return "";
  const rest = text.slice(start + marker.length);
  const next = rest.search(/\n[a-z_]+:/);
  return next === -1 ? rest : rest.slice(0, next);
}

for (const [sectionName, expectedSegment] of [
  ["active", "/active/"],
  ["archive", "/archive/"],
]) {
  for (const entry of parseRegistryEntries(registry, sectionName)) {
    const registryPath = entry.path;
    if (!registryPath.includes(expectedSegment)) {
      errors.push(`registry ${sectionName} entry points to wrong lifecycle path: ${registryPath}`);
    }
  }
}

function changeDirs(kind) {
  const directory = join(root, `.specforge/changes/${kind}`);
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("CHG-"))
    .map((entry) => entry.name)
    .sort();
}

function validateRegistryDirectoryMatch(sectionName, kind) {
  const entries = parseRegistryEntries(registry, sectionName);
  const seen = new Set();
  for (const entry of entries) {
    if (seen.has(entry.id)) errors.push(`registry ${sectionName} has duplicate id: ${entry.id}`);
    seen.add(entry.id);
    const expectedPath = `.specforge/changes/${kind}/${entry.id}`;
    if (entry.path !== expectedPath) {
      errors.push(`registry ${sectionName} entry path mismatch for ${entry.id}: expected ${expectedPath}, got ${entry.path}`);
    }
  }

  for (const id of changeDirs(kind)) {
    if (!seen.has(id)) errors.push(`registry ${sectionName} missing directory entry: ${id}`);
  }
}

validateRegistryDirectoryMatch("active", "active");
validateRegistryDirectoryMatch("archive", "archive");

if (errors.length > 0) {
  console.error("SpecForge validation failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SpecForge validation passed.");
console.log(`Checked ${requiredPaths.length} required paths, workflow schema, registry paths, and change evidence.`);
