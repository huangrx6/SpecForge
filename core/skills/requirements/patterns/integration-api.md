# Integration / API Requirements Pattern

用于外部服务、webhook、SDK、API 契约、第三方 provider、跨系统同步和回调。

## 什么时候使用

- 需求涉及第三方系统、外部 provider、Webhook、OAuth、SDK、支付、短信、邮件、地图、AI provider 或内部服务间同步。
- 外部系统不可用、超时、限流、重复回调或数据不一致会影响用户。
- 需要 technical design 决定 API route、schema、client、SDK 版本或 provider。

## 必须问清

- 集成对象是谁，业务上交换什么数据或事件？
- 哪些输入和输出语义是需求级契约？
- 超时、失败、限流、重试、幂等和重复回调如何处理？
- provider 不可用时是降级、排队、人工处理还是阻断？
- 用户是否能看到同步状态、失败原因和恢复路径？
- provider / SDK / API 版本是否已由用户或 research 确认？

## REQ 模板

| 场景 | REQ 写法 |
|---|---|
| 外部请求 | `WHEN <business event> requires external delivery, THE SYSTEM SHALL submit <business payload> to the confirmed integration boundary.` |
| 失败处理 | `IF the integration request fails or times out, THE SYSTEM SHALL expose delivery status and available recovery action.` |
| 幂等 | `IF the same external event is received more than once, THE SYSTEM SHALL avoid applying duplicate business effects.` |
| 限流 | `THE SYSTEM SHALL respect confirmed provider limits and expose queued or delayed status when processing is deferred.` |
| 回调 | `WHEN an external callback changes <business state>, THE SYSTEM SHALL update the visible state or mark the callback as rejected with reason.` |
| 决策标记 | `IF provider choice is not confirmed, THE REQUIREMENTS SHALL mark [NEEDS DEPENDENCY DECISION] instead of selecting a provider.` |

## AC 模板

| Given | When | Then | 验证方式 |
|---|---|---|---|
| provider 可用 | 触发集成事件 | 系统展示提交成功或处理中状态 | contract / E2E |
| provider 超时 | 触发集成事件 | 系统展示失败或排队状态并允许恢复 | contract / E2E |
| 重复 webhook 到达 | 系统处理第二个事件 | 系统不产生重复业务副作用 | automated / contract |
| provider 未确认 | 编写 requirements | 文档包含 decision marker，未写 provider 方案 | inspection |

## requirements 不定义

- 最终 API 路由、schema、client、SDK 版本。
- 具体数据库表、服务类、队列实现。
- provider 选择，除非用户已确认或 research 已批准。

## 常见漏项

- 只写“接入第三方”，不写失败、超时、限流、重试、幂等。
- 把 provider 选择写成需求，实际没有用户确认。
- 不写用户可见同步状态和人工恢复路径。
- 忘记重复回调、乱序回调和部分成功。
