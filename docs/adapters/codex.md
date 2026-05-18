# Codex 适配

## 安装全局技能

在 SpecForge 源码仓库执行：

```bash
node cli/specforge.mjs skill add --target codex --apply
```

默认安装到：

```text
~/.codex/skills/
```

安装范围默认只包含：

- `sf-router`
- `sf-*`

## 使用方式

进入任意业务项目后：

1. 如果项目没有 `.specforge/`，对 Codex 说：`sf-onboard`。
2. 如果是已有代码项目且 wiki 还是空模板，对 Codex 说：`sf-steering`。
3. 如果项目已有 `.specforge/`，对 Codex 说：`sf-router` 或 “继续当前 SpecForge 任务”。
