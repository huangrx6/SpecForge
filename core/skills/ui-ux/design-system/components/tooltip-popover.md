# Tooltip Popover

## Purpose

Tooltip 提供即时解释，Popover 承载轻量补充内容或局部操作。它们不能替代正式帮助、错误提示或复杂流程。

## Structure

- trigger：可聚焦元素，不只 hover
- content：短说明、字段解释、轻操作
- placement：不遮挡目标和主操作
- delay：tooltip 有适当延迟，popover 点击打开
- dismiss：Esc、外部点击、再次点击
- arrow / offset：和触发器关系清晰

## Variants

- tooltip：一句解释或 icon label
- rich-tooltip：带快捷键/状态解释
- popover-info：指标口径、字段说明
- popover-action：轻量设置或复制
- hover-card：身份/对象摘要
- help-popover：复杂说明入口

## States

- closed、opening、open、hovered、focused
- interactive：popover 内可点击
- disabled-trigger：仍能解释禁用原因
- overflow-adjusted：靠边自动换位
- mobile-fallback：点击或底部面板
- loading-content：远程摘要

## Density

- tooltip 文案 1-2 行，宽 220-320px
- popover 宽 280-420px，不超过小面板
- trigger hit area 不小于 24px，移动端 44px
- 同屏 tooltip 不要同时出现多个
- 长说明改为 help drawer 或文档链接

## shadcn-vue mapping

- Primitive：Tooltip、Popover、HoverCard、Button、Kbd
- Companions：ScrollArea、Separator
- Project wrappers：HelpTooltip、DisabledReasonTooltip、MetricPopover、ActionPopover
- Props：content、placement、delay、interactive、disabledReason
- Events：open-change、action-click

## Content

- tooltip 写“查看审批规则”，不写完整段落
- 禁用原因直接说明前置条件
- 指标口径包含公式、时间范围和更新频率
- popover 操作按钮文案要明确
- 移动端说明可点击关闭

## Anti-patterns

- 重要错误只放 tooltip，键盘和移动端看不到
- tooltip 内容太长像文档
- hover 才能操作，移动端不可用
- popover 遮住触发器和主按钮
- 同一个 icon 到处含义不同
- 用 tooltip 掩盖糟糕文案
