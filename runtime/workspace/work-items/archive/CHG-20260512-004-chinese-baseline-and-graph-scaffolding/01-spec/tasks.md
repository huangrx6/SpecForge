# Tasks

## 并行波次

| Wave | 目标 | Tasks |
|---|---|---|
| P0 | 脚手架和校验 | T001, T002, T003 |
| P1 | 中文化 | T004, T005 |
| P2 | 验证和收口 | T006 |

## 任务列表

- [x] T001 [P0] 改造 `new:change` 为 intake-only。
  _Boundary:_ `.specforge/tools/create-change.mjs`
  _Depends:_ none
  _Verification:_ dry run 输出 `Artifacts: change.yaml + intake only`。

- [x] T002 [P0] 新增 `new:artifact`。
  _Boundary:_ `.specforge/tools/create-artifact.mjs`, `package.json`
  _Depends:_ T001
  _Verification:_ blocked artifact 会拒绝生成，ready artifact 可生成或跳过已存在文件。

- [x] T003 [P0] 调整 validate / graph status。
  _Boundary:_ `.specforge/tools/validate-structure.mjs`, `.specforge/tools/artifact-graph-status.mjs`
  _Depends:_ T001, T002
  _Verification:_ active incomplete 允许通过，archive 完整性仍被检查。

- [x] T004 [P1] 中文化核心入口、规则、技能和命令卡。
  _Boundary:_ `.specforge/AGENTS.md`, `.specforge/rules`, `.specforge/skills`, `.specforge/commands`
  _Depends:_ none
  _Verification:_ 核心说明已改为中文。

- [x] T005 [P1] 中文化模板和项目 SSoT 核心文件。
  _Boundary:_ `.specforge/templates`, `docs`, `.specforge/project`
  _Depends:_ none
  _Verification:_ 新生成 artifact 默认中文骨架。

- [x] T006 [P2] 运行验证并更新本 change evidence。
  _Boundary:_ `05-verification`, `06-closure`
  _Depends:_ T001, T002, T003, T004, T005
  _Verification:_ `node .specforge/tools/validate-structure.mjs`、`node .specforge/tools/artifact-graph-status.mjs`、`node .specforge/tools/status.mjs` 通过。
