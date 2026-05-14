# Rollback

## Rollback Trigger

如果新增 artifact graph 脚本或文档更新导致校验失败，或后续决定暂不引入 artifact graph 概念，可回滚本次变更。

## Rollback Steps

1. 删除新增研究文档、v0.2 架构文档、ADR-0004、ADR-0005。
2. 删除 `.specforge/schemas/standard.json`、artifact graph 规则、中文优先规则。
3. 删除 `.specforge/tools/artifact-graph-status.mjs`，并移除 `package.json` 中的 `graph:status`。
4. 恢复 README、SSoT、验证脚本到变更前状态。

## Verification After Rollback

运行：

```bash
node .specforge/tools/validate-structure.mjs
node .specforge/tools/status.mjs
```
