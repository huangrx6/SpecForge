---
name: sf-spec-review
description: 执行 SpecForge spec_review gate；用于 requirements、design、tasks 完成后，审查规格是否足以进入 implementation 时。
---

# sf-spec-review

审查 requirements、design、tasks 是否足以进入 implementation。审查是 gate，不是润色文档。

## 启动

运行：

```bash
node .specforge/execution/tools/instructions.mjs
```

确认 ready artifact 为 `spec_review`，再生成审查产物：

```bash
node .specforge/execution/tools/create-artifact.mjs spec_review
```

## 内部技能母本

执行 spec_review 前，读取 `.specforge/execution/stages/spec-review/SKILL.md`。审查重点、阻断规则、状态定义和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/gates/README.md`：gate 状态和 evidence。
- `.specforge/policy/rules/review/README.md`：审查输出、阻断项和严重级别。
- `.specforge/policy/rules/spec-quality/README.md`：规格质量。
- `.specforge/policy/rules/analysis-workflow/README.md`：分析深度、探索、研究和澄清是否足够。
- `.specforge/policy/rules/product-discovery/README.md`：功能候选和用户选择是否足够。
- `.specforge/policy/rules/experience-design/README.md`：页面、线稿、视觉方向和交互状态是否足够。
- `.specforge/policy/rules/api-design/README.md`：API 和契约兼容性；按需读取 `references/`。
- `.specforge/policy/rules/security/README.md`：安全敏感检查。
- `.specforge/policy/rules/testing/README.md`：验证证据是否匹配风险。
- `.specforge/policy/tech-profiles/README.md`：技术选型、数据库选择矩阵和 profile 偏离规则。

## 审查检查项

- requirements 可测试且无歧义。
- 分析深度匹配复杂度；brief 记录了探索、外部研究 / 跳过理由、澄清记录和分析综合。
- 产品 / 功能候选已展开，MVP 组合有用户确认或明确默认假设。
- design 能追踪到 requirements，并展开了本次 change 涉及的设计维度。
- 用户可见页面有页面地图、用户流程、线稿 / 原型、视觉方向和交互状态。
- 技术栈、组件库、编辑器、数据库 / 数据层和测试方案有 profile 或取舍理由。
- tasks 有边界、依赖和验证。
- 非目标明确。
- 验收标准可执行。

## 动作

1. 写 findings，按严重程度排序，每条指向具体文件或章节。
2. 决策为 `APPROVED` / `REQUEST_CHANGES` / `REJECTED`。
3. `APPROVED` 时更新 gate：

```bash
node .specforge/execution/tools/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
```

## 完成标准

- `spec-review-v1.md` 有明确 decision。
- gate 状态与 review decision 一致。
- `REQUEST_CHANGES` 必须指出回到哪个 artifact（requirements / design / tasks）。

## 不做

- 不用空泛"看起来没问题"批准 gate。
- 不在 review 阶段顺手补实现。
