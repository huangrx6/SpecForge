# sf-status

汇总 active work items、stages、gates、artifact graph 和 blockers。

```bash
node .specforge/core/scripts/status.mjs
node .specforge/core/scripts/artifact-graph-status.mjs
node .specforge/core/scripts/instructions.mjs
```

状态判断只读不推进；多个 active work item、gate 缺 evidence 或 `REQUEST_CHANGES` 时先显示阻断原因。
