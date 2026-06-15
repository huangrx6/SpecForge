# Traceability

requirements 的价值在于让后续 UI、技术设计、任务和验证都能追到同一个行为来源。

## Trace 链路

```txt
source decision / fact -> REQ-* -> AC-* -> UI / technical / task / verification
```

## Source 类型

| Source | 可转成 |
|---|---|
| user-confirmed MVP | REQ / AC |
| delegated-default | REQ / AC + risk note |
| PRD acceptance seed | AC draft，需转写 |
| research confirmed fact | constraint / NFR / risk |
| wiki product rule | constraint / domain rule |
| agent-recommendation | pending / candidate only |
| non-goal / deferred | Out of Scope |

## Trace 表

```md
## REQ / AC Trace

| Source | REQ | AC | Downstream | 状态 |
|---|---|---|---|---|
| brainstorm.md row | REQ-001 | AC-001 | ui_design / technical_design / tasking / verification | ready / pending |
```

## 质量要求

- 每个 REQ 要能追到 source。
- 每个 MUST REQ 要能追到 AC。
- 每个 AC 要能追到 REQ。
- 下游新增行为必须能追回 requirements；追不回说明范围漂移。
