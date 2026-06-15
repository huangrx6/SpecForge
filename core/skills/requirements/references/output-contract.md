# Requirements Output Contract

本文件定义 `requirements.md` 的输出结构。按 work item 规模选择 compact / standard / full，但核心 trace 不可丢：compact 可以不单独展开大 Trace 表，但每条 REQ / AC 仍必须 inline 记录 source、confirmation type 和 downstream 去向。

## Profiles

| Profile | 适用 | 必填 |
|---|---|---|
| compact | 单字段、文案、小配置、低风险修复 | Control、确认输入、REQ、AC、非目标、Gate |
| standard | 常规产品功能、跨 UI / API / 数据 | 全部核心 section |
| full | 多角色、AI、外部集成、安全、复杂状态流 | 全部 section + pattern appendix / handoff |

## Section Matrix

| Section | compact | standard | full |
|---|---|---|---|
| 0. Requirements Control | 必填 | 必填 | 必填 |
| 0.1 Spec Quality Gate | 必填 | 必填 | 必填 |
| Applied Requirement Patterns | 按需；无命中写 N/A 理由 | 必填 | 必填 |
| 1. 上游确认输入 | 必填 | 必填 | 必填 |
| 2. Source -> Requirement 转译 | 按需 | 必填 | 必填 |
| 边界 | 必填 | 必填 | 必填 |
| 影响面确认 | 必填 | 必填 | 必填 |
| 功能需求 | 必填 | 必填 | 必填 |
| 行为覆盖矩阵 | 按需 | 必填 | 必填 |
| 验收标准 | 必填 | 必填 | 必填 |
| NFR / 约束 | 按需 | 必填 | 必填 |
| REQ / AC Trace | inline trace required；独立 Trace table 可 N/A | 独立 Trace table 必填 | 独立 Trace table + downstream trace 必填 |
| Downstream Handoff | inline downstream required；独立 Handoff table 可 N/A | 必填 | 必填 |
| 未决问题 | 必填 | 必填 | 必填 |

## Trace Profile Rules

| Profile | Trace 要求 |
|---|---|
| compact | 每条 REQ / AC 必须在本行写清 `来源`、`确认类型` 和对应下游；`REQ / AC Trace` 独立表可写 N/A 理由。 |
| standard | 必须填写独立 `REQ / AC Trace` 表，把 Source -> REQ -> AC -> Downstream 串起来。 |
| full | 必须填写独立 `REQ / AC Trace` 表，并在 `Downstream Handoff` 中按 ui-design / technical-design / tasking / verification 拆出读取项和阻断条件。 |

## 关键表格

```md
| ID | Level | EARS / SHALL 需求 | 来源 | 对应 AC |
|---|---|---|---|---|
| REQ-001 | MUST | WHEN..., THE SYSTEM SHALL... | source | AC-001 |
```

```md
| ID | Given | When | Then | 验证方式 |
|---|---|---|---|---|
| AC-001 | | | | automated / manual / inspection / analysis / contract / E2E |
```
