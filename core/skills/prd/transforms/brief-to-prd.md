# Brief To PRD

| brief.md 字段 | PRD 位置 | 处理 |
|---|---|---|
| 用户目标 | Product Decision Summary / Background | 转成 Problem 和 Desired outcome |
| 推荐 workflow | PRD Control | 写 source workflow |
| PRD 决策 | PRD Control | 决定是否需要 PRD 和深度 |
| Brainstorm 决策 | Scope & MVP | 只采用 user-confirmed / delegated-default |
| 范围 In Scope | Candidate Feature Pool / Scope | 转成候选功能或 MVP |
| Out of Scope | Non-goals | 保留原因 |
| 关键未知 | Open Questions | 高影响未知阻断 |
| 影响面 flags | Handoff | 触发 ui / tech / data / security |

## Rules

- brief 里没有确认的内容不能写成已批准 PRD。
- Agent recommendation 只能进入候选，不进 MVP。
- 如果目标用户、核心问题、成功标准缺失，停止并提问。
- 如果 brief 和 brainstorm 冲突，以用户确认记录为准；冲突写入 Open Questions。

## Example

Bad:

```md
MVP：实现系统推荐的所有功能。
```

Good:

```md
| Feature | User value | Complexity | Risk | Recommendation | Confirmation |
|---|---|---|---|---|---|
| 到期提醒列表 | 降低漏跟进风险 | medium | 数据口径需确认 | MVP candidate | user-confirmed |
| 短信提醒 | 提升触达率 | medium | 成本和合规未确认 | candidate | pending |
```
