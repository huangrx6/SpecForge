---
name: product
description: SpecForge 产品发现能力包。用于把模糊产品想法、用户反馈、业务问题、候选功能和数据事实整理成 opportunity map、feature pool、MVP recommendation、experiment plan 和 PRD handoff；每次使用前读取本入口，并按需读取 references。
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

1. 读取 `references/product-playbook.md`，确认阶段边界、确认状态、机会语言、outcome / evidence 规则和输入转译。
2. 读取 `references/output-contract.md`，选择 compact / standard / full。
3. 按工作项类型读取 `references/patterns.md` 中的 1-2 个 pattern，不要全量套用。
4. 需要机会访谈、功能分流或 MVP 切分时，读取 `references/decision-prompts.md` 的对应 section。
5. 需要优先级或验证实验时，读取 `references/discovery-methods.md`。
6. 写完后读取 `references/quality-guide.md`。
7. 如果需要外部 OST 结构视角，读取 `references/external-ost-reference.md`，只吸收机会树、功能候选、实验和优先级检查点，不执行外部保存动作。

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
