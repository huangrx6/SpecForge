# Tailwind v4 Reference

## 规则

- 用 `@theme` 或项目 token 暴露语义变量。
- utility class 服务布局和状态，不替代组件 contract。
- arbitrary value 只允许在确有设计 token 缺口时使用，并回写 token 决策。
- Product UI 的间距、颜色、圆角和阴影应来自 foundations。

## shadcn-vue

shadcn-vue 组件可以使用 Tailwind utilities，但项目页面应优先复用封装后的业务组件，避免每页重新组合 primitive。
