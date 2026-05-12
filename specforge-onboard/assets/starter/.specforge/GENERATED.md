# 生成产物

此目录由根目录 `.specforge/starter.manifest.json` 生成，不是源码母本。

不要手工修改本目录内容。需要更新 starter 时，修改根 `.specforge/` 母本或 `.specforge/starter.manifest.json`，然后运行：

```bash
node .specforge/tools/sync-starter-assets.mjs
node .specforge/tools/sync-starter-assets.mjs --check
```
