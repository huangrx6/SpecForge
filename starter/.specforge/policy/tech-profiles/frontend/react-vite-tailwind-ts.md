# React + Vite + Tailwind + TypeScript

## 适用

- 纯前端应用、静态站点、嵌入式管理台或独立 SPA。
- 后端由外部 API 提供，或本 change 不负责后端。

## 默认组合

- React。
- Vite。
- TypeScript。
- Tailwind CSS。
- React Router 或文件路由方案需在 design 中确认。
- 数据请求层应集中封装，避免页面散落 fetch 细节。

## 设计注意

- 明确路由表、页面状态和 API 契约。
- 表单、错误、空状态、loading 和权限状态必须写入体验设计。
- 若需要复杂表格、图表、拖拽或富文本，应单独选择组件 / 库 profile。

## 验证

- Vitest 覆盖纯逻辑和组件。
- Playwright 覆盖关键路径。
- 构建命令验证产物可生成。
