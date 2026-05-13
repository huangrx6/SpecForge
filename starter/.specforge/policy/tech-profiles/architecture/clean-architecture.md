# 整洁架构与六边形架构 (Clean / Hexagonal Architecture)

## 1. 核心理念与适用场景 (Core Philosophy)
- **适用场景**：业务逻辑极其复杂、外部依赖（数据库、第三方 API、消息队列）多变、生命周期长需要高度可测试性的中大型应用（如电商中台、SaaS 核心账务系统）。
- **核心原则 (依赖倒置法则)**：源码依赖方向必须**由外向内**指向核心业务域。内部实体与用例 (Use Cases) 绝对不能知道任何关于外部系统（UI、Web 框架、数据库框架）的信息。

## 2. 经典四层同心圆结构 (The Four Layers)
- **核心实体层 (Entities / Domain)**：
  - 存放最纯粹的企业级业务对象与规则（如计算利率的公式、判断订单是否可售的准则）。
  - **禁忌**：绝对不可出现对 Spring、Gin、Express、GORM、Hibernate 的任何依赖。
- **用例层 (Use Cases / Application)**：
  - 协调实体资源的流转（如：“用户购买商品”涉及验证库存、创建订单、扣减积分）。
  - 通过定义依赖的**接口（Ports）**来控制数据的输入与输出。
- **接口适配器层 (Interface Adapters)**：
  - 作为翻译官。将用例层的数据转换为外部所需的格式，或者将外部请求的数据转为用例所需的数据。
  - 常见模块：Controllers (处理 HTTP)、Presenters (组装视图 DTO)、Gateways/Repositories 的**具体实现** (处理 SQL 拼装)。
- **外部框架与驱动层 (Frameworks & Drivers)**：
  - 处在最外层。存放 UI 框架、数据库引擎实体配置、外部第三方 SDK。这层代码应该尽可能的“薄”。

## 3. 工程落地规范 (Implementation Guidelines)
- **控制反转 (IoC / DI)**：在框架层（如 Spring 容器、Wire、NestJS 模块）将 Adapter 注入给 Use Case。Use Case 代码中只能看到 Repository 的 Interface。
- **数据穿越隔离 (Data Mapping)**：严禁将底层数据库产生的 ORM Model 对象直接返回到外层的 Controller 甚至 HTTP Response 中。必须在 Adapter 层强制做一次到 DTO 或 View Object 的类型映射与隔离。
- **测试前移**：核心 Entity 和 Use Case 层的单元测试不应启动任何数据库容器或 HTTP Server，应当纯粹基于内存 Mock 达到毫秒级覆盖。

## 4. Design 必填问题

- 核心 use case 是什么？输入、输出和失败模式是什么？
- 哪些外部依赖需要 port/interface？
- DTO、domain model、ORM model 的转换边界在哪里？
- 哪些规则必须在 domain/use case 层测试，而不是只靠 E2E？

## 5. Spec Review 检查项

- Domain / use case 不依赖框架、数据库或 HTTP 类型。
- Adapter 负责协议和数据转换，不承载核心业务判断。
- Repository interface 由内层定义，外层实现。
- 单元测试能不启动外部服务覆盖核心规则。
