# Requirements Anti-patterns

| 反模式 | 表现 | 修正 |
|---|---|---|
| Story dump | 把用户故事直接贴进 requirements | 转成 REQ / AC / NFR |
| Recommendation as requirement | Agent recommendation 写成 MUST | 改为 pending 或等待确认 |
| Design leakage | 写组件、接口、数据库、类名 | 移到 UI / technical design handoff |
| Untestable adjective | 快速、友好、完善、稳定 | 写阈值或可观察结果 |
| Missing negative path | 只写成功路径 | 补失败、空态、权限、边界 |
| Orphan AC | AC 没有对应 REQ | 建 trace 或删除 |
| Orphan REQ | REQ 没有 AC | 补 AC 或降级为 note |
| Scope creep | 非目标没有记录 | 写 Out of Scope 和触发条件 |
| Hidden decision | 未决问题被写成假设 | 写 `[NEEDS CLARIFICATION]` |
