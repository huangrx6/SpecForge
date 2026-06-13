# Empty State

空态告诉用户为什么没内容，以及下一步做什么。

## Variants

- first-empty：首次进入，还没有创建内容。
- filtered-empty：筛选后无结果。
- permission-empty：无权限查看。
- error-empty：加载失败。
- context-expired：上下文失效。

## Anatomy

icon / title / explanation / primary action / secondary action / recovery hint.

## Content

- 标题说明状态，不写“暂无数据”就结束。
- 说明为什么为空。
- 可恢复时给主操作。
- 权限空态告诉用户如何申请或联系谁。

## Layout

- 工具页空态保持克制，不用大插画填满。
- 表格空态放在表格区域内。
- 移动端空态不要挤压底部主操作。

## shadcn-vue

- Primitive: Card, Button, Alert.
- Project wrapper: EmptyState, PermissionEmpty, ErrorEmpty, ContextExpiredState.

## Anti-patterns

- 所有空态都叫暂无数据。
- 空态没有下一步。
- 错误态伪装成空态。
- 权限空态诱导用户创建数据。
