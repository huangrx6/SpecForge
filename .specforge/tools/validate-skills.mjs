import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = process.cwd();
const errors = [];

function listSkillFiles() {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(root, entry.name, "SKILL.md"))
    .filter((file) => existsSync(file))
    .filter((file) => basename(join(file, "..")) === "specforge" || basename(join(file, "..")).startsWith("specforge-"))
    .sort();
}

function parseFrontmatter(content, file) {
  if (!content.startsWith("---\n")) {
    errors.push(`${file}: missing YAML frontmatter`);
    return {};
  }

  const end = content.indexOf("\n---", 4);
  if (end === -1) {
    errors.push(`${file}: unclosed YAML frontmatter`);
    return {};
  }

  const block = content.slice(4, end).trim();
  const fields = {};
  for (const line of block.split("\n")) {
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

const files = listSkillFiles();
for (const file of files) validateSkill(file);

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

for (const file of files) {
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
console.log(`Checked ${files.length} root-level skills.`);
