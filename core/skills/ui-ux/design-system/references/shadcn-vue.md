# shadcn-vue Reference

shadcn-vue 适合作为 Vue 项目的 primitive / registry / Tailwind token 基座。它不替代设计语言。

## 使用方式

- 先确定 foundations，再选择 primitive。
- 为业务场景封装项目级组件，例如 `DataTable`, `PageHeader`, `StatusBadge`, `ConfirmDialog`, `MetricCard`。
- 不直接在页面里散落大量 primitive 组合。
- 组件文档要写 props、状态、权限、空态和错误态。
- `components.json` 用于记录项目配置和 CLI 生成规则；不要把它当产品设计规范。
- theme 使用 CSS variables 承载 semantic tokens，并与 Tailwind theme variables 对齐。

## 常用 primitive map

| Product component | shadcn-vue primitive |
|---|---|
| AppShell | Sidebar, Breadcrumb, Separator |
| ResourcePage | Button, Tabs, Card, Alert |
| DataTable | Table, Checkbox, DropdownMenu, Pagination |
| EntityForm | Form, Input, Select, Textarea, Switch |
| ConfirmAction | AlertDialog, Button |
| ToolCommand | Command, Dialog |
| ContextDrawer | Drawer, ScrollArea |
| StatusToast | Toast, Alert |

## SpecForge 归一化

写入 `ui-design.md#Admin Component Contract`：

| Project Component | shadcn-vue primitive | Props / States | Notes |
|---|---|---|---|

## 审查点

- primitive 是否符合用户任务。
- token 是否来自项目 foundations。
- 是否覆盖 loading / empty / error / permission。
- 是否可测试、可复用、可替换。
- 是否保留键盘、focus、aria 和错误提示。
- 是否避免只复制默认 demo 页面造成“模板味”。
