# Role / Permission Requirements Pattern

用于多角色、管理员、审批、可见性、导出、回滚、敏感数据或权限差异会影响行为的需求。

## 什么时候使用

- 需求提到管理员、普通用户、审核员、客户经理、租户、组织、团队或外部用户。
- 同一功能对不同角色可见性、操作权限、导出范围或数据范围不同。
- 权限不足时需要隐藏、禁用、提示、申请权限或记录审计。
- 涉及敏感数据、跨组织访问、审批、回滚、删除或批量操作。

## 必须问清

- 哪些角色参与？
- 每个角色能看什么，不能看什么？
- 谁能创建、修改、删除、审批、导出或回滚？
- 无权限时系统是隐藏入口、禁用操作，还是展示 permission state？
- 是否需要记录审计：谁、何时、对什么对象、做了什么、结果是什么？
- 部分权限场景如何处理，例如能看列表但不能看详情，能编辑但不能导出。

## REQ 模板

| 场景 | REQ 写法 |
|---|---|
| 可见性 | `WHILE a user has <role/scope>, THE SYSTEM SHALL display only <objects> visible to that role/scope.` |
| 操作权限 | `WHILE a user lacks permission for <action>, THE SYSTEM SHALL prevent <action> and expose a permission-limited state.` |
| 部分权限 | `IF a user can view <object> but cannot <action>, THE SYSTEM SHALL keep the object readable while preventing the restricted action.` |
| 审计 | `WHEN a privileged action is completed or denied, THE SYSTEM SHALL record actor, target, action, result, and timestamp for audit review.` |
| 跨组织边界 | `THE SYSTEM SHALL NOT expose <data> across organization boundaries unless the source requirement explicitly authorizes sharing.` |

## AC 模板

| Given | When | Then | 验证方式 |
|---|---|---|---|
| 用户拥有授权角色和可见数据 | 打开目标页面或执行操作 | 系统展示允许的数据并允许授权动作 | E2E / manual |
| 用户缺少目标操作权限 | 尝试执行受限动作 | 系统阻止动作并展示权限受限原因或恢复路径 | E2E |
| 用户拥有部分权限 | 打开对象详情 | 系统允许查看已授权内容并隐藏或禁用未授权操作 | E2E |
| 执行敏感动作 | 动作成功或失败 | 审计记录包含 actor、target、action、result、timestamp | inspection / automated |

## 常见漏项

- 只写管理员，不写普通用户。
- 只写有权限路径，不写无权限、部分权限和跨组织边界。
- 只写按钮禁用，不写原因、恢复路径或审计。
- 把权限实现写成角色表、数据库字段或前端路由，而不是系统行为。
- 忘记导出、批量操作、删除和回滚这些高风险动作。
