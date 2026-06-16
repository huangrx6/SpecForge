# Wiki 同步规则

本文件保存 wiki 回写判断、目标文件选择、frontmatter、index 对账和 gate 决策。`SKILL.md` 只保留入口和硬门禁。

## Wiki 定位

`.specforge/wiki/` 保存当前项目长期事实，不保存过程流水账。它还承担任务入口地图职责：后续需求、bugfix、实现、审查和验证应先从 wiki 找到代码入口，再顺链路补证。

| 可以进 wiki | 不进 wiki |
|---|---|
| 稳定产品规则 | 一次性需求全文 |
| 当前架构和模块边界 | 临时实现计划 |
| API / 数据 / 权限 / 配置契约 | 命令长日志 |
| 运行、发布、回滚、观察规则 | 截图、trace、测试原始输出 |
| 设计系统、token、PC 规范落地规则 | 一次性线稿细节 |
| 入口路径、关键符号、上下游、测试位置和推荐检索词 | 全仓代码摘要 |
| 长期决策、术语、风险、技术债 | 未批准草稿 |

## 回写矩阵

| 来源变化 | 目标文件 | 备注 |
|---|---|---|
| 项目目标、用户、整体状态 | `01-project-overview.md` | 当前状态，不写历史流水 |
| 产品规则、角色、权限、审批、状态机 | `02-product-rules.md` | 稳定规则和约束 |
| 架构、模块边界、技术栈、关键数据流 | `03-architecture.md` / `module-<name>.md` | 模块足够稳定时单独建 module 文件 |
| API、事件、Webhook、SDK 契约 | `api-<domain>.md` | 多条同域契约集中维护 |
| 对外接口总览、第三方集成、文件导入导出、CLI、公开前端入口 | `external-interfaces.md` / `integration-<system>.md` | 先写总览，再按域拆详情 |
| 核心实体、表、关系、状态、迁移注意事项 | `04-data-model.md` | 当前模型和生命周期 |
| 环境、配置、启动、任务、发布、回滚、观测 | `05-operations.md` | 运行规则和操作提示 |
| 配置、环境变量、secret、feature flag | `config-env.md` | 不写真实 secret 值 |
| 认证、授权、权限、敏感数据边界 | `security-auth.md` | 写 enforcement path 和失败行为 |
| 后台任务、队列、事件、定时任务 | `jobs-events.md` | 写 trigger、handler、retry / DLQ、测试 |
| 稳定 UI 组件、token、设计系统、PC 业务系统规范 | `design-system.md` | 不复制一次性 Pencil 截图 |
| 长期架构 / 产品 / 技术决策 | `06-decisions.md` | 包含必要背景和取舍 |
| 术语、缩写、领域语言 | `07-glossary.md` | 当前定义 |
| 已知风险、技术债、后续事项 | `08-risks.md` | 来自 verification / review / close |

## 机器回写计划

写 `06-close/wiki-sync.md` 或判断 N/A 前，必须先运行：

```bash
node .specforge/core/scripts/wiki-update-plan.mjs --json
```

输出中的字段具有 gate 约束：

| 字段 | 约束 |
|---|---|
| `wiki_state` | 若为 `missing` / `bootstrap` 且当前 work item 已验证，必须先 hydrate 核心 wiki。 |
| `long_term_fact_candidates` | 必须逐项写入长期事实候选矩阵，不能只写“无影响”。 |
| `required_targets` | 必须更新或写阻断原因。 |
| `can_write_na` | 为 `false` 时禁止写 `N/A - 无长期事实`。 |
| `blocking_gaps` | 必须进入“未确认项 / 风险”或被修复。 |

可用快速 hydration 命令：

```bash
node .specforge/core/scripts/wiki-hydrate.mjs --mode close --write
node .specforge/core/scripts/wiki-quality.mjs --mode close
```

## Wiki 质量清单

回写或建立存量项目画像时，不能只写摘要。每个目标文件至少回答下面的问题；回答不了就写 `未确认`，并把缺口写入 `08-risks.md`。

### 01-project-overview.md

