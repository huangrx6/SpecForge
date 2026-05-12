#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);

function usage() {
  console.log(`SpecForge CLI

Usage:
  specforge skill add [--target codex|claude-code|cc-switch|all] [--apply]
  specforge init [--dir <path>] [--force]
  specforge doctor [--dir <path>]

Examples:
  npx @huangrx6/specforge skill add --target codex --apply
  npx @huangrx6/specforge skill add --target all --apply
  npx @huangrx6/specforge init --dir .
  npx @huangrx6/specforge doctor --dir .
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
  const source = join(packageRoot, "specforge-onboard/assets/starter/.specforge");
  const target = join(targetDir, ".specforge");

  if (!existsSync(source)) {
    console.error(`Missing starter assets: ${source}`);
    process.exit(1);
  }

  if (existsSync(target) && !force) {
    console.error(`.specforge already exists: ${target}`);
    console.error("Use --force to replace it, or run specforge-onboard inside your AI tool for migration-aware onboarding.");
    process.exit(1);
  }

  mkdirSync(targetDir, { recursive: true });
  if (force) rmSync(target, { recursive: true, force: true });
  cpSync(source, target, { recursive: true });
  console.log(`Initialized SpecForge at ${target}`);

  const doctor = join(target, "tools/doctor.mjs");
  const result = spawnSync(process.execPath, [doctor], {
    cwd: targetDir,
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

function doctor() {
  const targetDir = resolve(option("--dir", "."));
  const doctorPath = join(targetDir, ".specforge/tools/doctor.mjs");
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
  const tool = join(packageRoot, ".specforge/tools/install-agent-skills.mjs");
  runNode(tool, args.slice(2), packageRoot);
} else if (command === "init") {
  initProject();
} else if (command === "doctor") {
  doctor();
} else {
  usage();
  process.exit(1);
}
