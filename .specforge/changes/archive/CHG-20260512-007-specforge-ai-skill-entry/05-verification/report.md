# 验证报告

## 范围

验证 CHG-007 新增的 AI 技能入口、doctor 命令、文档和校验覆盖。

## 命令

- `node .specforge/tools/doctor.mjs`
- `node .specforge/tools/validate-structure.mjs`
- `node .specforge/tools/instructions.mjs -- verification --json`

## 结果

- `node .specforge/tools/doctor.mjs` 通过。
- `node .specforge/tools/validate-structure.mjs` 通过，检查 112 个 required paths、workflow schema、registry paths 和 change evidence。
- `node .specforge/tools/instructions.mjs -- verification --json` 可输出 verification artifact 的结构化状态。
- 当前 artifact graph 显示 verification ready，后续 ssot_sync 和 closure blocked，符合 gate 依赖。

## 边界检查

- 没有安装全局 skill。
- 没有修改 archived change。
- 一键推进文档保留 gate、verification、SSoT sync。
- 根技能只做路由，不直接写阶段产物。

## 重新验证触发条件

- 修改 `.specforge/skills/specforge/SKILL.md`。
- 修改任一 `specforge-*` 子技能。
- 修改 `.specforge/tools/doctor.mjs`。
- 修改 validate required paths。

## Evidence

- `05-verification/ci-result.md`
- `04-code-review/code-review-v1.md`

## 已知缺口

- 目前技能是仓库内协议，还未安装到全局 Codex skills。
- 还未实现真实 Claude/OpenCode adapter。
