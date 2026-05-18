# Claude Code Notes

SpecForge 新入口技能统一使用 `sf-router` 和 `sf-*` 前缀。

常用命令：

```bash
npm run doctor
npm run instructions
npm run gate -- spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
node cli/specforge.mjs skill add --target all --apply
```

维护约定：

- 修改 Agent 入口技能：编辑 `agent-skills/sf*/SKILL.md`。
- 修改阶段行为：编辑 `core/workflows/stages/*/SKILL.md`。
- 修改标准或模板：编辑 `core/standards/` 或 `core/artifacts/`，然后运行 `npm run sync:starter`。
- 修改工具：编辑 `core/scripts/`，然后运行 `npm run doctor`。

业务项目初始化后仍使用 `.specforge/`；源码母本是 `core/`，项目内可运行脚本位于 `.specforge/core/scripts/`。
