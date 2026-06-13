# Toast

Toast 用于短暂反馈，不承载关键流程和复杂决策。

## Purpose

- 操作成功。
- 可恢复错误的提示。
- 异步任务开始/完成。
- 复制、保存、发送等短反馈。

## Anatomy

icon / title / description / action / close / severity / duration.

## Variants

success / info / warning / error / loading / action-required.

## States

entering / visible / updating / dismissing / persisted.

## Rules

- 成功 toast 简短。
- 错误 toast 要有下一步或追踪 ID。
- 需要用户决策时用 dialog，不用 toast。
- 多个 toast 要堆叠有序，不遮挡主操作。
- 长任务 toast 应可跳转任务中心或详情。

## shadcn-vue

- Primitive: Toast, Sonner, Button.
- Project wrapper: AppToast, AsyncJobToast, ErrorToast.

## Anti-patterns

- 表单错误只用 toast。
- toast 遮挡底部输入栏。
- 所有错误都写“操作失败”。
- 关键确认只显示 2 秒就消失。
