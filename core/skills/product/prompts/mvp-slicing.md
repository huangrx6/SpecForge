# MVP Slicing Prompt

用于 product discovery 阶段形成 MVP recommendation，但不批准 MVP。

```md
| Candidate | Opportunity | Value | Effort | Risk | Confidence | Recommendation | Needs confirmation |
|---|---|---|---|---|---|---|---|
```

Rules:

- `Recommendation = mvp-candidate` 不是 user-confirmed。
- 高价值高风险项优先 `test`。
- 无证据项不能直接进入 MVP recommendation。
