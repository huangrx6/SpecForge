---
name: steering
description: SpecForge 内部 steering 技能。用于存量项目、大型代码库或 wiki 过期时建立项目画像、刷新长期上下文，并为后续 work item 提供代码事实基线。
---

# Steering Skill

本技能用于理解已有项目。它解决的问题不是“这次需求怎么做”，而是“这个项目现在真实长什么样”。结果写入 `.specforge/wiki/`，供后续 `sf-intake`、`sf-requirements`、`sf-tech-design`、`sf-implement` 和 `sf-code-review` 复用。

## 核心原则

本阶段必须读取 `.specforge/core/standards/code-intelligence.md` 和 `.specforge/core/standards/wiki.md`。

1. **先选扫描模式，再选 provider**：先运行 `codebase-index.mjs` 判断规模并展示扫描模式，让用户选择后再判断是否需要 provider。
2. **分层理解，不读全仓**：大型项目不能把所有文件塞进上下文；只读取当前层级和目标模块需要的文件。
3. **当前事实优先**：wiki 写当前代码和配置可证明的事实，不写愿望、猜测或过期历史。
4. **任务上下文最小化**：后续每个 work item 只加载相关 wiki 和相关文件，不重复扫描全仓库。
5. **未知显式记录**：业务含义、权限规则、上线流程无法从代码确认时，写入 `risks.md` 或询问用户。

## 必跑命令

```bash
node .specforge/core/scripts/codebase-index.mjs --json
node .specforge/core/scripts/codebase-index.mjs --write-report
```

维护 SpecForge 源码仓库时使用：

```bash
node core/scripts/codebase-index.mjs --json
node core/scripts/codebase-index.mjs --write-report --report /tmp/specforge-codebase-intelligence.md
```

`codebase-index.mjs` 会先输出 `scan_modes`，再检测 code intelligence provider，并在内部运行 `codebase-map.mjs` 生成 bootstrap map，输出 `normalized_context`、provider plan 和可审查 Markdown report。`codebase-map.mjs` 是 fallback scanner，只提供候选，不直接等于结论。重要结论必须继续读取文件、查询 provider 或由用户确认。

## 规模判断

| 规模 | 判断信号 | 策略 |
|---|---|---|
| small | 少量源码文件，入口清楚 | 可一次性读入口、配置、核心模块、测试和部署 |
| medium | 多模块或多技术栈，但目录边界清楚 | bootstrap map + `rg`；有明确模块时用 Repomix 打包模块上下文；可选图谱 provider |
| large | 源码文件很多、单体遗留、多服务、多语言或扫描被截断 | 必须优先使用图谱 / MCP / SCIP 类 provider；无 provider 且无目标模块时暂停 |

## 推荐流程

### 0. 扫描模式选择层

先读取 `codebase-index.mjs --json` 输出的 `scan_modes`、`scan_mode_decision` 和 `dependency_decision`。默认没有用户明确选择时，不要直接安装 provider，也不要展开全仓分析。

必须向用户展示这些模式，让用户自己选：

| 模式 | 适用 | 优点 | 缺点 | 依赖判断 |
|---|---|---|---|---|
| `baseline-lite` | 小项目、快速粗看 | 快、低成本、通常不用新增依赖 | 浅，容易漏跨模块关系 | 不要求 provider |
| `baseline-standard` | 普通存量项目首接入 | 覆盖 wiki 基线，质量和成本均衡 | 大仓库可能需要限定模块 | 默认不强制，必要时可选 Repomix / graph |
| `baseline-deep` | 大型仓库、遗留单体、多服务 | 关系和影响面最完整 | 慢，通常要建索引 | 大型仓库必须先有 graph provider |
| `change-focused` | 已有明确新需求 | 直接服务本次迭代，读取少 | 不建立完整全仓 wiki | 先要目标模块/业务域；graph 视影响面可选 |
| `bug-focused` | 已有 bug、日志、复现路径 | 聚焦链路和回归验证 | 依赖错误线索 | 先要复现/报错路径；graph 视调用链可选 |

用户选择后，重新运行：

```bash
node .specforge/core/scripts/codebase-index.mjs --json --scan-mode <mode>
```

如果是定向模式，优先补充 `--module <path>` 或 `--focus <domain>`。

### 1. 仓库地图层

读取 `codebase-index.mjs --json` 输出，记录：

- `scan_modes`、`scan_mode_decision`、`dependency_decision`
- `status`、`selected_provider`、`providers`
- `normalized_context`
- `provider_plan`、`provider_execution`
- `bootstrap.scale`、`bootstrap.source_files`、`bootstrap.languages`
- `bootstrap.source_roots`
- `bootstrap.manifests` 和关键 package / build 配置
- `bootstrap.candidates.entries`
- `bootstrap.candidates.api`
- `bootstrap.candidates.data`
- `bootstrap.candidates.tests`
- `bootstrap.candidates.operations`

如果 `dependency_decision.status=install_required`，不要自行展开全仓。先展示安装选择：A. 用户自己安装；B. Agent 辅助安装。用户选择自己安装时，给出当前 OS 的安装、初始化和复查命令后等待；用户选择 Agent 辅助安装时，确认授权后按当前 OS 执行安装命令，再运行 `codegraph init -i`、`codegraph status` 和 `codebase-index` 复查。用户也可以改选 codebase-memory-mcp / CodeGraphContext，或改选轻量/定向扫描模式。

### 1.5 Provider 决策层

| provider 类型 | 用法 |
|---|---|
| CodeGraph | 本地 SQLite 知识图谱 + MCP；查询 context、trace、impact、callers/callees、affected source/tests；大型项目优先 |
| codebase-memory-mcp / CodeGraphContext | 查询模块、符号、调用链、依赖、入口、影响面；大型项目优先 |
| Repomix | 只在目标模块已限定时生成 context 包；不打包全仓 |
| `codebase-map.mjs` | bootstrap / fallback，提供粗地图和候选路径 |
| `rg` | 在已限定范围内验证事实 |

