# 回滚记录

## 回滚触发条件

- `node .specforge/tools/validate-structure.mjs` 在既有归档记录上失败，且无法快速修复。
- `node .specforge/tools/archive-change.mjs` 误改 registry 或移动错误 change。
- `gate` 命令写坏 `change.yaml` gate block。
- `instructions` 输出错误状态，导致 Agent 无法判断下一步。

## 回滚步骤

- 移除 `package.json` 中新增的 `instructions`、`gate`、`archive` scripts。
- 移除 `.specforge/tools/lib/specforge.mjs`、`.specforge/tools/instructions.mjs`、`.specforge/tools/gate.mjs`、`.specforge/tools/archive-change.mjs`。
- 将 `.specforge/schemas/standard.json` 中 `closure` artifact 和 archive closure 依赖恢复到变更前。
- 恢复 `.specforge/tools/validate-structure.mjs` 中与新增脚本、ADR、强校验相关的变更。
- 恢复 README、getting started、validation model、feature-list、ADR-0006 的文档更新。

## 回滚后验证

- `node .specforge/tools/validate-structure.mjs`
- `node .specforge/tools/artifact-graph-status.mjs`
- `node .specforge/tools/status.mjs`
