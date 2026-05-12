# 任务拆解

## 并行波次

| Wave | 目标 | Tasks |
|---|---|---|
| P0 | 契约和运行时基础 | T001, T002, T003 |
| P1 | 命令实现和校验增强 | T004, T005, T006, T007 |
| P2 | 自举实践和文档回写 | T008, T009, T010, T011 |

## 任务列表

- [x] T001 [P0] 将 `closure` artifact 加入 `standard` workflow，并更新 archive 依赖。
  _Boundary:_ `.specforge/schemas/standard.json`
  _Depends:_ none
  _Verification:_ `node .specforge/tools/artifact-graph-status.mjs` 能显示 `closure`。

- [x] T002 [P0] 新增共享运行时库，集中处理 change、schema、artifact、gate 的基础计算。
  _Boundary:_ `.specforge/tools/lib/specforge.mjs`
  _Depends:_ T001
  _Verification:_ 新命令复用该库运行。

- [x] T003 [P0] 在 `package.json` 注册 lifecycle 命令。
  _Boundary:_ `package.json`
  _Depends:_ T002
  _Verification:_ `node .specforge/tools/instructions.mjs` / `npm run gate` / `node .specforge/tools/archive-change.mjs` 可调用。

- [x] T004 [P1] 实现 `instructions`，支持默认下一步、指定 artifact、apply 模式和 JSON 输出。
  _Boundary:_ `.specforge/tools/instructions.mjs`
  _Depends:_ T002, T003
  _Verification:_ `node .specforge/tools/instructions.mjs` 可以识别 requirements。

- [x] T005 [P1] 实现 `gate`，批准 gate 时强制校验证据存在。
  _Boundary:_ `.specforge/tools/gate.mjs`
  _Depends:_ T002, T003
  _Verification:_ 用 spec_review evidence 批准 gate。

- [x] T006 [P1] 实现 `archive`，归档前检查所有 workflow artifact 状态。
  _Boundary:_ `.specforge/tools/archive-change.mjs`
  _Depends:_ T002, T003
  _Verification:_ closure 完成前拒绝归档，完成后允许归档。

- [x] T007 [P1] 增强结构校验，覆盖模板映射、循环依赖、change 生命周期状态。
  _Boundary:_ `.specforge/tools/validate-structure.mjs`
  _Depends:_ T001
  _Verification:_ `node .specforge/tools/validate-structure.mjs` 通过。

- [x] T008 [P2] 用 CHG-005 生成 spec_review 并通过 gate。
  _Boundary:_ `.specforge/changes/active/CHG-20260512-005-*`
  _Depends:_ T004, T005, T007
  _Verification:_ `node .specforge/tools/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md`

- [x] T009 [P2] 用 CHG-005 生成 implementation、code_review、verification、ssot_sync、closure artifacts。
  _Boundary:_ `.specforge/changes/active/CHG-20260512-005-*`
  _Depends:_ T008
  _Verification:_ `node .specforge/tools/artifact-graph-status.mjs` 全部 done。

- [x] T010 [P2] 回写 README、getting started、validation model 和 ADR。
  _Boundary:_ `README.md`, `docs/`, `.specforge/project`
  _Depends:_ T009
  _Verification:_ 文档包含新生命周期命令和实践结果。

- [x] T011 [P2] 运行最终验证并归档 CHG-005。
  _Boundary:_ `.specforge/registry.yaml`, `.specforge/changes/archive`
  _Depends:_ T002
  _Verification:_ `node .specforge/tools/validate-structure.mjs`, `node .specforge/tools/status.mjs`, `node .specforge/tools/archive-change.mjs`
