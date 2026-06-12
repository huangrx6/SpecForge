# Technical Design

> 本 artifact 只处理工程实现设计：前端架构、后端架构、API、数据、权限、配置、任务、部署、NFR、失败模式和验证策略。UI 页面结构和视觉原型属于 `ui-design.md`。

## 0.0 一页摘要

- 设计结论：
- 已确认决策：
- 最大风险：
- 下一步：
- 需要用户确认的唯一问题：

## 0. 影响面与读取计划

> 先判断影响面，再读取对应子模块和 profile。不要默认全量展开。`unknown` 如果会改变架构、数据、安全、成本或上线风险，必须暂停澄清。

| 影响面 | yes / no / unknown | 触发证据 | 读取子模块 / profile | 跳过或待澄清理由 |
|---|---|---|
| Frontend engineering | | | | |
| Backend engineering | | | | |
| Domain model / state machine | | | | |
| API / SDK / Events | | | | |
| Data / DB / Migration | | | | |
| Auth / Permission / Security | | | | |
| Config / Env / Delivery | | | | |
| Jobs / Queue / Scheduler | | | | |
| Observability / Reliability | | | | |

### 读取计划

- Wiki 入口：
- 代码入口 / 关键符号：
- 上游 / 下游：
- 测试 / 运行入口：
- 需要补证的缺口：
- 已读取的内部子模块：
- 已读取的 profiles：
- 已查询的官方基准来源（如适用）：
- 本次不展开的技术章节及理由：

## 0.1 Design Quality Gate

| 检查项 | 结论 | 证据 / 处理 |
|---|---|---|
| 设计规模 | compact / standard / full | |
| 是否沿用现有架构 | yes / no / partial | |
| 新增依赖是否已确认 | confirmed / delegated_default / existing_stack / not_required / pending | |
| 是否存在更简单方案 | no / yes - rejected / yes - choose simpler | |
| 关键契约是否可测试 | yes / no / N/A | |
| 是否能直接拆 tasks | yes / no | |

## 1. 技术选型与依赖确认

> 新项目、空仓库、技术栈缺失、新增 / 替换关键技术，或新增直接依赖 / SDK / 插件 / 组件库 / ORM / 驱动 / 测试库时必须先填写并等待确认。本次只沿用现有项目技术栈时，写清证据路径即可。未经确认的关键选型写真实 NEEDS_TECH_DECISION marker；未经确认的新增依赖写真实 NEEDS_DEPENDENCY_DECISION marker。二者都不能进入 tasking / spec_review approval / implementation。

| 项 | 内容 |
|---|---|
| 确认状态 | confirmed / delegated_default / existing_stack / scaffold_confirmed / not_required / needs-tech-decision / needs-dependency-decision |
| 确认来源 | 用户消息 / brief / PRD / requirements / wiki / 代码路径 |
| 是否新项目或空仓库 | yes / no |
| 是否新增或替换关键技术 | yes / no |
| 是否新增直接依赖 | yes / no |
| 待确认风险 | |
| Tech Direction Status | confirmed / delegated_default / existing_stack / scaffold_confirmed / blocked |
| 可追溯确认标记 | real tech confirmation marker / N/A |
| Dependency Decision Status | confirmed / delegated_default / scaffold_confirmed / not_required / blocked |
| 依赖确认标记 | real dependency confirmation marker / N/A |
| Tooling Decision Status | confirmed / delegated_default / existing_stack / scaffold_confirmed / not_required / blocked |
| 工具链确认标记 | real tooling confirmation marker / N/A |

### 候选方案与推荐

> 本节的 Agent recommendation 不是用户确认。新项目 / 空仓库路径必须先在 `brainstorm.md`、`brief.md`、`prd.md`、`requirements.md` 或 `ui-design.md` 留下用户确认、授权默认、已确认脚手架或沿用现有栈证据，再继续填写最终选型。
> 只要本次新增 / 替换直接依赖、SDK、插件、组件库、ORM、驱动、测试库或外部 provider，也必须先有真实依赖确认标记、用户授权默认或已确认脚手架依据。否则停止，不要继续写详细设计。
> 只要本次需要决定或变更包管理器、UI 组件库、样式方案、Python 依赖管理、虚拟环境、构建工具、测试 runner、任务运行器或 monorepo 工具，也必须先有真实工具链确认标记、用户授权默认、沿用现有栈或已确认脚手架依据。

