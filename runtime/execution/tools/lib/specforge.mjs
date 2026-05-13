import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const root = process.cwd();

function hasSourceRuntime() {
  return existsSync(join(root, "runtime/manifest.yaml")) && existsSync(join(root, "runtime/workspace/changes"));
}

export const layout = hasSourceRuntime()
  ? {
      kind: "source",
      runtime: "runtime",
      workspace: "runtime/workspace",
      changes: "runtime/workspace/changes",
      registry: "runtime/registry.yaml",
      schemas: "runtime/artifacts/schemas",
      templates: "runtime/artifacts/templates",
      rules: "runtime/policy/rules",
      techProfiles: "runtime/policy/tech-profiles",
      workflows: "runtime/policy/workflows",
      tools: "runtime/execution/tools",
      stages: "runtime/execution/stages",
      commands: "runtime/execution/commands",
      hooks: "runtime/execution/hooks",
      projectHooks: "runtime/execution/hooks",
      starterManifest: "runtime/starter.manifest.json",
      starter: "starter",
      skills: "skills",
    }
  : {
      kind: "project",
      runtime: ".specforge",
      workspace: ".specforge/workspace",
      changes: ".specforge/workspace/changes",
      registry: ".specforge/registry.yaml",
      schemas: ".specforge/artifacts/schemas",
      templates: ".specforge/artifacts/templates",
      rules: ".specforge/policy/rules",
      techProfiles: ".specforge/policy/tech-profiles",
      workflows: ".specforge/policy/workflows",
      tools: ".specforge/execution/tools",
      stages: ".specforge/execution/stages",
      commands: ".specforge/execution/commands",
      hooks: ".specforge/execution/hooks",
      projectHooks: ".specforge/execution/hooks",
      starterManifest: ".specforge/starter.manifest.json",
      starter: ".specforge",
      skills: ".",
    };

export function runtimePath(relativePath) {
  return relativePath ? `${layout.runtime}/${relativePath}` : layout.runtime;
}

export function workspacePath(relativePath) {
  return relativePath ? `${layout.workspace}/${relativePath}` : layout.workspace;
}

export function abs(relativePath) {
  return join(root, relativePath);
}

export function exists(relativePath) {
  return existsSync(abs(relativePath));
}

export function readText(relativePath) {
  return readFileSync(abs(relativePath), "utf8");
}

