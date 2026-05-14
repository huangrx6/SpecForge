# RPC、gRPC 和 SDK

本参考用于设计强契约调用面：RPC service、gRPC proto、IDL，以及对外 SDK。它们共同的危险点是“修改很方便，破坏调用方也很方便”。

## 什么时候选 RPC / gRPC

| 更适合 | 原因 |
|---|---|
| 服务间高频调用 | 低开销、强类型 |
| 需要 streaming | 原生支持流式 |
| 多语言客户端 | 可代码生成 |
| 严格接口治理 | proto / IDL 可做兼容校验 |

如果目标是开放平台、浏览器直接调用或宽松兼容生态，REST 往往更合适。

## Service 设计

RPC 契约必须明确：

- service 名称。
- method 名称。
- request / response 类型。
- 一元、服务端流、客户端流、双向流。
- deadline 和 cancellation。
- 重试语义。
- 幂等语义。
- 错误映射。
- 权限边界。

方法命名应表达业务意图，例如 `CreateInvoice`、`ListInvoices`，不要用模糊万能方法。

## Proto / IDL 规则

必须遵守：

- 字段编号一旦发布，不可复用。
- 删除字段时应 `reserved`。
- 不要随意改变字段类型。
- 新增字段优先 optional 兼容。
- enum 应保留 unknown / unspecified 值。
- map、oneof、repeated 的兼容行为要明确。
- 时间、金额、二进制等特殊类型要统一建模。

需要特别评估的破坏性变更：

- 改 field number。
- 把 scalar 改 message。
- 改 repeated 与 singular。
- 改 oneof 结构。
- 删除 enum value。
- 改 streaming 形态。

## Streaming

流式 RPC 必须说明：

- 谁先发消息。
- 消息顺序。
- 完成条件。
- 心跳。
- 背压。
- 中断恢复。
- 局部失败如何表达。
- 断线重连后是否允许 resume。

如果这些不写清，流只是把复杂度往客户端扔。

## 错误与重试

RPC 错误必须映射到稳定的 code 和 detail：

| 维度 | 需要说明 |
|---|---|
| transport code | 如 `INVALID_ARGUMENT`、`NOT_FOUND`、`UNAVAILABLE` |
| 业务错误 | 稳定业务码或 error detail |
| 重试 | 哪些 code 可重试 |
| deadline | 超时后是否可安全重试 |
| 幂等 | 重试是否可能重复副作用 |

## SDK 公共面

SDK 契约必须明确：

- 初始化方式。
- 认证方式。
- 默认配置。
- 超时、重试和 backoff。
- 线程安全或并发模型。
- 资源释放。
- 异常体系或 result 体系。
- 日志和 trace 透传。
- beta / experimental API 标记。

SDK 不应暴露：

- 服务端内部错误对象。
- 临时 feature flag。
- 不稳定内部字段。
- 过度耦合的网络层细节。

## 版本和发布

SDK 变更必须同步：

- 版本号。
- changelog。
- README / quickstart。
- API reference。
- 示例代码。
- 迁移指南。
- 生成脚本输出。

破坏性 SDK 变更必须给出 major version 或兼容层策略。

## 验证证据

RPC / SDK 相关 work item 的 verification 应优先包含：

- proto / IDL 兼容检查。
- 生成代码 diff。
- SDK 示例调用。
- 旧客户端兼容性检查。
- 错误映射测试。
- 重试和超时行为测试。
- streaming 中断和恢复测试。

## Review Checklist

- service / method / message 命名是否稳定。
- proto / IDL 是否遵守兼容规则。
- streaming 是否定义顺序、背压和恢复。
- 错误和重试语义是否可执行。
- SDK 公共 API 是否清晰且不泄露内部实现。
- 文档、示例和生成产物是否同步。
