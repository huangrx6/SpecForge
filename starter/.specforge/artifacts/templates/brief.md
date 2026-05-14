# Brief

## 摘要

## 变更类型

> 按 work item kind 分类；bugfix、refactor、discovery 不应被写成“新增功能变更”。

| 分类项 | 结论 | 理由 |
|---|---|---|
| Work item kind | feature / bugfix / refactor / discovery / lite / standard / mixed | |
| 推荐 workflow | feature / bugfix / refactor / discovery / lite / standard | |
| 是否需要拆分多个 work item | yes / no | |
| 是否扩展已有 active work item | yes / no | |

## 建议 Workflow

## 分析深度

- 档位：light / standard / deep
- 理由：

## 需求理解

- 目标：
- 角色：
- 业务结果：
- 关键实体 / 概念：

## 代码库探索

- 相关规范：
- 相关模块：
- 现有模式：
- 可复用部分：
- 跳过原因（如适用）：

## 外部资源研究

- 是否触发：
- 触发原因：
- 来源：
- 关键结论：
- 跳过原因（如适用）：

## 澄清记录

| 问题 | 选项 / 推荐 | 用户答案 | 影响 |
|---|---|---|---|

## 初始范围

## 影响面矩阵

| 影响面 | 是否涉及 | 证据 / 说明 | 后续 artifact |
|---|---|---|---|
| UI / UX / 页面 / 组件 | yes / no | | ui_design / N/A |
| Frontend engineering | yes / no | | technical_design / N/A |
| Backend service | yes / no | | technical_design / N/A |
| API / SDK / Events | yes / no | | technical_design / N/A |
| Data / DB / Migration | yes / no | | technical_design / N/A |
| Auth / Permission / Security | yes / no | | technical_design / N/A |
| Config / Delivery / Runtime | yes / no | | technical_design / N/A |

## Components Flags

> 与 `work-item.yaml` 中的 `components` 保持一致。`auto` 表示尚未确认，流程会保守保留对应 artifact；明确 `false` 才会跳过条件阶段。

| Flag | Value | 依据 |
|---|---|---|
| has_ui | auto / true / false | |
| has_api | auto / true / false | |
| has_db | auto / true / false | |
| has_domain | auto / true / false | |
| has_nfr | auto / true / false | |
| has_security | auto / true / false | |
| has_infra | auto / true / false | |
| has_background_job | auto / true / false | |
| needs_research | true / false | |
| Tests / Verification only | yes / no | | tasks / verification |

## 功能候选池

| 功能 | 建议阶段 | 用户价值 | 复杂度 | 风险 / 依赖 | 默认建议 |
|---|---|---|---|---|---|

## 用户选择

- 已确认纳入 MVP：
- 明确延后：
- 用户补充：
- Agent 默认假设：

## 不在范围内

## 边界候选

## 上游 / 下游

## 约束

## 分析综合

- 范围推导：
- 风险推导：
- Workflow 推导：
- 下一步：

## 待澄清项

- [NEEDS CLARIFICATION: question]
