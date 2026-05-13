# Tasks

## 并行波次

| Wave | 目标 | Tasks |
|---|---|---|
| P0 | 契约、体验和验证基础 | |
| P1 | 核心实现 | |
| P2 | 集成、体验验证和收口 | |

## 任务列表

- [ ] T001 [P0] 定义契约、页面状态和预期失败的验证。
  _Boundary:_ `path/or/module`
  _Depends:_ none
  _Verification:_ 实现前验证能以预期原因失败，且页面 / 交互状态有可检查标准。

- [ ] T002 [P1] 实现满足 T001 的最小行为。
  _Boundary:_ `path/or/module`
  _Depends:_ T001
  _Verification:_ 验证通过。

- [ ] T003 [P2] 运行集成验证并更新 SSoT。
  _Boundary:_ `.specforge/workspace/knowledge`, `05-verification`, `06-closure`
  _Depends:_ T002
  _Verification:_ verification report 和 SSoT sync 完成。
