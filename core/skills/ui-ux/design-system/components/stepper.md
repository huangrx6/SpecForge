# Stepper

步骤条用于多步表单、审批、导入和配置向导。

## Contract

- 三步以上流程才使用 Stepper；两步以内使用标题和按钮即可。
- 每步要能说明目标、必填项和退出后数据是否保留。
- 支持 current / complete / error / disabled / skipped 状态。
- 错误应定位到具体步骤和字段。

## shadcn-vue mapping

- Primitive: Tabs, Progress, Button, Alert.
- Project components: FormStepper, ImportStepper, ApprovalStepper.
