---
name: sf-tech-design
description: 生成或更新 SpecForge work item 的 technical_design；用于 ready artifact 为 technical_design，或需求涉及前端工程、后端架构、API、数据、权限、配置、任务或 NFR 时。
---

# sf-tech-design

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

## 运行模式检测

1. 当前目录向上存在 `.specforge/` 且有 active work item：**Embedded 模式**，按 artifact graph 写入 `01-spec/technical-design.md`，并遵守选型 / 依赖 / 工具链 / 核心决策 review 门禁。
2. 存在 `.specforge/` 但无 active work item：**Lightweight 模式**，可先做技术影响面、候选方案和风险草稿；需要落档时输出 `specforge-import-ready.md` 格式内容，或先路由 `sf-intake` 创建 work item。
3. 不存在 `.specforge/`：**Standalone 模式**，不要运行 `.specforge/...` 命令；输出可导入的 `specforge-import-ready.md` 格式内容，必须明确哪些技术、依赖、工具链是用户已确认，哪些只是 Agent recommendation。

把 requirements 和可选 UI design 转成可实现、可审查、可验证的工程设计。它不负责画页面线稿或决定视觉风格。

## 启动

运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

如果输出是 `Instructions blocked`，必须按 `Route` 处理阻断。尤其当 blocker 为 `tech-direction-unconfirmed` 或 `dependency-decision-unconfirmed` 时，停止 technical design，路由到 `sf-brainstorm`，只向用户确认技术栈、数据库、调度器、AI provider、部署和新增依赖方向；不要运行 `create-artifact.mjs technical_design`，不要继续展开架构、API、数据、NFR 或验证矩阵。

确认 ready artifact 包含 `technical_design`，再：

```bash
node .specforge/core/scripts/create-artifact.mjs technical_design
```

## 内部技能母本

写 technical design 前，读取：

```text
.specforge/core/workflows/stages/technical-design/SKILL.md
```

先做影响面判断，再按需读取内部设计子模块。不要为了“完整”一次性读取所有子模块。

| 设计维度 | 子模块 |
|---|---|
| 前端工程、路由、组件边界、状态、API client、构建 | `.specforge/core/workflows/stages/technical-design/frontend-design.md` |
| 后端模块、服务边界、后台任务、并发、幂等 | `.specforge/core/workflows/stages/technical-design/backend-design.md` |
| 领域模型、实体与边界上下文 | `.specforge/core/workflows/stages/technical-design/domain-design.md` |
| API 契约、SDK、事件、跨系统接口 | `.specforge/core/workflows/stages/technical-design/api-design.md` |
| DB / Schema / 索引 / 迁移 | `.specforge/core/workflows/stages/technical-design/data-design.md` |
| 安全、可观测性、部署、可靠性 | `.specforge/core/workflows/stages/technical-design/nfr-design.md` |

## 关联标准

- `.specforge/core/standards/product.md`：技术设计必须追溯到已确认需求。
- `.specforge/core/standards/workflow.md`：写入边界、非目标、scope 和 gate 边界。
- `.specforge/core/standards/engineering.md`：工程、API、数据、安全、交付、测试、审查和规则基准。
- `.specforge/core/profiles/README.md`：技术选型维度、数据库选择矩阵和 profile selection 写法。

## 规则基准对齐

技术设计不是只写“怎么实现”，还要说明“按哪套规则基准实现”。写 `technical-design.md` 时必须完成：

1. 根据影响面读取对应规则入口，每个入口已经内嵌唯一主基准。
2. 在 `.specforge/core/standards/engineering.md#主基准` 找官方入口；需要具体条款、字段命名、版本行为或用户要求来源时，打开官方入口查当前原文。
3. 采用点必须具体到本次设计，例如资源建模、错误响应、对象级授权、可观测性字段、回滚策略。
4. 如果项目已有模式和规则主基准不同，优先项目事实，并在 `规则基准与偏离` 中写偏离理由。
5. 不要另起并行规范章节或堆多个候选规范。

## 技术选型全量访谈协议

**铁律：任何 `[NEEDS TECH/DEPENDENCY/TOOLING DECISION]` 维度未确认 → 不得写架构设计正文。**

### 第一步：影响面扫描（内部，不输出给用户）

先从 requirements / brief / wiki 判断哪些维度适用，并标记状态：
- `reuse` — 沿用现有 wiki / 代码中已存在技术栈
- `confirmed` — 用户在 brief/PRD/requirements 中已明确指定
- `pending` — 需要向用户确认

```
[ ] 前端：有用户界面  → 前端框架、包管理器、组件库、样式方案、状态管理
[ ] 后端：有服务器逻辑  → 运行时、框架、认证方案
[ ] 数据库：有持久化  → DB 类型、ORM、迁移工具
[ ] 队列/任务：有异步  → 队列、调度器
[ ] AI/LLM：有 AI 能力  → Provider、模型、SDK、评估框架
[ ] 文件存储：有上传/下载  → 对象存储
[ ] 部署：新项目或变更  → 平台、容器化、CI/CD
[ ] 测试栈  → 单元/集成/E2E 工具选型
```