| 维度 | 方案 A | 方案 B | 方案 C | 推荐 | 取舍理由 |
|---|---|---|---|---|---|
| Frontend framework / UI library | | | | | |
| Frontend package manager | npm | pnpm | yarn / bun | | |
| UI component library | | | | | |
| Styling approach | | | | | |
| Backend runtime / framework | | | | | |
| Python dependency / environment manager | uv | Poetry | pip / Conda | | |
| Database / storage | | | | | |
| Jobs / queue / scheduler | | | | | |
| AI / LLM provider / evaluation | | | | | |
| Auth / permission | | | | | |
| Test / verification stack | | | | | |
| Deploy / runtime | | | | | |

### 新增依赖确认

> 只列直接依赖或依赖组。用户已确认的官方脚手架自带依赖可用 `scaffold-bundled` 依赖组记录；额外新增依赖必须单独确认。

| 依赖 / 依赖组 | 类型 | 用途 | 替代方案 | 推荐理由 | 风险 / 许可证 / 安全影响 | 确认来源 |
|---|---|---|---|---|---|---|
| | runtime / dev / SDK / plugin / scaffold-bundled | | | | | |

### 核心决策摘要 Review

> 详细 technical design 初稿完成后，必须先把本节摘要展示给用户确认。确认前不要进入 `sf-tasking`、`sf-spec-review` approval 或 `sf-implement`。无技术影响时写 N/A 和理由。

| 项 | 摘要 | 用户确认 / 来源 |
|---|---|---|
| Core Decision Review Status | pending / confirmed / delegated_default / not_required | |
| 架构选择 | | |
| 新增 / 替换依赖 | | |
| 工具链选择 | | |
| 与现有架构冲突 / 变更 | | |
| 已知最大风险与缓解 | | |
| 进入 tasking 前确认标记 | real tech design review confirmation marker / N/A | |

### 当前版本事实

> 新增 / 替换框架、SDK、云服务、数据库、部署平台、AI provider、测试工具或安全相关依赖时必填。沿用现有项目时写 lockfile / manifest / wiki 证据。

| 项 | 版本 / 事实 | 来源 | 日期 | 对设计的影响 |
|---|---|---|---|---|
| | | 官方文档 / lockfile / package manifest / wiki | | |

### 最终选型与依赖

| 维度 | 最终选择 | 确认来源 | profile / 规则入口 | 回退或替换成本 |
|---|---|---|---|---|
| Frontend | | | | |
| Frontend package manager | | | | |
| UI component library | | | | |
| Styling / CSS | | | | |
| Backend | | | | |
| Backend dependency manager | | | | |
| Database | | | | |
| Jobs / Scheduler | | | | |
| AI / LLM | | | | |
| Auth / Permission | | | | |
| Test / Verification | | | | |
| Deploy / Runtime | | | | |

## 2. 设计摘要

- 设计结论：
- 本次 work item 范围：
- 关键风险：
- 明确不做：

## 3. Requirements Trace

| 需求 / 约束 | 来源 | 技术设计响应 | 验证钩子 |
|---|---|---|---|
| | | | |

## 4. Tech Profile Selection

> 写入前读取 `.specforge/core/profiles/README.md` 和本次影响面涉及的具体 profile。项目已有技术栈以 wiki 和现有代码为准；profile 用于确认沿用、部分采用或偏离。

| 维度 | 选型 | Profile 路径 | 采用范围 | 选用 / 沿用 / 偏离理由 | 验证方式 |
|---|---|---|---|---|---|
| Frontend | | | | | |
| Backend | | | | | |
| Database | | | | | |
| Capability: Content / File / AI / Jobs | | | | | |
| Capability: Architecture / Security / Observability / Testing | | | | | |

## 5. 规则基准与偏离

> 只记录本次影响面实际采用的规则入口。每个规则入口已经内嵌唯一主基准，官方来源见 `.specforge/core/standards/engineering.md#主基准`。没有相关影响面时写 N/A。采用点必须落到设计、任务和验证证据。

