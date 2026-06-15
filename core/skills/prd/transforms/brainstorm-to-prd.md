# Brainstorm To PRD

| brainstorm 内容 | PRD 位置 |
|---|---|
| 用户确认记录 | Scope & MVP Decision |
| 明确延后 / 不做 | Non-goals / Roadmap |
| 推荐方案 | Candidate Feature Pool，不能直接变 MVP |
| 方案评估矩阵 | Scope rationale |
| 当前事实与研究证据 | Background / Risk |
| 下一步路由 | Handoff |

## 禁止

- 不把 Agent recommendation 写成用户选择。
- 不把 pending 问题包装成默认假设。
- 不复制完整 brainstorm 过程，只提取决策、依据和未决问题。
- 不把方案评估矩阵里的 adopt 直接等于 user-confirmed。

## Confirmation Mapping

| Brainstorm confirmation type | PRD handling |
|---|---|
| `user-confirmed` | 可进入 MVP / non-goal / success criteria |
| `delegated-default` | 可进入 MVP，但写 risk note / rollback point |
| `agent-recommendation` | 进入 candidate feature pool |
| `pending` | 进入 Open Questions |

## Output Snippet

```md
| Item | Phase | Decision | Rationale | Source |
|---|---|---|---|---|
| 到期提醒列表 | MVP | user-confirmed | 直接支撑客户经理提前跟进 | brainstorm.md#用户确认记录 |
| 自动短信提醒 | later | pending | 成本、合规和发送频率未确认 | brainstorm.md#方案评估矩阵 |
```
