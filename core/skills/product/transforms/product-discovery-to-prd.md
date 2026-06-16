# 产品发现到产品需求文档

| 产品发现内容 | 产品需求文档位置 |
|---|---|
| 目标结果 | 产品决策摘要 / 指标 |
| 机会 | 问题 / 背景 / 候选功能池 |
| 方案候选 | 候选功能池 |
| 最小可行版本建议 | 范围与最小可行版本决策，等待确认 |
| 实验 | 风险 / 路线图 / 验证 |
| 证据缺口 | 开放问题 / 需要研究 |

## 规则

- `mvp-recommended` 进入产品需求文档时必须标为候选，不能直接写入 PRD 的 MVP。
- 只有 `confirmation_status=user-confirmed-mvp` 或 `confirmation_status=delegated-default` 的方案，才能进入 PRD 的最小可行版本；`delegated-default` 必须在 PRD Decision JSON 的对应 MVP 项里写 `confirmation_type=delegated-default`、风险和回退点。
- 产品需求文档负责产品决策；产品发现只提供机会、候选、证据和推荐。
- 没有证据的机会只能写 likely / unclear。
