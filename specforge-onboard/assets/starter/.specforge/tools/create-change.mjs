import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const title = args.filter((arg) => arg !== "--dry-run").join(" ").trim();

if (!title) {
  console.error('Usage: node .specforge/tools/create-change.mjs "Change title"');
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
  return slug || "change";
}

function collectExistingIds(dateCompact) {
  const roots = [".specforge/changes/active", ".specforge/changes/archive"];
  const ids = [];
  for (const relativeRoot of roots) {
    const dir = join(root, relativeRoot);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const match = entry.name.match(new RegExp(`^CHG-${dateCompact}-(\\d+)`));
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

function copyTemplate(templateName, destination, replacements = {}) {
  let content = readFileSync(join(root, ".specforge/templates", templateName), "utf8");
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(key, value);
  }
  write(destination, content);
}

const { iso, compact } = localDateParts();
const nextNumber = Math.max(0, ...collectExistingIds(compact)) + 1;
const sequence = String(nextNumber).padStart(3, "0");
const id = `CHG-${compact}-${sequence}-${slugify(title)}`;
const base = `.specforge/changes/active/${id}`;

if (existsSync(join(root, base))) {
  console.error(`Change already exists: ${base}`);
  process.exit(1);
}

if (dryRun) {
  console.log(`Would create ${id}`);
  console.log(base);
  console.log("Artifacts: change.yaml + intake only");
  process.exit(0);
}

mkdirSync(join(root, base, "00-intake"), { recursive: true });

copyTemplate("change.yaml", `${base}/change.yaml`, {
  "CHG-YYYYMMDD-NNN-slug": id,
  "Change Title": title,
  "YYYY-MM-DD": iso,
});

write(`${base}/00-intake/original-request.md`, `# 原始请求\n\n${title}\n`);
copyTemplate("brief.md", `${base}/00-intake/brief.md`);

const registryPath = join(root, ".specforge/registry.yaml");
const entry = `  - id: ${id}\n    title: ${title}\n    type: FEATURE\n    status: INTAKE\n    path: ${base}\n`;
let registry = readFileSync(registryPath, "utf8");

if (registry.match(/^active:\s*\[\]/m)) {
  registry = registry.replace(/^active:\s*\[\]/m, `active:\n${entry.trimEnd()}`);
} else if (registry.includes("\nblocked:")) {
  registry = registry.replace("\nblocked:", `${entry}\nblocked:`);
} else {
  registry = `${registry.trimEnd()}\n${entry}`;
}

writeFileSync(registryPath, registry, "utf8");

console.log(`Created ${basename(base)}`);
console.log(base);
console.log("Next: node .specforge/tools/create-artifact.mjs requirements");
