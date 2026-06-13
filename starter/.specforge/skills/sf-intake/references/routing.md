# sf-intake 路由与分诊参考

本文件保存 `sf-intake` 的分类表、brainstorm 分流、PRD 决策和 follow-up 规则。`SKILL.md` 只保留执行顺序和门禁。

## 分诊顺序

按这个顺序做判断，避免一上来就创建错误类型的 work item：

1. **是否已有 active work item。**
   - 没有：为本次请求创建新 work item。
   - 一个：判断是扩展已有 work item，还是应新开。
   - 多个：先让用户指定，不猜。
2. **是否需要拆分。**
   - 同时包含新增功能 + bugfix + 重构 + 预研时，优先拆成多个 work item。
   - 只有同一个交付目标下的前后端 / UI / 数据 / 测试，才保留在同一个 work item。
3. **选择 work item kind 和 workflow。**
4. **是否需要先做存量项目理解。**
5. **决定是否需要 PRD。**
6. **校准 components flags。**
7. **写 brief，并明确下一步路由。**

## Active work item 判断

如果已有一个 active work item，以下情况必须新建 follow-up work item，不要继续改旧 work item：

- 该 active work item 已经没有 ready artifact。
- 已进入 closure。
- 所有 required gate 已通过。
- 用户是在“刚刚已完成的需求”上讨论遗漏、报错、体验问题、测试漏测、后续增强。
- 用户明确引用 archive 中的历史 work item。

引用 archive 历史 work item 时，在 `relations.parent` 记录原 work item id。

## Workflow 分类表

| 类型 | 触发信号 | workflow | 下一步 |
|---|---|---|---|
| 新增用户能力 / 产品功能 | 新页面、新后台、新 AI 能力、多角色、审批、导入导出 | `feature` | PRD 判断后进入 requirements |
| 通用标准变更 | 不属于 feature / bugfix / refactor / discovery，但风险需要完整规格 | `standard` | PRD 判断后进入 requirements |
| 低风险小改 | 文案、配置、小样式、单点行为，范围清楚且无设计风险 | `lite` | requirements |
| 已确认缺陷 | 有复现、当前行为、期望行为，明确是 bug | `bugfix` | gap_report |
| 未定性问题 | 告警、异常、现象排查，尚未确认代码缺陷 | `issue` | gap_report |
| 行为不变重构 | 解耦、依赖升级、架构整理、性能重构，用户行为不变 | `refactor` | technical_design |
| 纯预研 | Spike、可行性、方案调研、黑盒系统理解，不承诺实现 | `discovery` | research |
| 混合请求 | 跨多个目标或多种性质 | 不直接创建万能 work item | 先拆分 |

## Brainstorm 分流规则

模糊需求、产品型功能、页面 / 全栈应用、AI 能力、运营后台、多角色流程、审批 / 权限 / 数据生命周期相关需求，都不能只由 Agent 自己推理后进入 requirements。先路由到 `sf-brainstorm` 做一轮轻量但真实的用户参与式 brainstorm。

Brainstorm 深度必须写入 `brief.md#Brainstorm 决策`：

| 模式 | 触发 | 处理 |
|---|---|---|
| `deep` | `workflow=discovery`；或 `needs_research=true`；或 feature/standard 中存在高风险产品、UI、技术路线、依赖、工具链、AI provider、数据生命周期取舍 | `sf-brainstorm` 先做 Phase 1 发散，再做 Phase 2 聚焦 |
| `light` | feature/standard/lite 中存在少量用户取舍，但不需要外部研究或大范围探索 | `sf-brainstorm` 直接列 2-3 个互斥方案并请求确认 |
| `skip` | bugfix 已有复现和期望；lite 小改范围清楚；refactor 已由用户明确目标；需求已有等价规格 | 记录跳过理由，继续对应 artifact |

不要只写“看起来复杂 / 看起来简单”。必须用 workflow、components、`needs_research`、风险项或 blocker 类型解释分级。

## 存量项目前置判断

