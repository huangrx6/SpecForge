---
name: sf-steering
description: 为存量项目或大型代码库建立 SpecForge 项目画像；用于新需求或 bugfix 前理解现有架构、刷新 wiki、生成后续 work item 的上下文基线。
---

# sf-steering

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，必须先定位宿主项目根：项目根是“包含 `.specforge/` 目录的业务项目目录”，不是 `.specforge/` 目录本身。若当前目录是 `.specforge/` 或其任意子目录，先 `cd ..` 回到宿主项目根；若当前目录是 `frontend/`、`backend/` 等子目录，也先向上回到包含 `.specforge/` 的项目根，除非该子目录就是独立仓库根。禁止从 `.specforge/` 内执行 `node .specforge/core/scripts/...`，否则会形成 `.specforge/.specforge/...` 的错误路径。

`sf-steering` 用来理解存量项目。它不写业务代码，也不创建普通需求产物；它先建立可复用的项目画像，并把稳定事实回写到 `.specforge/wiki/*.md`。后续 `sf-intake`、`sf-requirements`、`sf-tech-design`、`sf-implement` 才能基于这些事实做新需求、bugfix 或重构。

Steering 的产出必须能降低后续 token 成本：wiki 不只写“项目是什么”，还要写“下次从哪里开始查”。架构、模块、API、数据和运维文件都要尽量包含入口路径、关键符号 / 路由、上游下游、测试位置、运行命令和推荐检索词。

## 何时触发

- 已有项目刚接入 SpecForge，`.specforge/wiki/03-architecture.md` 仍是空模板。
- 用户说“先理解这个项目 / 扫描项目 / 项目画像 / 架构地图 / 存量项目 / 老项目”。
- 新需求或 bugfix 会触碰既有模块，但 wiki 中没有对应模块、API、数据或运行事实。
- 项目较大，不能靠一次性读取所有文件来理解。
- wiki 明显过期，和当前代码实现冲突。

## 启动检查

```bash
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/codebase-index.mjs --json
```

Steering 需要代码智能时，先读取跨阶段能力包：

```text
.specforge/core/skills/code-intelligence/SKILL.md
```

正式建立项目画像时，先生成可审查的中间证据报告：

```bash
node .specforge/core/scripts/codebase-index.mjs --write-report
```

有 active work item 时，默认写入：

```text
.specforge/work/active/<work-item>/00-steering/codebase-intelligence.md
```

没有 active work item 时，默认写入：

```text
.specforge/work/inbox/codebase-intelligence.md
```

wiki 写入或刷新完成后运行：

```bash
node .specforge/core/scripts/wiki-hydrate.mjs --from <codebase-intelligence.md> --mode steering --write
node .specforge/core/scripts/wiki-quality.mjs --mode steering
```

`FAIL` 必须修复；`WARN` 必须补齐当前事实、source work、owner、更新时间，或在 `08-risks.md` 写明缺口、影响和下一步证据来源。

读取内部阶段说明：

```text
.specforge/skills/sf-steering/stages/steering/SKILL.md
```

`codebase-index.mjs` 会检测 code intelligence provider，并在内部运行 `codebase-map.mjs` 生成 bootstrap map，还会输出 `normalized_context`、`wiki_seed` 和 provider 执行 / 查询计划。`codebase-map.mjs` 只是 fallback scanner，不等于符号级理解。结论必须来自代码、配置、测试、CI、现有文档、provider 查询结果或用户确认。CodeGraph 安装、接入、freshness、query、affected tests 和 `graph_facts[]` 归一化细节统一以 `.specforge/core/skills/code-intelligence/` 为准。

## 工作模式

按代码规模和用户目标选择模式：

| 模式 | 适用场景 | 处理方式 |
|---|---|---|
| `baseline-lite` | 小项目，代码量少，模块清晰 | 读取入口、配置、主要模块、测试和部署文件，直接更新核心 wiki |
| `baseline-standard` | 中型项目或普通存量项目首接入 | `codebase-index` + `rg`，必要时用 Repomix 打包目标模块，再更新项目概览、架构、数据、运行、风险 |
| `baseline-deep` | 大型项目、单体遗留系统、多服务仓库 | 必须优先使用图谱 / MCP / SCIP 类 provider；无 provider 且无目标模块时暂停 |
| `change-focused` | 用户已有明确新需求 | 只理解相关模块和上下游，输出“本次变更上下文基线”，再路由 `sf-intake` |
| `bug-focused` | 用户已有异常或 bug | 先理解复现路径、调用链、相关模块、日志和测试，再路由 `sf-intake` 或 `sf-discovery` |

