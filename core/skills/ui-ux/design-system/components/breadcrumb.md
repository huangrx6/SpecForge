# Breadcrumb

面包屑用于深层页面定位，不替代主导航。

## Anatomy

root / separator / ancestor item / current item / overflow menu / tooltip.

## Variants

- static breadcrumb：固定层级。
- entity breadcrumb：包含动态对象名。
- overflow breadcrumb：深层折叠。

## States

default / hover / focus / current / truncated / overflow.

## Rules

- 最后一项是当前页，不可点击。
- 动态对象名称过长时截断并保留 tooltip。
- 移动端可折叠中间层级。

## shadcn-vue

- Primitive: Breadcrumb, DropdownMenu.
- Project wrapper: AppBreadcrumb, EntityBreadcrumb.

## Anti-patterns

- 面包屑层级和 URL / 信息架构不一致。
- 当前页仍可点击。
- 移动端挤压标题。
