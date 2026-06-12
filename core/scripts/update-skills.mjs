import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { get as httpGet } from "node:http";
import { get as httpsGet } from "node:https";
import { dirname, join } from "node:path";
import { layout } from "./lib/specforge.mjs";

const root = process.cwd();
const skillsRoot = join(root, layout.runtime, "skills");
const registryPath = join(skillsRoot, "registry.json");
const args = process.argv.slice(2);

function usage() {
  return [
    "用法：",
    `  node ${layout.tools}/update-skills.mjs --all`,
    `  node ${layout.tools}/update-skills.mjs --skill pencil`,
    `  node ${layout.tools}/update-skills.mjs --check --all`,
    `  node ${layout.tools}/update-skills.mjs --list`,
  ].join("\n");
}

function readRegistry() {
  if (!existsSync(registryPath)) throw new Error(`缺少内置 skill registry：${registryPath}`);
  const registry = JSON.parse(readFileSync(registryPath, "utf8"));
  if (!Array.isArray(registry.skills)) throw new Error("内置 skill registry 必须包含 skills 数组。");
  return registry;
}

function optionValues(name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === name) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${name} 缺少参数值`);
      values.push(value);
      index += 1;
    }
  }
  return values;
}

function positionalIds() {
  const ids = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--skill") {
      index += 1;
      continue;
    }
    if (!arg.startsWith("--")) ids.push(arg);
  }
  return ids;
}

function normalize(content) {
  return content.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trimEnd() + "\n";
}

function adaptSnapshotContent(skill, content) {
  if (skill.id === "code-reviewer" || skill.id === "ux-designer") {
    return content.replace(
      /1\. \*\*Review \[AGENTS\.md\]\(AGENTS\.md\)\*\* for a complete compilation of all rules with examples/,
      skill.id === "code-reviewer"
        ? "1. **Start from this file** to decide whether the review needs security, performance, correctness, or maintainability depth"
        : "1. **Start from this file** to decide whether the task needs research, IA, interaction, accessibility, or visual depth",
    ).replace(
      "2. **Reference specific rules** from `rules/` directory for deep dives",
      skill.id === "code-reviewer"
        ? "2. **Reference only the specific rules** from `rules/` that match the current risk"
        : "2. **Reference only the specific rules** from `rules/` that match the current design risk",
    );
  }

  if (skill.id === "pencil") {
    return content
      .replace(
        /### Rule 6: Always Load the `frontend-design` Skill[\s\S]*?This applies to both directions:\n- \*\*Pencil design tasks\*\*: Use the skill's aesthetic guidelines to inform layout, typography, color, and composition choices in the \.pen file\n- \*\*Code generation from Pencil\*\*: Use the skill's guidelines to ensure the generated code includes distinctive typography, intentional color themes, motion\/animations, and polished visual details — not just a mechanical translation of the design tree/,
        [
          "### Rule 6: Align With Confirmed SpecForge UI Direction",
          "",
          "**NEVER design in Pencil or generate code from Pencil before reading the confirmed UI direction and SpecForge design standards.**",
          "",
          "SpecForge does not vendor the upstream `frontend-design` skill. Instead, you MUST:",
          "1. Read the confirmed UI direction from `brainstorm.md`, `brief.md`, or `ui-design.md`",
          "2. Read `.specforge/core/standards/design.md` and the active `sf-ui-design` guidance",
          "3. If the UI direction is still unconfirmed, stop and route back to `sf-brainstorm`",
          "4. Apply the confirmed typography, color, density, motion, and interaction choices when designing in Pencil or generating code",
          "5. Never produce generic AI aesthetics or invent a new visual direction without user confirmation",
          "",
          "### Rule 7: Persist and Re-read SpecForge `.pen` Handoffs",
          "",
          "**NEVER treat a Pencil design as complete until the target `.pen` file has been saved and re-read successfully.**",
          "",
          "For SpecForge UI design handoffs, you MUST:",
          "1. Write the design to the target `01-spec/ui-mockup.pen` file path",
          "2. After every `pencil_batch_design`, perform the available save / persistence action; if no standalone save tool exists, immediately re-open or re-read the target file",
          "3. Use `pencil_open_document`, `pencil_get_editor_state`, or `pencil_batch_get` to confirm the saved file contains at least one non-empty screen / frame / artboard",
          "4. Only export screenshots after the saved file has passed re-read verification",
          "5. If the file is still empty or cannot be re-read after two attempts, stop and record a Pencil persistence blocker instead of handing off an empty `.pen`",
        ].join("\n"),
      )
      .replaceAll("Load the `frontend-design` skill", "Read the confirmed SpecForge UI direction")
      .replaceAll("Load `frontend-design` skill", "Read confirmed SpecForge UI direction")
      .replaceAll("load the `frontend-design` skill", "read the confirmed SpecForge UI direction")
      .replaceAll("Apply `frontend-design` guidelines", "Apply SpecForge UI design guidance")
      .replaceAll("Follow `frontend-design` guidelines", "Follow SpecForge UI design guidance")
      .replaceAll("Skipping `frontend-design` skill", "Skipping confirmed UI direction")
      .replaceAll("Always load it before designing in Pencil or generating code", "Always read confirmed UI direction before designing in Pencil or generating code")
      .replaceAll("the `frontend-design` skill", "SpecForge UI design guidance")
      .replaceAll("frontend-design guidelines", "SpecForge UI design guidance")
      .replaceAll("frontend-design", "SpecForge UI design guidance")
      .replaceAll("upstream `SpecForge UI design guidance` skill", "upstream `frontend-design` skill")
      .replaceAll(
        "9. pencil_get_screenshot          -> Verify each section visually\n10. pencil_snapshot_layout        -> Check for layout problems",
        "9. Re-open / re-read target .pen   -> Confirm saved file is non-empty\n10. pencil_get_screenshot         -> Verify each section visually\n11. pencil_snapshot_layout        -> Check for layout problems",
      )
      .replaceAll(
        "| Skipping screenshots | Call `pencil_get_screenshot` after every section |",
        "| Skipping screenshots | Call `pencil_get_screenshot` after every section |\n| Assuming `.pen` saved because a design tool call succeeded | Re-open or re-read the target `.pen` and confirm it contains a non-empty screen before screenshots or handoff |",
      )
      .replaceAll("## Step 1: Load the `SpecForge UI design guidance` Skill", "## Step 1: Read Confirmed SpecForge UI Direction")
      .replaceAll(
        "**MANDATORY.** Before any design or code generation work, load the `SpecForge UI design guidance` skill.",
        "**MANDATORY.** Before any design or code generation work, read the confirmed UI direction and SpecForge design standards.",
      )
      .replaceAll(
        "- Load the `SpecForge UI design guidance` skill and apply its aesthetic guidelines to the generated code",
        "- Read the confirmed SpecForge UI direction and apply it to the generated code",
      )
      .replaceAll(
        "- Skip the `SpecForge UI design guidance` skill — it is mandatory for both design and code generation",
        "- Skip the confirmed UI direction — it is mandatory for both design and code generation",
      );
  }

  return content;
}

function fetchText(url, redirects = 0) {
  if (redirects > 5) return Promise.reject(new Error(`获取 ${url} 时重定向次数过多`));
  return new Promise((resolve, reject) => {
    const client = url.startsWith("http://") ? httpGet : httpsGet;
    const request = client(
      url,
      {
        headers: {
          "user-agent": "specforge-skill-updater",
          accept: "text/plain,text/markdown,*/*",
        },
      },
      (response) => {
        const location = response.headers.location;
        if ([301, 302, 303, 307, 308].includes(response.statusCode) && location) {
          response.resume();
          const nextUrl = new URL(location, url).toString();
          resolve(fetchText(nextUrl, redirects + 1));
          return;
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          response.resume();
          reject(new Error(`获取 ${url} 时返回 HTTP ${response.statusCode}`));
          return;
        }

        response.setEncoding("utf8");
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => resolve(body));
      },
    );

    request.setTimeout(30000, () => {
      request.destroy(new Error(`获取 ${url} 超时`));
    });
    request.on("error", reject);
  });
}

function validateSkillContent(skill, content) {
  if (!content.startsWith("---")) throw new Error(`${skill.id}: 下载内容缺少 YAML frontmatter。`);
  const namePattern = new RegExp(`\\bname:\\s*["']?${skill.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']?\\b`);
  if (!namePattern.test(content)) throw new Error(`${skill.id}: 下载的 skill name 与 registry 不一致。`);
}

