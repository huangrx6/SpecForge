import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { computeArtifactStates, effectiveSchema, layout, loadSchema, nextReadyArtifact, writeText } from "./lib/specforge.mjs";

const root = process.cwd();
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function positionalArgs() {
  const values = [];
  const optionsWithValues = new Set([
    "--workflow",
    "--kind",
    "--type",
    "--short-title",
    "--has-ui",
    "--has-api",
    "--has-db",
    "--has-domain",
    "--has-ai",
    "--has-nfr",
    "--has-security",
    "--has-integration",
    "--has-infra",
    "--has-background-job",
    "--needs-research",
  ]);
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

const componentOptionMap = new Map([
  ["has_ui", "--has-ui"],
  ["has_api", "--has-api"],
  ["has_db", "--has-db"],
  ["has_domain", "--has-domain"],
  ["has_ai", "--has-ai"],
  ["has_nfr", "--has-nfr"],
  ["has_security", "--has-security"],
  ["has_integration", "--has-integration"],
  ["has_infra", "--has-infra"],
  ["has_background_job", "--has-background-job"],
  ["needs_research", "--needs-research"],
]);

const workflow = argValue("--workflow") ?? "feature";
const defaultKindByWorkflow = {
  feature: "feat",
  standard: "feat",
  lite: "chore",
  bugfix: "bugfix",
  refactor: "refactor",
  discovery: "research",
  research: "research",
  issue: "issue",
};
const defaultTypeByWorkflow = {
  feature: "FEATURE",
  standard: "FEATURE",
  lite: "FEATURE",
  bugfix: "BUGFIX",
  refactor: "REFACTOR",
  discovery: "RESEARCH",
  research: "RESEARCH",
  issue: "ISSUE",
};
const kind = argValue("--kind") ?? defaultKindByWorkflow[workflow] ?? "feat";
const type = argValue("--type") ?? defaultTypeByWorkflow[workflow] ?? "FEATURE";
const shortTitle = argValue("--short-title");
const title = positionalArgs().join(" ").trim();

if (!title) {
  console.error('Usage: node .specforge/core/scripts/create-work.mjs [--kind feat|bugfix|issue|refactor|research|chore|docs|ops] [--workflow feature|standard|lite|bugfix|issue|refactor|discovery] [--short-title 短标题] "Work item title"');
  console.error("Default workflow is feature. Use --workflow explicitly for bugfix, issue, refactor, discovery, lite, or standard work.");
  process.exit(1);
}

function localDateParts() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return { iso: `${yyyy}-${mm}-${dd}`, compact: `${yyyy}${mm}${dd}` };
}

function slugify(input) {
  const slug = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Script=Han}a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 18);
  return slug || "work";
}

function collectExistingIds(dateCompact) {
  const roots = [`${layout.workItems}/active`, `${layout.workItems}/archive`];
  const ids = [];
  for (const relativeRoot of roots) {
    const dir = join(root, relativeRoot);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const match = entry.name.match(new RegExp(`^${dateCompact}-[a-z]+-(\\d+)`));
      if (match) ids.push(Number(match[1]));
    }
  }
  return ids;
}

function write(relativePath, content) {
  const path = join(root, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function readTemplate(templateName) {
  return readFileSync(join(root, layout.templates, templateName), "utf8");
}

function renderWorkItemYaml({ id, title, type, workflow, date, schema }) {
  let content = readTemplate("work.yaml")
    .replaceAll("YYYYMMDD-kind-NNN-short-title", id)
    .replaceAll("Work Item Title", title)
    .replaceAll("YYYY-MM-DD", date)
    .replace(/^kind:\s*.+$/m, `kind: ${kind}`)
    .replace(/^type:\s*.+$/m, `type: ${type}`)
    .replace(/^workflow:\s*.+$/m, `workflow: ${workflow}`);

  for (const [component, option] of componentOptionMap) {
    const value = argValue(option);
    if (value === undefined) continue;
    content = content.replace(new RegExp(`^(  ${component}:)\\s+.+$`, "m"), `$1 ${value}`);
  }

  const activeSchema = effectiveSchema(schema, content);
  const requiredGates = new Set(schema.artifacts.filter((artifact) => artifact.gate).map((artifact) => artifact.gate));
  const activeRequiredGates = new Set(activeSchema.artifacts.filter((artifact) => artifact.gate).map((artifact) => artifact.gate));
  for (const gate of ["spec_review", "code_review", "verification", "wiki_sync"]) {
    const required = requiredGates.has(gate) && activeRequiredGates.has(gate);
    content = content.replace(
      new RegExp(`(  ${gate}:\\n    required:)\\s+(true|false)\\n    status:\\s+[A-Z_]+\\n    evidence:\\s+.*`, "m"),
      `$1 ${required ? "true" : "false"}\n    status: ${required ? "PENDING" : "SKIPPED"}\n    evidence: null`,
    );
  }

  return content;
}

try {
  const schema = loadSchema(workflow);
  const { iso, compact } = localDateParts();
  const nextNumber = Math.max(0, ...collectExistingIds(compact)) + 1;
  const sequence = String(nextNumber).padStart(3, "0");
  const id = `${compact}-${kind}-${sequence}-${slugify(shortTitle ?? title)}`;
  const base = `${layout.workItems}/active/${id}`;

  if (existsSync(join(root, base))) throw new Error(`Work item already exists: ${base}`);

  const workItemYaml = renderWorkItemYaml({ id, title, type, workflow, date: iso, schema });

  if (dryRun) {
    console.log(`Would create work item ${id}`);
    console.log(base);
    console.log(`Workflow: ${workflow}`);
    console.log("Artifacts: work.yaml + intake only");
    const activeSchema = effectiveSchema(schema, workItemYaml);
    const states = new Map(activeSchema.artifacts.map((artifact) => [artifact.id, artifact.id === "intake" ? "done" : "blocked"]));
    const next = activeSchema.artifacts.find((artifact) => artifact.requires.every((dep) => states.get(dep) === "done") && artifact.id !== "intake");
    if (next) console.log(`Next: node ${layout.tools}/create-artifact.mjs ${next.id}`);
    process.exit(0);
  }

  mkdirSync(join(root, base, "00-intake"), { recursive: true });
  writeText(`${base}/work.yaml`, workItemYaml);
  write(`${base}/00-intake/original-request.md`, `# 原始请求\n\n${title}\n`);
  write(`${base}/00-intake/brief.md`, readTemplate("brief.md"));

  const registryPath = join(root, layout.registry);
  const entry = `  - id: ${id}\n    title: ${title}\n    type: ${type}\n    status: INTAKE\n    path: ${base}\n`;
  let registry = readFileSync(registryPath, "utf8");

  if (registry.match(/^active:\s*\[\]/m)) {
    registry = registry.replace(/^active:\s*\[\]/m, `active:\n${entry.trimEnd()}`);
  } else if (registry.includes("\nblocked:")) {
    registry = registry.replace("\nblocked:", `${entry}\nblocked:`);
  } else {
    registry = `${registry.trimEnd()}\n${entry}`;
  }

  writeFileSync(registryPath, registry, "utf8");

  const activeSchema = effectiveSchema(schema, workItemYaml);
  const states = computeArtifactStates(activeSchema, workItemYaml, base);
  const nextActive = nextReadyArtifact(activeSchema, states);

  console.log(`Created work item ${basename(base)}`);
  console.log(base);
  console.log(`Workflow: ${workflow}`);
  if (nextActive) console.log(`Next: node ${layout.tools}/create-artifact.mjs ${nextActive.id}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
