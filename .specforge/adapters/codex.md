# Codex 适配

## 安装全局技能

在 SpecForge 源码仓库执行：

```bash
node .specforge/tools/install-agent-skills.mjs --target codex --apply
```

默认安装到：

```text
~/.codex/skills/
```

安装范围默认只包含：

- `specforge`
- `specforge-*`

## 使用方式

进入任意业务项目后：

1. 如果项目没有 `.specforge/`，对 Codex 说：`specforge-onboard`。
2. 如果项目已有 `.specforge/`，对 Codex 说：`specforge` 或 “继续当前 SpecForge 任务”。
