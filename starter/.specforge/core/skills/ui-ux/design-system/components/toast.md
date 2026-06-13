# Toast

## Purpose

Toast 用于轻量、短暂、非阻塞反馈。需要决策、长文本、错误恢复或权限说明时使用 Alert、Dialog 或页面内反馈。

## Structure

- container：位置、堆叠、最大数量
- icon/severity：success、info、warning、error、loading
- title：结果或状态
- description：必要原因或下一步
- action：撤销、查看详情、重试
- timeout：不同 severity 的停留时间

## Variants

- success：完成反馈
- info：系统提示
- warning：可继续但需注意
- error：失败和可恢复动作
- loading：异步任务处理中
- undo：可撤销操作
- persistent：重要但不阻塞的异常

## States

- enter、visible、hover-paused、dismissed
- stacked：多个 toast 合并或队列
- action-loading：重试/撤销处理中
- offline：网络失败提示
- duplicate：相同提示合并计数
- route-change：跨页面是否保留

## Density

- desktop：右上或右下，宽 320-420px
- mobile：顶部或底部安全区，宽度接近全屏
- title 单行，description 最多两行
- 同屏最多 3 个，更多合并
- loading toast 可持久，成功后自动替换

## shadcn-vue mapping

- Primitive：Toast / Sonner、Button、Progress、Spinner
- Companions：Alert for persistent errors、Dialog for decisions、Inline field message for validation
- Project wrappers：AppToast、AsyncToast、UndoToast、ErrorToast
- Props：type、title、description、action、duration、id
- Events：dismiss、action-click、timeout
- Store：toast service 统一去重、合并和跨路由策略

## Content

- 成功：“已保存配置”
- 错误：“保存失败，请重试”并配动作
- 撤销：“已删除成员，可撤销”
- 不要把字段校验错误全塞 toast
- 长错误提供“查看详情”而不是 toast 展开一大段

## Anti-patterns

- 所有反馈都用 toast，页面内没有状态
- toast 挡住关键按钮或移动端输入栏
- 错误 toast 只写“操作失败”
- 多个相同 toast 连续刷屏
- 需要用户确认却自动消失
- toast 样式过度彩色，抢走主任务