- 这个项目解决什么问题，主要给谁用。
- 当前包含哪些核心能力，明确不包含什么。
- 主要子系统 / 应用 / 服务是什么。
- 常见任务应该先看哪些 wiki / 模块 / 路径。
- 当前接入状态：新项目、存量项目、迁移中、维护中。
- 证据：README、入口、配置、用户确认或 steering report。

### 03-architecture.md

- 技术栈和运行形态：前端、后端、任务、数据库、部署方式。
- 模块 / 服务边界：每个模块职责、入口、所有者未知时写 TBD。
- 关键链路：请求入口到服务 / 数据 / 外部系统的路径。
- 同步 / 异步机制：HTTP、RPC、队列、定时任务、事件、文件。
- 外部集成和鉴权边界。
- 后续任务的追踪入口：关键路径、关键符号 / 路由、推荐检索词。
- 架构风险和未确认点。
- 证据：manifest、路由、启动脚本、配置、provider 查询、关键源码。

### module-<name>.md

- 模块职责和边界。
- 入口文件、主要目录、内部分层。
- 上游调用方和下游依赖。
- API / 事件 / 任务入口。
- 数据读写和外部集成。
- 测试位置、运行注意事项、风险。
- 推荐检索词和常见变更入口。

### api-<domain>.md

- API 域、base path、鉴权方式。
- 端点清单：method、path、用途、处理器、调用方。
- 请求参数、响应结构、错误码、分页 / 排序 / 幂等规则。
- 相关 DTO / schema / OpenAPI / SDK。
- 实现路径、调用方、测试覆盖和未覆盖项。

### external-interfaces.md

- 接口范围：Inbound HTTP API、Webhook、GraphQL / RPC / gRPC、CLI、SDK、文件导入导出、第三方调用、事件消息、公开前端入口。
- 入站 API 索引：方法、路径、领域、鉴权、处理入口、服务、请求 / 响应、错误、测试、证据、置信度。
- 出站集成索引：系统、用途、客户端 / 适配器、鉴权 / 配置、重试 / 超时、失败行为、测试、证据、置信度。
- 文件导入 / 导出契约：格式、生产者、消费者、校验、错误处理、证据。
- 事件 / 队列 / 消息契约：topic、方向、生产者、消费者、载荷、重试 / 死信队列、证据。
- 未确认接口缺口：缺口、影响、已扫证据、下一证据来源、负责人。

### 04-data-model.md

- 当前数据权威：ORM schema、migration tool、runtime model、DB init 或用户确认来源。
- 数据库 / 存储类型和连接配置来源。
- 核心实体和表 / 模型字段。
- 表关系、主键、外键、唯一约束、索引。
- 状态字段和状态机。
- 迁移方式、初始化脚本、种子数据。
- 读写入口：repository、service、SQL、ORM model。
- 数据生命周期、归档 / 删除 / 审计规则、风险。
- 关联模块和推荐追踪入口。
- 历史 / 未受信 SQL 产物：历史 SQL、旧 DDL、dump、backup、legacy 文件必须写在这里或 `08-risks.md`，不能直接写成当前实体 / 表。

### config-env.md

- 运行时配置来源：env、config file、secret manager、feature flag。
- 环境变量：名称、用途、是否必填、默认值 / 示例、负责人、证据、风险。
- 功能开关：默认值、灰度、熔断、证据。
- 配置缺口、影响、已扫证据和下一证据来源。

### security-auth.md

- 认证机制、入口 / 中间件、token / session、证据、置信度。
- 授权：资源 / 操作、角色 / 策略、执行路径、失败行为。
- 敏感数据边界：分类、存储 / 传输、脱敏 / 遮蔽。
- 安全风险、影响、已扫证据和下一证据来源。

### jobs-events.md

- 后台任务：触发、处理入口、调度 / 队列、重试 / 超时、测试、证据。
- 事件 / 队列 / 消息契约：方向、生产者、消费者、载荷、重试 / 死信队列。
- 定时调度：调度、用途、入口、失败行为。
- 任务 / 事件风险和未确认缺口。

## 证据可信度规则

| 等级 | 证据 | 能否写为当前事实 |
|---|---|---|
| A | 当前运行入口、路由、controller、service、repository、ORM model、migration config、tests、CI | 可以 |
| B | 当前技术设计、实现报告、验证报告、代码审查证据 | 已验证时可以 |
| C | README、文档、注释、历史 SQL、旧 DDL、未引用脚本 | 不可以，除非有 A/B 级证据交叉确认 |
| D | 目录名、文件名、Agent 推测、未验证图谱结果 | 不可以 |

