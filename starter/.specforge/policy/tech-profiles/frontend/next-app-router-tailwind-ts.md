# Next.js App Router + Tailwind + TypeScript

## 适用

- 全栈或前后端一体的小到中型产品。
- 需要页面路由、API routes、Server Components 和本地快速开发。
- 用户接受 React 和 Next.js。

## 默认组合

- Next.js App Router。
- TypeScript。
- Tailwind CSS。
- Server Components 负责只读数据页面。
- Client Components 负责表单、局部交互和浏览器 API。
- API routes 或 Server Actions 二选一；需要清晰 HTTP 契约时优先 API routes。

## 设计注意

- 明确哪些页面是 Server Component，哪些组件必须是 Client Component。
- 表单提交、错误提示、loading 和重定向要在 design 中写清。
- 管理后台若可能公网访问，认证和权限不能默认为无。

## 验证

- `npm run lint` 或等价静态检查。
- 单元 / 集成测试覆盖数据层和 API。
- Playwright 覆盖关键用户路径和响应式页面。
