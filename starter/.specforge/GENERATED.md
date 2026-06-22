# 生成产物

此目录由 SpecForge CLI 根据源码仓库的 `core/starter.manifest.json` 生成，不是源码母本。

业务项目中不要手工修改 `.specforge/core/` 或 `.specforge/skills/`。需要升级 SpecForge 运行时，请执行：

```bash
specforge upgrade --dir .
```

升级会保留 `.specforge/wiki/`、`.specforge/work/`、`.specforge/registry.yaml`、`.specforge/project.yaml`、`.specforge/hooks/local/` 和已有 `.specforge/AGENTS.md`。

维护 SpecForge 源码仓库时，修改 `core/` 母本或 `core/starter.manifest.json` 后，在源码仓库运行：

```bash
node core/scripts/sync-starter.mjs
node core/scripts/sync-starter.mjs --check
```
