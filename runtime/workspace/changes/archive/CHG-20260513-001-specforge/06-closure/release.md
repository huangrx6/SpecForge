# Release

## 发布摘要

SpecForge 源码目录已迁移到新结构：

```text
skills/
runtime/
starter/
docs/
cli/
```

新技能入口为 `sf` / `sf-*`。业务项目初始化仍生成 `.specforge/`。

## 部署说明

已执行：

```bash
node cli/specforge.mjs skill add --target all --apply
```

安装目标：

- Codex: `/Users/huangrx6/.codex/skills`
- Claude Code: `/Users/huangrx6/.claude/skills`
- cc-switch: `/Users/huangrx6/.cc-switch/skills`

## 发布状态

LOCAL_READY
