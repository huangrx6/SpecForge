# Brainstorm

## 问题框架

- 用户目标：
- 目标用户：
- 业务结果：
- 约束：
- 本轮只确认的唯一高影响问题：
- 输出预算：compact / standard / full

## 当前事实与研究证据

| 事实 / 结论 | 来源 / 证据 | 日期 | 对决策的影响 |
|---|---|---|---|

## 问题地图

> `[必须确认]` 按优先级排序：核心目标/范围 > 体验方向 > 数据与安全 > 集成与依赖 > 交付验收。若不确定是否可安全默认，归入 `[必须确认]`。

| 类型 | 优先级维度 | 内容 | 状态 | 处理方式 |
|---|---|---|---|---|
| 已明确 | N/A | | confirmed | |
| 必须确认 | 核心目标/范围 / 体验方向 / 数据与安全 / 集成与依赖 / 交付验收 | | pending / confirmed / delegated_default | NEEDS_DECISION marker if unresolved |
| 可安全默认 | N/A | | defaulted | 默认理由、风险和回退点 |

## 第三方 Skill 使用记录

| Skill | 读取内容 | 提取结果 | 归一化到 | 不能替代的确认 |
|---|---|---|---|---|
| opportunity-solution-tree / ux-designer / deep-research / user-stories / create-prd / playwright-skill / N/A | SKILL.md / references or rules path | 候选方案 / 风险提示 / 访谈镜头 / 研究问题 / 验收问题 / 后续阶段输入 | 问题地图 / 方案对比 / research / UI design 输入 / requirements 输入 / verification 输入 / N/A | 用户确认 MVP / UI 方向 / 技术路线 / 依赖 / 工具链 / 验收口径 |

## 方案对比

| 方案 | 用户价值 | 成本 | 风险 | 适用条件 | 放弃代价 |
|---|---|---|---|---|---|

## 决策队列

> 一次只推进一个会改变方向的问题。已确认后再处理下一项。

| 顺序 | 问题 | 影响维度 | 选项 | 当前状态 | 下一步 |
|---|---|---|---|---|---|
| 1 | | 核心目标/范围 / 体验方向 / 数据与安全 / 集成与依赖 / 交付验收 | | pending / confirmed / delegated_default | |

## 推荐方案

- Agent recommendation：
- 不推荐：
- 原因：

## 用户确认记录

| 问题 | 优先级维度 | 选项 / 推荐 | 用户答案 | 确认状态 / 标记 | 影响 |
|---|---|---|---|---|---|

## UI / 体验方向确认

| 项 | 结论 |
|---|---|
| UI Direction Status | pending / confirmed |
| Confirmation marker | real confirmation marker only after user confirms / N/A |
| Design Mode | Product UI / Brand Surface / Hybrid / N/A |
| 管理端组件策略 | 现有设计系统 / PC 业务系统规范 / shadcn 封装组件 / N/A |
| 用户选择的体验方向 | |
| 明确放弃的方向 | |
| 对 ui_design 的影响 | |

## 技术路线确认

| 项 | 结论 |
|---|---|
| Tech Direction Status | pending / confirmed / delegated_default / scaffold_confirmed |
| Confirmation marker | real confirmation marker only after user confirms / N/A |
| Dependency Decision Status | pending / confirmed / delegated_default / scaffold_confirmed / not_required |
| Dependency marker | real dependency marker only after user confirms or when confirmation is required / N/A |
| Tooling Decision Status | pending / confirmed / delegated_default / existing_stack / scaffold_confirmed / not_required |
| Tooling marker | real tooling marker only after user confirms or when confirmation is required / N/A |
| 用户选择的技术路线 | |
| 明确放弃的技术路线 | |
| Package / SDK decision summary | |
| 工具链选择摘要 | |
| 对 technical_design 的影响 | |

## 明确延后 / 不做

- 延后：
- 不做：

## 未决问题

- NEEDS_DECISION marker if unresolved

## 下一步路由

- Route to:
- Reason:
