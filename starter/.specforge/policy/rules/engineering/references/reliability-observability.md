# 可靠性和可观测性

本参考用于错误处理、日志、指标、追踪和关键链路运行质量。

## 错误处理

- 调用方看到的是稳定错误，不是堆栈、内部类名或密钥片段。
- 错误信息要可处理，不只是“失败了”。
- 内部细节写日志，外部响应写稳定契约。
- 失败模式、重试条件、超时、取消、幂等、事务和资源释放在相关场景必须显式考虑。

## 日志

日志应帮助定位问题，至少考虑：

- 事件。
- 对象标识。
- 结果。
- trace / correlation id。
- 关键分支和失败原因。

不要记录：

- 明文 secret。
- 完整 token。
- 密码。
- 高敏个人信息。

## 指标和追踪

新增关键链路应判断是否需要：

- 指标。
- structured logging。
- distributed tracing。
- 告警。
- 手工观察窗口。

Google SRE 指出，监控可以同时依赖 metrics、logs、structured event logging 和 distributed tracing；不是所有改动都要补齐全套，但关键链路应有足够观察面。

## 与 verification 的关系

可观测性不是“上线后再说”，它应帮助：

- verification 阶段确认行为。
- code review 判断错误处理是否足够。
- closure 判断上线后是否能观察异常。

## Review Checklist

- 错误是否稳定且可处理。
- 是否定义了超时、重试、取消、幂等或事务语义。
- 日志是否能支持排查。
- 是否缺少关键指标或追踪。
- 是否需要补 delivery 侧上线观察要求。
