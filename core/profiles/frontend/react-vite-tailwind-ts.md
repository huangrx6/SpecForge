# React + Vite + Tailwind + TypeScript

## 适用 / 不适用

适用：

- 内部管理台、CRM、运营工具、设计工具、复杂表单和重交互 SPA。
- 希望静态托管到 CDN / Nginx / GitHub Pages / 对象存储。
- 后端已独立存在，前端只负责 UI、交互和 API 编排。

不适用：

- 公开内容发布、官网、文档站需要强 SEO 和服务端渲染时，优先看 `frontend/next-app-router-tailwind-ts`。
- 需要服务端认证中间件、服务端组件或边缘运行时代码时，不要硬塞到纯 SPA。

## 默认组合

| 能力 | 默认建议 | 何时替换 |
|---|---|---|
| 构建 | Vite + TypeScript strict | 需要 SSR 时换 Next.js / Remix |
| 路由 | React Router 或 TanStack Router | URL 类型安全强诉求时选 TanStack Router |
| 服务端状态 | TanStack Query | 数据极少且无缓存需求时可用轻量 fetch wrapper |
| 客户端状态 | Zustand | 时间旅行、复杂 reducer、审计回放时选 Redux Toolkit |
| 表单 | React Hook Form + Zod | 组件库内置表单足够简单时可部分采用 |
| UI | Tailwind + shadcn/ui 或 Ant Design | 企业后台快速落地可选 Ant Design |
| 图标 | lucide-react | 品牌图标用独立 SVG 组件 |

## 目录与边界

推荐按功能切片，不按技术类型堆大目录：

```text
src/
├── app/                 # app bootstrap、router、providers
├── pages/               # 路由页面，只编排页面级数据和布局
├── features/<name>/     # 业务能力：api、model、ui、hooks
├── entities/<name>/     # 复用业务实体展示和类型
├── shared/
│   ├── api/             # API client、error mapper、query keys
│   ├── ui/              # 无业务语义的基础组件
│   ├── lib/             # cn、date、format、storage
│   └── config/          # env schema、feature flags
└── test/                # fixtures、msw handlers、test utils
```

页面组件不得直接散落复杂 API 调用、权限判断和状态机；这些应下沉到 `features/*` 或 `shared/api`。

## 数据、状态与错误处理

- API 请求通过统一 client 进入，负责 base URL、认证头、错误映射和超时。
- 列表筛选、分页、搜索、排序优先放 URL query，便于分享、刷新和 E2E 验证。
- 服务端状态使用 query key 规范命名，例如 `['posts', { page, q }]`，mutation 成功后显式 invalidate。
- 本地 UI 状态只保存“浏览器临时状态”，不要复制服务端数据到全局 store。
- `.env` 中暴露给浏览器的变量必须以 `VITE_` 开头，并在 `vite-env.d.ts` 中声明类型。

## UI 与体验规则

- 新页面必须配合 `core/standards/design.md` 产出页面地图、状态矩阵和移动端布局。
- 表格、筛选、长表单、批量操作、删除确认必须写出 loading / empty / error / disabled / success 状态。
- Tailwind 类名合并统一使用 `cn()`，内部使用 `clsx` + `tailwind-merge`。
- 复杂控件必须显式说明选择：Markdown / 富文本、图表、上传、拖拽等专项能力在 technical design 中写清依赖、风险和验证方式。

## 构建与部署

- 必须提供 `dev`、`build`、`preview` 脚本；发布前至少跑一次生产构建预览。
- 静态部署使用 History API 路由时，服务器必须配置 fallback 到 `index.html`。
- 大型依赖引入前先评估 chunk 体积；图表、编辑器、地图等重组件应路由级懒加载。

## 测试与交付

- 组件和 hook：Vitest + React Testing Library。
- API 边界：MSW 或 test double，不在单测中访问真实互联网。
- P0 用户流：Playwright，优先 `getByRole` / `getByLabel` / `getByText`。
- 验收至少包含：构建通过、核心页面无白屏、主路径 E2E、关键表单校验。

## Design 必填问题

- 这是纯 SPA 还是需要 SEO / SSR？
- 认证状态放在哪里？刷新页面后如何恢复？
- URL 需要承载哪些状态？
- 表单复杂度、编辑器、图表、上传、拖拽是否在本次范围？
- 首屏和最大 bundle 的预算是什么？

## Spec Review 检查项

- 没有直接在页面中用 `useEffect + fetch` 手写服务端状态流。
- 没有把服务端数据复制进全局 store。
- 没有未声明的 `VITE_` 环境变量。
- 有静态部署 fallback 说明。
- 有 P0 E2E 验证计划。