参考 `.specforge/core/profiles/` 判断选型，不要凭空推荐陌生技术栈：
- 前端：`profiles/frontend/next-app-router-tailwind-ts.md` 或 `react-vite-tailwind-ts.md`
- 后端：`profiles/backend/python-fastapi.md` 或 `next-api-routes.md`
- 数据库：`profiles/database/rdbms-postgresql.md` 或 `embedded-sqlite.md`

### 第二步：生成分批确认卡（只包含 pending 维度，每批等用户确认后再输出下一批）

**第一批：架构级决策（影响最大，先确认）**

```markdown
## 技术选型确认 · 第一批：架构方向

| 维度 | 方案 A | 方案 B | 方案 C | 推荐 | 权衡说明 |
|---|---|---|---|---|---|
| **部署平台** | Vercel / Netlify | 自建 VPS/Docker | 云服务(AWS/GCP/阿里云) | | 影响成本、运维复杂度、国内访问速度 |
| **后端运行时** | Node.js (Next.js API) | Python (FastAPI) | 无后端(纯前端+第三方) | | 影响团队技能栈、AI 生态、性能 |
| **数据库** | PostgreSQL | SQLite(轻量) | 无数据库(第三方托管) | | 影响数据建模方式、运维成本 |
| **认证方案** | NextAuth / Clerk(托管) | 自建 JWT | 第三方(Auth0/Supabase) | | 影响安全复杂度和月费 |

请先确认这几个架构方向 ↑，我确认收到后再展示第二批（前端工程细节）。
```

**第二批：前端工程（仅当有前端时，第一批确认后输出）**

```markdown
## 技术选型确认 · 第二批：前端工程

| 维度 | 方案 A | 方案 B | 方案 C | 推荐 | 权衡说明 |
|---|---|---|---|---|---|
| **前端框架** | Next.js App Router | React + Vite(SPA) | Vue / Nuxt | 按部署平台推断 | SSR需要/SEO需要→Next.js；纯内部工具→Vite |
| **包管理器** | pnpm | npm | yarn | pnpm | 速度和磁盘效率更好 |
| **UI 组件库** | shadcn/ui + Radix | Ant Design | MUI | shadcn/ui | 可定制性 vs 开箱即用 vs 国内生态 |
| **样式方案** | Tailwind CSS | CSS Modules | Styled Components | Tailwind | 与 shadcn/ui 最配 |
| **状态管理** | Zustand | Jotai | Redux Toolkit / Context | Zustand(简单)/Redux(复杂) | 按状态复杂度选 |
| **表单验证** | React Hook Form + Zod | Formik | 原生 | React Hook Form + Zod | 性能好且类型安全 |

请确认前端工程选型 ↑，我确认收到后再展示第三批（测试和构建工具）。
```

**第三批：测试栈与工程工具（第二批确认后输出）**

```markdown
## 技术选型确认 · 第三批：测试与工程工具

| 维度 | 方案 A | 方案 B | 推荐 | 说明 |
|---|---|---|---|---|
| **单元/集成测试** | Vitest | Jest | Vitest | 速度更快，与 Vite/Next.js 集成更好 |
| **E2E 测试** | Playwright | Cypress | Playwright | 多浏览器支持，与 SpecForge sf-verify 集成 |
| **API 测试** | supertest | msw (mock) | supertest | 实际测试 Route Handler/API |
| **CI/CD** | GitHub Actions | GitLab CI | GitHub Actions | 免费额度充足，生态最好 |

确认后我将开始展示核心依赖列表并请求最终确认。
```

### 第三步：新增依赖确认卡

技术栈方向确认后，若有超出 profile 推荐范围的新增依赖，单独输出：

```markdown
## 新增依赖确认

| 依赖 | 类型 | 用途 | 替代方案 | 推荐理由 | 风险 |
|---|---|---|---|---|---|
| | runtime / dev / SDK | | | | |
```

未经确认的关键技术写成 `[NEEDS TECH DECISION]`；未经确认的新增依赖写成 `[NEEDS DEPENDENCY DECISION]`；未经确认的工具链写成 `[NEEDS TOOLING DECISION]`。

三者任一存在 → 不得进入 `sf-tasking`、`sf-spec-review` approval 或 `sf-implement`。

写入或改动框架、数据库、队列 / 调度、AI provider / 模型、组件库、运行时、部署方式、测试栈，决定或变更包管理器、UI 组件库、样式方案、Python 依赖管理 / 虚拟环境、构建工具、测试 runner、任务运行器、monorepo 工具，或计划引入新的直接依赖、SDK、插件、组件库、ORM、驱动、测试库、浏览器自动化库前，先判断是否需要用户确认：

