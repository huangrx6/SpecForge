---
name: code-review
description: SpecForge 内部代码审查技能。用于 implementation 完成后，对照 approved spec、tasks、implementation report、changed files、真实 diff 和验证证据判断 code_review gate。
---

# Code Review Skill

本技能审查实现是否符合已批准 spec、任务边界、工程规则和安全边界。审查重点是缺陷、回归、越界、漏测和证据缺口，不是代码风格偏好。

## 读取

- `work.yaml`
- `00-intake/brief.md`
- `01-spec/requirements.md`（存在时）
- `01-spec/gap-report.md`（bugfix / issue）
- `01-spec/ui-design.md`（存在时）
- `01-spec/technical-design.md`（存在时）
- `01-spec/tasks.md`
- `02-spec-review/spec-review-v1.md`（存在且 required 时）
- `03-implementation/report.md`
- `03-implementation/changed-files.md`
- 当前 `git status --short --untracked-files=all`、`git diff --name-only`、`git diff --stat`、关键文件 diff、测试输出或验证证据
- `.specforge/core/standards/engineering.md`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/skills/ORCHESTRATION.md`（需要外部 code review 参考时）
- `.specforge/core/skills/quality/code-reviewer/SKILL.md`（需要安全、性能、正确性、可维护性补充检查清单时）

## 写入

- `04-code-review/code-review-v1.md`
- 通过 `node .specforge/core/scripts/gate.mjs code_review <status> ...` 更新门禁。`APPROVED` 必须带 `--evidence 04-code-review/code-review-v1.md`；`REQUEST_CHANGES` / `REJECTED` 不带 evidence。

## 审查流程

1. **确认 gate 前置**
   - 若 workflow 有 required `spec_review`，必须已 `APPROVED`。
   - `implementation` artifact 必须完成：`plan.md`、`report.md`、`changed-files.md`。
2. **收集真实 diff**
   - 读取 `git status --short --untracked-files=all`、`git diff --name-only`、`git diff --stat` 和关键文件 diff。
   - 对比 `03-implementation/changed-files.md`，发现未登记变更或登记但无 diff 的项。
3. **建立任务覆盖矩阵**
   - 每个 `tasks.md` 任务检查状态、相关文件、实现证据和验证证据。
   - 每个完成任务的 `_Impact:_` 必须与真实 diff 和 implementation report 的 technical_design 影响面对账一致。
   - 未完成任务不能靠口头说明通过。
4. **三向对账**
   - 每个真实 diff 文件必须能追溯到 approved spec、`tasks.md` 的 `_Boundary:_` 或 implementation report 中的批准偏离说明。
   - 每个完成任务必须能追溯到至少一个真实变更或可信 N/A，以及至少一个验证证据或可信 deferred 理由。
   - `changed-files.md`、implementation report、真实 git diff 三者不一致时，先记 finding，不允许靠口头解释通过。
5. **先做 Spec Compliance Review**
   - feature / standard / lite：对照 requirements、适用 ui_design、technical_design。
   - bugfix / issue：对照 gap_report 的根因、修复策略和回归测试。
   - refactor：对照 technical_design 的行为不变边界和回归策略。
   - 若实现与 approved spec 不一致，优先记录 P0 / P1，不继续用代码质量建议掩盖规格偏离。
6. **再做 Code Quality / Risk Review**
   - 只在 spec compliance 没有阻断偏离后，继续审查工程质量、安全、可维护性和测试证据。
   - 需要补充检查视角时，按 `.specforge/core/skills/ORCHESTRATION.md` 读取本地 `code-reviewer` skill，只加载相关 rule 文件，并把结论归一为本审查的 finding。不得调用任何外部 code-reviewer agent，包括 `code-reviewer` 和 `superpowers:code-reviewer`。
   - `code-reviewer` 是风险清单，不是 gate 入口；不得复制其模板标题或用泛泛建议替代文件 / 行号 / 影响 / 修复方向。
7. **对照 technical-design 影响面**
   - `yes` 影响面必须有对应代码 / 配置 / 文档变更和验证证据；若实现阶段决定不做，必须在 implementation report 中写明偏离、风险和退回路径。
   - `no` 影响面不得出现未经批准的真实 diff；例如 technical design 判定无数据影响，却新增 migration、schema、ORM model 或持久化字段。
   - `unknown` 不得直接落地实现；凡在 code review 才发现的架构、数据、安全、成本、外部契约、发布或可靠性未知项，必须退回 spec。
8. **审查工程风险**
   - 安全、权限、输入校验、日志脱敏、secret、错误处理、并发、幂等、兼容性、配置默认值、新依赖、迁移和回滚。
9. **审查验证证据**
   - 验证是否覆盖正常、异常、边界、权限和回归路径。
   - UI 变更是否覆盖页面 × 操作 × 角色矩阵或有等价人工证据。
   - 启动、配置、迁移、回滚、可观测性在适用时是否已有证据或明确留给 verification。

## 阻断规则

以下情况不得批准：

- 真实 diff 超出 tasks 边界，且没有 approved spec 依据。
- 真实 diff、changed-files、implementation report 三者不一致，且缺少可信解释。
- technical_design 中为 `no` 的影响面出现未经批准的代码改动，或 `unknown` 被直接实现。
- technical_design 中为 `yes` 的影响面缺少实现证据、验证证据或明确偏离说明。
- tasks 中 P0 / P1 / 核心任务未实现，或 implementation report 与实际 diff 不一致。
- 完成任务的 `_Impact:_` 与真实 diff 或 implementation report 的影响面对账冲突。
- required 测试、启动验证、迁移、权限或安全证据缺失。
- 引入 secret、敏感日志、越权路径、危险默认配置或未受控外部调用。
- API、数据模型、配置、权限、后台任务或 UI 状态偏离 approved design。
- 新依赖、新脚手架或环境变量缺少用途、风险和验证说明。
- bugfix 没有证明根因被修复，或缺少回归测试 / 替代证据。
- refactor 改变用户可见行为却没有对应 requirements / spec 变更。

## 问题格式

每条问题必须包含：

- 严重程度：`P0`、`P1`、`P2`、`P3`。
- 文件和行号；无法定位到行时，指向 artifact 章节或 diff 文件。
- 问题。
- 影响。
- 建议修复方向。
- 需要补充的证据（如适用）。

## 状态规则

| 状态 | 使用条件 |
|---|---|
| `APPROVED` | 没有 P0 / P1 finding，残余风险可接受 |
| `REQUEST_CHANGES` | 有可修复缺口，修完后回到 `sf-implement` 再重审 |
| `REJECTED` | 实现方向明显偏离 spec、风险不可接受或需要回到前序 spec |

## 输出要求

- 问题按严重程度排序。
- 问题优先列 bug、风险、越界和缺证据，不把风格建议放前面。
- 批准时也要写残余风险和 verification 注意事项。
- 未批准时说明下一步修复范围和 owner。

## 完成标准

- review 文件存在。
- `APPROVED` 时 gate 状态和证据路径一致。
- `REQUEST_CHANGES` / `REJECTED` 时 gate 状态已更新且 evidence 为 `null`。
- 未批准时下一步修复范围明确。
