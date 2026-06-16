---
name: code-review
description: SpecForge 本地代码审查主能力包。用于 sf-code-review 执行 code_review gate 前，对照 approved spec、tasks、implementation report、changed-files、真实 git diff 和验证证据审查实现是否可批准。
---

# Code Review

本能力包是 SpecForge 自有 code review 主能力，不是外部 PR review 模板。它把真实 diff、已批准规格、任务、实现报告和证据对齐起来，帮助 `sf-code-review` 判断 code_review gate。

## 负责

- 真实 diff 是否符合 approved spec。
- implementation report、changed-files、git diff 是否一致。
- tasks 是否真实完成，并且有实现和验证证据。
- requirements、gap report、UI design、technical design 是否被实现。
- 是否出现越界修改、未批准依赖、环境变量、迁移、外部调用或权限路径。
- 是否存在安全、数据、权限、配置、并发、错误处理、测试证据缺口。
- 是否可以批准 code_review gate。

## 不负责

- 不基于个人风格阻断。
- 不在 review 阶段顺手改代码。
- 不引入外部 reviewer 或第三方 review 模板替代 SpecForge gate。
- 不在没有真实 diff 和证据的情况下批准。

## 读取顺序

1. `work.yaml`
2. `01-spec/requirements.md`、`01-spec/gap-report.md`、`01-spec/ui-design.md`、`01-spec/technical-design.md`、`01-spec/tasks.md`
3. `02-spec-review/spec-review-v1.md` 和 gate evidence
4. `03-implementation/report.md`
5. `03-implementation/changed-files.md`
6. `git status --short --untracked-files=all`、`git diff --name-only`、`git diff --stat` 和关键文件 diff
7. 测试输出、启动输出、截图、trace、日志、CI 链接
8. `.specforge/wiki/` 中的长期模块边界
9. 必要时按本能力包内置 checklist 深入安全、性能、正确性、可维护性、测试证据等风险。

## 参考文件路由

| 需要判断 | 读取 |
| --- | --- |
| 阶段边界、不能做什么 | `foundations/review-boundary.md` |
| finding 等级和 gate 影响 | `foundations/finding-severity.md` |
| diff / changed-files / report 三向对账 | `foundations/diff-triage.md` |
| approved spec 是否被实现 | `foundations/spec-compliance.md` |
| 安全、权限、数据风险 | `checklists/security-auth-data.md` |
| 正确性、错误处理、并发、幂等 | `checklists/correctness-error-handling.md`、`checklists/concurrency-idempotency.md` |
| API、迁移、配置、依赖 | `checklists/api-contract.md`、`checklists/data-migration.md`、`checklists/dependency-env-config.md` |
| UI 状态和可访问性 | `checklists/ui-state-a11y.md` |
| 测试和证据完整性 | `checklists/tests-evidence.md` |
| 输出结构 | `references/output-contract.md` |
| 常见失败 | `references/anti-patterns.md` |

## 核心流程

1. 做 gate 前置检查：required upstream gate、implementation artifact、review 输入是否存在。
2. 收集真实 diff：包含 staged、unstaged、untracked，并明确 review commit / diff 范围。
3. 三向对账：`changed-files.md`、implementation report、git diff 必须能互相解释。
4. 建 tasks 覆盖矩阵：每个完成任务都追溯到 diff、验证证据或可信 N/A。
5. 做 spec compliance review：先查规格偏离，再查工程质量。
6. 对 architecture / implementation handoff / operability 承诺做对账。
7. 按风险清单审查安全、权限、数据、API、UI、配置、依赖、并发、错误处理和证据。
8. 按 `finding-severity.md` 分级 finding。
9. 写 `04-code-review/code-review-v1.md`。
10. 输出 gate decision：`APPROVED`、`REQUEST_CHANGES` 或 `REJECTED`。

## 完成标准

- Review 文件包含证据矩阵、diff 对账、spec compliance、risk review、findings、residual risks、verification notes 和 decision。
- 每个 P0 / P1 finding 都有 location、impact、required fix 和 evidence needed。
- `APPROVED` 时没有 P0 / P1，P2 / P3 已写 residual risks 和 verification notes。
- `REQUEST_CHANGES` / `REJECTED` 时下一步修复范围清楚。
