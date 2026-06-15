---
name: prd
description: SpecForge PRD 产品决策能力包。用于把 brief、brainstorm、product discovery、research、wiki 事实和用户确认转成 00-intake/prd.md；每次 sf-prd 写 PRD 前都应读取。
---

# PRD System Skill

本 skill 负责把 brief、brainstorm、product discovery、research、wiki 事实和用户确认转成 SpecForge PRD。

PRD 是产品决策文档，不是需求规格、不是 UI 设计、不是技术设计、不是任务拆分。它回答 what / why / for whom / first version，而不是 how。

## PRD 负责

- 为什么做。
- 给谁做。
- 解决什么问题。
- 第一版 MVP 做什么。
- 第一版不做什么。
- 用户价值和业务目标。
- 成功指标。
- 候选功能如何取舍。
- 产品风险、数据风险、AI 风险和交付风险。
- 是否已经可以进入 requirements。

## PRD 不负责

- 不写最终 REQ / AC / NFR 编号。
- 不写 API 字段、数据库表、组件拆分、测试命令或工程任务。
- 不替用户做产品方向拍板。
- 不把 Agent recommendation 写成用户已确认 MVP。

## 核心产物

- Product Decision Summary
- Problem / Outcome
- Target Users / Scenarios
- Scope & MVP Decision
- Candidate Feature Pool
- User Stories & Acceptance Seeds
- Metrics / Evaluation
- Risks / Dependencies
- Roadmap / Release Slicing
- Handoff To Requirements

## 读取顺序

1. 读取 `foundations/product-decision-boundary.md` 和 `foundations/decision-status.md`，确认 PRD 阶段边界和能否进入 requirements。
2. 读取 `references/output-contract.md`，选择 `prd-lite / prd-standard / prd-deep`。
3. 读取 `foundations/prd-language.md`，保证 PRD 写产品决策，不写实现方案。
4. 读取 `foundations/assumption-ledger.md`，区分 confirmed、delegated-default、assumption、pending 和 research-needed。
5. 按输入读取 transforms：
   - `transforms/brief-to-prd.md`
   - `transforms/brainstorm-to-prd.md`
   - `transforms/product-discovery-to-prd.md`
   - `transforms/research-to-prd.md`
6. 按 work item 类型读取 1-3 个 `patterns/*.md`，不要全量加载。
7. 写完后读取 `references/quality-rubric.md` 和 `references/anti-patterns.md`。
8. 如果参考外部 `create-prd`，先读 `references/external-prd-skill-normalization.md`，只吸收结构视角，不执行外部保存动作。

## 执行流程

1. 检查 PRD 是否需要。
2. 检查用户确认状态。
3. 选择 PRD profile：`prd-lite` / `prd-standard` / `prd-deep`。
4. 从 brief / brainstorm / product discovery / research / wiki 建立产品事实表。
5. 识别高影响未知。
6. 必要时执行产品访谈。
7. 建立候选功能池。
8. 裁剪 MVP / optional / later / out-of-scope。
9. 写 PRD。
10. 填写 Product Decision Gate。
11. 写 Handoff To Requirements。
12. 若可进入 requirements，`Decision Status = approved-for-requirements`。
13. 否则 `Decision Status = needs-decision / research-needed / blocked-by-conflict`。

## 输出到 SpecForge

| 内容 | 写入位置 |
|---|---|
| PRD depth、source artifacts、assumptions、Decision Status | `00-intake/prd.md#0. PRD Control` |
| 问题、用户、MVP、非目标、成功标准、能否进入 requirements | `00-intake/prd.md#1. Product Decision Summary` |
| 背景、痛点、目标结果和失败代价 | `00-intake/prd.md#2. Background & Outcome` |
| 目标用户、角色、场景、频率、权限责任 | `00-intake/prd.md#3. Users, Roles & Scenarios` |
| 候选功能池和取舍依据 | `00-intake/prd.md#4. Candidate Feature Pool` |
| MVP / optional / later / out-of-scope | `00-intake/prd.md#5. Scope & MVP Decision` |
| 用户故事和验收种子 | `00-intake/prd.md#6. User Stories & Acceptance Seeds` |
| 产品流程、异常路径、人工兜底、状态变化 | `00-intake/prd.md#7. Product Flow` |
| 指标、评估、AI / 数据 / 合规快照、风险和 roadmap | `00-intake/prd.md` 对应章节 |
| requirements seeds、组件 flags、UI / technical / data / security notes | `00-intake/prd.md#14. Handoff To Requirements` |

## 完成标准

- PRD 能说明为什么做、给谁做、第一版做什么和不做什么。
- 每个 MVP 项都有来源、取舍理由和确认状态。
- 成功标准至少有一个可观察指标。
- 高影响未知没有被隐藏；有 owner / needed-by / status。
- AI / 数据 / 合规 / 运营风险在适用时可见。
- Handoff To Requirements 足以让 `sf-requirements` 转译行为种子。
- PRD 没有写成 requirements、UI design、technical design 或 task plan。
