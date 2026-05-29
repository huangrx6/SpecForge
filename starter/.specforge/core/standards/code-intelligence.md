# 代码智能标准

本标准回答：存量项目、大型代码库和老系统接入时，AI 应如何建立可靠项目画像。

## 核心定位

日常 work item 不应把代码智能当作第一入口。已有 `.specforge/wiki/` 时，先用 wiki 定位业务域、模块、API、数据和运行入口，再用代码智能或 `rg` 验证局部事实。

`codebase-map.mjs` 是内置保底扫描器，只负责生成 bootstrap map：

- 目录、语言、源码数量和规模判断。
- manifest、入口、API、数据、测试、运维候选。
- 是否存在代码库，以及是否可能需要 `sf-steering`。

它不做符号级理解，不解析调用链，不生成依赖图，也不替代专业索引器。

## Provider 优先级

| 优先级 | Provider 类型 | 代表工具 | 用途 |
|---|---|---|---|
| 1 | 图谱 / MCP / SCIP 类代码智能 | CodeGraph、codebase-memory-mcp、CodeGraphContext | 大型项目主索引器，用于查询模块、符号、调用链、依赖、入口关系 |
| 2 | 模块上下文打包 | Repomix | 中型项目或已限定模块的上下文包，不用于全仓主索引 |
| 3 | 内置 bootstrap map | `codebase-map.mjs` | 小项目和所有项目的第一层粗地图 / fallback |
| 4 | 文本搜索 | `rg` | 在已限定范围内验证事实、定位定义和引用 |

## Wiki-first 查询顺序

针对新需求、bugfix、issue、refactor、实现、审查和验证，默认顺序是：

1. 读取 `.specforge/wiki/00-index.md`，找到相关知识项。
2. 读取相关 `01-project-overview.md`、`03-architecture.md`、`module-<name>.md`、`api-<domain>.md`、`04-data-model.md`、`05-operations.md`、`08-risks.md` 或 `design-system.md`。
3. 从 wiki 生成 bounded context：入口路径、关键符号 / 路由、上游下游、测试位置、运行命令和风险。
4. 只在 bounded context 内使用 CodeGraph、Repomix、`rg` 或文件阅读追踪链路。
5. 如果 wiki 没有覆盖本次范围、明显过期或与代码冲突，先路由 `sf-steering` 刷新 wiki，不要在普通阶段临时全仓探索。

SpecForge 的统一入口是：

```bash
node .specforge/core/scripts/codebase-index.mjs --json
```

该脚本负责检测本机 provider、运行 bootstrap map，并输出 normalized decision payload。正式 steering 时同时生成中间证据报告：

```bash
node .specforge/core/scripts/codebase-index.mjs --write-report
```

报告默认写入 active work item 的 `00-steering/codebase-intelligence.md`；没有 active work item 时写入 `.specforge/work/inbox/codebase-intelligence.md`。它不会把第三方工具输出原样写入 wiki。

## Provider 执行编排

`codebase-index.mjs` 默认只做检测、规划和归一化，不主动执行第三方 provider。需要执行时显式加：

```bash
node .specforge/core/scripts/codebase-index.mjs --provider repomix --module src/orders --execute-provider --write-report
```

执行规则：

- Repomix 只能在显式 `--module` 或 `--focus` 限定范围后执行；模块 / focus 应优先来自 wiki 或用户提供的目标范围。
- Graph / MCP provider 由 Agent runtime 查询，本地 wrapper 只输出查询计划。
- Provider 原始输出只能作为证据，不能直接粘贴进 wiki。
- `normalized_context` 是后续 wiki 回写的输入边界。

### CodeGraph

