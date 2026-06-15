---
name: scenario-simulation
description: Brainstorm package skill for testing ideas against realistic user, workflow, edge-case, adoption, operations, and failure scenarios. Use when brainstorm needs to know how candidate directions behave for different user intents, maturity levels, constraints, or usage contexts.
---

# Scenario Simulation

Use this skill after candidate options exist. It turns abstract ideas into concrete “what happens when...” checks.

## Scenario Types

| Scenario | Question |
|---|---|
| Fuzzy idea | User only has a vague goal. What does the system ask first? |
| Existing solution optimization | User already has a solution. What should be preserved vs changed? |
| Research-heavy decision | What facts are needed before a recommendation is safe? |
| Creative exploration | How many options should be shown before evaluation? |
| Execution handoff | What must be true before PRD / requirements / design / tech design starts? |
| Failure / edge case | What happens if the assumption, dependency, or user behavior is wrong? |

## Output

```md
## 场景模拟

| 场景 | 用户输入 / 状态 | 方案表现 | 风险 | 需要调整 |
|---|---|---|---|---|
| | | | | |
```

## Rules

- Simulate behavior, not just benefits.
- Include at least one failure scenario for deep brainstorm.
- If a scenario reveals a missing decision, add it to `问题地图`.
- If a scenario reveals missing facts, hand it to `research-source`.
