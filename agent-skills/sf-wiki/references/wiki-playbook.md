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
- gate 命令 `APPROVED` 带 `--evidence 06-close/wiki-sync.md`。
