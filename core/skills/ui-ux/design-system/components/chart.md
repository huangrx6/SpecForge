# Chart

## Purpose

图表用于展示趋势、结构、对比和异常。它必须服务一个分析问题，不是给页面增加“数据感”的装饰。

## Structure

- title：指标 + 维度 + 时间范围
- subtitle：读者应看到的洞察，不写数据源名
- plot：坐标轴、图例、网格线、标记、tooltip
- controls：时间范围、分组、指标切换、下载
- annotation：异常点、目标线、口径变化
- fallback：无数据、采样、权限、加载失败

## Variants

- line：趋势、同比环比
- bar：分类对比、Top N
- stacked bar / area：构成随时间变化
- pie/donut：只用于少量稳定构成，后台慎用
- scatter：相关性、分布、异常点
- metric sparkline：指标卡内微趋势
- heatmap：时间/区域密度

## States

- loading、empty、filtered-empty、error、permission
- partial-data：样本不足、延迟、缺口
- stale：更新时间过旧
- hover / selected-series / hidden-series
- threshold-breach：超过目标或预警
- drilldown：点击进入明细表

## Density

- card chart：高度 180-260px
- dashboard：高度 280-360px，适合多图比较
- full analysis：420px+，支持图例和筛选
- mobile：减少系列数，tooltip 全宽或底部面板
- legend 超过 6 项要筛选、分页或直接标签

## shadcn-vue mapping

- Primitive：Chart registry、Card、Select、Tabs、Tooltip、Skeleton
- Companions：Legend、Badge、Button、DropdownMenu、Table detail fallback
- Libraries：Recharts / ECharts / Vue chart stack，按项目既有技术选
- Project wrappers：MetricChart、TrendChart、BreakdownChart、InsightChart
- Props：data、xField、yFields、colorField、unit、timeRange、loading、emptyReason
- Events：point-click、series-toggle、range-change、download

## Content

- 标题不能只写“统计图”，要写“近 7 天工单处理量”
- 单位写在轴、tooltip 或数值旁，保持一致
- tooltip 展示口径、同比、环比和样本量
- 异常注释写事件原因：“版本发布后错误量上升”
- 无数据说明是无权限、无记录还是筛选过窄

## Anti-patterns

- 没有分析问题就放图
- 颜色过多、图例过长、视觉噪音大
- 双轴图不解释口径，误导读者
- 饼图展示 12 个分类
- 图表 loading 时高度变化
- 标题写 by segment 但颜色/分组没有编码
