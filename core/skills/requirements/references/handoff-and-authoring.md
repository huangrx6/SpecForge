# Handoff And Authoring

本文件合并 requirements 的访谈、验收标准生成、歧义审查和下游交接规则。目标是让 requirements 不是一堆 REQ，而是能稳定驱动后续 UI、技术设计、任务和验证。

## Requirements Interview

发现高影响未知时，每轮只问一个会改变行为或验收的问题。

模板：

```md
这个问题会影响 requirements 的 [行为 / 权限 / 数据 / 验收]，需要先定下来。

A) [选项 1] -> 影响
B) [选项 2] -> 影响
C) [授权默认] -> Agent 推荐与回退点

你选哪一种？
```

优先级：

1. MVP 行为边界。
2. 角色 / 权限 / 数据安全。
3. 验收含义和失败路径。
4. 外部依赖 / 工具链决策。
5. UI / 技术设计输入。

## Acceptance Criteria

把验收种子转成可执行 AC。

输入：

- REQ ID。
- 用户角色 / 系统状态。
- 触发动作。
- 可观察结果。
- 验证方式。

输出：

```md
| ID | Given | When | Then | 验证方式 |
| --- | --- | --- | --- | --- |
| AC-001 | [initial state] | [event/action] | [observable result] | automated / manual / inspection / analysis / contract / E2E |
```

检查：

- Given 不写用户动作。
- When 只写一个主要触发。
- Then 是可观察结果，不是内部实现。
- 验证方式必须能由后续 verification 执行或说明 owner。

生成步骤：

1. 读取对应 REQ 的 trigger、condition、system response 和 observable result。
2. 先写 happy path AC。
3. 按适用性补 negative path：invalid input、empty state、permission denied、boundary value、external failure / timeout、retry / recovery。
4. 给每条 AC 指定验证方式，不确定时写 owner 和阻断点。
5. 如果 Then 只能描述内部实现，把它改写成用户、operator、API consumer 或 auditor 可观察的证据。

示例：

```md
| AC-001 | Given 客户经理存在可见客户数据 | When 打开业务到期提醒页面 | Then 系统展示客户名称、业务名称、到期时间、剩余天数和联系状态 | E2E |
| AC-002 | Given 用户没有导出权限 | When 尝试导出提醒列表 | Then 系统阻止导出并展示权限受限原因，且不生成导出文件 | E2E |
| AC-003 | Given 外部 provider 超时 | When 系统提交提醒发送请求 | Then 系统展示发送失败或排队状态，并保留可重试恢复动作 | contract / E2E |
```

## Downstream Handoff

requirements 必须明确下游拿什么继续，以及什么情况必须停止。

```md
## Downstream Handoff

| 下游 | 输入 | 阻断条件 |
| --- | --- | --- |
| ui_design | 页面范围、用户动作、状态、文案线索、a11y 线索 | UI 方向未确认 / 状态缺失 |
| technical_design | 数据、权限、集成、NFR、依赖决策信号 | 依赖 / 工具链未确认 |
| tasking | REQ / AC trace、非目标、风险 | REQ 无 AC / pending 未解决 |
| verification | AC、验证方式、重新验证触发 | AC 不可执行 |
```

交接纪律：

- UI design 不应重新定义需求行为。
- technical design 不应把 pending 决策当成已确认。
- tasking 不应创建追不回 REQ / AC 的任务。
- verification 不应测试 requirements 未承诺的范围。

## Ambiguity Review

写完 requirements 后检查：

- 哪些 REQ 缺少来源？
- 哪些 MUST 来自 agent-recommendation 或 pending？
- 哪些 REQ 没有 AC？
- 哪些 AC 没有 Given / When / Then？
- 哪些 Then 不是外部可观察结果？
- 哪些需求写了实现方案？
- 哪些 NFR 缺阈值或验证方式？
- 哪些下游阶段需要 handoff 但没有输入？

输出：

```md
| Finding | 严重性 | 影响 | 修正 |
| --- | --- | --- | --- |
| | P0 / P1 / P2 | | |
```
