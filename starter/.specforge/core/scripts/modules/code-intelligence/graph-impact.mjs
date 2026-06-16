import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { graphFreshness } from "./graph-freshness.mjs";

function run(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: options.timeout ?? 12000,
    input: options.input,
  });
  return {
    ok: result.status === 0,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    text: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim(),
  };
}

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function splitFiles(value = "") {
  return uniq(String(value)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean));
}

function gitChangedFiles() {
  const result = run("git", ["diff", "--name-only"], { timeout: 5000 });
  return result.ok ? splitFiles(result.stdout) : [];
}

function walkFiles(start, out = []) {
  if (!existsSync(start)) return out;
  try {
    for (const entry of readdirSync(start, { withFileTypes: true })) {
      const child = join(start, entry.name);
      if (entry.isDirectory()) walkFiles(child, out);
      else if (entry.isFile()) out.push(child.replaceAll("\\", "/"));
    }
  } catch {
    // Fallback candidates are best-effort only.
  }
  return out;
}

function relatedTestCandidates(file) {
  const dir = dirname(file);
  const base = file.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
  const candidates = [];
  const roots = ["tests", "test", "__tests__", "spec", "e2e", dir];
  for (const root of uniq(roots)) {
    for (const path of walkFiles(root)) {
      if (!/\.(test|spec|e2e)\.[A-Za-z0-9]+$/.test(path) && !/(tests?|spec|e2e)/i.test(path)) continue;
      if (path.includes(base) || path.includes(dir.split("/").pop() ?? "")) candidates.push(path);
    }
  }
  return candidates;
}

function codegraphAffected(files) {
  if (!files.length) return null;
  const result = run("codegraph", ["affected", "--stdin", "--json"], {
    input: `${files.join("\n")}\n`,
    timeout: 20000,
  });
  if (!result.ok || !result.stdout.trim()) return null;
  try {
    return JSON.parse(result.stdout);
  } catch {
    return { raw: result.stdout };
  }
}

function extractArray(payload, keys) {
  for (const key of keys) {
    const value = payload?.[key];
    if (Array.isArray(value)) return value.map((item) => typeof item === "string" ? item : item.path ?? item.name ?? item.id ?? item.symbol).filter(Boolean);
  }
  return [];
}

export function graphImpact(options = {}) {
  const changedFiles = options.changedFiles?.length ? options.changedFiles : gitChangedFiles();
  const freshness = graphFreshness({ provider: options.provider ?? "codegraph" });
  const notes = [];
  let providerPayload = null;
  let fallbackUsed = true;

  if (freshness.ready && changedFiles.length) {
    providerPayload = codegraphAffected(changedFiles);
    if (providerPayload) fallbackUsed = false;
    else notes.push("CodeGraph ready，但 affected 查询失败；使用低置信 fallback。");
  } else if (!freshness.ready) {
    notes.push("CodeGraph 未 ready；使用 changed files 和测试命名约定生成低置信候选。");
  }

  const fallbackTests = uniq(changedFiles.flatMap((file) => relatedTestCandidates(file))).slice(0, 80);
  const affectedTests = uniq([
    ...extractArray(providerPayload, ["affected_tests", "tests", "test_files"]),
    ...fallbackTests,
  ]);
  const affectedModules = uniq([
    ...extractArray(providerPayload, ["affected_modules", "modules"]),
    ...changedFiles.map((file) => file.split("/").slice(0, 2).join("/")),
  ]);
  const affectedSymbols = uniq(extractArray(providerPayload, ["affected_symbols", "symbols"]));

  return {
    changed_files: changedFiles,
    affected_modules: affectedModules,
    affected_symbols: affectedSymbols,
    affected_tests: affectedTests,
    graph_facts: [],
    fallback_used: fallbackUsed,
    confidence: fallbackUsed ? "low" : "medium",
    provider: freshness.provider,
    freshness,
    checked_at: new Date().toISOString(),
    notes,
  };
}

export function graphImpactMarkdown(result) {
  return `# 图谱影响面

- Provider：${result.provider}
- 置信度：${result.confidence}
- 使用 fallback：${result.fallback_used ? "是" : "否"}

## 变更文件

${result.changed_files.length ? result.changed_files.map((item) => `- \`${item}\``).join("\n") : "- 无"}

## 受影响测试

${result.affected_tests.length ? result.affected_tests.map((item) => `- \`${item}\``).join("\n") : "- 无"}

## 说明

${result.notes.length ? result.notes.map((item) => `- ${item}`).join("\n") : "- 无"}
`;
}

function option(args, name) {
  const index = args.indexOf(name);
  const value = args[index + 1];
  return index === -1 || !value || value.startsWith("--") ? null : value;
}

function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const changedFiles = option(args, "--changed-files")
    ? option(args, "--changed-files").split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
    : [];

  try {
    const result = graphImpact({ changedFiles });
    if (asJson) console.log(JSON.stringify({ graph_impact: result }, null, 2));
    else console.log(graphImpactMarkdown(result));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (process.argv[1]?.replaceAll("\\", "/").endsWith("/graph-impact.mjs")) {
  main();
}
