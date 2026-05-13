# 任务拆解

## 并行波次

| Wave | 目标 | Tasks |
|---|---|---|
| P0 | 入口契约 | T001, T002 |
| P1 | 技能和命令实现 | T003, T004, T005 |
| P2 | 文档、SSoT、验收 | T006, T007, T008 |

## 任务列表

- [x] T001 [P0] 新增 `specforge` 根技能，定义扫描、路由和退出条件。
  _Boundary:_ `.specforge/skills/specforge/SKILL.md`
  _Depends:_ none
  _Verification:_ 根技能只做路由，不写阶段产物。

- [x] T002 [P0] 新增 lifecycle 子技能骨架。
  _Boundary:_ `.specforge/skills/specforge-*/SKILL.md`
  _Depends:_ T001
  _Verification:_ 每个子技能都有明确触发场景、读取、写入、完成标准。

- [x] T003 [P1] 新增 `doctor` 命令和 command card。
  _Boundary:_ `.specforge/tools/doctor.mjs`, `package.json`, `.specforge/commands/specforge.doctor.md`
  _Depends:_ T002
  _Verification:_ `node .specforge/tools/doctor.mjs`

- [x] T004 [P1] 新增 `specforge.work` command card 和一键模式边界。
  _Boundary:_ `.specforge/commands/specforge.work.md`, `.specforge/skills/specforge-work/SKILL.md`
  _Depends:_ T002
  _Verification:_ 文档明确不绕过 gate。

- [x] T005 [P1] 更新 `AGENTS.md`、README 和 validate required paths。
  _Boundary:_ `.specforge/AGENTS.md`, `README.md`, `.specforge/tools/validate-structure.mjs`
  _Depends:_ T001, T002, T003
  _Verification:_ `node .specforge/tools/validate-structure.mjs`

- [x] T006 [P2] 补充 AI 使用文档和 SSoT 决策。
  _Boundary:_ `docs/ai-usage.md`, `.specforge/project/decisions/ADR-0007-ai-skill-entry.md`, `.specforge/project/product/feature-list.md`
  _Depends:_ T005
  _Verification:_ 文档包含严格分阶段和一键模式。

- [x] T007 [P2] 完成 review、verification、ssot、closure artifacts。
  _Boundary:_ `.specforge/changes/active/CHG-20260512-007-*`
  _Depends:_ T006
  _Verification:_ 所有 gate APPROVED。

- [x] T008 [P2] 运行最终验证并归档 CHG-007。
  _Boundary:_ `.specforge/registry.yaml`, `.specforge/changes/archive`
  _Depends:_ T007
  _Verification:_ `node .specforge/tools/doctor.mjs`, `node .specforge/tools/archive-change.mjs`
