# 图谱查询计划 Prompt

输出一个最小查询计划，不要直接执行全仓扫描。

## 输出格式

| 问题 | Wiki 入口 | Provider 查询 | 目标文件 / symbol | 预期证据 | 停止条件 |
|---|---|---|---|---|---|
| | | | | | |

## 必须包含

- 本次 bounded context 来自哪些 Wiki 文件。
- 为什么需要 provider，而不是只用 Wiki / `rg`。
- freshness check 命令。
- 查询后如何归一 `graph_facts[]`。
