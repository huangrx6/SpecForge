# Code Review

Status: PENDING

## 1. 审查范围

| 项目 | 值 |
|---|---|
| 工作项 | |
| 工作流 | |
| Reviewer | |
| 日期 | |
| 上游 spec gate | APPROVED / SKIPPED / N/A |
| Diff 基准 / 命令 | |
| 真实状态命令 | `git status --short --untracked-files=all` |

## 2. 输入证据

| 证据 | 路径 / 命令 | 状态 | 备注 |
|---|---|---|---|
| Requirements / gap report | | pass / fail / N/A | |
| UI design | | pass / fail / N/A | |
| Technical design | | pass / fail / N/A | |
| Tasks | `01-spec/tasks.md` | pass / fail | |
| Spec review 证据 | `02-spec-review/spec-review-v1.md` | pass / fail / N/A | |
| Implementation report | `03-implementation/report.md` | pass / fail | |
| Changed files report | `03-implementation/changed-files.md` | pass / fail | |
| Git diff | | pass / fail | |
| 测试 / 启动证据 | | pass / fail / N/A | |

## 3. Diff 摘要

| 文件 / 区域 | 变更摘要 | 关联任务 | 在批准边界内？ | 风险 |
|---|---|---|---|---|
| | | | yes / no | |

### Diff 对账

| 检查项 | 结果 | 证据 / 备注 |
|---|---|---|
| `git status --short --untracked-files=all` 已检查 | pass / fail | |
| `git diff --name-only` 与 `changed-files.md` 一致 | pass / fail | |
| 未追踪文件已登记或排除 | pass / fail / N/A | |
| 登记但无真实 diff 的文件已有解释 | pass / fail / N/A | |
| 批准边界外偏离已在 implementation report 中说明 | pass / fail / N/A | |

## 4. 任务覆盖

| 任务 | Impact | 预期结果 | 实现证据 | 验证证据 | 状态 |
|---|---|---|---|---|---|
| T001 | | | | | pass / fail / N/A |

## 5. Spec 符合性

| Spec 条目 | 预期行为 / 约束 | 实现证据 | 缺口 |
|---|---|---|---|
| | | | |

## 6. Technical Design 影响面实现审查

> 仅在 `technical-design.md` 适用时填写；否则写 N/A。检查 `technical-design.md#0. 影响面与读取计划` 中每个影响面是否被正确实现、跳过或退回。

| 影响面 | Approved status | 预期实现 / N/A 理由 | 真实 diff / 证据 | 验证证据 | 结论 |
|---|---|---|---|---|---|
| Frontend engineering | yes / no / unknown / N/A | | | | pass / fail / N/A |
| Backend engineering | yes / no / unknown / N/A | | | | pass / fail / N/A |
| Domain model / state machine | yes / no / unknown / N/A | | | | pass / fail / N/A |
| API / SDK / Events | yes / no / unknown / N/A | | | | pass / fail / N/A |
| Data / DB / Migration | yes / no / unknown / N/A | | | | pass / fail / N/A |
| Auth / Permission / Security | yes / no / unknown / N/A | | | | pass / fail / N/A |
| Config / Env / Delivery | yes / no / unknown / N/A | | | | pass / fail / N/A |
| Jobs / Queue / Scheduler | yes / no / unknown / N/A | | | | pass / fail / N/A |
| Observability / Reliability | yes / no / unknown / N/A | | | | pass / fail / N/A |

## 7. 风险检查

| 领域 | 结果 | 证据 / 备注 |
|---|---|---|
| 范围和边界 | pass / fail | |
| 安全 / 权限 | pass / fail / N/A | |
| 数据 / 迁移 / 回滚 | pass / fail / N/A | |
| API / 兼容性 | pass / fail / N/A | |
| UI 状态 / 无障碍 | pass / fail / N/A | |
| 后台任务 / 并发 / 幂等 | pass / fail / N/A | |
| 配置 / 密钥 / 环境变量 | pass / fail / N/A | |
| 可观测性 / 日志 / 指标 | pass / fail / N/A | |
| 依赖 / 构建 / 脚手架 | pass / fail / N/A | |
| 测试和启动验证 | pass / fail | |
| Wiki 影响识别 | pass / fail / N/A | |

## 8. 问题列表

| 等级 | 位置 | 问题 | 影响 | 建议修复 | 需要补充的证据 |
|---|---|---|---|---|---|
| P0 / P1 / P2 / P3 | file:line / artifact section | | | | |

## 9. 残余风险

-

## 10. 验证提示

-

## 11. Wiki 影响

-

## 12. 决策

可选值：APPROVED, REQUEST_CHANGES, REJECTED.

## 13. Gate 更新

APPROVED 时执行：

```bash
node .specforge/core/scripts/gate.mjs code_review APPROVED --evidence 04-code-review/code-review-v1.md
```

REQUEST_CHANGES 或 REJECTED 时执行其一：

```bash
node .specforge/core/scripts/gate.mjs code_review REQUEST_CHANGES
node .specforge/core/scripts/gate.mjs code_review REJECTED
```
