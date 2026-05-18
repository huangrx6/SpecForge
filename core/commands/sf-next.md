# sf-next

输出当前 work item 的下一个 ready artifact 和需要读取的规则。

```bash
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/instructions.mjs
node .specforge/core/scripts/artifact-graph-status.mjs
```

优先相信脚本输出的 `Route` / `Reason` / `Blockers`。如果 gate 是 `REQUEST_CHANGES` / `REJECTED`，或 PRD、technical design、tasks 仍有阻断，先按 route 修复，不继续下游。
