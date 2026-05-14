# Rollback

## 回滚触发条件

- `node runtime/execution/tools/doctor.mjs` 开始失败，且无法快速修复 layout path。
- `node cli/specforge.mjs init --dir <project>` 不能生成可用 `.specforge/`。
- Claude Code / Codex 无法发现或读取 `sf` / `sf-*` 技能。

## 回滚步骤

1. 暂停使用 `sf-*`，改回已安装的旧 `specforge-*` 技能副本。
2. 从 `docs/legacy/source-dot-specforge/.specforge` 恢复旧母本。
3. 从 `docs/legacy/root-skills/` 恢复旧根级 skill 目录。
4. 从 `docs/legacy/bin/specforge.mjs` 恢复旧 CLI。
5. 运行旧版 doctor / validate，确认旧结构恢复。

## 回滚后验证

```bash
node .specforge/tools/doctor.mjs
node bin/specforge.mjs skill add --target all --apply
```
