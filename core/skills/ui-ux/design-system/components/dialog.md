# Dialog

## Purpose

Dialog 用于需要打断当前流程的确认、短任务或关键反馈。复杂编辑、长表单和多步骤流程优先用 Drawer 或独立页面。

## Structure

- overlay：遮罩和背景不可交互策略
- container：title、description、content、footer、close
- focus trap：打开后聚焦标题或首个字段，关闭后回到触发器
- footer：主动作、取消、危险动作、loading
- escape：Esc、点击遮罩、关闭按钮的规则一致
- scroll：内容过长时 body 滚动，footer 固定

## Variants

- confirm：确认继续或取消
- destructive-confirm：删除、覆盖、撤回，展示后果
- form-dialog：少量字段快速创建
- preview：查看图片、代码、详情片段
- blocking：系统必须处理的错误或权限提示
- success-result：提交后的结果和下一步

## States

- opening、default、submitting、submitted、failed
- validation-error：字段内联显示
- destructive-pending：危险动作二次确认
- unsaved：关闭前提醒保存/放弃
- permission：说明不可继续原因
- nested-blocked：避免 dialog 套 dialog，必要时升级 drawer/page

## Density

- sm：320-400px，确认类
- md：480-560px，短表单
- lg：640-760px，预览或复杂确认
- mobile：近似 bottom sheet，高度不超过视口安全区
- footer button 保持 36-44px，移动端全宽或双按钮

## shadcn-vue mapping

- Primitive：Dialog、AlertDialog、Button、ScrollArea、Form、Separator
- Companions：Drawer for mobile/long content、Toast/Sonner for follow-up
- Project wrappers：ConfirmDialog、DangerDialog、FormDialog、PreviewDialog
- Props：open、variant、title、description、loading、closeOnOverlay、confirmText
- Events：confirm、cancel、close、after-leave

## Content

- 标题直接说明动作：“删除成员？”
- 描述写后果和影响范围，不写空话
- 危险确认按钮写具体动作：“确认删除 3 个成员”
- 取消按钮写“取消”或“返回编辑”，不要写“否”
- 失败文案保留在 dialog 内，提供重试

## Anti-patterns

- 用 dialog 承载长流程，用户无法定位上下文
- 关闭按钮、遮罩、Esc 行为不一致
- 提交中允许重复点击或关闭导致状态不明
- 危险弹窗只写“是否确认”
- dialog 套 dialog，焦点和层级混乱
- 移动端弹窗高度溢出且 footer 被键盘遮挡
