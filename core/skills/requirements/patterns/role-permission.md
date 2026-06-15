# Role / Permission Pattern

用于多角色、管理员、审批、可见性、导出、回滚或敏感数据场景。

## 必问事实

- 角色有哪些？
- 每个角色能看到、创建、修改、删除、审批、导出什么？
- 权限不足时系统如何表现？
- 是否需要审计记录？

## 输出

```md
| REQ-ROLE-001 | MUST | WHILE a user lacks permission for an action, THE SYSTEM SHALL prevent the action and expose a permission-limited state. | source | AC-ROLE-001 |
```

## AC 覆盖

- authorized path
- unauthorized path
- partial permission
- audit / no audit
- visibility of hidden data
