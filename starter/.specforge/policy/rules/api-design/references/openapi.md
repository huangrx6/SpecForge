# OpenAPI 3.1 参考

HTTP API 如对外、跨团队或被 SDK / 自动化工具消费，应维护 OpenAPI 3.1 描述。OpenAPI 不是“接口文档的附属品”，而是调用方和实现方共享的契约。

## 基本结构

OpenAPI 文件至少包含：

- `openapi`：使用 `3.1.0`。
- `info`：标题、版本、描述、owner 或支持入口。
- `servers`：生产、预发、本地或环境变量化地址。
- `paths`：所有 endpoint 和 operation。
- `components.schemas`：复用数据结构。
- `components.responses`：复用错误和通用响应。
- `components.parameters`：复用分页、过滤、路径参数。
- `components.securitySchemes`：认证方式。

大型 API 可以拆分文件，但必须有一个清晰入口文件和构建 / lint 命令。

## Operation 要求

每个 operation 必须包含：

- `operationId`：稳定、唯一、适合代码生成。
- `summary` 和 `description`：说明用途、边界和前置条件。
- `tags`：归属领域。
- `parameters`：路径、query、header、cookie 参数。
- `requestBody`：写操作必须有 schema 和示例。
- `responses`：至少覆盖成功、认证失败、授权失败、校验失败、限流和关键业务错误。
- `security`：如果继承全局安全，也应能从文档看懂。
- `deprecated`：废弃操作必须标记并说明替代方案。

## Schema 质量

Schema 不只是字段列表，必须描述约束：

- 必填字段写入 `required`。
- 字符串写 `minLength`、`maxLength`、`pattern`、`format`。
- 数字写 `minimum`、`maximum`、`multipleOf` 和单位说明。
- 枚举写全允许值，并说明未知值处理策略。
- 时间字段使用明确格式，优先 `date-time`。
- 对象默认不要开放任意字段；需要扩展时显式说明。
- 只读字段标记 `readOnly`，只写字段标记 `writeOnly`。
- nullable 在 OpenAPI 3.1 中用 JSON Schema 类型组合表达。

## 组件复用

重复出现三次以上的结构应抽入 `components`：

- 领域对象，例如 `User`、`Order`。
- 创建 / 更新请求，例如 `CreateUserRequest`。
- 分页响应，例如 `CursorPage`。
- 错误模型，例如 `Problem`。
- 通用响应，例如 `Unauthorized`、`TooManyRequests`。
- 通用参数，例如 `limit`、`cursor`、`sort`。

复用的目的是保持一致，不是制造过度抽象。领域含义不同的对象不要只因字段相似就合并。

## 示例要求

每个对外 operation 至少提供：

- 一个成功请求示例。
- 一个成功响应示例。
- 一个校验失败示例。
- 一个认证或授权失败示例。
- 一个业务冲突或资源不存在示例。

示例必须真实、可运行、无敏感信息。不要使用 `foo`、`bar`、`test` 这类无法帮助调用方理解的数据。

## 契约验证

verification 至少记录一种证据：

- `npx @redocly/cli lint openapi.yaml`
- `npx @stoplight/prism-cli mock openapi.yaml`
- contract test。
- 示例请求 / 响应校验。
- SDK 生成或文档生成结果。

无法运行工具时，必须写清原因、替代证据和剩余风险。

## SpecForge 落点

- `technical-design.md`：写 OpenAPI 文件路径、维护方式、lint / mock 命令。
- `tasks.md`：把 schema、operation、错误响应、示例、测试拆成任务。
- `verification/report.md`：记录 lint、mock、contract test 或人工校验结果。
- `ssot-sync.md`：同步长期 API 契约事实。

## Review Checklist

- OpenAPI 是否是 3.1。
- 每个 operation 是否有稳定 `operationId`。
- 每个请求、响应、错误是否有 schema。
- 参数和字段是否有类型、约束、默认值和示例。
- 安全方案是否完整。
- 错误响应是否统一并复用。
- 分页接口是否复用统一分页模型。
- 是否有 lint、mock、contract test 或替代证据。
