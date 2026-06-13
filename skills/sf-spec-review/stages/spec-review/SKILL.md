---
name: spec-review
description: SpecForge 内部规格审查技能。用于随时审查任一已有 spec artifact，或在 spec_review gate 前审查 requirements、适用 UI / technical design 和 tasks 是否足以进入 implementation。
---

# Spec Review Skill

本技能有两种模式：

- **Artifact Review（随时审查）**：用户要求“review 这个 spec / 检查需求 / 看看 UI 设计 / tech design 有没有问题 / tasks 是否细”时，只要对应 artifact 已存在，就可以执行。它不要求所有前置阶段完成，也不更新 gate。
- **Gate Review（实现前门禁）**：ready artifact 是 `spec_review` 时执行，审查完整 spec 包是否足以进入 implementation，并更新 `spec_review` gate。

审查不是润色文档，而是判断 spec 是否清楚、可测试、可实现、风险闭环，并给出明确退回路径。

## 读取

共同读取：

- `work.yaml`
- `00-intake/brief.md`
- `00-intake/prd.md`（存在时）
- 当前要审查的 artifact：`requirements.md`、`ui-design.md`、`technical-design.md`、`tasks.md`、`gap-report.md`、`research.md` 中任一或多项
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/product.md`
- `.specforge/core/standards/design.md`（涉及 UI 时）
- `.specforge/core/standards/engineering.md`（涉及技术、任务或验证时）
- `.specforge/core/profiles/README.md`（涉及技术选型时）

Gate Review 额外读取：

- `.specforge/core/artifacts/schemas/<workflow>.json`
- 所有 schema 和 components 要求的必审 artifact

## 写入

Artifact Review：

- 优先写入 `02-spec-review/<artifact>-review-v<N>.md`，例如 `requirements-review-v1.md`、`ui-design-review-v1.md`。
- 不更新 gate，除非用户明确要求把本次审查作为 gate。

Gate Review：

- 写入 `02-spec-review/spec-review-v1.md`
- 通过 `node .specforge/core/scripts/gate.mjs spec_review <status> ...` 更新门禁。`APPROVED` 必须带 `--evidence 02-spec-review/spec-review-v1.md`；`REQUEST_CHANGES` / `REJECTED` 不带 evidence。
- 批准前必须运行 `node .specforge/core/scripts/quality-suite.mjs`；任何 `FAIL` 都转成 P0/P1 finding，并按失败项 route 退回对应阶段。Artifact Review 按被审 artifact 读取相关质量脚本输出作为辅助证据。

## 模式选择

| 触发 | 模式 | 行为 |
|---|---|---|
| 用户要求 review 某个已存在 spec | Artifact Review | 审查该 artifact，不要求完整前置，不更新 gate |
| 用户要求“现在的 spec 能不能继续”且还没到 spec_review ready | Artifact Review | 审查当前已有 spec 链，并指出缺失 |
| ready artifact 是 `spec_review` | Gate Review | 计算必审范围，写 gate review，更新 gate |
| 用户明确要求“执行 spec_review gate” | Gate Review | 必须满足 schema / components 必审范围 |

## Artifact Review 检查项

### PRD / brief

- 是否回答为什么做、给谁做、MVP 做什么、不做什么、成功如何衡量。
- 候选功能是否让用户选择过，还是 Agent 单方面定稿。
- 高影响未知是否标记为需要用户决策。
- 是否把技术方案写进 PRD，导致 PRD / requirements 边界混乱。

### Requirements

- 是否只写可观察行为，不提前写 UI / API / DB 实现方案。
- 每条需求是否可测试，有正常路径、异常路径、边界值、权限差异和验收标准。
- PRD 的 MVP 和非目标是否被完整转译。
- 是否仍残留 `[NEEDS CLARIFICATION]`、`TBD`、未确认产品决策或需要回到 `sf-brainstorm` 的方案取舍。

### UI Design

- 是否固定使用 Pencil 作为正式原型证据。
- 是否有 Visual Style Brief、页面地图、角色流程、状态矩阵、Pencil `.pen`、导出截图和视觉质量修正记录。
- 参考设计语言是否被提取并落地，而不是只贴来源。
- 是否只是默认控件堆叠，或者缺少状态、响应式、权限和异常态。

### Technical Design

- 是否先做技术影响面矩阵和读取计划。
- 新项目、关键技术变化或新增直接依赖是否经过用户确认、用户授权默认、已确认脚手架或可信现有栈证据。
- 初稿后的核心决策摘要是否已经由用户确认、用户授权默认，或明确 N/A。
- Architecture Contract 是否说明边界、职责、接口、状态、数据、安全、运行、交付、可测试性和维护成本，或给出可信 N/A。
- Implementation Handoff 是否足以拆出任务：change slices、files/modules、sequence、test seams、rollout、rollback、do-not-touch 和 open assumptions。
- Operability & Maintenance 是否说明日志 / 指标 / 追踪、告警 / 健康检查、owner、扩展点、废弃路径、wiki target、技术债和重看触发。
- 版本、框架、SDK、云服务、安全或依赖行为是否查了当前官方资料或写明跳过理由。
- `unknown`、`[NEEDS DECISION]`、`[NEEDS TECH DECISION]`、`[NEEDS DEPENDENCY DECISION]`、`[NEEDS TOOLING DECISION]` 是否仍在关键路径；如果是用户取舍问题，Return to 必须指向 `sf-brainstorm`。
- API、数据、权限、配置、后台任务、可观测性、回滚和验证策略是否具体。

### Tasks

- 是否小到能实现、能 review、能验证。
- 每个任务是否有核心字段 `_Trace:_`、`_Files:_`、`_Verification:_`、`_Rollback:_`、`_Risk:_`。
- 条件字段 `_Impact:_`、`_Boundary:_`、`_Depends:_`、`_TestCase:_` 是否在适用任务上出现，而不是机械要求所有任务都填满。
- 是否有来源覆盖矩阵，所有需求、设计决策和风险都有实现任务与验证任务。
- 有浏览器流程时，是否单独列出测试用例、Playwright 自动操作执行和证据登记任务。
- 是否存在范围膨胀、共享写入冲突或把验证藏进实现任务。

## Gate Review 必审范围计算

先根据 `work.yaml` 的 `workflow`、`components` 和 workflow schema 计算必审范围。不要只看文件是否存在。

| 条件 | 处理 |
|---|---|
| workflow schema 没有 `spec_review` artifact | 停止，不执行 Gate Review |
| `feature` / `standard` | 必审 `brief.md`、`requirements.md`、`tasks.md` |
| `has_ui` 不是明确 `false` | 必审 `ui-design.md` |
| 任一技术影响 flag 不是明确 `false` | 必审 `technical-design.md` |
| `refactor` | 必审 `technical-design.md`、`tasks.md` |

技术影响 flags 包括：`has_api`、`has_db`、`has_domain`、`has_ai`、`has_nfr`、`has_security`、`has_integration`、`has_infra`、`has_background_job`。`auto` 是保守值，视为需要对应 artifact。

## Gate Review 阻断规则

以下情况不得批准：

- 必审 artifact 缺失，或 workflow / components 与 schema 计算结果矛盾。
- 产品 / 页面 / 全栈应用没有功能候选池和用户选择记录。
- 计划、设计或任务不能追溯到用户澄清、代码探索或外部研究结论。
- quality suite 仍有 `FAIL`，或相关质量脚本的 `FAIL` 没有被转成 finding 和 return path。
- 用户可见页面没有 Pencil 原型、导出截图、视觉质量 review 或可信 N/A。
- UI 原型只是默认控件堆叠，未覆盖关键状态、权限、响应式或异常态。
- 有 UI 影响但 `ui-design.md#9` 没有 Pencil 保存状态、保存后重读校验或截图证据。
- `ui-design.md` 声明采用 PC 端业务系统规范，但未记录 `pc-ui-design-spec.md`、核心 token、HTML/CSS 约束或偏离项。
- 技术影响面存在但 technical design 缺失、关键 `unknown` 未闭环、关键技术 / 新增依赖 / 工具链缺少确认来源，或初稿后核心决策摘要未确认。
- technical design 缺少 Architecture Contract、Implementation Handoff 或 Operability & Maintenance，导致边界、任务拆解、回滚、运行观察或维护 owner 不可审查。
- technical design 对 API、数据、权限、配置、NFR 风险只写默认处理。
- tasks 缺少核心字段 `_Trace:_`、`_Files:_`、`_Verification:_`、`_Rollback:_`、`_Risk:_`，条件字段在适用任务上缺失，或 technical design `yes` 影响面没有任务承接。
- 有浏览器流程、上传、提交、审批、下载、权限或错误提示，但 tasks / verification plan 没有 Playwright 用例、自动执行和证据要求。