export function writeText(relativePath, content) {
  const target = abs(relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf8");
}

export function movePath(from, to) {
  mkdirSync(dirname(abs(to)), { recursive: true });
  renameSync(abs(from), abs(to));
}

export function parseField(text, name) {
  return text.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? "";
}

export function localDateIso() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getGateBlock(yaml, gateName) {
  const markerMatch = yaml.match(new RegExp(`(?:^|\\r?\\n)  ${gateName}:\\r?\\n`));
  if (!markerMatch || markerMatch.index === undefined) return null;
  const blockStart = markerMatch.index + markerMatch[0].length;
  const rest = yaml.slice(blockStart);
  const nextGate = rest.search(/\r?\n  [a-z_]+:\r?\n/);
  return nextGate === -1 ? rest : rest.slice(0, nextGate);
}

function getGateBounds(yaml, gateName) {
  const markerMatch = yaml.match(new RegExp(`(?:^|\\r?\\n)  ${gateName}:\\r?\\n`));
  if (!markerMatch || markerMatch.index === undefined) return null;
  const blockStart = markerMatch.index + markerMatch[0].length;
  const rest = yaml.slice(blockStart);
  const nextGate = rest.search(/\r?\n  [a-z_]+:\r?\n/);
  const newlineLength = nextGate !== -1 && rest[nextGate] === "\r" && rest[nextGate + 1] === "\n" ? 2 : 1;
  const blockEnd = nextGate === -1 ? yaml.length : blockStart + nextGate + newlineLength;
  return { blockStart, blockEnd };
}

export function gateStatus(yaml, gateName) {
  const block = getGateBlock(yaml, gateName);
  if (!block) return "MISSING";
  return block.match(/status:\s*([A-Z_]+)/)?.[1] ?? "UNKNOWN";
}

export function gateEvidence(yaml, gateName) {
  const block = getGateBlock(yaml, gateName);
  if (!block) return null;
  const evidence = block.match(/evidence:\s*(.+)/)?.[1]?.trim();
  return evidence && evidence !== "null" ? evidence : null;
}

export function updateGate(changeBase, gateName, status, evidence) {
  const changePath = `${changeBase}/change.yaml`;
  let yaml = readText(changePath);
  const bounds = getGateBounds(yaml, gateName);
  if (!bounds) throw new Error(`Missing gate in change.yaml: ${gateName}`);

  let block = yaml.slice(bounds.blockStart, bounds.blockEnd);
  block = block.replace(/^    status:\s*.+$/m, `    status: ${status}`);
  block = block.replace(/^    evidence:\s*.*$/m, `    evidence: ${evidence ?? "null"}`);

  yaml = `${yaml.slice(0, bounds.blockStart)}${block}${yaml.slice(bounds.blockEnd)}`;
  yaml = yaml.replace(/^updated_at:\s*.+$/m, `updated_at: ${localDateIso()}`);
  writeText(changePath, yaml);
}

export function updateChangeStage(changeBase, stage) {
  const changePath = `${changeBase}/change.yaml`;
  let yaml = readText(changePath);
  yaml = yaml.replace(/^stage:\s*.+$/m, `stage: ${stage}`);
  yaml = yaml.replace(/^updated_at:\s*.+$/m, `updated_at: ${localDateIso()}`);
  writeText(changePath, yaml);
}

export function updateChangeStatus(changeBase, status) {
  const changePath = `${changeBase}/change.yaml`;
  let yaml = readText(changePath);
  yaml = yaml.replace(/^status:\s*.+$/m, `status: ${status}`);
  yaml = yaml.replace(/^updated_at:\s*.+$/m, `updated_at: ${localDateIso()}`);
  writeText(changePath, yaml);
}

export function listChanges(kind) {
  const dir = `${layout.changes}/${kind}`;
  if (!exists(dir)) return [];
  return readdirSync(abs(dir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("CHG-"))
    .map((entry) => entry.name)
    .sort();
}

export function resolveChange(options = {}) {
  const { change, activeOnly = false, defaultToLatestArchive = false } = options;

  if (change) {
    const activeBase = `${layout.changes}/active/${change}`;
    if (exists(`${activeBase}/change.yaml`)) return { name: change, base: activeBase, lifecycle: "active" };

    const archiveBase = `${layout.changes}/archive/${change}`;
    if (!activeOnly && exists(`${archiveBase}/change.yaml`)) {
      return { name: change, base: archiveBase, lifecycle: "archive" };
    }

    throw new Error(activeOnly ? `Active change not found: ${change}` : `Change not found: ${change}`);
  }

  const active = listChanges("active");
  if (active.length === 1) {
    const name = active[0];
    return { name, base: `${layout.changes}/active/${name}`, lifecycle: "active" };
  }
  if (active.length > 1) {
    throw new Error(`Multiple active changes found. Pass --change <id>:\n${active.map((item) => `- ${item}`).join("\n")}`);
  }

  if (!activeOnly && defaultToLatestArchive) {
    const archived = listChanges("archive");
    if (archived.length > 0) {
      const name = archived[archived.length - 1];
      return { name, base: `${layout.changes}/archive/${name}`, lifecycle: "archive" };
    }
  }

  throw new Error(activeOnly ? "No active changes found." : "No active changes found.");
}

export function loadSchema(workflow = "standard") {
  const schemaPath = `${layout.schemas}/${workflow}.json`;
  if (!exists(schemaPath)) throw new Error(`Missing workflow schema: ${schemaPath}`);
  return JSON.parse(readText(schemaPath));
}

export function artifactById(schema, artifactId) {
  return schema.artifacts.find((artifact) => artifact.id === artifactId);
}

export function outputsExist(changeBase, outputs) {
  return outputs.every((output) => exists(`${changeBase}/${output}`));
}

export function anyOutputExists(changeBase, outputs) {
  return outputs.some((output) => exists(`${changeBase}/${output}`));
}

export function computeArtifactStates(schema, changeYaml, changeBase) {
  const states = new Map();

  for (const artifact of schema.artifacts) {
    const depsDone = artifact.requires.every((id) => states.get(id) === "done");
    const hasAny = anyOutputExists(changeBase, artifact.outputs);
    const hasAll = outputsExist(changeBase, artifact.outputs);

    if (!depsDone) {
      states.set(artifact.id, hasAny && !hasAll ? "partial" : "blocked");
      continue;
    }

    if (artifact.gate) {
      const status = gateStatus(changeYaml, artifact.gate);
      if (status === "APPROVED" && hasAll) {
        states.set(artifact.id, "done");
      } else if (hasAny && !hasAll) {
        states.set(artifact.id, "partial");
      } else {
        states.set(artifact.id, "ready");
      }
      continue;
    }

    if (hasAll) {
      states.set(artifact.id, "done");
    } else if (hasAny) {
      states.set(artifact.id, "partial");
    } else {
      states.set(artifact.id, "ready");
    }
  }

  return states;
}

export const templateByOutput = new Map([
  ["00-intake/original-request.md", "original-request.md"],
  ["00-intake/brief.md", "brief.md"],
  ["01-spec/requirements.md", "requirements.md"],
  ["01-spec/design.md", "design.md"],
  ["01-spec/tasks.md", "tasks.md"],
  ["02-spec-review/spec-review-v1.md", "spec-review.md"],
  ["03-implementation/plan.md", "implementation-plan.md"],
  ["03-implementation/report.md", "implementation-report.md"],
  ["03-implementation/changed-files.md", "changed-files.md"],
  ["04-code-review/code-review-v1.md", "code-review.md"],
  ["05-verification/report.md", "verification-report.md"],
  ["05-verification/ci-result.md", "ci-result.md"],
  ["06-closure/ssot-sync.md", "ssot-sync.md"],
  ["06-closure/release.md", "release.md"],
  ["06-closure/rollback.md", "rollback.md"],
]);

export function renderOutput(output) {
  const templateName = templateByOutput.get(output);
  if (!templateName) throw new Error(`No template mapped for output: ${output}`);
  return readText(`${layout.templates}/${templateName}`);
}

export function validateSchema(schema, schemaName = schema.id ?? "schema") {
  const errors = [];

  if (!schema.id) errors.push(`${schemaName}: missing id`);
  if (!Array.isArray(schema.artifacts) || schema.artifacts.length === 0) {
    errors.push(`${schemaName}: artifacts must be a non-empty array`);
    return errors;
  }

  const ids = new Set();
  for (const artifact of schema.artifacts) {
    if (!artifact.id) errors.push(`${schemaName}: artifact is missing id`);
    if (ids.has(artifact.id)) errors.push(`${schemaName}: duplicate artifact id ${artifact.id}`);
    ids.add(artifact.id);
    if (!artifact.stage) errors.push(`${schemaName}: artifact ${artifact.id} is missing stage`);
    if (!artifact.title) errors.push(`${schemaName}: artifact ${artifact.id} is missing title`);
    if (!Array.isArray(artifact.outputs) || artifact.outputs.length === 0) {
      errors.push(`${schemaName}: artifact ${artifact.id} outputs must be non-empty`);
    }
    if (!Array.isArray(artifact.requires)) {
      errors.push(`${schemaName}: artifact ${artifact.id} requires must be an array`);
    }
    for (const output of artifact.outputs ?? []) {
      if (!templateByOutput.has(output)) errors.push(`${schemaName}: output has no template mapping: ${output}`);
    }
  }

  for (const artifact of schema.artifacts) {
    for (const dep of artifact.requires ?? []) {
      if (!ids.has(dep)) errors.push(`${schemaName}: artifact ${artifact.id} has unknown dependency ${dep}`);
    }
  }

  const visiting = new Set();
  const visited = new Set();
  const byId = new Map(schema.artifacts.map((artifact) => [artifact.id, artifact]));

  function visit(id, stack) {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      errors.push(`${schemaName}: cycle detected: ${[...stack, id].join(" -> ")}`);
      return;
    }
    visiting.add(id);
    for (const dep of byId.get(id)?.requires ?? []) visit(dep, [...stack, id]);
    visiting.delete(id);
    visited.add(id);
  }

  for (const artifact of schema.artifacts) visit(artifact.id, []);

  return errors;
}

export function nextReadyArtifact(schema, states) {
  return schema.artifacts.find((artifact) => states.get(artifact.id) === "ready") ?? null;
}

export function parseTasks(content) {
  const tasks = [];
  for (const line of content.split("\n")) {
    const match = line.match(/^\s*[-*]\s+\[([ xX])]\s+(.+)$/);
    if (!match) continue;
    tasks.push({
      done: match[1].toLowerCase() === "x",
      title: match[2].trim(),
    });
  }
  return tasks;
}

export function makeArchiveRegistryEntry(id, yaml, archiveBase) {
  const title = parseField(yaml, "title") || id;
  const type = parseField(yaml, "type") || "FEATURE";
  return `  - id: ${id}\n    title: ${title}\n    type: ${type}\n    status: ARCHIVED\n    path: ${archiveBase}\n`;
}

export function removeRegistryEntry(registry, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`  - id: ${escaped}\\n[\\s\\S]*?(?=\\n  - id:|\\nblocked:|\\narchive:|$)`);
  return registry.replace(pattern, "");
}

