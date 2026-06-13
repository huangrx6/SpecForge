# Form

## Purpose

表单用于采集、编辑和确认输入。它必须围绕用户任务组织，而不是把数据库字段顺序搬到页面上。

## Structure

- form root：提交边界、dirty guard、权限和保存策略
- section：基础信息、规则配置、通知对象等任务分组
- field：label、control、description、message、required、permission
- validation：客户端格式、服务端业务规则、异步校验结果
- save area：底部按钮、sticky save bar 或 step action
- summary：高风险提交前显示变更摘要和影响范围

## Variants

- simple：少于 6 个字段，一屏完成
- grouped：多分组配置，适合后台设置
- wizard：强顺序、强依赖或需要分步确认
- inline-edit：详情/表格中的轻编辑，失焦保存要可恢复
- review：提交前确认、差异摘要、风险提示
- bulk-form：批量操作，必须显示影响数量和不可处理项

## States

- pristine、dirty、validating、invalid、saving、saved、failed
- conflict：服务端版本变更，展示差异和覆盖/刷新选择
- partial-saved：部分字段成功，明确失败字段
- permission-disabled：字段可见但不可编辑时说明原因
- async-options-loading：下拉/远程搜索独立 loading
- submit-blocked：列出阻塞字段并可定位

## Density

- compact：label 上置，字段间 12px，适合抽屉/移动端
- default：字段间 16px，分组间 24px
- complex：分组间 32px，使用锚点、stepper 或 sticky summary
- desktop 双列只用于短字段，长文本、说明、错误保持单列
- mobile 控件不小于 44px，错误文案不覆盖下一项

## shadcn-vue mapping

- Primitive：Field、Form、Input、Textarea、Select、Checkbox、RadioGroup、Switch、Calendar、Alert、Button
- Companions：Tooltip、Popover、Separator、Skeleton、Toast/Sonner、AlertDialog
- Validation：VeeValidate + Zod / TanStack Form，按项目栈选择
- Project wrappers：AppForm、FormSection、SmartField、SaveBar、DirtyGuard、ChangeSummary
- Props：schema、initialValues、mode、density、readonly、submitState
- Events：submit、validate、field-change、reset、discard、conflict-resolve

## Content

- label 写业务名词：“预审批人”“问题类型”，不要写字段名
- description 说明何时影响结果，placeholder 只给示例
- 错误文案说明如何修复：“请输入 11 位手机号”
- 必填、可选、自动生成、不可编辑要有一致标记
- 保存成功文案说明结果：“已保存，规则 5 分钟内生效”

## Anti-patterns

- placeholder 当 label，输入后上下文消失
- 错误只放 toast，字段旁没有定位
- 长表单塞进一个巨卡片，没有分组和保存策略
- 保存失败后清空用户输入
- 必填星号很多但没有格式说明
- disabled 字段不说明权限、状态还是系统限制
