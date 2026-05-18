---
name: spec-review
description: SpecForge 内部规格审查技能。用于 01-spec 完成后审查 requirements、适用的 ui_design / technical_design、tasks 是否足以进入 implementation。
---

# Spec Review Skill

本技能审查 requirements、适用的 UI design、适用的 technical design 和 tasks 是否足以进入 implementation。审查不是润色文档，而是判断实现是否已经有体验证据、技术边界和可验证计划。

## 读取

- `work.yaml`
- `00-intake/brief.md`
- `00-intake/prd.md`（存在时）
- `01-spec/requirements.md`
- `01-spec/ui-design.md`（存在时）
- `01-spec/technical-design.md`（存在时）
- `01-spec/tasks.md`
- `.specforge/core/artifacts/schemas/<workflow>.json`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/product.md`
- `.specforge/core/standards/design.md`（存在 UI 影响时）
- `.specforge/core/standards/engineering.md`
- `.specforge/core/profiles/README.md`

## 写入

- `02-spec-review/spec-review-v1.md`
- 通过 `node .specforge/core/scripts/gate.mjs spec_review <status> ...` 更新门禁。`APPROVED` 必须带 `--evidence 02-spec-review/spec-review-v1.md`；`REQUEST_CHANGES` / `REJECTED` 不带 evidence。

## 必审范围计算

先根据 `work.yaml` 的 `workflow`、`components` 和 workflow schema 计算必审范围。不要只看文件是否存在。

| 条件 | 处理 |
|---|---|
| workflow schema 没有 `spec_review` artifact | 停止，不执行本技能 |
| `feature` / `standard` | 必审 `brief.md`、`requirements.md`、`tasks.md` |
| `has_ui` 不是明确 `false` | 必审 `ui-design.md` |
| 任一技术影响 flag 不是明确 `false` | 必审 `technical-design.md` |
| `refactor` | 必审 `technical-design.md`、`tasks.md` |

技术影响 flags 包括：`has_api`、`has_db`、`has_domain`、`has_ai`、`has_nfr`、`has_security`、`has_integration`、`has_infra`、`has_background_job`。

`auto` 是保守值，视为需要对应 artifact。只有明确 `false` 且 brief / requirements 能证明不涉及时，才允许跳过。

## 审查矩阵

### 1. Workflow 与 components

- workflow 是否匹配 work item 性质。
- components flags 是否与 brief / requirements 的影响面矩阵一致。
- 被跳过的 ui_design 或 technical_design 是否有可信 N/A / false 理由。

### 2. 追踪链

- 原始请求 -> brief / PRD -> requirements 是否连贯。
- requirements -> ui_design 是否覆盖所有用户可见流程。
- requirements -> technical_design 是否覆盖所有工程影响面。
- requirements / design -> tasks 是否可实施。
- 每个验收标准是否有 tasks 或 verification 钩子。

### 3. 产品与 requirements

- requirements 是否可测试。
- 分析深度是否匹配复杂度；代码库探索、外部研究 / 跳过理由、澄清记录和分析综合是否足够。
- 产品 / 功能候选是否已展开，MVP 组合是否有用户确认或明确默认假设。
- `[NEEDS CLARIFICATION]`、`[NEEDS PRODUCT DECISION]`、`TBD` 是否仍残留在关键路径。

### 4. UI Design

- ui_design 是否覆盖用户可见页面、流程、原型证据、视觉风格确认和交互状态；无 UI 影响时 N/A 是否可信。
- 若有 UI 变更：是否先确认视觉风格或明确沿用现有设计系统，再提供至少一种可验收 UI 产物：
  - Figma Frame 链接（适合已有团队设计稿、设计系统或后续通过 `figma-implement-design` 驱动实现）。
  - Pencil 原型文件 `01-spec/ui-mockup.pen` 及导出截图 `01-spec/ui-mockup-export/*.png`（适合本地、低成本、Agent 可直接产出的线框 / 原型；复杂页面还应记录 PENCIL_PLAN 摘要和采用的设计系统 skill）。
  - `01-spec/ui-mockup.html` 静态原型（适合无设计工具或需要浏览器直接验证）。
  - ASCII / Markdown 线稿（仅适合 1-2 个简单页面；复杂 UI 不能只用 ASCII）。
- 视觉风格确认或 UI 证据缺失时，Gate 不可批准。

### 5. Technical Design

- technical_design 是否存在 `## 0. 影响面与读取计划`，并用 `yes` / `no` / `unknown` 明确每个工程影响面。
- 影响面矩阵是否与 `work.yaml` components、requirements 影响面、tasks 验证计划一致；被 components 合法跳过时是否有 intake / requirements 依据。
- `yes` 影响面是否写清触发证据、读取的子模块 / profile，并在对应章节有设计响应：
  - `Frontend engineering` -> `Frontend Engineering Design`
  - `Backend engineering` -> `Backend Engineering Design`
  - `Domain model / state machine` -> `Domain Model / State Machine`
  - `API / SDK / Events` -> `API / Contracts`
  - `Data / DB / Migration` -> `Data, Storage & Migration`
  - `Auth / Permission / Security`、`Config / Env / Delivery`、`Jobs / Queue / Scheduler`、`Observability / Reliability` -> `Permission, Config, Jobs & Integration Impact`、`NFRs`、`失败模式与回滚策略`、`技术验证策略`
- `no` 影响面是否有可信 N/A 理由，且没有与 requirements、代码探索或 tasks 冲突。
- `unknown` 是否已被处理；凡会改变架构、数据、安全、成本、外部契约、发布或可靠性风险的 `unknown`，不得批准。
- 技术栈、组件库、编辑器、数据层和测试方案是否引用 profile 或写清偏离理由；纯后端不强制前端 profile，纯前端不强制数据库 profile，涉及持久化时必须选择数据库 / 存储 profile。
- API、安全、可靠性、可观测性或交付影响存在时，technical_design 是否引用对应规则入口的主基准，并写清采用点、偏离理由和验证证据。

### 6. Tasks

- tasks 是否可执行、可排序、可验证。
- 每个任务是否保留 `_Trace:_`、`_Impact:_`、`_Boundary:_`、`_Depends:_`、`_Verification:_`。
- `_Impact:_` 是否与 technical_design 影响面矩阵一致；technical_design `yes` 影响面是否都有任务承接，`no` 影响面是否没有被拆出实现任务。
- tasks 是否覆盖测试、启动验证、迁移 / 回滚 / 观察等适用验证任务。
- 是否存在范围膨胀、未决方案或隐藏风险。

## 状态规则

| 状态 | 使用条件 |
|---|---|
| `APPROVED` | 可以仅凭当前 spec 进入实现，且没有 P0 / P1 finding |
| `REQUEST_CHANGES` | 有可修复缺口，修完可重审 |
| `REJECTED` | 方向或范围错误，需要回到 intake / requirements |

## 阻断规则

以下情况不得批准：

- 必审 artifact 缺失，或 workflow / components 与 schema 计算结果矛盾。
- 产品 / 页面 / 全栈应用没有功能候选池和用户选择记录。
- `standard` / `deep` 没有代码库探索证据；`deep` 没有外部研究证据或合理跳过理由。
- 计划、设计或任务不能追溯到用户澄清、代码探索或外部研究结论。
- 用户可见页面没有视觉风格确认、体验设计证据或可信的 N/A 说明。
- 技术影响面存在但 components 跳过了 technical_design，或 technical_design 对 API、数据、权限、配置、NFR 风险只写默认处理。
- technical_design 缺少 `## 0. 影响面与读取计划`，或影响面矩阵未覆盖全部工程影响面。
- 存在会影响架构、数据、安全、成本、外部契约、发布或可靠性的 `unknown`，但没有澄清结论、取舍理由和验证计划。
- `yes` 影响面没有对应子模块 / profile / 设计章节 / 验证钩子；`no` 影响面没有可信 N/A 理由。
- 管理后台、HTML 渲染、外部发布、数据迁移或权限相关风险只被默认处理，没有确认和验证策略。
- 关键技术栈或组件选择没有 profile、备选方案或取舍理由。
- 涉及 API、安全、可靠性或可观测性，却没有规则主基准采用点或可信 N/A 说明。
- 设计包含数据库、缓存、搜索或文件存储，但没有数据库 / 存储 profile 选择、偏离说明或迁移验证计划。
- tasks 缺少 `_Impact:_`，或 `_Impact:_` 与 technical_design 影响面矩阵冲突。
- tasks 没有覆盖测试、启动验证、回滚 / 观察等适用验证任务。

## Findings 分级

| 等级 | 含义 | gate 影响 |
|---|---|---|
| `P0` | 方向、范围、必审 artifact、关键安全 / 数据 / 权限 / 生产风险错误 | 必须 `REQUEST_CHANGES` 或 `REJECTED` |
| `P1` | 进入实现会造成返工、漏测或明显风险未闭环 | 必须 `REQUEST_CHANGES` |
| `P2` | 不阻断实现，但应在实现或验证时跟进 | 可批准，但必须记录残余风险 |

## 输出要求

- findings 按严重程度排序。
- 每条 finding 指向具体文件或章节。
- 阻断项必须说明为什么阻断实现。
- `REQUEST_CHANGES` 必须说明退回哪个 artifact 和哪个 `sf-*` 技能。
- 批准时也要写清残余风险。

## 完成标准

- gate 证据文件存在。
- `APPROVED` 时 gate 状态和证据路径一致；`REQUEST_CHANGES` / `REJECTED` 时 gate 状态已更新且 evidence 为 `null`。
- 未批准时明确下一步应回哪个 artifact。
