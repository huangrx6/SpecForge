# Tasks

## 并行波次

| Wave | 目标 | Tasks |
|---|---|---|
| P0 | 契约和验证基础 | |
| P1 | 实现 | |
| P2 | 集成和收口 | |

## 任务列表

- [ ] T001 [P0] 定义契约和预期失败的验证。
  _Boundary:_ `path/or/module`
  _Depends:_ none
  _Verification:_ 实现前验证能以预期原因失败。

- [ ] T002 [P1] 实现满足 T001 的最小行为。
  _Boundary:_ `path/or/module`
  _Depends:_ T001
  _Verification:_ 验证通过。

- [ ] T003 [P2] 运行集成验证并更新 SSoT。
  _Boundary:_ `.specforge/project`, `05-verification`, `06-closure`
  _Depends:_ T002
  _Verification:_ verification report 和 SSoT sync 完成。
