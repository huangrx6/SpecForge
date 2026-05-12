---
name: spec-review
description: SpecForge 内部规格审查技能。用于 01-spec 完成后审查 requirements、design、tasks 是否足以进入 implementation。
---

# Spec Review Skill

`01-spec` 完成后使用本 skill。

输出状态只能是：

- APPROVED
- REQUEST_CHANGES
- REJECTED

审查重点：

- requirements 是否可测试。
- design 是否能指导实现。
- tasks 是否可执行。
- 边界、非目标、依赖和重新验证触发条件是否明确。
