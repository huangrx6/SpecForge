# 门禁规则入口

门禁用于回答一个问题：当前工作是否已经具备进入下一阶段的证据。它不是礼貌性签字，而是机器可读、可回溯、可阻断的流程决策。

## 什么时候启用

- `spec_review`、`code_review`、`verification`、`ssot_sync`。
- `specforge-work` 自动推进。
- 任何需要决定“现在能不能继续”的阶段。

## 按需加载参考

| 场景 | 继续读取 |
|---|---|
| 状态值、证据文件、记录字段 | `references/status-evidence.md` |
| 阶段推进、阻断条件、重新审查 | `references/progression-blockers.md` |
| 自动推进、高风险暂停、工作流与 gate 的协作 | `references/automation-policy.md` |

## Required Gates

| Gate | 适用范围 | Evidence |
|---|---|---|
| `spec_review` | `feature`、`standard`、`refactor`，以及高风险方案评审 | `02-spec-review/spec-review-v1.md` |
| `code_review` | `feature`、`standard`、`lite`、`bugfix`、`refactor`，以及任何写代码的变更 | `04-code-review/code-review-v1.md` |
| `verification` | 所有写代码或改变运行结果的变更 | `05-verification/report.md` 或 `ci-result.md` |
| `ssot_sync` | 所有 closed changes，包括纯 discovery | `06-closure/ssot-sync.md` |

是否 required 以当前 change 的 workflow schema 为准；`change.yaml` 中不适用的 gate 应标为 `required: false` 和 `SKIPPED`，不能显示成永远 pending 的假阻塞。

## 核心原则

- gate 的依据是产物和证据，不是聊天里的口头认可。
- `SKIPPED` 不等于通过。
- `REQUEST_CHANGES` 必须回到对应产物修正。
- `REJECTED` 表示当前方向不可继续，应关闭、重建或重新 intake。
- 自动推进不能绕过 required gate。

Kiro、Spec Kit 与 OpenSpec 都强调多阶段产物和逐步 refinement；SpecForge 的 gate 是在这条路径上再增加“机器可阻断”的显式决策层。
