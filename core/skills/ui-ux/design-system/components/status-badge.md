# Status Badge

## Purpose

StatusBadge 用于低成本表达对象状态、风险、权限或流程阶段。它辅助扫描，不替代详细说明和操作反馈。

## Structure

- label：状态名或阶段名
- tone：semantic color，不使用随机颜色
- icon：只在提升识别或风险时使用
- tooltip：解释口径、下一步或时间
- meta：可选数量、时间、原因
- container：固定高度和圆角，避免撑开行高

## Variants

- status：启用、停用、处理中、失败
- severity：info、success、warning、error、neutral
- stage：草稿、待审、已发布、已归档
- role/permission：管理员、只读、外部用户
- count-badge：未读数、异常数
- quality：高/中/低、命中/未命中

## States

- default、hover-info、selected-filter
- stale：状态可能过期
- pending：状态更新中
- disabled：状态不可变更
- interactive：可点击筛选或进入详情
- overflow：长状态截断并 tooltip

## Density

- tiny：16-18px，角标或表格紧凑列
- compact：20-22px，表格和卡片 meta
- default：24px，详情页
- mobile：触摸型 badge 不小于 32px
- 同组 badge 间距 4-6px，最多 3 个，更多折叠

## shadcn-vue mapping

- Primitive：Badge、Tooltip、Popover
- Companions：Button when interactive、DropdownMenu for status change
- Project wrappers：StatusBadge、SeverityBadge、RoleBadge、StageBadge
- Props：type、tone、label、icon、interactive、tooltip、loading
- Events：click、status-change

## Content

- 状态词使用业务统一枚举，不混用“成功/已完成/完成”
- 失败状态可 tooltip 说明原因
- 数量 badge 超过 99 用 99+
- 不要只用颜色，文本必须可读
- 状态可点击时文案/hover 体现筛选或动作

## Anti-patterns

- 每个状态随机配色，语义不稳定
- badge 过大抢走主信息
- 只用圆点没有文字，色弱不可识别
- 状态文字过长撑破表格
- 把操作按钮伪装成 badge
- 同一页面状态命名不一致
