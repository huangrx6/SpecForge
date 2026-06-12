# Go Standard Backend

## 适用 / 不适用

适用：

- 高并发 API、网关、后台 worker、CLI、轻量微服务。
- 团队接受显式错误处理、简单依赖和标准库优先风格。
- 需要单二进制部署、低资源占用或清晰运行时边界。

不适用：

- 复杂后台管理系统且团队主要 Java / Python 生态时，不应强行切换。
- 需要大量 ORM 魔法、动态模型或快速 AI 原型时，FastAPI 可能更合适。

## 默认组合

| 能力 | 默认建议 | 说明 |
|---|---|---|
| HTTP | `net/http` + chi / gin / echo | 既有项目优先 |
| 配置 | env + typed config | 禁止散落读取环境变量 |
| 数据 | sqlc / sqlx / GORM | 强 SQL 可优先 sqlc |
| 迁移 | goose / migrate | 必须版本化 |
| 日志 | slog / zerolog | 日志字段结构化 |
| 测试 | `go test` + httptest | 外部依赖用 test double |

## 设计必填

- handler、service、repository/package 边界是什么？
- context timeout / cancellation 如何贯穿调用链？
- 错误码、日志字段、重试和幂等如何约束？
- goroutine 生命周期、worker 停止和资源释放如何处理？
- migration、启动、健康检查和并发路径如何验证？

## 验证

- `go test ./...`、race（高并发路径）、API contract。
- context timeout、取消、重试、幂等和权限负向用例。
