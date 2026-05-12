---
name: status
description: SpecForge 内部状态技能。用于汇总 active changes、stage、gate、artifact graph、blockers 和建议下一步。
---

# 状态 Skill

用于汇总当前 SpecForge 工作状态。

## 输入

- `.specforge/registry.yaml`
- active `change.yaml`
- gate evidence files
- `.specforge/schemas/<workflow>.json`

## 输出

- 当前 active changes
- stage 和 gate 摘要
- artifact graph 状态
- blockers
- 建议下一步

## 完成标准

- 没有隐藏 active work。
- blocked change 说明 blocker 和 owner。
- 下一步是可操作动作，不是模糊建议。
