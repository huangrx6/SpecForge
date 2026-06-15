# Ops / Runtime Requirements Pattern

用于调度、批处理、后台任务、告警、观测、重试、并发、运行成本和人工恢复。

## 什么时候使用

- 需求包含后台任务、定时任务、导入导出任务、异步处理、长耗时作业或大批量数据。
- 失败、超时、重试、取消、并发或成本会影响业务结果。
- 需要运维、客服、管理员或用户查看任务状态和失败原因。
- 需要对日志、指标、审计、告警或人工处理有需求级约束。

## 必须问清

- 任务由谁或什么事件触发？是否可以取消？
- 时限、并发、重试次数、失败终态和人工介入是什么？
- 用户或 operator 能看到哪些状态、原因、进度和结果？
- 哪些事件需要日志、指标、审计或告警？
- 大任务、外部调用或 AI 调用是否有成本边界？
- 失败后是否能安全重跑，是否需要防重复副作用？

## REQ / NFR 模板

| 场景 | 写法 |
|---|---|
| 任务触发 | `WHEN <trigger> occurs, THE SYSTEM SHALL create a runtime job and expose its current processing state.` |
| 失败状态 | `WHEN a runtime job fails, THE SYSTEM SHALL expose job id, failure reason, retry state, and available recovery action.` |
| 取消 | `WHILE a job is cancellable, THE SYSTEM SHALL allow authorized users to cancel it and expose the final cancellation state.` |
| 可观测性 | `THE SYSTEM SHALL emit an observable failure event with job id, reason, and retry state for each failed job.` |
| 成本边界 | `THE SYSTEM SHALL expose or enforce <cost/quota/volume> limits before running work that exceeds the confirmed boundary.` |
| 并发 | `THE SYSTEM SHALL prevent duplicate concurrent execution for the same <business key> when duplicate execution would create conflicting results.` |

## AC 模板

| Given | When | Then | 验证方式 |
|---|---|---|---|
| 任务被触发 | 用户或系统启动任务 | 系统展示 job id 和 processing state | E2E / inspection |
| 任务失败 | 用户查看任务状态 | 系统展示失败原因、retry state 和恢复动作 | E2E |
| 用户取消可取消任务 | 任务处于 cancellable 状态 | 系统停止后续处理并展示 cancelled state | automated / E2E |
| 同一业务键重复触发 | 第二个任务启动 | 系统阻止重复副作用或展示已有任务状态 | automated |

## 常见漏项

- 只写“后台执行”，不写用户或 operator 如何知道状态。
- 不写失败原因、重试、取消、超时、并发和人工处理。
- NFR 写“稳定可靠”，没有指标、事件或检查方法。
- 成本、限流、批量规模和执行时间没有边界。
