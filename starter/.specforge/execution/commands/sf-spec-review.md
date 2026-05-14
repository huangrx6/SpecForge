# sf-spec-review

执行当前 work item 的规格审查 gate。先生成 `02-spec-review/spec-review-v1.md`，再用 gate 工具写回结论。

```bash
node .specforge/execution/tools/instructions.mjs spec_review
node .specforge/execution/tools/create-artifact.mjs spec_review
node .specforge/execution/tools/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
```