| 场景 | 处理 |
|---|---|
| 存量项目且本次沿用 wiki / 代码中已存在的技术栈 | 可直接记录“沿用现有栈”，不需要额外询问 |
| 用户在 brief / PRD / requirements 中已经明确指定技术栈 | 记录为“用户已确认”，不再重复询问 |
| 用户明确说“按推荐方案默认做 / 不用再问” | 记录为“用户授权默认”，仍需写推荐理由和风险 |
| 新项目、空仓库、技术栈缺失，或本次要新增 / 替换关键技术 | 必须给出候选方案和推荐项，等待用户确认后才能定稿和继续设计 |
| 本次需要新增直接依赖或外部 SDK | 必须列出依赖名称、用途、替代方案、风险和推荐理由，等待用户确认 |
| 本次需要选择或替换包管理器、UI 组件库、样式方案、Python 依赖管理 / 虚拟环境、构建工具、测试 runner、任务运行器、monorepo 工具 | 必须列出候选项、推荐项和取舍，等待用户确认 |
| 用户已确认某个官方脚手架 / 框架组合 | 脚手架自带的直接依赖不逐个询问，但要按“依赖组”记录；额外新增依赖仍需确认 |
| 多个方案都合理，且会影响成本、交付、招聘维护、上线或数据安全 | 必须停止并让用户选择 |

需要确认时，先输出“技术选型与依赖确认卡”，本轮停在确认卡；不要继续展开架构、API、数据、NFR 等详细 technical design，也不要进入 tasking / implementation：

如果候选方案不仅是依赖确认，而是会改变产品边界、体验方式、成本模型、上线策略或长期架构方向，先路由到 `sf-brainstorm`，让用户完成方案取舍并写入 `00-intake/brainstorm.md`，再回到 `sf-tech-design` 定稿。

```markdown
## 技术选型与依赖确认

我建议采用：<推荐组合>

| 维度 | 方案 A | 方案 B | 方案 C | 推荐 | 取舍 |
|---|---|---|---|---|---|
| Frontend | | | | | |
| Frontend package manager | npm | pnpm | yarn / bun | | |
| UI component library | | | | | |
| Styling | | | | | |
| Backend | | | | | |
| Python dependency manager | uv | Poetry | pip / Conda | | |
| Database | | | | | |
| Jobs / Scheduler | | | | | |
| AI / LLM Provider | | | | | |
| Deploy / Runtime | | | | | |

### 新增依赖确认

| 依赖 / 依赖组 | 类型 | 用途 | 替代方案 | 推荐理由 | 风险 / 许可证 / 安全影响 |
|---|---|---|---|---|---|
| | runtime / dev / SDK / plugin / scaffold-bundled | | | | |

请确认采用哪一组；也可以指定你自己的技术栈。
```

未经确认的关键技术选择写成 `[NEEDS TECH DECISION]`；未经确认的新增依赖写成 `[NEEDS DEPENDENCY DECISION]`。二者都不得进入 `sf-tasking`、`sf-spec-review` approval 或 `sf-implement`。
未经确认的工具链选择写成 `[NEEDS TOOLING DECISION]`。它同样不得进入 `sf-tasking`、`sf-spec-review` approval 或 `sf-implement`。

## 当前版本事实检查

技术设计不能只靠记忆。以下情况必须查询当前官方资料或读取项目锁文件 / manifest：

- 新增或替换框架、SDK、云服务、数据库、部署平台、AI provider、模型、测试工具或安全相关依赖。
- 用户要求“最新版本”“当前推荐”“现在怎么做”。
- 技术选择会影响成本、上线、兼容性、安全或长期维护。

写入 `technical-design.md#1` 或 `#5`：

| 项 | 版本 / 事实 | 来源 | 日期 | 对设计的影响 |
|---|---|---|---|---|
| | | 官方文档 / lockfile / package manifest / wiki | | |

如果沿用现有项目版本，可以用 lockfile、package manifest、代码入口或 wiki 作为证据；如果无法确认，必须写风险并暂停关键决策。

## 初稿后核心决策 Review

技术设计有两个确认点：动笔前确认技术选型 / 依赖 / 工具链，初稿后确认核心决策摘要。完成详细 technical design 初稿后，必须先向用户展示以下摘要，等待确认、调整或授权默认；确认前不得进入 `sf-tasking`、`sf-spec-review` approval 或 `sf-implement`。

