# Drawer

## Purpose

Drawer 用于保留列表上下文的详情、筛选、辅助编辑或 AI 侧栏。它适合旁路任务，不适合核心长流程替代页面。

## Structure

- trigger context：来源行、来源卡片或按钮
- panel：header、body、footer、close、resize/width rule
- context summary：展示当前对象名、状态、来源
- body sections：详情、表单、历史、关联数据
- sticky footer：保存、下一步、关闭或恢复
- focus / scroll：面板内滚动，页面背景不抢焦点

## Variants

- detail-drawer：列表右侧详情
- edit-drawer：短配置或字段编辑
- filter-drawer：移动端/复杂筛选
- assistant-drawer：AI 建议、诊断、上下文问答
- activity-drawer：日志、审批、评论
- compare-drawer：并排对比或差异查看

## States

- opening、default、loading、partial-loading、error
- dirty、saving、saved、conflict、permission
- resized / collapsed：可调整宽度时状态可恢复
- background-refresh：列表刷新不丢失 drawer 对象
- object-deleted：当前对象不存在时给恢复路径

## Density

- narrow：360-420px，筛选/短详情
- default：480-560px，详情和短表单
- wide：720-960px，复杂详情或对比
- mobile：全屏或底部抽屉，不做窄侧栏
- footer 固定，body 保留滚动和安全区

## shadcn-vue mapping

- Primitive：Sheet / Drawer、ScrollArea、Tabs、Form、Button、Separator
- Companions：Skeleton、Alert、Toast、Resizable when needed
- Project wrappers：ContextDrawer、EditDrawer、FilterDrawer、AssistantDrawer
- Props：side、width、mode、objectId、loading、dirty、closeGuard
- Events：open-change、save、discard、refresh、resize

## Content

- header 写对象名和当前任务：“客户详情”“编辑规则”
- 来源摘要帮助用户知道从哪里打开
- 保存失败留在 drawer 内，不只 toast
- 筛选抽屉显示已选数量和清空入口
- AI 侧栏需要展示使用的上下文和可追问入口

## Anti-patterns

- 所有详情都塞 drawer，导致信息深度不够
- drawer 内再开多个抽屉，层级失控
- 关闭后丢失未保存内容且不提示
- 宽度随内容变化造成页面跳动
- 移动端仍使用窄侧栏
- footer 跟着内容滚走，用户找不到保存
