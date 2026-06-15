# Workflow / State Requirements Pattern

用于审批、异步任务、导入导出、发布上线、撤回、重试、失败恢复、状态机和长流程。

## 什么时候使用

- 对象会经历 draft / pending / running / failed / completed / cancelled 等状态。
- 用户可以提交、撤回、取消、重试、审批、驳回、归档或恢复。
- 外部事件、后台任务或定时任务会改变状态。
- 状态错误会导致重复执行、越权、脏数据或用户不知道下一步。

## 必须问清

- 有哪些状态？初始状态和终态是什么？
- 每个状态允许哪些操作，禁止哪些操作？
- 谁或什么事件触发状态变化？
- 无效跳转时系统如何响应？
- 失败后是否能重试、撤回、人工处理或放弃？
- 用户如何看到当前状态、进度、失败原因和下一步？

## 状态覆盖矩阵

| 状态 | 允许操作 | 禁止操作 | 可见反馈 | 触发 AC |
|---|---|---|---|---|
| draft | edit / submit | approve | draft state | AC-STATE-001 |
| pending | cancel | edit result | pending badge / progress | AC-STATE-002 |
| failed | retry / view reason | mark success | error state + recovery | AC-STATE-003 |
| completed | view / export | retry same job | success summary | AC-STATE-004 |

## REQ 模板

| 场景 | REQ 写法 |
|---|---|
| 状态进入 | `WHEN <event> occurs for <object>, THE SYSTEM SHALL transition <object> from <state A> to <state B>.` |
| 状态限制 | `WHILE <object> is in <state>, THE SYSTEM SHALL allow <actions> and prevent <invalid actions>.` |
| 无效跳转 | `IF a user attempts <invalid transition>, THE SYSTEM SHALL reject the transition and expose the current valid state.` |
| 失败恢复 | `WHEN <process> fails, THE SYSTEM SHALL expose failure reason and available recovery actions.` |
| 幂等/重复提交 | `IF the same transition request is repeated, THE SYSTEM SHALL avoid creating duplicate effects and expose the current state.` |

## AC 模板

| Given | When | Then | 验证方式 |
|---|---|---|---|
| 对象处于允许变更状态 | 用户触发合法操作 | 系统进入目标状态并展示状态反馈 | E2E |
| 对象处于禁止变更状态 | 用户触发无效操作 | 系统拒绝操作并保持原状态 | automated / E2E |
| 后台任务失败 | 用户查看任务详情 | 系统展示失败原因、重试/放弃/人工处理入口 | manual / E2E |
| 重复提交同一操作 | 第二次请求到达 | 系统不产生重复副作用并返回当前状态 | automated |

## 常见漏项

- 只写成功状态，不写失败、取消、超时和重试。
- 只写“状态改变”，不写触发者、允许操作和禁止操作。
- 忘记重复提交、并发操作和外部回调乱序。
- 把状态机实现写成数据库枚举，而不是外部可观察行为。
