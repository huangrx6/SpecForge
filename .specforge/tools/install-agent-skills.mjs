import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const allSkills = args.includes("--all");

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
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(root, name, "SKILL.md")))
    .filter((name) => allSkills || name === "specforge" || name.startsWith("specforge-"))
    .sort();
}

function copySkill(skillName, targetRoot) {
  const source = join(root, skillName);
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
    console.error("No root-level skills found. Expected directories like specforge/SKILL.md.");
    process.exit(1);
  }

  console.log(`SpecForge agent skill install ${apply ? "(apply)" : "(dry-run)"}`);
  console.log(`Skills: ${allSkills ? "all root SKILL.md directories" : "specforge + specforge-*"}`);
  console.log("");

  for (const targetName of targets) {
    const config = targetAliases[targetName];
    const destination = targetPath(targetName);
    console.log(`## ${config?.label ?? targetName}`);
    console.log(`Target: ${destination}`);

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
