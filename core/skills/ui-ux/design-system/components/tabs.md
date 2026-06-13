# Tabs

Tabs 用于同层级内容切换，不用于流程步骤。

## Anatomy

list / trigger / active indicator / panel / count / badge / overflow.

## Variants

- page tabs：页面内一级切换。
- card tabs：局部区域切换。
- segmented control：少量互斥模式。
- status tabs：带数量的状态过滤。

## States

default / active / hover / focus / disabled / loading-count / overflow.

## Rules

- Tab 数量 2-7 个。
- 不用 tabs 表示流程步骤；流程用 stepper。
- 当前项明确，不只靠颜色。
- 移动端可横向滚动或转 segmented control。
- Tab 内容需要懒加载时要有 loading。

## shadcn-vue

- Primitive: Tabs, Badge, ScrollArea.
- Project wrapper: PageTabs, StatusTabs, SegmentedControl.

## Anti-patterns

- Tab 嵌套 Tab。
- Tab 名称过长且不截断。
- 切换后丢失筛选状态。
- 用 Tab 承载权限不可见的内容但不提示。
