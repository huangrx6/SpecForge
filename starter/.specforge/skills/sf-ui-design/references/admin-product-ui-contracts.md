# 管理端 / Product UI 组件契约

本文件只处理 Product UI / 管理端 / shadcn 场景的组件层级。它不负责判断 Design Mode；开始前先按 `design-mode-routing.md` 确认当前页面属于 Product UI 或 Hybrid 中的 Product UI 部分。UI 方向确认、Pencil 门禁和视觉 review 见 `ui-design-process.md`。

## Admin Component Contract

管理端不是 `Button + Card + Table` 的拼装。涉及 admin / backoffice / shadcn / dashboard 时，必须在 `ui-design.md` 中写出 Admin Component Contract：

| 层级 | 典型封装 | 必须说明 |
|---|---|---|
| App Shell | Sidebar、Topbar、Breadcrumb、Workspace / User Switcher、Command Search | 导航层级、当前定位、折叠行为、移动端策略 |
| Resource Page | PageHeader、ActionBar、Saved Views、Filter Bar、Bulk Actions | 主任务、主次操作、筛选保存、批量操作入口 |
| Entity Table | TanStack Table wrapper、Column schema、Toolbar、Pagination、Column Visibility | 排序、筛选、分页、密度、空态、错误态、权限态 |
| Detail / Form | DetailHeader、Metadata Panel、Tabbed Detail、Form Section、Sticky Save Bar | 脏数据保护、校验、保存反馈、只读 / 禁用状态 |
| State Feedback | EmptyState、LoadingSkeleton、ErrorState、PermissionDenied、Success Toast | 文案、恢复路径、是否可重试、是否隐藏操作 |
| Ops Pattern | Import / Export Wizard、Async Job Progress、Audit Log、Approval Timeline | 长任务进度、失败恢复、审计证据、审批状态 |

## shadcn/ui 使用规则

- shadcn/ui 是 primitive 和 registry 层；项目应在其上封装稳定的业务组件，而不是每个页面直接散落 `Button`、`Card`、`Table`。
- 官方 shadcn skill 适合处理 CLI、registry、docs、theming 和组件更新规则；它不是管理端信息架构技能。
- `shadcn-component-discovery` / `shadcn-component-review` 这类 skill 只能辅助发现组件和审查 shadcn 写法，不替代 SpecForge 的 UI 方向确认。
- `shadcn-admin-kit`、`satnaing/shadcn-admin` 等项目可作为管理端模式参考，提取 CRUD、数据表、表单、权限和 shell 结构；不要整套复制为 SpecForge artifact。
- 任何第三方 registry 组件加入项目后，都要阅读生成文件，检查导入路径、token、a11y、响应式、权限态和与项目 wrapper 的关系。
