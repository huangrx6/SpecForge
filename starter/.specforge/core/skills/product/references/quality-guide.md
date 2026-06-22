# Product Discovery Quality Guide

本文件合并产品发现质量量表和反模式检查。写完 product discovery packet 后读取本文件，先修阻断问题，再修表达。

## Quality Rubric

| 检查项 | 通过标准 |
|---|---|
| Outcome clear | 有明确期望结果，而不是功能愿望 |
| Opportunity language | 机会从 pain / need / business result 出发 |
| Feature trace | 每个候选功能能回连 opportunity |
| Evidence marked | confirmed / likely / unclear 清楚 |
| Priority honest | 不伪造 RICE、baseline 或用户研究数据 |
| MVP recommendation bounded | 推荐不等于用户确认 |
| Experiment useful | 高风险项有验证假设和成功信号 |
| PRD handoff ready | PRD 可读取 outcome、feature pool、risk、open questions |

## Anti-patterns

| 反模式 | Fail signal | 为什么危险 | 修正 |
|---|---|---|---|
| Feature-first discovery | 直接列功能，没有 opportunity | 会优化错误问题 | 反推 pain / need |
| Fake score | 编造 RICE、reach、baseline | 误导 MVP 取舍 | 改 qualitative priority |
| MVP as recommendation | Agent 推荐写成已确认 MVP | 跳过用户决策 | 标记 mvp-recommended / needs user confirmation |
| Solution as opportunity | “做画像页面”被写成机会 | 问题空间被方案锁死 | 改写为用户无法判断优先级 |
| No experiment for risk | 高风险项直接 adopt | 失败代价不可控 | 写 experiment / research handoff |
| PRD leakage | 直接写完整 PRD | 阶段边界混乱 | 输出 Handoff To PRD |
| Requirements leakage | 写 MUST / SHALL / AC | 抢 requirements 职责 | 移到 PRD / requirements seeds |

## 修正顺序

1. 先修 outcome、opportunity 和 evidence。
2. 再修 feature trace、priority 和 MVP confirmation status。
3. 再修 experiment、risk 和 PRD handoff。
4. 最后删除 PRD、requirements、UI design 和 technical design 泄漏。
