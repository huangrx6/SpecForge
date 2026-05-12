# Gate 规则

Gate 是决策点，用来防止范围不清、边界破损或证据不足的工作进入下一阶段。

## Gate 状态值

只能使用这些状态：

- `PENDING`
- `APPROVED`
- `REQUEST_CHANGES`
- `REJECTED`
- `SKIPPED`

`SKIPPED` 必须写明原因，并且只在 workflow 允许该 gate 可选时使用。

## Required Gates

| Gate | 适用范围 | Evidence |
|---|---|---|
| `spec_review` | standard、偏企业级的变更 | `02-spec-review/spec-review-v1.md` |
| `code_review` | standard、bugfix、安全敏感变更 | `04-code-review/code-review-v1.md` |
| `verification` | 所有变更 | `05-verification/report.md` 或 `ci-result.md` |
| `ssot_sync` | 所有 closed changes | `06-closure/ssot-sync.md` |

## 阶段推进规则

- spec review 未批准，不进入 implementation。
- code review 未批准，不进入 verification。
- verification 未批准，不进入 closure。
- SSoT sync 未批准，不归档。
- 如果下游 change 因上游契约缺陷失败，先修上游 owner。
