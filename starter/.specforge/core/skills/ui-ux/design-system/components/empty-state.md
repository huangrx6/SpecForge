# Empty State

## Purpose

空态解释为什么没有内容，并给出下一步。它区分初始无数据、筛选无结果、权限不可见、加载失败和业务关闭。

## Structure

- visual：小尺寸、低干扰，可选业务图标
- title：直接说明状态
- description：解释原因和影响范围
- primary action：创建、清空筛选、申请权限、重试
- secondary：查看文档、联系管理员、返回上级
- diagnostic：错误码、筛选条件、更新时间按需出现

## Variants

- first-use：首次使用，引导创建
- zero-data：确实没有业务数据
- filtered-empty：筛选条件过窄
- permission-empty：没有权限或未开通
- error-empty：加载失败但可重试
- archived-empty：对象已删除/停用/过期

## States

- default、action-loading、retrying、failed-again
- permission-requested：已申请权限
- filter-reset：清空后恢复列表
- offline：离线无法加载
- partial：部分模块无数据但页面可用

## Density

- inline：表格/卡片内部，高度 120-180px
- panel：页面主区域，高度 240-360px
- mobile：简短文案 + 单主按钮
- visual 不超过空态区域 30%，不压过行动
- 长说明进入 tooltip / help link

## shadcn-vue mapping

- Primitive：Empty、Button、Alert、Card、Skeleton、Tooltip
- Companions：Icon、Help link、Permission request action、Retry action
- Project wrappers：ListEmpty、FilteredEmpty、PermissionEmpty、ErrorEmpty、FirstUseEmpty
- Props：type、title、description、action、secondaryAction、diagnostic
- Events：action-click、reset-filter、retry、request-permission

## Content

- 标题写“暂无工单”而不是“空空如也”
- 筛选无结果写“没有符合当前筛选的记录”
- 权限空态写“你暂无查看客户列表的权限”
- 错误空态写可执行动作：“加载失败，请重试”
- 首用空态可以引导，但不做营销文案

## Anti-patterns

- 所有空态都用同一张插画和“暂无数据”
- 无权限伪装成无数据，造成误解
- 筛选无结果不给清空筛选
- 错误态只显示空白区域
- 插画过大、彩色过重，页面显得廉价
- 空态按钮和页面主任务冲突
