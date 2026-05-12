# Brief: 中文基线和 Graph 脚手架

## 摘要

本次变更继续推进 SpecForge v0.1.1：将核心入口、规则、技能、模板和项目 SSoT 中文化，并将 `new:change` 从一次性全量模板生成调整为 graph 驱动的渐进式脚手架。

## 变更类型

FEATURE / INTERNAL TOOLING / LOCALIZATION

## 建议 Workflow

standard

## 初始范围

- 修改 `new:change`，只生成 `change.yaml` 和 `00-intake`。
- 新增 `new:artifact`，按 `.specforge/schemas/standard.json` 生成指定 artifact。
- 修改 `validate`，允许 active change 处于未完成状态，同时强制 archive 完整。
- 修改 `graph:status`，不被提前生成的空模板误导。
- 中文化核心入口、规则、技能、命令卡、模板和部分 SSoT。

## 不在范围内

- 不做完整 CLI 产品化。
- 不实现 delta spec apply。
- 不做全部历史 archive 内容重写。
- 不实现多工具 adapter installer。
