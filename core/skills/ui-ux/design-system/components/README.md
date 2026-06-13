# Components

组件规范必须足够约束实现和 Pencil 原型。每个组件文件至少回答这些问题：

| Section | Required content |
|---|---|
| Purpose | 什么时候使用，什么时候不用 |
| Anatomy | 必备结构：label、icon、content、meta、actions、feedback |
| Variants | 视觉和语义变体，不只是颜色 |
| States | default / hover / focus / active / disabled / loading / empty / error / permission / success |
| Layout | compact / comfortable / mobile / wide 的尺寸和响应式 |
| Content | 文案、数字、单位、错误提示、空态说明 |
| A11y | keyboard、focus、aria、contrast、touch target |
| shadcn-vue | primitive 映射和项目级封装 |
| Anti-patterns | 哪些做法会廉价、低效或不可维护 |

## Component selection

先选页面模式，再选组件，不要从组件库倒推页面：

- 高频运营页：LayoutShell, Navbar, FilterBar, Table, Pagination, Drawer, StatusBadge, Toast。
- AI 助手 / 命令面板：CommandPalette, Input, TooltipPopover, Card, SkeletonProgress, Toast。
- 移动 H5：Input, Button, Tabs, Drawer, Toast, SkeletonProgress, Card。
- 表单流程：Form, Stepper, Input, SelectCombobox, DatePicker, Upload, Dialog。
- 监控看板：Chart, Card, Table, StatusBadge, EmptyState。

## Project component contract

```md
Project component:
Primitive:
Purpose:
Anatomy:
Variants:
States:
Props:
Events:
Slots:
Responsive:
A11y:
Content rules:
Anti-patterns:
```
