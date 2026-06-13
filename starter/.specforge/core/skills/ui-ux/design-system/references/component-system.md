# Component System

本文件是组件层的总契约。组件不是“画出来的控件”，而是业务状态、交互路径和实现约束的稳定接口。

## Component depth levels

| Level | Meaning | Example |
|---|---|---|
| Primitive | shadcn-vue / HTML 基础控件 | Button, Input, Dialog |
| Project component | 业务项目复用封装 | AppButton, ResourceTable, ContextDrawer |
| Pattern component | 页面级组合 | EntityPage, DiagnosisFlow, ImportWizard |
| Domain component | 绑定业务语义 | ErrorContextCard, RolePermissionTree |

`sf-ui-design` 至少要输出 Project component；复杂页面输出 Pattern / Domain component。

## Contract fields

- `purpose`：解决什么任务，不解决什么任务。
- `anatomy`：根容器、标题、内容、辅助信息、状态、操作、反馈、slot。
- `variants`：语义变体，例如 primary/danger/info，不只是颜色。
- `states`：default、hover、focus、active、disabled、loading、empty、error、permission、success、selected、expanded、collapsed。
- `density`：compact、comfortable、mobile 的尺寸。
- `content`：标签、提示、错误、空态、单位和截断规则。
- `a11y`：aria、键盘路径、focus、contrast、touch target。
- `implementation`：shadcn-vue primitive、project wrapper、props、events、slots。
- `quality`：反模式和视觉审查项。

## Component families

| Family | Components | Required depth |
|---|---|---|
| Actions | Button, Menu, CommandPalette | semantics, permission, loading, danger confirm |
| Inputs | Input, SelectCombobox, DatePicker, Upload, Form | validation, helper, remote loading, error recovery |
| Navigation | Navbar, Breadcrumb, Tabs, Pagination, LayoutShell | hierarchy, current location, responsive collapse |
| Feedback | Toast, Dialog, Drawer, EmptyState, SkeletonProgress, StatusBadge | severity, recovery, persistence, focus management |
| Data | Table, Chart, Card, FilterBar | sorting, filtering, units, empty/error, density |
| Identity | Avatar, StatusBadge | fallback, stable color, role, accessibility |

## shadcn-vue integration

```md
Project component: ResourceTable
Primitive: Table + Checkbox + DropdownMenu + Pagination
Wrapper responsibility:
- column schema
- loading skeleton
- empty / filtered-empty / error
- selection and bulk action
- row action menu
- density and sticky columns
```

## Anti-patterns

- 直接把 primitive 放进页面，导致每页重复处理状态。
- 只写 default 状态，忽略 permission、loading、error、empty。
- variant 只是换颜色，没有语义、文案和交互差异。
- 组件尺寸散落在页面里，没有 density token。
- 所有卡片都有 icon + pastel background，页面像功能宫格。
