---
name: sf-prd
description: 生成或更新产品需求文档（PRD）；用于产品型 work item、AI 功能、后台工具、全栈应用或高层模糊需求在 requirements 前明确核心问题、目标用户、功能候选、MVP 边界、成功指标、风险和路线图时。
---

# sf-prd

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 brief 的分析结论升级为可对齐产品、设计与工程的 PRD。它的受众是产品决策者、业务负责人、设计负责人和工程负责人，不是实现者。

`sf-prd` 是 requirements 之前的产品澄清产物，不是 artifact graph 的固定阶段，也不替代 `sf-requirements`。PRD 回答“为什么做、给谁做、第一版交付哪些价值、哪些先不做”，requirements 回答“系统必须表现出哪些可测试行为、边界和验收标准”。

PRD 不是固定问卷。它是一份产品决策文档：先识别当前需求最可能出错的决策点，再用少量高价值问题、候选功能池和可防守假设，把模糊想法推进到可进入 requirements 的状态。

## 启动

1. 从当前目录向上找到项目根，并运行：

```bash
node .specforge/core/scripts/status.mjs
node .specforge/core/scripts/doctor.mjs
```

2. 找到唯一 active work item，读取：
   - `00-intake/original-request.md`
   - `00-intake/brief.md`
   - `00-intake/brainstorm.md`（如果存在）
   - 已存在的 `00-intake/prd.md`（如果是更新 PRD）
   - `.specforge/core/artifacts/templates/prd.md`
   - `.specforge/wiki/` 中与产品、用户、业务、竞品、设计系统或既有架构相关的长期事实。
3. 如果存在多个 active work item，先让用户指定目标；不要把 PRD 写到猜测的目录里。

## 内部技能母本

写 PRD 前，读取 `.specforge/core/workflows/stages/brainstorm/SKILL.md` 和 `.specforge/core/workflows/stages/discovery/SKILL.md` 中关于候选功能池和用户确认的章节，确保 PRD 的功能边界已经过用户选择，不是 Agent 单方面假设。

## 关联标准

- `.specforge/core/standards/product.md`：PRD 决策、自适应访谈、功能候选、MVP、目标和指标。
- `.specforge/core/standards/design.md`：用户流程和体验方向。
- `.specforge/core/standards/workflow.md`：非目标、scope 和中文协作。
- `.specforge/core/skills/ORCHESTRATION.md`：第三方 PRD skill 的阶段编排、加载上限和写回规则。
- `.specforge/core/skills/README.md`：第三方 PRD skill 的触发、用途和归一化要求。
- `.specforge/core/skills/registry.json`：已安装第三方 PRD skill 的来源、风险和输出映射。

## 工作流程

### 1. 选择 PRD 深度

先根据 brief 和 work item 风险选择深度，不要所有需求都写成重型 PRD：

| 深度 | 适用 | 输出要求 |
|---|---|---|
| `prd-lite` | 内部小工具、低风险单流程、已有明确 MVP | 保留摘要、目标用户、MVP、验收种子、开放问题 |
| `prd-standard` | 常规产品功能、后台能力、AI 工具、全栈应用 | 使用完整 PRD 结构 |
| `prd-deep` | 多角色、多流程、审批/计费/合规/AI 质量/高风险上线 | 完整 PRD + 决策日志 + 分阶段 roadmap + 风险 owner |

深度写入 `prd.md` 的 “PRD Depth” 字段，并说明理由。

### 2. 第三方 PRD Skill 编排

第三方 PRD skill 是分析参考，不是 SpecForge 的产物格式。先按 `.specforge/core/skills/ORCHESTRATION.md` 选择 skill 和写回目标，再用 `registry.json` 确认来源与风险。`sf-prd` 只能读取它们来改善判断，再把有价值的内容改写到 SpecForge 的 `prd.md`、`brief.md` 或 wiki；不要把第三方 skill 的模板、GitHub issue、HTML battlecard 或原始输出直接写进项目。

#### 触发选择

当前只保留 2 个 PRD 相关第三方 skill：

| 第三方 skill | 什么时候参考 | 必须归一化到 |
|---|---|---|
| `to-prd` | 上下文已经较完整，需要把对话和代码库现状合成 PRD | `Executive Summary`、`User Stories`、`Scope & MVP`、`Handoff To Requirements` |
| `product-brainstorming` | 问题空间还散、用户给的是方案而不是问题、访谈维度容易僵化 | 候选功能池、访谈镜头、MVP 取舍 |

#### 归一化规则

- 第三方 skill 的“问题 / 方案 / 用户故事”只能作为候选，必须映射到 SpecForge PRD 模板。
- 第三方 skill 的技术建议只允许进入 `Handoff To Requirements` 或 `Notes for technical_design`，不得在 PRD 中展开接口、表结构或文件路径。
- 第三方 skill 要求“提交 GitHub issue / 生成 HTML battlecard / 写 DESIGN.md”时，一律忽略该投递动作。
- 外部调研类内容必须记录来源、日期和置信度；无来源的市场判断只能写为假设或待确认。
- 如果第三方 skill 输出与用户原始需求冲突，以用户确认和 SpecForge 边界为准。

在 `prd.md#0. PRD Control` 记录本次参考了哪些第三方 skill、参考原因和归一化位置。

