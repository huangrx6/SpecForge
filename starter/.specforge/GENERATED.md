# 生成产物

此目录由 `runtime/starter.manifest.json` 生成，不是源码母本。

不要手工修改本目录内容。需要更新 starter 时，修改 `runtime/` 母本或 `runtime/starter.manifest.json`，然后运行：

```bash
node runtime/execution/tools/sync-starter-assets.mjs
node runtime/execution/tools/sync-starter-assets.mjs --check
```
