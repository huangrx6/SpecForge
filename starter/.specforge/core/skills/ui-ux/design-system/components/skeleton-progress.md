# Skeleton And Progress

加载状态要降低焦虑，并保护布局稳定。

## Skeleton

- 骨架屏形状匹配最终内容，不用整页灰块。
- 表格加载使用固定行数，避免页面高度跳动。
- 首屏关键指标可以使用 shimmer，但不要所有区域同时闪。

## Progress

- 可估算任务使用进度条；不可估算任务使用 spinner + 状态文案。
- 异步任务超过 5 秒应给后台处理、刷新或通知策略。

## shadcn-vue mapping

- Primitive: Skeleton, Progress, Alert.
- Project components: TableSkeleton, MetricSkeleton, AsyncJobProgress.
