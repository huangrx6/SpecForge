# Permission Management Page

适用于角色、用户、组织、策略和资源授权。

## Layout

- 资源、角色、用户三者关系必须清晰，不要把所有配置放进一个表格。
- 高风险权限使用分组、搜索和变更摘要。
- 提交前展示新增、删除、变更的差异。

## States

default / loading / empty-role / no-permission / conflict / partial-failure / saved.

## Components

RoleList, PermissionTree, UserPicker, ChangeSummary, ConfirmDialog.
