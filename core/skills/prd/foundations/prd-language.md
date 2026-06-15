# PRD Language

PRD 写产品决策语言，不写工程规格语言。它解释 why / what / for whom / first version / success，而不是 how。

## 推荐写法

| 内容 | 写法 |
|---|---|
| 问题 | `目标用户在 <场景> 中无法 <完成目标>，导致 <代价>` |
| Outcome | `本版本希望让 <用户> 能够 <结果>，用 <指标> 观察` |
| MVP | `MVP 包含 <能力>，因为它直接支撑 <用户价值 / 业务目标>` |
| Non-goal | `本期不做 <能力>，避免 <风险 / 范围膨胀>；后续触发条件是 <条件>` |
| Success criteria | `用 <可观察指标> 判断是否改善 <问题>` |
| Handoff | `requirements 需要把 <种子> 转成可测试行为` |

## 禁止写法

- “系统必须使用 Redis / Vue / GraphQL / 某 SDK”。
- “按钮使用红色 badge / shadcn Table / 三列布局”。
- “REQ-001 / AC-001” 这类 requirements 编号。
- “执行 npm test / playwright 命令”。
- “智能、完善、高效、易用”但没有指标或观察证据。
- “按最佳实践实现”。

## Acceptance Seeds vs AC

PRD 可以写验收种子，但不能写最终 AC。

```md
Acceptance Seed:
- 客户经理打开提醒页面时，应能看到即将到期客户、到期时间、剩余天数和联系状态。
```

交给 requirements 后才转成 Given / When / Then 和 REQ / AC 编号。
