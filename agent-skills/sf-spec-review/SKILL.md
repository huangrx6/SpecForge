---
name: sf-spec-review
description: 审查 SpecForge 规格；用于随时 review 已存在的 PRD、requirements、ui_design、technical_design、tasks 等 spec，或在 ready artifact 为 spec_review 时执行实现前 gate。
---

# sf-spec-review

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

`sf-spec-review` 有两种模式：

- **Artifact Review**：只要某个 spec 已存在，就可以审查它。适合用户说“看下 requirements 有没有问题”“review UI 设计”“tasks 拆得细不细”。不要求所有前置完成，不更新 gate。
- **Gate Review**：ready artifact 为 `spec_review` 时，审查完整 spec 包是否足以进入 implementation，并更新 `spec_review` gate。

## 启动

先运行：

```bash
node .specforge/core/scripts/artifact-graph-status.mjs
node .specforge/core/scripts/instructions.mjs
```

如果用户明确要求 review 某个已有 artifact，进入 Artifact Review；否则只有 ready artifact 为 `spec_review` 时进入 Gate Review。

Gate Review 需要生成审查产物：

```bash
node .specforge/core/scripts/create-artifact.mjs spec_review
```

## 内部技能母本

执行前读取：

```text
.specforge/core/workflows/stages/spec-review/SKILL.md
```

审查范围、阻断规则、finding 分级和完成标准以内置母本为准。

## 关联标准

- `.specforge/core/standards/workflow.md`：gate 状态、scope、evidence 和推进边界。
- `.specforge/core/standards/product.md`：PRD、requirements、候选功能、澄清和验收标准。
- `.specforge/core/standards/design.md`：Pencil 原型、UI 风格、页面流程和状态矩阵。
- `.specforge/core/standards/engineering.md`：technical design、API、安全、测试、交付和 review 标准。
- `.specforge/core/profiles/README.md`：技术选型、数据库选择矩阵和 profile 偏离规则。

## Artifact Review

Artifact Review 可审查以下任意已存在产物：

- `00-intake/brief.md`
- `00-intake/prd.md`
- `01-spec/requirements.md`
- `01-spec/ui-design.md`
- `01-spec/technical-design.md`
- `01-spec/tasks.md`
- `01-spec/gap-report.md`
- `01-spec/research.md`

写入建议路径：

```text
02-spec-review/<artifact>-review-v<N>.md
```

例如：

```text
02-spec-review/requirements-review-v1.md
02-spec-review/ui-design-review-v1.md
02-spec-review/technical-design-review-v1.md
02-spec-review/tasks-review-v1.md
```

Artifact Review 输出必须包含：

- Review scope
- 可进入下一阶段 / 需要修改 / 方向错误
- Findings，按 `P0 / P1 / P2 / P3` 排序
- Return to：应回到哪个 artifact 和哪个 `sf-*`；用户取舍未确认时优先回到 `sf-brainstorm`
- 不更新 gate 的说明

## Gate Review

不要凭“文件存在”决定审查范围。先读取 active work item 的 `work.yaml`，结合当前 workflow schema 和 `components` flags 判断哪些 artifact 对本次 gate 是必需的。

最低要求：

| 条件 | 必审 artifact |
|---|---|
| `feature` / `standard` | `brief.md`、`requirements.md`、`tasks.md` |
| `has_ui` 不是明确 `false` | `ui-design.md` |
| `has_api` / `has_db` / `has_domain` / `has_ai` / `has_nfr` / `has_security` / `has_integration` / `has_infra` / `has_background_job` 任一不是明确 `false` | `technical-design.md` |
| `refactor` | `technical-design.md`、`tasks.md` |
| workflow schema 不包含 `spec_review` | 不执行 Gate Review，路由回 `sf-router` 或 `sf-doctor` |

## 审查重点

1. PRD / requirements 边界是否清楚：PRD 负责产品决策，requirements 负责可测试行为。
2. UI 是否固定归一为 Pencil：有 UI 影响时必须有 Visual Style Brief、Pencil `.pen`、导出截图、状态矩阵和视觉质量修正记录。
3. Tech design 是否经过问答确认：关键技术、新增依赖、工具链、版本、SDK、部署和测试栈不能由 AI 静默决定；初稿后的核心决策摘要必须已确认、授权默认或明确 N/A。
4. Tasks 是否细：每个任务都要有核心字段 trace、files、verification、rollback、risk；impact、boundary、depends、testcase 按适用性检查，且验证任务独立存在。
5. 浏览器流程是否有 Playwright 用例、自动操作执行和证据登记要求。

## Gate 动作

写 `02-spec-review/spec-review-v1.md`，包含审查矩阵、追踪矩阵和 findings。

`APPROVED` 时：

```bash
node .specforge/core/scripts/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
```

`REQUEST_CHANGES` 或 `REJECTED` 时：

```bash
node .specforge/core/scripts/gate.mjs spec_review REQUEST_CHANGES
node .specforge/core/scripts/gate.mjs spec_review REJECTED
```

## 完成标准

- Artifact Review：review 文件存在，不更新 gate，明确返回路径。
- Gate Review：`spec-review-v1.md` 有明确 decision；`APPROVED` 时 gate 状态与 evidence 路径一致；未批准时 gate evidence 保持 `null`。
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

## 不做

- 不用空泛“看起来没问题”批准 gate。
- 不在 review 阶段顺手补实现。
- 不替前序阶段大段重写 requirements、ui_design、technical_design 或 tasks；只给出明确退回路径。
