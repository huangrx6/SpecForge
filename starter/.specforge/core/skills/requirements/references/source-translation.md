# Source Translation

本文件定义如何把 brief、brainstorm、PRD、research、gap report 和 Wiki 当前事实转成 requirements。转译不是复制；每条输出都要变成可测试行为、边界、约束或未决项。

## 输入优先级

| 输入 | 用途 |
| --- | --- |
| `brief.md` | 原始目标、工作流、components flags、代码上下文 |
| `brainstorm.md#用户确认记录` | 判断哪些选择已确认或授权默认 |
| `brainstorm.md#明确延后 / 不做` | 生成非目标 |
| `prd.md` | 产品目标、MVP、用户、验收种子 |
| `research.md` | 已确认事实、风险、限制 |
| `gap-report.md` | bugfix 场景的缺口、复现和根因 |
| `.specforge/wiki/` | 长期业务规则、模块边界、既有约束 |

## Source -> Requirement 转译表

```md
## Source -> Requirement 转译

| Source item | 类型 | 确认状态 | 转译结果 | 状态 |
| --- | --- | --- | --- | --- |
| | MVP / non-goal / acceptance seed / constraint / risk / open question | user-confirmed / delegated-default / agent-recommendation / pending | REQ / AC / NFR / Out of Scope / Pending / Deferred | ready / blocked |
```

## 通用转译规则

- MVP 能力 -> 至少一个 REQ。
- Acceptance seed -> AC draft，再补 Given / When / Then。
- 产品指标 -> NFR 或 verification cue；无法验证则保留为产品指标。
- UI note -> UI impact / state / copy hint；不写组件方案。
- Technical note -> technical handoff；不写架构结论。
- Research fact -> constraint / risk / NFR。
- Deferred / rejected -> Out of Scope。
- Pending / recommendation -> 未决问题，不进 REQ。

## PRD To Requirements

PRD 回答为什么做、给谁做、第一版做什么；requirements 回答系统必须表现出哪些可测试行为。

流程：

1. 读取 PRD control / decision status，确认可进入 requirements。
2. 抽取目标用户、MVP、非目标、成功指标、验收种子和风险。
3. 把每个已确认 MVP 能力拆成系统行为。
4. 把验收种子改写为 AC，不保留 PRD 原句。
5. 把指标转成 NFR 或验证线索。
6. 把产品备注、路线图、后续版本写入非目标或 deferred。

失败信号：

- PRD 只有价值叙述，没有 MVP 行为。
- PRD 的 MVP 未确认。
- PRD 中的验收种子无法转成 Given / When / Then。
- PRD 把技术方案写成产品要求，且没有用户确认。

遇到失败信号时，不补造结论；写 pending 并退回 `sf-prd` 或 `sf-brainstorm`。

## Brainstorm To Requirements

brainstorm 是取舍记录，不是 requirements。只吸收已确认选择、授权默认、明确延后和事实证据。

| Brainstorm 内容 | requirements 处理 |
| --- | --- |
| `user-confirmed` | 可转成 REQ / AC / NFR / non-goal |
| `delegated-default` | 可转成 REQ，但记录默认理由和回退点 |
| `agent-recommendation` | 只能进候选或 pending |
| `pending` | 写 `[NEEDS CLARIFICATION]` |
| 明确延后 / 不做 | 写 Out of Scope |
| 事实证据 confirmed | 写 constraint / NFR / risk |
| 事实证据 unclear | 写 pending 或 research blocker |

推荐方案不是已选方案；只有用户确认或授权默认后才能进入 MUST。

## Research To Requirements

research 事实不能直接变成产品范围；它只能约束行为、风险、兼容性、NFR 或下游验证。

| Research 结论 | requirements 处理 |
| --- | --- |
| confirmed limitation | constraint / NFR / non-goal |
| confirmed capability | 可支撑 REQ，但仍需要产品确认 |
| likely | risk / verification cue |
| unclear | pending / research blocker |
| conflict | stop and request decision |

示例：

```md
| NFR-002 | Compatibility | THE SYSTEM SHALL support CSV files encoded as UTF-8. | research.md#source-2 | automated / inspection | technical_design / verification |
```

## Gap To Requirements

bugfix / gap report 场景下，requirements 要把缺陷根因转成防回归行为契约。

流程：

1. 读取复现路径、期望行为、实际行为、根因和影响范围。
2. 把“应恢复的行为”写成 REQ。
3. 把复现步骤写成 AC。
4. 把防回归边界写成 NFR 或重新验证触发条件。
5. 把不修的相邻问题写成 Out of Scope。

禁止：

- 不把修复实现方案写成需求。
- 不把单个堆栈报错当成完整需求。
- 不丢失复现输入、失败状态和期望输出。

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
| REQ-001 | MUST | WHEN a customer manager opens the reminder page, THE SYSTEM SHALL display contracts expiring within the configured reminder window. | prd.md:user story | user-confirmed | AC-001 |
```

```md
| AC-001 | Given 客户经理存在可见客户数据 | When 打开业务到期提醒页面 | Then 系统展示客户名称、业务名称、到期时间、剩余天数和联系状态 | E2E |
```

### 样例 2：Agent recommendation -> pending

Bad:

```md
| REQ-002 | MUST | WHEN a contract is near expiry, THE SYSTEM SHALL send an SMS reminder. | brainstorm.md recommendation | agent-recommendation | AC-002 |
```

Good:

```md
| PENDING-001 | [NEEDS CLARIFICATION] 是否开启短信提醒、发送对象、频率、成本和失败重试策略？ | user | before technical_design |
```

### 样例 3：Research fact -> NFR

Good:

```md
| NFR-001 | Reliability | THE SYSTEM SHALL throttle outbound provider requests so normal operation does not exceed the confirmed provider limit of 60 requests per minute. | research.md | contract / inspection | technical_design / verification |
```

### 样例 4：Deferred item -> Out of Scope

Good:

```md
| OOS-001 | 本期不支持跨组织共享业务提醒和客户数据。 | deferred | 后续触发条件：用户确认多组织协作版本 |
```

### 样例 5：UI note -> UI handoff，不写成需求方案

Bad:

```md
| REQ-004 | MUST | THE SYSTEM SHALL render overdue contracts with a red badge component. | prd.md | user-confirmed | AC-004 |
```

Good:

```md
| REQ-004 | MUST | WHEN a contract is overdue, THE SYSTEM SHALL expose an overdue state distinct from upcoming and normal contracts. | prd.md:ui note | user-confirmed | AC-004 |
```

```md
Downstream Handoff: ui_design 需要为 overdue / upcoming / normal 三种状态定义可区分视觉表达；具体颜色、badge 和布局不在 requirements 决定。
```

## 修写动作

| 输入形态 | 不要做 | 应该做 |
| --- | --- | --- |
| 用户故事 | 原样粘贴为需求 | 拆成角色、触发、系统响应、可观察结果 |
| PRD 验收种子 | 只复制为 AC | 补 Given / When / Then / 验证方式 |
| Agent recommendation | 写 MUST / SHALL | 写 pending、候选或请求确认 |
| Research fact | 写成实现选择 | 写 constraint / NFR / risk，保留来源 |
| UI note | 写组件和颜色 | 写用户可见状态，交给 UI handoff |
| Technical note | 写架构结论 | 写 technical handoff 或 decision marker |
| Deferred item | 忽略 | 写 Out of Scope 和后续触发条件 |
