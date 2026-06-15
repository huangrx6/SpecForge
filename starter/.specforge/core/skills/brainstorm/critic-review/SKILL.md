---
name: critic-review
description: Brainstorm package skill for challenging generated ideas before selection. Use when brainstorm has candidate directions and needs assumptions, failure modes, over-design risk, simpler alternatives, maintenance cost, security/privacy risk, or user-value doubts reviewed.
---

# Critic Review

Use this skill after options exist and before ranking. Its job is to prevent attractive but weak ideas from becoming the default.

## Challenge Questions

| Area | Questions |
|---|---|
| User value | Does the user really need this? What pain remains unsolved? |
| Assumptions | Which hidden assumptions must be true? How can they fail? |
| Simplicity | Is there a smaller version that captures most value? |
| Maintenance | Who owns this later? What grows expensive over time? |
| Security / privacy | Does it expand access, data retention, or attack surface? |
| Feasibility | Which dependency, integration, or runtime fact is still unproven? |
| Scope | Does this smuggle in requirements, design, or implementation prematurely? |

## Output

```md
## 批判质疑

| 方案 | 可能不成立的点 | 更简单替代 | 需要验证 | 处理建议 |
|---|---|---|---|---|
| | | | | keep / simplify / split / reject / research |
```

## Rules

- Critique the idea, not the user preference.
- Do not reject a direction only because it is unfamiliar.
- If a flaw is fixable by simplifying, mark `simplify`, not `reject`.
- If the flaw depends on missing facts, hand it to `research-source`.
