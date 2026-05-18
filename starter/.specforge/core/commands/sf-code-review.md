# sf-code-review

执行当前 work item 的代码审查 gate。先生成 `04-code-review/code-review-v1.md`，完成真实 diff、changed-files、implementation report 和 tasks `_Impact:_` 对账后，再按结论写回 gate；不要空模板批准。

```bash
node .specforge/core/scripts/instructions.mjs code_review
node .specforge/core/scripts/create-artifact.mjs code_review
# 审查通过且无 P0/P1 后才执行 APPROVED；否则执行 REQUEST_CHANGES。
node .specforge/core/scripts/gate.mjs code_review APPROVED --evidence 04-code-review/code-review-v1.md
# node .specforge/core/scripts/gate.mjs code_review REQUEST_CHANGES
```
