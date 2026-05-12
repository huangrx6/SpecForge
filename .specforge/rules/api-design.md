# API 和契约设计规则

本规则适用于 HTTP API、RPC、SDK、事件、Webhook、消息队列、文件格式和跨系统同步。只要调用方和实现方可能分离，就应把它视为契约。

## 基本原则

- 契约先于实现。调用方能理解的内容必须写进 spec，而不是只藏在代码里。
- API 变更必须说明兼容性：新增、兼容修改、破坏性修改或废弃。
- 契约必须覆盖成功、失败、权限不足、参数错误、幂等和超时。
- 对外契约必须有机器可读或结构化描述，HTTP API 优先使用 OpenAPI。
- 不能只靠自然语言描述字段含义；关键字段要写类型、约束、示例和边界。

## HTTP API

设计 HTTP API 时必须明确：

- 资源或动作的命名。
- HTTP method 的语义。
- path、query、header、body 的职责。
- 状态码和错误码。
- 认证方式和权限范围。
- 幂等性、重试和超时。
- 分页、排序、过滤和字段选择。
- 版本策略和废弃策略。

常规约束：

- `GET` 不应产生业务副作用。
- 创建、更新、删除应有明确幂等策略。
- 批量接口要定义部分成功、全部失败和重试语义。
- 异步接口要定义任务状态查询或回调机制。
- 大响应要考虑分页或流式返回。

## OpenAPI 要求

HTTP API 如对外或跨团队使用，应维护 OpenAPI 描述：

- `openapi`、`info`、`servers`、`paths`、`components` 基本结构完整。
- 每个 operation 有 `summary`、`description`、`parameters` 或 `requestBody`。
- 每个 response 写状态码、schema 和示例。
- 复用 schema 放在 `components`，避免复制粘贴。
- 安全方案写入 `securitySchemes` 和 operation 的 `security`。
- 破坏性变更必须同步版本和迁移说明。

OpenAPI 是契约源时，代码、文档和测试应尽量从它派生或校验。

## RPC / gRPC

RPC 契约必须明确：

- service、method、request、response 的稳定名称。
- 字段编号、类型、必填/可选语义。
- 错误码和重试策略。
- deadline、cancellation、streaming 行为。
- 双向流必须定义消息顺序、结束条件、心跳、背压和异常断开处理。

不得复用已删除字段编号。废弃字段应标记并保留兼容策略。

## SDK 契约

SDK 变更必须说明：

- 公共 API 面是否变化。
- 初始化、认证、配置和默认值。
- 错误类型、异常或返回值。
- 线程安全、并发和资源释放。
- 版本兼容和迁移方式。
- 示例代码是否更新。

SDK 不应把服务端内部错误、配置细节或不稳定字段泄露给调用方。

## 事件和消息

事件契约必须明确：

- topic / event name。
- schema、版本和示例。
- 生产者和消费者。
- 触发时机。
- 至少一次、至多一次或恰好一次的语义。
- 幂等 key、去重方式和重放策略。
- 失败、死信和补偿流程。

消费者不得依赖未声明字段。生产者新增字段应保持向后兼容。

## 错误模型

错误响应应稳定、可定位、可被程序处理：

- 对机器：稳定错误码、错误类型、可选字段路径。
- 对人：简洁错误消息。
- 对排查：trace id 或 request id。
- 对安全：不暴露堆栈、SQL、内部路径、密钥和服务拓扑。

同一系统应统一错误格式。跨系统集成时应写清错误映射。

## 兼容性

通常兼容：

- 新增可选字段。
- 新增枚举值，但调用方必须能处理未知值。
- 扩展错误详情，但保持错误码稳定。

通常破坏兼容：

- 删除或重命名字段。
- 改变字段类型、含义、单位或默认值。
- 改变权限要求。
- 改变幂等、排序、分页或错误码语义。
- 把同步接口改成异步，或把一次响应改成流式响应。

破坏性变更必须有迁移计划、灰度或版本隔离方案。

## 参考来源

- OpenAPI Specification 提供语言无关的 HTTP API 描述方式：https://spec.openapis.org/oas/v3.1.0
- OpenAPI Learn 文档说明 OAD 的结构、paths、responses、parameters、requestBody 和 components：https://learn.openapis.org/specification/
- GitHub REST API 使用 OpenAPI 描述生成 SDK、文档和验证工具：https://docs.github.com/rest/overview/openapi-description
