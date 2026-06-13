# Tabs

## Purpose

Tabs 用于同一对象或同一任务下的并列视图切换。它不是主导航替代品，也不用于强顺序流程。

## Structure

- list：tab group、active indicator、overflow
- trigger：label、count/status、icon 可选
- panel：对应内容区域，保持语义和焦点
- keyboard：左右切换、Home/End
- overflow：更多、横向滚动或二级菜单
- persistence：URL query、local state 或默认项

## Variants

- content-tabs：详情页子视图
- filter-tabs：状态快捷筛选
- segmented-tabs：少量互斥模式
- vertical-tabs：设置页或宽屏复杂配置
- mobile-scroll-tabs：H5 横向滚动
- status-tabs：带数量和异常状态

## States

- active、hover、focus、disabled
- loading-panel：切换后局部加载
- empty-panel、error-panel、permission-panel
- overflowed：隐藏项可访问
- count-updating：数量刷新不抖动
- deep-link：URL 打开指定 tab

## Density

- compact：32px 高，适合表格上方筛选
- default：40px，高频内容切换
- large：44-48px，移动端触摸
- tab gap 4-8px，active 指示器不改变布局
- panel top spacing 12-16px，不塞卡片外壳

## shadcn-vue mapping

- Primitive：Tabs、TabsList、TabsTrigger、TabsContent、Badge、ScrollArea
- Companions：Select for mobile fallback、DropdownMenu for overflow
- Project wrappers：ContentTabs、FilterTabs、StatusTabs、ResponsiveTabs
- Props：items、modelValue、counts、disabledReason、lazy、persist
- Events：update:modelValue、tab-click、panel-load

## Content

- label 使用名词：“概览”“成员”“日志”
- 数量写在 badge：“待处理 12”
- 禁用 tab 说明原因，不只灰掉
- 状态筛选 tab 要和 FilterBar 同步
- 不要使用过长 label，必要时进入更多菜单

## Anti-patterns

- 用 tabs 做步骤向导，用户可跳过依赖
- tabs 嵌套 tabs，层级混乱
- 切换后整页跳动或丢失滚动位置
- tab label 只有图标没有说明
- 移动端 8 个 tab 挤在一行
- tab 内容差异太大，本应是导航
