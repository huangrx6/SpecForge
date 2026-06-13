# Menu

菜单用于承载次级操作或上下文操作。菜单不应隐藏主要任务。

## Anatomy

trigger / group / item / icon / shortcut / danger item / separator / disabled reason.

## Variants

- dropdown menu：按钮后更多操作。
- context menu：右键或行内上下文。
- user menu：用户、组织、退出。
- action menu：表格行操作。

## States

closed / open / focused / disabled / danger / selected / permission-hidden.

## Rules

- 菜单项文案用动词 + 对象。
- 危险项分组并使用 danger style。
- 禁用项给原因，或直接隐藏无权限项。
- 菜单项数量过多时分组或改 Command Palette。

## shadcn-vue

- Primitive: DropdownMenu, ContextMenu, Tooltip.
- Project wrapper: ActionMenu, UserMenu, RowActionMenu.

## Anti-patterns

- 主操作藏进更多菜单。
- 危险操作和普通操作混在一起。
- 菜单打开位置遮挡触发对象。