[CodeGraph](https://github.com/colbymchenry/codegraph) 是推荐的一等 graph provider：本地 SQLite 代码知识图谱，支持 Codex MCP、Claude Code、Cursor 等 agent，能通过 `codegraph_context`、`codegraph_trace`、`codegraph_impact`、`codegraph_explore`、`codegraph_status` 等工具查询符号关系、调用链、影响面和相关源码。

SpecForge 中的使用规则：

- `codebase-index.mjs` 检测到 `codegraph` CLI 时，将其视为 graph provider。
- 项目未安装或未初始化 CodeGraph 时，必须展示两种方式：A. 用户自己安装；B. Agent 辅助安装 / 初始化。用户选择自己安装时，只给命令并等待用户完成；用户确认 Agent 辅助安装后，再按当前 OS 执行安装、`codegraph init -i` 和 `codegraph status`。
- macOS / Linux 使用 `curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh`；Windows 使用 `irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex`；若用户不想执行远程脚本，可改用 `npx @colbymchenry/codegraph`。
- steering 时先用 `codegraph_status` 检查索引健康；若有 pending sync，等待同步或运行 `codegraph sync` 后再下结论。
- 分析新需求或 bug 时先从 wiki 取得目标模块和入口；wiki 不足时再用 `codegraph_context` 定位模块和入口，并用 `codegraph_trace` / `codegraph_impact` 分析调用链和影响面，最后只读取必要文件验证事实。
- CodeGraph 输出仍是证据来源，进入 `.specforge/wiki/*.md` 前必须改写为当前事实。

## 规模策略

| 规模 | 推荐策略 | 停止条件 |
|---|---|---|
| small | wiki + `codebase-map.mjs` + `rg` + 关键文件阅读即可 | 无 |
| medium | wiki + `codebase-map.mjs` + `rg`；有明确模块时用 Repomix 打包模块上下文；可选图谱 provider | 模块边界不清且 wiki 无入口时先问用户或路由 steering |
| large | 必须优先使用图谱 / MCP / SCIP 类 provider；只深入目标模块和上下游 | 无 provider 且无目标模块时暂停 |

大型项目不能靠“多读文件”解决。没有 provider 时，只能做 change-focused / bug-focused 局部理解，或停下让用户安装 provider / 指定模块。

## Wiki 归一化

无论 provider 输出多丰富，最终进入 `.specforge/wiki/*.md` 的只能是当前事实：

- 项目目标、边界、模块职责。
- 入口、API、数据、后台任务、运行和部署路径。
- 能被代码、配置、测试、CI、文档或用户确认支持的关系。
- 未确认内容写入 `08-risks.md`，不要混进当前事实。

禁止把 provider 的原始报告、全仓上下文包、大段代码摘要直接粘贴进 wiki。

## Provider 缺失处理

当 `codebase-index.mjs` 尚未选择扫描模式：

1. 停止全仓扫描，不要直接进入 provider 安装。
2. 展示 `scan_modes`，说明每种模式的适用场景、优点、缺点和依赖策略。
3. 让用户选择 `baseline-lite`、`baseline-standard`、`baseline-deep`、`change-focused` 或 `bug-focused`。
4. 用户选择后，重新运行 `codebase-index.mjs --scan-mode <mode>`；定向模式还应补充目标模块、业务域、页面、接口、报错路径或复现线索。

执行约束：

- `status=scan_mode_required` 时，不得继续解析 `bootstrap.languages`、`bootstrap.source_roots`、`bootstrap.candidates` 或启动多 Agent 探索。
- 展示状态摘要时优先使用 `summary` 字段；`bootstrap` 是证据原始结构，字段类型可能随 scanner 演进变化。

当用户选择的模式需要 provider，但当前未安装时：

1. 展示安装选择：A. 用户自己安装；B. Agent 辅助安装。优先建议 CodeGraph，并说明当前系统对应安装命令。
2. 用户选择自己安装时，给出安装、初始化、状态检查和 `codebase-index` 复查命令后等待；用户选择 Agent 辅助安装时，确认授权后自动执行这些命令。
3. 如果用户不安装 provider，询问是否改选轻量/标准/定向模式，或提供目标模块、业务域、报错路径后做局部理解。
4. 后续 work item 只加载相关 wiki 和相关文件。
