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
  specforge audit [--dir <path>] [--work-item <id>] [--output <path>] [--json]
  specforge health [--dir <path>] [--work-item <id>] [--json]
  specforge quality [--dir <path>] [--work-item <id>] [--json]
  specforge wiki-quality [--dir <path>] [--json]
  specforge roadmap [--dir <path>] [--work-item <id>] [--json]
  specforge contract [--dir <path>] [--work-item <id>] [--artifact <id>] [--overview] [--json]
  specforge checkpoints [--dir <path>] [--work-item <id>] [--json]
  specforge decision-brief [--dir <path>] [--work-item <id>] [--json]
  specforge evidence [--dir <path>] [--work-item <id>] [--report <path>] [--json]
  specforge package [--dir <path>] [--work-item <id>] [--skip-derived] [--json]
  specforge gate-preflight [--dir <path>] <gate> [status] [--evidence <path>] [--work-item <id>] [--json] [--strict]
  specforge gate [--dir <path>] <gate> <status> [--evidence <path>] [--work-item <id>] [--strict-hooks]
  specforge handoff [--dir <path>] [--work-item <id>] [--output <path>] [--json]
  specforge report [--dir <path>] [--work-item <id>] [--output <path>]
  specforge traceability [--dir <path>] [--work-item <id>] [--json]

Examples:
  npx skills add https://github.com/huangrx6/SpecForge --skill '*' --agent codex --global
  npx github:huangrx6/SpecForge init --dir .
  npm exec --yes --package=git+ssh://git@git.company.com/team/specforge.git#v0.3.0-company.1 -- specforge init --dir .
  npx github:huangrx6/SpecForge doctor --dir .
  npx github:huangrx6/SpecForge audit --dir .
  npx github:huangrx6/SpecForge health --dir .
  npx github:huangrx6/SpecForge quality --dir .
  npx github:huangrx6/SpecForge wiki-quality --dir .
  npx github:huangrx6/SpecForge roadmap --dir .
  npx github:huangrx6/SpecForge contract --dir .
  npx github:huangrx6/SpecForge checkpoints --dir .
  npx github:huangrx6/SpecForge decision-brief --dir .
  npx github:huangrx6/SpecForge evidence --dir .
  npx github:huangrx6/SpecForge package --dir .
  npx github:huangrx6/SpecForge gate-preflight --dir . verification APPROVED --evidence 05-verification/report.md
  npx github:huangrx6/SpecForge gate --dir . verification APPROVED --evidence 05-verification/report.md
  npx github:huangrx6/SpecForge handoff --dir .
  npx github:huangrx6/SpecForge report --dir .
  npx github:huangrx6/SpecForge traceability --dir .
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

