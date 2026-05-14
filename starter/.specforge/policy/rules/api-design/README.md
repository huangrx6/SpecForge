# API 设计规则入口

本目录是 SpecForge 的 API 契约设计包。它不是一个“所有 API 知识的大文档”，而是一个轻入口加按需参考的规则目录：入口负责判断要读什么，`references/` 负责提供可执行细则。

适用范围：REST / HTTP API、OpenAPI、GraphQL、RPC、SDK、事件、Webhook、消息队列、文件格式和跨系统同步。只要调用方和实现方可能分离，就应把它视为契约。

## 什么时候启用

遇到下面任一情况，必须读取本入口：

- 新增、修改或废弃接口、SDK、事件、Webhook、消息格式。
- `requirements.md` 或 `technical-design.md` 里出现跨系统调用。
- 任务涉及 OpenAPI、GraphQL schema、proto、IDL、客户端 SDK、接口文档。
- 代码审查发现实现改变了请求、响应、错误、权限、分页或版本语义。

## 按需加载参考

先读本入口，再按场景只加载必要参考。不要默认把 `references/` 全部塞进上下文。

| 场景 | 继续读取 |
|---|---|
| REST / HTTP endpoint、资源建模、method、状态码、幂等、缓存 | `references/rest-patterns.md` |
| OpenAPI 3.1、契约 lint、mock、SDK / 文档生成 | `references/openapi.md` |
| 分页、排序、过滤、游标、total count | `references/pagination.md` |
| 错误响应、RFC 7807、错误码、request id、重试提示 | `references/error-handling.md` |
| 版本、兼容、废弃、sunset、迁移 | `references/versioning.md` |
| GraphQL schema、resolver、nullable、复杂度、连接分页 | `references/graphql.md` |
| RPC / gRPC / SDK 公共 API 面 | `references/rpc-sdk.md` |
| 事件、Webhook、消息队列、异步通知 | `references/events-webhooks.md` |
| 认证、授权、速率限制、审计 | `references/security-auth.md` |

## 核心工作流

API 设计不要从“列接口”开始。按下面顺序推进：

1. 分析领域：明确业务目标、调用方、数据模型、权限边界、非目标和成功标准。
2. 建模资源：识别资源、关系、生命周期和主要操作；REST 先画资源表，GraphQL 先定 schema 边界，事件先定主题和载荷。
3. 设计契约：定义路径、方法、参数、请求体、响应体、错误、分页、认证、授权、幂等和超时语义。
4. 结构化描述：HTTP API 优先维护 OpenAPI 3.1；GraphQL 维护 schema；RPC 维护 proto / IDL；事件维护 schema 和示例。
5. 验证契约：能 lint 就 lint，能 mock 就 mock；至少要留下调用示例、错误示例和兼容性说明。
6. 规划演进：写清兼容性、版本、废弃、迁移、回滚和文档更新路径。

## SpecForge 产物落点

| 产物 | API 设计职责 |
|---|---|
| `requirements.md` | 写用户可观察行为、调用方、范围、非目标、验收标准 |
| `technical-design.md` | 写资源模型、契约边界、权限、错误模型、版本策略、验证策略 |
| `tasks.md` | 把 API、schema、测试、文档、SDK、迁移拆成可执行任务 |
| `spec-review-v1.md` | 审查契约是否足以让实现方和调用方独立工作 |
| `changed-files.md` | 记录 OpenAPI / schema / SDK / 文档 / 代码是否一致 |
| `verification/report.md` | 记录契约测试、示例调用、lint、mock、兼容检查和 CI |
| `ssot-sync.md` | 回写长期 API、SDK、事件、数据模型或架构事实 |

实现前必须能回答：谁调用、调用什么、成功返回什么、失败如何处理、权限如何判断、重复请求怎么办、未来如何演进。

## 必须做到

- 契约先于实现。调用方能理解的内容必须写进 spec，而不是藏在代码里。
- API 变更必须说明兼容性：新增、兼容修改、破坏性修改或废弃。
- 对外或跨团队契约必须有机器可读或结构化描述。
- 每个操作必须有稳定名称、请求示例、成功响应、错误响应和权限说明。
- 关键字段必须写类型、约束、示例、单位、默认值和边界。
- 集合接口必须有分页或明确说明结果上限。
- 写操作必须说明幂等性、并发冲突、重试和超时语义。
- 安全边界必须写清：认证、授权、速率限制、审计、敏感字段脱敏。

## 禁止做法

- 不要直接从代码实现倒推出 API，而没有独立契约。
- 不要在 URI 中放动词，或混淆 HTTP method 语义。
- 不要所有错误都返回 `200`，也不要只返回泛化错误。
- 不要让不同 endpoint 的响应包络、错误结构、分页结构各说各话。
- 不要无限返回集合数据。
- 不要缺失稳定错误码、request id 或文档链接。
- 不要做破坏性变更却没有版本、废弃和迁移路径。
- 不要暴露内部字段、数据库结构、服务拓扑、密钥、堆栈和临时状态。

## 输出清单

交付 API 设计时，至少提供：

- 资源模型或 schema 关系表。
- endpoint / operation / event 列表。
- 请求参数、请求体、响应体、错误响应和示例。
- 认证、授权、速率限制和审计说明。
- 分页、过滤、排序策略。
- 版本、废弃、兼容和迁移策略。
- 契约验证证据，例如 OpenAPI lint、mock 调用、契约测试或人工检查记录。

## 模板

可复用起点放在 `templates/`，不要把大段模板塞进入口：

- `templates/openapi-resource.yaml`：REST 资源型 OpenAPI 起点。
- `templates/problem-details.json`：RFC 7807 风格错误响应起点。

## 参考来源

- OpenAPI Specification 3.1：https://spec.openapis.org/oas/v3.1.0
- RFC 7807 Problem Details：https://www.rfc-editor.org/rfc/rfc7807
- RFC 8594 Sunset Header：https://www.rfc-editor.org/rfc/rfc8594
- API Designer skill：https://github.com/Jeffallan/claude-skills/tree/main/skills/api-designer
