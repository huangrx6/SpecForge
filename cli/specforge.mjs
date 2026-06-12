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
  specforge init [--dir <path>] [--force]
  specforge doctor [--dir <path>]
  specforge checkpoints [--dir <path>] [--work-item <id>] [--json]
  specforge report [--dir <path>] [--work-item <id>] [--output <path>]

Examples:
  npx skills add https://github.com/huangrx6/SpecForge --skill '*' --agent codex --global
  npx github:huangrx6/SpecForge init --dir .
  npm exec --yes --package=git+ssh://git@git.company.com/team/specforge.git#v0.3.0-company.1 -- specforge init --dir .
  npx github:huangrx6/SpecForge doctor --dir .
  npx github:huangrx6/SpecForge checkpoints --dir .
  npx github:huangrx6/SpecForge report --dir .
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
  const materializer = join(packageRoot, "core/scripts/sync-starter.mjs");

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

  const doctor = join(target, "core/scripts/doctor.mjs");
  const result = spawnSync(process.execPath, [doctor], {
    cwd: targetDir,
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

function doctor() {
  const targetDir = resolve(option("--dir", "."));
  const doctorPath = join(targetDir, ".specforge/core/scripts/doctor.mjs");
  if (!existsSync(doctorPath)) {
    console.error(`Missing SpecForge doctor: ${doctorPath}`);
    process.exit(1);
  }
  runNode(doctorPath, [], targetDir);
}

function report() {
  const targetDir = resolve(option("--dir", "."));
  const reportPath = join(targetDir, ".specforge/core/scripts/render-work-report.mjs");
  if (!existsSync(reportPath)) {
    console.error(`Missing SpecForge report renderer: ${reportPath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  const output = option("--output");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (output) extraArgs.push("--output", output);
  if (args.includes("--stdout")) extraArgs.push("--stdout");
  runNode(reportPath, extraArgs, targetDir);
}

function checkpoints() {
  const targetDir = resolve(option("--dir", "."));
  const checkpointsPath = join(targetDir, ".specforge/core/scripts/decision-checkpoints.mjs");
  if (!existsSync(checkpointsPath)) {
    console.error(`Missing SpecForge decision checkpoint script: ${checkpointsPath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(checkpointsPath, extraArgs, targetDir);
}

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}

const [command] = args;

if (command === "init") {
  initProject();
} else if (command === "doctor") {
  doctor();
} else if (command === "checkpoints") {
  checkpoints();
} else if (command === "report") {
  report();
} else {
  usage();
  process.exit(1);
}
