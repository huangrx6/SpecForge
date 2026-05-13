# SSoT Sync

## 本变更是否影响长期项目知识？

是。SpecForge 源码仓库的权威目录结构已变化：

- Agent 入口技能：`skills/sf*`
- 源码母本：`runtime/`
- 业务项目快照：`starter/`
- 维护者文档：`docs/`
- CLI：`cli/specforge.mjs`

业务项目运行时仍是 `.specforge/`。

## 已更新文件

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `docs/README.md`
- `docs/AGENTS.md`
- `docs/CLAUDE.md`
- `runtime/AGENTS.md`
- `runtime/workspace/knowledge/risks.md`

## 契约变化

- package scripts 改为调用 `runtime/execution/tools/*`。
- package bin `specforge` 改为 `cli/specforge.mjs`。
- skill install 改为安装 `sf` / `sf-*`。
- starter 由 `runtime/starter.manifest.json` 生成，输出仍可作为业务项目 `.specforge/`。

## 需要下游重新验证

- Claude Code / Codex / cc-switch 技能发现列表应优先使用 `sf`。
- 任何仍引用 `node bin/specforge.mjs` 的外部文档需要改为 `node cli/specforge.mjs`。

## 未更新原因

- `docs/legacy/` 中保留旧路径和历史快照，作为迁移参考，不视为当前 SSoT。
- archived change 中的旧路径属于历史证据，不改写。

## 备注

已重新安装 `sf` / `sf-*` 到 Codex、Claude Code 和 cc-switch。
