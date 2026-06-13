---
name: technical-design
description: SpecForge 内部技术设计技能。用于根据 requirements 和可选 UI design 生成前端架构、后端架构、API、数据、权限、配置、NFR 和验证策略。
---

# Technical Design Skill

本技能只处理工程实现设计。UI 页面结构、线稿、视觉风格和交互状态由 `ui-design` 负责；本技能可以引用 `01-spec/ui-design.md`，但不要复制整套 UI 设计。

## 读取

- `00-intake/brief.md`
- `01-spec/requirements.md`
- `01-spec/ui-design.md`（存在时）
- `.specforge/wiki/00-index.md` 和本次相关 wiki
- `.specforge/core/standards/product.md`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/engineering.md`
- `.specforge/core/standards/ai-toolkit.md`
- `.specforge/core/profiles/README.md`
- 按影响面读取内部设计子模块；不要默认全量读取：
  - 前端工程、路由、组件、状态、API client 或构建：`.specforge/skills/sf-tech-design/stages/technical-design/frontend-design.md`
  - 后端模块、服务边界、后台任务、并发或幂等：`.specforge/skills/sf-tech-design/stages/technical-design/backend-design.md`
  - 领域模型、实体或边界上下文：`.specforge/skills/sf-tech-design/stages/technical-design/domain-design.md`
  - API、SDK、事件或跨系统契约：`.specforge/skills/sf-tech-design/stages/technical-design/api-design.md`
  - DB、Schema、索引、迁移或数据流：`.specforge/skills/sf-tech-design/stages/technical-design/data-design.md`
  - 安全、可观测性、部署或可靠性：`.specforge/skills/sf-tech-design/stages/technical-design/nfr-design.md`

## 写入

- `01-spec/technical-design.md`

## 设计流程

1. 建立技术影响面矩阵：frontend、backend、domain、API、data、auth/security、config/delivery、jobs、observability、reliability。
2. 把每个影响面标成 `yes / no / unknown`：
   - `no` 必须写跳过理由。
   - `unknown` 如果会改变架构、数据、安全、成本或上线风险，停止并向用户澄清。
   - 低风险未知可以写入 assumptions，但必须说明后续验证点。
3. 生成读取计划：先列本次实际读取的 wiki 入口、代码入口、上游 / 下游和缺口，再列实际读取的子模块、profiles 和官方基准入口。
   - 存量项目只沿 wiki 指向的模块、API、数据、测试和运行链路读取代码。
   - wiki 缺入口、过期或与代码冲突时，停止并路由 `sf-steering`，不要在本阶段临时全量探索。
4. 无技术影响时，写 N/A 结论：例如纯文案、纯 UI 视觉调整、无工程改动的配置说明，并说明验证方式。
5. 建立需求追踪表，确保关键需求能落到技术方案或明确不适用。
6. 执行技术选型全量访谈协议。该门禁发生在详细 technical design 之前；未确认时只输出分批确认卡并停止，不继续展开架构、API、数据、NFR 或任务拆解：
   - **铁律：任何 `[NEEDS TECH/DEPENDENCY/TOOLING DECISION]` 维度未确认 → 不得写架构设计正文。**
   - **第一步：影响面扫描**（内部，不输出给用户）：先从 requirements / brief / wiki 判断哪些维度适用（前端、后端、数据库、队列/任务、AI/LLM、文件存储、部署、测试栈等），并标记为 `reuse`、`confirmed` 或 `pending`。
   - **第二步：生成分批确认卡**（只包含 pending 维度，每批等用户确认后再输出下一批）：
     - 第一批：架构级决策（部署平台、后端运行时、数据库、认证方案）。
     - 第二批：前端工程（前端框架、包管理器、UI组件库、样式方案、状态管理、表单验证）。
     - 第三批：测试栈与工程工具（单元/集成测试、E2E测试、API测试、CI/CD）。
   - **第三步：新增依赖与工具链确认卡**：超出 profile 推荐范围的新增依赖需单独确认。
   - 未经确认的关键技术、新增依赖、工具链分别标记为 `[NEEDS TECH DECISION]`、`[NEEDS DEPENDENCY DECISION]`、`[NEEDS TOOLING DECISION]`。
   - 用户确认后，在上游/本级 artifact 写入 `[TECH DECISION CONFIRMED]` / `Tech Direction Status: confirmed`，新增依赖写入 `[DEPENDENCY DECISION CONFIRMED]`，工具链写入 `[TOOLING DECISION CONFIRMED]`（或对应的 `delegated_default` / `existing_stack` 状态）。

7. 执行当前版本事实检查：
   - 新增 / 替换框架、SDK、云服务、数据库、部署平台、AI provider、测试工具或安全相关依赖时，必须查询当前官方文档或项目锁文件中的版本事实。
   - 记录 `version / source / date / decision impact`；无法联网或资料不足时写风险和待确认项。
   - 只是沿用现有项目版本时，记录证据路径，例如 lockfile、package manifest、wiki 或代码入口。
8. 选择 Tech Profiles，说明采用、部分采用或偏离理由；项目已有技术栈以 wiki 和代码事实优先。
9. 对齐规则主基准：按影响面使用对应规则入口内的唯一主基准，并写清采用点、偏离理由和验证证据；无相关影响面时写 N/A。
10. 填写 `Design Quality Gate`，确认设计规模、现有架构复用、新增依赖确认、更简单方案、契约可测试性和 tasks 可拆性。
11. 中高风险或长期架构决策写 ADR 摘要；低风险小改写 N/A 和理由。
12. 按影响面展开工程设计，只展开 `yes` 的章节；`no` 的章节保留一行 N/A，不写空表：
   - 前端工程结构、路由、组件边界、状态管理、API client。
   - 后端模块、服务边界、后台任务、并发和幂等。
   - 领域模型、实体、状态机和边界上下文。
   - API / SDK / 事件契约、鉴权和兼容性。
   - 数据库、索引、迁移、缓存和生命周期。
   - 配置、部署、可观测性、可靠性和回滚。
13. 明确写入范围、禁止范围、失败模式和验证策略。
14. 对高风险方案写备选方案和取舍理由。
15. **初稿后核心决策 Review**：详细 technical design 初稿完成后，先向用户展示核心决策摘要并等待确认；确认前不得进入 tasking、spec_review approval 或 implementation。
   - 摘要必须包含架构选择、新增 / 替换依赖、工具链选择、与现有架构冲突 / 变更、已知最大风险与缓解。
   - 用户确认后写入 `Core Decision Review Status: confirmed` 或表格项 `Core Decision Review Status | confirmed`，并保留 `[TECH DESIGN REVIEW CONFIRMED]`。
   - 用户授权默认时写 `delegated_default`，无技术影响时写 `not_required` 和 N/A 理由。

## 停止条件

- `instructions.mjs` 返回 `tech-direction-unconfirmed`，或新项目 / 空仓库路径没有用户确认的技术栈、数据库、调度器、AI provider、部署或依赖方向。
- `instructions.mjs` 返回 `dependency-decision-unconfirmed`，或本次新增 / 替换直接依赖、SDK、插件、组件库、ORM、驱动、测试库、浏览器自动化库、外部 provider 但没有用户确认、用户授权默认或已确认脚手架依据。
- `instructions.mjs` 返回 `tooling-decision-unconfirmed`，或本次选择 / 替换包管理器、UI 组件库、样式方案、Python 依赖管理 / 虚拟环境、构建工具、测试 runner、任务运行器、monorepo 工具但没有用户确认、用户授权默认、沿用现有栈或已确认脚手架依据。
- requirements 仍有阻断歧义。
- 存量项目 wiki 无法给出本次相关入口、边界或上下游，且需要触碰既有代码。
- 新项目或新增 / 替换关键技术时，技术选型没有用户确认、用户授权默认或可信的“沿用现有栈”证据。
- 新增直接依赖、SDK、插件、组件库、ORM、驱动、测试库或浏览器自动化库时，没有用户确认、用户授权默认或已确认脚手架依据。
- 技术选型没有 profile、备选方案或偏离理由。
- 新增 / 替换技术或依赖缺少当前版本事实、官方资料、lockfile 证据或明确风险说明。
- 涉及 API、安全、运行可靠性或可观测性，但没有说明规则主基准采用点。
- API、数据迁移、权限或生产风险缺少验证路径。
- `technical-design.md#0. 影响面与读取计划` 仍有会改变架构或上线风险的 `unknown`。
- `technical-design.md` 仍残留 `[NEEDS TECH DECISION]`。
- `technical-design.md` 仍残留 `[NEEDS DEPENDENCY DECISION]`。
- `technical-design.md` 仍残留 `[NEEDS TOOLING DECISION]`。
- `technical-design.md` 的 `Core Decision Review Status` 不是 `confirmed`、`delegated_default` 或 `not_required`。
- 设计需要超出已批准边界。
- 外部版本、框架或 SDK 行为不确定且未查询当前资料。

## 完成标准

- `technical-design.md` 能让实现者按边界开工。
- 存量项目的读取计划包含 wiki 入口和 bounded code context，不要求实现者重新全仓定位。
- reviewer 能判断实现是否偏离架构、接口、数据或安全要求。
- 关键技术选型和新增直接依赖都有确认来源：现有项目证据、用户明确指定、用户授权默认、已确认脚手架或用户确认候选方案。
- `Design Quality Gate` 能证明本设计最小充分、契约可测试、没有未确认新增依赖。
- 初稿后的核心决策摘要已经被用户确认、用户授权默认，或明确 N/A。
- tasks 可以从本文件和可选 `ui-design.md` 拆出可验证工作单元。
- UI 细节只引用 `ui-design.md`，不在本文件重复维护。
