# Claude Code Notes

SpecForge 新入口技能统一使用 `sf-router` 和 `sf-*` 前缀。

常用命令：

```bash
npm run doctor
npm run instructions
npm run gate -- spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
node cli/specforge.mjs skill add --target all --apply --prune-legacy
```

维护规则：

- 修改 Agent 入口技能：编辑 `skills/sf*/SKILL.md`。
- 修改阶段行为：编辑 `runtime/execution/stages/*/SKILL.md`。
- 修改规则或模板：编辑 `runtime/policy/` 或 `runtime/artifacts/`，然后运行 `npm run sync:starter`。
- 修改工具：编辑 `runtime/execution/tools/`，然后运行 `npm run doctor`。

业务项目初始化后仍使用 `.specforge/`，不要把业务项目目录改成 `runtime/`。
