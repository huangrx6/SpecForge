# 工具适配

SpecForge 分成两类安装：

| 类型 | 位置 | 作用 |
|---|---|---|
| 项目规范包 | 业务项目 `.specforge/` | 保存规则、模板、工具、项目事实和 change |
| 全局技能 | AI 工具 skills 目录 | 让 Codex、Claude Code 等工具能识别 `sf-router` 和 `sf-*` 技能 |

## 通用安装器

```bash
node .specforge/execution/tools/install-agent-skills.mjs --target codex --apply
node .specforge/execution/tools/install-agent-skills.mjs --target claude-code --apply
node .specforge/execution/tools/install-agent-skills.mjs --target cc-switch --apply
node .specforge/execution/tools/install-agent-skills.mjs --target all --apply --prune-legacy
```

默认是 dry-run；只有加 `--apply` 才写入。
加 `--prune-legacy` 会删除旧 `sf` / `specforge*` 技能副本，避免 Agent 扫到过期入口。
