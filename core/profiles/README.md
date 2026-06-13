# 技术选择卡

`profiles/` 只回答一个问题：本次技术设计选什么技术组合，为什么选，边界是什么。质量标准不放在这里，统一放在 `core/standards/`。

## 目录

```text
profiles/
├── frontend/       # 前端主栈
├── backend/        # 后端主栈
├── database/       # 持久化选择
└── capabilities/   # 横向能力卡
```

## 使用方式

`technical-design.md` 必须填写 `Tech Profile Selection`：

| 维度 | 选中 profile | 采用范围 | 选择理由 | 偏离 / 替代 |
|---|---|---|---|---|
| Frontend | `frontend/react-vite-tailwind-ts` | full | 内部工具、纯 SPA、交互密集 | 不选 Next.js，避免 SSR 复杂度 |
| Database | `database/rdbms-postgresql` | full | 事务、复杂查询、JSON 支持 | 无 |
| Capability | `capabilities/processing-ai-jobs` | partial | 文件上传、批处理、LLM 调用 | 并发限制由需求决定 |

## 内置 Profile 目录

| 类型 | Profile | 主要适用 |
|---|---|---|
| Frontend | `frontend/react-vite-tailwind-ts` | 内部管理台、运营工具、复杂表单和重交互 SPA |
| Frontend | `frontend/next-app-router-tailwind-ts` | SEO 页面、文档站、官网、Next 一体化应用和 BFF |
| Frontend | `frontend/vue-vite-tailwind-ts` | 既有 Vue 生态、Element Plus / Naive UI / shadcn-vue 管理端 |
| Backend | `backend/python-fastapi` | AI 服务、数据管道、异步 I/O 网关和快速中台 |
| Backend | `backend/spring-boot-java` | 企业后端、复杂事务、权限体系和批处理集成 |
| Backend | `backend/golang-standard` | 高并发 API、网关、worker、CLI 和轻量微服务 |
| Backend | `backend/next-api-routes` | Next.js Route Handlers / BFF / Webhook / 轻量后端端点 |
| Database | `database/rdbms-postgresql` | 强事务、复杂查询、JSONB、全文搜索、报表和云托管关系库 |
| Database | `database/rdbms-mysql` | 既有 MySQL 生产体系、OLTP、主从、备份和成熟运维 |
| Database | `database/embedded-sqlite` | 桌面、本地优先、CLI、插件、边缘节点和单机工具 |
| Capability | `capabilities/processing-ai-jobs` | 文件处理、批处理、LLM / AI 调用、限流和任务调度 |
| Capability | `capabilities/architecture-patterns` | 分层、模块化单体、事件驱动、状态机和扩展点 |
| Capability | `capabilities/security` | 鉴权、权限、敏感数据、签名、审计和输入输出安全 |
| Capability | `capabilities/observability` | 日志、指标、trace、健康检查、告警和问题定位 |
| Capability | `capabilities/testing` | 单元、集成、契约、E2E、浏览器自动化、测试数据和 CI |

## 选择顺序

1. 先判断本次是否真的需要 profile；纯文案、纯配置、小 bugfix 可写 N/A。
2. 主栈只在受影响时选择：Frontend、Backend、Database。
3. 横向能力按需选择；当前内置能力卡包括 `processing-ai-jobs`、`architecture-patterns`、`security`、`observability` 和 `testing`。
4. 如果项目已有技术栈，以 `.specforge/wiki/03-architecture.md` 为准；profile 只用于确认是否沿用或偏离。
5. 使用 profile 之外的关键技术，必须写偏离原因、风险和验证方式。

## 分类原则

| 目录 | 放什么 | 不放什么 |
|---|---|---|
| `frontend/` | React / Vite / Next 等前端主栈 | UI 设计规则、视觉风格 |
| `backend/` | FastAPI / Next API 等后端主栈 | API 质量标准 |
| `database/` | PostgreSQL / SQLite 等存储选择 | 具体项目表结构 |
| `capabilities/` | 可组合能力卡：AI / 后台任务、架构形态、安全、可观测性、测试策略 | 长篇规范、一次性实现计划 |

## 维护规则

- 每张 profile 控制在“选择卡”粒度，避免写成教程。
- 文件名要表达技术或能力，不要用泛词。
- 不为了热门技术新增 profile；只有可复用选择条件时才新增。
- standards 变化不复制到 profiles；profiles 只链接相关标准。
