# Vue + Vite + Tailwind + TypeScript

## 适用

- 用户偏好 Vue 生态。
- 纯前端或轻量管理端。

## 默认组合

- Vue 3。
- Vite。
- TypeScript。
- Tailwind CSS。
- Vue Router。
- Pinia 仅在存在跨页面状态时引入。

## 设计注意

- 组件职责、状态来源和路由守卫要写清。
- 表单校验、错误提示和空状态必须在 design 中定义。
- 不为简单页面提前引入复杂状态管理。

## 验证

- Vitest。
- Vue Testing Library 或组件测试按项目约定选择。
- Playwright 覆盖关键路径。
