---
name: sf-spec-review
description: 执行 SpecForge spec_review gate；用于 requirements、适用的 ui_design / technical_design、tasks 完成后，审查规格是否足以进入 implementation 时。
---

# sf-spec-review

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

审查 requirements、适用的 UI design、适用的 technical design、tasks 是否足以进入 implementation。审查是 gate，不是润色文档；目标是阻止不完整、不可测试、不可实现或风险未闭环的 spec 进入代码阶段。

## 启动

运行：

```bash
node .specforge/core/scripts/artifact-graph-status.mjs
node .specforge/core/scripts/instructions.mjs
```

确认 ready artifact 为 `spec_review`，再生成审查产物：

```bash
node .specforge/core/scripts/create-artifact.mjs spec_review
```

## 内部技能母本

执行 spec_review 前，读取 `.specforge/core/workflows/stages/spec-review/SKILL.md`。审查重点、阻断规则、状态定义和完成标准以内置母本为准。

## 关联标准

- `.specforge/core/standards/workflow.md`：gate 状态、scope、evidence 和推进边界。
- `.specforge/core/standards/product.md`：requirements、PRD、候选功能、澄清和验收标准。
- `.specforge/core/standards/design.md`：UI 风格、原型证据、页面流程和状态矩阵。
- `.specforge/core/standards/engineering.md`：technical design、API、安全、测试、交付和 review 标准。
- `.specforge/core/profiles/README.md`：技术选型、数据库选择矩阵和 profile 偏离规则。

## 先计算必审范围

不要凭“文件存在”决定审查范围。先读取 active work item 的 `work.yaml`，结合当前 workflow schema 和 `components` flags 判断哪些 artifact 对本次 gate 是必需的。

最低要求：

| 条件 | 必审 artifact |
|---|---|
| `feature` / `standard` | `brief.md`、`requirements.md`、`tasks.md` |
| `has_ui` 不是明确 `false` | `ui-design.md` |
| `has_api` / `has_db` / `has_domain` / `has_ai` / `has_nfr` / `has_security` / `has_integration` / `has_infra` / `has_background_job` 任一不是明确 `false` | `technical-design.md` |
| `refactor` | `technical-design.md`、`tasks.md` |
| workflow schema 不包含 `spec_review` | 不执行本技能，路由回 `sf-router` 或 `sf-doctor` |

`auto` 是保守值，视为“需要审查”。只有明确 `false` 且 brief / requirements 能证明不涉及时，才允许跳过对应 artifact。

## 审查检查项

按顺序检查，前一层断链时不要跳过：

1. **Workflow 与 components 一致性**
   - workflow 是否匹配 work item 类型。
   - components flags 是否与 brief / requirements 的影响面一致。
   - optional artifact 的跳过理由是否可信。
2. **需求追踪链**
   - 原始请求、brief / PRD、requirements、ui_design、technical_design、tasks 之间是否可追踪。
   - 每个需求都有验收标准和至少一个任务 / 验证路径。
3. **产品和需求质量**
   - requirements 可测试、无歧义、边界和非目标明确。
   - 产品 / 功能候选已展开，MVP 组合有用户确认或明确默认假设。
   - `[NEEDS CLARIFICATION]`、`[NEEDS PRODUCT DECISION]`、`TBD` 不得残留在关键路径。
4. **UI 设计质量**
   - 有 UI 影响时，必须有页面地图、用户流程、风格确认、原型证据和交互状态矩阵。
   - ASCII 只能支撑简单 UI；复杂流程必须有 Pencil、Figma 或 HTML mockup 证据。
5. **技术设计质量**
   - technical_design 覆盖前端 / 后端 / API / 数据 / 权限 / 配置 / NFR 的实际影响面。
   - 技术栈、组件库、编辑器、数据库 / 数据层和测试方案有 profile 或取舍理由。
   - API、安全、可靠性、可观测性或交付影响存在时，必须写规则主基准采用点、偏离理由和验证证据。
6. **任务可执行性**
   - tasks 可排序、可实施、可验证。
   - tasks 必须包含测试、启动验证、迁移 / 回滚 / 观察任务中适用的部分。

## 动作

1. 生成 / 更新 `02-spec-review/spec-review-v1.md`。
2. 写审查矩阵、追踪矩阵和 findings。findings 按 `P0 / P1 / P2` 排序，每条指向具体文件或章节。
3. 决策为 `APPROVED` / `REQUEST_CHANGES` / `REJECTED`。
4. `APPROVED` 时更新 gate：

```bash
node .specforge/core/scripts/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
```

5. `REQUEST_CHANGES` 或 `REJECTED` 时，更新 gate 状态但不带 evidence；在 review 文件中写清回到哪个 artifact 和哪个 `sf-*` 技能修。

```bash
node .specforge/core/scripts/gate.mjs spec_review REQUEST_CHANGES
```

## 完成标准

- `spec-review-v1.md` 有明确 decision。
- `APPROVED` 时 gate 状态与 evidence 路径一致。
- `REQUEST_CHANGES` / `REJECTED` 时 gate 状态已更新，evidence 保持 `null`。
- `REQUEST_CHANGES` 必须指出回到哪个 artifact（requirements / 适用的 ui_design / technical_design / tasks）。
- 所有 P0 / P1 finding 必须解决后才可批准。

## 不做

- 不用空泛"看起来没问题"批准 gate。
- 不在 review 阶段顺手补实现。
- 不替前序阶段大段重写 requirements、ui_design、technical_design 或 tasks；只给出明确退回路径。
