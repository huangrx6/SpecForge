# Tooltip And Popover

Tooltip 解释短操作，Popover 承载轻量交互。不要用 Tooltip 放长说明。

## Tooltip

- 用于 icon-only 按钮、字段缩写、图标状态。
- 内容控制在一句话内。
- 必须支持 keyboard focus。
- 不放可点击内容。

## Popover

- 用于筛选快捷项、日期范围、轻量详情、局部设置。
- 有输入或操作时要能通过 Esc / 点击外部关闭。
- 内容超过 320px 或需要提交确认时考虑 Dialog / Drawer。

## States

closed / open / focused / overflow-adjusted / dismissed.

## shadcn-vue

- Primitive: Tooltip, Popover, HoverCard.
- Project wrapper: FieldHelp, ActionTooltip, FilterPopover, QuickDetailPopover.

## Anti-patterns

- Tooltip 承载长段说明。
- Popover 里放复杂表单。
- hover-only 信息在移动端不可访问。
