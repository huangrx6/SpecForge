# sf-wiki 参考手册

本文件保存 wiki 回写判断、目标文件选择、frontmatter、index 对账和 gate 决策。`SKILL.md` 只保留入口和硬门禁。

## Wiki 定位

`.specforge/wiki/` 保存当前项目长期事实，不保存过程流水账。

| 可以进 wiki | 不进 wiki |
|---|---|
| 稳定产品规则 | 一次性需求全文 |
| 当前架构和模块边界 | 临时实现计划 |
| API / 数据 / 权限 / 配置契约 | 命令长日志 |
| 运行、发布、回滚、观察规则 | 截图、trace、测试原始输出 |
| 设计系统、token、PC 规范落地规则 | 一次性线稿细节 |
| 长期决策、术语、风险、技术债 | 未批准草稿 |

## 回写矩阵

| 来源变化 | 目标文件 | 备注 |
|---|---|---|
| 项目目标、用户、整体状态 | `project-overview.md` | 当前状态，不写历史流水 |
| 产品规则、角色、权限、审批、状态机 | `product-rules.md` | 稳定规则和约束 |
| 架构、模块边界、技术栈、关键数据流 | `architecture.md` / `module-<name>.md` | 模块足够稳定时单独建 module 文件 |
| API、事件、Webhook、SDK 契约 | `api-<domain>.md` | 多条同域契约集中维护 |
| 核心实体、表、关系、状态、迁移注意事项 | `data-model.md` | 当前模型和生命周期 |
| 环境、配置、启动、任务、发布、回滚、观测 | `operations.md` | 运行规则和操作提示 |
| 稳定 UI 组件、token、设计系统、PC 业务系统规范 | `design-system.md` | 不复制一次性 Pencil 截图 |
| 长期架构 / 产品 / 技术决策 | `decisions.md` | 包含必要背景和取舍 |
| 术语、缩写、领域语言 | `glossary.md` | 当前定义 |
| 已知风险、技术债、后续事项 | `risks.md` | 来自 verification / review / close |

## Wiki 质量清单

回写或建立存量项目画像时，不能只写摘要。每个目标文件至少回答下面的问题；回答不了就写 `未确认`，并把缺口写入 `risks.md`。

### project-overview.md

- 这个项目解决什么问题，主要给谁用。
- 当前包含哪些核心能力，明确不包含什么。
- 主要子系统 / 应用 / 服务是什么。
- 当前接入状态：新项目、存量项目、迁移中、维护中。
- 证据：README、入口、配置、用户确认或 steering report。

### architecture.md

- 技术栈和运行形态：前端、后端、任务、数据库、部署方式。
- 模块 / 服务边界：每个模块职责、入口、所有者未知时写 TBD。
- 关键链路：请求入口到服务 / 数据 / 外部系统的路径。
- 同步 / 异步机制：HTTP、RPC、队列、定时任务、事件、文件。
- 外部集成和鉴权边界。
- 架构风险和未确认点。
- 证据：manifest、路由、启动脚本、配置、provider 查询、关键源码。

### module-<name>.md

- 模块职责和边界。
- 入口文件、主要目录、内部分层。
- 上游调用方和下游依赖。
- API / 事件 / 任务入口。
- 数据读写和外部集成。
- 测试位置、运行注意事项、风险。

### api-<domain>.md

- API 域、base path、鉴权方式。
- 端点清单：method、path、用途、处理器、调用方。
- 请求参数、响应结构、错误码、分页 / 排序 / 幂等规则。
- 相关 DTO / schema / OpenAPI / SDK。
- 测试覆盖和未覆盖项。

### data-model.md

- 数据库 / 存储类型和连接配置来源。
- 核心实体和表 / 模型字段。
- 表关系、主键、外键、唯一约束、索引。
- 状态字段和状态机。
- 迁移方式、初始化脚本、种子数据。
- 读写入口：repository、service、SQL、ORM model。
- 数据生命周期、归档 / 删除 / 审计规则、风险。

### operations.md

- 本地启动、构建、测试、lint、typecheck 命令。
- 环境变量和配置文件来源。
- 数据库 / 队列 / 缓存初始化。
- 部署、回滚、CI、日志、监控、告警。
- 常见故障和排查入口。

## 来源证据优先级

优先使用已批准且验证过的事实：

1. `05-verification/report.md`
2. `04-code-review/code-review-v1.md`
3. `03-implementation/report.md`
4. `01-spec/technical-design.md` / `ui-design.md`
5. `01-spec/requirements.md` / `gap-report.md`
6. `00-intake/prd.md` / `brief.md`
7. `00-steering/codebase-intelligence.md`

若上游草稿与已验证结果冲突，以已验证结果为准，并在 `decisions.md` 或目标文件中保留必要理由。

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

更新 `.specforge/wiki/index.md`：

- 当前项目摘要需要反映重要变化。
- 新增 wiki 文件加入索引。
- 被替代文件不得继续作为 current 出现。
- 同一知识项只保留一个 current 链接。

## 冲突处理

| 情况 | 处理 |
|---|---|
| 新事实替代旧事实 | 更新原文件，必要理由写到 `decisions.md` |
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
- 更新文件 frontmatter 完整。
- `index.md` 同步。
- 没有重复 current 文件。
- 不更新原因具体，不是“暂无”。
- 目标文件满足“Wiki 质量清单”；不足项已写入 `risks.md` 或 `wiki-sync.md#不更新原因`。
- gate 命令 `APPROVED` 带 `--evidence 06-close/wiki-sync.md`。
