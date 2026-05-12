# 回滚记录

## 回滚触发条件

- `node .specforge/tools/self-test.mjs` 失败且无法快速修复。
- `node .specforge/tools/validate-structure.mjs` 对正常 registry 产生误报。
- `archive` 命令 registry 更新异常。

## 回滚步骤

- 移除 `.specforge/tools/self-test.mjs`。
- 移除 `package.json` 中 `selftest` 命令。
- 将 registry helper 从 `.specforge/tools/lib/specforge.mjs` 回退。
- 将 `.specforge/tools/archive-change.mjs` 恢复为变更前逻辑。
- 移除 `.specforge/tools/validate-structure.mjs` 中 registry 双向一致性检查。

## 回滚后验证

- `node .specforge/tools/validate-structure.mjs`
- `node .specforge/tools/status.mjs`
