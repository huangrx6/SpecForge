# Product Discovery Boundary

## Product discovery 可以决定

- 用户问题空间。
- 机会分类。
- 候选功能池。
- 功能优先级建议。
- 实验设计。
- MVP 推荐。
- 需要 PRD / brainstorm / research 的下游路径。

## Product discovery 不可以决定

- 最终 MVP 批准。
- requirements MUST / SHALL。
- UI 方案。
- 技术方案。
- 上线排期。
- 预算承诺。

## 确认状态

| 状态 | 含义 | 可进入 PRD |
|---|---|---|
| `opportunity-confirmed` | 用户或研究确认的问题机会 | yes |
| `solution-candidate` | 候选解决方案 | candidate only |
| `mvp-recommended` | Agent 推荐的 MVP | needs user confirmation |
| `user-confirmed-mvp` | 用户确认 MVP | yes |
| `delegated-default` | 用户授权按默认推荐推进 | yes, with risk note |
| `pending` | 尚未确认 | candidate only |
| `needs-research` | 需要补研究 | no |
| `experiment-needed` | 需要实验验证 | maybe, as risk |

## Boundary Rule

Product discovery 可以推荐，不可以批准。任何 `mvp-recommended` 进入 PRD 前，都必须成为 `user-confirmed-mvp` 或 `delegated-default`。
