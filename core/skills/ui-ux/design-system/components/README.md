# Components

组件规范必须足够约束实现、Pencil 原型和 AI 生成页面。每个组件文件必须使用统一深度结构，不能只写“常见用法”。AI 读取组件时，要能直接回答：这个组件在什么业务密度下怎么长、有哪些状态、如何映射到 shadcn-vue、文案怎么写、哪些做法会让页面变廉价。

| Section | Required content |
|---|---|
| Purpose | 什么时候使用，什么时候不用 |
| Structure | 根容器、内容结构、操作区、反馈区、slot、焦点和滚动 |
| Variants | 语义变体、业务变体、布局变体、移动端变体，不只是换颜色 |
| States | default / hover / focus / active / selected / disabled / readonly / loading / empty / error / permission / success / stale / conflict |
| Density | compact / default / comfortable / mobile / wide 的尺寸、间距、行高、触摸目标和响应式 |
| shadcn-vue mapping | primitive、companion components、project wrappers、props、events、slots |
| Content | label、helper、placeholder、单位、错误、空态、按钮、tooltip、截断和敏感信息 |
| Anti-patterns | 哪些做法会廉价、低效或不可维护 |

## Required component depth

- **Structure**：不要只写“由标题、内容、按钮组成”，要说明每个区域的职责、是否可选、是否 sticky、是否滚动、是否可聚焦。
- **States**：至少覆盖正常、加载、空、错、权限、禁用、成功、局部失败；数据型组件还要覆盖筛选无结果、过期数据、部分数据、批量处理中。
- **Density**：必须给出 compact / default / mobile 的可实施规则；高频后台和 H5 不能共用同一套尺寸。
- **Variants**：必须按语义和业务场景拆，不允许只列 primary / secondary 这种颜色变体。
- **shadcn-vue mapping**：先列 primitive，再列 companion，再列项目封装；shadcn-vue 是 registry/primitive 层，不是最终业务组件。
- **Content**：文案必须是可执行、可恢复、可理解的业务语言；不要把 placeholder、toast、tooltip 当作万能补丁。
- **Anti-patterns**：必须指出会导致廉价感、不可访问、不可维护或 AI 生成发散的做法。

## Component selection

先选页面模式，再选组件，不要从组件库倒推页面：

- 高频运营页：LayoutShell, Navbar, FilterBar, Table, Pagination, Drawer, StatusBadge, Toast。
- AI 助手 / 命令面板：CommandPalette, Input, TooltipPopover, Card, SkeletonProgress, Toast。
- 移动 H5：Input, Button, Tabs, Drawer, Toast, SkeletonProgress, Card。
- 表单流程：Form, Stepper, Input, SelectCombobox, DatePicker, Upload, Dialog。
- 监控看板：Chart, Card, Table, StatusBadge, EmptyState。

## shadcn-vue composition rule

| Need | Prefer | Avoid |
|---|---|---|
| 单个命令 | Button + Tooltip/Spinner | 自定义 div click |
| 多命令收纳 | DropdownMenu / Command | 一排小按钮挤满 |
| 短确认 | AlertDialog | 普通 Dialog 只换红色 |
| 侧向详情 | Sheet / Drawer + ScrollArea | Dialog 承载长表单 |
| 表单字段 | Field/Form + Input/Select | placeholder 当 label |
| 远程选择 | Combobox + Command + Popover | 巨大 Select 无搜索 |
| 高密列表 | Table + TanStack Table wrapper | 每页手写 table 状态 |
| 反馈 | Sonner/Toast + inline state | 所有错误只 toast |
| 导航骨架 | Sidebar / NavigationMenu | 每页复制导航 |

## Project component contract

```md
Project component:
Primitive:
Companions:
Purpose:
Structure:
Variants:
States:
Density:
Props:
Events:
Slots:
A11y:
Content rules:
Anti-patterns:
```
