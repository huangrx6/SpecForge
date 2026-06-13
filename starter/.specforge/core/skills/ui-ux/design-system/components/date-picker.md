# Date Picker

日期组件用于单日、范围、快捷区间和业务周期。

## Anatomy

trigger / current value / calendar / shortcuts / timezone hint / clear / apply / disabled reason.

## Variants

- single date：单日。
- date range：区间。
- report period：报表周期。
- business date：业务账期或自然日。

## Contract

- 明确时区、格式和边界：今天、过去、未来、最大跨度。
- 范围选择提供快捷项：近 7 天、近 30 天、本月。
- 报表筛选要显示当前生效范围，不只显示 placeholder。
- 禁用日期需要有原因提示。

## States

closed / open / selecting-start / selecting-end / invalid-range / disabled / loading-shortcuts.

## shadcn-vue

- Primitive: Calendar, Popover, Button.
- Project wrapper: DateRangePicker, ReportPeriodPicker, BusinessDatePicker.

## Anti-patterns

- 没有时区和包含/不包含边界说明。
- 快捷区间和实际日期不一致。
- 禁用日期无提示。
