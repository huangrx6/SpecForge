---
name: specforge-spec
description: 生成或更新 SpecForge change 的 requirements、design、tasks 和 spec_review；用于 active change 处于 01-spec 或 02-spec-review 阶段时。
---

# specforge-spec

把 intake 变成可审查、可实现、可验证的规格。它不写业务代码。

## 启动

运行：

```bash
node .specforge/tools/instructions.mjs
```

按 ready artifact 逐步生成，不要一次铺满所有模板：

```bash
node .specforge/tools/create-artifact.mjs requirements
node .specforge/tools/create-artifact.mjs design
node .specforge/tools/create-artifact.mjs tasks
node .specforge/tools/create-artifact.mjs spec_review
```

## 关联规则

- `.specforge/rules/spec-quality.md`：规格质量、EARS、澄清项。
- `.specforge/rules/boundaries.md`：范围、非目标、写入边界。
- `.specforge/rules/gates.md`：spec_review 门禁。
- `.specforge/rules/testing.md`：验收标准必须可验证。
- `.specforge/rules/localization.md`：中文优先。

## 写作要求

### requirements

- 写用户可观察行为，不写实现细节。
- 必须包含范围、非目标、依赖和验收标准。
- 适合时使用 EARS：
  - `WHEN <event>, THE SYSTEM SHALL <response>.`
  - `IF <condition>, THE SYSTEM SHALL <response>.`

### design

- 追踪每条需求对应的设计决策。
- 明确允许写入范围和禁止范围。
- 写清接口、数据、风险和验证策略。

### tasks

- 每个任务必须有 `_Boundary:_`、`_Depends:_`、`_Verification:_`。
- 任务应小到可以一次聚焦完成。

### spec_review

- 只审查 requirements / design / tasks 是否足以进入实现。
- 不能因为“看起来差不多”批准。
- `REQUEST_CHANGES` 必须指出回到哪个 artifact。

## Gate

spec review 通过后：

```bash
node .specforge/tools/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
```

## 完成标准

- `spec_review` gate 为 `APPROVED`。
- `node .specforge/tools/instructions.mjs -- apply` 显示 implementation ready。

## 不做

- 不写业务代码。
- 不把未澄清需求包装成已批准规格。
