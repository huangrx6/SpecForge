# Implementation Plan

## 范围

本次实现把 SpecForge 源码仓库从旧的根级 `specforge-*` + `.specforge/` 母本结构，迁移到：

```text
skills/
runtime/
starter/
docs/
cli/
```

业务项目初始化后仍输出 `.specforge/`。

## 步骤

1. 批准 spec review gate，并进入 implementation。
2. 建立新顶层目录，复制旧母本资产到 `runtime/` 分层结构。
3. 创建 `skills/sf` 和 `skills/sf-*`，更新 frontmatter 与路由名。
4. 将运行工具改为 layout-aware：源码仓库使用 `runtime/`，业务项目使用 `.specforge/`。
5. 将 starter 改成由 `runtime/starter.manifest.json` 生成的扁平快照。
6. 将 CLI 迁移到 `cli/specforge.mjs`，更新 package scripts 与 bin 入口。
7. 增加 default noop hooks 与最小 `sf-status` / `sf-next` / `sf-review` commands。
8. 将旧 `.specforge`、旧根级 `specforge*` 和旧 `bin` 收纳到 `docs/legacy/`。
9. 运行 source validation、project smoke test 和 skill install。

## 预计变更文件

- `skills/**`
- `runtime/**`
- `starter/**`
- `docs/**`
- `cli/specforge.mjs`
- `package.json`
- root `README.md` / `AGENTS.md` / `CLAUDE.md`
