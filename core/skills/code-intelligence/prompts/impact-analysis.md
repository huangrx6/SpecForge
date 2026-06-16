# Impact Analysis Prompt

对 changed files 或拟修改 symbol 做影响面分析。

## 输出格式

| 变更 | 受影响模块 | 上游 | 下游 | 受影响测试 | 风险 | 证据 |
|---|---|---|---|---|---|---|
| | | | | | | |

## 规则

- 优先使用 CodeGraph affected / impact；不可用时写明 fallback。
- 只输出与本次 work item 有关的影响面。
- 每个影响面必须有 source path、graph fact id 或测试证据。

