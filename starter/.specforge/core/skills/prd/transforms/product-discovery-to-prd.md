# 产品发现转产品需求文档

| 产品发现内容 | 产品需求文档位置 |
|---|---|
| 期望结果 | 产品决策摘要 / 指标 |
| 机会 | 问题 / 背景 / 候选功能池 |
| 方案候选 | 候选功能池 |
| `confirmation_status=user-confirmed-mvp` | 范围与最小可行版本决策 |
| `confirmation_status=delegated-default` | 范围与最小可行版本决策，必须写风险和回退点 |
| `confirmation_status=mvp-recommended` | 候选功能池 / 开放问题，不能直接进入最小可行版本 |
| 实验 | 风险 / 路线图 / 验证 |
| 优先级评分 | 范围与最小可行版本决策理由 |
| 证据缺口 | 开放问题 / 需要预研 |

## 规则

- 机会不是功能，不能直接写成最小可行版本。
- 方案候选不是已确认范围，必须经过用户确认或授权默认。
- Product discovery 的 `mvp-recommended` 不能直接写入 PRD 的 `mvp[]`；只有 `user-confirmed-mvp` 或 `delegated-default` 能转成 PRD Decision JSON 的 MVP 项。
- `delegated-default` 转入 PRD 时，写入具体 MVP 项的 `confirmation_type=delegated-default`，并补齐 `risk`、`handoff` 和回退点；不要把 PRD 顶层 `decision_status` 写成 `delegated-default`。
- 实验不等于发布计划，只能作为验证或预研交接。
- 没有证据的机会只能写“可能”或“假设”，不能写“已确认”。

## 示例

```md
机会：客户经理无法快速判断哪些客户最需要优先跟进。
方案候选：到期提醒列表 + 优先级排序。
产品需求文档最小可行版本决策：到期提醒列表进入最小可行版本；自动排序作为可选增强，原因是优先级口径未确认。
```
