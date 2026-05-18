# Python FastAPI 异步后端架构

## 1. 适用场景 (Applicability)
- **业务类型**：AI 算法服务、机器学习网关、数据管道编排、极需快速产出且对异步 I/O (AsyncIO) 支持要求极高的业务中台。
- **团队要求**：熟悉 Python 类型提示 (Type Hints)、理解协程与事件循环。
- **核心优势**：极致的开发速度，原生集成 Pydantic 实现端到端强验证，开箱即用的 OpenAPI/Swagger 文档生成，出色的单核异步并发性能。

## 2. 架构设计与代码组织 (Architecture)
- **目录约定**：推荐依据领域驱动 (DDD) 思想横向拆分。
  - `app/api/`：路由定义 (Routers) 和依赖注入 (Dependencies)。
  - `app/core/`：系统配置、权限、安全拦截器。
  - `app/schemas/`：Pydantic 模型 (入参/出参 DTO)。
  - `app/services/`：解耦的业务逻辑层。
  - `app/crud/` 或是 `app/repositories/`：纯粹的数据库操作层。
- **同步与异步隔离**：
  - 如果使用了异步路由 (`async def`)，绝对不可在其中直接调用阻塞式的同步库 (如 `requests`, 同步的 `psycopg2`)，否则会锁死整个事件循环。
  - CPU 密集型任务必须抛入后台线程池 (如 `run_in_threadpool` 或 Celery 任务队列)。

## 3. 数据层与事务 (Data Access Layer)
- **ORM 选型**：首推 **SQLAlchemy 2.0+**，强制使用其最新的 Async 范式 (`AsyncSession`)。轻量级可考虑 **SQLModel**。
- **数据库迁移**：代码与库表结构的同步必须依靠 **Alembic**。严禁在生产环境通过代码直接建表 (`create_all`)。
- **连接池管理**：对于高负载场景，部署 PgBouncer (针对 PostgreSQL) 并在 SQLAlchemy 侧配置带回收机制的异步连接池 (`AsyncEngine`)。

## 4. API 安全与权限控制 (Security & Auth)
- **强验证防线**：依靠 Pydantic 对所有 Path, Query, Header, Body 参数实施极其严格的类型边界和正则表达式约束。
- **鉴权机制**：
  - 标准做法：依靠 FastAPI 内置的 `OAuth2PasswordBearer` 构建 JWT 鉴权体系。
  - 路由守卫：通过 `Depends()` (依赖注入) 将权限校验优雅地前置到路由解析之前，若验证失败直接抛出 `HTTPException(401/403)`。

## 5. 质量防护与测试 (Testing)
- **测试框架**：`pytest` 结合 `pytest-asyncio`。
- **接口测试**：使用 `TestClient` (或基于 HTTPX 的 `AsyncClient`) 在测试期间动态覆盖所有路由，并且可以使用 `app.dependency_overrides` 优雅地替换数据库连接或第三方 Mock 服务。
- **类型检查**：强制在 CI 阶段执行 `mypy`。

## 6. Design 必填问题

- API 是同步 CRUD、异步 I/O 网关，还是 AI / 数据任务编排？
- 哪些调用会阻塞事件循环？如何隔离到线程池、任务队列或独立 worker？
- Pydantic schema 如何区分输入 DTO、输出 DTO 和数据库模型？
- 数据库 session 生命周期在哪里创建、提交和回滚？
- 是否需要后台任务、队列、流式响应、上传或长轮询？

## 7. Spec Review 检查项

- `async def` 路由中没有直接调用阻塞式库。
- 生产迁移使用 Alembic，不依赖 `create_all`。
- 依赖注入边界清楚，测试可覆盖 `dependency_overrides`。
- 错误响应稳定，不泄露 Python 堆栈和数据库字段。
- AI / 第三方调用有 timeout、重试上限和费用/速率边界。
