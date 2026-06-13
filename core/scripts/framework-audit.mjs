#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const asJson = args.includes("--json");

function normalize(path) {
  return path.replaceAll("\\", "/");
}

function exists(path) {
  return existsSync(join(root, path));
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function walk(directory, out = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    const rel = normalize(relative(root, absolute));
    if ([".git", "node_modules", "starter/.specforge"].some((item) => rel === item || rel.startsWith(`${item}/`))) continue;
    if (entry.isDirectory()) walk(absolute, out);
    if (entry.isFile()) out.push(rel);
  }
  return out;
}

function issue(severity, code, message, path = null) {
  return { severity, code, message, path };
}

function missingCoreReferences(files) {
  const issues = [];
  const re = /\.specforge\/core\/[A-Za-z0-9_./-]+/g;
  for (const file of files.filter((item) => /\.(md|mjs|json|yaml)$/.test(item))) {
    for (const match of read(file).matchAll(re)) {
      const raw = match[0].replace(/[),.;:`'"]+$/, "");
      const target = raw.replace(".specforge/core", "core");
      if (!exists(target)) issues.push(issue("FAIL", "missing-core-reference", `${raw} does not resolve to ${target}.`, file));
    }
  }
  return issues;
}

function missingProfileReferences(files) {
  const issues = [];
  const re = /\.specforge\/core\/profiles\/[A-Za-z0-9_./-]+\.md/g;
  for (const file of files.filter((item) => /\.(md|mjs)$/.test(item))) {
    for (const match of read(file).matchAll(re)) {
      const raw = match[0];
      const target = raw.replace(".specforge/core", "core");
      if (!exists(target)) issues.push(issue("FAIL", "missing-profile-reference", `${raw} does not resolve to ${target}.`, file));
    }
  }
  return issues;
}

function standardsIndexIssues() {
  const issues = [];
  const standards = readdirSync(join(root, "core/standards")).filter((name) => name.endsWith(".md") && !["README.md", "index.md"].includes(name));
  const index = read("core/standards/index.md");
  for (const name of standards) {
    if (!index.includes(`\`${name}\``)) {
      issues.push(issue("WARN", "standard-not-indexed", `${name} is not referenced with a code span in core/standards/index.md.`, "core/standards/index.md"));
    }
  }
  return issues;
}

function designSystemIssues() {
  const required = [
    "core/skills/ui-ux/design-system/SKILL.md",
    "core/skills/ui-ux/design-system/foundations/colors.md",
    "core/skills/ui-ux/design-system/foundations/typography.md",
    "core/skills/ui-ux/design-system/foundations/spacing.md",
    "core/skills/ui-ux/design-system/foundations/motion.md",
    "core/skills/ui-ux/design-system/foundations/accessibility.md",
    "core/skills/ui-ux/design-system/components/button.md",
    "core/skills/ui-ux/design-system/components/card.md",
    "core/skills/ui-ux/design-system/components/form.md",
    "core/skills/ui-ux/design-system/components/table.md",
    "core/skills/ui-ux/design-system/pages/dashboard.md",
    "core/skills/ui-ux/design-system/prompts/ui-generation.md",
    "core/skills/ui-ux/design-system/prompts/anti-cheapness-review.md",
    "core/skills/ui-ux/design-system/references/good-case.md",
    "core/skills/ui-ux/design-system/references/bad-case.md",
    "core/skills/ui-ux/design-system/changelog.md",
  ];
  return required
    .filter((path) => !exists(path))
    .map((path) => issue("FAIL", "missing-design-system-file", `${path} is required by the design-system contract.`, path));
}

function starterManifestIssues() {
  const issues = [];
  const manifest = JSON.parse(read("core/starter.manifest.json"));
  const targetSet = new Set((manifest.copy ?? []).map((entry) => entry.to));
  for (const entry of manifest.copy ?? []) {
    const source = `core/${entry.from}`;
    if (!exists(source)) issues.push(issue("FAIL", "starter-source-missing", `starter manifest source is missing: ${source}.`, "core/starter.manifest.json"));
  }
  for (const target of ["core/standards/operating-model.md", "core/scripts/framework-audit.mjs", "core/scripts/modules/README.md", "core/skills/ui-ux/design-system/SKILL.md"]) {
    if (![...targetSet].some((item) => item === target || target.startsWith(`${item}/`))) {
      issues.push(issue("FAIL", "starter-target-not-covered", `${target} is not covered by core/starter.manifest.json.`, "core/starter.manifest.json"));
    }
  }
  return issues;
}

