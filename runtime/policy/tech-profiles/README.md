# 技术栈画像库 (Tech Profiles)

Tech Profiles 是 design 阶段的选型决策库，不是依赖清单。它的职责是把“用什么技术”进一步落成：为什么选、适用边界是什么、目录和接口怎么组织、需要哪些配套库、哪些风险必须提前验证。

Agent 在生成 `design.md` 时，必须从本目录选择一组可组合 profile，并把选择结果写进设计产物。若项目使用本目录之外的技术栈，必须在 design 中说明替代原因、风险和验证方式。

## 选择原则

Tech Profiles 面向所有项目类型，不能把某个示例应用写成默认答案。任何 profile 组合都必须从当前 change 的产品形态、运行环境、团队约束、数据量级和风险边界推导出来。

不要在 profile 中假设项目一定是博客、后台、SaaS、AI 工具或单体全栈应用；这些只能作为“组合模式”的输入条件，不能成为全局默认。

## 选择流程

1. 先识别本次 change 的技术维度：UI、API、数据、内容编辑、安全、测试、部署、可观测性。
2. 对每个受影响维度选择一个或多个候选 profile。
3. 对每个选中的 profile 写明“采用 / 部分采用 / 不采用”的理由。
4. 对未覆盖的关键技术写 `Profile Deviations`，说明替代原因、风险和验证方式。
5. 如果 profile 之间有冲突，以用户约束、已有仓库事实和生产风险为准，并在 design 中记录取舍。
6. 进入 implementation 前，tasks 必须把关键选型拆成可验收任务。

## 设计产物必填块

```md
## Tech Profile Selection

| 维度 | 选中 profile | 采用范围 | 选择理由 | 替代方案 / 不选原因 |
|---|---|---|---|---|
| Frontend | frontend/react-vite-tailwind-ts | full | 纯 SPA，部署简单 | Next.js 过重 |
| Database | database/rdbms-postgresql | full | 需要复杂查询、事务和 JSON 支持 | MySQL 可行但团队已有 PostgreSQL 经验 |
| Testing | testing/vitest-playwright | full | 覆盖组件和 P0 E2E | 无 |

## Profile Deviations

- 偏离点：...
- 风险：...
- 补偿验证：...
```

Spec review 必须阻断以下情况：

- 有新技术栈但没有 profile selection。
- 只写框架名，没有说明数据、状态、测试、安全和部署边界。
- 使用 profile 之外的关键库，但没有说明为什么不用默认建议。
- 需求包含持久化、编辑器、图表、拖拽、富文本、认证、支付、AI 调用等复杂能力，却没有选择对应 profile 或补充方案。

## 维度地图

| 维度 | 目录 | 解决的问题 |
|---|---|---|
| 前端应用 | `frontend/` | 页面路由、状态、组件、样式、构建和部署 |
| 后端服务 | `backend/` | API 边界、服务分层、数据访问、运行时约束 |
| 数据库 | `database/` | Schema、索引、迁移、事务和数据生命周期 |
| 内容编辑 | `content/` | Markdown、富文本、预览、上传和安全渲染 |
| 架构模式 | `architecture/` | 模块边界、领域建模、依赖方向、系统模式 |
| 安全 | `security/` | 认证、授权、输入输出、OWASP 风险 |
| 可观测性 | `observability/` | 日志、指标、链路、告警和排障证据 |
| 测试 | `testing/` | 单测、集成、E2E、CI 产物和验收门禁 |

## 组合模式

以下是组合思路，不是默认脚手架。Agent 必须根据需求删减、替换或补充。

| 模式 | 典型 profile 组合 | 需要明确的边界 |
|---|---|---|
| 公开内容发布 | `frontend/next-app-router-tailwind-ts` + 可选 `content/*` + 可选 `database/*` + `testing/vitest-playwright` | SEO、发布流、预览、缓存、权限、内容安全 |
| 内部操作台 / 后台 | `frontend/react-vite-tailwind-ts` 或 `frontend/vue-vite-tailwind-ts` + 后端 profile + `database/*` + `security/owasp-top10-defenses` | 权限、表格/表单密度、审计、批量操作、错误恢复 |
| API 服务 / BFF | 后端 profile + `database/*` + `testing/*` + `observability/logging-metrics` | API 契约、鉴权、限流、事务、重试、SLO |
| 复杂业务域 | 后端 profile + `architecture/domain-driven-design` 或 `architecture/clean-architecture` + `database/*` | 聚合边界、事务一致性、领域事件、迁移和测试策略 |
| 本地优先 / 嵌入式 | 前端或桌面运行时 profile + `database/embedded-sqlite` + `testing/*` | 单机并发、备份、同步、文件位置、损坏恢复 |

## 数据库选择

| 条件 | 推荐 profile | 避免 |
|---|---|---|
| 复杂查询、强事务、JSON/全文/地理扩展、云托管成熟度优先 | `database/rdbms-postgresql` | 团队完全没有运维经验时，不要把高级能力作为默认需求 |
| 团队已有 MySQL 生态、传统 Web/Java/PHP/Rails/Go 服务、读写模型清晰 | `database/rdbms-mysql` | 需要 PostgreSQL 特有扩展或复杂 JSON 查询时不要硬选 |
| 单机、嵌入式、桌面、本地缓存、测试夹具、低并发内部工具 | `database/embedded-sqlite` | 多写入者、高并发服务端、跨实例共享写入、复杂权限隔离 |
| 没有持久化或只读静态数据 | 不选择数据库 profile | 不要为了“看起来完整”引入数据库 |

## 前端主栈选择

| 条件 | 推荐 | 避免 |
|---|---|---|
| 需要 SEO、服务端渲染、站点地图、公开页面 | `next-app-router-tailwind-ts` | 纯 SPA 首屏和 SEO 补偿成本高 |
| 内部工具、后台、复杂交互、静态托管 | `react-vite-tailwind-ts` | 不需要 SSR 时避免引入 Next.js 运行时复杂度 |
| 团队熟悉 Vue、快速后台或数据看板 | `vue-vite-tailwind-ts` | React 生态组件强绑定时避免强行迁移 |

## Profile 写作模板

新增 profile 时必须使用以下结构：

```md
# <技术栈名称>

## 适用 / 不适用
## 默认组合
## 目录与边界
## 数据、状态与错误处理
## UI / API / 安全细节
## 测试与交付
## Design 必填问题
## Spec Review 检查项
```

## 维护规则

- Profile 只写跨项目稳定规则，不写某个业务项目的临时事实。
- 库名可以出现，但必须绑定选择条件，不能只罗列热门包。
- 不把“默认建议”写成绝对命令；用户约束、已有仓库事实和安全边界优先。
- 影响 starter 的改动完成后运行 `npm run sync:starter`。
