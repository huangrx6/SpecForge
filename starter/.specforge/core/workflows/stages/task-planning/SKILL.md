---
name: task-planning
description: SpecForge 内部任务规划技能。用于 requirements、gap_report 或 technical_design 完成后生成 01-spec/tasks.md，拆解追踪来源、边界、依赖、验证和并行波次。
---

# Task Planning Skill

本技能把上游规格拆成可执行任务图。任务不是待办愿望，而是 implementation、code_review 和 verification 共享的检查清单。

## 读取

- `work.yaml`
- `00-intake/brief.md`
- `00-intake/prd.md`（存在时）
- `01-spec/requirements.md`（feature / standard / lite）
- `01-spec/gap-report.md`（bugfix / issue）
- `01-spec/research.md`（存在时）
- `01-spec/ui-design.md`（存在且适用时）
- `01-spec/technical-design.md`（存在且适用时）
- `.specforge/wiki/00-index.md` 和上游 artifact 引用的相关 wiki
- `.specforge/core/artifacts/schemas/<workflow>.json`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/product.md`
- `.specforge/core/standards/ai-toolkit.md`
- `.specforge/core/standards/design.md`（存在 UI 影响时）
- `.specforge/core/standards/pc-ui-design-spec.md`（`ui-design.md` 声明采用 PC 端业务系统规范时）
- `.specforge/core/standards/engineering.md`
- `.specforge/core/profiles/README.md`（存在技术选型时）

## 写入

- `01-spec/tasks.md`

## 输入选择规则

| Workflow / 条件 | 必须追踪到 |
|---|---|
| `feature` / `standard` | requirements，适用的 ui_design / technical_design |
| `lite` | requirements |
| `bugfix` / `issue` | gap_report 的复现、根因、修复策略、回归测试 |
| `refactor` | technical_design 的目标架构、边界、风险和回归验证 |
| `needs_research: true` 或已有 research | research 的决策、约束和未解决问题 |

`components` 为 `auto` 时保守保留对应任务通道。只有明确 `false` 且上游 artifact 能证明不涉及时，才跳过 UI 或技术任务。

## 拆解流程

1. **建立来源审计矩阵**：列出所有来源需求、决策、风险和验收标准，确认每项至少有实现任务和验证任务。来源必须包含适用的 `GOAL / PRD / REQ / UI / TECH / RESEARCH / CONTEXT`，不能只写“见上游文档”。
2. **建立技术影响面任务覆盖**：读取 `technical-design.md#0. 影响面与读取计划` 及其 wiki 入口，把每个 `yes` 影响面映射到实现任务和验证任务；`no` 写 N/A 理由；关键 `unknown` 退回澄清。
3. **先列失败优先 / 契约任务**：API、schema、类型、配置、迁移、权限、提示词、评估集、feature flag、环境变量。行为变更优先设计能先失败的测试或检查。
4. **再列基础任务**：新项目脚手架、开发服务器冒烟、目录结构、共享客户端、测试基线。
5. **再列实现任务**：按模块、层次、用户路径或状态机拆分。每个任务应小到一次实现和一次 review 可以聚焦完成。
6. **再列验证任务**：单元、集成、契约、E2E、页面 × 操作 × 角色矩阵、启动验证、回归验证、人工证据。采用 PC 端业务系统规范时，必须包含 token、布局尺寸、表格 / 表单 / 弹窗 / 抽屉、SVG 图标和响应式验证任务。
7. **最后列运行任务**：配置、迁移、回滚、可观测性、告警、发布检查和 Wiki 回写提示。
8. 标注依赖关系和并行波次。并行任务必须有不同主要写入边界。
9. 填写任务图与执行策略：任务依赖、可并行性、主要写入边界、交付物、review 焦点和多 worker 禁止同时修改的文件。

## 任务格式要求

每个任务必须包含核心字段：

- `_Trace:_` 指向 requirements / gap_report / ui_design / technical_design / research 的具体条目或章节。
- `_Files:_` 写预计写入的文件、目录或模块类别；不能只写“相关文件”。
- `_Verification:_` 写可执行命令、测试类型、人工检查或后续 verification 证据。
- `_Rollback:_` 写撤回、补偿、配置回退、feature flag 或 N/A 理由。
- `_Risk:_` 写本任务风险和防护；低风险任务写 `N/A - <理由>`，不能留空。

条件字段按任务性质添加：

- `_Impact:_` 涉及 technical_design 影响面、或需要证明技术影响面覆盖时必填；纯产品 / bugfix 无技术设计时可省略或写 N/A。
- `_Boundary:_` 并行任务、跨模块任务、共享契约、迁移、配置或容易写入冲突的任务必填；单文件小任务可省略或写 N/A。
- `_Depends:_` 有依赖顺序时必填；无依赖可省略或写 `none`。
- `_TestCase:_` 已有或需要 `05-verification/test-cases.md`、Playwright、权限、边界或回归矩阵时必填；无测试用例时写为什么 N/A。