## 大项目策略

不要把大型仓库直接打包进上下文。采用 provider 优先策略：

1. **扫描模式决策层**：运行 `codebase-index.mjs --json`，先读取 `scan_modes`、`scan_mode_decision`、`dependency_decision` 和 `bootstrap.scale`。
   - 如果顶层 `status=scan_mode_required`，立即停止后续扫描，只展示扫描模式并等待用户选择。
   - 不要在未选模式时解析 `bootstrap.languages`、`bootstrap.source_roots` 或启动 Explore agents。
   - 需要摘要时优先读取 JSON 的 `summary` 字段。
2. **小项目**：内置 bootstrap map + `rg` + 关键文件阅读足够。
3. **中型项目**：bootstrap map + `rg`；有明确模块时可用 Repomix 生成模块上下文包，不打包全仓。
4. **大型项目**：优先使用 CodeGraph、codebase-memory-mcp、CodeGraphContext 或同类图谱 / MCP / SCIP provider 查询模块、符号、调用链、依赖和入口关系。
5. **无扫描模式选择**：暂停全仓理解，先让用户选择 `baseline-lite`、`baseline-standard`、`baseline-deep`、`change-focused` 或 `bug-focused`。
6. **无 provider 的大型深度扫描**：用户选择 `baseline-deep` 后，再让用户选择自己安装 provider、Agent 辅助安装、改选 provider 或改选扫描模式。
7. **任务上下文层**：针对后续需求或 bug，只加载相关 wiki + 相关文件，不重新扫描全仓库。

成熟开源工具的做法可以作为参考：Aider 的 repo map、Repomix/Gitingest 的代码打包、CodeGraph / CodeGraphContext / codebase-memory-mcp 的图谱与 MCP 检索、RepoAgent 的文档生成。但在 SpecForge 中，外部工具输出只能作为证据来源，最终必须改写成 `.specforge/wiki/*.md` 的当前事实。

## 代码智能能力包

`sf-steering` 不再内置全部 CodeGraph 细节。检测到 `codegraph` CLI、用户明确启用 CodeGraph，或扫描模式需要 graph provider 时，按顺序读取：

1. `.specforge/core/skills/code-intelligence/foundations/provider-lifecycle.md`
2. `.specforge/core/skills/code-intelligence/foundations/freshness-policy.md`
3. `.specforge/core/skills/code-intelligence/references/codegraph-usage.md`
4. `.specforge/core/skills/code-intelligence/foundations/graph-facts-contract.md`

Steering 只负责项目画像和 Wiki 回写；provider 的安装 / 接入 / 初始化 / 同步 / query / affected tests 规则由 code-intelligence 能力包统一维护。

## 写入 wiki

先读取 `codebase-intelligence.md` 报告，再用 `wiki-hydrate --mode steering --write` 把其中的 `wiki_seed` 和已验证当前事实归一写入 wiki。不要把 provider 原始输出、Repomix 包或报告全文直接复制进 wiki。

根据实际发现更新这些文件；不需要的文件保持不动：

| 文件 | 写入内容 |
|---|---|
| `.specforge/wiki/01-project-overview.md` | 项目目标、主要用户、核心能力、边界、常见任务入口 |
| `.specforge/wiki/03-architecture.md` | 架构形态、服务/模块划分、入口、关键依赖、主要追踪路径 |
| `.specforge/wiki/module-<name>.md` | 单个模块职责、入口、依赖、关键文件、测试位置、推荐检索词 |
| `.specforge/wiki/api-<domain>.md` | API 域、路由、请求响应、鉴权、错误约定、实现路径和调用方 |
| `.specforge/wiki/external-interfaces.md` | 对外接口总览：API、Webhook、CLI、SDK、文件导入导出、第三方调用、事件消息 |
| `.specforge/wiki/config-env.md` | 配置源、环境变量、secret、feature flag 和配置风险 |
| `.specforge/wiki/security-auth.md` | 认证、授权、权限和敏感数据边界 |
| `.specforge/wiki/jobs-events.md` | 后台任务、队列、事件、定时任务、retry / DLQ |
| `.specforge/wiki/04-data-model.md` | 当前数据权威、当前实体 / 表、迁移初始化、历史 / 未受信 SQL、数据生命周期 |
| `.specforge/wiki/05-operations.md` | 本地启动、构建、测试、部署、CI、环境变量、验证入口 |
| `.specforge/wiki/06-decisions.md` | 已确认的架构或产品决策 |
| `.specforge/wiki/07-glossary.md` | 领域术语、缩写、系统内命名 |
| `.specforge/wiki/08-risks.md` | 技术债、风险点、未知区、需用户确认项 |
| `.specforge/wiki/00-index.md` | 当前 wiki 索引和摘要 |

