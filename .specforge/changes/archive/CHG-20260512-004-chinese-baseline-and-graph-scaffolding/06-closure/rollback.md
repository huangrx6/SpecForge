# Rollback

## 回滚触发条件

如果 graph 驱动脚手架导致新 change 无法创建、artifact 无法生成，或 validate 无法正确识别 active / archive，可回滚。

## 回滚步骤

1. 恢复 `.specforge/tools/create-change.mjs` 的旧行为。
2. 删除 `.specforge/tools/create-artifact.mjs` 和 `package.json` 中的 `new:artifact`。
3. 恢复 `.specforge/tools/validate-structure.mjs` 和 `.specforge/tools/artifact-graph-status.mjs`。
4. 恢复被中文化的核心文件。

## 回滚后验证

```bash
node .specforge/tools/validate-structure.mjs
node .specforge/tools/status.mjs
```