| 影响面 | 规则入口 | 主基准 | 官方来源是否已查 | 采用点 | 偏离 / 不适用理由 | 验证证据 |
|---|---|---|---|---|---|---|
| API / SDK / Events | `.specforge/core/standards/engineering.md` / N/A | Microsoft REST API Guidelines | yes / no / N/A | | | |
| Auth / Permission / Security | `.specforge/core/standards/engineering.md` / N/A | OWASP ASVS | yes / no / N/A | | | |
| Delivery / Reliability | `.specforge/core/standards/engineering.md` / N/A | AWS Well-Architected Framework | yes / no / N/A | | | |
| Observability | `.specforge/core/standards/engineering.md` / N/A | OpenTelemetry Semantic Conventions | yes / no / N/A | | | |
| Code Review / Maintainability | `.specforge/core/standards/engineering.md` / N/A | Google Engineering Practices | yes / no / N/A | | | |

## 6. Profile Deviations

| 维度 / Profile | 偏离内容 | 偏离原因 | 风险 | 防护 / 验证 |
|---|---|---|---|---|
| | | | | |

## 7. 总体架构与边界承诺

- 目标架构：
- 责任边界：
- 核心数据流：

| 允许修改 | 禁止修改 | 原因 / 来源 |
|---|---|---|
| | | |

### 架构决策记录 (ADR)

| 决策 | 状态 | 上下文 | 被拒绝方案 | 后果 | 重新审视触发条件 |
|---|---|---|---|---|---|
| | proposed / accepted / rejected / superseded | | | | |

## 8. Frontend Engineering Design

> 只在影响面为 yes 时展开。这里只写前端工程结构、状态、数据流、路由、组件边界；视觉和交互细节链接 `ui-design.md`。

- N/A 理由（如不涉及）：
- 路由与布局：
- 组件边界：
- 状态管理：
- API client / error handling：
- 构建与脚手架：
- 前端验证：

## 9. Backend Engineering Design

> 只在影响面为 yes 时展开。API 契约写第 11 节，数据结构写第 12 节。

- N/A 理由（如不涉及）：
- 模块 / 分层：
- 服务边界：
- 并发、幂等、重试：
- 后台任务 / 调度：
- 错误处理与运行验证：

## 10. Domain Model / State Machine

> 只在新增或修改领域概念、实体、状态机、聚合边界时展开。

- N/A 理由（如不涉及）：
- 核心实体：
- 状态机 / 不变量：
- 聚合 / 上下文边界：
- 领域事件：

## 11. API / Contracts

> 只在新增、修改或废弃 API / SDK / Event / Webhook / 跨系统契约时展开。

- N/A 理由（如不涉及）：

| 调用方 | 提供方 | 接口 / 事件名称 | 协议 | 认证 / 权限 | 兼容性策略 |
|---|---|---|---|---|---|
| | | | | | |

## 12. Data, Storage & Migration

> 只在持久化、索引、迁移、缓存、对象存储、搜索或数据生命周期变化时展开。

- N/A 理由（如不涉及）：
- 关键表结构 / Schema：
- 索引策略：
- 数据生命周期：
- 迁移 / 回填方案：
- 备份与恢复影响：

## 13. Permission, Config, Jobs & Integration Impact

| 影响面 | 变化内容 | 风险 | 验证方式 |
|---|---|---|---|
| Permission / Auth | | | |
| Config / Env | | | |
| Queue / Job | | | |
| Cache | | | |
| External Integration | | | |

## 14. NFRs

- 安全与鉴权：
- 性能与并发：
- 可观测性：
- 可靠性与降级：
- 发布、回滚与运行影响：

## 15. 失败模式与回滚策略

| 失败模式 | 触发条件 | 检测方式 | 缓解 / 降级 | 回滚方式 |
|---|---|---|---|---|
| | | | | |

## 16. 技术验证策略

| 验证层级 | 命令 / 证据 | 覆盖目标 | 通过标准 |
|---|---|---|---|
| Unit | | | |
| Integration | | | |
| Contract | | | |
| E2E / Manual | | | |
| Regression | | | |
