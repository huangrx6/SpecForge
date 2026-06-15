---
name: execution-planning
description: Brainstorm 包内的行动规划 skill。用于方向已推荐或用户已确认后，把 brainstorm 结果转成下一步路线、MVP 阶段、下游交接、验证入口、owner、阻断条件和回退点，但不直接编写 PRD、requirements、technical design 或 implementation tasks。
---

# 行动规划

本 skill 用于收尾。它把“我们倾向选什么”转成“下一步谁拿什么继续”，但不越权写下游 artifact。

## 前置输入

- `推荐方案` 和 `方案评估矩阵`。
- 用户确认记录；如果用户未确认，只能输出下一问题，不能写执行计划。
- `当前事实与研究证据` 中的未查证项。
- `批判质疑` 中需要验证、简化、拆分或研究的项。
- 已知的 workflow 路由：PRD、requirements、UI design、technical design、discovery research、verification。

## 执行步骤

1. 判断当前状态：已确认、agent recommendation、授权默认、仍需用户拍板。
2. 如果未确认，停止行动计划，输出一个最高优先级问题。
3. 如果已确认，选择下游阶段：`sf-prd`、`sf-requirements`、`sf-ui-design`、`sf-tech-design`、`sf-discovery`、`sf-verify`。
4. 写 MVP 路线：Now / Next / Later，明确不做什么。
5. 写交接：下游需要读取哪些输入、产出什么、阻断条件是什么。
6. 写验证入口：事实补证、原型验证、技术 spike、用户确认、回归测试。
7. 写回退点：如果推荐失败，退回到哪个方案或保守路径。

## 下一步行动

```md
## 下一步行动

| 步骤 | Owner | 输入 | 输出 | 进入条件 | 阻断条件 |
|---|---|---|---|---|---|
| | user / agent / sf-prd / sf-requirements / sf-ui-design / sf-tech-design / sf-discovery / sf-verify | | | | |
```

## MVP 路线图

```md
## MVP 路线图

| 阶段 | 做什么 | 不做什么 | 验证 |
|---|---|---|---|
| Now | | | |
| Next | | | |
| Later | | | |
```

## 交接规则

| 下游 | 必须交付的信息 | 不要交付 |
|---|---|---|
| PRD | 目标用户、问题、MVP、非目标、成功标准、开放问题 | 代码任务和技术细节 |
| Requirements | 已确认行为、验收问题、边界/异常、角色和权限线索 | 未确认方案 |
| UI design | 体验方向、页面/流程、状态、视觉约束、可访问性风险 | 未确认的审美偏好 |
| Technical design | 已确认技术方向、依赖决策、版本风险、集成约束、验证要求 | 未确认依赖或直接实现 |
| Discovery research | 未查证事实、已查来源、冲突、需要实验的问题 | 模糊“再研究一下” |
| Verification | 用户路径、关键断言、风险场景、证据强度 | 没有验收口径的测试 |

## 状态写法

| 状态 | 写法 |
|---|---|
| 用户已确认 | `User decision: confirmed`，写明原话或选择 |
| 用户授权默认 | `Delegated default`，写明推荐理由、风险、回退 |
| Agent 推荐 | `Agent recommendation`，不能写 approved |
| 仍需确认 | `[NEEDS ... DECISION]`，只问一个问题 |

## 质量门槛

- 没有用户确认或授权默认时，不写实现计划。
- 每个行动都要有 owner、输入、输出和进入条件。
- MVP 路线必须写“不做什么”。
- 需要 research / spike / prototype 的风险不能被隐藏在 Later。
- 下游交接要足以让对应 sf-* skill 继续，不需要重新猜。

## 常见失败

| 失败 | 表现 | 修正 |
|---|---|---|
| 直接写 tasks | brainstorm 结束就列实现任务 | 改为下游交接 |
| 缺少 owner | “下一步完善设计” | 写 owner 和产物 |
| 推荐变批准 | agent recommendation 被写成 confirmed | 分开状态 |
| Later 垃圾桶 | 风险都丢到 Later | 阻断项必须写进入条件 |

## 停止条件

- 用户尚未确认会改变范围、体验、架构、成本或安全的关键选择。
- 未查证事实会改变推荐。
- 下游阶段不明确，或当前输出不足以支撑任何下游。
