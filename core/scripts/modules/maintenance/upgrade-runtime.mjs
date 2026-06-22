#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { layout } from "../../lib/specforge.mjs";

const root = process.cwd();
const sourceRoot = join(root, layout.runtime);
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || args.includes("--check");
const json = args.includes("--json");
const skipDoctor = args.includes("--skip-doctor") || args.includes("--no-doctor");
const protectedPaths = [
  "AGENTS.md",
  "project.yaml",
  "registry.yaml",
  "wiki",
  "work",
  "hooks/local",
];
const ignoredNames = new Set([".DS_Store"]);
const changes = [];

function option(name, fallback = null) {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
}

function usage() {
  return [
    "Usage:",
    "  node core/scripts/upgrade-runtime.mjs --target <project/.specforge> [--dry-run] [--skip-doctor] [--json]",
    "  node core/scripts/upgrade-runtime.mjs --dir <project-root> [--dry-run] [--skip-doctor] [--json]",
  ].join("\n");
}

function targetRoot() {
  const target = option("--target");
  if (target) return resolve(target);
  const dir = option("--dir");
  if (dir) return resolve(dir, ".specforge");
  return resolve(root, layout.workspace);
}

function shouldInclude(path) {
  return !path.split(/[\\/]/).some((part) => ignoredNames.has(part));
}

function normalize(path) {
  return path.replaceAll("\\", "/").replace(/^\/+/, "");
}

function protectedPath(path) {
  const normalized = normalize(path);
  return protectedPaths.some((item) => normalized === item || normalized.startsWith(`${item}/`));
}

function readManifest() {
  const manifestPath = join(root, layout.starterManifest);
  if (!existsSync(manifestPath)) throw new Error(`Missing starter manifest: ${manifestPath}`);
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

function sameText(source, target) {
  if (!existsSync(source) || !existsSync(target)) return false;
  return readFileSync(source, "utf8").replace(/\r\n/g, "\n") === readFileSync(target, "utf8").replace(/\r\n/g, "\n");
}

function record(action, path) {
  changes.push({ action, path: normalize(path) });
}

function writeFile(relativePath, content, destinationRoot, protectedMode = false) {
  const target = join(destinationRoot, relativePath);
  const exists = existsSync(target);
  if (protectedMode && exists) {
    record("preserve", relativePath);
    return;
  }
  if (exists && readFileSync(target, "utf8").replace(/\r\n/g, "\n") === content.replace(/\r\n/g, "\n")) {
    record("unchanged", relativePath);
    return;
  }
  record(exists ? "update" : "create", relativePath);
  if (dryRun) return;
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf8");
}

function copyFile(source, target, relativePath) {
  const exists = existsSync(target);
  if (exists && sameText(source, target)) {
    record("unchanged", relativePath);
    return;
  }
  record(exists ? "update" : "create", relativePath);
  if (dryRun) return;
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { filter: shouldInclude });
}

function copyDirectory(source, target, relativePath) {
  const exists = existsSync(target);
  record(exists ? "replace-dir" : "create-dir", relativePath);
  if (dryRun) return;
  rmSync(target, { recursive: true, force: true });
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true, filter: shouldInclude });
}

function copyEntry(entry, destinationRoot) {
  const from = typeof entry === "string" ? entry : entry.from;
  const to = typeof entry === "string" ? entry : entry.to;
  const source = join(sourceRoot, from);
  const target = join(destinationRoot, to);
  if (!existsSync(source)) throw new Error(`Manifest source missing: ${layout.runtime}/${from}`);

  if (protectedPath(to)) {
    if (existsSync(target)) {
      record("preserve", to);
      return;
    }
    record("create-protected", to);
    if (dryRun) return;
    mkdirSync(dirname(target), { recursive: true });
    cpSync(source, target, { recursive: true, filter: shouldInclude });
    return;
  }

  const stat = statSync(source);
  if (stat.isDirectory()) copyDirectory(source, target, to);
  else copyFile(source, target, to);
}

