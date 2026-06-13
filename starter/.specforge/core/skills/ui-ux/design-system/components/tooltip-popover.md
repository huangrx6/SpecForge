# Tooltip And Popover

Tooltip 解释短操作，Popover 承载轻量交互。不要用 Tooltip 放长说明。

## Tooltip

- 用于 icon-only 按钮、字段缩写、图标状态。
- 内容控制在一句话内。
- 必须支持 keyboard focus。

## Popover

- 用于筛选快捷项、日期范围、轻量详情、局部设置。
- 有输入或操作时要能通过 Esc / 点击外部关闭。
- 内容超过 320px 或需要提交确认时考虑 Dialog / Drawer。

## shadcn-vue mapping

- Primitive: Tooltip, Popover, HoverCard.
- Project components: FieldHelp, ActionTooltip, FilterPopover.
