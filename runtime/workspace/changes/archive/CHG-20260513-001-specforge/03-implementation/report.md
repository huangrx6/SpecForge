# Implementation Report

## 摘要

目录重组已实际落地。当前根目录已经呈现新结构：`skills/`、`runtime/`、`starter/`、`docs/`、`cli/`。旧的 `.specforge/` 母本、根级 `specforge*` 技能和 `bin/` 已移入 `docs/legacy/`，避免继续与业务项目 `.specforge/` 混淆。

## 变更内容

- 新增 `skills/sf` 与 `skills/sf-*`，并安装到 Codex、Claude Code、cc-switch。
- 新增 `runtime/policy/`、`runtime/artifacts/`、`runtime/execution/`、`runtime/workspace/` 四层运行时母本。
- `runtime/execution/tools/lib/specforge.mjs` 增加 layout 检测：源码仓库走 `runtime/`，业务项目走 `.specforge/`。
- `starter/` 改为扁平业务项目快照，由 `runtime/starter.manifest.json` 生成。
- `cli/specforge.mjs` 成为 package bin 入口；package scripts 全部切到 `runtime/execution/tools/*`。
- `gate.mjs` 支持 `pre-gate` / `post-gate` hook，默认 noop，支持 strict post hook。
- 新增 `sf-status`、`sf-next`、`sf-review` command cards。
- 根级 README / AGENTS / CLAUDE 改成新结构入口说明。

## 审查提示

- `docs/legacy/` 保留旧结构作为迁移参考，不参与新 package files。
- 已安装新的 `sf-*` 技能；旧 `specforge-*` 安装副本没有删除，作为本机兼容残留存在。
- 业务项目 smoke test 输出仍是 `.specforge/`，不是 `runtime/`。
