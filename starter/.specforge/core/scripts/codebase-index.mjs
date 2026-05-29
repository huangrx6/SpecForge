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
const requestedScanMode = option("--scan-mode", "ask");

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
    if (process.platform === "win32") {
      const result = spawnSync("where", [command], { encoding: "utf8", timeout: 2000 });
      if (result.status === 0 && result.stdout.trim()) return { command, path: result.stdout.trim().split(/\r?\n/)[0] };
    } else {
      const result = spawnSync("sh", ["-lc", `command -v ${command}`], {
        encoding: "utf8",
        timeout: 2000,
      });
      if (result.status === 0 && result.stdout.trim()) return { command, path: result.stdout.trim() };
    }
  }
  return null;
}

function hostPlatform() {
  if (process.platform === "darwin") return { id: "macos", label: "macOS", shell: "sh" };
  if (process.platform === "linux") return { id: "linux", label: "Linux", shell: "sh" };
  if (process.platform === "win32") return { id: "windows", label: "Windows", shell: "powershell" };
  return { id: process.platform, label: process.platform, shell: "unknown" };
}

function focusModules() {
  return [...optionValues("--module"), ...optionValues("--focus")]
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function scanModes() {
  return [
    {
      id: "baseline-lite",
      label: "轻量项目画像",
      best_for: "小项目、目录清楚、只想快速生成最小 wiki 基线。",
      pros: ["最快", "通常不需要新增依赖", "适合首次粗看或小仓库"],
      cons: ["理解较浅", "容易漏掉跨模块关系", "不适合大型遗留仓库做全局结论"],
      dependency_policy: "不要求安装 provider；使用 bootstrap map + rg + 少量关键文件。",
    },
    {
      id: "baseline-standard",
      label: "标准项目画像",
      best_for: "普通存量项目首接入，想建立可供日常需求复用的 wiki。",
      pros: ["覆盖项目概览、架构、数据、运行和风险", "成本和质量比较均衡", "适合大多数日常接入"],
      cons: ["比 lite 慢", "大型仓库仍需要用户指定模块或补充 provider", "关系链路不如 deep 完整"],
      dependency_policy: "默认不强制安装；已限定模块时可选 Repomix，仓库很大且要全局理解时建议 graph provider。",
    },
    {
      id: "baseline-deep",
      label: "深度项目画像",
      best_for: "大型仓库、单体遗留、多服务、多语言，或需要比较可靠的全局关系图。",
      pros: ["关系和影响面最完整", "适合后续长期维护", "能更好支持跨模块需求和代码评审"],
      cons: ["耗时最长", "通常需要安装或启用图谱 provider", "需要等待索引初始化"],
      dependency_policy: "大型仓库必须先有 CodeGraph / codebase-memory-mcp / CodeGraphContext 等 graph provider，缺失时再让用户选择自己安装或 Agent 辅助安装。",
    },
    {
      id: "change-focused",
      label: "新需求定向扫描",
      best_for: "用户已经有明确新需求、业务域、页面、接口或模块。",
      pros: ["最快进入需求实现", "只读相关上下文", "适合日常迭代"],
      cons: ["不会建立完整全仓 wiki", "如果目标范围不清，需要先追问", "可能漏掉隐藏影响面"],
      dependency_policy: "通常不强制安装；大型仓库且影响面不清时建议 graph provider。",
    },
    {
      id: "bug-focused",
      label: "Bug 定向扫描",
      best_for: "用户已有报错、日志、复现路径、接口、页面或异常模块。",
      pros: ["聚焦复现链路和调用链", "适合快速定位", "天然连接验证和回归测试"],
      cons: ["依赖用户提供错误线索", "不覆盖无关模块", "大型项目无 graph provider 时调用链可能不完整"],
      dependency_policy: "通常不强制安装；大型仓库需要跨模块追踪时建议 graph provider。",
    },
  ];
}

function selectScanMode(modes) {
  if (requestedScanMode === "ask" || requestedScanMode === "choose") {
    return {
      selected: null,
      status: "scan_mode_required",
      warnings: [],
    };
  }
  const selected = modes.find((item) => item.id === requestedScanMode);
  if (!selected) {
    return {
      selected: null,
      status: "unknown_scan_mode",
      warnings: [`Unknown scan mode "${requestedScanMode}". Ask the user to choose one of: ${modes.map((item) => item.id).join(", ")}.`],
    };
  }
  return { selected, status: "scan_mode_selected", warnings: [] };
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
      "codegraph",
      "CodeGraph",
      "graph",
      ["codegraph"],
      "首选代码智能 provider：本地 SQLite 代码知识图谱，支持 MCP 查询、context、trace、impact、affected tests 和自动同步。",
      ["medium", "large", "focused-large"],
    ),
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

function graphProviderInstalled(providerList) {
  return providerList.some((item) => item.kind === "graph" && item.installed);
}

function dependencyDecision(scanModeDecision, scale, providerList) {
  const selected = scanModeDecision.selected;
  if (!selected) {
    return {
      status: "waiting_for_scan_mode",
      requires_install: false,
      required_provider: null,
      message: "先让用户选择扫描模式；选择后再判断是否需要安装依赖。",
    };
  }

  const hasGraph = graphProviderInstalled(providerList);
  if (selected.id === "baseline-deep" && scale === "large" && !hasGraph) {
    return {
      status: "install_required",
      requires_install: true,
      required_provider: "graph",
      message: "baseline-deep 在大型仓库中需要 graph provider；缺失时提供用户自己安装 / Agent 辅助安装两种方式。",
    };
  }

  if ((selected.id === "change-focused" || selected.id === "bug-focused") && scale === "large" && focusModules().length === 0) {
    return {
      status: "scope_required",
      requires_install: false,
      required_provider: null,
      message: "定向扫描优先让用户提供模块、业务域、页面、接口、报错路径或复现线索；暂不要求安装依赖。",
    };
  }

  if ((selected.id === "baseline-standard" || selected.id === "change-focused" || selected.id === "bug-focused") && scale === "large" && !hasGraph) {
    return {
      status: "install_optional",
      requires_install: false,
      required_provider: null,
      message: "该模式可先按限定范围推进；如果用户希望分析跨模块关系和影响面，再安装 graph provider。",
    };
  }

  return {
    status: "ready",
    requires_install: false,
    required_provider: null,
    message: "当前模式可以继续，无需先安装依赖。",
  };
}

function nextActions(status, scale, selected, scanModeDecision, dependency) {
  if (!scanModeDecision.selected) {
    return [
      "先暂停执行扫描，不要直接安装 provider，也不要展开全仓分析。",
      "向用户展示 scan_modes：说明每种模式的适用场景、优点、缺点和依赖策略。",
      "让用户选择 baseline-lite / baseline-standard / baseline-deep / change-focused / bug-focused 之一。",
      "用户选择扫描模式后，再根据 dependency_decision 判断是否需要安装依赖或补充目标模块。",
    ];
  }

  if (dependency.status === "install_required") {
    return [
      "暂停全仓理解，不要继续扩大读取范围。",
      `用户已选择 ${scanModeDecision.selected.id}；该模式在当前仓库规模下需要先安装 graph provider。`,
      "向用户展示两种安装方式：A. 用户自己安装；B. Agent 辅助安装。也允许用户改选其他 graph provider 或指定目标模块 / 业务域 / 错误路径。",
      "如果用户选择自己安装，只给出当前 OS 的安装命令、初始化命令和复查命令，然后等待用户完成后再继续。",
      "如果用户选择 Agent 辅助安装，先确认授权，再按当前 OS 自动执行安装；安装后运行 codegraph init/status 和 codebase-index 复查。",
    ];
  }

  if (dependency.status === "scope_required") {
    return [
      `用户已选择 ${scanModeDecision.selected.id}；先询问目标模块、业务域、页面、接口、报错路径或复现线索。`,
      "拿到范围后，用 bootstrap map + rg 做局部理解；如影响面跨模块且用户需要更高可靠性，再建议安装 graph provider。",
    ];
  }

  if (dependency.status === "install_optional") {
    return [
      `用户已选择 ${scanModeDecision.selected.id}；可以先按限定范围推进。`,
      "提醒用户：如果希望更可靠地分析跨模块关系、调用链或影响面，可以选择安装 graph provider。",
      "如果用户不安装，继续用 bootstrap map + rg + 关键文件阅读建立局部事实。",
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
      "先用 wiki 或用户目标确定模块边界；wiki 不足时再用 bootstrap map 补入口。",
      "只对目标模块运行 Repomix 生成上下文包，不打包全仓。",
      "从上下文包中抽取稳定事实，改写进 wiki。",
    ];
  }
  if (scale === "small") {
    return [
      "优先读取现有 wiki；缺基线时使用 bootstrap map + rg + 关键文件阅读建立 wiki 基线。",
      "读取入口、配置、核心模块、测试和运行文件。",
    ];
  }
  return [
    "优先读取现有 wiki；wiki 缺入口时使用 bootstrap map 作为第一层地图。",
    "按模块分批阅读，避免一次性读取全仓。",
  ];
}

function installOptions(providerList, dependency) {
  const host = hostPlatform();
  const codegraph = providerList.find((item) => item.id === "codegraph");
  const options = [];

  if (dependency.requires_install && codegraph && !codegraph.installed) {
    const installCommand =
      host.id === "windows"
        ? "irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex"
        : "curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh";

    options.push({
      id: "codegraph",
      label: "Install CodeGraph",
      recommended: true,
      requires_user_confirmation: true,
      host,
      when: dependency.message,
      install_command: installCommand,
      fallback_command: "npx @colbymchenry/codegraph",
      post_install_commands: [
        "codegraph init -i",
        "codegraph status",
        "node .specforge/core/scripts/codebase-index.mjs --json",
      ],
      choices: [
        {
          id: "user_install",
          label: "用户自己安装",
          action: "把 install_command、post_install_commands 发给用户，等待用户安装并确认后再复查。",
        },
        {
          id: "agent_install",
          label: "Agent 辅助安装",
          action: "先向用户确认授权，然后由 Agent 执行 install_command 和 post_install_commands。",
        },
      ],
      notes: [
        "Do not run install commands before the user confirms.",
        "Always offer both choices: user installs manually, or Agent installs after confirmation.",
        "Use the OS-specific command above; the fallback requires Node/npm.",
        "After installation, initialize the current project and re-run codebase-index before writing wiki facts.",
      ],
    });
  }

  return options;
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
      ".specforge/wiki/01-project-overview.md",
      ".specforge/wiki/03-architecture.md",
      ".specforge/wiki/04-data-model.md",
      ".specforge/wiki/05-operations.md",
      ".specforge/wiki/08-risks.md",
      "按需新增 .specforge/wiki/module-<name>.md",
      "按需新增 .specforge/wiki/api-<domain>.md",
    ],
    risks:
      status === "blocked_large_without_provider"
        ? ["large codebase needs graph/MCP/SCIP provider or user-specified module boundary"]
        : [],
  };
}

