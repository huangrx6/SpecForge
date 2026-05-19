import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const scriptDir = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const requestedProvider = option("--provider", "auto");

function option(name, fallback) {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
}

function commandPath(commands) {
  for (const command of commands) {
    const result = spawnSync("sh", ["-lc", `command -v ${command}`], {
      encoding: "utf8",
      timeout: 2000,
    });
    if (result.status === 0 && result.stdout.trim()) return { command, path: result.stdout.trim() };
  }
  return null;
}

function runBootstrapMap() {
  const maxFiles = option("--max-files", null);
  const maxCandidates = option("--max-candidates", null);
  const mapArgs = [join(scriptDir, "codebase-map.mjs"), "--json"];
  if (maxFiles) mapArgs.push("--max-files", maxFiles);
  if (maxCandidates) mapArgs.push("--max-candidates", maxCandidates);

  const result = spawnSync(process.execPath, mapArgs, {
    cwd: root,
    encoding: "utf8",
    timeout: 30000,
  });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || "codebase-map.mjs failed");
  }
  return JSON.parse(result.stdout);
}

function provider(id, label, kind, commands, role, recommendedFor) {
  const detected = commandPath(commands);
  return {
    id,
    label,
    kind,
    role,
    recommended_for: recommendedFor,
    installed: Boolean(detected),
    command: detected?.command ?? commands[0],
    path: detected?.path ?? null,
  };
}

function providers() {
  return [
    provider(
      "codebase-memory-mcp",
      "Codebase Memory MCP",
      "graph",
      ["codebase-memory-mcp", "codebase-memory"],
      "首选代码智能 provider：面向大型项目的持久知识图谱、符号关系和 MCP 查询。",
      ["medium", "large"],
    ),
    provider(
      "codegraphcontext",
      "CodeGraphContext",
      "graph",
      ["cgc"],
      "首选代码智能 provider：用 Tree-sitter / SCIP / 图数据库建立可查询代码图谱。",
      ["medium", "large"],
    ),
    provider(
      "repomix",
      "Repomix",
      "packager",
      ["repomix"],
      "模块上下文打包工具：适合把已限定范围的模块整理成 prompt-friendly context，不作为主索引器。",
      ["small", "medium", "focused-large"],
    ),
    {
      id: "bootstrap-map",
      label: "SpecForge bootstrap map",
      kind: "fallback",
      role: "内置保底扫描器：只做目录、语言、入口、API、数据、测试、运维候选识别。",
      recommended_for: ["empty", "small", "medium-bootstrap"],
      installed: true,
      command: "node .specforge/core/scripts/codebase-map.mjs --json",
      path: join(scriptDir, "codebase-map.mjs"),
    },
  ];
}

function selectProvider(list, scale) {
  if (requestedProvider !== "auto") {
    const requested = list.find((item) => item.id === requestedProvider);
    if (!requested) {
      return {
        selected: list.find((item) => item.id === "bootstrap-map"),
        status: "unknown_provider",
        warnings: [`Unknown provider "${requestedProvider}". Falling back to bootstrap-map.`],
      };
    }
    if (!requested.installed) {
      return {
        selected: list.find((item) => item.id === "bootstrap-map"),
        status: "requested_provider_missing",
        warnings: [`Requested provider "${requestedProvider}" is not installed. Falling back to bootstrap-map.`],
      };
    }
    return { selected: requested, status: "provider_available", warnings: [] };
  }

  const graphProvider = list.find((item) => item.kind === "graph" && item.installed);
  const packager = list.find((item) => item.id === "repomix" && item.installed);
  const fallback = list.find((item) => item.id === "bootstrap-map");

  if (scale === "large") {
    if (graphProvider) return { selected: graphProvider, status: "provider_available", warnings: [] };
    return {
      selected: fallback,
      status: "blocked_large_without_provider",
      warnings: ["Large codebase detected but no graph/MCP code intelligence provider is installed."],
    };
  }

  if (scale === "medium") {
    if (graphProvider) return { selected: graphProvider, status: "provider_available", warnings: [] };
    if (packager) return { selected: packager, status: "packager_available", warnings: [] };
    return {
      selected: fallback,
      status: "fallback_medium",
      warnings: ["Medium codebase detected. Bootstrap map is acceptable, but scoped Repomix packages or a graph provider are preferred."],
    };
  }

  return { selected: fallback, status: "fallback_ready", warnings: [] };
}

function nextActions(status, scale, selected) {
  if (status === "blocked_large_without_provider") {
    return [
      "暂停全仓理解，不要继续扩大读取范围。",
      "让用户安装 codebase-memory-mcp / CodeGraphContext，或指定一个目标模块、业务域、错误路径。",
      "若用户指定目标模块，可用 codebase-map + rg 做 change-focused / bug-focused 局部理解。",
    ];
  }
  if (selected.kind === "graph") {
    return [
      `使用 ${selected.label} 查询模块、符号、调用链、依赖和入口关系。`,
      "只把已验证的当前事实改写进 .specforge/wiki/*.md。",
      "对本次需求或 bug 只加载相关模块 wiki 和相关文件。",
    ];
  }
  if (selected.id === "repomix") {
    return [
      "先用 bootstrap map 确定模块边界。",
      "只对目标模块运行 Repomix 生成上下文包，不打包全仓。",
      "从上下文包中抽取稳定事实，改写进 wiki。",
    ];
  }
  if (scale === "small") {
    return [
      "使用 bootstrap map + rg + 关键文件阅读即可建立 wiki 基线。",
      "读取入口、配置、核心模块、测试和运行文件。",
    ];
  }
  return [
    "使用 bootstrap map 作为第一层地图。",
    "按模块分批阅读，避免一次性读取全仓。",
  ];
}

function policyForScale(scale) {
  if (scale === "small" || scale === "empty") return "small: 内置 bootstrap map + rg 足够。";
  if (scale === "medium") return "medium: bootstrap map + rg；有明确模块时用 Repomix 打包模块上下文；可选图谱 provider。";
  return "large: 必须优先使用 graph/MCP/SCIP 类 provider；无 provider 且无目标模块时暂停。";
}

function printHuman(payload) {
  console.log("SpecForge Codebase Intelligence");
  console.log("");
  console.log(`Root: ${payload.root}`);
  console.log(`Bootstrap scale: ${payload.bootstrap.scale}`);
  console.log(`Provider status: ${payload.status}`);
  console.log(`Selected provider: ${payload.selected_provider.label} (${payload.selected_provider.id})`);
  console.log("");
  console.log("Provider availability:");
  for (const item of payload.providers) {
    console.log(`- ${item.label}: ${item.installed ? `installed (${item.command})` : `missing (${item.command})`} — ${item.kind}`);
  }
  console.log("");
  console.log(`Policy: ${payload.policy}`);
  if (payload.warnings.length > 0) {
    console.log("");
    console.log("Warnings:");
    for (const warning of payload.warnings) console.log(`- ${warning}`);
  }
  console.log("");
  console.log("Next actions:");
  for (const action of payload.next_actions) console.log(`- ${action}`);
}

try {
  const bootstrap = runBootstrapMap();
  const providerList = providers();
  const selection = selectProvider(providerList, bootstrap.scale);
  const payload = {
    kind: "specforge_codebase_intelligence",
    version: 1,
    root,
    requested_provider: requestedProvider,
    status: selection.status,
    selected_provider: selection.selected,
    providers: providerList,
    policy: policyForScale(bootstrap.scale),
    next_actions: nextActions(selection.status, bootstrap.scale, selection.selected),
    warnings: selection.warnings,
    bootstrap,
  };

  if (asJson) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    printHuman(payload);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
