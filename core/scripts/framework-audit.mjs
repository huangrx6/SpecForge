#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { contractsForSchema } from "./lib/stage-contracts.mjs";
import { templateByOutput, validateSchema } from "./lib/specforge.mjs";

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
  const readme = read("core/standards/README.md");
  for (const name of standards) {
    if (!index.includes(`\`${name}\``)) {
      issues.push(issue("WARN", "standard-not-indexed", `${name} is not referenced with a code span in core/standards/index.md.`, "core/standards/index.md"));
    }
    if (!readme.includes(`\`${name}\``)) {
      issues.push(issue("WARN", "standard-not-in-readme", `${name} is not referenced with a code span in core/standards/README.md.`, "core/standards/README.md"));
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
  const issues = [];
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
  issues.push(...required
    .filter((path) => !exists(path))
    .map((path) => issue("FAIL", "missing-script-module", `${path} is required by the script module map.`, path)));

  if (exists("core/scripts/modules/README.md")) {
    const moduleMap = read("core/scripts/modules/README.md");
    const rootScripts = readdirSync(join(root, "core/scripts"))
      .filter((name) => name.endsWith(".mjs"))
      .sort();
    for (const script of rootScripts) {
      if (!moduleMap.includes(`\`${script}\``)) {
        issues.push(issue("FAIL", "root-script-not-mapped", `${script} is a root script but is not assigned to a module.`, "core/scripts/modules/README.md"));
      }
    }
  }
  return issues;
}

function packageScriptIssues() {
  const issues = [];
  const pkg = JSON.parse(read("package.json"));
  for (const [name, command] of Object.entries(pkg.scripts ?? {})) {
    for (const match of String(command).matchAll(/node\s+core\/scripts\/([A-Za-z0-9_.-]+\.mjs)/g)) {
      const target = `core/scripts/${match[1]}`;
      if (!exists(target)) {
        issues.push(issue("FAIL", "package-script-target-missing", `npm script ${name} points at missing ${target}.`, "package.json"));
      }
      if (exists("core/scripts/modules/README.md") && !read("core/scripts/modules/README.md").includes(`\`${match[1]}\``)) {
        issues.push(issue("FAIL", "package-script-not-module-mapped", `npm script ${name} target ${match[1]} is not mapped in script modules.`, "core/scripts/modules/README.md"));
      }
    }
  }
  return issues;
}

function publicSkillIssues() {
  const issues = [];
  const readme = read("skills/README.md");
  const skillDirs = readdirSync(join(root, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  for (const skill of skillDirs) {
    if (!exists(`skills/${skill}/SKILL.md`)) {
      issues.push(issue("FAIL", "public-skill-missing-skill-md", `${skill} is missing SKILL.md.`, `skills/${skill}`));
    }
    if (!readme.includes(`\`${skill}\``)) {
      issues.push(issue("FAIL", "public-skill-not-documented", `${skill} is not documented in skills/README.md.`, "skills/README.md"));
    }
  }
  return issues;
}

function stageSkillIssues() {
  const issues = [];
  const stagesRoot = join(root, "core/workflows/stages");
  const readme = read("core/workflows/stages/README.md");
  const stageDirs = readdirSync(stagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  for (const stage of stageDirs) {
    const skillPath = `core/workflows/stages/${stage}/SKILL.md`;
    if (!exists(skillPath)) continue;
    const body = read(skillPath);
    if (!body.startsWith("---")) {
      issues.push(issue("FAIL", "stage-skill-missing-frontmatter", `${skillPath} must start with YAML frontmatter.`, skillPath));
    }
    if (!body.includes(`name: ${stage}`)) {
      issues.push(issue("WARN", "stage-skill-name-mismatch", `${skillPath} frontmatter should name the stage folder (${stage}).`, skillPath));
    }
    if (!readme.includes(`\`${stage}/SKILL.md\``)) {
      issues.push(issue("FAIL", "stage-skill-not-documented", `${stage}/SKILL.md is not documented in core/workflows/stages/README.md.`, "core/workflows/stages/README.md"));
    }
  }
  return issues;
}

function schemaContractIssues() {
  const issues = [];
  const schemaFiles = readdirSync(join(root, "core/artifacts/schemas"))
    .filter((name) => name.endsWith(".json"))
    .sort();

  for (const name of schemaFiles) {
    const path = `core/artifacts/schemas/${name}`;
    let schema;
    try {
      schema = JSON.parse(read(path));
    } catch (error) {
      issues.push(issue("FAIL", "schema-json-invalid", `${path} is invalid JSON: ${error.message}.`, path));
      continue;
    }

    for (const error of validateSchema(schema, path)) {
      issues.push(issue("FAIL", "schema-invalid", error, path));
    }

    const contracts = contractsForSchema(schema);
    const contractIds = new Set(contracts.map((contract) => contract.id));
    for (const artifact of schema.artifacts ?? []) {
      if (!contractIds.has(artifact.id)) {
        issues.push(issue("FAIL", "artifact-contract-missing", `${artifact.id} has no stage contract.`, path));
      }
      for (const output of artifact.outputs ?? []) {
        if (!templateByOutput.has(output)) {
          issues.push(issue("WARN", "artifact-output-template-missing", `${artifact.id} output ${output} has no template mapping.`, path));
        }
      }
    }

    for (const contract of contracts) {
      if (!contract.goal || !contract.exit || (contract.must_prove ?? []).length === 0) {
        issues.push(issue("FAIL", "artifact-contract-incomplete", `${contract.id} contract must define goal, must_prove, and exit.`, path));
      }
      if ((contract.execution?.commands ?? []).length === 0 || (contract.execution?.tools ?? []).length === 0) {
        issues.push(issue("WARN", "artifact-contract-missing-execution", `${contract.id} contract has no recommended tools or commands.`, path));
      }
    }
  }
  return issues;
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
  { id: "package-scripts", issues: packageScriptIssues() },
  { id: "public-skills", issues: publicSkillIssues() },
  { id: "stage-skills", issues: stageSkillIssues() },
  { id: "schema-contracts", issues: schemaContractIssues() },
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
