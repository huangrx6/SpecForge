---
name: sf-prd
description: 生成或更新产品需求文档（PRD）；用于产品型 work item、AI 功能、后台工具、全栈应用或高层模糊需求在 requirements 前明确核心问题、目标用户、功能候选、MVP 边界、成功指标、风险和路线图时。
---

# sf-prd

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 brief 的分析结论升级为可对齐产品、设计与工程的 PRD。它的受众是产品决策者、业务负责人、设计负责人和工程负责人，不是实现者。

`sf-prd` 是 requirements 之前的产品澄清产物，不是 artifact graph 的固定阶段，也不替代 `sf-requirements`。PRD 回答“为什么做、给谁做、第一版做哪些价值”，requirements 回答“系统必须表现出哪些可测试行为”。

## 启动

1. 从当前目录向上找到项目根，并运行：

```bash
node .specforge/execution/tools/status.mjs
node .specforge/execution/tools/doctor.mjs
```

2. 找到唯一 active work item，读取：
   - `00-intake/original-request.md`
   - `00-intake/brief.md`
   - 已存在的 `00-intake/prd.md`（如果是更新 PRD）
   - `.specforge/workspace/knowledge/` 中与产品、用户、业务、竞品、设计系统或既有架构相关的长期事实。
3. 如果存在多个 active work item，先让用户指定目标；不要把 PRD 写到猜测的目录里。

## 内部技能母本

写 PRD 前，读取 `.specforge/execution/stages/discovery/SKILL.md` 中关于候选功能池和用户确认的章节，确保 PRD 的功能边界已经过用户选择，不是 Agent 单方面假设。

## 关联规则

- `.specforge/policy/rules/product-discovery/README.md`：功能候选和用户选择。
- `.specforge/policy/rules/experience-design/README.md`：用户流程和体验方向。
- `.specforge/policy/rules/boundaries/README.md`：明确非目标。
- `.specforge/policy/rules/spec-quality/README.md`：可测试、可验证的目标陈述。
- `.specforge/policy/rules/localization.md`：面向人类的产物优先中文。

## 工作流程

### 1. 产品访谈与缺口识别

写 PRD 前，先判断是否缺少会改变产品方向的信息。缺口存在时，向用户提出少量高价值问题；不要为了填表机械追问。

优先确认：

- **核心问题**：为什么现在要做？现有痛点、触发场景和失败成本是什么？
- **目标用户**：谁使用？是否有角色差异、权限差异或审批差异？
- **成功指标**：第一版上线后，用什么可观测指标判断有效？
- **MVP 边界**：哪些必须第一版做，哪些只是可选增强，哪些明确延后？
- **约束**：上线时间、预算、合规、数据、渠道、技术栈或运营限制。
- **体验方向**：是否涉及 UI、品牌、视觉风格、设计工具或可用性目标。
- **AI 要素**：如果包含 AI/LLM，确认输入、输出、提示词可配置性、人工复核、质量评估、成本和安全边界。

当 brief 已经包含足够信息时，不要重复询问；把缺失项标成 `TBD` 或 `[NEEDS PRODUCT DECISION: question]`，但核心问题、目标用户和 MVP 边界缺失时必须暂停。

### 2. 分析与范围裁剪

综合 brief、knowledge 和用户回答，输出前先完成内部分析：

- 梳理主要用户流程，但不画 UI 线稿，UI 交给 `sf-ui-design`。
- 识别隐藏依赖：权限、数据来源、审批、通知、计费、AI 服务、运营流程、导入导出、审计等。
- 拆分 `MVP / 可选增强 / 后续版本`，并标明每项功能的用户价值、复杂度、风险和默认建议。
- 明确非目标，防止后续 requirements 和 implementation 越界。
- 如果需求明显跨多个独立交付目标，建议拆成 roadmap 或多个 work item。

### 3. 写入 PRD

写入 active work item 的 `00-intake/prd.md`。PRD 必须使用下面结构；没有内容的章节写 `N/A` 并说明原因，不要留空。

```markdown
# PRD: <产品 / 功能名称>

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

## 5. User Stories & Acceptance Criteria
| ID | User Story | Acceptance Criteria | Priority |
|---|---|---|---|

## 6. Core User Flows
- Flow:
  1.
  2.
  3.
- Exceptions:

## 7. Metrics, Evaluation & Analytics
- Product KPIs:
- Quality Metrics:
- Operational Metrics:
- Tracking / Evidence:

## 8. AI System Requirements (If Applicable)
- AI Task:
- Inputs / Outputs:
- Prompt or Policy Controls:
- Evaluation Strategy:
- Human Review / Override:
- Safety, Privacy & Cost Boundaries:

## 9. Constraints, Dependencies & Risks
| Item | Type | Impact | Mitigation / Owner |
|---|---|---|---|

## 10. Rollout & Roadmap
- MVP:
- v1.1:
- Later:
- Rollback / Disable Strategy:

## 11. Open Questions & Decisions
| Question | Owner | Needed By | Status |
|---|---|---|---|

## 12. Handoff To Requirements
- Requirements seeds:
- Recommended components flags:
- Notes for ui_design:
- Notes for technical_design:
```

### 4. 与 SpecForge 后续阶段衔接

- `Requirements seeds` 写可转译为 `sf-requirements` 的行为候选，不写 EARS 规格全文。
- `Recommended components flags` 只记录建议；如果 PRD 明确改变影响面，再同步更新 `work-item.yaml` 的 `components` 并说明原因。
- `Notes for ui_design` 只写页面范围、体验目标、风格偏好和必须覆盖的状态。
- `Notes for technical_design` 只写业务约束、集成边界、数据/权限/审批等产品层约束，不写架构方案。

## 质量标准

- 用具体、可度量的表达，避免“快速、简单、智能、现代化、好用”这类不可验收词。
- 成功指标至少包含 1 个用户价值指标；涉及 AI 时还要包含质量评估指标，例如准确率、人工抽检通过率、拒答率、成本上限或处理时延。
- 每个 MVP 功能必须能追溯到目标用户和核心问题。
- 每个非目标都应解释为什么现在不做。
- 不知道的约束写 `TBD`，不要编造技术栈、预算、外部依赖或上线日期。
- PRD 可以记录已知硬约束，例如“必须使用现有 SSO”，但不得展开接口契约、数据库表结构或实现方案。

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
- 用户要求 PRD 直接替代 requirements / UI design / technical design。

## 完成标准

- `prd.md` 存在且内容足以支撑 `sf-requirements`。
- 功能边界、非目标、成功指标、风险和路线图已有用户确认或明确默认假设。
- 产品型需求的功能候选池已经裁剪为 MVP / 可选增强 / 后续版本。
- AI 功能已经写明评估策略、人工兜底、安全隐私和成本边界。
- 下一步路由到 `sf-requirements`。

## 不做

- 不写技术方案。
- 不写接口契约、错误处理、边界条件或工程实现细节；这些进入 requirements / technical_design。
- 不替用户做关键产品决策；可以给推荐方案，但要标明假设并等待确认。
- 不把延后功能列入 MVP。
