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
