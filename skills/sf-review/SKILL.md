---
name: sf-review
description: 【兼容入口】执行 SpecForge 的 spec_review 或 code_review gate；新项目推荐使用拆分后的 sf-spec-review / sf-code-review。
---

# sf-review

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

执行门禁审查。审查是 gate，不是顺手补实现。

## 判定 review 类型

运行：

```bash
node .specforge/execution/tools/instructions.mjs
```

- ready artifact 为 `spec_review`：审查 requirements / design / tasks。
- ready artifact 为 `code_review`：审查 implementation 是否符合已批准规格。

## 内部技能母本

- `spec_review` 时读取 `.specforge/execution/stages/spec-review/SKILL.md`。
- `code_review` 时读取 `.specforge/execution/stages/code-review/SKILL.md`。
- 审查输出格式、阻断标准和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/gates/README.md`：gate 状态和 evidence。
- `.specforge/policy/rules/review/README.md`：审查输出、阻断项和严重级别。
- `.specforge/policy/rules/boundaries/README.md`：范围和写入边界。
- `.specforge/policy/rules/analysis-workflow/README.md`：分析深度、探索、研究、澄清和计划确认是否足够。
- `.specforge/policy/rules/spec-quality/README.md`：规格审查。
- `.specforge/policy/rules/product-discovery/README.md`：产品功能候选和用户选择是否足够。
- `.specforge/policy/rules/experience-design/README.md`：页面、线稿、主题和交互状态是否足够。
- `.specforge/policy/rules/api-design/README.md`：API、SDK、事件契约兼容性；按需读取 `references/`。
- `.specforge/policy/rules/security/README.md`：安全敏感检查。
- `.specforge/policy/rules/testing/README.md`：验证证据是否匹配风险。

## spec_review 检查

- requirements 可测试且无歧义。
- 分析深度匹配复杂度；brief 记录了需求理解、代码探索、外部研究 / 跳过理由、澄清记录和分析综合。
- 产品 / 功能候选已展开，MVP 组合有用户确认或明确默认假设。
- design 能追踪到 requirements。
- 用户可见页面有页面地图、用户流程、线稿 / 原型、视觉方向和交互状态。
- 技术栈、组件库、编辑器、数据层和测试方案有 profile 或取舍理由。
- tasks 有边界、依赖和验证。
- 非目标明确。
- 验收标准可执行。
- 非 light 变更的 implementation plan 已经通过 spec_review evidence 展示，且关键取舍可追溯。

## code_review 检查

- 实现未偏离 approved spec。
- 未改批准范围外文件。
- 没有密钥或明文凭据。
- 没有无依据的大抽象。
- 测试或验证证据匹配风险。
- 已识别 SSoT 影响。

## 动作

1. 生成对应 review artifact。
2. 写 findings，按严重程度排序。
3. 决策为：
   - `APPROVED`
   - `REQUEST_CHANGES`
   - `REJECTED`
4. APPROVED 时更新 gate：

```bash
node .specforge/execution/tools/gate.mjs <gate> APPROVED --evidence <path>
```

## 完成标准

- review 文件有明确 decision。
- gate 状态与 review decision 一致。
- `REQUEST_CHANGES` 必须指出回到哪个 artifact。

## 不做

- 不用空泛“看起来没问题”批准 gate。
- 不在 review 阶段顺手改实现。
