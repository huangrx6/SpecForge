# 产品需求文档决策状态

| 状态 | 含义 | 要求动作 |
|---|---|---|
| `draft` | 产品需求文档正在生成 | 不进入需求阶段 |
| `needs-decision` | 需要用户或业务负责人确认 | 停止并提问 |
| `research-needed` | 缺事实、数据、竞品、合规或 AI 能力证据 | 转产品发现或预研 |
| `delegated-default` | 用户授权默认推荐 | 写风险和回退点 |
| `approved-for-requirements` | 可进入需求阶段 | 运行指令检查并路由 |
| `blocked-by-conflict` | 上游输入冲突 | 列冲突并等待决策 |

## 规则

- 只有 `approved-for-requirements` 可以作为 `sf-requirements` 的正式输入。
- `delegated-default` 必须带风险备注和回退点。
- `needs-decision` 不能被智能体自动降级为假设。
- `research-needed` 不能包装成“暂按经验判断”。
- `blocked-by-conflict` 必须指出冲突来源、影响范围和需要谁决策。

## 输出

```md
决策状态:
- 状态:
- 原因:
- 是否可进入需求阶段: 是 / 否
- 风险备注:
- 回退点:
- 所需决策:
```
