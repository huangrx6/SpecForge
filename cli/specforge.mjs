#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);

function usage() {
  console.log(`SpecForge CLI

Usage:
  specforge skill add [--target codex|claude-code|cc-switch|agents|all] [--apply] [--prune-legacy]
  specforge init [--dir <path>] [--force]
  specforge doctor [--dir <path>]

Examples:
  node cli/specforge.mjs skill add --target codex --apply
  node cli/specforge.mjs skill add --target all --apply --prune-legacy
  node cli/specforge.mjs init --dir .
  node cli/specforge.mjs doctor --dir .
`);
}

function option(name, fallback = null) {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
}

function runNode(script, extraArgs, cwd = packageRoot) {
  const result = spawnSync(process.execPath, [script, ...extraArgs], {
    cwd,
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

function initProject() {
  const targetDir = resolve(option("--dir", "."));
  const force = args.includes("--force");
  const target = join(targetDir, ".specforge");
  const materializer = join(packageRoot, "runtime/execution/tools/sync-starter-assets.mjs");

  if (!existsSync(materializer)) {
    console.error(`Missing starter materializer: ${materializer}`);
    process.exit(1);
  }

  if (existsSync(target) && !force) {
    console.error(`.specforge already exists: ${target}`);
    console.error("Use --force to replace it, or run sf-onboard inside your AI tool for migration-aware onboarding.");
    process.exit(1);
  }

  mkdirSync(targetDir, { recursive: true });
  if (force) rmSync(target, { recursive: true, force: true });
  const materialize = spawnSync(process.execPath, [materializer, "--target", target], {
    cwd: packageRoot,
    stdio: "inherit",
  });
  if (materialize.status !== 0) process.exit(materialize.status ?? 1);
  console.log(`Initialized SpecForge at ${target}`);

  const doctor = join(target, "execution/tools/doctor.mjs");
  const result = spawnSync(process.execPath, [doctor], {
    cwd: targetDir,
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

function doctor() {
  const targetDir = resolve(option("--dir", "."));
  const doctorPath = join(targetDir, ".specforge/execution/tools/doctor.mjs");
  if (!existsSync(doctorPath)) {
    console.error(`Missing SpecForge doctor: ${doctorPath}`);
    process.exit(1);
  }
  runNode(doctorPath, [], targetDir);
}

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}

const [command, subcommand] = args;

if (command === "skill" && subcommand === "add") {
  const tool = join(packageRoot, "runtime/execution/tools/install-agent-skills.mjs");
  runNode(tool, args.slice(2), packageRoot);
} else if (command === "init") {
  initProject();
} else if (command === "doctor") {
  doctor();
} else {
  usage();
  process.exit(1);
}
