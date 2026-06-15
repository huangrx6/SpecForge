---
name: output-shaping
description: Brainstorm package skill for choosing the right output format for a brainstorm result. Use when the result should be an idea pool, direction matrix, option comparison, priority list, MVP roadmap, risk list, action plan, question list, or compact user-facing prompt instead of freeform paragraphs.
---

# Output Shaping

Use this skill whenever brainstorm output needs a stable shape. It selects the artifact structure that best matches the user's current decision.

## Format Selector

| Need | Output format |
|---|---|
| Explore possibilities | 想法池 / 发散方向池 |
| Compare choices | 方案对比表 / 方案评估矩阵 |
| Decide what to do first | 优先级排序 / MVP 路线图 |
| Clarify uncertainty | 问题清单 / 未查证项 |
| Prepare next workflow | 下一步行动 / handoff table |
| Communicate briefly | 一页摘要 |
| Challenge assumptions | 批判质疑表 / 风险清单 |

## Default Brainstorm Output

```md
1. 问题重构
2. 当前事实与研究证据
3. 发散方向池
4. 方案组合 / 方案对比
5. 批判质疑
6. 方案评估矩阵
7. 推荐方案
8. 下一步行动
9. 需要用户确认的问题
```

## Rules

- Do not output every section when the brainstorm is light; choose the smallest useful format.
- Do not bury a required user decision in prose.
- Keep agent recommendation, user confirmation, facts, and assumptions visually separate.
- If the output will feed another SpecForge stage, include the handoff table.
