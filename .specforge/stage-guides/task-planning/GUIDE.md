---
name: task-planning
description: SpecForge 内部任务规划技能。用于 requirements 和 design 批准后生成 01-spec/tasks.md，拆解边界、依赖、验证和并行波次。
---

# Task Planning Skill

requirements 和 design 批准后使用本 skill。

## 输入

- `01-spec/requirements.md`
- `01-spec/design.md`
- boundary rules
- testing rules

## 输出

- `01-spec/tasks.md`

## 任务要求

每个任务应包含：

- 具体动作。
- `_Boundary:_`：允许写入范围。
- `_Depends:_`：前置任务或上游契约。
- 验证预期。
- 适用时标记并行波次，例如 `P0`、`P1`、`P2`。

## 完成标准

- 任务可以按一个个聚焦单元执行。
- 并行任务不共享写入 owner。
- 契约和集成任务早于实现任务。
- 验证任务不能藏在实现任务里。
