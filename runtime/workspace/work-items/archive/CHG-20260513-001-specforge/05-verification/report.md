# Verification Report

## 范围

验证目录重组后的源码仓库、业务项目 starter、CLI 初始化和已安装 `sf-*` 技能。

## 命令

```bash
node runtime/execution/tools/doctor.mjs
node cli/specforge.mjs init --dir /private/tmp/specforge-smoke-runtime --force
node cli/specforge.mjs skill add --target all --apply
find . -maxdepth 2 -type d | sort
```

## 结果

- `doctor` PASS：selftest、validate-skills、validate、status、graph 全部通过。
- 业务项目 smoke PASS：`/private/tmp/specforge-smoke-runtime` 成功生成 `.specforge/`，项目内 doctor 通过。
- 技能安装 PASS：Codex、Claude Code、cc-switch 中的 `sf` / `sf-*` 全部 update 成功。
- 根目录结构已实际变化：`skills/`、`runtime/`、`starter/`、`docs/`、`cli/` 已存在；旧结构在 `docs/legacy/`。

## 边界检查

- 业务项目仍使用 `.specforge/`，没有被改名为 `runtime/`。
- `starter/` 不包含当前 active change；业务 smoke 项目无 active/archive change。
- package `files` 已改为 `cli`、`runtime`、`starter`、`skills`、`docs`。
- hooks 默认 noop，不影响现有 gate；`pre-gate` 可阻断，`post-gate` 支持 strict 模式。

## 重新验证触发条件

- 修改 `runtime/execution/tools/lib/specforge.mjs` 的 layout 检测。
- 修改 `runtime/starter.manifest.json`。
- 修改 `skills/sf-onboard` 的 starter 嵌入策略。
- 修改 package `bin` 或 `files`。

## Evidence

- source doctor output: PASS。
- smoke init output: PASS。
- skill install output: PASS。

## 已知缺口

- 本次保留旧已安装 `specforge-*` 技能副本，没有主动删除；新入口为 `sf` / `sf-*`。
