# Test Design Tree

测试设计树用于把规格、任务和风险转成可审查的测试空间。它可以派生为 XMind，但 Markdown / JSON 才是 SpecForge 事实源。

## 推荐结构

```text
Work Item Goal
├── Business behavior
│   ├── REQ / AC / GAP
│   └── Assertions
├── Roles and permissions
│   ├── allowed role
│   ├── denied role
│   └── data scope
├── API / data contract
│   ├── request validation
│   ├── success response
│   ├── error response
│   └── persistence / migration
├── UI flows
│   ├── happy path
│   ├── loading / empty / error
│   ├── boundary
│   └── responsive
├── Failure modes
│   ├── network / timeout
│   ├── third-party failure
│   └── retry / idempotency
└── Operations
    ├── startup / config
    ├── observability
    └── rollback
```

## 节点规则

- 每个叶子节点必须能生成 TC 或 PW。
- 每个节点都要标来源：`REQ-*`、`AC-*`、`GAP-*`、`Txxx`、`UI-*`、`TD-*`、`REVIEW-*`。
- 叶子节点写断言，不写泛泛动作。
- XMind 中的颜色、图标、优先级只能作为阅读辅助；不能替代 risk / evidence 字段。

## Markdown 导出格式

```markdown
# Test Design Tree

- Goal: <work item goal>
  - Business behavior
    - [REQ-001][high][TC-001] User can submit valid form and receive success state.
  - Roles and permissions
    - [AC-003][high][TC-002/PW-001] Unauthorized user sees permission error and no data mutation occurs.
```

## JSON 导出格式

```json
{
  "goal": "work item goal",
  "nodes": [
    {
      "id": "node-001",
      "title": "Unauthorized user cannot submit",
      "source": ["AC-003", "T012"],
      "risk": "high",
      "cases": ["TC-002", "PW-001"],
      "evidenceTarget": "proven"
    }
  ]
}
```
