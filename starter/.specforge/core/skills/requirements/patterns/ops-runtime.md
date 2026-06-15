# Ops / Runtime Pattern

用于调度、批处理、后台任务、告警、观测、重试、并发和运行成本。

## 输出

| 类型 | 要求 |
|---|---|
| Runtime | 任务触发、时限、并发、取消、重试 |
| Observability | 日志、指标、审计、告警 |
| Recovery | 失败恢复、人工处理、回滚 |
| Cost | 大任务、外部调用或 AI 成本边界 |

## 示例

```md
| NFR-OPS-001 | Observability | THE SYSTEM SHALL expose a failure event with job id, reason, and retry state for each failed import job. | inspection | technical_design / verification |
```
