# Behavior Contract

本文件定义 requirements 的核心行为契约：什么上游输入能进入 MUST / SHALL，如何写成可测试行为，如何验收，如何追踪到下游，以及什么 NFR 才能进入需求规格。

## 1. Confirmation Boundary

| 确认类型 | 含义 | 可进入 MUST / SHALL | requirements 处理 |
| --- | --- | --- | --- |
| `user-confirmed` | 用户明确选择、确认、批准或修正后的结论 | yes | 可写入 REQ / AC / NFR / non-goal |
| `delegated-default` | 用户授权 Agent 按推荐默认执行 | yes, with risk note | 可写入 REQ，但要记录默认理由、风险和回退点 |
| `agent-recommendation` | Agent 推荐，用户未确认 | no | 只能写入候选、pending 或待确认问题 |
| `pending` | 未决、冲突或缺证据 | no | 写 `[NEEDS CLARIFICATION]` 或对应 decision marker |
| `existing-stack` | 代码库、wiki 或已批准规格证明的现有约束 | yes, as constraint | 写约束或 NFR，保留来源 |
| `not-required` | 已确认不需要 | no | 写入非目标、明确延后或 N/A 理由 |

规则：

- `user-confirmed` 和 `delegated-default` 可以进入需求正文。
- `agent-recommendation` 不能写成 `THE SYSTEM SHALL...`。
- `pending` 不得被降级成“默认先做”；必须保留阻断、owner 或下游触发条件。
- 如果 brainstorm / PRD / brief 中只有推荐没有确认，requirements 应停止，或写入待澄清项。
- 任何进入 requirements 的行为都必须有来源：文件、表格行、用户回答、wiki 事实或已批准 artifact。

## 2. Requirement Language

requirements 描述系统外部可观察行为，可以使用 RFC 2119 语义和 EARS 句式，但不要把实现方案写成需求。

| Level | 语义 | 使用方式 |
| --- | --- | --- |
| MUST / SHALL | 必须实现，否则需求不满足 | 只用于用户确认、授权默认或当前事实约束 |
| MUST NOT / SHALL NOT | 明确禁止 | 用于安全、非目标、越界行为和合规边界 |
| SHOULD | 强推荐，但可有理由偏离 | 偏离必须记录影响和 owner |
| MAY | 可选能力 | 不能作为 MVP 必须项 |

| EARS 类型 | 句式 | 用途 |
| --- | --- | --- |
| Event-driven | `WHEN <event>, THE SYSTEM SHALL <response>.` | 用户动作、系统事件、外部回调 |
| State-driven | `WHILE <state>, THE SYSTEM SHALL <response>.` | 权限、任务状态、连接状态 |
| Conditional | `IF <condition>, THE SYSTEM SHALL <response>.` | 异常、边界、feature flag |
| Ubiquitous | `THE SYSTEM SHALL <response>.` | 总是成立的行为 |
| Optional | `WHERE <feature>, THE SYSTEM SHALL <response>.` | 仅在能力启用时成立 |

语言规则：

- 写触发、条件、系统响应和可观察结果。
- 不写组件、接口、数据库、类名、文件路径、缓存、队列、SDK 或任务拆分。
- 避免“支持、优化、完善、友好、稳定、快速、智能、充分”等不可测试词；除非补阈值、样例或观察证据。
- 用户故事是输入，不是 requirements 终态。
- UI note、technical note、research caveat 分别进入 handoff、constraint、risk 或 pending，不混进 REQ 行。

## 3. Testability

每条 MUST / SHALL 需求至少要能被一个 AC 证明。AC 不是愿望清单，而是可观察结果。

| 字段 | 要求 |
| --- | --- |
| Given | 系统初始状态、数据、角色或前置条件 |
| When | 用户动作、外部事件或系统触发 |
| Then | 可观察输出：UI 状态、消息、文件、API 响应、审计记录、任务状态 |
| 验证方式 | automated / manual / inspection / analysis / contract / E2E |

覆盖规则：

- 核心流程必须覆盖正常路径。
- 适用时补失败路径、空状态、边界值、权限差异和重新验证触发条件。
- `Then` 不应只写内部实现，例如“数据库保存成功”；要补外部可观察证据。
- NFR 必须有可验证阈值、采样方式、环境或人工检查方法。
- 暂时不可验证的项写入不可测试项表，不伪装成 AC。

