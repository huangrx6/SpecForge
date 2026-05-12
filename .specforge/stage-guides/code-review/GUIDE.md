---
name: code-review
description: SpecForge 内部代码审查技能。用于 implementation 完成后，对照已批准 requirements、design、tasks、边界和验证证据判断 code_review gate。
---

# Code Review Skill

实现完成后使用本 skill。

输出状态只能是：

- APPROVED
- REQUEST_CHANGES
- REJECTED

审查重点：

- 实现是否符合已批准 requirements / design / tasks。
- 是否存在边界违规。
- 是否有足够验证证据。
- 是否引入密钥、明文凭据或无依据抽象。
