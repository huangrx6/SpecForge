# Request To Opportunity Map

## 输入

- 用户原始请求。
- brief。
- brainstorm。
- research。
- wiki。
- 产品反馈。
- 业务指标。

## 输出

```md
| Source | User / Role | Pain / Need | Opportunity | Evidence | Confidence |
|---|---|---|---|---|---|
```

## Rules

- 如果 source 是功能请求，先反推 pain / need。
- 如果没有 evidence，confidence = unclear。
- 如果机会影响 MVP，需要用户确认。
- 机会不能直接变成需求，必须经过 solution / scope decision。
