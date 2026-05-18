# 变更日志

SpecForge 在 1.0 之前按 semver 思路管理版本：小版本仍可能调整项目内 `.specforge/` 结构，但破坏性迁移要求必须记录在这里。

## 0.3.0

- 顶层目录重构为 `agent-skills/` + `core/` + `starter/` + `docs/` + `cli/`。
- 项目侧 `.specforge/` 重构为 `core/`、`hooks/`、`wiki/`、`work/` 四块。
- work item 命名改为 `YYYYMMDD-kind-NNN-short-title`，支持 `feat`、`bugfix`、`issue`、`refactor` 等类型。
- 新增 `issue` workflow，用于尚未完全定性的异常、告警或问题排查。
- 新增 `sf-wiki`，把长期项目事实按 wiki 单文件条目维护。

## 0.2.0

- 新增 `specforge` 根路由技能和生命周期子技能。
- 通过 `.specforge/core/artifacts/schemas/standard.json` 引入 artifact graph 驱动的流程推进。
- 新增 `create-artifact.mjs`，支持渐进式 artifact 创建。
- 新增 `instructions.mjs`，为 Agent 生成下一步指令。
- 新增 `gate.mjs`，支持 gate evidence 写回。
- 新增 `archive-work.mjs`，支持归档前检查。
- 新增 `doctor.mjs`、`validate-skills.mjs`、registry 自测和 Codex skill 同步工具。
- 新增中文优先规则、模板和长期项目事实指引。

## 0.1.0

- 引入根级 skill bundle 布局。
- 引入初始 `.specforge/` 项目目录和 starter assets。
- 引入基础生命周期：onboard、intake、spec、implement、review、verify、close。
- 新增初始 validation 和 status 脚本。

## 升级提示

- `0.1.x -> 0.2.x`：框架从目录模板推进到 artifact graph 驱动，并统一使用 work item 语义。
- 升级已有项目内 `.specforge/` 前，先运行 `node .specforge/core/scripts/doctor.mjs` 并检查 validation 失败项。
- 不要在升级时自动改写 archived work items。历史证据需要规范化时，应通过显式 migration work item 完成。

## 迁移提示

如果项目提示缺少 active 目录：

```bash
mkdir .specforge/work/active
```
