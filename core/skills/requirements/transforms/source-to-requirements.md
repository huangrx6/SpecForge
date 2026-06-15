# Source To Requirements

本文件定义如何把上游输入转成 requirements。转译不是复制；每条输出都要改变成可测试行为、边界、约束或未决项。

## 输入优先级

| 输入 | 用途 |
|---|---|
| `brainstorm.md#用户确认记录` | 判断哪些选择已确认或授权默认 |
| `brainstorm.md#明确延后 / 不做` | 生成非目标 |
| `prd.md` | 产品目标、MVP、用户、验收种子 |
| `research.md` | 已确认事实、风险、限制 |
| `gap-report.md` | bugfix 场景的缺口、复现和根因 |
| `.specforge/wiki/` | 长期业务规则、模块边界、既有约束 |

## 转译表

```md
## 2. Source -> Requirement 转译

| Source item | 类型 | 确认状态 | 转译结果 | 状态 |
|---|---|---|---|---|
| | MVP / non-goal / acceptance seed / constraint / risk / open question | user-confirmed / delegated-default / agent-recommendation / pending | REQ / AC / NFR / out-of-scope / pending | ready / blocked |
```

## 转译规则

- MVP 能力 -> 至少一个 REQ。
- Acceptance seed -> AC draft，再补 Given / When / Then。
- 产品指标 -> NFR 或 verification cue；无法验证则保留为产品指标。
- UI note -> UI impact / state / copy hint；不写组件方案。
- Technical note -> technical handoff；不写架构结论。
- Research fact -> constraint / risk / NFR。
- Deferred / rejected -> Out of Scope。
- Pending / recommendation -> 未决问题，不进 REQ。

## 转译样例

### 样例 1：PRD 用户故事 -> REQ / AC

Source:

```md
作为客户经理，我希望查看到期业务提醒，以便提前联系客户。
确认状态：user-confirmed
```

Bad:

```md
REQ-001 系统支持业务到期提醒。
```

Good:

```md
| REQ-001 | MUST | WHEN a customer manager opens the reminder page, THE SYSTEM SHALL display contracts expiring within the configured reminder window. | prd.md:user story | AC-001 |
```

```md
| AC-001 | Given 客户经理存在可见客户数据 | When 打开业务到期提醒页面 | Then 系统展示客户名称、业务名称、到期时间、剩余天数和联系状态 | E2E |
```

### 样例 2：Agent recommendation -> pending

Source:

```md
Agent recommendation: 默认开启短信提醒。
用户未确认。
```

Bad:

```md
| REQ-002 | MUST | WHEN a contract is near expiry, THE SYSTEM SHALL send an SMS reminder. | brainstorm.md recommendation | AC-002 |
```

Good:

```md
| PENDING-001 | [NEEDS CLARIFICATION] 是否开启短信提醒、发送对象、频率、成本和失败重试策略？ | user | before technical_design |
```

### 样例 3：Research fact -> NFR

Source:

```md
research.md: provider rate limit confirmed as 60 requests/minute.
```

Bad:

```md
REQ-003 系统使用限流避免超限。
```

Good:

```md
| NFR-001 | Reliability | THE SYSTEM SHALL throttle outbound provider requests so normal operation does not exceed the confirmed provider limit of 60 requests per minute. | research.md | contract / inspection |
```

### 样例 4：Deferred item -> Out of Scope

Source:

```md
brainstorm.md#明确延后：本期不做跨组织共享。
```

Good:

```md
| OOS-001 | 本期不支持跨组织共享业务提醒和客户数据。 | deferred | 后续触发条件：用户确认多组织协作版本 |
```

### 样例 5：UI note -> UI handoff，不写成需求方案

Source:

```md
PRD note: 过期提醒要用红色 badge 显示。
```

Bad:

```md
| REQ-004 | MUST | THE SYSTEM SHALL render overdue contracts with a red badge component. | prd.md | AC-004 |
```

Good:

```md
| REQ-004 | MUST | WHEN a contract is overdue, THE SYSTEM SHALL expose an overdue state distinct from upcoming and normal contracts. | prd.md:ui note | AC-004 |
```

```md
Downstream Handoff: ui_design 需要为 overdue / upcoming / normal 三种状态定义可区分视觉表达；具体颜色、badge 和布局不在 requirements 决定。
```

## 修写动作

| 输入形态 | 不要做 | 应该做 |
|---|---|---|
| 用户故事 | 原样粘贴为需求 | 拆成角色、触发、系统响应、可观察结果 |
| PRD 验收种子 | 只复制为 AC | 补 Given / When / Then / 验证方式 |
| Agent recommendation | 写 MUST / SHALL | 写 pending、候选或请求确认 |
| Research fact | 写成实现选择 | 写 constraint / NFR / risk，保留来源 |
| UI note | 写组件和颜色 | 写用户可见状态，交给 UI handoff |
| Technical note | 写架构结论 | 写 technical handoff 或 decision marker |
| Deferred item | 忽略 | 写 Out of Scope 和后续触发条件 |
