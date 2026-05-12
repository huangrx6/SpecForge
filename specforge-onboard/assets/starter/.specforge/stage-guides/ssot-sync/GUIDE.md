---
name: ssot-sync
description: SpecForge 内部 SSoT 同步技能。用于 closure 前判断 change 是否影响 .specforge/project 长期项目事实，并更新或说明不更新原因。
---

# SSoT Sync Skill

closure 前使用本 skill。

目标是判断本次 change 是否影响 `.specforge/project/` 下的长期项目知识，并在需要时更新。

必须回答：

- 是否影响长期项目事实？
- 更新了哪些 SSoT 文件？
- 是否改变契约？
- 哪些下游需要重新验证？
- 如果没有更新，原因是什么？
