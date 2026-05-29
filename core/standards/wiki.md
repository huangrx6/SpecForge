# Wiki 标准

本标准回答：哪些信息要进入项目级 Wiki，什么时候回写，如何保持最新。

## Wiki 定位

`.specforge/wiki/` 保存当前项目长期事实，不保存一次性过程记录。每一项知识使用一个单文件，文件名要见名知意。

Wiki 也是后续任务的默认入口。日常需求、bugfix、issue、refactor 不应每次重新全量读取代码；应先从 `00-index.md` 和相关知识项定位模块、入口、上下游、数据和运行事实，再沿链路读取必要文件。

核心约束：

- 一个知识项只有一个当前文件，使用 `status: current` 标识。
- 默认知识项文件名采用 `NN-english-slug.md`，用于稳定排序和跨平台兼容；文章标题使用中文，写在 frontmatter `title` 和 H1。
- 不创建按日期、版本号或 work item 命名的 wiki 文件。
- 事实变化时更新原文件；历史原因只在必要时写入 `06-decisions.md` 或目标文件的“决策背景”。
- 每个架构、模块、API、数据和运维类知识项都应提供“代码导航”：入口路径、关键符号 / 路由 / 命令、上游下游、测试位置和推荐检索词。

## 默认知识项

| 文件 | 内容 |
|---|---|
| `00-index.md` | 知识库索引、当前项目摘要、任务入口导航、当前知识项 |
| `01-project-overview.md` | 项目目标、用户、当前状态 |
| `02-product-rules.md` | 稳定产品规则、角色、业务约束 |
| `03-architecture.md` | 系统结构、模块边界、技术栈、关键数据流 |
| `04-data-model.md` | 核心实体、表、关系、状态机 |
| `05-operations.md` | 环境、配置、启动、发布、回滚、观察 |
| `06-decisions.md` | 长期架构 / 产品 / 技术决策 |
| `07-glossary.md` | 术语、缩写、领域语言 |
| `08-risks.md` | 已知风险、技术债、后续事项 |

## 最低完整度

Wiki 不能只写一句概述。对于存量项目画像或重要 work item 回写，目标文件必须达到对应的最低完整度；无法确认的内容写 `未确认`，并在 `08-risks.md` 记录缺口、证据来源和下一步补证方式。

| 文件 | 必须覆盖的当前事实 |
|---|---|
| `01-project-overview.md` | 项目定位、主要用户 / 使用场景、核心能力、明确边界、主要子系统、常见任务入口、当前接入状态、关键证据 |
| `02-product-rules.md` | 角色 / 权限、核心流程、审批 / 状态规则、业务约束、异常规则、规则证据 |
| `03-architecture.md` | 技术栈、运行形态、模块 / 服务边界、入口、关键依赖、主要数据流、同步 / 异步链路、外部集成、常用追踪路径、架构风险、证据 |
| `module-<name>.md` | 模块职责、入口文件、内部分层、上游 / 下游依赖、主要 API / 事件、数据读写、测试位置、运行注意事项、推荐检索词、风险 |
| `api-<domain>.md` | API 域、鉴权、基础路径、端点清单、请求 / 响应、错误码、分页 / 排序 / 幂等、调用方、实现路径、测试证据 |
| `04-data-model.md` | 数据库 / 存储、核心实体、表 / 模型字段、关系、索引 / 唯一约束、状态机、迁移、生命周期、读写入口、关联模块、风险 |
| `05-operations.md` | 环境变量、启动命令、构建、测试、数据库初始化、后台任务、部署、回滚、日志 / 监控、常见故障、验证入口 |
| `06-decisions.md` | 决策、状态、背景、选项、取舍、影响范围、回滚 / 复核条件、证据 |
| `07-glossary.md` | 术语、定义、代码中的命名、业务含义、容易混淆点、来源 |
| `08-risks.md` | 风险、影响、证据、当前缓解、owner、下一步、阻断状态 |

最低完整度不是要求编造信息。恰恰相反：如果架构、API、数据模型不完整，必须显式写出“缺什么、为什么缺、从哪里补”，而不是用笼统描述掩盖。

## 证据密度

- 架构事实至少引用入口 / 配置 / manifest / 路由 / 服务文件中的一种证据。
- API 事实至少引用路由定义、controller、OpenAPI、SDK、测试或调用方中的一种证据。
- 数据模型事实至少引用 schema、model、migration、repository、SQL、fixture 或测试中的一种证据。
- 运维事实至少引用 package script、Docker、CI、部署配置、env 示例、README 或脚本中的一种证据。
- 如果某类证据不存在，写 `未发现`，并说明扫描范围。
- 代码导航事实必须能帮助后续任务减少读取范围：路径、符号、命令、测试或检索词至少写一种，不能只写“参考源码”。