function itemPath(item) {
  if (typeof item === "string") return item;
  return item?.path ?? item?.name ?? item?.file ?? String(item);
}

function languageNames(languages) {
  if (!languages) return [];
  if (Array.isArray(languages)) {
    return languages
      .map((item) => (typeof item === "string" ? item : item?.language ?? item?.name ?? item?.id))
      .filter(Boolean);
  }
  if (typeof languages === "object") return Object.keys(languages);
  return [];
}

function payloadSummary(payload) {
  return {
    status: payload.status,
    provider_status: payload.provider_status,
    scale: payload.bootstrap.scale,
    selected_provider: payload.selected_provider.id,
    requested_scan_mode: payload.requested_scan_mode,
    selected_scan_mode: payload.scan_mode_decision.selected?.id ?? null,
    dependency_status: payload.dependency_decision.status,
    report_path: payload.report_path ?? null,
    languages: languageNames(payload.bootstrap.languages),
    source_roots: payload.normalized_context.modules.map((item) => item.path),
    entries: payload.normalized_context.entries.map(itemPath),
    api_candidates: payload.normalized_context.api_candidates.map(itemPath),
    data_candidates: payload.normalized_context.data_candidates.map(itemPath),
    test_candidates: payload.normalized_context.test_candidates.map(itemPath),
    operations_candidates: payload.normalized_context.operations_candidates.map(itemPath),
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
    if (selected.id === "codegraph") {
      return {
        executable: false,
        reason: "CodeGraph 主要通过 Agent runtime 的 MCP tools 查询；本地 wrapper 只检测 CLI 并给出初始化 / 查询计划。",
        commands: [
          "codegraph init -i",
          "codegraph status",
          "codegraph sync",
          "codegraph query <search> --json",
          "codegraph impact <symbol> --depth 2 --json",
        ],
        queries: [
          "codegraph_status: check index health and pending sync",
          "codegraph_context: map target feature/module before reading files",
          "codegraph_trace: trace call path between symbols",
          "codegraph_impact: find affected callers/tests before edits",
          "codegraph_explore: fetch related symbol source in one bounded call",
        ],
      };
    }
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
| Workflow status | ${payload.status} |
| Provider status | ${payload.provider_status} |
| Selected provider | ${selected.label} (\`${selected.id}\`) |
| Provider kind | ${selected.kind} |
| Has codebase | ${normalized.has_codebase ? "yes" : "no"} |
| Host platform | ${payload.host_platform.label} (\`${payload.host_platform.id}\`) |
| Requested scan mode | ${payload.requested_scan_mode} |
| Scan mode status | ${payload.scan_mode_decision.status} |
| Selected scan mode | ${payload.scan_mode_decision.selected ? `${payload.scan_mode_decision.selected.label} (\`${payload.scan_mode_decision.selected.id}\`)` : "not selected"} |
| Dependency status | ${payload.dependency_decision.status} |

## 1.1 扫描模式选择

${payload.scan_modes.map((mode) => `### ${mode.id} — ${mode.label}

- 适用：${mode.best_for}
- 优点：${mode.pros.join("；")}
- 缺点：${mode.cons.join("；")}
- 依赖策略：${mode.dependency_policy}`).join("\n\n")}

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

### 执行计划

${payload.provider_plan.commands ? markdownList(payload.provider_plan.commands, (item) => `\`${item}\``) : "- none"}

### 查询计划

${payload.provider_plan.queries ? markdownList(payload.provider_plan.queries) : "- none"}

## 3.1 Provider 安装选项

${payload.install_options.length === 0 ? "- none" : payload.install_options
    .map((item) => `- ${item.recommended ? "**推荐** " : ""}${item.label}（${item.host.label}）：\`${item.install_command}\`\n  - fallback: \`${item.fallback_command}\`\n  - post-install: ${item.post_install_commands.map((command) => `\`${command}\``).join(" → ")}\n  - requires user confirmation: ${item.requires_user_confirmation ? "yes" : "no"}`)
    .join("\n")}

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
    provider_status: payload.provider_status,
    requested_scan_mode: payload.requested_scan_mode,
    scan_mode_decision: payload.scan_mode_decision,
    dependency_decision: payload.dependency_decision,
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
  console.log(`Workflow status: ${payload.status}`);
  console.log(`Provider status: ${payload.provider_status}`);
  console.log(`Selected provider: ${payload.selected_provider.label} (${payload.selected_provider.id})`);
  console.log(`Host platform: ${payload.host_platform.label} (${payload.host_platform.id})`);
  console.log(`Requested scan mode: ${payload.requested_scan_mode}`);
  console.log(`Scan mode status: ${payload.scan_mode_decision.status}`);
  console.log(`Selected scan mode: ${payload.scan_mode_decision.selected ? `${payload.scan_mode_decision.selected.label} (${payload.scan_mode_decision.selected.id})` : "not selected"}`);
  console.log(`Dependency status: ${payload.dependency_decision.status}`);
  console.log(`Dependency note: ${payload.dependency_decision.message}`);
  console.log("");
  console.log("Scan modes:");
  for (const mode of payload.scan_modes) {
    console.log(`- ${mode.id}: ${mode.label}`);
    console.log(`  best for: ${mode.best_for}`);
    console.log(`  pros: ${mode.pros.join("；")}`);
    console.log(`  cons: ${mode.cons.join("；")}`);
    console.log(`  dependency: ${mode.dependency_policy}`);
  }
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
  if (payload.install_options.length > 0) {
    console.log("");
    console.log("Install choices:");
    for (const item of payload.install_options) {
      console.log(`- ${item.label}${item.recommended ? " (recommended)" : ""}`);
      if (item.choices) {
        for (const choice of item.choices) {
          console.log(`  ${choice.id}: ${choice.label}`);
          console.log(`    ${choice.action}`);
        }
      }
      console.log(`  command: ${item.install_command}`);
      console.log(`  fallback: ${item.fallback_command}`);
      console.log(`  post-install: ${item.post_install_commands.join(" -> ")}`);
      console.log(`  requires user confirmation: ${item.requires_user_confirmation ? "yes" : "no"}`);
    }
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
  const modes = scanModes();
  const scanModeDecision = selectScanMode(modes);
  const dependency = dependencyDecision(scanModeDecision, bootstrap.scale, providerList);
  const plan = providerPlan(selection.selected);
  const execution = runProvider(selection.selected, plan);
  const workflowStatus = scanModeDecision.selected ? selection.status : scanModeDecision.status;
  const warnings = scanModeDecision.selected ? [...selection.warnings, ...scanModeDecision.warnings] : scanModeDecision.warnings;
  const payload = {
    kind: "specforge_codebase_intelligence",
    version: 1,
    root,
    requested_provider: requestedProvider,
    requested_scan_mode: requestedScanMode,
    status: workflowStatus,
    provider_status: selection.status,
    selected_provider: selection.selected,
    providers: providerList,
    scan_modes: modes,
    scan_mode_decision: scanModeDecision,
    dependency_decision: dependency,
    host_platform: hostPlatform(),
    install_options: installOptions(providerList, dependency),
    policy: policyForScale(bootstrap.scale),
    next_actions: nextActions(selection.status, bootstrap.scale, selection.selected, scanModeDecision, dependency),
    warnings,
    normalized_context: normalizedContext(bootstrap, selection.selected, selection.status),
    provider_plan: plan,
    provider_execution: execution,
    bootstrap,
  };
  if (writeReport) payload.report_path = writeReportFile(payload);
  payload.summary = payloadSummary(payload);

  if (asJson) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    printHuman(payload);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
