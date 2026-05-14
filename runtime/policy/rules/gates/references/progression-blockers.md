# 推进与阻断

## 推进规则

- spec review 未批准，不进入 implementation。
- code review 未批准，不进入 verification。
- verification 未批准，不进入 closure。
- ssot sync 未批准，不归档。

## Gate 输入与结论

| Gate | 输入 | 批准条件 | 拒绝或要求修改条件 |
|---|---|---|---|
| `spec_review` | requirements、可适用的 ui_design、可适用的 technical_design、tasks | 需求可验证、UI 与技术设计可实现、任务可执行、边界清晰 | 验收不可测、owner 不清、风险未处理 |
| `code_review` | diff、changed-files、spec | 实现匹配 spec、风险可接受、无明显回归 | 越界改动、安全问题、缺测试、行为偏离 |
| `verification` | 测试、CI、手工证据 | 关键验收通过，缺口已记录 | 无证据、失败未解释、只跑无关测试 |
| `ssot_sync` | release、rollback、SSoT diff | 长期事实已同步或明确无需同步 | API、架构、数据、配置变化未回写 |

## 必须阻断的情况

- 当前产物缺失有效 workflow schema 要求的输入。
- 变更目标、非目标、owner 或验收标准不清。
- 安全、权限、数据迁移、生产配置变更没有设计和验证。
- 代码改动超出批准范围。
- 验证证据无法支撑验收。
- 长期事实改变但没有 SSoT sync。

## 重新审查

`REQUEST_CHANGES` 后必须：

1. 回到对应 artifact 修正。
2. 更新证据。
3. 重新执行 gate。

不得直接手工把状态改成 `APPROVED`。
