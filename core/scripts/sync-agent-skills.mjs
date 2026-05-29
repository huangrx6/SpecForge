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
import { join, relative } from "node:path";

const root = process.cwd();
const sourceRoot = join(root, "agent-skills");
const targetRoot = join(root, "skills");
const checkOnly = process.argv.includes("--check");
const ignoredNames = new Set([".DS_Store"]);

function shouldInclude(path) {
  return !path.split(/[\\/]/).some((part) => ignoredNames.has(part));
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

function writeNotice(destinationRoot) {
  writeFileSync(
    join(destinationRoot, "README.md"),
    [
      "# SpecForge Agent Skills",
      "",
      "This directory is generated from `agent-skills/` so the official `skills` CLI can discover SpecForge entry skills from the standard `skills/<name>/SKILL.md` layout.",
      "",
      "Do not edit files here directly. Update `agent-skills/`, then run:",
      "",
      "```bash",
      "npm run sync:agent-skills",
      "npm run check:agent-skills",
      "```",
      "",
    ].join("\n"),
    "utf8",
  );
}

function materialize(destinationRoot) {
  if (!existsSync(sourceRoot)) throw new Error(`Missing agent skills source: ${sourceRoot}`);

  rmSync(destinationRoot, { recursive: true, force: true });
  mkdirSync(destinationRoot, { recursive: true });

  for (const entry of readdirSync(sourceRoot, { withFileTypes: true }).filter((item) => item.isDirectory())) {
    const source = join(sourceRoot, entry.name);
    const target = join(destinationRoot, entry.name);
    cpSync(source, target, { recursive: true, filter: shouldInclude });
  }

  writeNotice(destinationRoot);
}

function compareTrees(expectedRoot, actualRoot) {
  const errors = [];
  if (!existsSync(actualRoot)) return [`skills publishing view missing: ${actualRoot}`];

  const expectedFiles = listFiles(expectedRoot).map((file) => relative(expectedRoot, file).replaceAll("\\", "/"));
  const actualFiles = listFiles(actualRoot).map((file) => relative(actualRoot, file).replaceAll("\\", "/"));
  const all = new Set([...expectedFiles, ...actualFiles]);

  for (const file of [...all].sort()) {
    const expectedFile = join(expectedRoot, file);
    const actualFile = join(actualRoot, file);

    if (!expectedFiles.includes(file)) {
      errors.push(`skills publishing view has extra file: ${file}`);
      continue;
    }
    if (!actualFiles.includes(file)) {
      errors.push(`skills publishing view missing file: ${file}`);
      continue;
    }
    if (statSync(expectedFile).isFile() && normalizedContent(expectedFile) !== normalizedContent(actualFile)) {
      errors.push(`skills publishing view drift: ${file}`);
    }
  }

  return errors;
}

function check() {
  const tempRoot = mkdtempSync(join(tmpdir(), "specforge-agent-skills-"));
  const expectedRoot = join(tempRoot, "skills");
  try {
    materialize(expectedRoot);
    const errors = compareTrees(expectedRoot, targetRoot);
    if (errors.length > 0) {
      console.error("SpecForge agent skills publishing view is out of sync with agent-skills/.");
      for (const error of errors) console.error(`- ${error}`);
      console.error("Run: npm run sync:agent-skills");
      process.exit(1);
    }
    console.log("SpecForge agent skills publishing view matches agent-skills/.");
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

try {
  if (checkOnly) check();
  else {
    materialize(targetRoot);
    console.log(`Materialized SpecForge agent skills publishing view at ${targetRoot}.`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
