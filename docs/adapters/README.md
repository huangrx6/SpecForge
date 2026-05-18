# 工具适配

SpecForge 分成两类安装：

| 类型 | 位置 | 作用 |
|---|---|---|
| 项目规范包 | 业务项目 `.specforge/` | 保存规则、模板、工具、项目事实和 work item |
| 全局技能 | AI 工具 skills 目录 | 让 Codex、Claude Code 等工具能识别 `sf-router` 和 `sf-*` 技能 |

## 通用安装器

```bash
npx github:huangrx6/SpecForge skill add --target codex --apply
npx github:huangrx6/SpecForge skill add --target claude-code --apply
npx github:huangrx6/SpecForge skill add --target cc-switch --apply
npx github:huangrx6/SpecForge skill add --target all --apply
```

默认是 dry-run；只有加 `--apply` 才写入。

源码仓库维护者也可以使用本地 CLI：

```bash
node cli/specforge.mjs skill add --target all --apply
```
