import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { layout, localDateIso, resolveWorkItem } from "./lib/specforge.mjs";

const root = process.cwd();
const scriptDir = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const writeReport = args.includes("--write-report");
const executeProvider = args.includes("--execute-provider");
const requestedProvider = option("--provider", "auto");

function option(name, fallback) {
  const index = args.indexOf(name);
  const value = args[index + 1];
  return index === -1 || !value || value.startsWith("--") ? fallback : value;
}

function optionValues(name) {
  const values = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === name && args[i + 1] && !args[i + 1].startsWith("--")) values.push(args[i + 1]);
  }
  return values;
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

function focusModules() {
  return [...optionValues("--module"), ...optionValues("--focus")]
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
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

function firstItems(items = [], limit = 12) {
  return items.slice(0, limit);
}

function normalizedContext(bootstrap, selected, status) {
  const modules = firstItems(bootstrap.source_roots ?? [], 12).map((item) => ({
    path: item.name,
    evidence: "bootstrap.source_roots",
    source_files: item.count,
  }));

  return {
    scale: bootstrap.scale,
    has_codebase: bootstrap.has_codebase,
    provider_status: status,
    selected_provider: selected.id,
    focus_modules: focusModules(),
    modules,
    entries: firstItems(bootstrap.candidates?.entries ?? [], 20),
    api_candidates: firstItems(bootstrap.candidates?.api ?? [], 20),
    data_candidates: firstItems(bootstrap.candidates?.data ?? [], 20),
    test_candidates: firstItems(bootstrap.candidates?.tests ?? [], 20),
    operations_candidates: firstItems(bootstrap.candidates?.operations ?? [], 20),
    wiki_targets: [
      ".specforge/wiki/project-overview.md",
      ".specforge/wiki/architecture.md",
      ".specforge/wiki/data-model.md",
      ".specforge/wiki/operations.md",
      ".specforge/wiki/risks.md",
      "按需新增 .specforge/wiki/module-<name>.md",
      "按需新增 .specforge/wiki/api-<domain>.md",
    ],
    risks:
      status === "blocked_large_without_provider"
        ? ["large codebase needs graph/MCP/SCIP provider or user-specified module boundary"]
        : [],
  };
}

function providerPlan(selected) {
  const modules = focusModules();
  if (selected.id === "repomix") {
    if (modules.length === 0) {
      return {
        executable: false,
        reason: "Repomix must be scoped to explicit --module/--focus paths before execution.",
        commands: ["repomix <module-path> --stdout --style markdown --compress"],
      };
    }
    return {
      executable: true,
      commands: [`repomix ${modules.map((item) => JSON.stringify(item)).join(" ")} --stdout --style markdown --compress`],
    };
  }

  if (selected.kind === "graph") {
    return {
      executable: false,
      reason: "Graph/MCP providers are queried by the Agent runtime, not by this local wrapper.",
      queries: [
        "list repository modules and entry points",
        "find symbols and call paths for the target module",
        "find API/data/job dependencies for the target module",
        "return file paths and confidence for each fact",
      ],
    };
  }

  return {
    executable: false,
    reason: "Bootstrap map already executed inside codebase-index.mjs.",
    commands: ["node .specforge/core/scripts/codebase-map.mjs --json"],
  };
}

function runProvider(selected, plan) {
  if (!executeProvider) return { attempted: false, status: "not_requested" };
  if (!plan.executable) return { attempted: false, status: "not_executable", reason: plan.reason };
  if (selected.id !== "repomix") return { attempted: false, status: "unsupported_provider", reason: "Only Repomix CLI execution is supported." };

  const modules = focusModules();
  const result = spawnSync(selected.command, [...modules, "--stdout", "--style", "markdown", "--compress"], {
    cwd: root,
    encoding: "utf8",
    timeout: 60000,
    maxBuffer: 10 * 1024 * 1024,
  });

  return {
    attempted: true,
    status: result.status === 0 ? "ok" : "failed",
    command: `${selected.command} ${modules.join(" ")} --stdout --style markdown --compress`,
    stdout_bytes: Buffer.byteLength(result.stdout ?? "", "utf8"),
    stderr_excerpt: (result.stderr ?? "").slice(0, 2000),
    stdout_excerpt: (result.stdout ?? "").slice(0, 4000),
  };
}

function policyForScale(scale) {
  if (scale === "small" || scale === "empty") return "small: 内置 bootstrap map + rg 足够。";
  if (scale === "medium") return "medium: bootstrap map + rg；有明确模块时用 Repomix 打包模块上下文；可选图谱 provider。";
  return "large: 必须优先使用 graph/MCP/SCIP 类 provider；无 provider 且无目标模块时暂停。";
}

function markdownList(items = [], render = (item) => String(item)) {
  if (!items.length) return "- none";
  return items.map((item) => `- ${render(item)}`).join("\n");
}

function renderReport(payload) {
  const normalized = payload.normalized_context;
  const selected = payload.selected_provider;
  const execution = payload.provider_execution;

  return `# Codebase Intelligence Report

## 1. 摘要

| 项 | 值 |
|---|---|
| 日期 | ${localDateIso()} |
| Root | \`${payload.root}\` |
| Scale | ${normalized.scale} |
| Provider status | ${payload.status} |
| Selected provider | ${selected.label} (\`${selected.id}\`) |
| Provider kind | ${selected.kind} |
| Has codebase | ${normalized.has_codebase ? "yes" : "no"} |

## 2. Provider 可用性

| Provider | 类型 | 状态 | 命令 / 路径 | 用途 |
|---|---|---|---|---|
${payload.providers
  .map((item) => `| ${item.label} | ${item.kind} | ${item.installed ? "installed" : "missing"} | \`${item.path ?? item.command}\` | ${item.role} |`)
  .join("\n")}

