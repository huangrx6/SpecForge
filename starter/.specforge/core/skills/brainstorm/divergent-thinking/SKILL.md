---
name: divergent-thinking
description: Brainstorm package skill for generating multiple creative directions from a framed problem. Use after problem-framing when brainstorm needs conservative, standard, aggressive, experimental, counterintuitive, short-term, long-term, role-based, or constraint-breaking options.
---

# Divergent Thinking

Use this skill after `problem-framing`. Its job is to create genuinely different directions before evaluation.

## Read

- `brainstorm.md#问题重构` and `#问题地图`.
- Current facts from `research-source` if facts affect option feasibility.

## Generation Lenses

| Lens | Prompt |
|---|---|
| First principles | What is the essential outcome, and what is the smallest mechanism that produces it? |
| Role perspectives | How would user, builder, operator, manager, tester, and security reviewer see the problem? |
| SCAMPER | Substitute, combine, adapt, modify, put to another use, eliminate, reverse. |
| Time horizons | What works in one day, one sprint, one quarter, one year? |
| Constraint inversion | What if cost were unlimited? What if time were one day? What if maintenance were the only priority? |
| Reverse failure | If we wanted to make this bad, what would we do, and what is the opposite? |

## Output

```md
## 发散方向池

| 方向 | 类型 | 核心想法 | 适合场景 | 主要代价 |
|---|---|---|---|---|
| 保守版 | low-cost | | | |
| 标准版 | balanced | | | |
| 激进版 | high-upside | | | |
| 实验版 | exploratory | | | |
| 反直觉版 | counterintuitive | | | |
```

## Quality Bar

- Include at least 5 directions for deep brainstorm and at least 3 for light brainstorm.
- Options must be meaningfully different, not wording variants.
- Include at least one “do less” or simplification option.
- Include at least one option that challenges the assumed solution.
