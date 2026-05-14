# SSoT 同步

## 本变更是否影响项目 SSoT？

是。本次变更新增运行时指令、gate 更新、archive 命令和 closure artifact，属于 SpecForge 工作流协议能力变化，需要回写产品功能清单、校验模型和架构决策。

## 已更新文件

- `README.md`
- `docs/getting-started.md`
- `docs/architecture/v0.2-reference-architecture.md`
- `.specforge/project/engineering/validation-model.md`
- `.specforge/project/product/feature-list.md`
- `.specforge/project/decisions/ADR-0006-runtime-instructions-and-gates.md`

## 契约变化

- `standard` workflow 新增 `closure` artifact。
- archive 依赖扩展为 `verification`、`ssot_sync`、`closure`。
- 新增命令契约：
  - `node .specforge/tools/instructions.mjs`
  - `node .specforge/tools/instructions.mjs -- apply`
  - `node .specforge/tools/gate.mjs <gate> APPROVED --evidence <path>`
  - `node .specforge/tools/archive-change.mjs`

## 需要下游重新验证

- `.specforge/schemas/standard.json` 变化后需要重新运行 `node .specforge/tools/validate-structure.mjs`。
- 所有依赖 artifact 图的命令需要重新运行 `node .specforge/tools/artifact-graph-status.mjs` 和 `node .specforge/tools/instructions.mjs`。
- 归档逻辑需要通过当前 CHG-005 实际归档验证。

## 未更新原因

无。

## 备注

SSoT 已更新，待 `ssot_sync` gate 批准后生成 closure artifact。
