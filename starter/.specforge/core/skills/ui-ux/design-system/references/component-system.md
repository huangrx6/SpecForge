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
- `structure`：根容器、标题、内容、辅助信息、状态、操作、反馈、slot、滚动和焦点。
- `variants`：语义变体、业务变体、布局变体、设备变体，不只是颜色。
- `states`：default、hover、focus、active、disabled、readonly、loading、empty、filtered-empty、error、permission、success、selected、expanded、collapsed、stale、conflict、partial。
- `density`：compact、default、comfortable、mobile、wide 的高度、间距、行高、触摸目标和响应式规则。
- `content`：标签、提示、错误、空态、单位、截断、敏感信息、按钮文案、tooltip 和 toast。
- `a11y`：aria、键盘路径、focus、contrast、touch target。
- `implementation`：shadcn-vue primitive、companion components、project wrapper、props、events、slots、状态管理边界。
- `quality`：反模式和视觉审查项。

## Completeness matrix

| Dimension | Must answer | Common miss |
|---|---|---|
| Structure | 哪些区域必备，哪些可选；谁滚动，谁 sticky；slot 放哪里 | 只写“标题 + 内容 + 按钮” |
| State | happy path 之外如何处理 loading / empty / error / permission / partial / stale | 只有 default 和 disabled |
| Density | 后台高密、常规表单、移动 H5 的尺寸如何不同 | 所有组件 40px 一把梭 |
| Variant | 语义、业务、布局、设备四类变体分别是什么 | 把 variant 当颜色枚举 |
| Mapping | shadcn-vue primitive、组合组件、项目 wrapper 的责任边界 | 页面直接拼 primitive |
| Content | label、helper、error、empty、tooltip、toast 如何表达 | 文案全是“确定/提交/暂无数据” |
| Anti-pattern | 什么会廉价、误导、不可访问或不可维护 | 只写“注意美观” |

## Component families

| Family | Components | Required depth |
|---|---|---|
| Actions | Button, Menu, CommandPalette | semantics, permission, loading, danger confirm |
| Inputs | Input, SelectCombobox, DatePicker, Upload, Form | validation, helper, remote loading, error recovery |
| Navigation | Navbar, Breadcrumb, Tabs, Pagination, LayoutShell | hierarchy, current location, responsive collapse |
| Feedback | Toast, Dialog, Drawer, EmptyState, SkeletonProgress, StatusBadge | severity, recovery, persistence, focus management |
| Data | Table, Chart, Card, FilterBar | sorting, filtering, units, empty/error, density |
| Identity | Avatar, StatusBadge | fallback, stable color, role, accessibility |

## Project wrapper rule

每个页面级设计至少定义一层项目封装，不允许只说“使用 Button / Table / Dialog”：

- `Primitive` 负责可访问基础交互，例如 Button、Dialog、Table、Command。
- `Companion` 负责组合需要的相邻能力，例如 Tooltip、DropdownMenu、Skeleton、Alert、ScrollArea。
- `Project wrapper` 负责业务状态和统一体验，例如 PermissionButton、ResourceTable、ContextDrawer。
- `Pattern component` 负责页面级复用，例如 ImportWizard、EntityDetailDrawer、ErrorDiagnosisPanel。

如果一个组件需要反复处理权限、加载、错误、空态、远程数据或审计日志，就必须提升为 project wrapper。

## shadcn-vue integration

```md
Project component: ResourceTable
Primitive: Table
Companions: Checkbox + DropdownMenu + Pagination + Skeleton + Alert
Wrapper responsibility:
- column schema
- loading skeleton
- empty / filtered-empty / error
- selection and bulk action
- row action menu
- density and sticky columns
```

## Content quality rules

- 动作文案用“动词 + 对象 + 范围”，例如“导出当前筛选”，不要写“确定”。
- 错误文案必须说明如何修复，例如“请输入 11 位手机号”，不要只写“格式错误”。
- 空态必须区分首次无数据、筛选无结果、无权限和加载失败。
- 状态和 badge 必须使用统一业务枚举，不同页面不能混用同义词。
- 指标和表格必须给单位、口径、更新时间或 tooltip。
- 权限不可用必须解释原因，不要只 disabled。

## Anti-patterns

- 直接把 primitive 放进页面，导致每页重复处理状态。
- 只写 default 状态，忽略 permission、loading、error、empty。
- variant 只是换颜色，没有语义、文案和交互差异。
- 组件尺寸散落在页面里，没有 density token。
- 所有卡片都有 icon + pastel background，页面像功能宫格。
- 复杂状态都交给 toast，页面本体没有恢复路径。
- 只为桌面设计组件，移动端靠缩小字体硬撑。
- shadcn-vue 组件名写了很多，但没有 wrapper、props、events 和 slots 边界。
