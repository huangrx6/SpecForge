# Data / Permission Test

覆盖：

- 同角色不同数据范围。
- 不同角色访问同一对象。
- tenant / department / owner 隔离。
- 空数据、过期数据、被删除数据。
- 审计记录和 actor。

负向权限测试必须断言状态码、页面反馈、数据未泄露和日志不含敏感信息。