SQL / DDL / dump 文件默认不是当前事实。只有满足以下任一条件，才能作为当前数据证据：

- 被当前 migration 工具引用。
- 被 package script / Makefile / Docker init / CI 引用。
- 被代码读取或执行。
- 被测试 fixture 使用。
- 被用户确认仍是当前 schema 来源。

否则只能写入 `04-data-model.md#历史--未受信-sql-产物`、`08-risks.md` 或未确认缺口。

### 05-operations.md

- 本地启动、构建、测试、lint、typecheck 命令。
- 环境变量和配置文件来源。
- 数据库 / 队列 / 缓存初始化。
- 部署、回滚、CI、日志、监控、告警。
- 常见故障和排查入口。
- 后续验证应优先使用的命令和证据入口。

## 来源证据优先级

优先使用已批准且验证过的事实：

1. `05-verification/report.md`
2. `04-code-review/code-review-v1.md`
3. `03-implementation/report.md`
4. `01-spec/technical-design.md` / `ui-design.md`
5. `01-spec/requirements.md` / `gap-report.md`
6. `00-intake/prd.md` / `brief.md`
7. `00-steering/codebase-intelligence.md`

若上游草稿与已验证结果冲突，以已验证结果为准，并在 `06-decisions.md` 或目标文件中保留必要理由。

## Frontmatter

每个 wiki 文件必须保留：

```yaml
---
title: 标题
kind: project / product-rules / architecture / module / api / design-system / data / operations / decisions / glossary / risks
owner: TBD
last_updated: YYYY-MM-DD
source_work: work-id-or-bootstrap
status: current
---
```

更新文件时刷新：

- `last_updated`
- `source_work`
- 必要时 `title` / `kind`

不要删除 owner；未知保留 `TBD`。

## Design System / PC 规范回写

当 work item 确认或落地了稳定 UI 规则时，更新 `design-system.md`。

可以写：

- 已采用的 PC 端业务系统规范。
- 核心 token：主色、字体、字号 / 行高、控件尺寸、表格、弹窗、抽屉。
- 项目组件用法和禁用模式。
- Pencil / UI design 形成的稳定页面规则。

不要写：

- 一次性页面截图。
- 未确认的候选风格。
- 外部 skill 模板原文。

## Index 对账

更新 `.specforge/wiki/00-index.md`：

- 当前项目摘要需要反映重要变化。
- 新增 wiki 文件加入索引。
- 被替代文件不得继续作为 current 出现。
- 同一知识项只保留一个 current 链接。

## 冲突处理

| 情况 | 处理 |
|---|---|
| 新事实替代旧事实 | 更新原文件，必要理由写到 `06-decisions.md` |
| 新事实只是一次性补丁 | 不更新 wiki，写 N/A |
| 同一主题已有文件 | 更新已有文件，不新建 v2 |
| 无法判断哪个事实为准 | `REQUEST_CHANGES`，不要批准 gate |
| 用户要求写个人知识库 / Obsidian | 这不是 `.specforge/wiki`，需要另按用户指定位置处理 |

## Gate 决策

| 状态 | 使用条件 |
|---|---|
| `APPROVED` | 长期事实已更新，或无长期影响且 N/A 理由具体 |
| `REQUEST_CHANGES` | 事实证据缺失、冲突未解决、index / frontmatter 不完整 |

批准前自检：

- `06-close/wiki-sync.md` 已填写。
- `wiki-update-plan` 已运行，且 `can_write_na=false` 时没有写 N/A。
- 更新文件 frontmatter 完整。
- `00-index.md` 同步。
- 没有重复 current 文件。
- 不更新原因具体，不是“暂无”。
- 目标文件满足“Wiki 质量清单”；不足项已写入 `08-risks.md` 或 `wiki-sync.md#不更新原因`。
- `wiki-quality.mjs --mode close` 无 `FAIL`。
- gate 命令 `APPROVED` 带 `--evidence 06-close/wiki-sync.md`。
