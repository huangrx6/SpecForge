---
name: execution-planning
description: Brainstorm package skill for turning selected brainstorm directions into next actions. Use after a direction is recommended or user-confirmed and the output needs MVP steps, validation questions, research tasks, design/tech handoff, or a route into PRD, requirements, UI design, technical design, discovery research, or implementation planning.
---

# Execution Planning

Use this skill at the end of brainstorm. It converts a selected direction into action without writing downstream artifacts.

## Output

```md
## 下一步行动

| 步骤 | Owner | 输出 | 进入条件 |
|---|---|---|---|
| | user / agent / sf-prd / sf-requirements / sf-ui-design / sf-tech-design / sf-discovery | | |
```

## MVP Route

```md
## MVP 路线图

| 阶段 | 做什么 | 不做什么 | 验证 |
|---|---|---|---|
| Now | | | |
| Next | | | |
| Later | | | |
```

## Handoff Rules

- PRD handoff: product scope, target users, success metrics, non-goals.
- Requirements handoff: confirmed behaviors, acceptance questions, edge cases.
- UI design handoff: experience direction, page flows, states, visual constraints.
- Technical design handoff: confirmed stack, dependency decisions, version risks, integration constraints.
- Discovery research handoff: unresolved facts, sources checked, experiment needed.

## Stop Conditions

- Do not invent downstream decisions.
- Do not write implementation tasks until the target route is confirmed.
- If the user has not confirmed the direction, output next question instead of a plan.