function scriptModuleIssues() {
  const required = [
    "core/scripts/modules/README.md",
    "core/scripts/modules/routing/README.md",
    "core/scripts/modules/authoring/README.md",
    "core/scripts/modules/quality/README.md",
    "core/scripts/modules/gates/README.md",
    "core/scripts/modules/reporting/README.md",
    "core/scripts/modules/code-intelligence/README.md",
    "core/scripts/modules/maintenance/README.md",
    "core/scripts/modules/archive/README.md",
  ];
  return required
    .filter((path) => !exists(path))
    .map((path) => issue("FAIL", "missing-script-module", `${path} is required by the script module map.`, path));
}

function placeholderIssues(files) {
  const issues = [];
  const targets = files.filter((item) => item.startsWith("core/standards/") || item.startsWith("skills/") || item.startsWith("core/workflows/stages/"));
  for (const file of targets) {
    const count = read(file)
      .split(/\r?\n/)
      .filter((line) => /TODO|FIXME|待完善|not implemented/i.test(line)).length;
    if (count > 0) issues.push(issue("WARN", "placeholder-language", `${file} contains ${count} placeholder-like line(s).`, file));
  }
  return issues;
}

function largeMarkdownIssues(files) {
  const issues = [];
  for (const file of files.filter((item) => item.endsWith(".md") && (item.startsWith("core/standards/") || item.startsWith("core/artifacts/templates/")))) {
    const nonEmptyLines = read(file).split(/\r?\n/).filter((line) => line.trim()).length;
    const size = statSync(join(root, file)).size;
    if (nonEmptyLines > 450 || size > 30000) {
      issues.push(issue("WARN", "large-markdown", `${file} is large (${nonEmptyLines} non-empty lines, ${size} bytes). Consider splitting reader layer from fact source.`, file));
    }
  }
  return issues;
}

const files = walk(root);
const checks = [
  { id: "core-references", issues: missingCoreReferences(files) },
  { id: "profile-references", issues: missingProfileReferences(files) },
  { id: "standards-index", issues: standardsIndexIssues() },
  { id: "design-system-contract", issues: designSystemIssues() },
  { id: "starter-manifest", issues: starterManifestIssues() },
  { id: "script-modules", issues: scriptModuleIssues() },
  { id: "placeholder-density", issues: placeholderIssues(files) },
  { id: "large-markdown", issues: largeMarkdownIssues(files) },
];
const issues = checks.flatMap((check) => check.issues.map((item) => ({ ...item, check: check.id })));
const summary = {
  overall: issues.some((item) => item.severity === "FAIL") ? "FAIL" : issues.some((item) => item.severity === "WARN") ? "WARN" : "PASS",
  fail: issues.filter((item) => item.severity === "FAIL").length,
  warn: issues.filter((item) => item.severity === "WARN").length,
};
const payload = { kind: "specforge_framework_audit", version: 1, root, summary, checks, issues };

if (asJson) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log("SpecForge Framework Audit");
  console.log("");
  console.log(`Overall: ${summary.overall}`);
  console.log(`Failures: ${summary.fail}`);
  console.log(`Warnings: ${summary.warn}`);
  console.log("");
  for (const check of checks) {
    const status = check.issues.some((item) => item.severity === "FAIL") ? "FAIL" : check.issues.some((item) => item.severity === "WARN") ? "WARN" : "PASS";
    console.log(`## ${check.id}: ${status}`);
    if (check.issues.length === 0) console.log("- none");
    for (const item of check.issues.slice(0, 20)) console.log(`- [${item.severity}] ${item.path ?? "-"}: ${item.message}`);
    if (check.issues.length > 20) console.log(`- ... ${check.issues.length - 20} more`);
    console.log("");
  }
}

process.exit(summary.fail > 0 ? 1 : 0);
