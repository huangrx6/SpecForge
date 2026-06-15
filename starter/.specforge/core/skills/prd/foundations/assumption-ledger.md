# Assumption Ledger

PRD 可以记录假设，但不能把假设伪装成已确认事实。所有假设都必须影响可见、owner 明确、触发复核。

## Assumption Types

| 类型 | 含义 | PRD 处理 |
|---|---|---|
| `confirmed` | 用户、PRD 上游、research 或 wiki 已确认 | 可作为 MVP / metric / non-goal 依据 |
| `delegated-default` | 用户授权 Agent 默认推进 | 可进入 PRD，但写 risk note 和 rollback point |
| `likely` | 有弱证据或合理推断 | 只能写 assumption，不作为 approved MVP 唯一依据 |
| `unclear` | 无足够证据 | 写 Open Question 或 research-needed |
| `conflict` | 上游材料互相冲突 | 写 blocked-by-conflict |

## Ledger Format

```md
| Assumption / Fact | Type | Evidence | Impact | Owner | Revisit trigger |
|---|---|---|---|---|---|
```

## Rules

- 高影响假设不能隐藏在正文里。
- 影响 MVP、数据权限、AI 质量、合规或成本的假设必须有 owner。
- `unclear` 不能进入 `approved-for-requirements`，除非它不影响 MVP 和 handoff。
- `delegated-default` 必须写明回退点。
