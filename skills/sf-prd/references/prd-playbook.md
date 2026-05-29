# sf-prd 参考手册

本文件保存 PRD 深度、第三方 skill 编排、访谈镜头、PRD 模板和质量标准。`SKILL.md` 只保留入口执行顺序、门禁和产物边界。

## PRD 深度

| 深度 | 适用 | 输出要求 |
|---|---|---|
| `prd-lite` | 内部小工具、低风险单流程、已有明确 MVP | 保留摘要、目标用户、MVP、验收种子、开放问题 |
| `prd-standard` | 常规产品功能、后台能力、AI 工具、全栈应用 | 使用完整 PRD 结构 |
| `prd-deep` | 多角色、多流程、审批/计费/合规/AI 质量/高风险上线 | 完整 PRD + 决策日志 + 分阶段 roadmap + 风险 owner |

深度写入 `prd.md` 的 `PRD Depth` 字段，并说明理由。

## 第三方 PRD Skill 编排

第三方 PRD skill 是分析参考，不是 SpecForge 的产物格式。先按 `.specforge/core/skills/ORCHESTRATION.md` 选择 skill 和写回目标，再用 `registry.json` 确认来源与风险。

| 第三方 skill | 什么时候参考 | 必须归一化到 |
|---|---|---|
| `create-prd` | 上下文已经较完整，需要把问题、目标用户、价值主张、范围、假设和 release 分期合成 PRD | `Executive Summary`、`Background & Product Goals`、`Scope & MVP`、`Handoff To Requirements` |
| `opportunity-solution-tree` | 问题空间还散、用户给的是方案而不是问题、候选功能过多或需要优先级取舍 | 用户机会、候选功能池、实验假设、MVP 取舍 |

归一化规则：

- 第三方 skill 的“问题 / 方案 / 用户故事”只能作为候选，必须映射到 SpecForge PRD 模板。
- 第三方 skill 的技术建议只允许进入 `Handoff To Requirements` 或 `Notes for technical_design`，不得在 PRD 中展开接口、表结构或文件路径。
- 第三方 skill 要求“保存到 PRD-*.md / 提交 GitHub issue / 生成 HTML battlecard / 写 DESIGN.md”时，一律忽略该投递动作。
- 外部调研类内容必须记录来源、日期和置信度；无来源的市场判断只能写为假设或待确认。
- 如果第三方 skill 输出与用户原始需求冲突，以用户确认和 SpecForge 边界为准。

在 `prd.md#0. PRD Control` 记录本次参考了哪些第三方 skill、参考原因和归一化位置。

## 自适应产品访谈

写 PRD 前，先判断是否缺少会改变产品方向的信息。缺口存在时，向用户提出少量高价值问题；不要为了填表机械追问。

流程：

1. 先列出 `已确认事实 / 高影响未知 / 可默认假设`。
2. 从下方“访谈镜头”中按需选择 3-6 个镜头，不要全量展开。
3. 为每个高影响未知给出 2-4 个互斥选项、推荐项和取舍影响；如果问题需要多方案取舍，先路由到 `sf-brainstorm` 并落档 `00-intake/brainstorm.md`。
4. 问题数量不设硬上限；有多少会改变 PRD 的高影响未知，就问多少，但要分轮收敛。
5. 每轮只问当前最影响 PRD 的问题或一小组强相关问题；优先单问，只有同一决策面上的问题才合并。
6. 每轮都要解释“为什么这些问题会改变 PRD”，并在用户回答后更新已确认事实、假设和未决问题。
7. 低风险未知可以写入 Assumption Ledger，不阻塞；高风险未知必须暂停。

| 镜头 | 触发信号 | 要澄清的产品决策 |
|---|---|---|
| Problem / Outcome | 目标宽泛、痛点不清 | 为什么做、失败成本、第一版成功标准 |
| User / Role | 多角色、管理员、审批、权限 | 谁使用、谁审批、谁运营、谁承担风险 |
| Workflow / State | 审批、上线、调度、异步、长任务 | 状态机、入口出口、异常恢复、人工介入 |
| Data Lifecycle | 上传、导入导出、批处理、报表 | 数据来源、格式、保留周期、结果去向 |
| AI Quality | LLM、分类、生成、提示词、自动化判断 | 输入输出、可配置策略、评估、人工复核、成本 |
| UI / Experience | 页面、后台、配置台、操作效率 | 页面范围、体验姿态、视觉风格种子、关键状态 |
| Integration / Ops | 第三方服务、通知、CI、部署、任务执行 | 外部依赖、失败告警、重试、灰度和回滚 |
| Risk / Compliance | 敏感数据、安全、审计、生产影响 | 权限、安全、审计、合规、责任 owner |
| Roadmap / Packaging | 候选功能过多、多个目标 | MVP、可选增强、后续版本、拆 work item |

当 brief 已经包含足够信息时，不要重复询问。核心问题、目标用户、MVP 边界、影响上线风险的角色/数据/AI 质量决策缺失时必须暂停。

