# Wiki 标准

本标准回答：哪些信息要进入项目级 Wiki，什么时候回写，如何保持最新。

## Wiki 定位

`.specforge/wiki/` 保存当前项目长期事实，不保存一次性过程记录。每一项知识使用一个单文件，文件名要见名知意。

核心约束：

- 一个知识项只有一个当前文件，使用 `status: current` 标识。
- 不创建按日期、版本号或 work item 命名的 wiki 文件。
- 事实变化时更新原文件；历史原因只在必要时写入 `decisions.md` 或目标文件的“决策背景”。

## 默认知识项

| 文件 | 内容 |
|---|---|
| `project-overview.md` | 项目目标、用户、当前状态 |
| `product-rules.md` | 稳定产品规则、角色、业务约束 |
| `architecture.md` | 系统结构、模块边界、技术栈、关键数据流 |
| `data-model.md` | 核心实体、表、关系、状态机 |
| `operations.md` | 环境、配置、启动、发布、回滚、观察 |
| `decisions.md` | 长期架构 / 产品 / 技术决策 |
| `glossary.md` | 术语、缩写、领域语言 |
| `risks.md` | 已知风险、技术债、后续事项 |

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
- `index.md` 必须列出当前知识项，新增按需文件后同步索引。

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
| PRD / requirements 形成稳定业务规则 | `product-rules.md` | 不复制完整需求正文 |
| UI design 形成稳定设计系统或组件规则 | `design-system.md` | 不复制一次性线稿截图 |
| technical design 形成长期架构 / API / 数据 / 运维事实 | `architecture.md`、`api-<domain>.md`、`data-model.md`、`operations.md` | 不复制临时实现计划 |
| implementation 发现真实结构与设计不同 | 对应事实文件 + `decisions.md` | 不复制 commit diff |
| verification 暴露系统性风险或测试缺口 | `risks.md`、`operations.md` | 不复制完整测试日志 |
| close 形成发布 / 回滚 / 运行注意事项 | `operations.md`、`risks.md` | 不复制 release / rollback 全文 |

## Gate 标准

`wiki_sync` 可以批准的条件：

- 长期事实已写入对应 wiki 文件；或
- 当前 work item 明确没有长期知识影响，并写出 N/A 理由。

不得用“暂无需要”空过 gate。