export function normalizeEmptyActive(registry) {
  return registry.replace(/^active:\s*\n+(?=blocked:)/m, "active: []\n\n");
}

export function appendArchiveRegistryEntry(registry, entry) {
  if (!registry.includes("\narchive:")) return `${registry.trimEnd()}\narchive:\n${entry}`;
  return `${registry.trimEnd()}\n${entry}`;
}

export function registrySection(registry, sectionName) {
  const match = registry.match(new RegExp(`^${sectionName}:`, "m"));
  if (!match || match.index === undefined) return "";
  const start = match.index + match[0].length;
  const rest = registry.slice(start);
  const next = rest.search(/\n[a-z_]+:/);
  return next === -1 ? rest : rest.slice(0, next);
}

export function parseRegistryEntries(registry, sectionName) {
  const section = registrySection(registry, sectionName);
  const entries = [];
  const entryPattern = /(?:^|\r?\n)\s*-\s+id:\s*([^\r\n]+)\r?\n([\s\S]*?)(?=\r?\n\s*-\s+id:|$)/g;
  for (const match of section.matchAll(entryPattern)) {
    const id = match[1].trim();
    const body = match[2];
    entries.push({
      id,
      title: body.match(/^\s*title:\s*(.+)$/m)?.[1]?.trim() ?? "",
      type: body.match(/^\s*type:\s*(.+)$/m)?.[1]?.trim() ?? "",
      status: body.match(/^\s*status:\s*(.+)$/m)?.[1]?.trim() ?? "",
      path: body.match(/^\s*path:\s*(.+)$/m)?.[1]?.trim() ?? "",
    });
  }
  return entries;
}
