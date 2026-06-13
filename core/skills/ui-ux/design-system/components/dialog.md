# Dialog

Dialog 是中断式决策容器，只用于需要用户立即处理的短流程。

## Purpose

- 高风险确认。
- 小范围创建 / 编辑。
- 需要阻断页面继续操作的决策。
- 系统异常需要用户选择恢复路径。

## Anatomy

title / description / content / warning or context / primary action / secondary action / close / inline error.

## Variants

- confirm dialog：删除、覆盖、撤销。
- form dialog：短表单，少于 6 个字段。
- info dialog：关键说明，但避免滥用。
- destructive dialog：必须说明后果和恢复方式。

## States

open / closing / submitting / failed / success / validation-error / permission.

## Layout

- 宽度 360-560px；内容超过两屏时改 drawer/page。
- 操作按钮放底部，主按钮文案写结果。
- 移动端 dialog 接近 bottom sheet 时要考虑安全区。

## shadcn-vue

- Primitive: Dialog, AlertDialog, Button, Form.
- Project wrapper: ConfirmDialog, FormDialog, DangerConfirmDialog.

## Anti-patterns

- 复杂长流程塞进 dialog。
- 标题写“提示”，按钮写“确定”。
- 提交失败只 toast，dialog 内无恢复。
- 关闭按钮和取消按钮行为不一致。
