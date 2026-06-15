# Confirmation Boundary

本文件定义 requirements 如何处理上游确认状态。目标是防止 Agent recommendation 被写成用户已批准需求。

## 确认类型

| 类型 | 含义 | 可进入 MUST / SHALL | requirements 处理 |
|---|---|---|---|
| `user-confirmed` | 用户明确选择、确认、批准或修正后的结论 | yes | 可写入 REQ / AC / NFR / non-goal |
| `delegated-default` | 用户授权 Agent 按推荐默认执行 | yes, with risk note | 可写入 REQ，但要记录默认理由、风险和回退点 |
| `agent-recommendation` | Agent 推荐，用户未确认 | no | 只能写入候选、pending 或待确认问题 |
| `pending` | 未决、冲突或缺证据 | no | 写 `[NEEDS CLARIFICATION]` 或对应 decision marker |
| `existing-stack` | 代码库或 wiki 已证明的现有约束 | yes, as constraint | 写约束或 NFR，保留来源 |
| `not-required` | 已确认不需要 | no | 写入非目标或 N/A 理由 |

## 转译规则

- `user-confirmed` 和 `delegated-default` 可以进入需求正文。
- `agent-recommendation` 不能写成 `THE SYSTEM SHALL...`。
- `pending` 不得被降级成“默认先做”；必须保留阻断或下游 owner。
- 如果 brainstorm / PRD / brief 中只有推荐没有确认，requirements 应停止或写待澄清项。
- 任何进入 requirements 的行为都必须有来源：文件、表格行、用户回答或 wiki 事实。

## 输出格式

```md
## 1. 上游确认输入

| 来源 | 决策 / 事实 | 确认类型 | 可进入需求 | 处理 |
|---|---|---|---|---|
| brainstorm.md#用户确认记录 | | user-confirmed / delegated-default / agent-recommendation / pending | yes / no | REQ / AC / NFR / non-goal / pending |
```
