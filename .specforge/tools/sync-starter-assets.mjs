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

const root = process.cwd();
const sourceRoot = join(root, ".specforge");
const defaultStarterRoot = join(root, "specforge-onboard/assets/starter/.specforge");
const checkOnly = process.argv.includes("--check");

function option(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

const targetRoot = resolve(option("--target", defaultStarterRoot));

function readManifest() {
  const manifestPath = join(sourceRoot, "starter.manifest.json");
  if (!existsSync(manifestPath)) throw new Error(`Missing starter manifest: ${manifestPath}`);
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

function listFiles(base) {
  const files = [];
  if (!existsSync(base)) return files;

  function walk(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
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

function copyEntry(relativePath, destinationRoot) {
  const source = join(sourceRoot, relativePath);
  const target = join(destinationRoot, relativePath);
  if (!existsSync(source)) throw new Error(`Manifest source missing: .specforge/${relativePath}`);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
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
    `# 生成产物\n\n此目录由根目录 \`.specforge/starter.manifest.json\` 生成，不是源码母本。\n\n不要手工修改本目录内容。需要更新 starter 时，修改根 \`.specforge/\` 母本或 \`.specforge/starter.manifest.json\`，然后运行：\n\n\`\`\`bash\nnode .specforge/tools/sync-starter-assets.mjs\nnode .specforge/tools/sync-starter-assets.mjs --check\n\`\`\`\n`,
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
      errors.push(`starter has extra file: .specforge/${file}`);
      continue;
    }
    if (!actualFiles.includes(file)) {
      errors.push(`starter missing file: .specforge/${file}`);
      continue;
    }
    if (statSync(expectedFile).isFile() && normalizedContent(expectedFile) !== normalizedContent(actualFile)) {
      errors.push(`starter drift: .specforge/${file}`);
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
      console.error("Run: node .specforge/tools/sync-starter-assets.mjs");
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
