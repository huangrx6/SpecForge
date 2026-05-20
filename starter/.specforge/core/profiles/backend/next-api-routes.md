# Next.js Route Handlers / BFF 后端规范

## 适用 / 不适用

适用：

- Next.js App Router 项目中的轻量 BFF、CRUD、Webhook、第三方服务代理、上传签名、认证辅助端点。
- 与页面强耦合、生命周期跟随前端应用的小型后端能力。

不适用：

- 长时间运行任务、队列消费者、WebSocket 心跳、视频/大文件转码、重计算任务。
- 高并发独立业务核心服务；这类场景应选独立后端服务 profile，例如 `backend/python-fastapi`，或在 technical design 中新增并确认合适 profile。

## 默认组合

| 能力 | 默认建议 |
|---|---|
| 路由 | `app/api/<resource>/route.ts` |
| 输入校验 | Zod schema |
| 响应 | `{ data, meta? }` / `{ error: { code, message, details? } }` |
| ORM | Prisma 或 Drizzle |
| 鉴权 | Auth.js / Clerk / 自有 JWT verifier |
| 限流 | Upstash Redis / 平台 KV / API Gateway |
| 日志 | 结构化日志，附 requestId / userId |

## 目录与边界

```text
src/
├── app/api/<resource>/route.ts   # 协议入口，只做解析、鉴权、调用 service、响应映射
├── server/
│   ├── services/<domain>.ts      # 业务用例
│   ├── repositories/<domain>.ts  # 数据访问
│   ├── schemas/<domain>.ts       # Zod 输入输出 schema
│   └── auth/                     # session、permission、policy
└── shared/api/errors.ts          # 错误码和响应工具
```

`route.ts` 文件超过约 120 行时必须拆 service。禁止在 route handler 里直接堆业务规则、长 SQL、第三方重试和权限分支。

## API 契约

- 路由资源使用名词复数：`/api/posts`、`/api/posts/[postId]`。
- GET 必须说明分页、排序、筛选和缓存策略。
- POST / PATCH / DELETE 必须说明幂等性、权限和失败回滚。
- 所有 body、query、path 参数都必须经过 schema 校验。
- 错误码稳定，前端不依赖自然语言 message 做业务判断。

## 认证、授权与限流

- 所有非公开端点先鉴权，再解析敏感资源。
- 更新 / 删除时必须检查资源归属或角色权限，不能只相信 URL id。
- 登录、验证码、AI 调用、上传签名、Webhook 重放等高风险端点必须有限流或签名验证。
- Cookie / token / secret 不得打印到日志。

## 数据访问

- Serverless + 关系型数据库必须考虑连接策略：连接池、平台代理、HTTP driver 或托管服务能力需在 design 中说明。
- 数据库 model 不直接返回给前端；返回 DTO。
- 事务只包数据库一致性，不把外部 HTTP 调用放进事务。
- Webhook 需要幂等键、事件去重和重放策略。

## 外部依赖与可靠性

- 调第三方服务必须有 timeout。
- 重试必须有上限和退避，不重试非幂等写操作，除非有幂等键。
- 下游失败转换为稳定错误码，不把供应商原始错误裸露给前端。

## 测试与交付

- schema、错误映射、权限 policy：Vitest。
- route handler：覆盖成功、校验失败、未登录、无权限、下游失败。
- 页面关联的 P0 API 由 Playwright 间接验证。
- Webhook 必须有签名失败和重复事件测试。

## Design 必填问题

- 该端点是页面 BFF、公开 API 还是外部 webhook？
- 鉴权和授权在哪里发生？
- 数据库连接池和事务边界是什么？
- 失败时前端看到什么错误码？
- 是否需要限流、幂等、签名验证或审计日志？

## Spec Review 检查项

- Route Handler 没有变成大 service。
- 所有输入都有 schema。
- 资源级权限不只依赖前端传参。
- 连接池、限流和错误格式有说明。
- 测试覆盖至少包含成功和主要失败分支。
