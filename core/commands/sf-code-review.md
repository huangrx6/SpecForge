# sf-code-review

执行当前 work item 的代码审查 gate。先生成 `04-code-review/code-review-v1.md`，再用 gate 工具写回结论。

```bash
node .specforge/core/scripts/instructions.mjs code_review
node .specforge/core/scripts/create-artifact.mjs code_review
node .specforge/core/scripts/gate.mjs code_review APPROVED --evidence 04-code-review/code-review-v1.md
```
