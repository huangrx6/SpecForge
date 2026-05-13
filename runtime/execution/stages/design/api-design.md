# API Design — API 契约子模块

本子模块是 `sf-design` 的内部参考，**只在本次 change 涉及 API、SDK、事件或跨系统契约变更时读取**。同时读取 `.specforge/policy/rules/api-design/README.md`（主规则）和对应 `references/`。

## 何时读取

- 新增、修改或废弃 REST / GraphQL / RPC / WebSocket 端点。
- 新增或变更 SDK 公开 API（函数签名、类型、行为）。
- 引入新的事件（消息队列、Webhook、Server-Sent Events）。
- 跨服务契约或第三方集成接口变化。

## API 设计要求

### REST / HTTP 端点

- 使用名词资源路径，HTTP 方法语义准确（GET 幂等、POST 创建、PUT 全量替换、PATCH 局部更新、DELETE 删除）。
- 版本策略：URL 版本（`/v1/`）或 Header 版本，全局统一。
- 请求 / 响应 Schema 必须完整定义，包含：字段名、类型、是否必填、约束（长度、格式、枚举值）。
- 错误响应必须使用统一结构（如 `{ code, message, details }`），并列出关键错误码。
- 分页策略：cursor / offset，全局统一。

### SDK 公开接口

- 只公开必要接口，内部实现不对外暴露。
- 参数和返回值使用明确类型，避免 `any` / `object`。
- Breaking change 必须标注版本影响和迁移路径。

### 事件契约

- 事件命名：`<Domain>.<Entity>.<PastTense>`（如 `order.placed`、`user.activated`）。
- Payload Schema 完整定义，包含版本字段（如 `specVersion`）。
- 明确 At-least-once / Exactly-once 语义和幂等要求。
- 消费方和 Dead Letter Queue 策略。

### 兼容性与变更管理

- **向后兼容变更**（安全）：新增可选字段、新增端点、新增枚举值（消费方需有默认处理）。
- **破坏性变更**（需版本或废弃期）：移除字段、改变字段类型、改变 URL 结构、改变错误码语义。
- 废弃路径：标注 `@deprecated`，给出迁移截止时间。

## 必含产出（写入 design.md 对应章节）

- 端点 / SDK / 事件变更清单（新增 / 修改 / 废弃）。
- 关键接口的 Request / Response / Payload Schema。
- 错误码和分页约定（首次引入时）。
- Breaking change 列表和兼容策略。

## 停止条件

- 接口所依赖的领域模型（domain-design）尚未确定。
- 需要外部团队确认跨系统契约。
- 第三方 SDK / API 行为不确定且未查询当前官方文档。