Provider 输出只能作为证据来源，必须归一成 wiki 当前事实。

### 1.6 中间证据报告

`codebase-index.mjs --write-report` 默认写入：

| 情况 | 路径 |
|---|---|
| 有 active work item | `.specforge/work/active/<work-item>/00-steering/codebase-intelligence.md` |
| 没有 active work item | `.specforge/work/inbox/codebase-intelligence.md` |

这个报告是 steering 的中间证据，不是长期 wiki。它用于记录 provider、扫描范围、模块候选、入口候选、风险和 wiki 回写计划。

### 2. 模块事实层

按模块读取最小文件集：

- 模块入口：路由、controller、service、command、job、page、app entry。
- 公共契约：API、DTO、事件、SDK、schema。
- 领域规则：状态机、权限、审批流、核心校验。
- 数据：model、migration、repository、索引、数据生命周期。
- 测试：unit、integration、e2e、fixture。
- 运行：环境变量、启动命令、CI、部署描述。

### 3. 关系层

只记录能证明的关系：

- 模块调用关系。
- API 请求链路。
- 数据读写路径。
- 后台任务、队列、定时任务。
- 第三方集成和鉴权边界。
- 错误处理、日志、监控、告警入口。

### 4. Wiki 基线层

先读取 `codebase-intelligence.md` 中间证据，再把稳定事实写入 `.specforge/wiki/`：

| 文件 | 内容 |
|---|---|
| `project-overview.md` | 项目目标、主要用户、核心能力、明确边界 |
| `architecture.md` | 架构形态、模块/服务划分、入口、依赖、关键链路 |
| `module-<name>.md` | 模块职责、入口文件、上下游、测试和风险 |
| `api-<domain>.md` | API 域、路由、鉴权、请求响应、错误约定 |
| `data-model.md` | 数据库、核心表/模型、迁移、索引、生命周期 |
| `operations.md` | 本地启动、构建、测试、部署、CI、环境变量 |
| `decisions.md` | 已确认的长期决策 |
| `glossary.md` | 领域术语、缩写、系统内命名 |
| `risks.md` | 技术债、未知区、冲突事实、待用户确认项 |
| `index.md` | 当前 wiki 索引和摘要 |

Wiki 中每一项保持单文件、当前态。不要创建 `architecture-v2.md`、`module-x-20260518.md` 这类过程文件。

### 4.5 Wiki 完整度补扫

写入前按 `.specforge/core/standards/wiki.md#最低完整度` 自检。以下情况不能直接完成：

| 不完整表现 | 必须补扫 |
|---|---|
| 架构只有技术栈，没有模块边界 | source roots、manifest、入口、路由、服务目录、部署文件 |
| API 只有“有接口” | route、controller、OpenAPI、SDK、测试、调用方 |
| 数据模型只有“使用数据库” | schema、model、migration、repository、SQL、fixture、测试 |
| 模块只有目录名 | 入口、职责、上游、下游、数据读写、测试位置 |
| 运维只有启动命令 | env、构建、测试、DB 初始化、任务、部署、回滚、日志监控 |

补扫后仍无法确认的，目标 wiki 写 `未确认`，并在 `risks.md` 写清缺口、已扫范围和下一步证据来源。

## 外部工具参考策略

可参考成熟工具的思想，但不要把它们的输出原样变成 SpecForge 事实：

| 工具思路 | 可借鉴点 | SpecForge 落地 |
|---|---|---|
| Aider repo map | 用 Tree-sitter / 符号 / 依赖关系在 token 预算内选上下文 | `codebase-map` 先给粗地图；后续按模块选文件 |
| Repomix / Gitingest | 生成 prompt-friendly 代码包和 token 分布 | 只用于小范围模块包，不用于全仓长期事实 |
| CodeGraph / CodeGraphContext / codebase-memory-mcp | 图谱、MCP、依赖、调用、影响面和文档层 | 大项目首选，结果归一到 wiki |
| RepoAgent | 自动生成和维护仓库文档 | 可借鉴“先全局结构，再增量维护”的机制 |

## 与 work item 的关系

- 刚 onboard 的已有项目：先 `sf-steering` 建立 wiki 基线，再 `sf-intake` 创建新 work item。
- 已有明确需求：`sf-steering` 可用 `change-focused` 模式只理解相关模块，然后把结果交给 `sf-intake`。
- 已有 bug：`sf-steering` 可用 `bug-focused` 模式理解复现路径和调用链，然后由 `sf-intake` 创建 `bugfix` 或 `issue`。
- close 前发现 wiki 缺失：由 `sf-wiki` 或 `sf-close` 读取本技能，补齐当前事实。

## 停止条件

- 大项目缺图谱 / MCP / SCIP 类 provider，且用户没有提供目标模块或业务域，继续扫描会变成无边界探索。
- 现有文档和当前代码冲突，无法判断哪个代表当前事实。
- 需要业务 owner 确认领域术语、权限、审批或上线规则。
- 找到敏感配置、生产数据或安全风险，不应继续暴露细节。

## 完成标准

- 代码库规模和技术栈判断清楚。
- 至少更新 `project-overview.md` 和 `architecture.md`。
- 对大型项目，至少建立目标模块的 `module-<name>.md`。
- `architecture.md`、`data-model.md`、`operations.md` 和必要的 `api-<domain>.md` 达到最低完整度；不足项进入 `risks.md`。
- 后续 work item 能引用 wiki 中的模块、API、数据和运行事实。
- 未确认内容没有混进 wiki 当前事实。
