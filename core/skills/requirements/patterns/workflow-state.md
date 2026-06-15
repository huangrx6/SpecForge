# Workflow / State Pattern

用于审批、异步任务、导入导出、上线、撤回、重试、失败恢复和状态流转。

## 必填

| 项 | 要求 |
|---|---|
| States | draft / pending / running / failed / completed 等 |
| Transitions | 谁或什么事件触发状态变化 |
| Invalid transitions | 不允许的跳转和系统响应 |
| Recovery | 失败后重试、撤回、人工处理或放弃 |

## 输出

```md
| 状态 | 允许操作 | 禁止操作 | 可见反馈 | 触发 AC |
|---|---|---|---|---|
| pending | cancel | edit result | pending badge | AC-STATE-001 |
```
