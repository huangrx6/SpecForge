# specforge.validate

校验 SpecForge 仓库结构、workflow schema、registry path 和 change evidence。

## 本地命令

```bash
node .specforge/tools/validate-structure.mjs
```

## 检查

- 必要路径存在。
- workflow schema 可解析。
- registry 中的路径真实存在。
- active change 可以处于未完成状态。
- archived change 必须具备完整 artifact 和 approved gate evidence。
