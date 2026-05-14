# Tasks

## Parallel Waves

| Wave | Goal | Tasks |
|---|---|---|
| P0 | 实现研究 | T001, T002 |
| P1 | 架构与机制落地 | T003, T004 |
| P2 | SSoT 回流与验证 | T005, T006 |

## Task List

- [x] T001 [P0] 深读 OpenSpec 实现。
  _Boundary:_ `/private/tmp/specforge-impl-study-openspec`, `docs/research/openspec-implementation-study.md`
  _Depends:_ none
  _Verification:_ 研究文档覆盖 artifact graph、instructions、validation、apply/archive、config。

- [x] T002 [P0] 深读 cc-sdd 实现。
  _Boundary:_ `/private/tmp/specforge-impl-study-cc-sdd`, `docs/research/cc-sdd-implementation-study.md`
  _Depends:_ none
  _Verification:_ 研究文档覆盖 installer、manifest、agent registry、shared rules、skills、review gates、impl validation。

- [x] T003 [P1] 输出 SpecForge 差距分析和 v0.2 参考架构。
  _Boundary:_ `docs/research`, `docs/architecture`
  _Depends:_ T001, T002
  _Verification:_ `specforge-gap-analysis.md` 和 `v0.2-reference-architecture.md` 已创建。

- [x] T004 [P1] 增加 artifact graph 最小机制。
  _Boundary:_ `.specforge/schemas`, `.specforge/rules`, `scripts`, `package.json`
  _Depends:_ T003
  _Verification:_ `node .specforge/tools/artifact-graph-status.mjs` 能展示 active change artifact 状态。

- [x] T005 [P2] 更新 SSoT 和 ADR。
  _Boundary:_ `.specforge/project`
  _Depends:_ T003, T004
  _Verification:_ architecture、validation-model、feature-list、ADR 已更新。

- [x] T006 [P2] 运行验证并完成变更记录。
  _Boundary:_ `05-verification`, `06-closure`, `change.yaml`, `registry.yaml`
  _Depends:_ T005
  _Verification:_ `node .specforge/tools/validate-structure.mjs`、`node .specforge/tools/artifact-graph-status.mjs`、`node .specforge/tools/status.mjs` 已运行并记录。
