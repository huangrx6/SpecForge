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

function profileCatalogIssues() {
  const issues = [];
  const readme = read("core/profiles/README.md");
  const profilesRoot = join(root, "core/profiles");
  const profileFiles = walk(profilesRoot)
    .filter((file) => file.endsWith(".md") && file !== "core/profiles/README.md")
    .map((file) => file.replace("core/profiles/", ""))
    .sort();
  for (const profile of profileFiles) {
    if (!readme.includes(`\`${profile.replace(/\.md$/, "")}\``) && !readme.includes(`\`${profile}\``)) {
      issues.push(issue("FAIL", "profile-not-cataloged", `${profile} is not listed in core/profiles/README.md.`, "core/profiles/README.md"));
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

function testDesignIssues() {
  const required = [
    "core/skills/quality/test-design/SKILL.md",
    "core/skills/quality/test-design/references/test-design-tree.md",
    "core/skills/quality/test-design/references/automation-matrix.md",
    "core/skills/quality/test-design/references/xmind-export.md",
  ];
  return required
    .filter((path) => !exists(path))
    .map((path) => issue("FAIL", "missing-test-design-file", `${path} is required by the test-design contract.`, path));
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
  const catalogPath = "skills/catalog.json";
  const skillDirs = readdirSync(join(root, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  let catalog = null;
  if (!exists(catalogPath)) {
    issues.push(issue("FAIL", "public-skill-catalog-missing", `${catalogPath} is required for public skill API governance.`, catalogPath));
  } else {
    try {
      catalog = JSON.parse(read(catalogPath));
    } catch (error) {
      issues.push(issue("FAIL", "public-skill-catalog-invalid-json", `${catalogPath} is invalid JSON: ${error.message}.`, catalogPath));
    }
  }

  const catalogSkills = new Map();
  const catalogLayerIds = new Set();
  if (catalog) {
    if (catalog.version !== 1) {
      issues.push(issue("WARN", "public-skill-catalog-version", `${catalogPath} should use version 1.`, catalogPath));
    }

    for (const layer of catalog.layers ?? []) {
      if (!layer.id || !/^[a-z0-9][a-z0-9-]*$/.test(layer.id)) {
        issues.push(issue("FAIL", "public-skill-layer-invalid", `Invalid public skill layer id: ${layer.id ?? "(missing)"}.`, catalogPath));
        continue;
      }
      catalogLayerIds.add(layer.id);
      if (!readme.includes(layer.label ?? layer.id)) {
        issues.push(issue("WARN", "public-skill-layer-not-documented", `Layer ${layer.id} is not documented in skills/README.md.`, "skills/README.md"));
      }
    }

    for (const skill of catalog.skills ?? []) {
      if (!skill.id || !/^[a-z0-9][a-z0-9-]*$/.test(skill.id)) {
        issues.push(issue("FAIL", "public-skill-catalog-id-invalid", `Invalid public skill id: ${skill.id ?? "(missing)"}.`, catalogPath));
        continue;
      }
      if (catalogSkills.has(skill.id)) {
        issues.push(issue("FAIL", "public-skill-catalog-duplicate", `${skill.id} appears more than once in ${catalogPath}.`, catalogPath));
      }
      catalogSkills.set(skill.id, skill);
      if (!catalogLayerIds.has(skill.layer)) {
        issues.push(issue("FAIL", "public-skill-catalog-layer-missing", `${skill.id} references unknown layer ${skill.layer}.`, catalogPath));
      }
      if (!skill.primary_stage) {
        issues.push(issue("FAIL", "public-skill-primary-stage-missing", `${skill.id} is missing primary_stage.`, catalogPath));
      }
      if (!Array.isArray(skill.core_stages) || skill.core_stages.length === 0) {
        issues.push(issue("FAIL", "public-skill-core-stages-missing", `${skill.id} must list core_stages.`, catalogPath));
      } else {
        if (skill.primary_stage && !skill.core_stages.includes(skill.primary_stage)) {
          issues.push(issue("WARN", "public-skill-primary-stage-not-in-core-stages", `${skill.id} primary_stage should also appear in core_stages.`, catalogPath));
        }
        for (const stage of skill.core_stages) {
          if (!exists(`core/workflows/stages/${stage}/SKILL.md`)) {
            issues.push(issue("FAIL", "public-skill-core-stage-missing", `${skill.id} references missing core stage ${stage}.`, catalogPath));
          }
        }
      }
      if (!skill.purpose || skill.purpose.length < 24) {
        issues.push(issue("WARN", "public-skill-purpose-too-short", `${skill.id} should have a concise purpose in ${catalogPath}.`, catalogPath));
      }
    }
  }

  for (const skill of skillDirs) {
    if (!exists(`skills/${skill}/SKILL.md`)) {
      issues.push(issue("FAIL", "public-skill-missing-skill-md", `${skill} is missing SKILL.md.`, `skills/${skill}`));
    } else {
      const body = read(`skills/${skill}/SKILL.md`);
      const name = body.match(/^name:\s*(.+)$/m)?.[1]?.trim();
      if (name !== skill) {
        issues.push(issue("FAIL", "public-skill-frontmatter-name-mismatch", `${skill} SKILL.md frontmatter name should be ${skill}.`, `skills/${skill}/SKILL.md`));
      }
    }
    if (!readme.includes(`\`${skill}\``)) {
      issues.push(issue("FAIL", "public-skill-not-documented", `${skill} is not documented in skills/README.md.`, "skills/README.md"));
    }
    if (catalog && !catalogSkills.has(skill)) {
      issues.push(issue("FAIL", "public-skill-not-cataloged", `${skill} is missing from ${catalogPath}.`, catalogPath));
    }
  }

  if (catalog) {
    for (const skill of catalogSkills.keys()) {
      if (!skillDirs.includes(skill)) {
        issues.push(issue("FAIL", "public-skill-catalog-points-missing-dir", `${skill} is cataloged but skills/${skill}/ is missing.`, catalogPath));
      }
      if (!readme.includes(`\`${skill}\``)) {
        issues.push(issue("FAIL", "public-skill-catalog-not-in-readme", `${skill} is cataloged but not listed in skills/README.md.`, "skills/README.md"));
      }
    }
  }
  return issues;
}

function stageSkillIssues() {
  const issues = [];
  const stagesRoot = join(root, "core/workflows/stages");
  const readme = read("core/workflows/stages/README.md");
  const requiredArtifacts = [
    "intake",
    "research",
    "gap_report",
    "requirements",
    "ui_design",
    "technical_design",
    "tasks",
    "spec_review",
    "implementation",
    "code_review",
    "verification",
    "wiki_sync",
    "closure",
  ];
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
  for (const artifact of requiredArtifacts) {
    if (!readme.includes(`\`${artifact}\``)) {
      issues.push(issue("WARN", "stage-artifact-alias-missing", `${artifact} is not listed in the stage alias index.`, "core/workflows/stages/README.md"));
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

function standardsCommandIssues(files) {
  const issues = [];
  const commandCatalogs = new Set(["core/standards/ai-toolkit.md"]);
  const commandMentionsByScript = new Map();
  const standardFiles = files
    .filter((item) => item.startsWith("core/standards/") && item.endsWith(".md"))
    .sort();

  for (const file of standardFiles) {
    const body = read(file);
    const scripts = [...body.matchAll(/node\s+\.specforge\/core\/scripts\/([A-Za-z0-9_.-]+\.mjs)/g)]
      .map((match) => match[1]);

    for (const script of scripts) {
      const target = `core/scripts/${script}`;
      if (!exists(target)) {
        issues.push(issue("FAIL", "standard-command-target-missing", `${file} references missing ${target}.`, file));
      }
      if (!commandMentionsByScript.has(script)) commandMentionsByScript.set(script, new Set());
      commandMentionsByScript.get(script).add(file);
    }

    if (!commandCatalogs.has(file) && scripts.length > 12) {
      issues.push(issue(
        "WARN",
        "standard-command-list-too-long",
        `${file} mentions ${scripts.length} script commands. Keep detailed command catalogs in core/scripts/README.md or ai-toolkit.md.`,
        file,
      ));
    }
  }

  for (const [script, mentionFiles] of [...commandMentionsByScript.entries()].sort()) {
    const nonCatalogFiles = [...mentionFiles].filter((file) => !commandCatalogs.has(file));
    if (nonCatalogFiles.length > 4) {
      issues.push(issue(
        "WARN",
        "standard-command-duplicated",
        `${script} is repeated in ${nonCatalogFiles.length} non-catalog standard files: ${nonCatalogFiles.join(", ")}.`,
        "core/standards",
      ));
    }
  }

  return issues;
}

function standardsEvolutionIssues() {
  const issues = [];
  const path = "core/standards/evolution.md";
  if (!exists(path)) return [issue("FAIL", "framework-evolution-missing", `${path} must define the framework evolution backlog.`, path)];

  const body = read(path);
  for (const section of ["## 设计基准", "## 当前已固化", "## 下一批演进", "## 设计约束"]) {
    if (!body.includes(section)) {
      issues.push(issue("FAIL", "framework-evolution-section-missing", `${path} is missing ${section}.`, path));
    }
  }

  for (const anchor of ["Spec-driven development", "Human-in-the-loop", "Progressive disclosure", "Agent evaluation"]) {
    if (!body.includes(anchor)) {
      issues.push(issue("WARN", "framework-evolution-anchor-missing", `${path} should track ${anchor} as an evolution principle.`, path));
    }
  }

  return issues;
}

const files = walk(root);
const checks = [
  { id: "core-references", issues: missingCoreReferences(files) },
  { id: "profile-references", issues: missingProfileReferences(files) },
  { id: "profile-catalog", issues: profileCatalogIssues() },
  { id: "standards-index", issues: standardsIndexIssues() },
  { id: "design-system-contract", issues: designSystemIssues() },
  { id: "test-design-contract", issues: testDesignIssues() },
  { id: "starter-manifest", issues: starterManifestIssues() },
  { id: "script-modules", issues: scriptModuleIssues() },
  { id: "package-scripts", issues: packageScriptIssues() },
  { id: "public-skills", issues: publicSkillIssues() },
  { id: "stage-skills", issues: stageSkillIssues() },
  { id: "schema-contracts", issues: schemaContractIssues() },
  { id: "placeholder-density", issues: placeholderIssues(files) },
  { id: "large-markdown", issues: largeMarkdownIssues(files) },
  { id: "standards-command-usage", issues: standardsCommandIssues(files) },
  { id: "framework-evolution", issues: standardsEvolutionIssues() },
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
