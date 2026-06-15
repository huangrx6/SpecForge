# Ambiguity Review Prompt

用于写完 requirements 后检查歧义、不可测试和范围漂移。

## 检查问题

- 哪些 REQ 缺少来源？
- 哪些 MUST 来自 agent-recommendation 或 pending？
- 哪些 REQ 没有 AC？
- 哪些 AC 没有 Given / When / Then？
- 哪些 Then 不是外部可观察结果？
- 哪些需求写了实现方案？
- 哪些 NFR 缺阈值或验证方式？
- 哪些下游阶段需要 handoff 但没有输入？

## 输出

```md
| Finding | 严重性 | 影响 | 修正 |
|---|---|---|---|
| | P0 / P1 / P2 | | |
```
