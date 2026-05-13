import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { layout } from "./lib/specforge.mjs";

const root = process.cwd();
const errors = [];

function listEntrySkillFiles() {
  const skillsRoot = join(root, layout.kind === "source" ? "skills" : ".");
  if (!existsSync(skillsRoot)) return [];
  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(skillsRoot, entry.name, "SKILL.md"))
    .filter((file) => existsSync(file))
    .filter((file) => {
      const folder = basename(join(file, ".."));
      return folder.startsWith("sf-") || folder === "specforge" || folder.startsWith("specforge-");
    })
    .sort();
}

function listStageSkillFiles() {
  const stagesRoot = join(root, layout.stages);
  if (!existsSync(stagesRoot)) return [];
  return readdirSync(stagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(stagesRoot, entry.name, "SKILL.md"))
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
    errors.push(`${file}: use direct runtime tool commands instead of npm run`);
  }
}

const entrySkillFiles = listEntrySkillFiles();
const stageSkillFiles = listStageSkillFiles();
for (const file of [...entrySkillFiles, ...stageSkillFiles]) validateSkill(file);

const stageSkillMap = new Map([
  ["discovery/SKILL.md", ["sf-router", "sf-intake", "sf-discovery"]],
  ["requirements/SKILL.md", ["sf-spec", "sf-requirements"]],
  ["design/SKILL.md", ["sf-spec", "sf-design"]],
  ["task-planning/SKILL.md", ["sf-spec", "sf-tasking"]],
  ["spec-review/SKILL.md", ["sf-review", "sf-spec-review"]],
  ["implementation/SKILL.md", ["sf-implement"]],
  ["code-review/SKILL.md", ["sf-review", "sf-code-review"]],
  ["verification/SKILL.md", ["sf-verify"]],
  ["ssot-sync/SKILL.md", ["sf-close"]],
  ["gap-report/SKILL.md", ["sf-spec", "sf-discovery"]],
  ["research/SKILL.md", ["sf-spec", "sf-discovery"]],
  ["status/SKILL.md", ["sf-doctor", "sf-work"]],
  ["steering/SKILL.md", ["sf-onboard", "sf-close"]],
]);

for (const [stageSkill, skills] of stageSkillMap) {
  const stageSkillPath = join(root, layout.stages, stageSkill);
  if (!existsSync(stageSkillPath)) errors.push(`missing stage skill: ${layout.stages}/${stageSkill}`);
  for (const skill of skills) {
    const skillPath = join(root, layout.kind === "source" ? "skills" : ".", skill, "SKILL.md");
    if (!existsSync(skillPath)) errors.push(`stage skill ${stageSkill} points to missing entry skill: ${skill}`);
  }
}

const stageReadme = join(root, layout.stages, "README.md");
if (!existsSync(stageReadme)) {
  errors.push(`missing ${layout.stages}/README.md`);
} else {
  const readme = readFileSync(stageReadme, "utf8");
  for (const [stageSkill] of stageSkillMap) {
    if (!readme.includes(stageSkill.split("/")[0])) errors.push(`stage README missing mapping for ${stageSkill}`);
  }
}

const rootSkill = join(root, layout.kind === "source" ? "skills/sf-router/SKILL.md" : "sf-router/SKILL.md");
if (existsSync(rootSkill)) {
  const rootContent = readFileSync(rootSkill, "utf8");
  for (const required of [
    "sf-onboard",
    "sf-intake",
    "sf-discovery",
    "sf-requirements",
    "sf-design",
    "sf-tasking",
    "sf-spec-review",
    "sf-implement",
    "sf-code-review",
    "sf-verify",
    "sf-close",
    "sf-doctor",
    "sf-work",
  ]) {
    if (!rootContent.includes(required)) errors.push(`${rootSkill}: missing route to ${required}`);
  }
}

if (errors.length > 0) {
  console.error("SpecForge skill validation failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SpecForge skill validation passed.");
console.log(`Checked ${entrySkillFiles.length} entry skills and ${stageSkillFiles.length} stage skills.`);
