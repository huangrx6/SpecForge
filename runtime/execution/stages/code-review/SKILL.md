---
name: code-review
description: SpecForge 内部代码审查技能。用于 implementation 完成后，对照已批准 requirements、适用的 ui_design / technical_design、tasks、边界和验证证据判断 code_review gate。
---

# Code Review Skill

本技能审查实现是否符合已批准 spec、工程规则和安全边界。审查重点是缺陷、回归、风险和证据，不是代码风格偏好。

## 读取

- `01-spec/requirements.md`
- `01-spec/ui-design.md`（存在时）
- `01-spec/technical-design.md`（存在时）
- `01-spec/tasks.md`
- `03-implementation/report.md`
- `03-implementation/changed-files.md`
- 相关 diff 和测试结果
- `.specforge/policy/rules/review/README.md`
- `.specforge/policy/rules/gates/README.md`
- `.specforge/policy/rules/security/README.md`
- `.specforge/policy/rules/testing/README.md`

## 写入

- `04-code-review/code-review-v1.md`
- 通过 `node .specforge/execution/tools/gate.mjs code_review <status> --evidence 04-code-review/code-review-v1.md` 更新门禁

## 审查重点

- 实现是否满足 requirements、适用的 ui_design / technical_design、tasks。
- 是否存在边界违规或未经批准的重构。
- 是否引入安全、权限、数据、配置或可观测性风险。
- 是否有缺失测试或验证证据。
- 是否有明显 bug、竞态、错误处理缺口或兼容性问题。

## finding 格式

- 严重程度：`P0`、`P1`、`P2`、`P3`。
- 文件和行号或具体章节。
- 问题、影响、建议修复方向。
- 不确定时写明需要补充的证据。

## 状态规则

- `APPROVED`：没有阻断项，残余风险可接受。
- `REQUEST_CHANGES`：需要修复后重审。
- `REJECTED`：实现方向明显偏离 spec 或风险不可接受。

## 完成标准

- review 文件存在。
- gate 状态和证据一致。
- 未批准时下一步修复范围明确。
