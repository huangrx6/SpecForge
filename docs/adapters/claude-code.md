# Claude Code 适配

## 推荐安装路径

SpecForge 支持两种 Claude Code 相关目标：

| target | user scope | project scope | 说明 |
|---|---|---|---|
| `claude-code` | `~/.claude/skills` | `<project>/.claude/skills` | Claude Code 原生 skills 目录 |
| `cc-switch` | `~/.cc-switch/skills` | `<project>/.claude/skills` | 当前机器已有的技能切换目录；项目级仍使用 Claude Code 项目目录 |

## 安装到 Claude Code

```bash
node cli/specforge.mjs skill add --target claude-code --scope user --apply
```

项目级安装：

```bash
node cli/specforge.mjs skill add --target claude-code --scope project --project-dir /path/to/project --apply
```

## 安装到当前 .cc-switch

```bash
node cli/specforge.mjs skill add --target cc-switch --scope user --apply
```

## 自定义路径

```bash
node cli/specforge.mjs skill add --target claude-code --path /path/to/skills --apply
```

## 使用方式

安装后进入业务项目：

- 初始化：`sf-onboard`
- 存量项目画像：`sf-steering`
- 路由和状态：`sf`
- 自动推进：`sf-work`
