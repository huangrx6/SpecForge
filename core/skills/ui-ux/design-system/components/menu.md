# Menu

## Purpose

Menu 收纳同一对象或区域的次级操作。它不是主任务入口，也不该隐藏用户最高频的关键动作。

## Structure

- trigger：明确可点区域和 aria-label
- content：分组、分隔、危险区、禁用原因
- item：icon、label、shortcut、description 可选
- submenu：只用于复杂分类，层级最多 2 层
- selection：radio/checkbox menu 表示当前配置
- focus：键盘上下移动和 Esc 关闭

## Variants

- dropdown-action：更多操作
- context-menu：右键或长按上下文动作
- user-menu：账户、组织、退出
- view-menu：列设置、密度、排序
- selection-menu：单选/多选设置
- danger-menu：危险动作单独分组

## States

- closed、open、hover、focus、disabled
- item-loading：动作执行中
- permission-disabled：显示原因
- checked / selected
- destructive-hover：危险项 hover 不误触
- empty-menu：没有可用操作时不展示 trigger

## Density

- item height 32-36px，带描述 44-52px
- content width 180-260px，长文案截断
- icon 16px，和 label 保持固定间距
- 分组之间 separator，不用大留白
- 移动端复杂菜单转 drawer/action sheet

## shadcn-vue mapping

- Primitive：DropdownMenu、ContextMenu、Menubar、Button、Tooltip
- Companions：AlertDialog for destructive、Command for searchable actions
- Project wrappers：ActionMenu、UserMenu、ViewOptionsMenu、RowActionMenu
- Props：items、groups、loadingKey、permissions、align
- Events：select、open-change、checked-change

## Content

- 菜单项用动词短语：“复制链接”“导出明细”
- 危险项明确对象：“删除成员”
- 禁用项 tooltip 写原因
- 快捷键靠右显示，不塞进 label
- 分组标题写业务类型：“视图”“导出”“危险操作”

## Anti-patterns

- 把主动作藏进更多菜单
- 菜单项超过 8 个仍不分组
- 危险操作和普通操作混在一起
- 禁用项没有原因
- 触发器只有三个点但无 tooltip
- 移动端 hover 菜单不可用
