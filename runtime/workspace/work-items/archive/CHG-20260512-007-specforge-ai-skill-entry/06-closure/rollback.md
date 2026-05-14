# 回滚记录

## 回滚触发条件

- `node .specforge/tools/doctor.mjs` 失败且无法快速修复。
- `validate` 对新增技能 required paths 产生误报。
- 根技能路由规则导致 Agent 错误跳过 gate。
- 一键模式文档引发绕过 verification 或 SSoT sync 的行为。

## 回滚步骤

- 移除 `.specforge/skills/specforge/` 和 `.specforge/skills/specforge-*` 新增目录。
- 移除 `.specforge/tools/doctor.mjs` 和 `package.json` 中 `doctor` script。
- 移除 `.specforge/commands/specforge.doctor.md`、`.specforge/commands/specforge.work.md`。
- 移除 `docs/ai-usage.md`。
- 从 `.specforge/tools/validate-structure.mjs` required paths 中移除新增路径。
- 回滚 README、AGENTS、SSoT 和 ADR-0007 的相关更新。

## 回滚后验证

- `node .specforge/tools/validate-structure.mjs`
- `node .specforge/tools/self-test.mjs`
- `node .specforge/tools/status.mjs`
