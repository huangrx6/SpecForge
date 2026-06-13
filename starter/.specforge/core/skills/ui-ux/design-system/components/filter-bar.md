# Filter Bar

筛选栏用于缩小数据范围，并让用户理解当前列表为什么是这些数据。

## Anatomy

keyword / primary filters / date range / advanced filters / active chips / reset / saved views / result count.

## Variants

- simple filter：搜索 + 1-3 个筛选。
- advanced filter：popover / drawer。
- saved view：常用筛选组合。
- dashboard filter：全局时间、区域、组织。

## States

idle / filtering / active / empty-result / error / saved / unsaved-changes.

## Layout

- 常用筛选直接展示，高级筛选收起。
- 当前筛选条件必须可见、可清除。
- 移动端用 drawer，底部放应用/重置。
- 日期和状态筛选要有默认值说明。

## shadcn-vue

- Primitive: Input, Select, Popover, Drawer, Badge, Button.
- Project wrapper: FilterBar, AdvancedFilterDrawer, SavedViewTabs.

## Anti-patterns

- 筛选条件隐藏，用户不知道数据范围。
- 重置只清部分条件。
- 高级筛选一打开就是超长表单。
- 筛选结果为 0 时没有恢复路径。
