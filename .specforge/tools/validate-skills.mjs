import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = process.cwd();
const errors = [];

function listRootSkillFiles() {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(root, entry.name, "SKILL.md"))
    .filter((file) => existsSync(file))
    .filter((file) => basename(join(file, "..")) === "specforge" || basename(join(file, "..")).startsWith("specforge-"))
    .sort();
}

function listInternalSkillFiles() {
  const skillsRoot = join(root, ".specforge/skills");
  if (!existsSync(skillsRoot)) return [];
  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(skillsRoot, entry.name, "SKILL.md"))
    .filter((file) => existsSync(file))
    .sort();
}

function parseFrontmatter(content, file) {
  const frontmatterStart = content.match(/^\uFEFF?---\r?\n/);
  if (!frontmatterStart) {
    errors.push(`${file}: missing YAML frontmatter`);
    return {};
  }

  const end = content.search(/\r?\n---(?:\r?\n|$)/);
  if (end === -1) {
    errors.push(`${file}: unclosed YAML frontmatter`);
    return {};
  }

  const block = content.slice(frontmatterStart[0].length, end).trim();
  const fields = {};
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) fields[match[1]] = match[2].trim();
  }
  return fields;
}

function validateSkill(file) {
  const content = readFileSync(file, "utf8");
  const folderName = basename(join(file, ".."));
  const frontmatter = parseFrontmatter(content, file);

  if (!frontmatter.name) errors.push(`${file}: missing frontmatter name`);
  if (!frontmatter.description) errors.push(`${file}: missing frontmatter description`);
  if (frontmatter.name && frontmatter.name !== folderName) {
    errors.push(`${file}: frontmatter name "${frontmatter.name}" does not match folder "${folderName}"`);
  }
  if (frontmatter.description && frontmatter.description.length < 24) {
    errors.push(`${file}: description is too short`);
  }
  if (!content.match(/^#\s+/m)) errors.push(`${file}: missing top-level heading`);
  if (content.length > 18000) errors.push(`${file}: SKILL.md is too large; move details to references`);
  if (/npm\s+run/.test(content)) {
    errors.push(`${file}: use direct .specforge/tools command instead of npm run`);
  }
}

const rootSkillFiles = listRootSkillFiles();
const internalSkillFiles = listInternalSkillFiles();
const files = [...rootSkillFiles, ...internalSkillFiles];
for (const file of files) validateSkill(file);

const internalSkillMap = new Map([
  ["discovery/SKILL.md", ["specforge", "specforge-intake"]],
  ["requirements/SKILL.md", ["specforge-spec"]],
  ["design/SKILL.md", ["specforge-spec"]],
  ["task-planning/SKILL.md", ["specforge-spec"]],
  ["spec-review/SKILL.md", ["specforge-review"]],
  ["implementation/SKILL.md", ["specforge-implement"]],
  ["code-review/SKILL.md", ["specforge-review"]],
  ["verification/SKILL.md", ["specforge-verify"]],
  ["ssot-sync/SKILL.md", ["specforge-close"]],
  ["status/SKILL.md", ["specforge-doctor", "specforge-work"]],
  ["steering/SKILL.md", ["specforge-onboard", "specforge-close"]],
]);

for (const [internalSkill, skills] of internalSkillMap) {
  const internalSkillPath = join(root, ".specforge/skills", internalSkill);
  if (!existsSync(internalSkillPath)) errors.push(`missing internal skill: .specforge/skills/${internalSkill}`);
  for (const skill of skills) {
    const skillPath = join(root, skill, "SKILL.md");
    if (!existsSync(skillPath)) errors.push(`internal skill ${internalSkill} points to missing root skill: ${skill}`);
  }
}

const internalSkillReadme = join(root, ".specforge/skills/README.md");
if (!existsSync(internalSkillReadme)) {
  errors.push("missing .specforge/skills/README.md");
} else {
  const readme = readFileSync(internalSkillReadme, "utf8");
  for (const [internalSkill, skills] of internalSkillMap) {
    if (!readme.includes(internalSkill)) errors.push(`internal skill README missing mapping for ${internalSkill}`);
    for (const skill of skills) {
      if (!readme.includes(skill)) errors.push(`internal skill README missing root skill mapping for ${skill}`);
    }
  }
}

const rootSkill = join(root, "specforge/SKILL.md");
if (existsSync(rootSkill)) {
  const rootContent = readFileSync(rootSkill, "utf8");
  for (const required of [
    "specforge-onboard",
    "specforge-intake",
    "specforge-spec",
    "specforge-implement",
    "specforge-review",
    "specforge-verify",
    "specforge-close",
    "specforge-doctor",
    "specforge-work",
  ]) {
    if (!rootContent.includes(required)) errors.push(`${rootSkill}: missing route to ${required}`);
  }
}

for (const file of rootSkillFiles) {
  const content = readFileSync(file, "utf8");
  if (!content.includes(".specforge/rules/") && !file.endsWith("specforge-onboard/SKILL.md")) {
    errors.push(`${file}: missing explicit rule links`);
  }
}

if (errors.length > 0) {
  console.error("SpecForge skill validation failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SpecForge skill validation passed.");
console.log(`Checked ${rootSkillFiles.length} root-level skills and ${internalSkillFiles.length} internal skills.`);
