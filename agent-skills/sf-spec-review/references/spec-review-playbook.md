# sf-spec-review 参考手册

本文件保存规格审查的模式选择、必审范围、分项清单、finding 分级和退回路径。`SKILL.md` 只保留入口执行顺序和硬门禁。

## Artifact Review vs Gate Review

| 模式 | 目标 | 输出 | Gate |
|---|---|---|---|
| Artifact Review | 帮用户看某个 artifact 是否有问题 | `02-spec-review/<artifact>-review-v<N>.md` | 不更新 |
| Gate Review | 判断完整 spec 包能否进入 implementation | `02-spec-review/spec-review-v1.md` | 更新 `spec_review` |

Artifact Review 可以在任意时刻执行，但必须写明 scope 和“本次不更新 gate”。Gate Review 必须按 workflow schema 和 components flags 计算必审范围。

## Gate Review 必审范围

先读取 `work.yaml`、workflow schema 和 components flags，不要只凭文件存在判断。

| 条件 | 必审 artifact |
|---|---|
| `feature` / `standard` | `brief.md`、`requirements.md`、`tasks.md` |
| `has_ui` 不是明确 `false` | `ui-design.md` |
| 任一技术影响 flag 不是明确 `false` | `technical-design.md` |
| `refactor` | `technical-design.md`、`tasks.md` |
| `bugfix` / `issue` | `gap-report.md`、`tasks.md`，有技术改动时还要审 `technical-design.md` |

技术影响 flags 包括：`has_api`、`has_db`、`has_domain`、`has_ai`、`has_nfr`、`has_security`、`has_integration`、`has_infra`、`has_background_job`。`auto` 是保守值，视为需要对应 artifact。

## 分项审查清单

### PRD / Brief

- 为什么做、给谁做、MVP 做什么、不做什么、成功如何衡量。
- 候选功能是否让用户选择过，还是 Agent 单方面定稿。
- 高影响未知是否标记为需要用户决策。
- 是否把技术方案写进 PRD，导致 PRD / requirements 边界混乱。
- 路线图是否只表达 `MVP / v1.1 / Later`，没有把 Later 混入本次范围。

### Requirements

- 只写可观察行为，不提前写 UI / API / DB 实现方案。
- 每条需求可测试，有正常路径、异常路径、边界值、权限差异和验收标准。
- PRD 的 MVP 和非目标已完整转译。
- 没有残留 `[NEEDS CLARIFICATION]`、`TBD`、未确认产品决策或需要回到 `sf-brainstorm` 的方案取舍。
- 如果 requirements 触发新增依赖或工具链选择，已留下 `[NEEDS DEPENDENCY DECISION]` / `[NEEDS TOOLING DECISION]` 或确认状态。

### UI Design

- 固定使用 Pencil 作为正式原型证据。
- 有 Visual Style Brief、页面地图、角色流程、状态矩阵、Pencil `.pen`、导出截图和视觉质量修正记录。
- `ui-design.md#9` 记录 Pencil 保存状态、保存后重读校验和截图证据。
- 若声明采用 PC 端业务系统规范，`ui-design.md#4` 必须写明 `.specforge/core/standards/pc-ui-design-spec.md`、核心 token、HTML/CSS 约束和偏离项。
- 参考设计语言被提取并落地，而不是只贴来源。
- 不只是默认控件堆叠；关键状态、权限、响应式和异常态已覆盖。

### Technical Design

- 先做技术影响面矩阵和读取计划。
- 新项目、关键技术变化、新增直接依赖、工具链选择已经用户确认、授权默认、脚手架确认或沿用现有栈。
- 初稿后的核心决策摘要已经由用户确认、用户授权默认，或明确 N/A。
- 新增 / 替换框架、SDK、云服务、数据库、AI provider、测试工具或安全相关依赖时，有当前版本事实或 lockfile / manifest 证据。
- `unknown`、`[NEEDS TECH DECISION]`、`[NEEDS DEPENDENCY DECISION]`、`[NEEDS TOOLING DECISION]` 不在关键路径。
- API、数据、权限、配置、后台任务、可观测性、回滚和验证策略具体可执行。

### Tasks

- 每个任务有核心字段 `_Trace:_`、`_Files:_`、`_Verification:_`、`_Rollback:_`、`_Risk:_`。
- 条件字段 `_Impact:_`、`_Boundary:_`、`_Depends:_`、`_TestCase:_` 在适用任务上出现。
- 有来源覆盖矩阵，所有需求、设计决策和风险都有实现任务与验证任务。
- 有浏览器流程时，单独列出 Playwright 用例、自动操作执行和证据登记任务。
- 不存在范围膨胀、共享写入冲突或把验证藏进实现任务。

## Finding 分级和退回路径

| 等级 | 含义 | Gate 影响 |
|---|---|---|
| `P0` | 方向、范围、必审 artifact、关键安全 / 数据 / 权限 / 生产风险错误 | `REQUEST_CHANGES` 或 `REJECTED` |
| `P1` | 进入 implementation 会造成返工、漏测或风险未闭环 | `REQUEST_CHANGES` |
| `P2` | 不阻断下一阶段，但应在任务或验证中跟进 | 可批准，记录残余风险 |
| `P3` | 表达、组织或维护性建议 | 不阻断 |

Return path 规则：

| 问题类型 | Return to |
|---|---|
| 产品目标、MVP、体验方向、技术路线或验收口径未确认 | `sf-brainstorm` |
| PRD 目标、用户、范围、非目标、指标缺失 | `sf-prd` |
| 需求不可测试、AC 缺失、边界不清 | `sf-requirements` |
| Pencil、状态矩阵、视觉 review 或 UI 确认缺失 | `sf-ui-design` |
| 技术选型、依赖、工具链、版本事实、核心决策 review 缺失 | `sf-tech-design` |
| 任务颗粒度、字段、覆盖矩阵或验证任务缺失 | `sf-tasking` |

## 批准前自检

批准前逐项确认：

- review 文件已写入，不是口头结论。
- Artifact matrix 和 traceability matrix 已填。
- 没有 P0 / P1 finding。
- 所有必审 artifact 存在并通过。
- 所有用户确认门禁都有来源。
- UI / Tech / Tasks 的证据能支撑 implementation。
- `APPROVED` gate 命令带 evidence；非批准命令不带 evidence。
