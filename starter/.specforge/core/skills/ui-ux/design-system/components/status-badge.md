# Status Badge

状态徽标用于表达对象状态，不用于装饰。

## Anatomy

label / optional icon / semantic color / tooltip / timestamp or reason.

## Variants

success / warning / error / info / neutral / processing / disabled / permission.

## States

default / hover-tooltip / stale / updating / unknown.

## Rules

- 状态色只服务语义。
- 必须有文本，不能只靠颜色或图标。
- 状态命名使用业务语言，例如 `待审核`、`同步失败`。
- 复杂状态提供 tooltip 或详情入口。

## shadcn-vue

- Primitive: Badge, Tooltip.
- Project wrapper: StatusBadge, SyncStatus, PermissionBadge.

## Anti-patterns

- 所有 badge 都是彩色糖果样式。
- 同一颜色表示多个含义。
- unknown 状态没有兜底。
