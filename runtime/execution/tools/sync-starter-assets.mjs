import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { layout } from "./lib/specforge.mjs";

const root = process.cwd();
const sourceRoot = join(root, layout.runtime);
const defaultStarterRoot = join(root, layout.kind === "source" ? "starter/.specforge" : ".specforge");
const checkOnly = process.argv.includes("--check");

function option(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

const targetRoot = resolve(option("--target", defaultStarterRoot));
const ignoredNames = new Set([".DS_Store"]);

function shouldInclude(path) {
  return !path.split(/[\\/]/).some((part) => ignoredNames.has(part));
}

function readManifest() {
  const manifestPath = join(root, layout.starterManifest);
  if (!existsSync(manifestPath)) throw new Error(`Missing starter manifest: ${manifestPath}`);
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

function listFiles(base) {
  const files = [];
  if (!existsSync(base)) return files;

  function walk(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (ignoredNames.has(entry.name)) continue;
      const path = join(current, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile()) files.push(path);
    }
  }

  walk(base);
  return files.sort();
}

function normalizedContent(path) {
  return readFileSync(path, "utf8").replace(/\r\n/g, "\n");
}

function write(relativePath, content, destinationRoot) {
  const target = join(destinationRoot, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf8");
}

function copyEntry(entry, destinationRoot) {
  const from = typeof entry === "string" ? entry : entry.from;
  const to = typeof entry === "string" ? entry : entry.to;
  const source = join(sourceRoot, from);
  const target = join(destinationRoot, to);
  if (!existsSync(source)) throw new Error(`Manifest source missing: ${layout.runtime}/${from}`);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true, filter: shouldInclude });
}

function materialize(destinationRoot) {
  const manifest = readManifest();
  rmSync(destinationRoot, { recursive: true, force: true });
  mkdirSync(destinationRoot, { recursive: true });

  for (const entry of manifest.copy ?? []) copyEntry(entry, destinationRoot);
  for (const directory of manifest.directories ?? []) mkdirSync(join(destinationRoot, directory), { recursive: true });
  for (const [file, content] of Object.entries(manifest.files ?? {})) write(file, content, destinationRoot);
  write(
    "GENERATED.md",
    `# 生成产物\n\n此目录由 \`${layout.starterManifest}\` 生成，不是源码母本。\n\n不要手工修改本目录内容。需要更新 starter 时，修改 \`runtime/\` 母本或 \`${layout.starterManifest}\`，然后运行：\n\n\`\`\`bash\nnode ${layout.tools}/sync-starter-assets.mjs\nnode ${layout.tools}/sync-starter-assets.mjs --check\n\`\`\`\n`,
    destinationRoot,
  );
}

function compareTrees(expectedRoot, actualRoot) {
  const errors = [];

  if (!existsSync(actualRoot)) return [`starter missing: ${actualRoot}`];

  const expectedFiles = listFiles(expectedRoot).map((file) => relative(expectedRoot, file).replaceAll("\\", "/"));
  const actualFiles = listFiles(actualRoot).map((file) => relative(actualRoot, file).replaceAll("\\", "/"));
  const all = new Set([...expectedFiles, ...actualFiles]);

  for (const file of [...all].sort()) {
    const expectedFile = join(expectedRoot, file);
    const actualFile = join(actualRoot, file);

    if (!expectedFiles.includes(file)) {
      errors.push(`starter has extra file: ${file}`);
      continue;
    }
    if (!actualFiles.includes(file)) {
      errors.push(`starter missing file: ${file}`);
      continue;
    }
    if (statSync(expectedFile).isFile() && normalizedContent(expectedFile) !== normalizedContent(actualFile)) {
      errors.push(`starter drift: ${file}`);
    }
  }

  return errors;
}

function check() {
  const tempRoot = mkdtempSync(join(tmpdir(), "specforge-starter-"));
  const expectedRoot = join(tempRoot, ".specforge");
  try {
    materialize(expectedRoot);
    const errors = compareTrees(expectedRoot, targetRoot);
    if (errors.length > 0) {
      console.error("SpecForge starter assets are out of sync with starter.manifest.json.");
      for (const error of errors) console.error(`- ${error}`);
      console.error(`Run: node ${layout.tools}/sync-starter-assets.mjs`);
      process.exit(1);
    }
    console.log("SpecForge starter assets match starter.manifest.json.");
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

try {
  if (checkOnly) check();
  else {
    materialize(targetRoot);
    console.log(`Materialized SpecForge starter assets at ${targetRoot}.`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
