import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function findPackageRoot(start) {
  let current = start;
  while (current !== dirname(current)) {
    if (existsSync(join(current, "package.json")) && existsSync(join(current, "agent-skills"))) return current;
    current = dirname(current);
  }
  return start;
}

const root = findPackageRoot(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const allSkills = args.includes("--all");

const targetAliases = {
  codex: {
    label: "Codex",
    userPath: join(homedir(), ".codex/skills"),
    projectPath: (projectRoot) => join(projectRoot, ".agents/skills"),
  },
  "claude-code": {
    label: "Claude Code",
    userPath: join(homedir(), ".claude/skills"),
    projectPath: (projectRoot) => join(projectRoot, ".claude/skills"),
  },
  "cc-switch": {
    label: "Claude Code / cc-switch",
    userPath: join(homedir(), ".cc-switch/skills"),
    projectPath: (projectRoot) => join(projectRoot, ".claude/skills"),
  },
  agents: {
    label: "Agents",
    userPath: join(homedir(), ".agents/skills"),
    projectPath: (projectRoot) => join(projectRoot, ".agents/skills"),
  },
  "trae-cn": {
    label: "Trae CN",
    userPath: join(homedir(), ".trae-cn/skills"),
    projectPath: (projectRoot) => join(projectRoot, ".trae/skills"),
  },
};

const legacySkillNames = [
  "specforge",
  "specforge-intake",
  "specforge-spec",
  "specforge-implement",
  "specforge-review",
  "specforge-verify",
  "specforge-close",
  "specforge-work",
  "specforge-doctor",
  "specforge-onboard",
];

function readOption(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}

function selectedTargets() {
  const raw = readOption("--target") ?? readOption("--targets") ?? "codex";
  if (raw === "all") return Object.keys(targetAliases);
  return raw.split(",").map((item) => item.trim()).filter(Boolean);
}

function installScope() {
  const raw = readOption("--scope") ?? "user";
  if (!["user", "project"].includes(raw)) {
    throw new Error(`Unknown scope "${raw}". Known scopes: user, project.`);
  }
  return raw;
}

function projectRoot() {
  return resolve(readOption("--project-dir") ?? ".");
}

function requestedSkills() {
  const values = [];
  const optionsWithValues = new Set(["--target", "--targets", "--path", "--scope", "--project-dir"]);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      if (optionsWithValues.has(arg)) i += 1;
      continue;
    }
    values.push(arg);
  }
  return values;
}

function validateOptions(targets) {
  const custom = readOption("--path");
  if (custom && targets.length !== 1) {
    throw new Error("Use --path with exactly one --target. Multiple targets need their standard directories.");
  }
}

function targetPath(name, scope) {
  const custom = readOption("--path");
  if (custom) return resolve(custom);
  const config = targetAliases[name];
  if (!config) {
    const known = Object.keys(targetAliases).join(", ");
    throw new Error(`Unknown target "${name}". Known targets: ${known}. Use --path with one known target for custom location.`);
  }
  if (scope === "project") return config.projectPath(projectRoot());
  return config.userPath;
}

function listSkills() {
  const skillsRoot = join(root, "agent-skills");
  const requested = requestedSkills();
  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(skillsRoot, name, "SKILL.md")))
    .filter((name) => {
      if (requested.length > 0) return requested.includes(name);
      return allSkills || name.startsWith("sf-");
    })
    .sort();
}

function copySkill(skillName, targetRoot) {
  const source = join(root, "agent-skills", skillName);
  const target = join(targetRoot, skillName);
  if (!existsSync(join(source, "SKILL.md"))) {
    throw new Error(`Missing source skill: ${source}/SKILL.md`);
  }

  const action = existsSync(target) ? "update" : "create";
  if (apply) {
    mkdirSync(targetRoot, { recursive: true });
    rmSync(target, { recursive: true, force: true });
    cpSync(source, target, { recursive: true });
  }
  return { action, source, target };
}

function legacySkillsIn(targetRoot) {
  if (!existsSync(targetRoot)) return [];
  return legacySkillNames.filter((name) => existsSync(join(targetRoot, name, "SKILL.md")));
}

function main() {
  const skills = listSkills();
  const targets = selectedTargets();
  const scope = installScope();
  const project = projectRoot();
  validateOptions(targets);

  if (skills.length === 0) {
    console.error("No skills found. Expected directories like agent-skills/sf-router/SKILL.md.");
    process.exit(1);
  }

  console.log(`SpecForge agent skill install ${apply ? "(apply)" : "(dry-run)"}`);
  console.log(`Skills: ${allSkills ? "all agent-skills/* SKILL.md directories" : "sf-router + sf-*"}`);
  console.log(`Scope: ${readOption("--path") ? "custom path" : scope}`);
  if (scope === "project" && !readOption("--path")) console.log(`Project root: ${project}`);
  console.log("");

  const handledDestinations = new Set();
  for (const targetName of targets) {
    const config = targetAliases[targetName];
    const destination = targetPath(targetName, scope);
    const normalizedDestination = resolve(destination);
    console.log(`## ${config?.label ?? targetName}`);
    console.log(`Target: ${destination}`);

    if (handledDestinations.has(normalizedDestination)) {
      console.log("- skip: target directory already handled by another selected target");
      console.log("");
      continue;
    }
    handledDestinations.add(normalizedDestination);

    const legacy = legacySkillsIn(destination);
    if (legacy.length > 0) {
      console.log("- migration warning: legacy SpecForge skills detected");
      for (const name of legacy) console.log(`  - ${name}`);
      console.log("  These 0.2-style entry skills are replaced by sf-router + sf-* skills.");
      console.log("  After confirming the new sf-* install works, remove the legacy directories from this target.");
    }

    for (const skill of skills) {
      const result = copySkill(skill, destination);
      console.log(`- ${result.action}: ${skill}`);
      console.log(`  ${result.target}`);
    }
    console.log("");
  }

  if (!apply) {
    console.log("Dry run only. Add --apply to write files.");
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
