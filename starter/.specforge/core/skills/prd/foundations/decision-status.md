# PRD Decision Status

| Status | Meaning | Required action |
|---|---|---|
| `draft` | PRD 正在生成 | 不进入 requirements |
| `needs-decision` | 需要用户或业务负责人确认 | 停止并提问 |
| `research-needed` | 缺事实、数据、竞品、合规或 AI 能力证据 | 转 discovery / research |
| `delegated-default` | 用户授权默认推荐 | 写风险和回退点 |
| `approved-for-requirements` | 可进入 requirements | 运行 instructions 并路由 |
| `blocked-by-conflict` | 上游输入冲突 | 列冲突并等待决策 |

## Rules

- 只有 `approved-for-requirements` 可以作为 `sf-requirements` 的正式输入。
- `delegated-default` 必须带 risk note 和 rollback point。
- `needs-decision` 不能被 Agent 自动降级为 assumption。
- `research-needed` 不能包装成“暂按经验判断”。
- `blocked-by-conflict` 必须指出冲突来源、影响范围和需要谁决策。

## Output

```md
Decision Status:
- Status:
- Reason:
- Can enter requirements: yes / no
- Risk note:
- Rollback point:
- Needed decision:
```
