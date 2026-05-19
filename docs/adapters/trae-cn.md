# Trae CN 适配

## 安装路径

| scope | 路径 | 说明 |
|---|---|---|
| `user` | `~/.trae-cn/skills` | Trae 国内版全局技能目录，所有项目可见 |
| `project` | `<project>/.trae/skills` | Trae 项目级技能目录，只对该项目生效 |

每个技能必须是一个目录，且目录内包含 `SKILL.md`：

```text
.trae/skills/sf-router/SKILL.md
```

## 用户级安装

适合你希望 Trae CN 在所有工作区都能识别 `sf-router` 和 `sf-*`：

```bash
npx github:huangrx6/SpecForge skill add --target trae-cn --scope user --apply
```

源码仓库维护者也可以本地执行：

```bash
node cli/specforge.mjs skill add --target trae-cn --scope user --apply
```

## 项目级安装

适合只在某个试点项目或团队项目启用 SpecForge：

```bash
npx github:huangrx6/SpecForge skill add --target trae-cn --scope project --project-dir /path/to/project --apply
```

如果当前目录就是业务项目根：

```bash
npx github:huangrx6/SpecForge skill add --target trae-cn --scope project --apply
```

安装后，使用 Trae CN 打开该项目根目录，在对话中输入 `sf-onboard` 或 `sf-router` 即可触发。

## 验证

```bash
test -f ~/.trae-cn/skills/sf-router/SKILL.md
test -f /path/to/project/.trae/skills/sf-router/SKILL.md
```

如果 Trae CN 已经打开，安装后建议重启或重新打开工作区，让技能列表重新加载。
