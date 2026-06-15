# Product Discovery To PRD

| Product discovery 内容 | PRD 位置 |
|---|---|
| Desired outcome | Product Decision Summary / Metrics |
| Opportunity | Problem / Background / Candidate Feature Pool |
| Solution candidate | Candidate Feature Pool |
| Experiment | Risks / Roadmap / Validation |
| Prioritization score | Scope & MVP Decision rationale |
| Open evidence gap | Open Questions / research-needed |

## Rules

- Opportunity 不是功能，不能直接写成 MVP。
- Solution candidate 不是已确认范围，必须经过用户确认或 delegated-default。
- Experiment 不等于 release plan，只能作为 validation 或 research handoff。
- 没有 evidence 的 opportunity 只能写 likely / assumption，不写 confirmed。

## Example

```md
Opportunity: 客户经理无法快速判断哪些客户最需要优先跟进。
Solution candidate: 到期提醒列表 + 优先级排序。
PRD MVP decision: 到期提醒列表进入 MVP；自动排序作为 optional，因优先级口径未确认。
```
