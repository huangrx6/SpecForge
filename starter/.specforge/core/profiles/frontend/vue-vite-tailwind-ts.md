# Vue 3 + Vite + Tailwind + TypeScript

## 适用 / 不适用

适用：

- Vue 经验充足的团队、管理后台、数据看板、H5 活动、内部工具。
- 希望用 Composition API 快速组织页面逻辑，并保持较低框架心智成本。
- 需要静态部署或独立后端 API 的 SPA。

不适用：

- 需要强 SEO、服务端渲染、公开内容页时，优先考虑 Nuxt 或 Next.js profile 扩展，不要用纯 SPA 硬补。
- 团队核心组件生态已强绑定 React 时，不要为了偏好切换主栈。

## 默认组合

| 能力 | 默认建议 | 说明 |
|---|---|---|
| 语法 | `<script setup lang="ts">` | 禁止新写 Options API |
| 路由 | Vue Router 4 | 大型项目可用 unplugin-vue-router 做类型化文件路由 |
| 状态 | Pinia | 替代 Vuex，按业务 store 切分 |
| 组合函数 | VueUse | 复用浏览器 API、副作用和响应式工具 |
| 服务端状态 | TanStack Query for Vue 或封装 useRequest | 有缓存、并发、重试需求时选 TanStack Query |
| 表单 | vee-validate + Zod 或组件库表单 | 复杂表单必须有 schema 和错误状态 |
| UI | Element Plus / Ant Design Vue / Headless UI | B 端快速落地优先成熟组件库 |

## 目录与边界

```text
src/
├── app/                 # createApp、router、pinia、providers
├── pages/               # 路由页面，只做编排
├── features/<name>/     # 业务能力：api、components、composables、store
├── entities/<name>/     # 复用业务展示和类型
├── shared/
│   ├── api/
│   ├── ui/
│   ├── composables/
│   ├── lib/
│   └── config/
└── test/
```

页面不要直接承载大段 API 编排、权限判断和复杂 store mutation；这类逻辑应进入 feature composable 或 store action。

## 响应式与状态规则

- 组件内短生命周期状态使用 `ref` / `reactive`。
- 多页面共享状态放 Pinia，store 只保存客户端事实，不复制服务端列表缓存。
- 需要自动刷新、分页、缓存、请求取消时，使用 TanStack Query 或统一 request composable。
- `watch` 必须有明确目的，避免用深度 watch 替代可读的事件和 action。
- `provide/inject` 只用于组件族上下文，不用于全局业务状态。

## UI 与表单

- 表单必须写清字段、校验、错误展示、disabled、提交中、提交成功状态。
- 大型表格必须说明分页、筛选、排序、列宽、空态和移动端降级。
- Tailwind 与组件库共存时，明确哪些由组件库主题控制，哪些由 utility class 控制。
- 内容编辑、Markdown、富文本、上传、图表应额外选择对应 profile 或在 design 中写明方案。

## 构建与质量

- `build` 必须先跑 `vue-tsc` 再跑 `vite build`。
- 开启 TypeScript strict；为 `ImportMetaEnv` 声明 `VITE_` 环境变量类型。
- ESLint 使用 Vue 推荐规则，禁止未处理 Promise 和隐式 any。
- 静态部署使用 History 路由时，服务器配置 fallback 到 `index.html`。

## 测试与交付

- composable 和 store action：Vitest。
- 组件交互：Vitest + Vue Test Utils。
- P0 用户路径：Playwright。
- 有组件库沉淀时，可加 Storybook 或 Histoire，但不替代 E2E。

## Design 必填问题

- 项目是后台、H5、看板还是公开内容站？
- 选 Element Plus / Ant Design Vue / Headless 的原因是什么？
- 哪些状态进 URL、哪些进 Pinia、哪些只在组件内？
- 是否需要复杂表格、长表单、图表、编辑器或上传？

## Spec Review 检查项

- 没有新写 Options API。
- 复杂异步请求没有散落在页面 `onMounted` 中。
- Pinia 没有保存可由服务端重新获取的大量列表缓存。
- 表单和表格有完整交互状态。
- `vue-tsc` 和 P0 E2E 在验证计划内。
