# Acceptance Criteria Prompt

把验收种子转成可执行 AC。

## 输入

- REQ ID。
- 用户角色 / 系统状态。
- 触发动作。
- 可观察结果。
- 验证方式。

## 输出

```md
| ID | Given | When | Then | 验证方式 |
|---|---|---|---|---|
| AC-001 | [initial state] | [event/action] | [observable result] | automated / manual / inspection / analysis / contract / E2E |
```

## 检查

- Given 不写用户动作。
- When 只写一个主要触发。
- Then 是可观察结果，不是内部实现。
- 验证方式必须能由后续 verification 执行或说明 owner。

## 生成步骤

1. 读取对应 REQ 的 trigger、condition、system response 和 observable result。
2. 先写 happy path AC。
3. 按适用性补 negative path：
   - invalid input
   - empty state
   - permission denied
   - boundary value
   - external failure / timeout
   - retry / recovery
4. 给每条 AC 指定验证方式，不确定时写 owner 和阻断点。
5. 如果 Then 只能描述内部实现，把它改写成用户、operator、API consumer 或 auditor 可观察的证据。

## Pattern

```md
REQ:
| REQ-001 | MUST | WHEN <actor/event> <trigger>, THE SYSTEM SHALL <observable behavior>. | <source> | AC-001 |

AC:
| ID | Given | When | Then | 验证方式 |
|---|---|---|---|---|
| AC-001 | <role/data/system state> | <single action/event> | <visible output/state/message/record> | E2E / automated / manual / inspection / contract |
```

## Examples

### Normal path

```md
| AC-001 | Given 客户经理存在可见客户数据 | When 打开业务到期提醒页面 | Then 系统展示客户名称、业务名称、到期时间、剩余天数和联系状态 | E2E |
```

### Permission path

```md
| AC-002 | Given 用户没有导出权限 | When 尝试导出提醒列表 | Then 系统阻止导出并展示权限受限原因，且不生成导出文件 | E2E |
```

### Failure path

```md
| AC-003 | Given 外部 provider 超时 | When 系统提交提醒发送请求 | Then 系统展示发送失败或排队状态，并保留可重试恢复动作 | contract / E2E |
```
