# Next.js App Router + Tailwind + TypeScript

## 适用 / 不适用

适用：

- 公开内容发布、官网、文档、知识库、产品页面、需要 SEO 的公开页面。
- 前后端一体的小到中型 SaaS、BFF、认证页面和后台管理入口。
- 需要 Server Components、服务端数据获取、Route Handlers、Server Actions 或平台级部署能力。

不适用：

- 完全内网后台、SEO 无意义且后端已独立时，优先考虑 `frontend/react-vite-tailwind-ts`。
- 长连接、复杂队列、重计算、视频转码、持续任务不应放在 Next Route Handler 中。

## 默认组合

| 能力 | 默认建议 | 说明 |
|---|---|---|
| 路由 | App Router | 页面、布局、loading、error、not-found 按路由共置 |
| 渲染 | Server Components 默认，Client Components 按需 | 只有交互、浏览器 API、client hooks 才加 `"use client"` |
| 数据读取 | Server Component 中 `fetch` / DAL 函数 | 根据静态、动态、revalidate 明确缓存策略 |
| 数据变更 | Server Actions 或 Route Handlers | 表单 mutation 可用 Server Actions；外部 webhook / API 用 Route Handlers |
| UI | Tailwind + shadcn/ui / Radix | 主题用 CSS variables，暗色模式用 next-themes |
| 表单 | React Hook Form + Zod 或 server-side schema | 客户端体验和服务端校验都要覆盖 |
| 认证 | Auth.js / Clerk / 平台认证 | 设计必须说明 session、middleware、权限边界 |

## 目录与边界

```text
src/
├── app/
│   ├── (marketing)/     # 公开内容页
│   ├── (dashboard)/     # 登录后应用
│   ├── api/             # Route Handlers，仅放协议边界
│   └── actions/         # Server Actions，可按领域拆分
├── features/<name>/     # 业务能力和 UI 组合
├── entities/<name>/     # 领域展示、类型、轻逻辑
├── shared/
│   ├── ui/
│   ├── lib/
│   ├── auth/
│   └── db/
└── server/              # DAL、repositories、services、server-only 代码
```

必须避免把数据库查询、第三方密钥、支付回调和业务规则散落在 page 组件里。敏感服务端逻辑应放入 `server/` 或 `shared/db`，并用 `server-only` 或等效约束避免被客户端 import。

## RSC / Client Component 边界

- 默认用 Server Component 读取数据、组装静态结构和传递初始 props。
- Client Component 只承载交互：表单输入、弹窗、菜单、拖拽、编辑器、浏览器存储、实时状态。
- Client Component 不直接读取密钥、不直接访问数据库、不持有完整后端策略。
- 需要把 Server Component 放入 Client Component 外壳时，优先通过 `children` 传递，避免整棵树 client 化。

## 数据获取与缓存

设计必须明确每类数据的缓存策略：

| 数据类型 | 建议 |
|---|---|
| 公开内容、文档、产品页面 | 静态或 revalidate |
| 用户会话、权限、后台列表 | 动态读取，避免错误缓存 |
| 搜索、筛选、分页 | `searchParams` 驱动，可分享可回放 |
| mutation 后数据 | Server Action / Route Handler 后 revalidate 或刷新相关路径 |

不要把“是否缓存”留给框架默认行为。涉及用户隔离、权限、草稿、后台数据时必须显式说明动态策略。

## API 与 BFF

- 给前端页面服务的轻量 BFF 可用 `app/api/*/route.ts`。
- 外部系统回调、Webhook、文件上传签名、第三方代理也适合 Route Handler。
- Route Handler 不应承载复杂长期后台任务；这类任务应进入独立 worker / queue / 后端服务。
- API 错误响应统一 `{ error: { code, message, details? } }`，不要把底层异常直接返回。

## UI、内容和 SEO

- 内容页必须说明 title、description、Open Graph、canonical、sitemap / robots 策略。
- 图片使用框架图片优化能力或明确 CDN 策略，避免无尺寸图片导致布局偏移。
- 字体加载必须考虑 CLS。
- 文档、知识库、内容发布或后台编辑类项目必须在 technical design 中额外说明内容模型、编辑器依赖、预览、发布和回滚策略。

## 测试与交付

- 核心纯逻辑、schema、formatter：Vitest。
- 表单和可交互组件：React Testing Library。
- 登录、发布、编辑、删除、公开访问等 P0 路径：Playwright。
- Route Handler / Server Action 至少覆盖成功、鉴权失败、校验失败、下游异常。

## Design 必填问题

- 哪些页面是公开 SEO 页面，哪些是登录后应用？
- 数据读取是静态、动态还是 revalidate？
- mutation 使用 Server Actions 还是 Route Handlers？
- 认证、权限、草稿/发布状态在哪里校验？
- 是否需要内容编辑、富文本、上传、预览或站点地图？

## Spec Review 检查项

- 没有把需要保密的逻辑暴露到 Client Component。
- 缓存策略对用户数据和公开内容有明确区分。
- Route Handler 只承担协议和轻量编排，不包含巨大业务泥团。
- SEO 页面有 metadata 和内容结构说明。
- P0 用户路径有 E2E 验证。