### 3. 自适应产品访谈

写 PRD 前，先判断是否缺少会改变产品方向的信息。缺口存在时，向用户提出少量高价值问题；不要为了填表机械追问。

#### 访谈流程

1. 先列出 `已确认事实 / 高影响未知 / 可默认假设`。
2. 从下方“访谈镜头”中按需选择 3-6 个镜头，不要全量展开。
3. 为每个高影响未知给出 2-4 个互斥选项、推荐项和取舍影响；如果问题需要多方案取舍，先路由到 `sf-brainstorm` 并落档 `00-intake/brainstorm.md`。
4. 一轮最多问 5 个问题；复杂需求可以多轮，但每轮都要解释“为什么这些问题会改变 PRD”。
5. 低风险未知可以写入 Assumption Ledger，不阻塞；高风险未知必须暂停。

#### 访谈镜头

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

当 brief 已经包含足够信息时，不要重复询问；把缺失项标成 `TBD` 或 `[NEEDS PRODUCT DECISION: question]`，但核心问题、目标用户、MVP 边界、影响上线风险的角色/数据/AI 质量决策缺失时必须暂停。

### 4. 候选功能池与范围裁剪

综合 brief、wiki 和用户回答，输出前先完成内部分析：

- 先给候选功能池，而不是直接替用户定 MVP。
- 每个候选项都写清“用户价值 / 复杂度 / 风险 / 默认建议 / 为什么”。
- 梳理主要用户流程，但不画 UI 线稿，UI 交给 `sf-ui-design`。
- 识别隐藏依赖：权限、数据来源、审批、通知、计费、AI 服务、运营流程、导入导出、审计等。
- 拆分 `MVP / 可选增强 / 后续版本`，并标明每项功能的用户价值、复杂度、风险和默认建议。
- 明确非目标，防止后续 requirements 和 implementation 越界。
- 如果需求明显跨多个独立交付目标，建议拆成 roadmap 或多个 work item。

### 5. 写入 PRD

写入 active work item 的 `00-intake/prd.md`。优先使用 `.specforge/core/artifacts/templates/prd.md` 作为骨架；没有内容的章节写 `N/A` 并说明原因，不要留空。

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

### 6. 与 SpecForge 后续阶段衔接

- `Requirements seeds` 写可转译为 `sf-requirements` 的行为候选，不写 EARS 规格全文。
- PRD 中的 `Acceptance Seed` 只是验收种子，不是最终 AC 编号；最终验收标准必须由 `sf-requirements` 重新转写为可观察行为、边界值、异常态和验证方式。
- `Recommended components flags` 只记录建议；如果 PRD 明确改变影响面，再同步更新 `work.yaml` 的 `components` 并说明原因。
- `Notes for ui_design` 只写页面范围、体验目标、风格偏好和必须覆盖的状态。
- `Notes for technical_design` 只写业务约束、集成边界、数据/权限/审批等产品层约束，不写架构方案。

### 7. 同步 brief 的决策证据

PRD 完成后，回写或补充 `00-intake/brief.md` 中的这些章节：

- 功能候选池。
- 用户选择。
- 影响面矩阵。
- Components Flags 推荐。
- 待澄清项。

同时把 `brief.md#PRD 决策` 更新为：

- `PRD required: yes`
- `PRD depth: <实际深度>`
- `下一步路由: sf-requirements`
- 若 PRD 已可进入 requirements，`prd.md#0. PRD Control` 的 `Decision Status` 必须写成 `approved-for-requirements`。

不要让 `brief.md` 和 `prd.md` 在 MVP、非目标、components flags 上互相矛盾。

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

**表达示例：**

```diff
- 系统要支持高效上传并智能识别用户意图。
+ 客服运营人员可上传不超过 200MB 的 txt 会话文件，并在 30 分钟内获得按意图分类的 CSV 结果。
+ AI 意图识别抽检准确率目标 >= 90%，无法判断的记录必须进入人工复核队列。
```

## 停止条件

- 目标用户、核心问题或 MVP 功能边界无法从 brief / 用户回答中确认。
- 成功指标完全缺失，且无法安全给出默认指标。
- 存在产品方向冲突、角色权限冲突、合规 / 数据风险或 AI 质量目标冲突，需要用户或业务负责人决策。
- 需要多方案取舍但缺少 `brainstorm.md` 或用户确认记录。
- 用户要求 PRD 直接替代 requirements / UI design / technical design。

## 完成标准

- `prd.md` 存在且内容足以支撑 `sf-requirements`。
- `Decision Status` 为 `approved-for-requirements`，或者明确标记为 `needs-decision` 并暂停。
- 功能边界、非目标、成功指标、风险和路线图已有用户确认或明确默认假设。
- 产品型需求的功能候选池已经裁剪为 MVP / 可选增强 / 后续版本。
- AI 功能已经写明评估策略、人工兜底、安全隐私和成本边界。
- 下一步路由到 `sf-requirements`。

## 不做

- 不写技术方案。
- 不写接口契约、错误处理、边界条件或工程实现细节；这些进入 requirements / technical_design。
- 不把用户故事里的验收种子包装成最终 requirements；必须交给 `sf-requirements` 转译。
- 不替用户做关键产品决策；可以给推荐方案，但要标明假设并等待确认。
- 不把延后功能列入 MVP。
