# Implementation Plan

## 范围

- 改造 `new:change`。
- 新增 `new:artifact`。
- 改造 validate 和 graph status。
- 中文化核心入口、规则、技能、命令卡、模板和 SSoT。

## 步骤

1. 更新 `.specforge/tools/create-change.mjs`，只创建 intake。
2. 新增 `.specforge/tools/create-artifact.mjs`。
3. 更新 `.specforge/tools/validate-structure.mjs`，区分 active 和 archive。
4. 更新 `.specforge/tools/artifact-graph-status.mjs`，依赖未满足时不判 done。
5. 中文化 `.specforge/` 核心内容和 `docs` / `.specforge/project` 核心文件。
6. 运行验证并归档。

## 预计变更文件

- `package.json`
- `.specforge/tools/create-change.mjs`
- `.specforge/tools/create-artifact.mjs`
- `.specforge/tools/validate-structure.mjs`
- `.specforge/tools/artifact-graph-status.mjs`
- `.specforge/AGENTS.md`
- `.specforge/rules/*`
- `.specforge/skills/*/SKILL.md`
- `.specforge/commands/*.md`
- `.specforge/templates/*`
- `docs/getting-started.md`
- `docs/architecture/v0.1-harness-model.md`
- `.specforge/project/*`
