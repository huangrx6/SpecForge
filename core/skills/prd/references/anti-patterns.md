# PRD Anti-patterns

| 反模式 | Fail signal | 为什么危险 | 修正 |
|---|---|---|---|
| Generic PRD template dump | 套 Summary / Market / Release 但不接 SpecForge graph | 下游 requirements 不能用 | 改为 Product Decision Summary + Handoff |
| Feature list as PRD | 只有功能清单 | 看不出为什么做和怎么取舍 | 补 Problem / Outcome / MVP rationale |
| Recommendation as decision | Agent 推荐直接写 MVP | 跳过用户确认 | 改成 candidate 或 delegated-default |
| Requirements leakage | 写 REQ / AC / API / DB | 阶段边界混乱 | 移到 requirements / tech-design |
| No non-goals | 没有明确不做 | 实现阶段范围膨胀 | 写 Non-goals 和后续触发条件 |
| Metric theater | 指标都是“提升体验” | 不可判断成功 | 写可观察业务 / 用户 / 质量指标 |
| AI magic | 写“智能识别 / 自动生成” | 不可验收 | 写输入、输出、评估、人工兜底 |
| B2B data blind spot | 不写数据来源、口径、权限 | 后续技术和验收会错 | 写 Data & Compliance Snapshot |

## Fix Order

1. 先修 Decision Status 和 confirmation。
2. 再修 Problem / User / MVP / Non-goals。
3. 再修 Metrics / Risk / Handoff。
4. 最后删除 PRD 中的 requirements / UI / technical design 泄漏。
