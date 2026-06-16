#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { contractsForSchema } from "../../lib/stage-contracts.mjs";
import { layout, templateByOutput, validateSchema } from "../../lib/specforge.mjs";

const root = process.cwd();
const args = process.argv.slice(2);
const asJson = args.includes("--json");

function normalize(path) {
  return path.replaceAll("\\", "/");
}

function materializedPath(path) {
  const normalized = normalize(path);
  if (layout.kind === "source") return normalized;
  if (normalized === "core" || normalized.startsWith("core/")) return normalized.replace(/^core/, layout.runtime);
  if (normalized === "skills" || normalized.startsWith("skills/")) return normalized.replace(/^skills/, layout.skills);
  if (normalized === "starter/.specforge" || normalized.startsWith("starter/.specforge/")) {
    return normalized.replace(/^starter\/\.specforge/, layout.workspace);
  }
  return normalized;
}

function virtualPath(path) {
  const normalized = normalize(path);
  if (layout.kind === "source") return normalized;
  if (normalized === layout.runtime || normalized.startsWith(`${layout.runtime}/`)) return normalized.replace(layout.runtime, "core");
  if (normalized === layout.skills || normalized.startsWith(`${layout.skills}/`)) return normalized.replace(layout.skills, "skills");
  if (normalized === layout.workspace || normalized.startsWith(`${layout.workspace}/`)) return normalized.replace(layout.workspace, "starter/.specforge");
  return normalized;
}

function absolute(path) {
  return join(root, materializedPath(path));
}

function exists(path) {
  return existsSync(absolute(path));
}

function read(path) {
  return readFileSync(absolute(path), "utf8");
}

function walk(directory, out = []) {
  const start = directory.startsWith(root) ? directory : absolute(directory);
  if (!existsSync(start)) return out;
  for (const entry of readdirSync(start, { withFileTypes: true })) {
    const child = join(start, entry.name);
    const rel = virtualPath(normalize(relative(root, child)));
    if ([".git", "node_modules", "starter/.specforge"].some((item) => rel === item || rel.startsWith(`${item}/`))) continue;
    if (entry.isDirectory()) walk(child, out);
    if (entry.isFile()) out.push(rel);
  }
  return out;
}

function listDir(path, options) {
  return readdirSync(absolute(path), options);
}

function fileSize(path) {
  return statSync(absolute(path)).size;
}

function safeJson(path, fallback = null) {
  try {
    return JSON.parse(read(path));
  } catch {
    return fallback;
  }
}

function skillPackages() {
  const skillsRoot = absolute("skills");
  if (!existsSync(skillsRoot)) return [];
  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const packagePath = `skills/${entry.name}/skill-package.json`;
      if (!exists(packagePath)) return null;
      return {
        id: entry.name,
        path: packagePath,
        manifest: safeJson(packagePath),
      };
    })
    .filter((entry) => entry?.manifest)
    .sort((a, b) => a.id.localeCompare(b.id));
}

function stageOwnerMap() {
  const owners = new Map();
  for (const entry of skillPackages()) {
    for (const owned of entry.manifest.owns?.stages ?? []) {
      if (!owned.stage || !owned.path) continue;
      owners.set(owned.stage, {
        owner: entry.id,
        relativePath: `skills/${entry.id}/${owned.path}`,
      });
    }
  }
  return owners;
}

function stageOwnerEntries() {
  return [...stageOwnerMap().entries()]
    .map(([stage, entry]) => ({ stage, ...entry }))
    .sort((a, b) => a.stage.localeCompare(b.stage));
}

function routerWorkflowPath(name) {
  return `skills/sf-router/workflow/${name}`;
}

function issue(severity, code, message, path = null) {
  return { severity, code, message, path };
}

