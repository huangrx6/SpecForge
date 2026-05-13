---
name: sf-spec
description: 【兼容入口】生成或更新 SpecForge change 的 requirements、design、tasks 和 spec_review；新项目推荐使用拆分后的 sf-requirements / sf-design / sf-tasking / sf-spec-review。
---

# sf-spec

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 intake 变成可审查、可实现、可验证的规格。它不写业务代码。

## 启动

运行：

```bash
node .specforge/execution/tools/instructions.mjs
```

按 ready artifact 逐步生成，不要一次铺满所有模板：

```bash
node .specforge/execution/tools/create-artifact.mjs requirements
node .specforge/execution/tools/create-artifact.mjs design
node .specforge/execution/tools/create-artifact.mjs tasks
node .specforge/execution/tools/create-artifact.mjs spec_review
```

## 内部技能母本

按 `instructions.mjs` 的 ready artifact 读取对应内部 skill，不要只依赖本文件的摘要：

| ready artifact | 内部 skill |
|---|---|
| `requirements` | `.specforge/execution/stages/requirements/SKILL.md` |
| `design` | `.specforge/execution/stages/design/SKILL.md` |
| `tasks` | `.specforge/execution/stages/task-planning/SKILL.md` |
| `spec_review` | `.specforge/execution/stages/spec-review/SKILL.md` |

## 关联规则

- `.specforge/policy/rules/spec-quality/README.md`：规格质量、EARS、澄清项。
- `.specforge/policy/rules/analysis-workflow/README.md`：分析深度、代码探索、外部研究、澄清和计划确认。
- `.specforge/policy/rules/product-discovery/README.md`：产品、页面、全栈应用的功能候选和用户选择。
- `.specforge/policy/rules/experience-design/README.md`：页面地图、线稿 / 原型、视觉方向和交互状态。
- `.specforge/policy/rules/boundaries/README.md`：范围、非目标、写入边界。
- `.specforge/policy/rules/api-design/README.md`：API、SDK、事件和跨系统契约；按需读取 `references/`。
- `.specforge/policy/rules/delivery/README.md`：配置、发布、回滚和运行影响。
- `.specforge/policy/rules/gates/README.md`：spec_review 门禁。
- `.specforge/policy/rules/testing/README.md`：验收标准必须可验证。
- `.specforge/policy/tech-profiles/README.md`：技术选型维度、数据库选择矩阵和 profile selection 写法；按需读取具体 profile。
- `.specforge/policy/rules/localization.md`：中文优先。

## 写作要求

### requirements

- 写用户可观察行为，不写实现细节。
- 从 brief 的分析证据包追溯需求来源；复杂需求不能丢失代码探索、外部研究和用户澄清结论。
- 产品类需求必须记录功能候选、MVP 选择、明确延后项和用户确认。
- 必须包含范围、非目标、依赖和验收标准。
- 适合时使用 EARS：
  - `WHEN <event>, THE SYSTEM SHALL <response>.`
  - `IF <condition>, THE SYSTEM SHALL <response>.`

### design

- 追踪每条需求对应的设计决策。
- 建立分析上下文包，说明设计如何来自代码探索、外部研究和用户澄清。
- 有用户可见页面时必须包含页面地图、用户流程、线稿 / 原型、视觉方向和交互状态。
- 技术栈、组件库、数据库、编辑器、内容渲染和测试方案必须引用 `.specforge/policy/tech-profiles/` 或说明偏离理由。
- 明确允许写入范围和禁止范围。
- 写清接口、数据、风险和验证策略。

### tasks

- 每个任务必须有 `_Boundary:_`、`_Depends:_`、`_Verification:_`。
- 任务必须能追溯到 requirements / design / 分析证据，不要凭实现冲动新增范围。
- 任务应小到可以一次聚焦完成。

### spec_review

- 只审查 requirements / design / tasks 是否足以进入实现。
- 不能因为“看起来差不多”批准。
- `REQUEST_CHANGES` 必须指出回到哪个 artifact。

## Gate

spec review 通过后：

```bash
node .specforge/execution/tools/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
```

## 完成标准

- `spec_review` gate 为 `APPROVED`。
- `node .specforge/execution/tools/instructions.mjs -- apply` 显示 implementation ready。

## 不做

- 不写业务代码。
- 不把未澄清需求包装成已批准规格。
