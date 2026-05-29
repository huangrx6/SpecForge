import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, relative as pathRelative } from "node:path";
import { layout } from "./lib/specforge.mjs";

const root = process.cwd();
const errors = [];

function relative(path) {
  return path.startsWith(root) ? path.slice(root.length + 1) : path;
}

function parseFrontmatter(content, file) {
  const frontmatterStart = content.match(/^\uFEFF?---\r?\n/);
  if (!frontmatterStart) {
    errors.push(`${relative(file)}: missing YAML frontmatter`);
    return {};
  }

  const end = content.search(/\r?\n---(?:\r?\n|$)/);
  if (end === -1) {
    errors.push(`${relative(file)}: unclosed YAML frontmatter`);
    return {};
  }

  const block = content.slice(frontmatterStart[0].length, end).trim();
  const fields = {};
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) fields[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return fields;
}

// ----------------------------------------------------
// INTERNAL SKILLS VALIDATION
// ----------------------------------------------------
function runInternalValidation() {
  function listEntrySkillFiles() {
    const skillsRoot = join(root, layout.skills);
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

  function validateSkill(file) {
    const content = readFileSync(file, "utf8");
    const folderName = basename(join(file, ".."));
    const frontmatter = parseFrontmatter(content, file);

    if (!frontmatter.name) errors.push(`${relative(file)}: missing frontmatter name`);
    if (!frontmatter.description) errors.push(`${relative(file)}: missing frontmatter description`);
    if (frontmatter.name && frontmatter.name !== folderName) {
      errors.push(`${relative(file)}: frontmatter name "${frontmatter.name}" does not match folder "${folderName}"`);
    }
    if (frontmatter.description && frontmatter.description.length < 24) {
      errors.push(`${relative(file)}: description is too short`);
    }
    if (!content.match(/^#\s+/m)) errors.push(`${relative(file)}: missing top-level heading`);
    if (content.length > 18000) errors.push(`${relative(file)}: SKILL.md is too large; move details to references`);
    if (/npm\s+run/.test(content)) {
      errors.push(`${relative(file)}: use direct .specforge/core/scripts commands instead of npm run`);
    }
  }

  const entrySkillFiles = listEntrySkillFiles();
  const stageSkillFiles = listStageSkillFiles();
  for (const file of [...entrySkillFiles, ...stageSkillFiles]) validateSkill(file);

  const stageSkillMap = new Map([
    ["brainstorm/SKILL.md", ["sf-brainstorm", "sf-intake", "sf-prd", "sf-requirements", "sf-ui-design", "sf-tech-design"]],
    ["discovery/SKILL.md", ["sf-router", "sf-intake", "sf-discovery"]],
    ["requirements/SKILL.md", ["sf-requirements"]],
    ["ui-design/SKILL.md", ["sf-ui-design"]],
    ["technical-design/SKILL.md", ["sf-tech-design"]],
    ["task-planning/SKILL.md", ["sf-tasking"]],
    ["spec-review/SKILL.md", ["sf-spec-review"]],
    ["implementation/SKILL.md", ["sf-implement"]],
    ["code-review/SKILL.md", ["sf-code-review"]],
    ["verification/SKILL.md", ["sf-verify"]],
    ["wiki-sync/SKILL.md", ["sf-wiki", "sf-close"]],
    ["closure/SKILL.md", ["sf-close"]],
    ["gap-report/SKILL.md", ["sf-discovery"]],
    ["research/SKILL.md", ["sf-discovery"]],
    ["status/SKILL.md", ["sf-doctor", "sf-work"]],
    ["steering/SKILL.md", ["sf-steering", "sf-onboard", "sf-intake", "sf-wiki", "sf-close"]],
  ]);

  for (const [stageSkill, skills] of stageSkillMap) {
    const stageSkillPath = join(root, layout.stages, stageSkill);
    if (!existsSync(stageSkillPath)) errors.push(`missing stage skill: ${layout.stages}/${stageSkill}`);
    for (const skill of skills) {
      const skillPath = join(root, layout.skills, skill, "SKILL.md");
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

  const rootSkill = join(root, layout.skills, "sf-router/SKILL.md");
  if (existsSync(rootSkill)) {
    const rootContent = readFileSync(rootSkill, "utf8");
    for (const required of [
      "sf-onboard",
      "sf-steering",
      "sf-intake",
      "sf-brainstorm",
      "sf-discovery",
      "sf-prd",
      "sf-requirements",
      "sf-ui-design",
      "sf-tech-design",
      "sf-tasking",
      "sf-spec-review",
      "sf-implement",
      "sf-code-review",
      "sf-verify",
      "sf-wiki",
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
}

// ----------------------------------------------------
// EXTERNAL SKILLS VALIDATION
// ----------------------------------------------------
function runExternalValidation() {
  const skillsRoot = join(root, layout.runtime, "skills");
  const registryPath = join(skillsRoot, "registry.json");
  const orchestrationPath = join(skillsRoot, "ORCHESTRATION.md");
  const starterSkillsRoot = join(root, "starter/.specforge/core/skills");

  function safeJson(path, label) {
    try {
      return JSON.parse(readFileSync(path, "utf8"));
    } catch (error) {
      errors.push(`${label}: invalid JSON (${error.message})`);
      return null;
    }
  }

  function isSafeSupportPath(path) {
    const parts = String(path ?? "").split(/[\\/]/);
    return path && !path.startsWith("/") && !parts.includes("..");
  }

  function skillLocalPath(skill) {
    const localPath = skill?.localPath ?? skill?.id;
    if (!isSafeSupportPath(localPath)) {
      errors.push(`${skill?.id ?? "(missing id)"}: unsafe localPath ${localPath}`);
      return skill?.id ?? "";
    }
    return localPath;
  }

  function validateRequiredRegistryFields(skill, seenIds) {
    if (!skill || typeof skill !== "object") {
      errors.push("registry contains a non-object skill entry");
      return;
    }

    if (!skill.id) errors.push("registry skill entry missing id");
    if (skill.id && !/^[a-z0-9][a-z0-9-]*$/.test(skill.id)) {
      errors.push(`${skill.id}: id must use lowercase kebab-case`);
    }
    if (skill.id && seenIds.has(skill.id)) errors.push(`${skill.id}: duplicate registry id`);
    if (skill.id) seenIds.add(skill.id);

    for (const field of ["name", "role", "trust", "risk", "trigger", "category", "localPath"]) {
      if (!skill[field]) errors.push(`${skill.id ?? "(missing id)"}: registry missing ${field}`);
    }
    if (skill.category && !/^[a-z0-9][a-z0-9-]*$/.test(skill.category)) {
      errors.push(`${skill.id}: category must use lowercase kebab-case`);
    }
    if (!Array.isArray(skill.normalizeTo) || skill.normalizeTo.length === 0) {
      errors.push(`${skill.id}: registry normalizeTo must be a non-empty array`);
    }
    if (!Array.isArray(skill.doNotUseFor) || skill.doNotUseFor.length === 0) {
      errors.push(`${skill.id}: registry doNotUseFor must be a non-empty array`);
    }
    if (!skill.source?.rawUrl) errors.push(`${skill.id}: registry source.rawUrl is required`);
    if (!skill.source?.url) errors.push(`${skill.id}: registry source.url is required`);
    if (!skill.source?.repo) errors.push(`${skill.id}: registry source.repo is required`);
    if (!skill.source?.path) errors.push(`${skill.id}: registry source.path is required`);
  }

  function validateSkillSnapshot(skill, baseDir) {
    const skillDir = join(baseDir, skillLocalPath(skill));
    const skillPath = join(skillDir, "SKILL.md");

    if (!existsSync(skillDir)) {
      errors.push(`${skill.id}: missing skill directory ${relative(skillDir)}`);
      return [];
    }
    if (!existsSync(skillPath)) {
      errors.push(`${skill.id}: missing SKILL.md`);
    } else {
      const content = readFileSync(skillPath, "utf8");
      const frontmatter = parseFrontmatter(content, skillPath);
      if (frontmatter.name !== skill.name) {
        errors.push(`${skill.id}: SKILL.md frontmatter name "${frontmatter.name ?? "missing"}" does not match registry "${skill.name}"`);
      }
      if (!frontmatter.description) errors.push(`${skill.id}: SKILL.md missing description`);
    }

    const checkedFiles = ["SKILL.md"];
    for (const file of skill.source?.files ?? []) {
      if (!isSafeSupportPath(file.path)) {
        errors.push(`${skill.id}: unsafe support file path ${file.path}`);
        continue;
      }
      if (!file.rawUrl) errors.push(`${skill.id}: support file ${file.path} missing rawUrl`);
      const supportPath = join(skillDir, file.path);
      checkedFiles.push(file.path);
      if (!existsSync(supportPath)) errors.push(`${skill.id}: missing support file ${relative(supportPath)}`);
    }

    return checkedFiles;
  }

  function validateNoUnregisteredSkillDirs(registryIds) {
    if (!existsSync(skillsRoot)) return;

    function walk(current) {
      for (const entry of readdirSync(current, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const directory = join(current, entry.name);
        const skillPath = join(directory, "SKILL.md");
        if (existsSync(skillPath)) {
          const localPath = pathRelative(skillsRoot, directory).replaceAll("\\", "/");
          if (!registryIds.has(localPath)) {
            errors.push(`unregistered external skill directory: ${relative(directory)}`);
          }
          continue;
        }
        walk(directory);
      }
    }

    walk(skillsRoot);
  }

  function read(path) {
    return readFileSync(path, "utf8");
  }

  function validateStarterMirror(skill, checkedFiles) {
    if (layout.kind !== "source" || !existsSync(starterSkillsRoot)) return;

    for (const file of checkedFiles) {
      const sourcePath = join(skillsRoot, skillLocalPath(skill), file);
      const starterPath = join(starterSkillsRoot, skillLocalPath(skill), file);
      if (!existsSync(starterPath)) {
        errors.push(`${skill.id}: starter missing ${relative(starterPath)}`);
        continue;
      }
      if (existsSync(sourcePath) && read(sourcePath) !== read(starterPath)) {
        errors.push(`${skill.id}: starter mirror differs for ${file}`);
      }
    }
  }

  function validateStarterFileMirror(fileName) {
    if (layout.kind !== "source" || !existsSync(starterSkillsRoot)) return;

    const sourcePath = join(skillsRoot, fileName);
    const starterPath = join(starterSkillsRoot, fileName);
    if (!existsSync(starterPath)) {
      errors.push(`starter missing ${relative(starterPath)}`);
      return;
    }
    if (existsSync(sourcePath) && read(sourcePath) !== read(starterPath)) {
      errors.push(`starter mirror differs for ${fileName}`);
    }
  }

  function validateOrchestrationCoverage(skills) {
    if (!existsSync(orchestrationPath)) {
      errors.push(`missing external skill orchestration guide: ${relative(orchestrationPath)}`);
      return;
    }

    const content = readFileSync(orchestrationPath, "utf8");
    for (const skill of skills) {
      if (!skill?.id) continue;
      if (!content.includes(`\`${skill.id}\``)) {
        errors.push(`${skill.id}: missing from ORCHESTRATION.md`);
      }
    }

    validateStarterFileMirror("ORCHESTRATION.md");
  }

  if (!existsSync(registryPath)) {
    errors.push(`missing external skill registry: ${relative(registryPath)}`);
  } else {
    const registry = safeJson(registryPath, relative(registryPath));
    if (registry) {
      if (!Array.isArray(registry.skills)) {
        errors.push("external skill registry must contain a skills array");
      } else {
        const seenIds = new Set();
        const seenLocalPaths = new Set();
        validateOrchestrationCoverage(registry.skills);
        for (const skill of registry.skills) {
          validateRequiredRegistryFields(skill, seenIds);
          const localPath = skillLocalPath(skill);
          if (localPath && seenLocalPaths.has(localPath)) errors.push(`${skill.id}: duplicate registry localPath ${localPath}`);
          if (localPath) seenLocalPaths.add(localPath);
          if (!skill?.id) continue;
          const checkedFiles = validateSkillSnapshot(skill, skillsRoot);
          validateStarterMirror(skill, checkedFiles);
        }
        validateNoUnregisteredSkillDirs(seenLocalPaths);

        if (errors.length === 0) {
          const declaredSupportCount = registry.skills.reduce(
            (count, skill) => count + (skill.source?.files?.length ?? 0),
            0,
          );
          console.log("SpecForge external skill validation passed.");
          console.log(`Checked ${registry.skills.length} external skills and ${declaredSupportCount} declared support files.`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error("SpecForge external skill validation failed.");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
}

// ----------------------------------------------------
// MAIN ENTRY
// ----------------------------------------------------
const isExternal = process.argv.includes("--external") || process.argv.includes("-e");
if (isExternal) {
  runExternalValidation();
} else {
  runInternalValidation();
}
