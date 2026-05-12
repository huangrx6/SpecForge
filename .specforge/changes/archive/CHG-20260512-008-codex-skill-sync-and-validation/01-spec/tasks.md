# 任务拆解

## 并行波次

| Wave | 目标 | Tasks |
|---|---|---|
| P0 | 校验和同步契约 | T001, T002 |
| P1 | 实现脚本和集成 doctor | T003, T004 |
| P2 | 文档、真实同步、归档 | T005, T006, T007 |

## 任务列表

- [x] T001 [P0] 实现 skill 校验脚本。
  _Boundary:_ `.specforge/tools/validate-skills.mjs`
  _Depends:_ none
  _Verification:_ `node .specforge/tools/validate-skills.mjs`

- [x] T002 [P0] 实现 Codex skill 同步脚本，默认 dry-run。
  _Boundary:_ `.specforge/tools/sync-codex-skills.mjs`
  _Depends:_ T001
  _Verification:_ `node .specforge/tools/sync-codex-skills.mjs`

- [x] T003 [P1] 注册 npm scripts，并将 skill 校验加入 doctor。
  _Boundary:_ `package.json`, `.specforge/tools/doctor.mjs`
  _Depends:_ T002
  _Verification:_ `node .specforge/tools/doctor.mjs`

- [x] T004 [P1] 更新 validate required paths。
  _Boundary:_ `.specforge/tools/validate-structure.mjs`
  _Depends:_ T003
  _Verification:_ `node .specforge/tools/validate-structure.mjs`

- [x] T005 [P2] 更新 README、AI 使用文档和 SSoT。
  _Boundary:_ `README.md`, `docs/ai-usage.md`, `.specforge/project`
  _Depends:_ T004
  _Verification:_ 文档包含 dry-run 与 apply 说明。

- [x] T006 [P2] 执行真实同步并验证全局 skill 存在。
  _Boundary:_ `~/.codex/skills/specforge*`
  _Depends:_ T005
  _Verification:_ `test -f ~/.codex/skills/specforge/SKILL.md`

- [x] T007 [P2] 完成 review、verification、closure 并归档。
  _Boundary:_ `.specforge/changes/active/CHG-20260512-008-*`
  _Depends:_ T006
  _Verification:_ `node .specforge/tools/archive-change.mjs`
