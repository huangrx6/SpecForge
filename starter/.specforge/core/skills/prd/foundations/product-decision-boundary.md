# Product Decision Boundary

## PRD 可以决定

- 为什么做。
- 给谁做。
- 解决什么问题。
- 第一版 MVP 做什么。
- 第一版不做什么。
- 用户价值和业务目标。
- 成功指标。
- 候选功能如何取舍。
- 哪些风险需要下游处理。
- 是否进入 requirements。

## PRD 不可以决定

- API 字段。
- 数据库表。
- 组件拆分。
- 技术栈细节。
- 测试命令。
- 任务排期。
- 最终验收标准编号。
- 具体实现路径。

## 决策状态

| 状态 | 含义 | 是否可进入 requirements |
|---|---|---|
| `approved-for-requirements` | MVP、目标用户、成功标准、非目标已确认 | yes |
| `needs-decision` | 高影响产品决策未确认 | no |
| `delegated-default` | 用户授权 Agent 按推荐默认推进 | yes, with risk note |
| `research-needed` | 事实不足以决定范围或指标 | no |
| `blocked-by-conflict` | 上游输入冲突 | no |

## 进入 requirements 的最小条件

- 目标用户明确。
- 核心问题明确。
- MVP 范围明确。
- 非目标明确。
- 成功标准至少有一个可观察指标。
- 高影响未决问题已清零，或有明确 owner / needed-by。
- Handoff To Requirements 中有 requirements seeds。

## 边界修正

| 越界信号 | 修正 |
|---|---|
| PRD 写 REQ / AC 编号 | 改成 User Stories & Acceptance Seeds，交给 requirements 转译 |
| PRD 写 API / DB / SDK | 移到 Notes for technical_design 或 dependency decision |
| PRD 写组件 / 颜色 / layout | 移到 Notes for ui_design |
| PRD 写测试命令 | 移到 verification handoff |
| Agent recommendation 写成 MVP | 改成 candidate、delegated-default 或 pending |