## 3. Provider 执行编排

| 项 | 值 |
|---|---|
| 是否请求执行 | ${executeProvider ? "yes" : "no"} |
| 执行状态 | ${execution.status} |
| 执行命令 | ${execution.command ? `\`${execution.command}\`` : "N/A"} |
| 输出字节数 | ${execution.stdout_bytes ?? "N/A"} |
| 说明 | ${execution.reason ?? "N/A"} |

### 执行计划 / 查询计划

${payload.provider_plan.commands ? markdownList(payload.provider_plan.commands, (item) => `\`${item}\``) : markdownList(payload.provider_plan.queries)}

## 4. Bootstrap Map 归一化

### 模块候选

${markdownList(normalized.modules, (item) => `\`${item.path}\` — ${item.source_files} source files (${item.evidence})`)}

### 入口候选

${markdownList(normalized.entries, (item) => `\`${item}\``)}

### API 候选

${markdownList(normalized.api_candidates, (item) => `\`${item}\``)}

### 数据候选

${markdownList(normalized.data_candidates, (item) => `\`${item}\``)}

### 测试候选

${markdownList(normalized.test_candidates, (item) => `\`${item}\``)}

### 运行 / 运维候选

${markdownList(normalized.operations_candidates, (item) => `\`${item}\``)}

## 5. Wiki 回写计划

${markdownList(normalized.wiki_targets, (item) => `\`${item}\``)}

## 6. 风险与停止条件

${markdownList([...payload.warnings, ...normalized.risks])}

## 7. 下一步

${markdownList(payload.next_actions)}

## 8. 原始 JSON 摘要

\`\`\`json
${JSON.stringify(
  {
    status: payload.status,
    selected_provider: payload.selected_provider,
    normalized_context: payload.normalized_context,
    provider_execution: payload.provider_execution,
  },
  null,
  2,
)}
\`\`\`
`;
}

function defaultReportPath() {
  try {
    const workItem = resolveWorkItem({ workItem: option("--work-item", undefined), activeOnly: true });
    return `${workItem.base}/00-steering/codebase-intelligence.md`;
  } catch {
    return `${layout.workItems}/inbox/codebase-intelligence.md`;
  }
}

function reportPath() {
  const raw = option("--report", null) ?? option("--output", null) ?? defaultReportPath();
  return isAbsolute(raw) ? raw : join(root, raw);
}

function writeReportFile(payload) {
  const target = reportPath();
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, renderReport(payload), "utf8");
  return target;
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
  if (payload.report_path) {
    console.log("");
    console.log(`Report: ${payload.report_path}`);
  }
}

try {
  const bootstrap = runBootstrapMap();
  const providerList = providers();
  const selection = selectProvider(providerList, bootstrap.scale);
  const plan = providerPlan(selection.selected);
  const execution = runProvider(selection.selected, plan);
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
    normalized_context: normalizedContext(bootstrap, selection.selected, selection.status),
    provider_plan: plan,
    provider_execution: execution,
    bootstrap,
  };
  if (writeReport) payload.report_path = writeReportFile(payload);

  if (asJson) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    printHuman(payload);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
