# Stepper

步骤条用于多步表单、审批、导入和配置向导。

## Anatomy

step list / step number / label / status / current panel / footer actions / validation summary.

## Contract

- 三步以上流程才使用 Stepper；两步以内使用标题和按钮即可。
- 每步要能说明目标、必填项和退出后数据是否保留。
- 支持 current / complete / error / disabled / skipped 状态。
- 错误应定位到具体步骤和字段。

## Variants

linear stepper / non-linear stepper / import wizard / approval progress.

## States

pending / current / completed / error / skipped / disabled / saving.

## shadcn-vue

- Primitive: Tabs, Progress, Button, Alert.
- Project wrapper: FormStepper, ImportStepper, ApprovalStepper.

## Anti-patterns

- 用 Stepper 表示同级 Tab。
- 下一步前不校验当前步骤。
- 返回上一步导致输入丢失。
