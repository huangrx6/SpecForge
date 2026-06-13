# Skeleton Progress

## Purpose

Skeleton 和 Progress 用于表达加载、处理和异步任务进度。它们必须降低等待焦虑，不制造假稳定感。

## Structure

- skeleton shape：匹配真实布局，不随机灰条
- progress value：确定进度或不确定状态
- status text：当前步骤、剩余或结果
- cancel/retry：长任务可取消或重试
- partial render：已加载内容先显示
- error recovery：失败后保留上下文

## Variants

- page-skeleton、table-skeleton、card-skeleton、form-skeleton
- inline-spinner：按钮或小区域
- determinate-progress：导入/生成/上传百分比
- indeterminate-progress：等待接口或 AI 思考
- step-progress：多阶段任务
- optimistic-loading：短任务即时反馈

## States

- loading、partial-loaded、long-wait、success、failed
- cancelled、retrying、paused
- background-running：任务离开页面仍继续
- stale：加载结果过期
- rate-limited：等待排队

## Density

- 短于 500ms 可不显示骨架，避免闪烁
- 表格骨架行数 5-8 行，匹配列宽
- 卡片骨架保持最终高度
- 按钮 spinner 不改变按钮宽度
- 长任务每 3-5 秒更新状态文案

## shadcn-vue mapping

- Primitive：Skeleton、Progress、Spinner、Toast/Sonner、Alert
- Companions：Button、Card、Table
- Project wrappers：PageSkeleton、TableSkeleton、AsyncProgress、GenerationProgress
- Props：type、loading、progress、steps、message、cancellable
- Events：cancel、retry、complete

## Content

- 状态文案具体：“正在生成诊断建议”
- 长任务说明预计时间或当前阶段
- 失败文案给恢复动作
- 进度百分比必须真实，不伪造 99%
- 后台任务完成可用 toast 通知

## Anti-patterns

- 所有加载都全屏遮罩，打断用户
- 骨架形状和最终布局不一致
- spinner 没有文字，用户不知道在等什么
- 假进度条长期停在 99%
- 失败后只消失不解释
- 加载时布局高度跳动
