---
name: product
description: SpecForge 产品发现能力包。用于把模糊产品想法、用户反馈、业务问题、候选功能和数据事实整理成 opportunity map、feature pool、MVP recommendation、experiment plan 和 PRD handoff。
---

# Product Discovery System Skill

本 skill 负责把模糊产品想法、用户反馈、业务问题、候选功能和数据事实整理成 product discovery packet。

它回答：

- 我们追求什么 outcome？
- 用户机会是什么？
- 候选 solution 有哪些？
- 哪些功能建议进入 MVP？
- 哪些需要实验或研究？
- 哪些可以交给 PRD？

它不直接写完整 PRD，不替用户确认 MVP，不写 requirements，不写 UI design，不写技术方案。

## Product 负责

- 从问题空间出发。
- 识别机会，而不是直接堆功能。
- 形成候选功能池。
- 做 MVP 取舍建议。
- 设计验证实验。
- 给 brainstorm / PRD 提供输入。

## Product 不负责

- 不写完整 PRD。
- 不写 requirements。
- 不写 UI design。
- 不写技术方案。
- 不替用户确认 MVP。
- 不伪造用户研究数据。

## 读取顺序

1. 读取 `foundations/product-discovery-boundary.md`，确认阶段边界和确认状态。
2. 读取 `foundations/opportunity-language.md`，把功能请求反推为机会。
3. 读取 `foundations/outcome-metric.md` 和 `foundations/evidence-levels.md`，建立 outcome 和 evidence confidence。
4. 读取 `references/output-contract.md`，选择 compact / standard / full。
5. 读取 `transforms/request-to-opportunity-map.md`。
6. 有用户反馈或功能请求时读 `transforms/feedback-to-feature-pool.md`。
7. 有 brainstorm 输入时读 `transforms/brainstorm-to-product-discovery.md`。
8. 需要进入 PRD 时读 `transforms/product-discovery-to-prd.md`。
9. 按场景读取 1-2 个 `patterns/*.md`。
10. 需要优先级时读取 `references/prioritization-methods.md`。
11. 需要验证时读取 `references/experiment-design.md`。
12. 写完后读取 `references/quality-rubric.md` 和 `references/anti-patterns.md`。
13. 如果参考外部 `opportunity-solution-tree`，读 `references/external-ost-normalization.md`。

## 输出

- Desired Outcome
- Opportunity Map
- Candidate Feature Pool
- Solution Candidates
- Prioritization Matrix
- Experiment / Validation Plan
- MVP Recommendation
- Open Questions
- Handoff To Brainstorm / PRD / Research

## 完成标准

- 功能请求已回连到 opportunity。
- 每个 MVP recommendation 都标明 confidence 和 confirmation 状态。
- 数据不足时没有伪造 score、baseline 或 target。
- 高风险候选有 experiment / research handoff。
- Handoff 能被 `sf-brainstorm` 或 `sf-prd` 直接读取。