function audit() {
  const targetDir = resolve(option("--dir", "."));
  const auditPath = join(targetDir, ".specforge/core/scripts/workflow-audit.mjs");
  if (!existsSync(auditPath)) {
    console.error(`Missing SpecForge workflow audit script: ${auditPath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  const output = option("--output");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (output) extraArgs.push("--output", output);
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(auditPath, extraArgs, targetDir);
}

function health() {
  const targetDir = resolve(option("--dir", "."));
  const healthPath = join(targetDir, ".specforge/core/scripts/workflow-health.mjs");
  if (!existsSync(healthPath)) {
    console.error(`Missing SpecForge workflow health script: ${healthPath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(healthPath, extraArgs, targetDir);
}

function quality() {
  const targetDir = resolve(option("--dir", "."));
  const qualityPath = join(targetDir, ".specforge/core/scripts/artifact-quality.mjs");
  if (!existsSync(qualityPath)) {
    console.error(`Missing SpecForge artifact quality script: ${qualityPath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(qualityPath, extraArgs, targetDir);
}

function wikiQuality() {
  const targetDir = resolve(option("--dir", "."));
  const qualityPath = join(targetDir, ".specforge/core/scripts/wiki-quality.mjs");
  if (!existsSync(qualityPath)) {
    console.error(`Missing SpecForge wiki quality script: ${qualityPath}`);
    process.exit(1);
  }
  const extraArgs = [];
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(qualityPath, extraArgs, targetDir);
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

function contract() {
  const targetDir = resolve(option("--dir", "."));
  const contractPath = join(targetDir, ".specforge/core/scripts/stage-contract.mjs");
  if (!existsSync(contractPath)) {
    console.error(`Missing SpecForge stage contract script: ${contractPath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  const artifact = option("--artifact");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (artifact) extraArgs.push("--artifact", artifact);
  if (args.includes("--overview")) extraArgs.push("--overview");
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(contractPath, extraArgs, targetDir);
}

function roadmap() {
  const targetDir = resolve(option("--dir", "."));
  const contractPath = join(targetDir, ".specforge/core/scripts/stage-contract.mjs");
  if (!existsSync(contractPath)) {
    console.error(`Missing SpecForge stage contract script: ${contractPath}`);
    process.exit(1);
  }
  const extraArgs = ["--overview"];
  const workItem = option("--work-item");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(contractPath, extraArgs, targetDir);
}

function decisionBrief() {
  const targetDir = resolve(option("--dir", "."));
  const briefPath = join(targetDir, ".specforge/core/scripts/decision-brief.mjs");
  if (!existsSync(briefPath)) {
    console.error(`Missing SpecForge decision brief script: ${briefPath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(briefPath, extraArgs, targetDir);
}

function evidence() {
  const targetDir = resolve(option("--dir", "."));
  const evidencePath = join(targetDir, ".specforge/core/scripts/evidence-summary.mjs");
  if (!existsSync(evidencePath)) {
    console.error(`Missing SpecForge evidence summary script: ${evidencePath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  const report = option("--report");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (report) extraArgs.push("--report", report);
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(evidencePath, extraArgs, targetDir);
}

function reviewPackage() {
  const targetDir = resolve(option("--dir", "."));
  const packagePath = join(targetDir, ".specforge/core/scripts/workflow-package.mjs");
  if (!existsSync(packagePath)) {
    console.error(`Missing SpecForge workflow package script: ${packagePath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (args.includes("--skip-derived")) extraArgs.push("--skip-derived");
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(packagePath, extraArgs, targetDir);
}

function gatePreflight() {
  const targetDir = resolve(option("--dir", "."));
  const preflightPath = join(targetDir, ".specforge/core/scripts/gate-preflight.mjs");
  if (!existsSync(preflightPath)) {
    console.error(`Missing SpecForge gate preflight script: ${preflightPath}`);
    process.exit(1);
  }
  const positional = [];
  const extraArgs = [];
  const optionsWithValues = new Set(["--work-item", "--evidence"]);
  for (let i = 1; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--dir") {
      i += 1;
      continue;
    }
    if (optionsWithValues.has(arg)) {
      extraArgs.push(arg, args[i + 1]);
      i += 1;
      continue;
    }
    if (arg.startsWith("--")) {
      extraArgs.push(arg);
      continue;
    }
    positional.push(arg);
  }
  runNode(preflightPath, [...positional, ...extraArgs], targetDir);
}

function gate() {
  const targetDir = resolve(option("--dir", "."));
  const gatePath = join(targetDir, ".specforge/core/scripts/gate.mjs");
  if (!existsSync(gatePath)) {
    console.error(`Missing SpecForge gate script: ${gatePath}`);
    process.exit(1);
  }
  const positional = [];
  const extraArgs = [];
  const optionsWithValues = new Set(["--work-item", "--evidence"]);
  for (let i = 1; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--dir") {
      i += 1;
      continue;
    }
    if (optionsWithValues.has(arg)) {
      extraArgs.push(arg, args[i + 1]);
      i += 1;
      continue;
    }
    if (arg.startsWith("--")) {
      extraArgs.push(arg);
      continue;
    }
    positional.push(arg);
  }
  runNode(gatePath, [...positional, ...extraArgs], targetDir);
}

function handoff() {
  const targetDir = resolve(option("--dir", "."));
  const handoffPath = join(targetDir, ".specforge/core/scripts/handoff-summary.mjs");
  if (!existsSync(handoffPath)) {
    console.error(`Missing SpecForge handoff script: ${handoffPath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  const output = option("--output");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (output) extraArgs.push("--output", output);
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(handoffPath, extraArgs, targetDir);
}

function traceability() {
  const targetDir = resolve(option("--dir", "."));
  const traceabilityPath = join(targetDir, ".specforge/core/scripts/traceability-summary.mjs");
  if (!existsSync(traceabilityPath)) {
    console.error(`Missing SpecForge traceability script: ${traceabilityPath}`);
    process.exit(1);
  }
  const extraArgs = [];
  const workItem = option("--work-item");
  if (workItem) extraArgs.push("--work-item", workItem);
  if (args.includes("--json")) extraArgs.push("--json");
  runNode(traceabilityPath, extraArgs, targetDir);
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
} else if (command === "audit") {
  audit();
} else if (command === "health") {
  health();
} else if (command === "quality") {
  quality();
} else if (command === "wiki-quality") {
  wikiQuality();
} else if (command === "roadmap") {
  roadmap();
} else if (command === "contract") {
  contract();
} else if (command === "checkpoints") {
  checkpoints();
} else if (command === "decision-brief") {
  decisionBrief();
} else if (command === "evidence") {
  evidence();
} else if (command === "package") {
  reviewPackage();
} else if (command === "gate-preflight") {
  gatePreflight();
} else if (command === "gate") {
  gate();
} else if (command === "handoff") {
  handoff();
} else if (command === "report") {
  report();
} else if (command === "traceability") {
  traceability();
} else {
  usage();
  process.exit(1);
}