## 候选功能池与范围裁剪

- 先给候选功能池，而不是直接替用户定 MVP。
- 每个候选项都写清“用户价值 / 复杂度 / 风险 / 默认建议 / 为什么”。
- 梳理主要用户流程，但不画 UI 线稿，UI 交给 `sf-ui-design`。
- 识别隐藏依赖：权限、数据来源、审批、通知、计费、AI 服务、运营流程、导入导出、审计等。
- 拆分 `MVP / 可选增强 / 后续版本`，并标明每项功能的用户价值、复杂度、风险和默认建议。
- 明确非目标，防止后续 requirements 和 implementation 越界。
- 如果需求明显跨多个独立交付目标，建议拆成 roadmap 或多个 work item。

## PRD 模板

优先使用 `.specforge/core/artifacts/templates/prd.md`。没有内容的章节写 `N/A` 并说明原因，不要留空。

```markdown
# PRD: <产品 / 功能名称>

## 0. PRD Control
- PRD Depth:
- Source Work Item:
- Decision Status:
- Assumptions:
- External Skill Inputs:
  - skill / trigger / normalized_to / notes:

## 1. Executive Summary
- Problem Statement:
- Proposed Solution:
- Target Users:
- Success Criteria:

## 2. Background & Product Goals
- 背景:
- 当前痛点:
- 产品目标:
- 非目标:

## 3. Users, Personas & Scenarios
| 用户 / 角色 | 目标 | 当前痛点 | 典型场景 | 权限 / 责任 |
|---|---|---|---|---|

## 4. Scope & MVP Decision
| 功能 | 阶段 | 用户价值 | 复杂度 | 风险 / 依赖 | 决策 |
|---|---|---|---|---|---|

## 5. Product Interview Evidence
| Lens | Confirmed Facts | Open Decisions | Default Assumption |
|---|---|---|---|

## 6. User Stories & Acceptance Seeds
| ID | User Story | Acceptance Seed | Priority |
|---|---|---|---|

## 7. Core User Flows
- Flow:
  1.
  2.
  3.
- Exceptions:

## 8. Metrics, Evaluation & Analytics
- Product KPIs:
- Quality Metrics:
- Operational Metrics:
- Tracking / Evidence:

## 9. AI System Requirements (If Applicable)
- AI Task:
- Inputs / Outputs:
- Prompt or Policy Controls:
- Evaluation Strategy:
- Human Review / Override:
- Safety, Privacy & Cost Boundaries:

## 10. Constraints, Dependencies & Risks
| Item | Type | Impact | Mitigation / Owner |
|---|---|---|---|

## 11. Rollout & Roadmap
- MVP:
- v1.1:
- Later:
- Rollback / Disable Strategy:

## 12. Open Questions & Decisions
| Question | Owner | Needed By | Status |
|---|---|---|---|

## 13. Handoff To Requirements
- Requirements seeds:
- Recommended components flags:
- Notes for ui_design:
- Notes for technical_design:
```

## Handoff 规则

- `Requirements seeds` 写可转译为 `sf-requirements` 的行为候选，不写 EARS 规格全文。
- PRD 中的 `Acceptance Seed` 只是验收种子，不是最终 AC 编号；最终验收标准必须由 `sf-requirements` 重新转写为可观察行为、边界值、异常态和验证方式。
- `Recommended components flags` 只记录建议；如果 PRD 明确改变影响面，再同步更新 `work.yaml` 的 `components` 并说明原因。
- `Notes for ui_design` 只写页面范围、体验目标、风格偏好和必须覆盖的状态。
- `Notes for technical_design` 只写业务约束、集成边界、数据/权限/审批等产品层约束，不写架构方案。

## 质量标准

- 用具体、可度量的表达，避免“快速、简单、智能、现代化、好用”这类不可验收词。
- 成功指标至少包含 1 个用户价值指标；涉及 AI 时还要包含质量评估指标，例如准确率、人工抽检通过率、拒答率、成本上限或处理时延。
- 每个 MVP 功能必须能追溯到目标用户和核心问题。
- PRD 必须展示“用户可选择的候选项”和“最终为什么选这些”，不能只给一个 Agent 单方面决定的功能清单。
- 高影响未知必须进入 `Open Questions & Decisions`，低风险默认必须进入 `Assumptions`。
- 每个非目标都应解释为什么现在不做。
- 不知道的约束写 `TBD`，不要编造技术栈、预算、外部依赖或上线日期。
- PRD 可以记录已知硬约束，例如“必须使用现有 SSO”，但不得展开接口契约、数据库表结构或实现方案。
- PRD 不写最终需求编号、API 字段、数据库字段、文件路径、组件拆分、测试命令或实现任务。

表达示例：

```diff
- 系统要支持高效上传并智能识别用户意图。
+ 客服运营人员可上传不超过 200MB 的 txt 会话文件，并在 30 分钟内获得按意图分类的 CSV 结果。
+ AI 意图识别抽检准确率目标 >= 90%，无法判断的记录必须进入人工复核队列。
```
