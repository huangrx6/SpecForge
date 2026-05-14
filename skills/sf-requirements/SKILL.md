---
name: sf-requirements
description: 生成或更新 SpecForge work item 的 requirements；用于 active work item 处于 01-spec 阶段且 ready artifact 为 requirements 时。
---

# sf-requirements

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 brief（和可选的 PRD）升级为可测试、可审查的需求规格。它不写设计，不写实现。

如果存在 `00-intake/prd.md`，把它当作产品意图输入：保留产品目标和用户价值，但必须进一步落成可验证行为、边界、错误处理和验收标准。不要把 PRD 原样复制成 requirements。

## 启动

运行：

```bash
node .specforge/execution/tools/instructions.mjs
```

确认 ready artifact 包含 `requirements`，再：

```bash
node .specforge/execution/tools/create-artifact.mjs requirements
```

## 内部技能母本

写 requirements 前，读取 `.specforge/execution/stages/requirements/SKILL.md`。需求质量标准、停止条件和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/spec-quality/README.md`：规格质量、EARS 格式、澄清项。
- `.specforge/policy/rules/analysis-workflow/README.md`：需求必须有 intake 分析证据支撑。
- `.specforge/policy/rules/product-discovery/README.md`：产品类需求必须记录功能候选和用户确认。
- `.specforge/policy/rules/boundaries/README.md`：范围、非目标和写入边界。
- `.specforge/policy/rules/testing/README.md`：验收标准必须可验证。
- `.specforge/policy/rules/localization.md`：中文优先。

## 写作要求

- 写用户可观察行为，不写实现细节。
- 从 brief 的分析证据包追溯需求来源；复杂需求不能丢失代码探索、外部研究和用户澄清结论。
- 产品类需求必须记录功能候选、MVP 选择、明确延后项和用户确认。
- 必须包含范围、非目标、依赖和验收标准。
- 适合时使用 EARS：
  - `WHEN <event>, THE SYSTEM SHALL <response>.`
  - `IF <condition>, THE SYSTEM SHALL <response>.`

## 完成标准

- `requirements.md` 可以独立支撑后续影响面判断。
- 涉及用户可见页面、交互、视觉或原型时，下一步路由到 `sf-ui-design`。
- 涉及前端工程、后端、API、数据、权限、配置、任务或 NFR 时，下一步路由到 `sf-tech-design`。
- 同时涉及 UI 和技术实现时，先 `sf-ui-design`，再 `sf-tech-design`，由 `instructions.mjs` 的 ready artifact 决定实际顺序。
- 所有未决问题都显式标记 `[NEEDS CLARIFICATION]`。

## 不做

- 不写设计方案。
- 不把未澄清需求包装成已批准规格。