## Findings 分级

| 等级 | 含义 | gate 影响 |
|---|---|---|
| `P0` | 方向、范围、必审 artifact、关键安全 / 数据 / 权限 / 生产风险错误 | Gate Review 必须 `REQUEST_CHANGES` 或 `REJECTED` |
| `P1` | 进入下一阶段会造成返工、漏测或明显风险未闭环 | Gate Review 必须 `REQUEST_CHANGES` |
| `P2` | 不阻断下一阶段，但应在任务或验证中跟进 | 可批准，但必须记录残余风险 |
| `P3` | 表达、组织或维护性建议 | 不阻断 |

## 输出要求

- findings 按严重程度排序。
- 每条 finding 指向具体文件或章节。
- 阻断项必须说明为什么阻断下一阶段。
- `REQUEST_CHANGES` 必须说明退回哪个 artifact 和哪个 `sf-*` 技能。
- 批准时也要写清残余风险。
## 铁律（不可越过）

```
没有可审查的 evidence 文件，不得批准任何 gate。
```

**不允许的例外：**
- 不能以"规格看起来没问题"为由批准
- 不能以"requirements 已经很详细了"为由跳过状态矩阵检查
- 不能因为"不想拖慢进度"而降低标准

## Red Flags — 出现以下情况立即停止

- 你写了"看起来没问题，可以进入 implementation"但没有完整的 review 矩阵
- tasks 没有 `_Verification:_` 字段但你准备批准
- `ui-design.md` 没有状态矩阵但 `has_ui=true`
- technical-design.md 有 `[NEEDS TECH DECISION]` 但你准备批准 spec_review gate
- 你没有逐项检查 requirements 的每个验收标准就批准了

**所有以上情况 = 降级为 REQUEST_CHANGES，列出具体缺失项。**

## 完成标准

Artifact Review：

- review 文件存在，包含 scope、findings、建议退回路径和是否可进入下一阶段。
- 不更新 gate。

Gate Review：

- gate evidence 文件存在。
- `quality-suite.mjs` 无 `FAIL`；`WARN` 已在 review 中记录 residual risk、owner 或后续验证承接。
- `APPROVED` 时 gate 状态和证据路径一致；`REQUEST_CHANGES` / `REJECTED` 时 gate 状态已更新且 evidence 为 `null`。
- 未批准时明确下一步应回哪个 artifact。