```markdown
## 技术设计核心决策摘要

| 项 | 结论 | 说明 |
|---|---|---|
| 架构选择 | | 为什么适合本次需求 |
| 新增 / 替换依赖 | | 每项为什么必须引入，替代方案是什么 |
| 工具链选择 | | 包管理器、组件库、样式、依赖管理、测试 runner 等 |
| 与现有架构冲突 / 变更 | | 如无则写 N/A |
| 已知最大风险 | | 风险、影响、缓解和验证方式 |

请确认这份 technical design 是否可以进入 tasking；你也可以指出要改的技术路线、依赖或风险处理。
```

用户确认后，在 `technical-design.md#1. 技术选型与依赖确认` 的 `核心决策摘要 Review` 写：

- `Core Decision Review Status: confirmed` 或表格项 `Core Decision Review Status | confirmed`
- `[TECH DESIGN REVIEW CONFIRMED]`
- 确认来源：用户消息 / 用户授权默认 / N/A 理由

如果用户只是授权“按推荐方案默认做”，写 `delegated_default` 并保留推荐理由、风险和回退点。无技术影响时写 `not_required` 和 N/A 理由。

## 执行顺序

1. 读取 requirements、可选 `ui-design.md`、wiki 和现有代码结构，判断本次是否真的有技术影响。
2. 填写 `technical-design.md#0. 影响面与读取计划`：
   - 每个影响面用 `yes / no / unknown`。
   - `unknown` 如果会改变架构、数据、安全或上线风险，必须暂停澄清。
   - 只列本次读取的子模块和 profile。
3. 按影响面读取子模块和 profile：
   - 只有 `has_ui` 不等于需要前端工程设计；纯视觉或纯文案 UI 可以 N/A。
   - 有 API 不等于必须有新后端模块；可能只是前端调用现有接口。
   - 有数据展示不等于必须有 DB 设计；只有持久化、索引、迁移、生命周期变化才读 data-design。
4. 完成技术选型与依赖确认门禁：沿用现有栈、用户已指定、用户授权默认，或用户确认候选方案 / 新增依赖；把来源写入 `technical-design.md#1. 技术选型与依赖确认`。未确认时停止，不继续展开详细设计。
   - 新项目 / 空仓库路径必须在上游 artifact 留下 `[TECH DECISION CONFIRMED]` 或 `Tech Direction Status: confirmed`，或明确 `delegated_default` / `scaffold_confirmed`。
   - 任何新增 / 替换直接依赖、SDK、插件、组件库、ORM、驱动、测试库、浏览器自动化库或外部 provider，都必须在上游 artifact 留下 `[DEPENDENCY DECISION CONFIRMED]`、`Dependency Decision Status: confirmed`、用户授权默认或已确认脚手架依据。
   - 任何包管理器、UI 组件库、样式方案、Python 依赖管理 / 虚拟环境、构建工具、测试 runner、任务运行器或 monorepo 工具选择，都必须在上游 artifact 留下 `[TOOLING DECISION CONFIRMED]`、`Tooling Decision Status: confirmed`、`existing_stack`、用户授权默认或已确认脚手架依据。
   - 不能自行宣布“所有依赖已在 brainstorm 阶段用户确认”，除非 `brainstorm.md` 或用户消息里有可追溯确认记录。
5. 写技术设计时，每个不涉及的章节保留一行 N/A 理由，不写空表。
6. 完成详细 technical design 初稿后，输出核心决策摘要给用户确认；确认后写入 `Core Decision Review Status` 和 `[TECH DESIGN REVIEW CONFIRMED]`。
7. 输出必须能直接支持 `sf-tasking`：每个技术决策都要能拆成任务、验证或明确 N/A。

## 完成标准

- `01-spec/technical-design.md` 存在。
- 有技术影响时，前端 / 后端 / API / 数据 / 权限 / 配置 / NFR 的适用性判断清楚。
- 无技术影响时，明确写出 N/A、理由和验证方式。
- 技术栈选择引用 profile 或说明偏离理由。
- 新项目、新增 / 替换关键技术或新增直接依赖时，必须有用户确认、用户授权默认或明确的现有栈 / 已确认脚手架依据。
- 包管理器、UI 组件库、样式方案、Python 依赖管理 / 虚拟环境、构建工具、测试 runner、任务运行器或 monorepo 工具选择必须有用户确认、用户授权默认、沿用现有栈或已确认脚手架依据。
- 技术设计初稿后的核心决策摘要已经被用户确认、用户授权默认，或明确 N/A。
- 规则基准采用点已写入采用点、偏离理由和验证证据。
- 下一步路由到 `sf-tasking`，以 `instructions.mjs` 为准。

## 不做

- 不写业务代码。
- 不重复维护 UI 原型、视觉风格和页面交互细节；这些只引用 `ui-design.md`。
- 不在用户尚未确认技术栈 / 依赖 / 外部 provider / 部署方向时定稿 technical design。
- 不在用户尚未确认工具链时替用户决定 npm / pnpm / yarn、UI 组件库、uv / Poetry / pip / Conda 等工程偏好。