function ensureDirectory(relativePath, destinationRoot) {
  const target = join(destinationRoot, relativePath);
  if (existsSync(target)) {
    record("preserve-dir", relativePath);
    return;
  }
  record(protectedPath(relativePath) ? "create-protected-dir" : "create-dir", relativePath);
  if (!dryRun) mkdirSync(target, { recursive: true });
}

function upgrade(destinationRoot) {
  if (!existsSync(destinationRoot)) {
    throw new Error(`Missing .specforge directory: ${destinationRoot}\nRun init first, or run sf-onboard for migration-aware onboarding.`);
  }

  const manifest = readManifest();
  for (const entry of manifest.copy ?? []) copyEntry(entry, destinationRoot);
  for (const directory of manifest.directories ?? []) ensureDirectory(directory, destinationRoot);
  for (const [file, content] of Object.entries(manifest.files ?? {})) {
    writeFile(file, content, destinationRoot, protectedPath(file));
  }

  writeFile(
    "GENERATED.md",
    "# 生成产物\n\n此目录由 SpecForge CLI 根据源码仓库的 `core/starter.manifest.json` 升级或初始化。\n\n业务项目中不要手工修改 `.specforge/core/` 和 `.specforge/skills/`。需要升级 SpecForge 运行时，请执行：\n\n```bash\nspecforge upgrade --dir .\n```\n\n升级会保留 `.specforge/wiki/`、`.specforge/work/`、`.specforge/registry.yaml`、`.specforge/project.yaml`、`.specforge/hooks/local/` 和已有 `.specforge/AGENTS.md`。\n",
    destinationRoot,
  );
}

function doctor(destinationRoot) {
  const projectRoot = dirname(destinationRoot);
  const doctorPath = join(destinationRoot, "core/scripts/doctor.mjs");
  if (!existsSync(doctorPath)) return { skipped: true, reason: `missing doctor: ${doctorPath}` };
  const result = spawnSync(process.execPath, [doctorPath], {
    cwd: projectRoot,
    encoding: "utf8",
  });
  return {
    skipped: false,
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function summarize(destinationRoot, doctorResult = null) {
  const counts = changes.reduce((acc, item) => {
    acc[item.action] = (acc[item.action] ?? 0) + 1;
    return acc;
  }, {});
  return {
    target: destinationRoot,
    dry_run: dryRun,
    counts,
    changes,
    protected_paths: protectedPaths,
    doctor: doctorResult,
  };
}

function printHuman(summary) {
  console.log(dryRun ? "SpecForge runtime upgrade dry-run" : "SpecForge runtime upgraded");
  console.log(`Target: ${summary.target}`);
  console.log(`Protected: ${protectedPaths.join(", ")}`);
  const ordered = Object.entries(summary.counts).sort(([a], [b]) => a.localeCompare(b));
  console.log(`Changes: ${ordered.map(([key, value]) => `${key}=${value}`).join(", ") || "none"}`);
  for (const item of summary.changes.filter((entry) => entry.action !== "unchanged").slice(0, 40)) {
    console.log(`- ${item.action}: ${item.path}`);
  }
  if (summary.changes.length > 40) console.log(`- ... ${summary.changes.length - 40} more entries`);
  if (summary.doctor && !summary.doctor.skipped) {
    process.stdout.write(summary.doctor.stdout);
    process.stderr.write(summary.doctor.stderr);
  } else if (summary.doctor?.skipped) {
    console.log(`Doctor skipped: ${summary.doctor.reason}`);
  }
}

try {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    process.exit(0);
  }

  const destinationRoot = targetRoot();
  upgrade(destinationRoot);
  const doctorResult = dryRun || skipDoctor ? null : doctor(destinationRoot);
  const summary = summarize(destinationRoot, doctorResult);
  if (json) console.log(JSON.stringify(summary, null, 2));
  else printHuman(summary);
  if (doctorResult && !doctorResult.skipped && doctorResult.status !== 0) process.exit(doctorResult.status);
} catch (error) {
  if (json) console.log(JSON.stringify({ error: error.message }, null, 2));
  else console.error(error.message);
  process.exit(1);
}
