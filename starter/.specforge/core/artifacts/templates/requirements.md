# Requirements

## 0. Requirements Control

| 项 | 内容 |
|---|---|
| 来源 artifact | `original-request.md` / `brief.md` / `prd.md` / `research.md` |
| 参考第三方 skill | N/A / `user-story-writing` |
| 归一化说明 | 第三方输出已转写为 SpecForge 需求；未直接复制外部模板 |
| 影响面 flags 校准 | `has_ui` / `has_api` / `has_db` / `has_domain` / `needs_research` |

## 摘要

## 分析依据

- 来自 intake 的需求理解：
- 来自代码库探索：
- 来自外部研究：
- 来自用户澄清：

## 目标用户与场景

| 角色 | 目标 | 关键场景 |
|---|---|---|

## 功能决策

| 功能 | 决策 | 理由 | 后续版本 |
|---|---|---|---|

## PRD / Brief 追溯

| 已确认目标 / 用户故事 / MVP 能力 / 验收种子 | Requirements 覆盖位置 | 转译结果 | 状态 |
|---|---|---|---|

## PRD 转译边界

| PRD 项 | 本文处理方式 | 说明 |
|---|---|---|
| 产品目标 / KPI | REQ / NFR / 产品指标保留 | |
| 用户故事 | REQ / 场景 / 非目标 | |
| Acceptance Seed | AC / NFR / 待澄清 | |
| UI notes | 影响面 flag / `ui-design.md` 输入 | 不展开 UI 方案 |
| Technical notes | 影响面 flag / `technical-design.md` 输入 | 不展开 API / DB / 文件路径 |

## 边界

### 本变更负责

### 本变更不负责

### 依赖

### 重新验证触发条件

## 影响面确认

| 影响面 | 是否纳入本 work item | 对应设计产物 | 验收影响 |
|---|---|---|---|
| UI / UX | yes / no | `ui-design.md` / N/A | |
| Frontend engineering | yes / no | `technical-design.md` / N/A | |
| Backend / API | yes / no | `technical-design.md` / N/A | |
| Data / DB | yes / no | `technical-design.md` / N/A | |
| Auth / Security | yes / no | `technical-design.md` / N/A | |
| Delivery / Runtime | yes / no | `technical-design.md` / N/A | |

## 待澄清项

- [NEEDS CLARIFICATION: question]

## 用户流程

| 流程 | 触发 | 成功结果 | 失败 / 空状态 |
|---|---|---|---|

## 功能需求

必要时使用 EARS 风格：

- WHEN `<event>`, THE SYSTEM SHALL `<response>`.
- IF `<condition>`, THE SYSTEM SHALL `<response>`.
- WHILE `<state>`, THE SYSTEM SHALL `<response>`.
- WHERE `<feature applies>`, THE SYSTEM SHALL `<response>`.

| ID | 需求 | 来源 | 优先级 | 验收标准 |
|---|---|---|---|---|
| REQ-001 | WHEN ..., THE SYSTEM SHALL ... | PRD / brief / user clarification | MUST / SHOULD / COULD | AC-001 |

## 行为覆盖矩阵

| REQ | 正常路径 | 失败 / 空状态 | 边界值 | 权限差异 | 对应 AC |
|---|---|---|---|---|---|
| REQ-001 | | | | | AC-001 |

## 非功能需求

| ID | 类型 | 需求 | 验收方式 |
|---|---|---|---|

## 不在范围内

## 验收标准

| ID | Given | When | Then | 验证方式 |
|---|---|---|---|---|
