# Product Discovery Methods

本文件集中维护优先级和实验方法。它只在需要排序、取舍或验证高风险候选时读取。

## Prioritization Methods

默认方法：Value / Effort / Risk / Confidence。

```md
| Feature | User value | Business value | Effort | Risk | Confidence | Recommendation |
|---|---|---|---|---|---|---|
```

Recommendation：

- adopt for MVP
- test first
- defer
- reject
- split into separate work item

可选方法：

| 方法 | 适用 |
|---|---|
| RICE | 有 reach / impact / confidence / effort 数据 |
| ICE | 快速排序，数据较少 |
| Kano | 区分 must-have / performance / delighter |
| MoSCoW | 需要和业务方快速确认 must / should / could / won't |
| Opportunity score | 有 importance / satisfaction 评分 |

规则：

- 数据不足时不要伪造 RICE 分数。
- 没有用户研究时只允许 qualitative priority。
- 高风险高价值项优先 test，不直接 adopt。
- 排序结果必须写放弃代价。

## Experiment Design

用于 product discovery 阶段验证 solution candidate。

```md
| Solution | Assumption | Risk type | Experiment | Success signal | Cost | Time |
|---|---|---|---|---|---|
```

Risk type：

- value
- usability
- feasibility
- viability
- compliance
- AI quality

实验类型：

- 用户访谈。
- clickable prototype。
- fake door。
- wizard-of-oz。
- data spike。
- manual ops pilot。
- A/B test。
- log analysis。
- AI evaluation set。

规则：

- 实验不是上线计划。
- 实验必须验证一个明确假设。
- 对 AI 功能，必须包含质量样本或人工复核策略。
- 对 B 端数据产品，必须验证数据可得性、口径和权限。
