# Claude Code 适配

## 推荐安装路径

SpecForge 支持两种 Claude Code 相关目标：

| target | 默认路径 | 说明 |
|---|---|---|
| `claude-code` | `~/.claude/skills` | 通用 Claude Code skills 目录 |
| `cc-switch` | `~/.cc-switch/skills` | 当前机器已有的技能切换目录 |

## 安装到 Claude Code

```bash
node .specforge/tools/install-agent-skills.mjs --target claude-code --apply
```

## 安装到当前 .cc-switch

```bash
node .specforge/tools/install-agent-skills.mjs --target cc-switch --apply
```

## 自定义路径

```bash
node .specforge/tools/install-agent-skills.mjs --target claude-code --path /path/to/skills --apply
```

## 使用方式

安装后进入业务项目：

- 初始化：`specforge-onboard`
- 路由和状态：`specforge`
- 自动推进：`specforge-work`
