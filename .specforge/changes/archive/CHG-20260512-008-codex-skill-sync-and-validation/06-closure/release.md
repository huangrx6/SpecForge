# 发布记录

## 发布摘要

本次发布完成 Codex skill 校验与同步能力：

- 新增 `validate:skills`。
- 新增 `sync:codex-skills`。
- `doctor` 纳入 skill 校验。
- 已将 `specforge` / `specforge-*` 同步到 `~/.codex/skills`。

## 部署说明

仓库内使用：

```bash
node .specforge/tools/validate-skills.mjs
node .specforge/tools/sync-codex-skills.mjs
node .specforge/tools/sync-codex-skills.mjs -- --apply
```

已同步目标：

```text
/Users/huangrx6/.codex/skills/specforge*
```

## 发布状态

Ready for archive.
