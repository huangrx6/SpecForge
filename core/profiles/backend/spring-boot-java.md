# Spring Boot Java Backend

## 适用 / 不适用

适用：

- 企业后端、复杂事务、权限体系、稳定 API、批处理和集成系统。
- 团队已有 Java / Spring Boot / Maven 或 Gradle 工程基线。
- 需要成熟的监控、配置、线程池、数据访问和安全生态。

不适用：

- 小型 AI 网关或脚本化数据任务，Python FastAPI 可能更轻。
- 极简 CLI / 单文件服务，不应为了“标准”引入完整 Spring Boot。

## 默认组合

| 能力 | 默认建议 | 说明 |
|---|---|---|
| 运行时 | Spring Boot 3.x + Java 17+ | 既有系统版本优先 |
| 构建 | Maven 或 Gradle | 跟随项目基线 |
| 数据访问 | Spring Data JPA / MyBatis / jOOQ | 复杂 SQL 项目可优先 MyBatis / jOOQ |
| 迁移 | Flyway / Liquibase | 禁止生产自动 `ddl-auto` 改表 |
| 安全 | Spring Security 或既有网关鉴权 | 权限矩阵必须可测 |
| 观测 | Actuator + logs + metrics | 生产必须有健康检查 |

## 设计必填

- Controller、Service、Repository 边界是什么？
- 事务边界在哪里，是否包含外部 HTTP / MQ / 文件操作？
- 线程池、异步任务、重试和幂等如何设计？
- DTO、Entity、VO 是否分层，错误响应格式是否稳定？
- 数据迁移、回滚和权限负向用例如何验证？

## 验证

- 单元测试、集成测试、API contract / MockMvc。
- migration dry-run、权限矩阵、启动健康检查。
- 超时、重试、幂等和错误响应覆盖。
