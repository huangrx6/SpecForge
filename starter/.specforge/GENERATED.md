# 生成产物

此目录由 SpecForge CLI 根据源码仓库的 `core/starter.manifest.json` 生成，不是源码母本。

业务项目中不要手工修改 `.specforge/core/`。需要升级 SpecForge 运行时，请重新执行官方初始化或升级流程。

维护 SpecForge 源码仓库时，修改 `core/` 母本或 `core/starter.manifest.json` 后，在源码仓库运行：

```bash
node core/scripts/sync-starter.mjs
node core/scripts/sync-starter.mjs --check
```
