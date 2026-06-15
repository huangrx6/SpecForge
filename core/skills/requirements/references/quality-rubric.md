# Requirements Quality Rubric

## Gate

| 检查项 | 通过标准 |
|---|---|
| 来源清晰 | 每条 REQ / NFR 有 source |
| 确认边界 | MUST 只来自 user-confirmed / delegated-default / current fact |
| 行为可测试 | 每条 MUST 有 AC |
| AC 可执行 | AC 有 Given / When / Then / 验证方式 |
| 边界明确 | In Scope / Out of Scope / deferred 清楚 |
| 无实现泄漏 | 不写 API / DB / class / package 方案 |
| 影响面可路由 | flags 和 handoff 能驱动后续阶段 |
| 未决可见 | pending / decision marker 不被隐藏 |

## 判定

- P0：未确认项被写成 MUST、REQ 无 AC、AC 不可验证。
- P1：缺 source、缺边界、需求和非目标冲突。
- P2：NFR 无阈值、handoff 不清、过长不可读。

## Spec Quality Gate 写法

```md
| 检查项 | 结论 | 证据 |
|---|---|---|
| 来源清晰 | pass / warn / fail | REQ / AC Trace |
| 行为可测试 | pass / warn / fail | every MUST has AC |
```
