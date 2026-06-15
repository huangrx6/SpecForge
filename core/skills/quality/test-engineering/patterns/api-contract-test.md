# API Contract Test

| 对象 | 断言 |
| --- | --- |
| 请求参数 | 必填、类型、边界、非法输入 |
| 响应 | 状态码、字段、错误结构 |
| 权限 | 授权角色通过，无权限角色失败 |
| 外部调用 | mock contract、超时、失败兜底 |
| 兼容性 | 旧客户端或旧字段不破坏 |

输出必须包含 setup、command、assertions 和 cleanup。
