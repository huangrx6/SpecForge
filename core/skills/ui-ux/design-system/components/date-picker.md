# Date Picker

## Purpose

日期选择器用于选择单日、范围、时间或业务周期。它必须明确时区、边界、快捷项和格式。

## Structure

- trigger：当前值、placeholder、clear
- calendar：月份、日期、禁用范围、今天
- range：开始/结束、hover preview、快捷范围
- time：时分秒或业务粒度
- footer：确认、取消、清空、快捷项
- timezone：必要时展示时区或数据口径

## Variants

- single-date、date-range、date-time、month-picker
- quick-range：今天、近 7 天、本月
- business-period：账期、班次、节假日
- readonly-date：只展示可复制
- mobile-date：原生或 bottom sheet

## States

- empty、open、selected、range-start/end
- invalid-range、disabled-date
- loading-availability：查询可选日期
- timezone-warning
- max-range-reached
- dirty-unapplied：选择后未应用

## Density

- trigger 32px for filter / 36-40px for form
- calendar width 280-360px
- range picker 可双月展示，移动端单月
- 快捷项列表不超过 8 个
- 时间选择和日期间距清晰，避免误点

## shadcn-vue mapping

- Primitive：DatePicker、Calendar、RangeCalendar、Popover、Button、Select
- Companions：Input、FormField、Tooltip
- Project wrappers：DateRangePicker、QuickDatePicker、BusinessPeriodPicker
- Props：mode、value、min、max、shortcuts、timezone、disabledDates
- Events：select、apply、clear、month-change

## Content

- 格式统一：YYYY-MM-DD 或 YYYY-MM-DD HH:mm
- 范围显示“2026-06-01 至 2026-06-13”
- 禁用日期 tooltip 写原因
- 快捷项使用业务常用范围，不堆满
- 涉及统计口径时写“按自然日统计”

## Anti-patterns

- 日期格式在页面间不一致
- 选择范围后立即刷新但用户以为未确认
- 禁用日期无原因
- 时区/账期不明确导致数据误解
- 移动端日历太小难点
- 快捷项过多且无业务价值
