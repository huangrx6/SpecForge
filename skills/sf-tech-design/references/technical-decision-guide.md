# Technical Decision Guide

本文件保存技术影响面扫描、分批确认卡、依赖 / 工具链确认、版本事实检查、核心决策 review 和写作细则。`SKILL.md` 只保留入口执行顺序、门禁和产物边界。

## 影响面扫描

先从 requirements、brief、PRD、ui-design、wiki 和现有代码判断本次涉及哪些工程面。不要为了“完整”全量展开。

| 影响面 | 触发信号 | 常读子模块 |
|---|---|---|
| Frontend engineering | 新路由、组件边界、状态、API client、构建或前端测试变化 | `frontend-design.md` |
| Backend engineering | 服务模块、后台任务、并发、幂等、运行时变化 | `backend-design.md` |
| Domain model | 新实体、状态机、领域规则、边界上下文 | `domain-design.md` |
| API / SDK / Events | 新增 / 修改 API、事件、Webhook、跨系统契约 | `api-design.md` |
| Data / DB / Migration | 持久化、索引、迁移、缓存、对象存储、数据生命周期 | `data-design.md` |
| Auth / Security / NFR | 权限、安全、审计、可观测性、部署、可靠性、回滚 | `nfr-design.md` |

状态写法：

- `yes`：本次必须展开设计。
- `no`：写跳过理由。
- `unknown`：如果会影响架构、数据、安全、成本或上线风险，暂停澄清；低风险未知可写入 assumption 和验证点。

## 技术选型确认原则

铁律：任何 `[NEEDS TECH/DEPENDENCY/TOOLING DECISION]` 维度未确认，不得写架构设计正文。

| 场景 | 处理 |
|---|---|
| 存量项目且本次沿用 wiki / 代码中已有技术栈 | 记录 `existing_stack` 和证据路径 |
| 用户在 brief / PRD / requirements 中已经明确指定 | 记录 `confirmed` 和来源 |
| 用户明确说“按推荐方案默认做 / 不用再问” | 记录 `delegated_default`，仍写推荐理由、风险和回退点 |
| 用户已确认官方脚手架 / 框架组合 | 记录 `scaffold_confirmed`，脚手架自带依赖按依赖组记录 |
| 新项目、空仓库、技术栈缺失，或新增 / 替换关键技术 | 给候选方案和推荐项，等待确认 |
| 多个方案都合理，且影响成本、交付、招聘维护、上线或数据安全 | 停止并让用户选择 |

## 分批确认卡

确认卡只包含 `pending` 维度。不要把已经 `existing_stack` 或 `confirmed` 的内容重复拿去问用户。

第一批：架构级决策，影响最大，先确认。

```markdown
## 技术选型确认 · 第一批：架构方向

| 维度 | 方案 A | 方案 B | 方案 C | 推荐 | 权衡说明 |
|---|---|---|---|---|---|
| 部署平台 | Vercel / Netlify | 自建 VPS / Docker | 云服务 | | 影响成本、运维复杂度和访问速度 |
| 后端运行时 | Node.js / Next API | Python / FastAPI | 无后端 | | 影响团队技能栈、AI 生态和性能 |
| 数据库 | PostgreSQL | SQLite | 托管服务 / 无 DB | | 影响数据建模和运维 |
| 认证方案 | 托管认证 | 自建 JWT / Session | 现有 SSO | | 影响安全复杂度和成本 |

这些问题会改变架构边界、部署方式、依赖和后续任务拆解。请先确认。
```

第二批：前端工程，仅当有前端且需要新决策时输出。

```markdown
## 技术选型确认 · 第二批：前端工程

| 维度 | 方案 A | 方案 B | 方案 C | 推荐 | 权衡说明 |
|---|---|---|---|---|---|
| 前端框架 | Next.js App Router | React + Vite | Vue / Nuxt | | SSR、路由、部署和团队熟悉度 |
| 包管理器 | pnpm | npm | yarn / bun | | 影响安装、锁文件和团队习惯 |
| UI 组件库 | shadcn/ui + Radix | Ant Design | MUI | | 影响视觉可定制性和开发速度 |
| 样式方案 | Tailwind CSS | CSS Modules | Styled Components | | 影响设计还原和维护 |
| 状态管理 | Zustand | Context / useState | Redux Toolkit | | 影响复杂状态和调试 |
| 表单验证 | React Hook Form + Zod | Formik | 原生 | | 影响类型、性能和校验复用 |

这些问题会改变前端目录、组件依赖、样式写法和实现任务。请确认。
```

第三批：测试栈与工程工具。

