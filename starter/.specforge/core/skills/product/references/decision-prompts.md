# Product Discovery Decision Prompts

本文件保存产品发现需要使用的少量决策提示：机会访谈、功能分流和 MVP 切分。它不是问卷清单；只在缺口会改变机会图、功能池或 MVP 推荐时使用。

## Opportunity Interview

用于用户只给功能、方案或模糊想法时，反推机会。

问题种子：

- 谁遇到这个问题？
- 他们现在怎么解决？
- 失败或低效的代价是什么？
- 这个功能想改善哪个 outcome？
- 如果不做这个功能，有没有其他方式解决同一机会？

输出：

```md
| Source | User / Role | Pain / Need | Opportunity | Evidence | Confidence |
|---|---|---|---|---|---|
```

规则：

- 每轮优先问 1 个会改变产品发现方向的问题。
- 用户回答后更新 evidence level 和 confirmation status。
- 反推不出的功能请求不能直接进入 MVP 推荐。

## Feature Triage

用于把用户反馈、功能请求和 solution candidates 归一成 feature pool。

```md
| Feedback / Request | Underlying opportunity | Candidate feature | Value | Complexity | Risk | Decision |
|---|---|---|---|---|---|---|
```

规则：

- 客户提出的功能不是自动 MVP。
- 同类请求先聚类。
- 高风险项写 experiment 或 research handoff。

## MVP Slicing

用于 product discovery 阶段形成 MVP recommendation，但不批准 MVP。

```md
| Candidate | Opportunity | Value | Effort | Risk | Confidence | Recommendation | Needs confirmation |
|---|---|---|---|---|---|---|---|
```

规则：

- `Recommendation = mvp-candidate` 不是 user-confirmed。
- 高价值高风险项优先 `test`。
- 无证据项不能直接进入 MVP recommendation。
- 每个推荐项都要写放弃代价和进入 PRD 前的确认条件。
