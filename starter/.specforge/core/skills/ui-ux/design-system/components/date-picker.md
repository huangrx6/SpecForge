# Date Picker

日期组件用于单日、范围、快捷区间和业务周期。

## Contract

- 明确时区、格式和边界：今天、过去、未来、最大跨度。
- 范围选择提供快捷项：近 7 天、近 30 天、本月。
- 报表筛选要显示当前生效范围，不只显示 placeholder。
- 禁用日期需要有原因提示。

## shadcn-vue mapping

- Primitive: Calendar, Popover, Button.
- Project components: DateRangePicker, ReportPeriodPicker, BusinessDatePicker.
