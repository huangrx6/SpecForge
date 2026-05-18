# sf-status

汇总 active work items、stages、gates、artifact graph 和 blockers。

```bash
node .specforge/core/scripts/status.mjs
node .specforge/core/scripts/artifact-graph-status.mjs
node .specforge/core/scripts/instructions.mjs
```

状态判断只读不推进；多个 active work item、gate 缺 evidence、`REQUEST_CHANGES`、PRD 未完成、technical design 有 `unknown` 或 tasks 缺 `_Impact:_` 时先显示阻断原因和 route。
