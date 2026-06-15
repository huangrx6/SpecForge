# Evidence Levels

Product discovery 必须标注证据强度，避免把直觉写成事实。

| Level | 含义 | 可用于 |
|---|---|---|
| `confirmed` | 用户确认、研究结论、日志数据、wiki 事实或已批准 artifact 支撑 | opportunity / PRD input |
| `likely` | 有合理推断或弱证据，但未确认 | candidate / assumption |
| `unclear` | 缺证据或冲突 | open question / research-needed |

## Rules

- 不伪造用户研究数据、RICE 分数、baseline 或 market fact。
- 高风险 MVP recommendation 需要 `confirmed` 或用户授权默认。
- `unclear` 不能直接进入 PRD MVP。
