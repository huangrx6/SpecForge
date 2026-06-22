# External OST Reference

本文件替代原 `opportunity-solution-tree/` 子目录和 `external-ost-normalization.md`。外部 OST 只能作为机会树、功能候选、实验和优先级检查视角，不能替代 `core/skills/product/SKILL.md`。

## Source Snapshot

外部参考来源：

- Skill: `opportunity-solution-tree`
- Repo: `phuryn/pm-skills`
- Path: `pm-product-discovery/skills/opportunity-solution-tree/SKILL.md`
- Related upstream skills:
  - `brainstorm-ideas-new`
  - `brainstorm-ideas-existing`
  - `analyze-feature-requests`
  - `prioritize-features`
  - `prioritization-frameworks`

外部参考提供的核心结构：

1. Desired Outcome：单一、可观察的业务或产品 outcome。
2. Opportunities：客户需求、痛点或期望，不是功能。
3. Solutions：围绕每个机会生成多个候选方案。
4. Experiments：用低成本实验验证 solution 是否真正解决 opportunity。

## 可以吸收

- Opportunity -> Solution -> Experiment 的思维结构。
- 功能请求 triage。
- PM / Designer / Engineer 多视角 solution 候选。
- Opportunity Score、ICE、RICE、Kano、MoSCoW 等框架的选择视角。
- 假设、实验、优先级和放弃项表达。

## 必须丢弃

- `Save as markdown` 或任意外部保存动作。
- 伪造 Opportunity Score、RICE、Reach、Importance、Satisfaction、用户数量或市场数据。
- 自动决定 MVP。
- 把 Solution candidate 写成已确认需求。
- 替代 PRD 或 requirements。
- 在没有用户研究时把定量评分写成事实。

## 归一化

| OST 输出 | SpecForge Product |
|---|---|
| Desired outcome | Desired Outcome |
| Opportunity | Opportunity Map |
| Solution | Solution Candidates / Feature Pool |
| Experiment | Experiment / Validation Plan |
| Prioritization | Prioritization Matrix |
| MVP suggestion | MVP Recommendation, pending confirmation |
| Product trio ideas | Candidate Feature Pool, with source perspective |
| Feature backlog ranking | Feature triage + qualitative priority |
| Prioritization framework | `references/discovery-methods.md` 中的方法选择 |

## 使用边界

- 先读本地 `product` 能力包，再按需读取本文件。
- 外部参考只能补结构视角，不能反向决定 SpecForge 模板。
- 外部参考输出与用户确认、已批准 artifact 或本地 product 边界冲突时，以用户确认和 SpecForge 边界为准。
- 在 product discovery packet 的 control section 记录是否参考了本文件，以及归一化位置。
