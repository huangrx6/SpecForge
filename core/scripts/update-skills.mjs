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
  return content.replace(/\r\n/g, "\n").trimEnd() + "\n";
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

function sourceContent(skill) {
  return `${JSON.stringify(
    {
      id: skill.id,
      name: skill.name,
      role: skill.role,
      trust: skill.trust,
      risk: skill.risk,
      source: skill.source,
      trigger: skill.trigger,
      normalizeTo: skill.normalizeTo,
      updatedAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`;
}

function writeSnapshot(skill, content, sourceJson = sourceContent(skill), supportFiles = []) {
  const skillDir = join(skillsRoot, skill.id);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, "SKILL.md"), content, "utf8");
  for (const file of supportFiles) {
    validateSupportFilePath(skill, file.path);
    const target = join(skillDir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content, "utf8");
  }
  writeFileSync(join(skillDir, "SOURCE.json"), sourceJson, "utf8");
}

async function updateSkill(skill, checkOnly) {
  if (!skill.source?.rawUrl) throw new Error(`${skill.id}: registry 缺少 source.rawUrl。`);
  const content = normalize(await fetchText(skill.source.rawUrl));
  validateSkillContent(skill, content);

  const supportFiles = [];
  for (const file of skill.source.files ?? []) {
    validateSupportFilePath(skill, file.path);
    if (!file.rawUrl) throw new Error(`${skill.id}: ${file.path} 缺少 rawUrl。`);
    supportFiles.push({
      path: file.path,
      content: normalize(await fetchText(file.rawUrl)),
    });
  }

  const target = join(skillsRoot, skill.id, "SKILL.md");
  const current = existsSync(target) ? normalize(readFileSync(target, "utf8")) : null;
  const changed = current !== content;
  const supportChanged = supportFiles.some((file) => {
    const supportTarget = join(skillsRoot, skill.id, file.path);
    const supportCurrent = existsSync(supportTarget) ? normalize(readFileSync(supportTarget, "utf8")) : null;
    return supportCurrent !== file.content;
  });
  const sourceFile = join(skillsRoot, skill.id, "SOURCE.json");
  const currentSource = existsSync(sourceFile) ? readFileSync(sourceFile, "utf8") : null;
  const nextSource = sourceContent(skill);
  const sourceChanged =
    !currentSource ||
    JSON.stringify({ ...JSON.parse(currentSource), updatedAt: null }) !==
      JSON.stringify({ ...JSON.parse(nextSource), updatedAt: null });

  if (checkOnly) {
    console.log(`${changed || supportChanged || sourceChanged ? "有漂移" : "正常"} ${skill.id}`);
    return changed || supportChanged || sourceChanged;
  }

  if (changed || supportChanged || sourceChanged) writeSnapshot(skill, content, nextSource, supportFiles);
  console.log(
    `${changed || supportChanged ? "已更新" : sourceChanged ? "已刷新来源信息" : "无变化"} ${skill.id}`,
  );
  return changed || supportChanged || sourceChanged;
}

async function main() {
  const registry = readRegistry();

  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage());
    return;
  }

  if (args.includes("--list")) {
    for (const skill of registry.skills) {
      console.log(`${skill.id}\t${skill.role}\t${skill.source.url}`);
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
