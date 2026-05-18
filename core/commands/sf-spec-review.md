# sf-spec-review

执行当前 work item 的规格审查 gate。先生成 `02-spec-review/spec-review-v1.md`，完成审查矩阵和 findings 后，再按结论写回 gate；不要空模板批准。

```bash
node .specforge/core/scripts/instructions.mjs spec_review
node .specforge/core/scripts/create-artifact.mjs spec_review
# 审查通过且无 P0/P1 后才执行 APPROVED；否则执行 REQUEST_CHANGES。
node .specforge/core/scripts/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
# node .specforge/core/scripts/gate.mjs spec_review REQUEST_CHANGES
```
