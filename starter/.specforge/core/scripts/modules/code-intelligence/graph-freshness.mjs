import { spawnSync } from "node:child_process";

function run(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: options.timeout ?? 8000,
    input: options.input,
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    text: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim(),
  };
}

function commandExists(command) {
  const result = process.platform === "win32"
    ? run("where", [command], { timeout: 2000 })
    : run("sh", ["-lc", `command -v ${command}`], { timeout: 2000 });
  return result.ok && result.stdout.trim();
}

function parsePendingFiles(text) {
  const pending = [];
  const lines = String(text ?? "").split(/\r?\n/);
  let inPending = false;
  for (const line of lines) {
    if (/pending\s+sync|stale\s+files?/i.test(line)) {
      inPending = true;
      continue;
    }
    if (inPending && /^#+\s+/.test(line)) break;
    if (inPending) {
      const match = line.match(/[`"]?([A-Za-z0-9_./\\-]+\.[A-Za-z0-9]+)[`"]?/);
      if (match) pending.push(match[1].replaceAll("\\", "/"));
    }
  }
  return [...new Set(pending)];
}

function stripAnsi(text) {
  return String(text ?? "").replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "");
}

export function graphFreshness(options = {}) {
  const provider = options.provider ?? "codegraph";
  const checkedAt = new Date().toISOString();
  if (provider !== "codegraph") {
    return {
      provider,
      installed: false,
      mcp_configured: null,
      initialized: null,
      ready: false,
      status: "unsupported-provider",
      index_status: "unknown",
      sync_status: "unknown",
      pending_files: [],
      warnings: [`graph-freshness 当前只内置 CodeGraph CLI 检查：${provider}`],
      checked_at: checkedAt,
    };
  }

  const installed = Boolean(commandExists("codegraph"));
  if (!installed) {
    return {
      provider,
      installed: false,
      mcp_configured: null,
      initialized: false,
      ready: false,
      status: "missing",
      index_status: "missing",
      sync_status: "missing",
      pending_files: [],
      warnings: ["CodeGraph CLI 未安装；不能把图谱结果作为当前事实。"],
      checked_at: checkedAt,
    };
  }

  const status = run("codegraph", ["status"], { timeout: options.timeout ?? 8000 });
  const text = stripAnsi(status.text);
  const normalized = text.toLowerCase();
  const notInitialized = /not\s+initialized|no\s+codegraph|init\s+-?i|run\s+codegraph\s+init/.test(normalized);
  const pending = /pending\s+sync|needs?\s+sync|out\s+of\s+sync|stale/.test(normalized);
  const indexing = /indexing|syncing|initializ/.test(normalized) && !notInitialized;
  const ready = status.ok && !notInitialized && !pending && !indexing;
  const warnings = [];

  if (!status.ok && !notInitialized) warnings.push("CodeGraph status 检查失败；不要使用图谱结果写当前事实。");
  if (notInitialized) warnings.push("当前项目未初始化 CodeGraph；先运行 codegraph init 或 codegraph init -i。");
  if (pending) warnings.push("CodeGraph 存在 pending / stale / sync required；等待自动同步或运行 codegraph sync。");
  if (indexing) warnings.push("CodeGraph 正在 indexing / syncing；等待 ready 后再使用图谱事实。");

  return {
    provider,
    installed: true,
    mcp_configured: null,
    initialized: !notInitialized && status.ok,
    ready,
    status: ready ? "ready" : notInitialized ? "not_initialized" : pending ? "sync_required" : indexing ? "indexing" : "status_failed",
    index_status: ready ? "available" : notInitialized ? "missing" : indexing ? "building" : pending ? "stale" : "unknown",
    sync_status: ready ? "clean" : pending ? "pending" : indexing ? "running" : "unknown",
    pending_files: parsePendingFiles(text),
    status_excerpt: text.slice(0, 1600),
    warnings,
    checked_at: checkedAt,
  };
}

export function graphFreshnessMarkdown(result) {
  return `# 图谱新鲜度

- Provider：${result.provider}
- 可用：${result.ready ? "是" : "否"}
- 状态：${result.status}
- 同步状态：${result.sync_status}
- 待同步文件：${result.pending_files.length ? result.pending_files.join(", ") : "无"}

## 警告

${result.warnings.length ? result.warnings.map((item) => `- ${item}`).join("\n") : "- 无"}
`;
}

function option(args, name, fallback) {
  const index = args.indexOf(name);
  const value = index >= 0 ? args[index + 1] : "";
  return value && !value.startsWith("--") ? value : fallback;
}

function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const provider = option(args, "--provider", "codegraph");

  try {
    const result = graphFreshness({ provider });
    if (asJson) console.log(JSON.stringify({ graph_freshness: result }, null, 2));
    else console.log(graphFreshnessMarkdown(result));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (process.argv[1]?.replaceAll("\\", "/").endsWith("/graph-freshness.mjs")) {
  main();
}
