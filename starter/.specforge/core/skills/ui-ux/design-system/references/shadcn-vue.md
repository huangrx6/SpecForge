# shadcn-vue Reference

shadcn-vue 适合作为 Vue 项目的 primitive / registry / Tailwind token 基座。它不替代设计语言。

## 使用方式

- 先确定 foundations，再选择 primitive。
- 为业务场景封装项目级组件，例如 `DataTable`, `PageHeader`, `StatusBadge`, `ConfirmDialog`, `MetricCard`。
- 不直接在页面里散落大量 primitive 组合。
- 组件文档要写 props、状态、权限、空态和错误态。

## SpecForge 归一化

写入 `ui-design.md#Admin Component Contract`：

| Project Component | shadcn-vue primitive | Props / States | Notes |
|---|---|---|---|

## 审查点

- primitive 是否符合用户任务。
- token 是否来自项目 foundations。
- 是否覆盖 loading / empty / error / permission。
- 是否可测试、可复用、可替换。
