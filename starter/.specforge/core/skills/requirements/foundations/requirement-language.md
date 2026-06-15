# Requirement Language

requirements 使用规范语言描述系统外部可观察行为。它可以使用 RFC 2119 语义和 EARS 句式，但要避免把实现方案写成需求。

## 级别

| Level | 语义 | 使用方式 |
|---|---|---|
| MUST / SHALL | 必须实现，否则需求不满足 | 只用于用户确认、授权默认或当前事实约束 |
| MUST NOT / SHALL NOT | 明确禁止 | 用于安全、非目标、越界行为和合规边界 |
| SHOULD | 强推荐，但可有理由偏离 | 偏离必须记录影响和 owner |
| MAY | 可选能力 | 不能作为 MVP 必须项 |

## EARS 句式

| 类型 | 句式 | 用途 |
|---|---|---|
| Event-driven | `WHEN <event>, THE SYSTEM SHALL <response>.` | 用户动作、系统事件、外部回调 |
| State-driven | `WHILE <state>, THE SYSTEM SHALL <response>.` | 权限、任务状态、连接状态 |
| Conditional | `IF <condition>, THE SYSTEM SHALL <response>.` | 异常、边界、feature flag |
| Ubiquitous | `THE SYSTEM SHALL <response>.` | 总是成立的行为 |
| Optional | `WHERE <feature>, THE SYSTEM SHALL <response>.` | 仅在能力启用时成立 |

## 禁止写法

- “系统要支持高级搜索”这类不可测试概括。
- “使用 Redis / GraphQL / Vue 组件实现...”这类技术方案。
- “快速、简单、友好、稳定、完善、充分”等没有阈值的词。
- “按最佳实践处理”这类没有验收依据的空话。

## 最小需求行

```md
| REQ-001 | MUST | WHEN a user submits valid input, THE SYSTEM SHALL persist the request and show a success state. | brainstorm:user-confirmed | AC-001 |
```