## 4. Traceability

requirements 的价值在于让后续 UI、技术设计、任务和验证都能追到同一个行为来源。

```txt
source decision / fact -> REQ-* -> AC-* -> UI / technical / task / verification
```

| Source | 可转成 |
| --- | --- |
| user-confirmed MVP | REQ / AC |
| delegated-default | REQ / AC + risk note |
| PRD acceptance seed | AC draft，需转写 |
| research confirmed fact | constraint / NFR / risk |
| wiki product rule | constraint / domain rule |
| agent-recommendation | pending / candidate only |
| non-goal / deferred | Out of Scope |

Trace rules:

- 每个 REQ 要能追到 source。
- 每个 MUST / SHALL REQ 要能追到 AC。
- 每个 AC 要能追到 REQ。
- 每个 high-impact source item 要映射到 REQ / AC / NFR / Out of Scope / Pending / Deferred 之一。
- 下游新增行为必须能追回 requirements；追不回说明范围漂移。

## 5. NFR Taxonomy

NFR 不是泛泛的“性能好、安全高”。它必须有触发条件、阈值、验证方式和下游 owner。

| 类型 | 常见触发 | 写法 |
| --- | --- | --- |
| Performance | 响应时间、吞吐、并发、批处理 | 写阈值、样本规模和验证方式 |
| Security | 权限、敏感数据、审计、导出 | 写禁止行为、角色差异和审计证据 |
| Reliability | 重试、失败恢复、幂等、任务状态 | 写失败响应和恢复路径 |
| Compatibility | 浏览器、设备、运行时、文件格式 | 写支持矩阵和 fallback |
| Observability | 日志、指标、告警、审计 | 写事件、字段、可见位置 |
| Accessibility | 键盘、语义、对比度、读屏 | 写可检查标准和关键路径 |
| Data quality | AI 质量、导入校验、去重、口径 | 写阈值、人工复核和异常处理 |

NFR 输出：

```md
| ID | 类型 | 约束 | 来源 | 验证方式 | 触发下游 |
| --- | --- | --- | --- | --- | --- |
| NFR-001 | Security | THE SYSTEM SHALL record an audit event when... | source | inspection / automated | technical_design / verification |
```

## 6. Examples

### Example 1: PRD User Story -> REQ / AC

Source:

```md
作为客户经理，我希望查看到期业务提醒，以便提前联系客户。
确认类型：user-confirmed
```

Bad:

```md
REQ-001 系统支持业务到期提醒。
```

Good:

```md
| REQ-001 | MUST | WHEN a customer manager opens the reminder page, THE SYSTEM SHALL display contracts expiring within the configured reminder window. | prd.md:user story | user-confirmed | AC-001 |
```

```md
| AC-001 | Given 客户经理存在可见客户数据 | When 打开业务到期提醒页面 | Then 系统展示客户名称、业务名称、到期时间、剩余天数和联系状态 | E2E |
```

### Example 2: Agent Recommendation -> Pending

Bad:

```md
REQ-002 MUST: WHEN a contract is near expiry, THE SYSTEM SHALL send an SMS reminder.
```

Good:

```md
| PENDING-001 | [NEEDS CLARIFICATION] 是否需要短信提醒、谁承担短信成本、失败是否重试？ | owner: user | before technical_design |
```

### Example 3: Research Fact -> NFR

```md
| NFR-001 | Reliability | THE SYSTEM SHALL throttle outbound provider requests so normal operation does not exceed the confirmed provider limit of 60 requests per minute. | research.md | contract / inspection | technical_design / verification |
```

### Example 4: Deferred Item -> Out of Scope

```md
| OOS-001 | 本期不支持跨组织共享客户数据。 | deferred | 后续触发条件：用户确认多组织协作版本 |
```

### Example 5: UI Note -> UI Handoff

Bad:

```md
REQ-003 MUST: THE SYSTEM SHALL use a red badge component for overdue contracts.
```

Good:

```md
| REQ-003 | MUST | WHEN a contract is overdue, THE SYSTEM SHALL expose an overdue state distinct from upcoming and normal contracts. | prd.md:ui note | user-confirmed | AC-003 |
```

```md
UI handoff: overdue / upcoming / normal 三种状态需要可区分视觉表达；具体颜色、badge、表格布局由 ui_design 决定。
```
