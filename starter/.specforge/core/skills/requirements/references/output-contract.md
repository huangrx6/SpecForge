# Requirements Output Contract

本文件定义 `requirements.md` 的输出结构。按 work item 规模选择 compact / standard / full，但核心 trace 不可丢。

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
| 1. 上游确认输入 | 必填 | 必填 | 必填 |
| 2. Source -> Requirement 转译 | 按需 | 必填 | 必填 |
| 边界 | 必填 | 必填 | 必填 |
| 影响面确认 | 必填 | 必填 | 必填 |
| 功能需求 | 必填 | 必填 | 必填 |
| 行为覆盖矩阵 | 按需 | 必填 | 必填 |
| 验收标准 | 必填 | 必填 | 必填 |
| NFR / 约束 | 按需 | 必填 | 必填 |
| REQ / AC Trace | 按需 | 必填 | 必填 |
| Downstream Handoff | 按需 | 必填 | 必填 |
| 未决问题 | 必填 | 必填 | 必填 |

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
