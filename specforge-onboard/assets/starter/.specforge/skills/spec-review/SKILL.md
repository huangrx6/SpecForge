---
name: spec-review
description: SpecForge 内部规格审查技能。用于 01-spec 完成后审查 requirements、design、tasks 是否足以进入 implementation。
---

# Spec Review Skill

本技能审查 requirements、design 和 tasks 是否足以进入 implementation。审查不是润色文档，而是判断实现是否已经有安全边界和可验证计划。

## 读取

- `00-intake/brief.md`
- `01-spec/requirements.md`
- `01-spec/design.md`
- `01-spec/tasks.md`
- `.specforge/rules/review/README.md`
- `.specforge/rules/spec-quality/README.md`
- `.specforge/rules/gates/README.md`

## 写入

- `02-spec-review/spec-review-v1.md`
- 通过 `node .specforge/tools/gate.mjs spec_review <status> --evidence 02-spec-review/spec-review-v1.md` 更新门禁

## 审查重点

- requirements 是否可测试。
- design 是否覆盖需求、边界、风险和验证策略。
- tasks 是否可执行、可排序、可验证。
- API、数据、权限、配置、发布影响是否写清。
- 是否存在范围膨胀、未决方案或隐藏风险。

## 状态规则

| 状态 | 使用条件 |
|---|---|
| `APPROVED` | 可以仅凭当前 spec 进入实现 |
| `REQUEST_CHANGES` | 有可修复缺口，修完可重审 |
| `REJECTED` | 方向或范围错误，需要回到 intake / requirements |

## 输出要求

- findings 按严重程度排序。
- 每条 finding 指向具体文件或章节。
- 阻断项必须说明为什么阻断实现。
- 批准时也要写清残余风险。

## 完成标准

- gate 证据文件存在。
- gate 状态和证据路径一致。
- 未批准时明确下一步应回哪个 artifact。
