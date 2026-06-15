---
name: problem-framing
description: Brainstorm package skill for turning vague requests into a structured problem space. Use when the user asks how to improve, design, optimize, build, or rethink something and the target, users, constraints, pain points, success criteria, non-goals, or decision boundaries are unclear.
---

# Problem Framing

Use this skill before generating solutions. Its job is to convert a vague prompt into a map of goals, constraints, assumptions, and decision questions.

## Read

- User request and conversation context.
- Existing `brainstorm.md`, `brief.md`, PRD, requirements, UI / technical design if present.
- Project wiki or code facts only when they clarify constraints.

## Process

1. Restate the raw request in one sentence.
2. Identify the real object of work: product, page, workflow, skill, architecture, operations, or decision.
3. Fill the framing table. Mark missing high-impact items as `[必须确认]`.
4. Split the problem into dimensions, not solutions.
5. Identify what is fixed, what can change, and what must not be touched.
6. Decide whether external facts are needed. If yes, hand the fact questions to `research-source`.

## Framing Table

```md
## 问题重构

| 维度 | 当前理解 | 缺口 / 风险 |
|---|---|---|
| 目标 | | |
| 用户 / 受众 | | |
| 当前痛点 | | |
| 成功标准 | | |
| 固定约束 | | |
| 可改变空间 | | |
| 明确不做 | | |
| 需要事实查证 | | |
```

## Problem Map

```md
## 问题地图

- [已明确] ...
- [必须确认] ...
- [可安全默认] ...
```

## Stop Conditions

- Do not generate solution options before the goal and user / audience are at least roughly framed.
- Do not convert agent assumptions into user-confirmed facts.
- If one missing answer would change scope, cost, architecture, or UX direction, ask exactly one question before proceeding.
