# Brainstorm To Requirements

brainstorm 是取舍记录，不是 requirements。转译时只吸收已确认选择、授权默认、明确延后和事实证据。

## 读取位置

- `brainstorm.md#用户确认记录`
- `brainstorm.md#方案评估矩阵`
- `brainstorm.md#推荐方案`
- `brainstorm.md#明确延后 / 不做`
- `brainstorm.md#当前事实与研究证据`
- `brainstorm.md#未决问题`

## 转译规则

| Brainstorm 内容 | requirements 处理 |
|---|---|
| `user-confirmed` | 可转成 REQ / AC / NFR / non-goal |
| `delegated-default` | 可转成 REQ，但记录默认理由和回退点 |
| `agent-recommendation` | 只能进候选或 pending |
| `pending` | 写 `[NEEDS CLARIFICATION]` |
| 明确延后 / 不做 | 写 Out of Scope |
| 事实证据 confirmed | 写 constraint / NFR / risk |
| 事实证据 unclear | 写 pending 或 research blocker |

## 防误读规则

推荐方案不是已选方案；只有用户确认或授权默认后才能进入 MUST。
