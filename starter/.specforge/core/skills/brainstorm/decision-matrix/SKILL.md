---
name: decision-matrix
description: Brainstorm package skill for scoring and selecting among brainstorm options. Use when there are multiple directions and the agent must compare value, cost, novelty, risk, feasibility, extensibility, confidence, and next-step fit without pretending recommendations are user approval.
---

# Decision Matrix

Use this skill after divergent options and critic review. It turns ideas into a transparent recommendation.

## Default Criteria

Score 1-5. Higher is better except cost and risk, which should be inverted in the total.

| Criterion | Meaning |
|---|---|
| Value | How much it solves the real problem |
| Cost | Implementation and coordination effort |
| Novelty | Differentiation or new insight |
| Risk | Security, complexity, product, or adoption risk |
| Feasibility | Can it be done soon with available context |
| Extensibility | Can it evolve without rework |
| Confidence | Strength of evidence and assumptions |

## Output

```md
## 方案评估矩阵

| 方案 | 价值 | 成本 | 新颖度 | 风险 | 落地性 | 可扩展性 | 置信度 | 推荐 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| | | | | | | | | adopt / test / defer / reject |
```

## Recommendation

```md
## 推荐方案

- 推荐：
- 为什么现在选它：
- 不选其他方案的原因：
- 需要用户确认：
- 下一步验证：
```

## Rules

- Do not hide tradeoffs behind a single total score.
- Mark missing evidence as lower confidence, not as failure.
- User confirmation is separate from agent recommendation.
- If two options are close, recommend a small experiment or split path.