任务描述要具体，不写“处理相关逻辑”“完善页面”“补充测试”这类空话。

存量项目任务的 `_Files:_` 和 `_Boundary:_` 应优先来自 wiki 或 technical design 的入口路径、模块边界和上下游；如果只能写“待全仓搜索”，说明上游上下文不足，应退回 `sf-tech-design` 或 `sf-steering`。

## 并行规则

- 并行任务不得共享同一主要写入文件。
- 可并行任务必须显式标记 `[P]` 或在任务图中说明；未标记时默认串行。
- 共享契约、schema、类型、迁移、环境变量必须先完成再并行实现。
- 验证任务不能藏在实现任务里。
- `technical-design.md` 残留 `[NEEDS TECH DECISION]`、`[NEEDS DEPENDENCY DECISION]` 或 `[NEEDS TOOLING DECISION]` 时停止，退回 `sf-tech-design` 确认选型、新增依赖或工具链，不生成任务。
- `technical-design.md` 的 `Core Decision Review Status` 不是 `confirmed`、`delegated_default` 或 `not_required` 时停止，退回 `sf-tech-design` 展示核心决策摘要并等待用户确认。
- 存在需要用户取舍的 `[NEEDS DECISION]`、`[NEEDS PRODUCT DECISION]` 或 `[NEEDS UI DECISION]` 时停止，退回 `sf-brainstorm`，不生成任务。
- UI 状态、API 契约、数据迁移、权限、安全、发布任务必须单独列出。
- 有浏览器流程、上传、提交、审批、下载、权限或错误提示时，必须列出 Playwright E2E 用例设计、脚本执行和证据登记任务；不能只列单元测试或人工验证；不得把 Playwright 写入"不在范围"。
- 有 UI / 浏览器流程时，必须先生成 `05-verification/test-cases.md` 的测试用例任务，再生成执行任务；执行任务要覆盖**所有读取或展示该数据的页面**（列表页、表单页、详情页等，不得遗漏）；覆盖成功、失败、权限、边界和响应式中适用项。
- `ui-design.md` 声明采用 PC 端业务系统规范时，任务必须承接 `pc-ui-design-spec.md` 的核心约束：顶栏 / 侧栏尺寸、字体、颜色 token、控件高度、表格行高、弹窗 / 抽屉、图标和 HTML/CSS token。
- 对多个 agent / worker 友好的任务，要明确“谁拥有哪些文件或模块”。

## 必含任务类型

按适用性选择，不适用时在 Coverage Matrix 里写 N/A：

| 类型 | 什么时候必须出现 |
|---|---|
| 脚手架 / 启动基线 | 新项目、新前端 / 后端子项目、构建链变化 |
| 契约 | 有 API、事件、SDK、schema、类型、prompt 或配置契约 |
| 数据 / 迁移 | 有数据库、索引、导入导出、文件存储或数据生命周期变化 |
| 安全 / 权限 | 有登录、角色、审批、文件上传、外部集成、AI 调用或敏感数据 |
| UI 状态 | 有用户可见页面、交互状态或视觉风格确认 |
| 可观测性 / 可靠性 | 有后台任务、并发、调度、队列、生产发布或故障恢复要求 |
| 验证 | 所有非 discovery workflow |
| Wiki 回写提示 | 会改变长期架构、产品规则、数据模型、运行方式或术语 |

## 停止条件

- 适用的 ui_design / technical_design 不足以拆任务，且不是被 components 合法跳过。
- bugfix / issue 缺少根因、修复策略或回归测试方向。
- refactor 缺少行为不变边界或回归验证策略。
- technical_design 中存在会影响架构、数据、安全、成本、外部契约、发布或可靠性的 `unknown`。
- 上游存在未确认的产品、体验或技术路线取舍。
- technical_design 的 `yes` 影响面缺少实现任务或验证任务承接。
- 存量模块缺少 wiki 入口、读取计划或可执行文件边界。
- 任务会扩大写入范围。
- 验收标准没有验证任务承接。
- 存在未解决的契约、数据迁移、安全或发布风险。

## 完成标准

- tasks 能驱动 implementation。
- 每个任务都有追踪来源、预期文件、验证、回滚和风险；边界、依赖、影响面和测试用例在适用任务上完整。
- 每个任务都有预期写入文件边界和回滚提示；数据、权限、发布、依赖和迁移任务的回滚不能为空。
- 任务图说明依赖、并行边界、交接证据和 review 焦点，多 agent 执行时不会争用核心文件。
- 存量项目任务有可追溯的 wiki 入口，或明确说明本次为何不适用。
- 每个 technical_design `yes` 影响面都有任务承接；`no` / N/A 有可信理由；无关键 `unknown` 留到实现阶段。
- reviewer 可以用 tasks 判断实现是否完整。
- verification 可以直接从 tasks 列出验证矩阵。