function validateSupportFilePath(skill, path) {
  const parts = path.split(/[\\/]/);
  if (!path || path.startsWith("/") || parts.includes("..")) {
    throw new Error(`${skill.id}: source.files 包含不安全路径：${path}`);
  }
}

function skillLocalPath(skill) {
  const path = skill.localPath ?? skill.id;
  validateSupportFilePath(skill, path);
  return path;
}

function selectSkills(registry) {
  if (args.includes("--list")) return [];
  const ids = [...optionValues("--skill"), ...positionalIds()];
  if (args.includes("--all") || ids.length === 0) return registry.skills;

  const selected = [];
  const known = new Map(registry.skills.map((skill) => [skill.id, skill]));
  for (const id of ids) {
    const skill = known.get(id);
    if (!skill) throw new Error(`未知内置 skill：${id}`);
    selected.push(skill);
  }
  return selected;
}

function writeSnapshot(skill, content, supportFiles = []) {
  const skillDir = join(skillsRoot, skillLocalPath(skill));
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, "SKILL.md"), content, "utf8");
  for (const file of supportFiles) {
    validateSupportFilePath(skill, file.path);
    const target = join(skillDir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content, "utf8");
  }
}

async function updateSkill(skill, checkOnly) {
  if (skill.source?.type === "local-authored") {
    console.log(`跳过本地维护 skill ${skill.id}`);
    return false;
  }
  if (!skill.source?.rawUrl) throw new Error(`${skill.id}: registry 缺少 source.rawUrl。`);
  const content = adaptSnapshotContent(skill, normalize(await fetchText(skill.source.rawUrl)));
  validateSkillContent(skill, content);

  const supportFiles = [];
  for (const file of skill.source.files ?? []) {
    validateSupportFilePath(skill, file.path);
    if (!file.rawUrl) throw new Error(`${skill.id}: ${file.path} 缺少 rawUrl。`);
    supportFiles.push({
      path: file.path,
      content: adaptSnapshotContent(skill, normalize(await fetchText(file.rawUrl))),
    });
  }

  const target = join(skillsRoot, skillLocalPath(skill), "SKILL.md");
  const current = existsSync(target) ? normalize(readFileSync(target, "utf8")) : null;
  const changed = current !== content;
  const supportChanged = supportFiles.some((file) => {
    const supportTarget = join(skillsRoot, skillLocalPath(skill), file.path);
    const supportCurrent = existsSync(supportTarget) ? normalize(readFileSync(supportTarget, "utf8")) : null;
    return supportCurrent !== file.content;
  });
  if (checkOnly) {
    console.log(`${changed || supportChanged ? "有漂移" : "正常"} ${skill.id}`);
    return changed || supportChanged;
  }

  if (changed || supportChanged) writeSnapshot(skill, content, supportFiles);
  console.log(`${changed || supportChanged ? "已更新" : "无变化"} ${skill.id}`);
  return changed || supportChanged;
}

async function main() {
  const registry = readRegistry();

  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    return;
  }

  if (args.includes("--list")) {
    for (const skill of registry.skills) {
      console.log(`${skill.id}\t${skill.localPath ?? skill.id}\t${skill.role}\t${skill.source.url}`);
    }
    return;
  }

  const selected = selectSkills(registry);
  const checkOnly = args.includes("--check");
  if (selected.length === 0) {
    console.log(usage());
    return;
  }

  mkdirSync(dirname(registryPath), { recursive: true });
  let driftCount = 0;
  for (const skill of selected) {
    const changed = await updateSkill(skill, checkOnly);
    if (changed) driftCount += 1;
  }

  if (checkOnly && driftCount > 0) {
    console.error(`${driftCount} 个内置 skill 快照存在漂移。`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
