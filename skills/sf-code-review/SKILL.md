---
name: sf-code-review
description: 执行 SpecForge code_review gate；用于 implementation 完成后，对照已批准 spec 审查代码变更是否满足规格、工程规则和安全边界时。
---

# sf-code-review

审查实现是否符合已批准 spec、工程规则和安全边界。审查重点是缺陷、回归、风险和证据，不是代码风格偏好。

## 启动

运行：

```bash
node .specforge/execution/tools/instructions.mjs
```

确认 ready artifact 为 `code_review`，再生成审查产物：

```bash
node .specforge/execution/tools/create-artifact.mjs code_review
```

## 内部技能母本

执行 code_review 前，读取 `.specforge/execution/stages/code-review/SKILL.md`。审查重点、finding 格式、状态规则和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/gates/README.md`：gate 状态和 evidence。
- `.specforge/policy/rules/review/README.md`：finding 格式和严重级别。
- `.specforge/policy/rules/security/README.md`：安全、权限、凭据检查。
- `.specforge/policy/rules/testing/README.md`：验证证据是否匹配风险。
- `.specforge/policy/rules/engineering/README.md`：工程规范一致性。
- `.specforge/policy/rules/boundaries/README.md`：是否存在边界违规。

## 审查检查项

- 实现未偏离 approved spec（requirements / design / tasks）。
- 未改批准范围外文件。
- 没有密钥或明文凭据。
- 没有无依据的大抽象或无关重构。
- 测试或验证证据匹配风险。
- 已识别 SSoT 影响（API / 数据模型 / 配置变化）。
- 没有引入安全、权限、数据或可观测性缺口。

## 动作

1. 写 findings，按 `P0 / P1 / P2 / P3` 排序，每条指向文件和行号或具体章节。
2. 决策为 `APPROVED` / `REQUEST_CHANGES` / `REJECTED`。
3. `APPROVED` 时更新 gate：

```bash
node .specforge/execution/tools/gate.mjs code_review APPROVED --evidence 04-code-review/code-review-v1.md
```

## 完成标准

- `code-review-v1.md` 有明确 decision。
- gate 状态与 review decision 一致。
- 未批准时下一步修复范围明确（回到 `sf-implement`）。

## 不做

- 不用空泛"看起来没问题"批准 gate。
- 不在 review 阶段顺手修实现。
