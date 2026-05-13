# Spring Boot + Java/Kotlin 企业级后端规范

## 1. 适用场景 (Applicability)
- **业务线定位**：金融系统底座、极其庞大的电商中台、强业务复杂性、复杂的领域驱动设计 (DDD)、成百上千节点的分布式微服务集群。
- **技术导向**：具有深厚 Java/Kotlin OOP 面向对象抽象底蕴的团队。
- **核心能力基石**：Java 历经二十年检验的庞大工业级生态、稳如磐石的数据库事务管控机制、以及无可匹敌的大规模团队协作一致性与可维护性。

## 2. 纵深架构分层模型 (Layered Architecture)
推行标准三层架构或洋葱模型 (Onion Architecture) 隔离污染域：
- **Controller 层 (API 展现层)**：作为大门，仅负责 HTTP/RPC 协议的进出口：处理路由映射、参数反序列化、入参校验。绝对禁止渗入任何业务计算或逻辑判断代码。
- **Service 层 (Domain 核心层)**：系统的灵魂。负责组合调用各方资源，处理核心业务流，划定并发边界与事务边界 (`@Transactional`)。推荐依赖抽象接口编程而非实现类。
- **Repository/DAO 层 (持久层)**：掌管数据落地，彻底屏蔽下层的 JDBC 脏细节、缓存与底层 ORM。
- **数据流转模型隔离原则**：
  - 数据库映射实体 (Entity/DO) 绝对严禁直接暴露或抛给前端，防止底层结构变动引发前端雪崩及敏感数据外泄。
  - 数据必须进行映射转化后（推荐 `MapStruct`），以纯净的 DTO (Data Transfer Object) 或 VO (View Object) 输出。

## 3. 持久化与事务高阶规范 (Data & Transactions)
- **数据库组件选型**：
  - 标准 CRUD 流首选 **Spring Data JPA / Hibernate** 实现快速产出。
  - 极复杂的多表关联网格查询或报表统计，强烈建议改用 **MyBatis-Plus** 或强类型的 **jOOQ**。
- **事务红线 (Transactional Limits)**：
  - 事务必须控制在最窄的粒度。仅在 Service 核心方法的入口点使用 `@Transactional`，必须显式指明合理的隔离级别与回滚异常类型 (例如 `rollbackFor = Exception.class`)。
  - **反模式杜绝**：将耗时的远程外部 RPC API 调用、推送系统通知、发邮件等极慢操作塞进数据库本地事务块，这会引发数据库连接池被锁死瞬间雪崩。此类操作必须使用异步解耦或推迟到事务之后。

## 4. API 契约与防线 (API & Security)
- **边界防御与校验拦截**：
  - 所有传入的 Body 和 Query 参数强制依赖 **Spring Validation** 生态（`@Valid`, `@NotNull`, `@Pattern`, `@Size`）在 Controller 入口实施硬拦截，不让垃圾数据流入业务层。
- **安全管控护城河 (Spring Security)**：
  - 认证与鉴权强制分离：企业级方案推荐 OAuth2.0 或细粒度 JWT。
  - 通过 `@PreAuthorize` 或 `@Secured` 注解实现方法级别的精确授权。
- **错误捕获面网**：必须实现 `@RestControllerAdvice` 以构建系统全局的统一异常处理器。将所有的技术异常包装为统一错误码与标准话术返回，防止 Tomcat 原生 500 页面或底层驱动代码直接漏在前端。

## 5. 可观测性与极速响应 (Observability & Performance)
- **缓存策略**：
  - 通过 Spring Cache (`@Cacheable`, `@CacheEvict`) 无缝接驳 Redis 拦截热点数据，化解 DB 读压力。
  - 必须对不同维度的缓存预先制定明确的过期失效策略 (TTL)，杜绝内存泄漏和冷数据囤积。
- **全局链路掌控**：
  - 采用 SLF4J + Logback，强烈建议输出可结构化搜索的 JSON 日志。
  - 深度集成 **Micrometer** / **OpenTelemetry**。通过 MDC 切面将全局唯一的 `TraceID` 透传进每一行日志、每一个线程与微服务，保障排障链路可视。

## 6. 构建与可靠性验证 (Engineering & QA)
- **构建工程流**：Maven 或 Gradle (建议使用 Kotlin DSL)。强烈规范企业级父级 BOM，统一全局数十个依赖库的版本号防冲突。
- **测试金字塔构建**：
  - 核心逻辑单元测试：通过 `JUnit 5` + `Mockito` 构建不依赖数据库的纯净内存验证，全量覆盖 Service 层关键分支。
  - 集成契约测试：引入 **Testcontainers** 库，在 `@SpringBootTest` 启动阶段动态拉起真实的隔离态 MySQL/Redis Docker 容器进行全真演练。

## 7. Design 必填问题

- 模块边界按领域、技术层还是微服务拆分？
- 哪些方法开启事务？事务内是否包含远程调用？
- DTO、Command、Entity、VO 如何转换？
- 权限在 Filter、Controller、Service 还是方法注解层拦截？
- 哪些集成测试需要 Testcontainers？

## 8. Spec Review 检查项

- Controller 不含业务计算。
- Entity 不直接暴露给 API 响应。
- 事务粒度清楚，没有包裹外部 RPC。
- 全局异常处理和稳定错误码存在。
- 核心 Service 单测不启动完整 Spring 容器。
