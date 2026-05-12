# 任务拆解

## 并行波次

| Wave | 目标 | Tasks |
|---|---|---|
| P0 | 已知问题固化 | T001, T002 |
| P1 | 校验增强 | T003, T004 |
| P2 | 文档和收口 | T005, T006 |

## 任务列表

- [x] T001 [P0] 将 registry 操作抽到共享库。
  _Boundary:_ `.specforge/tools/lib/specforge.mjs`, `.specforge/tools/archive-change.mjs`
  _Depends:_ none
  _Verification:_ `node .specforge/tools/archive-change.mjs -- --dry-run`

- [x] T002 [P0] 新增 registry 自测脚本。
  _Boundary:_ `.specforge/tools/self-test.mjs`, `package.json`
  _Depends:_ T001
  _Verification:_ `node .specforge/tools/self-test.mjs`

- [x] T003 [P1] 增强 validate registry 与目录双向一致性检查。
  _Boundary:_ `.specforge/tools/validate-structure.mjs`
  _Depends:_ T002
  _Verification:_ `node .specforge/tools/validate-structure.mjs`

- [x] T004 [P1] 生成并批准 spec/code/verification/ssot gates。
  _Boundary:_ `.specforge/changes/active/CHG-20260512-006-*`
  _Depends:_ T003
  _Verification:_ 所有 gate APPROVED。

- [x] T005 [P2] 回写 README、validation model、feature list。
  _Boundary:_ `README.md`, `.specforge/project`
  _Depends:_ T003
  _Verification:_ SSoT sync 完成。

- [x] T006 [P2] 最终验证并归档 CHG-006。
  _Boundary:_ `.specforge/registry.yaml`, `.specforge/changes/archive`
  _Depends:_ T004, T005
  _Verification:_ `node .specforge/tools/validate-structure.mjs`, `node .specforge/tools/archive-change.mjs`