```markdown
## 技术选型确认 · 第三批：测试与工程工具

| 维度 | 方案 A | 方案 B | 推荐 | 说明 |
|---|---|---|---|---|
| 单元 / 集成测试 | Vitest | Jest / pytest | | 与项目语言和构建工具匹配 |
| E2E 测试 | Playwright | Cypress | | 影响验证方式和 CI |
| API 测试 | supertest / pytest | MSW mock | | 影响契约验证 |
| CI/CD | GitHub Actions | GitLab CI / 现有流水线 | | 影响交付流程 |

这些问题会改变验证任务和 CI 配置。请确认。
```

## 新增依赖确认

凡是本次新增直接依赖、SDK、插件、组件库、ORM、驱动、测试库、浏览器自动化库或外部 provider，都要单独确认。官方脚手架自带依赖可按依赖组记录，但额外新增依赖仍要确认。

```markdown
## 新增依赖确认

| 依赖 / 依赖组 | 类型 | 用途 | 替代方案 | 推荐理由 | 风险 / 许可证 / 安全影响 |
|---|---|---|---|---|---|
| | runtime / dev / SDK / plugin / scaffold-bundled | | | | |

这些依赖会改变安装、锁文件、安全审查和长期维护。请确认是否采用。
```

确认后写入：

- `[TECH DECISION CONFIRMED]` 或 `Tech Direction Status: confirmed`
- `[DEPENDENCY DECISION CONFIRMED]` 或 `Dependency Decision Status: confirmed`
- `[TOOLING DECISION CONFIRMED]` 或 `Tooling Decision Status: confirmed`

如果用户只是授权“按推荐方案默认做”，写 `delegated_default`，保留推荐理由、风险和回退点。

## 当前版本事实检查

技术设计不能只靠记忆。以下情况必须查询当前官方资料，或读取项目 lockfile / manifest / wiki：

- 新增或替换框架、SDK、云服务、数据库、部署平台、AI provider、模型、测试工具或安全相关依赖。
- 用户要求“最新版本”“当前推荐”“现在怎么做”。
- 技术选择会影响成本、上线、兼容性、安全或长期维护。

写入 `technical-design.md#1` 或规则基准章节：

| 项 | 版本 / 事实 | 来源 | 日期 | 对设计的影响 |
|---|---|---|---|---|
| | | 官方文档 / lockfile / package manifest / wiki | | |

如果无法确认当前事实，必须写风险并暂停关键决策；不要把模型记忆当作当前事实。

## 规则基准对齐

技术设计要说明“按哪套规则基准实现”，不是只写“怎么实现”。

1. 根据影响面读取对应规则入口，每个入口已经内嵌唯一主基准。
2. 在 `.specforge/core/standards/engineering.md#主基准` 找官方入口；需要具体条款、字段命名、版本行为或用户要求来源时，打开官方入口查当前原文。
3. 采用点必须具体到本次设计，例如资源建模、错误响应、对象级授权、可观测性字段、回滚策略。
4. 如果项目已有模式和规则主基准不同，优先项目事实，并在 `规则基准与偏离` 中写偏离理由。
5. 不要另起并行规范章节或堆多个候选规范。

## 核心决策摘要 Review

详细 technical design 初稿完成后，不直接进入 tasking。先给用户看核心决策摘要，等待确认、调整或授权默认。

```markdown
## 技术设计核心决策摘要

| 项 | 结论 | 说明 |
|---|---|---|
| 架构选择 | | 为什么适合本次需求 |
| 新增 / 替换依赖 | | 每项为什么必须引入，替代方案是什么 |
| 工具链选择 | | 包管理器、组件库、样式、依赖管理、测试 runner 等 |
| 与现有架构冲突 / 变更 | | 如无则写 N/A |
| 已知最大风险 | | 风险、影响、缓解和验证方式 |

请确认这份 technical design 是否可以进入 tasking；也可以指出要改的技术路线、依赖或风险处理。
```

用户确认后，在 `technical-design.md#1. 技术选型与依赖确认` 写：

- `Core Decision Review Status: confirmed` 或表格项 `Core Decision Review Status | confirmed`
- `[TECH DESIGN REVIEW CONFIRMED]`
- 确认来源：用户消息 / 用户授权默认 / N/A 理由

无技术影响时写 `not_required` 和 N/A 理由。

## 写作细则

- 每个不涉及的章节保留一行 N/A 理由，不写空表。
- 每个技术决策写确认来源、profile / 规则入口、回退或替换成本。
- 每个新增依赖写用途、替代方案、风险和确认来源。
- 每个 API / 数据 / 权限 / 生产风险都要有验证路径。
- UI 细节只引用 `ui-design.md`，不要复制页面地图、视觉风格和交互状态。
- 不把“常见最佳实践”当作用户确认，不把“Agent recommendation”写成已决定。
