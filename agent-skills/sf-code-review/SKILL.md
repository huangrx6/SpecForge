---
name: sf-code-review
description: 执行 SpecForge code_review gate；用于 implementation 完成后，对照 approved spec、tasks、implementation report、changed files 和真实 diff 审查实现是否满足规格、工程规则、安全边界和验证要求。
---

# sf-code-review

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

审查实现是否符合已批准 spec、任务边界、工程规则和安全边界。审查重点是缺陷、回归、越界、漏测和证据缺口，不是代码风格偏好。

## 启动

运行：

```bash
node .specforge/core/scripts/artifact-graph-status.mjs
node .specforge/core/scripts/instructions.mjs
```

确认 ready artifact 为 `code_review`，再生成审查产物：

```bash
node .specforge/core/scripts/create-artifact.mjs code_review
```

## 内部技能母本

执行 code_review 前，读取 `.specforge/core/workflows/stages/code-review/SKILL.md`。审查输入、finding 格式、状态规则和完成标准以内置母本为准。

## 关联标准

- `.specforge/core/standards/workflow.md`：gate 状态、evidence、scope 和边界违规判断。
- `.specforge/core/standards/engineering.md`：代码健康、安全、权限、测试证据、配置、回滚和工程规范一致性。

## 必读证据

根据 workflow 读取适用 spec：

| Workflow / 条件 | 必读规格 |
|---|---|
| `feature` / `standard` / `lite` | `requirements.md`、`tasks.md`，适用的 `ui-design.md` / `technical-design.md` |
| `bugfix` / `issue` | `gap-report.md`、`tasks.md` |
| `refactor` | `technical-design.md`、`tasks.md` |
| 有 `spec_review` gate 且 required | `spec_review` 必须为 `APPROVED`，并读取 evidence |

无论 workflow 如何，都必须读取：

- `03-implementation/report.md`
- `03-implementation/changed-files.md`
- 当前 `git status --short --untracked-files=all`、`git diff --name-only`、`git diff --stat` 和关键文件 diff
- 已记录的测试、启动验证、迁移、回滚或人工验证证据

## 审查检查项

按顺序审查：

1. **Gate 和证据完整性**
   - required 的上游 gate 是否已批准。
   - implementation report、changed-files 是否存在且与真实 diff 一致。
2. **任务覆盖**
   - `tasks.md` 中每个完成任务是否有代码变更或明确 N/A。
   - 每个完成任务的 `_Impact:_` 是否与真实 diff 和 implementation report 的 technical_design 影响面对账一致。
   - 每个 `_Verification:_` 是否有对应测试、命令、截图、日志或人工证据。
3. **三向对账**
   - 每个真实 diff 文件都能追溯到 `tasks.md` 的 `_Boundary:_`、approved requirements / gap_report / ui_design / technical_design 或明确 N/A。
   - `03-implementation/changed-files.md` 必须覆盖真实 diff；未登记文件、登记但无 diff、未追踪文件都要解释。
   - implementation report 的“偏离与补偿”必须覆盖所有批准边界外的实现偏差。
4. **范围和边界**
   - 真实 diff 是否都能追溯到 `_Boundary:_` 或 approved spec。
   - 是否混入无关重构、格式化、依赖升级或大范围目录整理。
5. **Spec Compliance Review 先行**
   - 实现是否满足 requirements / gap_report / ui_design / technical_design。
   - UI 状态、API 契约、权限、数据迁移、后台任务、可观测性是否与设计一致。
   - technical_design 的 `yes` 影响面必须有对应代码 / 配置 / 文档变更和验证证据；`no` 影响面不得出现未经批准的真实 diff。
   - technical_design 的 `unknown` 若在 spec_review 已批准后仍以代码方式落地，必须视为范围偏离。
   - 若存在规格偏离，先给 P0 / P1 finding 和 return path，不用代码风格建议冲淡主要风险。
6. **Code Quality / Risk Review**
   - 安全、权限、输入校验、日志脱敏、secret、错误处理、并发、幂等、兼容性、配置默认值是否安全。
   - 新依赖、新脚手架、新环境变量是否有说明和验证。
7. **测试和运行证据**
   - 测试覆盖是否匹配风险，不只测 happy path。
   - 启动验证、迁移 / 回滚、观察点在适用时是否执行或安排。
8. **Wiki 影响**
   - API、数据模型、配置、运行方式、产品规则或术语变化是否在 report 中标记给 `sf-wiki`。

## Finding 分级

| 等级 | 含义 | gate 影响 |
|---|---|---|
| `P0` | 会导致错误交付、数据 / 权限 / 安全事故、生产不可恢复或明显违背 spec | 必须 `REJECTED` 或 `REQUEST_CHANGES` |
| `P1` | 进入 verification 前必须修复的功能、边界、测试或安全缺口 | 必须 `REQUEST_CHANGES` |
| `P2` | 可进入 verification，但需要明确跟进或补证据 | 可批准但记录残余风险 |
| `P3` | 非阻断的可维护性建议 | 不阻断 |

## 动作

1. 写 `04-code-review/code-review-v1.md`，包含输入证据矩阵、diff 摘要、任务覆盖、风险检查、findings 和 decision。
2. 决策为 `APPROVED` / `REQUEST_CHANGES` / `REJECTED`。
3. `APPROVED` 时更新 gate：

```bash
node .specforge/core/scripts/gate.mjs code_review APPROVED --evidence 04-code-review/code-review-v1.md
```

4. `REQUEST_CHANGES` 或 `REJECTED` 时，更新 gate 状态但不带 evidence：

```bash
node .specforge/core/scripts/gate.mjs code_review REQUEST_CHANGES
```

## 完成标准

- `code-review-v1.md` 有明确 decision。
- `APPROVED` 时 gate 状态与 evidence 路径一致。
- `REQUEST_CHANGES` / `REJECTED` 时 gate 状态已更新，evidence 保持 `null`。
- 未批准时下一步修复范围明确，通常回到 `sf-implement`。

## 不做

- 不用空泛“看起来没问题”批准 gate。
- 不在 review 阶段顺手修实现。
- 不因为个人风格偏好阻断，除非已经违反 approved spec、项目规则或工程风险底线。
