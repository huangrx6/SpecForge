# sf-review

执行当前 ready gate 的审查。`spec_review` 和 `code_review` 都必须生成 evidence 后才能批准。

```bash
node .specforge/execution/tools/instructions.mjs
node .specforge/execution/tools/gate.mjs <gate> APPROVED --evidence <path>
```

在 SpecForge 源码仓库中使用：

```bash
npm run instructions
npm run gate -- <gate> APPROVED --evidence <path>
```