function missingCoreReferences(files) {
  const issues = [];
  const re = /\.specforge\/core\/[A-Za-z0-9_./#\u4e00-\u9fa5-]+/g;
  for (const file of files.filter((item) => /\.(md|mjs|json|yaml)$/.test(item))) {
    for (const match of read(file).matchAll(re)) {
      const raw = match[0].replace(/[),.;:`'"]+$/, "");
      const target = raw.replace(".specforge/core", "core").split("#")[0];
      if (!exists(target)) issues.push(issue("FAIL", "missing-core-reference", `${raw} does not resolve to ${target}.`, file));
    }
  }
  return issues;
}

function referencedPathIssues(files) {
  const issues = [];
  const pathLike = /`((?:core|skills|starter|cli|assets|README\.md|package\.json)\/?[A-Za-z0-9_./#\u4e00-\u9fa5-]*)`/g;
  const pathCommand = /node\s+((?:core|skills|starter|cli)\/[A-Za-z0-9_.\/-]+)/g;
  const placeholders = /[<>*{}$]|\.\.\.|\/\.\.\.?$/;
  const futureOrExample = /\b(planned|future|example|sample|TBD|建议|候选|后续|新增|输出|生成|创建|归档|写入|目标|按需|可选|例如)\b/i;
  const allowedExternalRegistryPath = /^skills\/[a-z0-9-]+\/SKILL\.md$/;
  const allowedProjectSourceOnlyPaths = new Set(["README.md", "package.json", "cli/specforge.mjs", "core/scripts/sync-starter.mjs"]);

  function normalizeReference(raw) {
    const trimmed = raw.trim().replace(/[),.;:`'"]+$/, "");
    if (!trimmed || placeholders.test(trimmed)) return null;
    if (trimmed.includes("\n")) return null;
    const target = trimmed.split("#")[0];
    if (!target || target.endsWith("/")) return null;
    if (allowedExternalRegistryPath.test(target)) return null;
    return target;
  }

  for (const file of files.filter((item) => /\.(md|json|yaml|yml)$/.test(item))) {
    const body = read(file);
    const lines = body.split(/\r?\n/);
    for (const [lineIndex, line] of lines.entries()) {
      const candidates = [];
      for (const match of line.matchAll(pathLike)) candidates.push(match[1]);
      for (const match of line.matchAll(pathCommand)) candidates.push(match[1]);
      for (const raw of candidates) {
        const target = normalizeReference(raw);
        if (!target) continue;
        if (layout.kind === "project" && allowedProjectSourceOnlyPaths.has(target)) continue;
        if (!exists(target) && !futureOrExample.test(line)) {
          issues.push(issue("FAIL", "referenced-path-missing", `${raw} does not resolve to ${target}.`, `${file}:${lineIndex + 1}`));
        }
      }
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
  const profilesRoot = absolute("core/profiles");
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
  const standards = listDir("core/standards").filter((name) => name.endsWith(".md") && !["README.md", "index.md"].includes(name));
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
  const issues = [];
  const required = [
    "core/skills/ui-ux/design-system/SKILL.md",
    "core/skills/ui-ux/design-system/contracts/design-contract.schema.json",
    "core/skills/ui-ux/design-system/contracts/color-palette.schema.json",
    "core/skills/ui-ux/design-system/contracts/component-contract.template.md",
    "core/skills/ui-ux/design-system/contracts/reference-selection.schema.json",
    "core/skills/ui-ux/design-system/contracts/selected-data.schema.json",
    "core/skills/ui-ux/design-system/contracts/visual-qa.schema.json",
    "core/skills/ui-ux/design-system/data/aesthetic-palettes.csv",
    "core/skills/ui-ux/design-system/data/ui-color-scales.csv",
    "core/skills/ui-ux/design-system/data/aesthetic-palette-candidates.csv",
    "core/skills/ui-ux/design-system/data/chart-palettes.csv",
    "core/skills/ui-ux/design-system/data/font-pairing-recipes.csv",
    "core/skills/ui-ux/design-system/data/type-scales.csv",
    "core/skills/ui-ux/design-system/data/spacing-density-scales.csv",
    "core/skills/ui-ux/design-system/data/radius-shadow-recipes.csv",
    "core/skills/ui-ux/design-system/data/motion-recipes.csv",
    "core/skills/ui-ux/design-system/data/advanced-interaction-recipes.csv",
    "core/skills/ui-ux/design-system/data/reference-source-catalog.csv",
    "core/skills/ui-ux/design-system/components/README.md",
    "core/skills/ui-ux/design-system/foundations/README.md",
    "core/skills/ui-ux/design-system/foundations/tokens.md",
    "core/skills/ui-ux/design-system/foundations/colors.md",
    "core/skills/ui-ux/design-system/foundations/typography.md",
    "core/skills/ui-ux/design-system/foundations/spacing.md",
    "core/skills/ui-ux/design-system/foundations/density.md",
    "core/skills/ui-ux/design-system/foundations/motion.md",
    "core/skills/ui-ux/design-system/foundations/accessibility.md",
    "core/skills/ui-ux/design-system/foundations/iconography.md",
    "core/skills/ui-ux/design-system/foundations/content.md",
    "core/skills/ui-ux/design-system/foundations/responsive.md",
    "core/skills/ui-ux/design-system/components/button.md",
    "core/skills/ui-ux/design-system/components/card.md",
    "core/skills/ui-ux/design-system/components/form.md",
    "core/skills/ui-ux/design-system/components/input.md",
    "core/skills/ui-ux/design-system/components/select-combobox.md",
    "core/skills/ui-ux/design-system/components/table.md",
    "core/skills/ui-ux/design-system/components/navbar.md",
    "core/skills/ui-ux/design-system/components/dialog.md",
    "core/skills/ui-ux/design-system/components/drawer.md",
    "core/skills/ui-ux/design-system/components/command-palette.md",
    "core/skills/ui-ux/design-system/components/upload.md",
    "core/skills/ui-ux/design-system/components/tooltip-popover.md",
    "core/skills/ui-ux/design-system/components/skeleton-progress.md",
    "core/skills/ui-ux/design-system/pages/dashboard.md",
    "core/skills/ui-ux/design-system/pages/live-room.md",
    "core/skills/ui-ux/design-system/pages/member.md",
    "core/skills/ui-ux/design-system/pages/mobile-h5.md",
    "core/skills/ui-ux/design-system/pages/ai-assistant.md",
    "core/skills/ui-ux/design-system/prompts/ui-generation.md",
    "core/skills/ui-ux/design-system/prompts/design-language.md",
    "core/skills/ui-ux/design-system/prompts/design-md-extraction.md",
    "core/skills/ui-ux/design-system/prompts/aesthetic-selection.md",
    "core/skills/ui-ux/design-system/prompts/sample-board.md",
    "core/skills/ui-ux/design-system/prompts/anti-cheapness-review.md",
    "core/skills/ui-ux/design-system/prompts/taste-critique.md",
    "core/skills/ui-ux/design-system/prompts/visual-qa.md",
    "core/skills/ui-ux/design-system/prompts/reference-picker.md",
    "core/skills/ui-ux/design-system/prompts/source-routing.md",
    "core/skills/ui-ux/design-system/prompts/reference-extraction.md",
    "core/skills/ui-ux/design-system/prompts/shadcn-resource-audit.md",
    "core/skills/ui-ux/design-system/prompts/domestic-design-case-extraction.md",
    "core/skills/ui-ux/design-system/references/good-case.md",
    "core/skills/ui-ux/design-system/references/bad-case.md",
    "core/skills/ui-ux/design-system/references/design-mode-routing.md",
    "core/skills/ui-ux/design-system/references/color-system.md",
    "core/skills/ui-ux/design-system/references/palette-source-index.md",
    "core/skills/ui-ux/design-system/references/palette-usage-rules.md",
    "core/skills/ui-ux/design-system/references/visual-qa-detectors.md",
    "core/skills/ui-ux/design-system/references/design-review-rubric.md",
    "core/skills/ui-ux/design-system/references/aesthetic-directions.md",
    "core/skills/ui-ux/design-system/references/component-system.md",
    "core/skills/ui-ux/design-system/references/design-intelligence.md",
    "core/skills/ui-ux/design-system/references/design-system-orchestration.md",
    "core/skills/ui-ux/design-system/references/composition-source-index.md",
    "core/skills/ui-ux/design-system/references/font-source-index.md",
    "core/skills/ui-ux/design-system/references/design-composition.md",
    "core/skills/ui-ux/design-system/references/advanced-interaction-source-index.md",
    "core/skills/ui-ux/design-system/references/ux-research-ia.md",
    "core/skills/ui-ux/design-system/references/design-md-extraction.md",
    "core/skills/ui-ux/design-system/references/taste-review.md",
    "core/skills/ui-ux/design-system/references/layout-archetypes.md",
    "core/skills/ui-ux/design-system/references/product-ui-layout-quality.md",
    "core/skills/ui-ux/design-system/references/read-profiles.md",
    "core/skills/ui-ux/design-system/references/reference-picker.md",
    "core/skills/ui-ux/design-system/references/reference-source-routing.md",
    "core/skills/ui-ux/design-system/references/reference-extraction-protocol.md",
    "core/skills/ui-ux/design-system/references/output-contract.md",
    "core/skills/ui-ux/design-system/references/cross-stage-handoff.md",
    "core/skills/ui-ux/design-system/references/shadcn-vue.md",
    "core/skills/ui-ux/design-system/references/sample-board-template.md",
    "core/skills/ui-ux/design-system/references/motion-gsap.md",
    "core/skills/ui-ux/design-system/references/ui-toolchain.md",
    "core/skills/ui-ux/design-system/changelog.md",
  ];
  issues.push(...required
    .filter((path) => !exists(path))
    .map((path) => issue("FAIL", "missing-design-system-file", `${path} is required by the design-system contract.`, path)));

  const schemaPath = "core/skills/ui-ux/design-system/contracts/design-contract.schema.json";
  if (exists(schemaPath)) {
    const schema = read(schemaPath);
    for (const marker of ['"Product UI"', '"Brand Surface"', '"Hybrid"', '"Avatar-IP"', '"Empty State"', '"allOf"', '"if"', '"then"', '"const"', '"reference_selection"', '"ui_type"', '"selected_needs"', '"borrow_strength"', '"source_routing"', '"reuse_boundary"', '"offline_behavior"', '"forbidden"', '"scan_manifest"', '"profile"', '"selected_data"', '"selection_rationale"', '"human_confirmation"', '"options_presented"', '"default_reversibility"', '"font_source_id"', '"font_pairing_id"', '"advanced_interaction_recipe_id"', '"contrast_checks"', '"scope"', '"foundation_system"', '"source_basis"', '"typography"', '"spacing"', '"radius_shadow"', '"token_delivery_hint"', '"css_variables"', '"tailwind_mapping"', '"pencil_variables"', '"layout"', '"state_matrix"', '"primary_work_surface"', '"product_ui_quality"', '"visual_qa"', '"detector"', '"severity"', '"evidence"', '"owner"', '"layer_3_gsap"', '"fallback"', '"verification"']) {
      if (!schema.includes(marker)) {
        issues.push(issue("FAIL", "design-contract-schema-marker-missing", `${schemaPath} must include ${marker}.`, schemaPath));
      }
    }
    if (schema.includes('"Avatar-IP / Empty State"')) {
      issues.push(issue("FAIL", "design-contract-combined-mode-enum", `${schemaPath} must not allow combined design_mode enum values. Use scope instead.`, schemaPath));
    }
  }

  const colorSchemaPath = "core/skills/ui-ux/design-system/contracts/color-palette.schema.json";
  if (exists(colorSchemaPath)) {
    const schema = read(colorSchemaPath);
    if (!schema.includes('"contrast_checks"')) {
      issues.push(issue("FAIL", "color-palette-contrast-checks-missing", `${colorSchemaPath} must require contrast_checks.`, colorSchemaPath));
    }
    if (schema.includes('"Avatar-IP / Empty State"')) {
      issues.push(issue("FAIL", "color-palette-combined-mode-enum", `${colorSchemaPath} must not allow combined design_mode enum values.`, colorSchemaPath));
    }
  }

  const componentTemplatePath = "core/skills/ui-ux/design-system/contracts/component-contract.template.md";
  if (exists(componentTemplatePath)) {
    const template = read(componentTemplatePath);
    for (const marker of ["## Trace", "Related REQ", "Related AC", "Related UI section", "Related design contract"]) {
      if (!template.includes(marker)) {
        issues.push(issue("FAIL", "component-contract-trace-marker-missing", `${componentTemplatePath} is missing ${marker}.`, componentTemplatePath));
      }
    }
  }

  const artifactQualityPath = "core/scripts/lib/artifact-quality.mjs";
  if (exists(artifactQualityPath)) {
    const body = read(artifactQualityPath);
    for (const marker of ["lintUiDesign", "design-contract-json-missing", "design-contract-unknown-palette", "design-contract-scan-manifest-missing", "design-contract-human-confirmation-missing", "design-contract-human-confirmation-defaulted-required", "design-contract-foundation-system-missing", "design-contract-token-delivery-hint-missing", "design-contract-token-delivery-css-vars-empty", "design-contract-selection-rationale-missing", "design-contract-selection-rationale-id-mismatch", "design-contract-visual-qa-missing", "design-contract-high-visual-qa-pending", "design-contract-mode-required-field-missing", "design-contract-gsap-entry-field-missing", "ui-design-high-visual-qa-unresolved"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "ui-design-artifact-quality-marker-missing", `${artifactQualityPath} must check ${marker}.`, artifactQualityPath));
      }
    }
  }

  return issues;
}

function pencilSystemIssues() {
  const issues = [];
  const required = [
    "core/skills/ui-ux/pencil/SKILL.md",
    "core/skills/ui-ux/pencil/references/specforge-design-contract-handoff.md",
    "core/skills/ui-ux/pencil/references/pencil-token-system.md",
    "core/skills/ui-ux/pencil/references/pencil-quality-gate.md",
  ];
  issues.push(...required
    .filter((path) => !exists(path))
    .map((path) => issue("FAIL", "missing-pencil-skill-file", `${path} is required by the local Pencil skill contract.`, path)));

  const registry = safeJson("core/skills/registry.json", { skills: [] });
  const pencil = registry.skills?.find((entry) => entry.id === "pencil");
  if (!pencil) {
    issues.push(issue("FAIL", "pencil-registry-missing", "core/skills/registry.json must register the local pencil skill.", "core/skills/registry.json"));
    return issues;
  }
  if (pencil.source?.type !== "local-authored") {
    issues.push(issue("FAIL", "pencil-registry-not-local", "pencil must be a SpecForge local-authored skill, not github-raw.", "core/skills/registry.json"));
  }
  if (pencil.source?.path !== "core/skills/ui-ux/pencil/SKILL.md") {
    issues.push(issue("FAIL", "pencil-registry-path-invalid", "pencil source.path must point to core/skills/ui-ux/pencil/SKILL.md.", "core/skills/registry.json"));
  }
  const files = new Set((pencil.source?.files ?? []).map((entry) => entry.path));
  for (const support of ["references/specforge-design-contract-handoff.md", "references/pencil-token-system.md", "references/pencil-quality-gate.md"]) {
    if (!files.has(support)) {
      issues.push(issue("FAIL", "pencil-support-file-not-registered", `pencil registry source.files must include ${support}.`, "core/skills/registry.json"));
    }
  }
  const body = exists("core/skills/ui-ux/pencil/SKILL.md") ? read("core/skills/ui-ux/pencil/SKILL.md") : "";
  for (const marker of ["Design Contract JSON", "foundation_system", "Pencil variables", "Product UI Layout Audit", "不负责重新决定审美"]) {
    if (!body.includes(marker)) {
      issues.push(issue("FAIL", "pencil-skill-marker-missing", `Pencil skill must include marker: ${marker}.`, "core/skills/ui-ux/pencil/SKILL.md"));
    }
  }
  return issues;
}

function designSystemAestheticIssues() {
  const issues = [];
  const path = "core/skills/ui-ux/design-system/references/aesthetic-directions.md";
  if (!exists(path)) return [issue("FAIL", "missing-aesthetic-directions", `${path} is required.`, path)];

  const body = read(path);
  for (const section of [
    "## 1. 简洁 / 高级类",
    "## 2. 可爱 / 活泼类",
    "## 3. 艺术 / 氛围类",
    "## 4. 复古 / 怀旧类",
    "## 5. 科技 / 未来类",
    "## 6. 潮流 / 个性类",
    "## 7. 自然 / 温柔类",
    "## 8. 专业 / 可信类",
    "## 9. 材质 / 3D 类",
    "## 10. 插画 / 角色表现类",
    "## 11. 图形 / 排版实验类",
    "## 12. 地域 / 文化灵感类",
    "## 13. 情绪 / 体验调性类",
    "## Business translation patterns",
    "## Mixing rules",
  ]) {
    if (!body.includes(section)) {
      issues.push(issue("FAIL", "aesthetic-style-family-missing", `${path} is missing ${section}.`, path));
    }
  }

  for (const marker of ["Aesthetic direction", "Business translation", "不是业务页面模式库", "不要再把 `Operational Calm`"]) {
    if (!body.includes(marker)) {
      issues.push(issue("FAIL", "aesthetic-business-boundary-missing", `${path} must distinguish aesthetic style from business translation.`, path));
    }
  }

  return issues;
}

function designSystemPaletteIssues() {
  const issues = [];
  const path = "core/skills/ui-ux/design-system/data/aesthetic-palettes.csv";
  if (!exists(path)) return [issue("FAIL", "missing-aesthetic-palettes", `${path} is required.`, path)];

  const lines = read(path).split(/\r?\n/).filter((line) => line.trim());
  const headers = lines[0]?.split(",") ?? [];
  for (const header of [
    "palette_id",
    "aesthetic_id",
    "display_name",
    "design_mode",
    "best_for",
    "background",
    "surface",
    "surface_2",
    "text",
    "muted",
    "primary",
    "secondary",
    "accent",
    "border",
    "success",
    "warning",
    "danger",
    "chart_1",
    "chart_2",
    "chart_3",
    "neutral_scale",
    "primary_scale",
    "accent_scale",
    "semantic_scale",
    "chart_scale",
    "usage_ratio",
    "contrast_notes",
    "avoid",
    "source",
    "source_url",
    "license_note",
  ]) {
    if (!headers.includes(header)) {
      issues.push(issue("FAIL", "palette-column-missing", `${path} is missing column ${header}.`, path));
    }
  }

  const rows = lines.slice(1);
  if (rows.length < 20) {
    issues.push(issue("FAIL", "palette-count-too-low", `${path} must include at least 20 palette rows.`, path));
  }

  const body = read(path);
  for (const marker of ["background", "surface_2", "chart_3", "source_url", "license_note", "neutral_scale", "primary_scale", "accent_scale", "semantic_scale", "usage_ratio", "contrast_notes", "avoid"]) {
    if (!body.includes(marker)) {
      issues.push(issue("FAIL", "palette-contract-marker-missing", `${path} must include ${marker}.`, path));
    }
  }

  for (const paletteId of ["minimal", "notion", "japanese-ma", "minimal-tech", "ai-data", "toy", "bubble", "watercolor", "forest", "luxury", "cyberpunk", "glass", "poster-retro", "black-white-cool"]) {
    if (!body.includes(`${paletteId},`)) {
      issues.push(issue("FAIL", "palette-id-missing", `${path} must include palette_id ${paletteId}.`, path));
    }
  }

  for (const supportPath of [
    "core/skills/ui-ux/design-system/data/ui-color-scales.csv",
    "core/skills/ui-ux/design-system/data/aesthetic-palette-candidates.csv",
    "core/skills/ui-ux/design-system/data/chart-palettes.csv",
    "core/skills/ui-ux/design-system/references/palette-source-index.md",
  ]) {
    if (!exists(supportPath)) {
      issues.push(issue("FAIL", "palette-source-file-missing", `${supportPath} is required by the palette source contract.`, supportPath));
    }
  }
  return issues;
}

function designSystemComponentDepthIssues() {
  const issues = [];
  const directory = absolute("core/skills/ui-ux/design-system/components");
  if (!existsSync(directory)) {
    return [issue("FAIL", "missing-component-directory", "design-system components directory is required.", "core/skills/ui-ux/design-system/components")];
  }

  const requiredSections = [
    "## Purpose",
    "## Structure",
    "## Variants",
    "## States",
    "## Density",
    "## shadcn-vue mapping",
    "## Content",
    "## Anti-patterns",
  ];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name === "README.md") continue;
    const path = `core/skills/ui-ux/design-system/components/${entry.name}`;
    const body = read(path);
    for (const section of requiredSections) {
      if (!body.includes(section)) {
        issues.push(issue("FAIL", "component-contract-section-missing", `${path} is missing ${section}.`, path));
      }
    }
    if (!body.includes("Primitive") || !body.includes("Companions") || !body.includes("Project wrappers")) {
      issues.push(issue("FAIL", "component-shadcn-mapping-incomplete", `${path} must map primitives, companions, and project wrappers.`, path));
    }
  }

  return issues;
}

function requirementsSystemIssues() {
  const issues = [];
  const required = [
    "core/skills/requirements/SKILL.md",
    "core/skills/requirements/foundations/behavior-contract.md",
    "core/skills/requirements/transforms/source-to-requirements.md",
    "core/skills/requirements/references/anti-patterns.md",
    "core/skills/requirements/prompts/acceptance-criteria.md",
    "core/skills/requirements/patterns/role-permission.md",
    "core/skills/requirements/patterns/workflow-state.md",
    "core/skills/requirements/patterns/data-file.md",
    "core/skills/requirements/patterns/ai-quality.md",
    "core/skills/requirements/patterns/ui-impact.md",
    "core/skills/requirements/patterns/integration-api.md",
    "core/skills/requirements/patterns/ops-runtime.md",
    "core/skills/requirements/patterns/runtime-ops.md",
  ];

  for (const path of required) {
    if (!exists(path)) {
      issues.push(issue("FAIL", "missing-requirements-system-file", `${path} is required by the requirements system contract.`, path));
    }
  }

  const behaviorPath = "core/skills/requirements/foundations/behavior-contract.md";
  if (exists(behaviorPath)) {
    const body = read(behaviorPath);
    for (const marker of ["## 1. Confirmation Boundary", "## 2. Requirement Language", "## 3. Testability", "## 4. Traceability", "## 5. Examples"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "requirements-behavior-marker-missing", `${behaviorPath} is missing ${marker}.`, behaviorPath));
      }
    }
  }

  for (const removed of [
    "core/skills/requirements/foundations/confirmation-boundary.md",
    "core/skills/requirements/foundations/requirement-language.md",
    "core/skills/requirements/foundations/testability.md",
    "core/skills/requirements/foundations/traceability.md",
  ]) {
    if (exists(removed)) {
      issues.push(issue("FAIL", "requirements-merged-foundation-present", `${removed} has been merged into behavior-contract.md and must be removed.`, removed));
    }
  }

  const outputPath = "core/skills/requirements/references/output-contract.md";
  if (exists(outputPath)) {
    const body = read(outputPath);
    for (const marker of ["Applied Requirement Patterns", "inline trace required", "独立 Trace table", "downstream trace"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "requirements-output-contract-trace-marker-missing", `${outputPath} is missing ${marker}.`, outputPath));
      }
    }
  }

  const registryPath = "core/skills/registry.json";
  if (exists(registryPath)) {
    const registry = read(registryPath);
    for (const marker of ['"path": "foundations/behavior-contract.md"', '"path": "foundations/nfr-taxonomy.md"']) {
      if (!registry.includes(marker)) {
        issues.push(issue("FAIL", "requirements-registry-core-foundation-missing", `${registryPath} must include ${marker}.`, registryPath));
      }
    }
    for (const removed of ["confirmation-boundary.md", "requirement-language.md", "testability.md", "traceability.md"]) {
      if (registry.includes(removed)) {
        issues.push(issue("FAIL", "requirements-registry-removed-foundation-present", `${registryPath} must not reference removed foundation file ${removed}.`, registryPath));
      }
    }
  }

  const transformPath = "core/skills/requirements/transforms/source-to-requirements.md";
  if (exists(transformPath)) {
    const body = read(transformPath);
    for (const marker of ["样例 1", "样例 2", "样例 3", "样例 4", "样例 5", "修写动作"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "requirements-transform-example-missing", `${transformPath} is missing ${marker}.`, transformPath));
      }
    }
  }

  const antiPath = "core/skills/requirements/references/anti-patterns.md";
  if (exists(antiPath)) {
    const body = read(antiPath);
    for (const marker of ["Severity", "Fail signal", "为什么危险", "自动修正动作", "修正流程", "修正示例", "P0", "P1", "P2"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "requirements-anti-pattern-fixer-missing", `${antiPath} is missing ${marker}.`, antiPath));
      }
    }
  }

  for (const path of [
    "core/skills/requirements/patterns/role-permission.md",
    "core/skills/requirements/patterns/workflow-state.md",
    "core/skills/requirements/patterns/data-file.md",
    "core/skills/requirements/patterns/ai-quality.md",
    "core/skills/requirements/patterns/ui-impact.md",
    "core/skills/requirements/patterns/integration-api.md",
    "core/skills/requirements/patterns/ops-runtime.md",
  ]) {
    if (!exists(path)) continue;
    const body = read(path);
    for (const marker of ["## 什么时候使用", "## 必须问清", "## REQ", "## AC", "## 常见漏项"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "requirements-pattern-section-missing", `${path} is missing ${marker}.`, path));
      }
    }
  }

  return issues;
}

function prdSystemIssues() {
  const issues = [];
  const required = [
    "core/skills/prd/SKILL.md",
    "core/skills/prd/foundations/product-decision-boundary.md",
    "core/skills/prd/foundations/prd-language.md",
    "core/skills/prd/foundations/assumption-ledger.md",
    "core/skills/prd/foundations/decision-status.md",
    "core/skills/prd/transforms/brief-to-prd.md",
    "core/skills/prd/transforms/brainstorm-to-prd.md",
    "core/skills/prd/transforms/research-to-prd.md",
    "core/skills/prd/transforms/product-discovery-to-prd.md",
    "core/skills/prd/patterns/b2b-operator-data-product.md",
    "core/skills/prd/patterns/ai-feature.md",
    "core/skills/prd/patterns/workflow-approval.md",
    "core/skills/prd/patterns/dashboard-report.md",
    "core/skills/prd/patterns/internal-tool.md",
    "core/skills/prd/patterns/integration-platform.md",
    "core/skills/prd/references/output-contract.md",
    "core/skills/prd/references/quality-rubric.md",
    "core/skills/prd/references/anti-patterns.md",
    "core/skills/prd/references/external-prd-skill-normalization.md",
    "core/skills/prd/contracts/prd-decision.schema.json",
    "core/skills/prd/prompts/product-interview.md",
    "core/skills/prd/prompts/mvp-slicing.md",
    "core/skills/prd/prompts/open-question-review.md",
  ];

  for (const path of required) {
    if (!exists(path)) {
      issues.push(issue("FAIL", "missing-prd-system-file", `${path} is required by the PRD system contract.`, path));
    }
  }

  const skillPath = "core/skills/prd/SKILL.md";
  if (exists(skillPath)) {
    const body = read(skillPath);
    for (const marker of ["产品需求文档是产品决策文档", "产品需求文档不负责", "产品决策门禁", "交接给需求阶段"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "prd-skill-boundary-marker-missing", `${skillPath} is missing ${marker}.`, skillPath));
      }
    }
  }

  const outputPath = "core/skills/prd/references/output-contract.md";
  if (exists(outputPath)) {
    const body = read(outputPath);
    for (const marker of ["prd-lite", "prd-standard", "prd-deep", "产品决策摘要", "范围与最小可行版本决策", "产品决策门禁", "交接给需求阶段"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "prd-output-contract-marker-missing", `${outputPath} is missing ${marker}.`, outputPath));
      }
    }
  }

  const antiPath = "core/skills/prd/references/anti-patterns.md";
  if (exists(antiPath)) {
    const body = read(antiPath);
    for (const marker of ["建议冒充决策", "需求泄漏", "指标表演", "修正顺序"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "prd-anti-pattern-marker-missing", `${antiPath} is missing ${marker}.`, antiPath));
      }
    }
  }

  return issues;
}

function productSystemIssues() {
  const issues = [];
  const required = [
    "core/skills/product/SKILL.md",
    "core/skills/product/foundations/product-discovery-boundary.md",
    "core/skills/product/foundations/opportunity-language.md",
    "core/skills/product/foundations/outcome-metric.md",
    "core/skills/product/foundations/evidence-levels.md",
    "core/skills/product/transforms/request-to-opportunity-map.md",
    "core/skills/product/transforms/feedback-to-feature-pool.md",
    "core/skills/product/transforms/brainstorm-to-product-discovery.md",
    "core/skills/product/transforms/product-discovery-to-prd.md",
    "core/skills/product/patterns/b2b-operator-data-product.md",
    "core/skills/product/patterns/ai-agent-product.md",
    "core/skills/product/patterns/dashboard-analytics.md",
    "core/skills/product/patterns/workflow-ops.md",
    "core/skills/product/patterns/internal-platform.md",
    "core/skills/product/references/output-contract.md",
    "core/skills/product/references/prioritization-methods.md",
    "core/skills/product/references/experiment-design.md",
    "core/skills/product/references/quality-rubric.md",
    "core/skills/product/references/anti-patterns.md",
    "core/skills/product/references/external-ost-normalization.md",
    "core/skills/product/contracts/product-discovery.schema.json",
    "core/skills/product/prompts/opportunity-interview.md",
    "core/skills/product/prompts/feature-triage.md",
    "core/skills/product/prompts/mvp-slicing.md",
  ];

  for (const path of required) {
    if (!exists(path)) {
      issues.push(issue("FAIL", "missing-product-system-file", `${path} is required by the product discovery system contract.`, path));
    }
  }

  const skillPath = "core/skills/product/SKILL.md";
  if (exists(skillPath)) {
    const body = read(skillPath);
    for (const marker of ["Product Discovery System Skill", "不直接写完整 PRD", "不替用户确认 MVP", "MVP Recommendation"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "product-skill-boundary-marker-missing", `${skillPath} is missing ${marker}.`, skillPath));
      }
    }
  }

  const outputPath = "core/skills/product/references/output-contract.md";
  if (exists(outputPath)) {
    const body = read(outputPath);
    for (const marker of ["Profile Selection", "Opportunity Map", "Candidate Feature Pool", "Prioritization Matrix", "MVP Recommendation", "Experiment / Validation Plan", "Handoff"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "product-output-contract-marker-missing", `${outputPath} is missing ${marker}.`, outputPath));
      }
    }
  }

  const antiPath = "core/skills/product/references/anti-patterns.md";
  if (exists(antiPath)) {
    const body = read(antiPath);
    for (const marker of ["Feature-first discovery", "Fake score", "MVP as recommendation", "PRD leakage"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "product-anti-pattern-marker-missing", `${antiPath} is missing ${marker}.`, antiPath));
      }
    }
  }

  return issues;
}

function codeReviewSkillIssues() {
  const required = [
    "core/skills/quality/code-review/SKILL.md",
    "core/skills/quality/code-review/foundations/review-boundary.md",
    "core/skills/quality/code-review/foundations/finding-severity.md",
    "core/skills/quality/code-review/foundations/diff-triage.md",
    "core/skills/quality/code-review/foundations/spec-compliance.md",
    "core/skills/quality/code-review/references/output-contract.md",
    "core/skills/quality/code-review/contracts/code-review-finding.schema.json",
  ];
  const issues = required
    .filter((path) => !exists(path))
    .map((path) => issue("FAIL", "missing-code-review-file", `${path} is required by the code-review contract.`, path));

  const skillPath = "core/skills/quality/code-review/SKILL.md";
  if (exists(skillPath)) {
    const body = read(skillPath);
    for (const marker of ["SpecForge 自有 code review 主能力", "三向对账", "spec compliance review", "gate decision"]) {
      if (!body.includes(marker)) issues.push(issue("FAIL", "code-review-marker-missing", `${skillPath} is missing ${marker}.`, skillPath));
    }
    const removedReviewSkill = `code-${"reviewer"}`;
    if (body.includes(`quality/${removedReviewSkill}`) || body.includes(`external-${removedReviewSkill}-normalization`)) {
      issues.push(issue("FAIL", "code-review-external-reference-present", `${skillPath} must not reference removed external review skill.`, skillPath));
    }
  }

  const removedReviewSkill = `code-${"reviewer"}`;
  if (exists(`core/skills/quality/${removedReviewSkill}`)) {
    issues.push(issue("FAIL", "external-review-directory-present", `core/skills/quality/${removedReviewSkill} must not be vendored.`, `core/skills/quality/${removedReviewSkill}`));
  }
  if (exists(`core/skills/quality/code-review/references/external-${removedReviewSkill}-normalization.md`)) {
    issues.push(issue("FAIL", "external-review-normalization-present", "external review normalization reference must be removed.", `core/skills/quality/code-review/references/external-${removedReviewSkill}-normalization.md`));
  }
  if (exists("core/skills/registry.json")) {
    const registry = read("core/skills/registry.json");
    if (registry.includes(`"id": "${removedReviewSkill}"`) || registry.includes("Shubhamsaboo/awesome-llm-apps")) {
      issues.push(issue("FAIL", "external-review-registry-present", "registry must not include removed external review skill.", "core/skills/registry.json"));
    }
  }
  return issues;
}

function testEngineeringIssues() {
  const required = [
    "core/skills/quality/test-engineering/SKILL.md",
    "core/skills/quality/test-engineering/foundations/evidence-strength.md",
    "core/skills/quality/test-engineering/foundations/test-data-auth.md",
    "core/skills/quality/test-engineering/patterns/authenticated-browser-flow.md",
    "core/skills/quality/test-engineering/patterns/runtime-smoke.md",
    "core/skills/quality/test-engineering/patterns/unit-test-authoring.md",
    "core/skills/quality/test-engineering/references/output-contract.md",
    "core/skills/quality/test-engineering/references/playwright-execution-contract.md",
    "core/skills/quality/test-engineering/contracts/test-case.schema.json",
    "core/skills/quality/test-engineering/contracts/playwright-flow.schema.json",
  ];
  const issues = required
    .filter((path) => !exists(path))
    .map((path) => issue("FAIL", "missing-test-engineering-file", `${path} is required by the test-engineering contract.`, path));

  const skillPath = "core/skills/quality/test-engineering/SKILL.md";
  if (exists(skillPath)) {
    const body = read(skillPath);
    for (const marker of ["测试工程主能力包", "auth strategy", "runtime runbook", "Playwright", "evidence"]) {
      if (!body.includes(marker)) issues.push(issue("FAIL", "test-engineering-marker-missing", `${skillPath} is missing ${marker}.`, skillPath));
    }
  }
  const outputPath = "core/skills/quality/test-engineering/references/output-contract.md";
  if (exists(outputPath)) {
    const body = read(outputPath);
    for (const marker of ["Test Design Tree Rules", "Automation Matrix", "XMind / 白板导出规则"]) {
      if (!body.includes(marker)) {
        issues.push(issue("FAIL", "test-engineering-absorbed-test-design-marker-missing", `${outputPath} is missing ${marker}.`, outputPath));
      }
    }
  }
  if (exists("core/skills/quality/test-design")) {
    issues.push(issue("FAIL", "test-design-directory-present", "Deprecated quality/test-design directory must be removed; use quality/test-engineering.", "core/skills/quality/test-design"));
  }
  return issues;
}

function starterManifestIssues() {
  const issues = [];
  if (layout.kind !== "source") return issues;
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
  const scriptModules = {
    routing: ["status.mjs", "instructions.mjs", "workflow-audit.mjs", "workflow-health.mjs", "stage-contract.mjs", "artifact-graph-status.mjs"],
    authoring: ["create-work.mjs", "create-artifact.mjs", "sync-wiki.mjs"],
    quality: [
      "quality-suite.mjs",
      "artifact-quality.mjs",
      "decision-brief.mjs",
      "decision-checkpoints.mjs",
      "decision-quality.mjs",
      "source-quality.mjs",
      "implementation-quality.mjs",
      "test-case-quality.mjs",
      "evidence-summary.mjs",
      "wiki-quality.mjs",
      "closure-quality.mjs",
      "gate-preflight.mjs",
    ],
    gates: ["gate.mjs"],
    reporting: ["render-work-report.mjs", "workflow-package.mjs", "handoff-summary.mjs", "traceability-summary.mjs"],
    "code-intelligence": ["codebase-map.mjs", "codebase-index.mjs", "graph-freshness.mjs", "graph-impact.mjs", "wiki-refresh-plan.mjs"],
    wiki: ["wiki-update-plan.mjs", "wiki-hydrate.mjs"],
    maintenance: [
      "doctor.mjs",
      "self-test.mjs",
      "framework-audit.mjs",
      ...(layout.kind === "source" ? ["sync-starter.mjs"] : []),
      "update-skills.mjs",
      "validate-structure.mjs",
      "validate-skills.mjs",
      "validate-external-skills.mjs",
      "validate-design-system-registry.mjs",
    ],
    archive: ["archive-work.mjs"],
  };
  const moduleSupportFiles = new Set([
    "core/scripts/modules/code-intelligence/provider-facts.mjs",
    ...(layout.kind === "project" ? ["core/scripts/modules/maintenance/sync-starter.mjs"] : []),
  ]);
  const required = [
    "core/scripts/modules/README.md",
    "core/scripts/modules/routing/README.md",
    "core/scripts/modules/authoring/README.md",
    "core/scripts/modules/quality/README.md",
    "core/scripts/modules/gates/README.md",
    "core/scripts/modules/reporting/README.md",
    "core/scripts/modules/code-intelligence/README.md",
    "core/scripts/modules/wiki/README.md",
    "core/scripts/modules/maintenance/README.md",
    "core/scripts/modules/archive/README.md",
  ];
  issues.push(...required
    .filter((path) => !exists(path))
    .map((path) => issue("FAIL", "missing-script-module", `${path} is required by the script module map.`, path)));

  if (exists("core/scripts/modules/README.md")) {
    const moduleMap = read("core/scripts/modules/README.md");
    const expectedRootScripts = new Map();
    for (const [module, scripts] of Object.entries(scriptModules)) {
      for (const script of scripts) {
        expectedRootScripts.set(script, module);
        const implementation = `core/scripts/modules/${module}/${script}`;
        const wrapper = `core/scripts/${script}`;
        if (!exists(implementation)) {
          issues.push(issue("FAIL", "module-script-missing", `${script} is assigned to ${module} but ${implementation} is missing.`, "core/scripts/modules/README.md"));
        }
        if (!exists(wrapper)) {
          issues.push(issue("FAIL", "root-wrapper-missing", `${script} must keep a stable root wrapper at ${wrapper}.`, "core/scripts/modules/README.md"));
        } else {
          const wrapperBody = read(wrapper).trim();
          const expectedImport = `import "./modules/${module}/${script}";`;
          if (!wrapperBody.includes(expectedImport) || wrapperBody.split(/\r?\n/).filter((line) => line.trim() && !line.startsWith("#!")).length !== 1) {
            issues.push(issue("FAIL", "root-script-not-wrapper", `${wrapper} must be a thin wrapper importing ${implementation}.`, wrapper));
          }
        }
        if (!moduleMap.includes(`\`${script}\``)) {
          issues.push(issue("FAIL", "module-script-not-documented", `${script} is assigned to ${module} but is not documented in core/scripts/modules/README.md.`, "core/scripts/modules/README.md"));
        }
      }
    }
    const rootScripts = listDir("core/scripts")
      .filter((name) => name.endsWith(".mjs"))
      .sort();
    for (const script of rootScripts) {
      if (!expectedRootScripts.has(script)) {
        issues.push(issue("FAIL", "root-script-not-mapped", `${script} is a root script but is not assigned to a module.`, "core/scripts/modules/README.md"));
      }
    }
    for (const file of walk("core/scripts/modules").filter((item) => item.endsWith(".mjs")).sort()) {
      if (moduleSupportFiles.has(file)) continue;
      const match = file.match(/^core\/scripts\/modules\/([^/]+)\/([^/]+\.mjs)$/);
      if (!match) continue;
      const [, module, script] = match;
      if (!scriptModules[module]?.includes(script)) {
        issues.push(issue("FAIL", "module-script-not-mapped", `${file} is an implementation script but is not assigned in the script module map.`, "core/scripts/modules/README.md"));
      }
    }
  }
  return issues;
}

function packageScriptIssues() {
  const issues = [];
  if (!exists("package.json")) return issues;
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
  const skillDirs = listDir("skills", { withFileTypes: true })
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
        const stageOwners = stageOwnerMap();
        for (const stage of skill.core_stages) {
          if (!stageOwners.has(stage)) {
            issues.push(issue("FAIL", "public-skill-core-stage-missing", `${skill.id} references stage ${stage}, but no skill package owns it.`, catalogPath));
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

function skillPackageIssues() {
  const issues = [];
  const catalogPath = "skills/catalog.json";
  if (!exists(catalogPath)) return [issue("FAIL", "skill-package-catalog-missing", `${catalogPath} is required before validating skill packages.`, catalogPath)];

  let catalog;
  try {
    catalog = JSON.parse(read(catalogPath));
  } catch (error) {
    return [issue("FAIL", "skill-package-catalog-invalid-json", `${catalogPath} is invalid JSON: ${error.message}.`, catalogPath)];
  }

  const manifests = new Map();
  const ownedStages = new Map();

  for (const skill of catalog.skills ?? []) {
    const packagePath = `skills/${skill.id}/skill-package.json`;
    const commandsPath = `skills/${skill.id}/commands.json`;
    if (!exists(packagePath)) {
      issues.push(issue("FAIL", "skill-package-manifest-missing", `${skill.id} must keep related stages and scripts in ${packagePath}.`, packagePath));
      continue;
    }
    if (!exists(commandsPath)) {
      issues.push(issue("FAIL", "skill-package-commands-missing", `${skill.id} must keep related script commands in ${commandsPath}.`, commandsPath));
    }

    let manifest;
    try {
      manifest = JSON.parse(read(packagePath));
    } catch (error) {
      issues.push(issue("FAIL", "skill-package-manifest-invalid-json", `${packagePath} is invalid JSON: ${error.message}.`, packagePath));
      continue;
    }
    manifests.set(skill.id, manifest);

    if (manifest.id !== skill.id) {
      issues.push(issue("FAIL", "skill-package-id-mismatch", `${packagePath} id must be ${skill.id}.`, packagePath));
    }
    if (manifest.version !== 2) {
      issues.push(issue("FAIL", "skill-package-version-mismatch", `${packagePath} must use version 2 owner/use structure.`, packagePath));
    }
    if (manifest.primary_stage !== skill.primary_stage) {
      issues.push(issue("FAIL", "skill-package-primary-stage-mismatch", `${skill.id} primary_stage differs from skills/catalog.json.`, packagePath));
    }

    const ownsStages = Array.isArray(manifest.owns?.stages) ? manifest.owns.stages : [];
    const usesStages = Array.isArray(manifest.uses?.stages) ? manifest.uses.stages : [];
    for (const owned of ownsStages) {
      if (!owned.stage || !owned.path) {
        issues.push(issue("FAIL", "skill-package-owned-stage-invalid", `${skill.id} has an incomplete owned stage entry.`, packagePath));
        continue;
      }
      if (owned.path !== `stages/${owned.stage}/SKILL.md`) {
        issues.push(issue("FAIL", "skill-package-owned-stage-path-invalid", `${skill.id} owned stage ${owned.stage} path should be stages/${owned.stage}/SKILL.md.`, packagePath));
      }
      if (!exists(`skills/${skill.id}/${owned.path}`)) {
        issues.push(issue("FAIL", "skill-package-owned-stage-file-missing", `${skill.id} owns missing stage file ${owned.path}.`, packagePath));
      }
      if (ownedStages.has(owned.stage)) {
        issues.push(issue("FAIL", "skill-package-stage-owned-more-than-once", `${owned.stage} is owned by both ${ownedStages.get(owned.stage)} and ${skill.id}.`, packagePath));
      } else {
        ownedStages.set(owned.stage, skill.id);
      }
    }

    if (exists(commandsPath)) {
      let commands;
      try {
        commands = JSON.parse(read(commandsPath));
      } catch (error) {
        issues.push(issue("FAIL", "skill-package-commands-invalid-json", `${commandsPath} is invalid JSON: ${error.message}.`, commandsPath));
        continue;
      }
      if (commands.skill !== skill.id) {
        issues.push(issue("FAIL", "skill-package-commands-skill-mismatch", `${commandsPath} skill must be ${skill.id}.`, commandsPath));
      }
      for (const command of commands.commands ?? []) {
        const match = String(command).match(/^node\s+\.specforge\/core\/scripts\/([A-Za-z0-9_.-]+\.mjs)\b/);
        if (!match) continue;
        if (!exists(`core/scripts/${match[1]}`)) {
          issues.push(issue("FAIL", "skill-package-command-target-missing", `${skill.id} command points at missing core/scripts/${match[1]}.`, commandsPath));
        }
      }
    }

    const ownsStageSet = new Set(ownsStages.map((entry) => entry.stage));
    const usesStageMap = new Map(usesStages.map((entry) => [entry.stage, entry]));
    for (const file of walk(`skills/${skill.id}`).filter((item) => item.endsWith(".md"))) {
      const body = read(file);
      for (const match of body.matchAll(/\.specforge\/skills\/([a-z0-9-]+)\/stages\/([A-Za-z0-9_-]+)\/SKILL\.md/g)) {
        const owner = match[1];
        const stage = match[2];
        if (owner === skill.id && ownsStageSet.has(stage)) continue;
        const used = usesStageMap.get(stage);
        if (!used || used.owner !== owner) {
          issues.push(issue("FAIL", "skill-package-doc-reference-not-declared", `${skill.id} references ${owner}/stages/${stage} but does not declare it in uses.stages.`, packagePath));
        }
      }
    }
  }

  for (const skill of catalog.skills ?? []) {
    const packagePath = `skills/${skill.id}/skill-package.json`;
    const manifest = manifests.get(skill.id);
    if (!manifest) continue;
    const ownsStages = new Set((manifest.owns?.stages ?? []).map((entry) => entry.stage));
    const usesStages = new Map((manifest.uses?.stages ?? []).map((entry) => [entry.stage, entry]));

    for (const stage of skill.core_stages ?? []) {
      if (ownsStages.has(stage)) continue;
      const used = usesStages.get(stage);
      if (!used) {
        issues.push(issue("FAIL", "skill-package-stage-reference-missing", `${skill.id} must own or reference stage ${stage}.`, packagePath));
        continue;
      }
      const owner = ownedStages.get(stage);
      if (!owner) {
        issues.push(issue("FAIL", "skill-package-stage-owner-missing", `${skill.id} references ${stage}, but no skill owns it.`, packagePath));
        continue;
      }
      if (used.owner !== owner || used.path !== `../${owner}/stages/${stage}/SKILL.md`) {
        issues.push(issue("FAIL", "skill-package-stage-reference-invalid", `${skill.id} should reference ${stage} as ../${owner}/stages/${stage}/SKILL.md.`, packagePath));
      }
      if (!exists(`skills/${owner}/stages/${stage}/SKILL.md`)) {
        issues.push(issue("FAIL", "skill-package-stage-reference-target-missing", `${skill.id} references missing owner stage skills/${owner}/stages/${stage}/SKILL.md.`, packagePath));
      }
    }

    const ownsWorkflow = manifest.owns?.workflow ?? [];
    if (skill.id === "sf-router") {
      for (const path of ["workflow/drift-rules.json", "workflow/eval-fixtures.json", "workflow/score-rubric.json", "workflow/README.md"]) {
        if (!ownsWorkflow.some((entry) => entry.path === path)) {
          issues.push(issue("FAIL", "skill-package-router-workflow-missing", `sf-router must own ${path}.`, packagePath));
        }
        if (!exists(`skills/sf-router/${path}`)) {
          issues.push(issue("FAIL", "skill-package-router-workflow-file-missing", `sf-router workflow file is missing: ${path}.`, packagePath));
        }
      }
    } else if (ownsWorkflow.length > 0) {
      issues.push(issue("FAIL", "skill-package-workflow-duplicated", `${skill.id} should reference sf-router workflow instead of owning workflow files.`, packagePath));
    }
  }

  return issues;
}

function stageSkillIssues() {
  const issues = [];
  const readmePath = routerWorkflowPath("README.md");
  const readme = exists(readmePath) ? read(readmePath) : "";
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
  if (!exists(readmePath)) {
    issues.push(issue("FAIL", "stage-workflow-readme-missing", `${readmePath} is required for stage alias governance.`, readmePath));
  }
  for (const { stage, relativePath: skillPath } of stageOwnerEntries()) {
    if (!exists(skillPath)) continue;
    const body = read(skillPath);
    if (!body.startsWith("---")) {
      issues.push(issue("FAIL", "stage-skill-missing-frontmatter", `${skillPath} must start with YAML frontmatter.`, skillPath));
    }
    if (!body.includes(`name: ${stage}`)) {
      issues.push(issue("WARN", "stage-skill-name-mismatch", `${skillPath} frontmatter should name the stage folder (${stage}).`, skillPath));
    }
    if (!readme.includes(stage)) {
      issues.push(issue("FAIL", "stage-skill-not-documented", `${stage} is not documented in ${readmePath}.`, readmePath));
    }
  }
  for (const artifact of requiredArtifacts) {
    if (!readme.includes(`\`${artifact}\``)) {
      issues.push(issue("WARN", "stage-artifact-alias-missing", `${artifact} is not listed in the stage alias index.`, readmePath));
    }
  }
  return issues;
}

function stageEvalFixtureIssues() {
  const issues = [];
  const path = routerWorkflowPath("eval-fixtures.json");
  if (!exists(path)) return [issue("FAIL", "stage-eval-fixtures-missing", `${path} is required for stage regression coverage.`, path)];

  let payload;
  try {
    payload = JSON.parse(read(path));
  } catch (error) {
    return [issue("FAIL", "stage-eval-fixtures-invalid-json", `${path} is invalid JSON: ${error.message}.`, path)];
  }

  if (payload.version !== 1) {
    issues.push(issue("WARN", "stage-eval-fixtures-version", `${path} should use version 1.`, path));
  }

  const stageDirs = stageOwnerEntries().map((entry) => entry.stage);
  const artifactIds = new Set(
    listDir("core/artifacts/schemas")
      .filter((name) => name.endsWith(".json"))
      .flatMap((name) => JSON.parse(read(`core/artifacts/schemas/${name}`)).artifacts.map((artifact) => artifact.id)),
  );
  const fixtures = Array.isArray(payload.fixtures) ? payload.fixtures : [];
  const fixtureStages = new Set();

  if (!Array.isArray(payload.fixtures) || payload.fixtures.length === 0) {
    issues.push(issue("FAIL", "stage-eval-fixtures-empty", `${path} must define a non-empty fixtures array.`, path));
  }

  for (const fixture of fixtures) {
    if (!fixture.stage) {
      issues.push(issue("FAIL", "stage-eval-fixture-stage-missing", "A stage eval fixture is missing stage.", path));
      continue;
    }
    if (fixtureStages.has(fixture.stage)) {
      issues.push(issue("FAIL", "stage-eval-fixture-duplicate", `${fixture.stage} appears more than once in ${path}.`, path));
    }
    fixtureStages.add(fixture.stage);
    if (!stageDirs.includes(fixture.stage)) {
      issues.push(issue("FAIL", "stage-eval-fixture-unknown-stage", `${fixture.stage} does not match a skill-owned workflow stage.`, path));
    }
    if (fixture.artifact_id !== null && fixture.artifact_id !== undefined && !artifactIds.has(fixture.artifact_id)) {
      issues.push(issue("FAIL", "stage-eval-fixture-unknown-artifact", `${fixture.stage} references unknown artifact ${fixture.artifact_id}.`, path));
    }
    if (!Array.isArray(fixture.pass?.given) || fixture.pass.given.length === 0) {
      issues.push(issue("FAIL", "stage-eval-pass-given-missing", `${fixture.stage} pass fixture must define given.`, path));
    }
    if (!Array.isArray(fixture.pass?.expect) || fixture.pass.expect.length === 0) {
      issues.push(issue("FAIL", "stage-eval-pass-expect-missing", `${fixture.stage} pass fixture must define expect.`, path));
    }
    if (!Array.isArray(fixture.pass?.assertions) || fixture.pass.assertions.length === 0) {
      issues.push(issue("FAIL", "stage-eval-pass-assertions-missing", `${fixture.stage} pass fixture must define assertions.`, path));
    }
    if (!Array.isArray(fixture.fail?.given) || fixture.fail.given.length === 0) {
      issues.push(issue("FAIL", "stage-eval-fail-given-missing", `${fixture.stage} fail fixture must define given.`, path));
    }
    if (!fixture.fail?.expect_signal) {
      issues.push(issue("FAIL", "stage-eval-fail-signal-missing", `${fixture.stage} fail fixture must define expect_signal.`, path));
    }
  }

  for (const stage of stageDirs) {
    if (!fixtureStages.has(stage)) {
      issues.push(issue("FAIL", "stage-eval-fixture-missing-stage", `${stage} is missing from ${path}.`, path));
    }
  }

  return issues;
}

function stageScoreRubricIssues() {
  const issues = [];
  const path = routerWorkflowPath("score-rubric.json");
  if (!exists(path)) return [issue("FAIL", "stage-score-rubric-missing", `${path} is required for stage output evaluation governance.`, path)];

  let payload;
  try {
    payload = JSON.parse(read(path));
  } catch (error) {
    return [issue("FAIL", "stage-score-rubric-invalid-json", `${path} is invalid JSON: ${error.message}.`, path)];
  }

  if (payload.version !== 1) {
    issues.push(issue("WARN", "stage-score-rubric-version", `${path} should use version 1.`, path));
  }

  const dimensions = Array.isArray(payload.dimensions) ? payload.dimensions : [];
  if (dimensions.length === 0) {
    issues.push(issue("FAIL", "stage-score-rubric-dimensions-empty", `${path} must define dimensions.`, path));
  }
  const dimensionIds = new Set();
  for (const dimension of dimensions) {
    if (!dimension.id || !/^[a-z0-9][a-z0-9_]*$/.test(dimension.id)) {
      issues.push(issue("FAIL", "stage-score-rubric-dimension-id-invalid", `Invalid rubric dimension id: ${dimension.id ?? "(missing)"}.`, path));
      continue;
    }
    if (dimensionIds.has(dimension.id)) {
      issues.push(issue("FAIL", "stage-score-rubric-dimension-duplicate", `${dimension.id} appears more than once in ${path}.`, path));
    }
    dimensionIds.add(dimension.id);
    if (!dimension.description || !Array.isArray(dimension.strong_signals) || !Array.isArray(dimension.failure_signals)) {
      issues.push(issue("FAIL", "stage-score-rubric-dimension-incomplete", `${dimension.id} must define description, strong_signals, and failure_signals.`, path));
    }
  }

  const stageDirs = stageOwnerEntries().map((entry) => entry.stage);
  const stageFocus = payload.stage_focus && typeof payload.stage_focus === "object" && !Array.isArray(payload.stage_focus)
    ? payload.stage_focus
    : {};
  const minimumFocus = Number(payload.minimum_focus_dimensions ?? 3);

  for (const stage of stageDirs) {
    const focus = stageFocus[stage];
    if (!Array.isArray(focus)) {
      issues.push(issue("FAIL", "stage-score-rubric-stage-missing", `${stage} is missing from ${path} stage_focus.`, path));
      continue;
    }
    if (focus.length < minimumFocus) {
      issues.push(issue("FAIL", "stage-score-rubric-stage-focus-too-small", `${stage} must reference at least ${minimumFocus} focus dimensions.`, path));
    }
    for (const dimensionId of focus) {
      if (!dimensionIds.has(dimensionId)) {
        issues.push(issue("FAIL", "stage-score-rubric-stage-focus-unknown", `${stage} references unknown dimension ${dimensionId}.`, path));
      }
    }
  }

  for (const stage of Object.keys(stageFocus)) {
    if (!stageDirs.includes(stage)) {
      issues.push(issue("FAIL", "stage-score-rubric-unknown-stage", `${stage} is present in ${path} but no matching stage directory exists.`, path));
    }
  }

  return issues;
}

function promptSkillDriftIssues() {
  const issues = [];
  const path = routerWorkflowPath("drift-rules.json");
  if (!exists(path)) return [issue("FAIL", "prompt-skill-drift-rules-missing", `${path} is required to prevent prompt and skill terminology drift.`, path)];

  let payload;
  try {
    payload = JSON.parse(read(path));
  } catch (error) {
    return [issue("FAIL", "prompt-skill-drift-rules-invalid-json", `${path} is invalid JSON: ${error.message}.`, path)];
  }

  if (payload.version !== 1) {
    issues.push(issue("WARN", "prompt-skill-drift-rules-version", `${path} should use version 1.`, path));
  }
  if (!Array.isArray(payload.gate_rules) || payload.gate_rules.length === 0) {
    issues.push(issue("FAIL", "prompt-skill-gate-rules-empty", `${path} must define gate_rules.`, path));
  }
  if (!Array.isArray(payload.artifact_terms) || payload.artifact_terms.length === 0) {
    issues.push(issue("FAIL", "prompt-skill-artifact-terms-empty", `${path} must define artifact_terms.`, path));
  }

  const catalog = exists("skills/catalog.json") ? JSON.parse(read("skills/catalog.json")) : { skills: [] };
  const catalogSkills = new Map((catalog.skills ?? []).map((skill) => [skill.id, skill]));
  const stageOwners = stageOwnerMap();
  const artifactIds = new Set(
    listDir("core/artifacts/schemas")
      .filter((name) => name.endsWith(".json"))
      .flatMap((name) => JSON.parse(read(`core/artifacts/schemas/${name}`)).artifacts.map((artifact) => artifact.id)),
  );
  const outputs = new Set(
    listDir("core/artifacts/schemas")
      .filter((name) => name.endsWith(".json"))
      .flatMap((name) => JSON.parse(read(`core/artifacts/schemas/${name}`)).artifacts.flatMap((artifact) => artifact.outputs ?? [])),
  );

  const seenGates = new Set();
  for (const rule of payload.gate_rules ?? []) {
    for (const field of ["gate", "artifact", "stage", "public_skill", "evidence", "approved_command"]) {
      if (!rule[field]) issues.push(issue("FAIL", "prompt-skill-gate-rule-field-missing", `Gate rule is missing ${field}.`, path));
    }
    if (!rule.gate) continue;
    if (seenGates.has(rule.gate)) issues.push(issue("FAIL", "prompt-skill-gate-rule-duplicate", `${rule.gate} appears more than once in ${path}.`, path));
    seenGates.add(rule.gate);
    if (!artifactIds.has(rule.artifact)) {
      issues.push(issue("FAIL", "prompt-skill-gate-artifact-unknown", `${rule.gate} references unknown artifact ${rule.artifact}.`, path));
    }

    const stagePath = stageOwners.get(rule.stage)?.relativePath;
    const publicSkillPath = `skills/${rule.public_skill}/SKILL.md`;
    const publicStageLink = `.specforge/skills/${rule.public_skill}/stages/${rule.stage}/SKILL.md`;
    const packagedStagePath = `skills/${rule.public_skill}/stages/${rule.stage}/SKILL.md`;
    if (!stagePath || !exists(stagePath)) {
      issues.push(issue("FAIL", "prompt-skill-gate-stage-missing", `${rule.gate} stage skill has no owner or is missing: ${rule.stage}.`, path));
    } else {
      const body = read(stagePath);
      if (!body.includes(rule.gate)) {
        issues.push(issue("FAIL", "prompt-skill-gate-name-missing-in-stage", `${stagePath} does not mention canonical gate ${rule.gate}.`, stagePath));
      }
      if (!body.includes(rule.evidence)) {
        issues.push(issue("FAIL", "prompt-skill-gate-evidence-missing-in-stage", `${stagePath} does not mention canonical evidence ${rule.evidence}.`, stagePath));
      }
    }

    if (!exists(publicSkillPath)) {
      issues.push(issue("FAIL", "prompt-skill-gate-public-skill-missing", `${rule.gate} public skill is missing: ${publicSkillPath}.`, path));
    } else {
      const body = read(publicSkillPath);
      if (!exists(packagedStagePath)) {
        issues.push(issue("FAIL", "prompt-skill-packaged-stage-missing", `${rule.public_skill} must package ${packagedStagePath}.`, packagedStagePath));
      }
      if (!body.includes(publicStageLink)) {
        issues.push(issue("FAIL", "prompt-skill-core-stage-link-missing", `${publicSkillPath} must link to ${publicStageLink}.`, publicSkillPath));
      }
      if (!body.includes(rule.gate)) {
        issues.push(issue("FAIL", "prompt-skill-gate-name-missing-in-public-skill", `${publicSkillPath} does not mention canonical gate ${rule.gate}.`, publicSkillPath));
      }
      if (!body.includes(rule.evidence)) {
        issues.push(issue("FAIL", "prompt-skill-gate-evidence-missing-in-public-skill", `${publicSkillPath} does not mention canonical evidence ${rule.evidence}.`, publicSkillPath));
      }
      const commandCount = rule.approved_command ? body.split(rule.approved_command).length - 1 : 0;
      if (commandCount === 0) {
        issues.push(issue("WARN", "prompt-skill-approved-command-missing", `${publicSkillPath} should include canonical command: ${rule.approved_command}.`, publicSkillPath));
      }
      if (commandCount > 1) {
        issues.push(issue("WARN", "prompt-skill-approved-command-duplicated", `${publicSkillPath} repeats canonical command ${commandCount} times: ${rule.approved_command}.`, publicSkillPath));
      }
    }

    const catalogSkill = catalogSkills.get(rule.public_skill);
    if (!catalogSkill) {
      issues.push(issue("FAIL", "prompt-skill-gate-catalog-missing", `${rule.public_skill} is not present in skills/catalog.json.`, "skills/catalog.json"));
    } else {
      if (catalogSkill.primary_stage !== rule.stage) {
        issues.push(issue("FAIL", "prompt-skill-gate-primary-stage-drift", `${rule.public_skill} primary_stage is ${catalogSkill.primary_stage}, expected ${rule.stage}.`, "skills/catalog.json"));
      }
      if (!(catalogSkill.core_stages ?? []).includes(rule.stage)) {
        issues.push(issue("FAIL", "prompt-skill-gate-core-stage-drift", `${rule.public_skill} core_stages must include ${rule.stage}.`, "skills/catalog.json"));
      }
    }
  }

  const seenArtifacts = new Set();
  for (const term of payload.artifact_terms ?? []) {
    for (const field of ["artifact", "stage", "public_skill", "output"]) {
      if (!term[field]) issues.push(issue("FAIL", "prompt-skill-artifact-term-field-missing", `Artifact term is missing ${field}.`, path));
    }
    if (!term.artifact) continue;
    if (seenArtifacts.has(term.artifact)) issues.push(issue("FAIL", "prompt-skill-artifact-term-duplicate", `${term.artifact} appears more than once in ${path}.`, path));
    seenArtifacts.add(term.artifact);
    if (!artifactIds.has(term.artifact)) {
      issues.push(issue("FAIL", "prompt-skill-artifact-term-unknown", `${term.artifact} is not defined by a workflow schema.`, path));
    }
    if (term.output && !outputs.has(term.output)) {
      issues.push(issue("FAIL", "prompt-skill-artifact-output-unknown", `${term.artifact} output ${term.output} is not owned by a workflow schema.`, path));
    }
    if (term.stage && !stageOwners.has(term.stage)) {
      issues.push(issue("FAIL", "prompt-skill-artifact-stage-missing", `${term.artifact} references missing stage ${term.stage}.`, path));
    }
    const catalogSkill = catalogSkills.get(term.public_skill);
    if (!catalogSkill) {
      issues.push(issue("FAIL", "prompt-skill-artifact-catalog-missing", `${term.public_skill} is not present in skills/catalog.json.`, "skills/catalog.json"));
    } else {
      if (catalogSkill.primary_stage !== term.stage) {
        issues.push(issue("FAIL", "prompt-skill-artifact-primary-stage-drift", `${term.public_skill} primary_stage is ${catalogSkill.primary_stage}, expected ${term.stage}.`, "skills/catalog.json"));
      }
      if (!(catalogSkill.core_stages ?? []).includes(term.stage)) {
        issues.push(issue("FAIL", "prompt-skill-artifact-core-stage-drift", `${term.public_skill} core_stages must include ${term.stage}.`, "skills/catalog.json"));
      }
    }
  }

  return issues;
}

function schemaContractIssues() {
  const issues = [];
  const schemaFiles = listDir("core/artifacts/schemas")
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
  const targets = files.filter((item) => item.startsWith("core/standards/") || item.startsWith("skills/"));
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
    const size = fileSize(file);
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

const files = layout.kind === "source"
  ? walk(root)
  : [...walk("core"), ...walk("skills")];
const checks = [
  { id: "core-references", issues: missingCoreReferences(files) },
  { id: "referenced-paths", issues: referencedPathIssues(files) },
  { id: "profile-references", issues: missingProfileReferences(files) },
  { id: "profile-catalog", issues: profileCatalogIssues() },
  { id: "standards-index", issues: standardsIndexIssues() },
  { id: "design-system-contract", issues: designSystemIssues() },
  { id: "pencil-system-contract", issues: pencilSystemIssues() },
  { id: "design-system-aesthetic-contract", issues: designSystemAestheticIssues() },
  { id: "design-system-palette-contract", issues: designSystemPaletteIssues() },
  { id: "design-system-component-depth", issues: designSystemComponentDepthIssues() },
  { id: "requirements-system-contract", issues: requirementsSystemIssues() },
  { id: "prd-system-contract", issues: prdSystemIssues() },
  { id: "product-system-contract", issues: productSystemIssues() },
  { id: "code-review-skill-contract", issues: codeReviewSkillIssues() },
  { id: "test-engineering-contract", issues: testEngineeringIssues() },
  { id: "starter-manifest", issues: starterManifestIssues() },
  { id: "script-modules", issues: scriptModuleIssues() },
  { id: "package-scripts", issues: packageScriptIssues() },
  { id: "public-skills", issues: publicSkillIssues() },
  { id: "skill-packages", issues: skillPackageIssues() },
  { id: "stage-skills", issues: stageSkillIssues() },
  { id: "stage-eval-fixtures", issues: stageEvalFixtureIssues() },
  { id: "stage-score-rubric", issues: stageScoreRubricIssues() },
  { id: "prompt-skill-drift", issues: promptSkillDriftIssues() },
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
