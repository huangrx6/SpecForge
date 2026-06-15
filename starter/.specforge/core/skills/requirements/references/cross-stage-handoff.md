# Cross-stage Handoff

requirements 必须明确下游拿什么继续，以及什么情况必须停止。

## Handoff 表

```md
## Downstream Handoff

| 下游 | 输入 | 阻断条件 |
|---|---|---|
| ui_design | 页面范围、用户动作、状态、文案线索、a11y 线索 | UI 方向未确认 / 状态缺失 |
| technical_design | 数据、权限、集成、NFR、依赖决策信号 | 依赖 / 工具链未确认 |
| tasking | REQ / AC trace、非目标、风险 | REQ 无 AC / pending 未解决 |
| verification | AC、验证方式、重新验证触发 | AC 不可执行 |
```

## 交接纪律

- UI design 不应重新定义需求行为。
- technical design 不应把 pending 决策当成已确认。
- tasking 不应创建追不回 REQ / AC 的任务。
- verification 不应测试 requirements 未承诺的范围。
