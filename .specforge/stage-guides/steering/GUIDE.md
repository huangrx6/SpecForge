---
name: steering
description: SpecForge 内部 steering 技能。用于大型或 brownfield 变更前刷新 .specforge/project 下的长期项目上下文和架构现实。
---

# Steering Skill

大型变更或 brownfield 变更前，用本 skill 刷新长期项目上下文。

## 输入

- 当前代码库
- 现有 `.specforge/project/` SSoT
- 相关 active 或 archived changes

## 输出

更新 `.specforge/project/` 下相关文件，例如：

- `engineering/architecture.md`
- `engineering/project-structure.md`
- `engineering/validation-model.md`
- `product/positioning.md`
- `risks.md`

## 完成标准

- steering 文件描述当前现实，而不是愿望。
- 架构边界清楚到可以被 specs 引用。
- 新项目事实没有重复写进 `.specforge/`。
