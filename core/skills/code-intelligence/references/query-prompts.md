# Query Prompts

## Graph Query Plan

输出一个最小查询计划，不直接执行全仓扫描。

| 问题 | Wiki 入口 | Provider 查询 | 目标文件 / symbol | 预期证据 | 停止条件 |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

必须包含：

- 本次 bounded context 来自哪些 Wiki 文件。
- 为什么需要 provider，而不是只用 Wiki / `rg`。
- freshness check 命令。
- 查询后如何归一 `graph_facts[]`。
- 如果 provider 不 ready，fallback 如何降级。

## Impact Analysis

对 changed files 或拟修改 symbol 做影响面分析。

| 变更 | 受影响模块 | 上游 | 下游 | 受影响测试 | 风险 | 证据 |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

规则：

- 优先使用 CodeGraph affected / impact；不可用时写明 fallback。
- 只输出与本次 work item 有关的影响面。
- 每个影响面必须有 source path、graph fact id 或测试证据。
- affected tests 必须标注“候选 / 已运行 / 未运行 / 不适用”。
