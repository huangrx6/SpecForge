# Vue + Vite + Tailwind + TypeScript

## 适用 / 不适用

适用：

- 团队既有 Vue 生态、Element Plus / Naive UI / Ant Design Vue 使用经验明确。
- 内部管理台、运营工具、配置平台、表单和列表密集型 SPA。
- 后端独立存在，前端主要负责页面、状态和 API 编排。

不适用：

- 需要强 SEO、服务端组件或复杂 SSR 时，优先看 Next.js / Nuxt 等 SSR profile 或在 technical design 中新增并确认。
- 团队主要 React 生态且无 Vue 基线时，不为了单页小需求切换主栈。

## 默认组合

| 能力 | 默认建议 | 何时替换 |
|---|---|---|
| 构建 | Vite + Vue 3 + TypeScript strict | SSR / SSG 需要 Nuxt |
| 路由 | Vue Router | 微前端或宿主路由约束时跟随宿主 |
| 服务端状态 | TanStack Query for Vue 或统一 API composable | 已有 Pinia 请求规范时沿用 |
| 客户端状态 | Pinia | 极少状态可用组件局部状态 |
| 表单 | 组件库 Form + schema 校验 | 复杂动态表单需专项设计 |
| UI | Tailwind + shadcn-vue / Element Plus / Naive UI | 既有设计系统优先 |

## 设计必填

- 选择 Vue 是沿用现有栈、用户指定，还是新建默认？
- 组件库和 Tailwind 的职责如何划分，是否会冲突？
- URL query 是否承载列表筛选、分页、排序？
- API client、错误映射、权限守卫和 token 刷新在哪里实现？
- P0 页面流是否有 Playwright 计划？

## 验证

- `vue-tsc` / typecheck、build、核心页面 smoke。
- 表单校验、权限路由、错误态、空态和响应式。
- Playwright 覆盖主路径和至少一个关键失败路径。
