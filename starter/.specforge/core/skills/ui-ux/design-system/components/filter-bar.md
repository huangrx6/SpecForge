# Filter Bar

## Purpose

FilterBar 帮助用户缩小数据范围和理解当前查询条件。它是列表/看板的数据入口，不应变成杂乱表单。

## Structure

- quick search：关键词、对象范围、清空
- primary filters：状态、时间、负责人等高频条件
- advanced filters：更多条件进入 popover/drawer
- active chips：已选条件、数量、清空单项
- actions：查询、重置、保存视图、导出
- result summary：命中数量、更新时间或筛选摘要

## Variants

- simple：搜索 + 1-3 个条件
- advanced：更多筛选折叠或抽屉
- saved-view：常用视图、默认视图
- faceted：多选标签、层级条件
- date-heavy：时间范围为主
- mobile-filter：按钮打开筛选抽屉

## States

- default、dirty、applied、loading、error
- empty-options：某个筛选无可选项
- invalid-range：时间或数值区间非法
- saved-view-active、saved-view-modified
- permission-limited：可选范围受角色限制
- collapsed / expanded

## Density

- toolbar：高度 40-48px，适合列表上方
- two-row：条件多时第二行显示 chips
- drawer：移动端或复杂条件，底部固定应用按钮
- chips 间距 6-8px，换行后不挤压表格
- 高级条件不超过主视线，默认收起

## shadcn-vue mapping

- Primitive：Input、Select、Combobox、Popover、Calendar、Button、Badge、Command
- Companions：Drawer、DropdownMenu、Separator
- Project wrappers：FilterBar、SavedViewBar、AdvancedFilterDrawer、FilterChip
- Props：filters、value、appliedValue、loading、savedViews、density
- Events：search、apply、reset、save-view、remove-filter

## Content

- 搜索 placeholder 写范围：“搜索姓名、手机号、工单号”
- chip 文案短而完整：“状态：处理中”
- 重置动作写“清空筛选”，避免误解为清空数据
- 时间范围显示绝对日期或“近 7 天”
- 无可选项说明是权限、数据为空还是接口失败

## Anti-patterns

- 筛选项和页面操作混在一起
- 应用后看不到当前条件
- 每改一个条件就自动刷新大表导致抖动
- 高级筛选默认全展开，占据半屏
- 筛选文案用字段名或接口枚举
- 移动端横向挤压所有筛选控件
