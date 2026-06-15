# Open Question Review Prompt

用于 PRD 写完前检查高影响未知是否被隐藏。

## Review

| Question | Impact | Owner | Needed by | Status |
|---|---|---|---|---|

## Blocking Rules

- 影响 MVP、目标用户、成功指标、数据权限、AI 质量、合规、成本的 open question 必须阻断或指定 owner / needed-by。
- 如果 open question 阻断 requirements，Decision Status 不能是 `approved-for-requirements`。
- 低影响未知可以进入 assumption ledger，但要写 revisit trigger。
