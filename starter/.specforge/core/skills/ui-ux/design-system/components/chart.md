# Chart

图表用于回答一个明确问题，不用于装饰页面。

## Purpose

图表必须服务比较、趋势、构成、分布或异常发现。没有明确问题时，优先用指标卡或表格。

## Anatomy

title / insight subtitle / legend / axis / unit / tooltip / annotation / empty / error / source.

## Variants

- line：趋势。
- bar：分类比较。
- stacked bar：构成比较。
- area：总量趋势。
- donut：少量构成，谨慎使用。
- scatter：相关性。
- heatmap：时段/区域密度。

## States

loading / empty / filtered-empty / error / partial-data / stale / annotated.

## Rules

- 标题写结论或问题。
- 坐标轴、单位、时间范围清楚。
- 颜色不超过 6 个主要系列。
- 空值、异常值和加载失败要有说明。
- 图例名称必须和业务术语一致。

## shadcn-vue

- Primitive: Card, Select, Skeleton, Alert.
- Project wrapper: InsightChart, MetricTrend, ChartToolbar.

## Anti-patterns

- 没有单位和时间范围。
- 用 3D、阴影或渐变让图表更“炫”。
- 饼图展示太多分类。
- 颜色只为了好看，不承担语义。
