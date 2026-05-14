import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function findPackageRoot(start) {
  let current = start;
  while (current !== dirname(current)) {
    if (existsSync(join(current, "package.json")) && existsSync(join(current, "skills"))) return current;
    current = dirname(current);
  }
  return start;
}

const root = findPackageRoot(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const allSkills = args.includes("--all");
const pruneLegacy = args.includes("--prune-legacy");

const legacySkillNames = [
  "sf",
  "sf-design",
  "sf-review",
  "sf-spec",
  "specforge",
  "specforge-close",
  "specforge-doctor",
  "specforge-implement",
  "specforge-intake",
  "specforge-onboard",
  "specforge-review",
  "specforge-spec",
  "specforge-verify",
  "specforge-work",
];

const targetAliases = {
  codex: {
    label: "Codex",
    path: join(homedir(), ".codex/skills"),
  },
  "claude-code": {
    label: "Claude Code",
    path: join(homedir(), ".claude/skills"),
  },
  "cc-switch": {
    label: "Claude Code / cc-switch",
    path: join(homedir(), ".cc-switch/skills"),
  },
  agents: {
    label: "Agents",
    path: join(homedir(), ".agents/skills"),
  },
};

function readOption(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}

function selectedTargets() {
  const raw = readOption("--target") ?? readOption("--targets") ?? "codex";
  if (raw === "all") return Object.keys(targetAliases);
  return raw.split(",").map((item) => item.trim()).filter(Boolean);
}

function requestedSkills() {
  const values = [];
  const optionsWithValues = new Set(["--target", "--targets", "--path"]);
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

function targetPath(name) {
  const custom = readOption("--path");
  if (custom && selectedTargets().length === 1) return resolve(custom);
  const config = targetAliases[name];
  if (!config) {
    const known = Object.keys(targetAliases).join(", ");
    throw new Error(`Unknown target "${name}". Known targets: ${known}. Use --path with one known target for custom location.`);
  }
  return config.path;
}

function listSkills() {
  const skillsRoot = join(root, "skills");
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

function pruneLegacySkills(targetRoot) {
  const removed = [];
  for (const skillName of legacySkillNames) {
    const target = join(targetRoot, skillName);
    if (!existsSync(target)) continue;
    if (apply) rmSync(target, { recursive: true, force: true });
    removed.push({ skillName, target });
  }
  return removed;
}

function copySkill(skillName, targetRoot) {
  const source = join(root, "skills", skillName);
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

function main() {
  const skills = listSkills();
  const targets = selectedTargets();

  if (skills.length === 0) {
    console.error("No skills found. Expected directories like skills/sf-router/SKILL.md.");
    process.exit(1);
  }

  console.log(`SpecForge agent skill install ${apply ? "(apply)" : "(dry-run)"}`);
  console.log(`Skills: ${allSkills ? "all skills/* SKILL.md directories" : "sf-router + sf-*"}`);
  console.log(`Prune legacy: ${pruneLegacy ? "yes" : "no"}`);
  console.log("");

  for (const targetName of targets) {
    const config = targetAliases[targetName];
    const destination = targetPath(targetName);
    console.log(`## ${config?.label ?? targetName}`);
    console.log(`Target: ${destination}`);

    if (pruneLegacy) {
      for (const item of pruneLegacySkills(destination)) {
        console.log(`- ${apply ? "remove" : "would remove"} legacy: ${item.skillName}`);
        console.log(`  ${item.target}`);
      }
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

main();