## Wiki-first 上下文策略

面向已有代码项目，后续 work item 的默认上下文顺序是：

1. 读取 `00-index.md`，判断本次请求可能关联的知识项。
2. 读取相关的产品规则、架构、模块、API、数据、运维、风险或设计系统文件。
3. 从 wiki 提取本次的入口路径、关键符号、上下游、测试位置和已知风险，形成读取计划。
4. 只在这些路径、符号或上游下游范围内使用 `rg`、provider、CodeGraph、Repomix 或文件阅读验证事实。
5. 发现 wiki 缺入口、过期、冲突或无法覆盖本次影响面时，停止扩大扫描，路由 `sf-steering` 或在当前阶段标记 `NEEDS CONTEXT`。

允许全量或近全量代码理解的情况只有：

- 首次接入存量项目，需要建立 wiki 基线。
- wiki 与当前代码冲突，无法判断当前事实。
- 本次请求没有明确业务域 / 模块 / 报错路径，且 wiki 也没有可用入口。
- 大型重构、架构迁移、安全审计等任务本身需要全局影响面。

即便触发上述情况，也应由 `sf-steering` 使用扫描模式和 provider 策略完成，不应由普通需求阶段临时全量读取代码。

## 按需知识项

| 命名 | 何时创建 |
|---|---|
| `module-<name>.md` | 单个模块的职责、依赖、内部接口、运行注意事项足够稳定，需要独立维护 |
| `api-<domain>.md` | 某个接口域包含多条 API / 事件 / Webhook / SDK 契约，需要集中汇总 |
| `design-system.md` | 项目形成稳定 UI 组件、token、视觉风格、Figma MCP / Pencil MCP / DESIGN.md 规则 |

## 何时回写

以下情况必须触发 wiki sync：

- 新增或改变长期 API、数据模型、权限模型、配置、部署、运行方式。
- PRD / requirements 确认了可复用的产品规则。
- 技术设计产生长期架构决策或重要偏离。
- bugfix 发现系统性根因、测试缺口或运维风险。
- 用户明确要求“更新 wiki / 回写知识库”。

以下情况通常不回写：

- 一次性任务执行细节。
- 临时调试日志。
- 未批准的方案草稿。
- 不会再次复用的实现备注。

## 写法

- 只写当前事实，不写历史流水账。
- 如果事实来自 work item，引用 work item id 和关键 artifact。
- 更新已有文件优先，不为同一主题创建重复文件。
- 旧事实被替代时直接改成当前状态，并保留必要决策理由。
- 每个文件必须有 frontmatter：`title`、`kind`、`owner`、`last_updated`、`source_work`、`status`。
- `00-index.md` 必须列出当前知识项，新增按需文件后同步索引。

frontmatter 语义：

| 字段 | 要求 |
|---|---|
| `title` | 人可读标题 |
| `kind` | `project` / `product-rules` / `architecture` / `module` / `api` / `design-system` / `data` / `operations` / `decisions` / `glossary` / `risks` |
| `owner` | 维护责任人；未知写 `TBD` |
| `last_updated` | 最近一次事实更新时间，格式 `YYYY-MM-DD` |
| `source_work` | 最近一次事实来源 work item id 或 `bootstrap` |
| `status` | 当前有效文件写 `current`；被替代文件不得继续作为 current 出现在索引 |

## 回写矩阵

| 来源变化 | 写入位置 | 不写入位置 |
|---|---|---|
| PRD / requirements 形成稳定业务规则 | `02-product-rules.md` | 不复制完整需求正文 |
| UI design 形成稳定设计系统或组件规则 | `design-system.md` | 不复制一次性线稿截图 |
| technical design 形成长期架构 / API / 数据 / 运维事实 | `03-architecture.md`、`api-<domain>.md`、`04-data-model.md`、`05-operations.md` | 不复制临时实现计划 |
| implementation 发现真实结构与设计不同 | 对应事实文件 + `06-decisions.md` | 不复制 commit diff |
| verification 暴露系统性风险或测试缺口 | `08-risks.md`、`05-operations.md` | 不复制完整测试日志 |
| close 形成发布 / 回滚 / 运行注意事项 | `05-operations.md`、`08-risks.md` | 不复制 release / rollback 全文 |

## Gate 标准

`wiki_sync` 可以批准的条件：

- 长期事实已写入对应 wiki 文件；或
- 当前 work item 明确没有长期知识影响，并写出 N/A 理由。

不得用“暂无需要”空过 gate。
