# 审查输出格式

## 结论值

- `APPROVED`
- `REQUEST_CHANGES`
- `REJECTED`

## 建议结构

```text
Status: REQUEST_CHANGES

Findings
- [P1] <问题> - <文件或产物>

Evidence
- Checked: ...
- Missing: ...

Required changes
- ...
```

## 严重级别

- `P0`：会导致安全事故、数据损坏、生产不可用或错误发布。
- `P1`：会导致功能错误、权限问题、明显回归或 gate 不应通过。
- `P2`：质量、维护性或测试缺口，建议本 work item 修复。
- `P3`：非阻断建议。

## 写法要求

- 说问题，也说为什么是问题。
- 说清修复后如何复审。
- 区分阻断项和 nit。
- 对好实践可以留正向反馈。

Google 的 review guidance 也强调评论应解释“为什么”，并鼓励对好的实现给出正向反馈。
