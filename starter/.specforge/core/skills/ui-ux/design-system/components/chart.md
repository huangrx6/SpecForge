# Chart

## 组件契约

- 标题写业务问题，副标题写时间范围 / 口径。
- 轴、单位、图例和空值解释必须可见。
- hover tooltip 展示原始值和上下文。
- 异常值需要标注，不静默平滑。

## shadcn-vue

可参考 shadcn-vue chart / reka / echarts 封装，但项目级 ChartCard 必须统一 loading、empty、error、export 和 source note。