Wiki 只保留当前事实。不要按日期、版本或 work item 复制多份同类文档。

## Wiki 完整度要求

存量项目画像不能只写“这是一个前后端项目”这类概述。写入前必须按 `.specforge/core/standards/wiki.md#最低完整度` 自检。

重点补扫：

| 不完整表现 | 必须补扫 |
|---|---|
| 架构只有技术栈，没有模块边界 | source roots、package / build 配置、入口、路由、服务目录、部署文件 |
| API 只有“有接口” | route / controller / OpenAPI / SDK / test / caller，先更新 `external-interfaces.md`，必要时创建 `api-<domain>.md` |
| 数据模型只有“使用数据库” | schema / model / migration / repository / runtime config / fixture / test，先确认当前数据权威；历史 SQL 只能进入历史 / 未受信 SQL 章节 |
| 模块只有目录名 | 入口、职责、上游、下游、数据读写、测试位置，必要时创建 `module-<name>.md` |
| 运维只有启动命令 | env、构建、测试、DB 初始化、任务、部署、回滚、日志监控 |

如果补扫后仍无法确认，不要略过：在目标 wiki 写 `未确认`，并在 `08-risks.md` 记录“缺口 / 已扫范围 / 下一步证据来源”。

## 关联标准

- `.specforge/core/standards/code-intelligence.md`：provider 优先级、规模策略和大型项目停止条件。
- `.specforge/core/standards/wiki.md`：wiki 单文件当前态、事实回写和未知项记录。
- `.specforge/core/standards/workflow.md`：上下文加载、暂停条件和下一步路由。

## 输出给用户

完成后输出：

- 本次选择的模式。
- 代码库规模判断：small / medium / large。
- 已更新的 wiki 文件。
- codebase intelligence 证据报告路径。
- `wiki-quality.mjs` 结果和剩余缺口。
- 已确认的关键模块和入口。
- 尚未确认的业务含义或风险。
- 下一步建议路由：通常是 `sf-intake`；如果用户只是要求项目画像，则停在这里。

## 停止条件

- `codebase-index.mjs` 显示 `scan_mode_required`，且用户尚未选择扫描模式。
- `dependency_decision.status=install_required`，且用户尚未选择自己安装、Agent 辅助安装、改选模式或指定目标范围。
- 代码事实和现有 wiki / 文档冲突，无法判断哪个是当前事实。
- 需要业务 owner 确认术语、权限、流程或上线规则。
- 发现安全、数据迁移、生产配置风险，但没有足够权限或证据继续判断。

## 完成标准

- `.specforge/wiki/` 至少包含当前项目概览和架构概览。
- 大型项目至少有相关模块级 wiki，而不是只有笼统总结。
- `03-architecture.md`、`04-data-model.md`、`05-operations.md`、`external-interfaces.md` 和必要的 `api-<domain>.md` / `module-<name>.md` 达到最低完整度；缺口进入 `08-risks.md`。
- 后续 `sf-intake` 能引用 wiki 判断影响面，不必重新理解全仓库。
- 未确认内容写入 `08-risks.md` 或在输出中列为待确认，不混入当前事实。
- `wiki-hydrate --mode steering --write` 已执行，`wiki_seed` 已回写或记录缺口。
- `wiki-quality.mjs --mode steering` 无 `FAIL`；`WARN` 已修复或在 `08-risks.md` 中记录 owner、影响和下一步证据来源。

## 不做

- 不直接实现新需求或修 bug。
- 不创建 PRD、requirements、technical_design 或 tasks。
- 不把外部工具生成的大段原文直接写入 wiki。
- 不因为扫描到文件就推断业务含义；无法确认就标为未知。
