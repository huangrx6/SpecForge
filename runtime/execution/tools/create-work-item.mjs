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
    "--type",
    "--has-ui",
    "--has-api",
    "--has-db",
    "--has-domain",
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
  ["has_nfr", "--has-nfr"],
  ["has_security", "--has-security"],
  ["has_integration", "--has-integration"],
  ["has_infra", "--has-infra"],
  ["has_background_job", "--has-background-job"],
  ["needs_research", "--needs-research"],
]);

const workflow = argValue("--workflow") ?? "standard";
const defaultTypeByWorkflow = {
  feature: "FEATURE",
  standard: "FEATURE",
  lite: "FEATURE",
  bugfix: "BUGFIX",
  refactor: "REFACTOR",
  discovery: "RESEARCH",
};
const type = argValue("--type") ?? defaultTypeByWorkflow[workflow] ?? "FEATURE";
const title = positionalArgs().join(" ").trim();

if (!title) {
  console.error('Usage: node .specforge/execution/tools/create-work-item.mjs [--workflow feature|standard|lite|bugfix|refactor|discovery] [--type TYPE] [--has-ui true|false|auto] [--has-api true|false|auto] "Work item title"');
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
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "work-item";
}

function collectExistingIds(dateCompact) {
  const roots = [`${layout.workItems}/active`, `${layout.workItems}/archive`];
  const ids = [];
  for (const relativeRoot of roots) {
    const dir = join(root, relativeRoot);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const match = entry.name.match(new RegExp(`^WI-${dateCompact}-(\\d+)`));
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
  let content = readTemplate("work-item.yaml")
    .replaceAll("WI-YYYYMMDD-NNN-slug", id)
    .replaceAll("Work Item Title", title)
    .replaceAll("YYYY-MM-DD", date)
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
  for (const gate of ["spec_review", "code_review", "verification", "ssot_sync"]) {
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
  const id = `WI-${compact}-${sequence}-${slugify(title)}`;
  const base = `${layout.workItems}/active/${id}`;

  if (existsSync(join(root, base))) throw new Error(`Work item already exists: ${base}`);

  const workItemYaml = renderWorkItemYaml({ id, title, type, workflow, date: iso, schema });

  if (dryRun) {
    console.log(`Would create work item ${id}`);
    console.log(base);
    console.log(`Workflow: ${workflow}`);
    console.log("Artifacts: work-item.yaml + intake only");
    const activeSchema = effectiveSchema(schema, workItemYaml);
    const states = new Map(activeSchema.artifacts.map((artifact) => [artifact.id, artifact.id === "intake" ? "done" : "blocked"]));
    const next = activeSchema.artifacts.find((artifact) => artifact.requires.every((dep) => states.get(dep) === "done") && artifact.id !== "intake");
    if (next) console.log(`Next: node ${layout.tools}/create-artifact.mjs ${next.id}`);
    process.exit(0);
  }

  mkdirSync(join(root, base, "00-intake"), { recursive: true });
  writeText(`${base}/work-item.yaml`, workItemYaml);
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
