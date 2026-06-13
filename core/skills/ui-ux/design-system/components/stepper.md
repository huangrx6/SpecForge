# Stepper

## Purpose

Stepper 表达有顺序依赖的流程进度。没有强依赖的并列内容不要做成步骤。

## Structure

- steps：编号、标题、描述、状态
- current panel：当前任务内容
- navigation：上一步、下一步、保存草稿、提交
- validation gate：进入下一步前的校验
- summary：最终确认和变更摘要
- recovery：失败、返回、草稿恢复

## Variants

- linear：必须按顺序完成
- non-linear：允许回到已完成步骤
- wizard-form：多步骤表单
- process-status：只读流程状态
- onboarding：引导配置
- mobile-stepper：顶部短标题 + 底部操作

## States

- pending、current、completed、error、warning
- skipped、disabled、saving、saved-draft
- blocked：前置条件未完成
- reviewing / submitted
- server-rejected：提交后回到问题步骤

## Density

- desktop horizontal：3-5 步
- vertical：步骤多或说明长
- mobile：只显示“第 2/5 步”和当前标题
- step panel 和导航固定间距 16-24px
- 底部操作固定，长内容滚动

## shadcn-vue mapping

- Primitive：Stepper、Button、Form、Alert、Progress
- Companions：Tabs only for non-linear content, not strict flow
- Project wrappers：WizardStepper、ProcessStepper、ReviewStepper
- Props：steps、current、linear、validity、saving、draft
- Events：next、prev、jump、save-draft、submit

## Content

- 步骤标题用结果名：“填写信息”“确认影响”“提交发布”
- 错误步骤显示具体阻塞数量
- 最终提交按钮写具体动作
- 保存草稿说明是否自动保存
- 只读流程显示时间、处理人和结果

## Anti-patterns

- 把 tabs 伪装成 stepper，用户可跳过必填
- 步骤过多且无分组
- 当前步骤没有明确主任务
- 返回上一步丢失内容
- 错误只在最后一步出现
- 移动端步骤条占据太多高度
