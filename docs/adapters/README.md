# 工具适配

SpecForge 分成两类安装：

| 类型 | 位置 | 作用 |
|---|---|---|
| 项目规范包 | 业务项目 `.specforge/` | 保存规则、模板、工具、项目事实和 work item |
| AI 工具技能 | AI 工具 skills 目录 | 让 Codex、Claude Code、Trae CN 等工具能识别 `sf-router` 和 `sf-*` 技能 |

## 安装范围

| scope | 含义 | 适用场景 |
|---|---|---|
| `user` | 安装到当前用户目录，所有项目可见 | 日常主力环境，默认值 |
| `project` | 安装到当前业务项目，只有该项目可见 | 团队项目、试点项目、不想污染全局技能列表 |

## 通用安装器

```bash
npx github:huangrx6/SpecForge skill add --target codex --scope user --apply
npx github:huangrx6/SpecForge skill add --target claude-code --scope user --apply
npx github:huangrx6/SpecForge skill add --target cc-switch --scope user --apply
npx github:huangrx6/SpecForge skill add --target trae-cn --scope user --apply
npx github:huangrx6/SpecForge skill add --target all --scope user --apply
```

默认是 dry-run；只有加 `--apply` 才写入。

项目级安装示例：

```bash
npx github:huangrx6/SpecForge skill add --target trae-cn --scope project --project-dir /path/to/project --apply
npx github:huangrx6/SpecForge skill add --target codex --scope project --project-dir /path/to/project --apply
npx github:huangrx6/SpecForge skill add --target claude-code --scope project --project-dir /path/to/project --apply
```

## 目标目录

| target | user scope | project scope |
|---|---|---|
| `codex` | `~/.codex/skills` | `<project>/.agents/skills` |
| `agents` | `~/.agents/skills` | `<project>/.agents/skills` |
| `claude-code` | `~/.claude/skills` | `<project>/.claude/skills` |
| `cc-switch` | `~/.cc-switch/skills` | `<project>/.claude/skills` |
| `trae-cn` | `~/.trae-cn/skills` | `<project>/.trae/skills` |

当多个 target 在同一 scope 下落到同一个目录时，安装器会自动去重。

源码仓库维护者也可以使用本地 CLI：

```bash
node cli/specforge.mjs skill add --target all --scope user --apply
```
