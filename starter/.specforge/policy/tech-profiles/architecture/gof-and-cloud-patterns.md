# 现代设计模式体系 (Classic GoF & Cloud-Native)

## 1. 经典 GoF 模式的现代化演进 (Modernized GoF)
在现代框架中，许多传统模式已被语言特性或中间件吸纳，我们主张“精准使用，避免过度设计”：
- **策略模式 (Strategy Pattern)**：
  - **核心**：消除超长 `if-else / switch`。
  - **现代应用**：不同支付渠道的处理、不同折扣券的计算。通常结合依赖注入 (DI) 或者一个 Map 字典（工厂映射）来实现极简注册，摒弃笨重的继承树。
- **观察者/发布订阅模式 (Observer / Pub-Sub)**：
  - **现代应用**：完全贯穿了现代架构。从前端的 Vue 响应式 Proxy、React Context 到后端的基于 Kafka / RabbitMQ 的事件驱动体系 (EDA)，都旨在消除强耦合的显式方法调用。
- **建造者模式 (Builder Pattern)**：
  - **现代应用**：构建极复杂的配置类。在支持命名参数 (Python) 或结构体参数扩展 (Go Options Pattern, Rust struct update syntax) 的语言中，经典的链式 Builder 应当被简化，不应照搬 Java Bean 时代的冗余写法。
- **装饰器模式 (Decorator Pattern)**：
  - **现代应用**：广泛运用于跨切面关注点 (AOP)。例如 Python 的 `@app.route`，Java Spring 的 `@Transactional`，Go 的 Middleware 拦截器包装，避免将日志鉴权混入核心逻辑。

## 4. 云原生架构模式 (Cloud-Native Patterns)
随着微服务化，重点从代码级模式上升到了系统级协作模式：
- **断路器模式 (Circuit Breaker)**：
  - 防止级联雪崩。当外部依赖或微服务调用大量超时失败时，果断熔断（快速失败），并在一段时间后通过“半开”状态探活。
- **CQRS (命令查询职责分离)**：
  - 将处理写操作的命令侧 (Command) 和处理读操作的查询侧 (Query) 物理或逻辑隔离，配合读写库分离或 Elasticsearch 异构搜索以追求极致性能。
- **重试与抖动避让 (Retry & Jitter)**：
  - 遇到短暂的网络波动的防御策略。重试间隔必须呈指数级退避 (Exponential Backoff)，同时增加随机抖动 (Jitter) 防止瞬间集群重启引发重试风暴击穿 DB。
- **发件箱模式 (Transactional Outbox)**：
  - 解决分布式事务“双写”痛点。将修改业务 DB 与向消息中间件发布 Event 的动作包入同一个本地事务写进“Outbox”表，再由后台守护进程可靠地拾取并推送至 MQ，实现最终一致性。

## 5. Design 必填问题

- 这里的问题是代码分支复杂、对象创建复杂，还是分布式可靠性问题？
- 选用的模式要消除什么具体痛点？
- 引入模式后新增了哪些类、表、队列、状态或失败分支？
- 是否有更简单的语言特性或框架能力可以替代经典模式？

## 6. Spec Review 检查项

- 没有为了模式而模式。
- 重试有指数退避、抖动和最大次数。
- Outbox / CQRS 等模式有补偿、幂等和监控说明。
- 策略/工厂映射比长 `if-else` 更清晰时才引入。
