# GraphQL 设计

GraphQL 不是“把所有 REST 聚合成一个 endpoint”这么简单。它的关键是 schema 边界、字段语义、查询成本和演进纪律。

## 适用场景

| 适合 GraphQL | 不适合 GraphQL |
|---|---|
| 前端页面组合多资源数据 | 简单 CRUD、调用形态稳定 |
| 多客户端需要不同字段集合 | 强缓存依赖固定 URL |
| 复杂读取大于写入 | 文件传输、大流量二进制 |
| 需要 schema 自描述 | 非受控外部客户端且治理薄弱 |

## Schema 设计

必须明确：

- object type。
- input type。
- enum。
- interface。
- union。
- scalar。
- query、mutation、subscription 边界。

建议：

- 查询类型围绕业务实体，不围绕底层表。
- mutation 使用明确业务动作，例如 `createOrder`、`cancelOrder`。
- input type 不直接复用 output type。
- 对分页集合优先采用 connection 模型。
- 对可能扩展的状态字段优先 enum 加 unknown 兼容策略。

## Nullability 语义

GraphQL 的 `null` 很有力量，也很危险。每个可空字段都必须说明“为什么可空”：

- 数据确实不存在。
- 用户无权限查看。
- 上游未返回。
- 计算失败但不影响整体。
- 字段处于迁移期。

如果 `null` 会让客户端无法区分含义，应补充状态字段或错误结构。

## 分页

集合字段优先 connection / cursor 模式：

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}
```

必须说明：

- `first` / `after` 或 `last` / `before` 支持范围。
- 最大 page size。
- 排序稳定性。
- `totalCount` 是否支持，是否昂贵。
- 空集合、非法 cursor、越界行为。

## Resolver 边界

resolver 设计必须考虑性能：

- N+1 风险。
- 批量加载。
- 透传 trace id。
- 超时。
- 熔断或降级。
- 跨服务调用次数上限。

高成本字段需要明确：

- 是否默认可查。
- 是否需要显式参数。
- 是否受复杂度限制。
- 是否可缓存。

## 查询复杂度与安全

至少考虑：

- depth limit。
- complexity score。
- node count limit。
- timeout。
- persisted query 或 allowlist。
- introspection 是否在生产开放。

GraphQL 如果没有复杂度治理，调用方能很优雅地把服务打趴下。

## 错误模型

必须区分：

- transport error。
- 顶层 GraphQL `errors`。
- 字段级 partial failure。
- 业务型失败，是否进入 union / payload。

Mutation 建议使用明确 payload：

```graphql
type CreateOrderPayload {
  order: Order
  errors: [UserError!]!
}
```

不要让客户端只能通过自然语言 `message` 猜测失败原因。

## 版本演进

通常兼容：

- 新增字段。
- 新增 query 或 mutation。
- 新增 enum 值，前提是客户端能处理未知值。

通常破坏兼容：

- 删除字段。
- 改字段类型。
- 改 nullable。
- 改参数必填性。
- 改业务语义。

废弃字段必须：

- 标记 `@deprecated`。
- 写替代字段。
- 写迁移说明。
- 监控调用情况。

## SpecForge 落点

- `design.md`：写 schema 片段、resolver 边界、复杂度策略、错误设计。
- `tasks.md`：拆 schema、resolver、权限、复杂度、测试任务。
- `verification/report.md`：记录 schema lint、典型 query、复杂度保护和权限验证。

## Review Checklist

- query / mutation / subscription 边界是否清晰。
- schema 是否表达业务，而不是数据库。
- nullable 是否有业务语义。
- 分页是否稳定。
- resolver 是否有 N+1 防护。
- 是否有复杂度和深度限制。
- 错误是否可编程处理。
- 废弃和演进策略是否明确。
