# Requirements Anti-patterns

本文件不是反模式清单，而是修正器。写完 requirements 后逐条扫描：发现 fail signal，就执行对应修正动作，再回到 trace 和 AC 检查。

## Anti-pattern Fixers

| 反模式 | Fail signal | 为什么危险 | 自动修正动作 | 示例 |
|---|---|---|---|---|
| Story dump | 出现“作为...我希望...”但没有 SHALL / AC | 用户故事不能直接验收 | 拆成 Trigger / Condition / System response / Observable result | `作为客户经理...` -> `WHEN customer manager opens... THE SYSTEM SHALL display...` |
| Recommendation as requirement | `agent-recommendation` 被写成 MUST / SHALL | 把 Agent 推荐伪装成用户确认 | 降级为 pending / candidate，并写确认问题 | `默认短信提醒` -> `[NEEDS CLARIFICATION] 是否启用短信提醒？` |
| Design leakage | 写“弹窗、表格、红色 badge、shadcn、Pencil、布局” | requirements 变成 UI 方案，下游失去设计空间 | 改成用户可见状态，细节移到 UI handoff | `红色 badge` -> `overdue state distinct from upcoming` |
| Technical leakage | 写 Redis、GraphQL、Vue 组件、DB 表、队列、SDK | requirements 变成技术设计，可能锁错方案 | 改成外部行为 / 约束 / technical handoff | `用 Redis 缓存` -> `repeat access SHALL not exceed confirmed response target` |
| Untestable adjective | 快速、友好、稳定、完善、智能、充分 | 无法验收，verification 不知道怎么证明 | 写阈值、样例、可观察输出或 owner | `快速响应` -> `p95 response <= 2s under confirmed load` |
| Missing negative path | 只有成功路径，没有失败、空态、权限、边界 | 实现会漏恢复和保护行为 | 补 error / empty / permission / boundary AC | 导入成功 AC 后补非法行、空文件、重复行 |
| Orphan AC | AC 没有对应 REQ | 验收对象不明，trace 断裂 | 连接到 REQ，或改为 note / handoff / 删除 | `AC-004` -> `REQ-002` |
| Orphan REQ | REQ 没有 AC | MUST 无法被证明 | 补 AC，或降级为 SHOULD / note / pending | `REQ-006` -> 补 Given / When / Then |
| Scope creep | 非目标、明确延后或 rejected 没记录 | 实现阶段容易把放弃项带回来 | 写 Out of Scope / Deferred 和后续触发条件 | `本期不做跨组织` -> `OOS-001` |
| Hidden decision | 未决问题被写成假设 | 用户没有批准，后续会误解 | 写 `[NEEDS CLARIFICATION]` / dependency / tooling marker | `默认用供应商 A` -> `[NEEDS DEPENDENCY DECISION]` |
| Source gap | REQ / NFR 没有 source | 后续无法判断是否已确认 | 回查 brief / PRD / brainstorm / research / wiki，找不到则 pending | `REQ-009 source empty` -> pending |
| Handoff leakage | UI / technical / verification 需要知道的信息散在正文里 | 下游读取不稳定 | 移入 Downstream Handoff，并引用 REQ / AC | `需要 UI 做空态` -> `ui_design: REQ-003 / AC-003` |

## 修正流程

1. 扫描所有 REQ / AC / NFR / Out of Scope / Pending。
2. 对每条命中项标注反模式名称。
3. 先修 confirmation boundary，再修 language，再修 AC，再修 trace。
4. 修完后重新检查：
   - 每条 MUST / SHALL 有 source。
   - 每条 MUST / SHALL 有 AC。
   - 每条 AC 有 Given / When / Then / 验证方式。
   - 每个 high-impact source item 映射到 REQ / AC / NFR / Out of Scope / Pending / Deferred。

## 修正示例

### Story dump

Bad:

```md
作为运营人员，我希望导入客户名单，以便批量创建提醒。
```

Fixed:

```md
| REQ-001 | MUST | WHEN an operator uploads a customer reminder import file, THE SYSTEM SHALL validate the file and expose import results before reminders are created. | prd.md:user story | AC-001 |
```

### Design leakage

Bad:

```md
REQ-002 MUST: 系统用红色 badge 显示失败任务。
```

Fixed:

```md
| REQ-002 | MUST | WHEN an import job fails, THE SYSTEM SHALL expose a failure state distinct from running and completed jobs. | prd.md | AC-002 |
```

```md
Downstream Handoff: ui_design 需要定义 running / completed / failed 的可区分视觉表达。
```

### Missing negative path

Bad:

```md
| AC-003 | Given 文件合法 | When 用户导入 | Then 系统导入成功 | E2E |
```

Fixed:

```md
| AC-003 | Given 文件合法 | When 用户导入 | Then 系统导入成功并展示成功数量 | E2E |
| AC-004 | Given 文件包含非法行 | When 用户导入 | Then 系统展示行级错误并阻止或跳过非法行，按 REQ 指定策略处理 | E2E |
```
