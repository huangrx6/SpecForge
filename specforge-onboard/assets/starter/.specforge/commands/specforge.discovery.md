# specforge.discovery

把原始请求路由到合适 workflow。

## 读取

- `.specforge/manifest.yaml`
- `.specforge/rules/context.md`
- `.specforge/rules/boundaries.md`
- `.specforge/registry.yaml`
- 相关 `.specforge/project/` 文件

## 写入

- `00-intake/original-request.md`
- `00-intake/brief.md`
- 可选 `00-intake/roadmap.md`

## 本地脚手架

```bash
node .specforge/tools/create-change.mjs "Change title"
node .specforge/tools/create-change.mjs --dry-run "Change title"
```

## 停止条件

已经选择一个路由：`NO_SPEC_NEEDED`、`SINGLE_CHANGE`、`MULTI_CHANGE`、`EXTEND_EXISTING` 或 `MIXED`。