如果仓库已有业务代码，但 `.specforge/wiki/01-project-overview.md` 或 `.specforge/wiki/03-architecture.md` 仍是空模板、明显过期，或没有覆盖本次请求涉及的模块/API/数据域，先路由到 `sf-steering`。

可直接继续 intake 的情况：

- 本次是空仓库新建项目。
- wiki 已能说明相关模块职责、入口、API、数据和运行方式。
- 用户请求是完全独立的新模块，且 brief 中明确不会触碰既有代码。

必须先 `sf-steering` 的情况：

- 大型或多模块存量项目首次接入。
- 用户只说“在现有系统里加一个功能 / 修一个问题”，但未指定相关模块。
- 需求涉及权限、审批、数据迁移、定时任务、第三方集成或生产运行链路，而 wiki 没有对应事实。
- `codebase-index.mjs` 显示 `blocked_large_without_provider`，且没有目标模块。

## Follow-up / 回归问题规则

已完成或已归档的 work item 是历史证据，不能继续被当成 active scope 修改。用户在完成后再次讨论“刚刚那个需求还有问题”“遗漏了某个功能”“提交时报错”“UI 不好看”“测试没覆盖出来”时，按新 work item 处理：

| follow-up 类型 | workflow | kind | 例子 |
|---|---|---|---|
| 已实现功能出现错误或不符合已批准规格 | `bugfix` | `bugfix` | 提交审批 400、下载失败、权限绕过 |
| 现象尚未确认根因 | `issue` | `issue` | 页面偶发空白、配置状态不一致 |
| 原需求遗漏的新能力 / 新状态 / 新流程 | `feature` 或 `standard` | `feat` | 新增批量操作、补审批撤回 |
| 体验质量或 UI 改版 | `standard` / `feature` | `feat` | UI 太丑、需要重新设计后台风格 |
| 测试体系补强 | `standard` / `lite` | `chore` | 补 Playwright 覆盖矩阵 |

创建时用关联字段保留历史关系：

```bash
node .specforge/core/scripts/create-work.mjs --workflow bugfix --kind bugfix --parent <previous-work-id> --relation follow_up "修复提交审批 400"
```

## PRD 决策

需要 PRD 的情况：

- 产品型功能：新工具、新后台、全栈应用、AI 能力、运营平台、面向多角色的功能。
- 用户只给了高层目标，尚未明确目标用户、MVP、成功标准、路线图或功能候选。
- 涉及 AI 质量、审批上线、权限、数据生命周期、任务调度、结果交付等产品决策。
- 用户明确希望先设计产品方案或 PRD。

可以跳过 PRD 的情况：

- bugfix、issue、纯 refactor、纯 discovery。
- lite 小改，目标和验收标准已经清楚。
- 已有 PRD / 业务规格，且 brief 已把 MVP 和边界摘录清楚。

在 `brief.md#PRD 决策` 中写：

- `PRD required: yes / no`
- `PRD depth: N/A / prd-lite / prd-standard / prd-deep`
- `Reason`
- `Blocking product decisions`
- `Next route: sf-brainstorm / sf-prd / sf-requirements / sf-discovery / sf-tech-design`

## Components flags

未确定的组件 flag 保持 `auto`，表示保守保留对应 artifact；明确为 `false` 时，后续 artifact graph 会跳过对应阶段。

| Flag | 判断 |
|---|---|
| `has_ui` | 是否有用户可见 UI / 页面 / 交互 |
| `has_api` | 是否涉及 HTTP API、RPC、SDK、事件或 webhook 契约 |
| `has_db` | 是否涉及数据库、迁移、索引、持久化模型或数据导入导出 |
| `has_domain` | 是否涉及领域模型、权限状态机、审批流、任务生命周期或核心业务规则 |
| `has_ai` | 是否涉及 AI 分类、生成、提示词、评估、模型调用、置信度或人工复核 |
| `has_nfr` / `has_security` / `has_integration` / `has_infra` / `has_background_job` | 是否涉及非功能、安全、第三方集成、部署或后台任务 |
| `needs_research` | 是否需要在 requirements 前插入外部研究 artifact |
