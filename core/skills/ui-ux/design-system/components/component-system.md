# Component System

组件层负责把 primitive、项目封装、业务状态和验证边界讲清楚。它不是组件库清单；不要从 Button / Card / Table 倒推页面，先由 Product UI pattern 和 primary work surface 决定组件族、wrapper 和契约深度。

## Component Family Routing

不要默认读取全部组件族。先判断主工作面，再只读取本文件里的相关 family section。

Route：App shell（后台壳、工作台、设置、权限、导航状态）；Data work（列表、审计、审批、监控、对象操作、图表证据）；Form flow（创建、编辑、导入导出、多步骤流程、高风险确认）；Command / AI（AI 助手、快捷命令、开发者工具、专家控制台）；Mobile / H5（移动表单、轻列表、个人中心、现场任务）。

Feedback / overlay 是横切 add-on，不再作为独立工作面族读取。需要确认、恢复、详情、权限、异步任务反馈或临时上下文时，在当前主组件族上追加 `## Feedback / Overlay Add-on`。

## Architecture Levels

组件不是 primitive 名称列表。先判断应该停在哪个抽象级别，再决定是否输出独立组件契约。

Levels：Primitive 只提供可访问基础交互和低层样式，不承载业务状态；Project component 统一权限、loading、error、density、token 和 wrapper 行为，写进 `ui-design.md#Admin Component Contract`；Pattern component 负责页面级组合和可复用流程，复杂页面建议独立 contract；Domain component 绑定业务语义、审计、权限或特定对象，必须独立 contract。

`sf-ui-design` 至少要输出 Project component。页面涉及跨页复用、异步状态、权限、批量操作、审计日志、远程数据或自定义 motion 时，提升到 Pattern / Domain component。

## Project Wrapper Rule

页面不能直接堆 primitive。Promote to wrapper when each page hand-writes Button loading / permission / tooltip, Table sorting / filters / pagination / empty / error, Dialog long forms / detail / recovery, import/export spinner + toast, or inconsistent status badge copy and color. Typical wrappers：`PermissionButton`、`AsyncButton`、`ResourceTable`、`DataTable`、`ContextDrawer`、`EntityDetailDrawer`、`ImportWizard`、`AsyncJobProgress`、`StatusBadge`。Primitive 负责基础交互；Companion 负责相邻能力；Project wrapper 负责业务状态和统一体验；Pattern component 负责页面级复用。

## Required Depth

组件矩阵或组件契约至少回答八件事：purpose / not for、structure、semantic variants、states、density、primitive + wrapper mapping、content rules、anti-patterns。复杂组件还必须说明 props、events、slots、state owner、motion layer 和 verification。

Escalate to `01-spec/design/components/<component-name>.contract.md` when a component is reused across pages, owns async state, has permissions, handles bulk actions, changes business data, wraps shadcn-vue primitives, or has custom motion / responsive behavior. Use `contracts/component-contract.template.md`；不要在组件系统里复制第二份契约模板。

不需要独立 contract 时，也要在 `ui-design.md` 的组件矩阵里写 N/A 理由，避免实现阶段临时补设计。

## Global Interaction States

Global states：所有可点击元素有可见 focus；图标按钮有 tooltip / aria label；Modal / Drawer 打开后焦点进入、关闭后回到触发源；表单错误关联字段并说明修复动作；颜色不能作为唯一状态表达；Toast 不承载唯一重要信息；上传、提交、审批、导入导出要有可恢复错误和重试 / 撤销路径；键盘路径不能被 hover-only 操作、隐藏按钮或动画过渡阻断。

## Feedback / Overlay Add-on

Components covered: Dialog, Drawer, Toast, EmptyState, SkeletonProgress, TooltipPopover, StatusBadge.

Required：structure 写 consequence / sticky actions / severity / next action / current step；variants 至少覆盖 confirm-dialog、context-drawer、recovery-empty、async-progress、persistent-alert、inline-status；states 覆盖 open / focus-return、loading / success / error / permission / stale、retry、filtered-empty、partial-failed；content 写 consequence / object / count / reversibility、cause + recovery、no data vs filtered empty vs permission vs setup。Project wrappers：ConfirmDialog、ContextDrawer、StatusToast、RecoveryEmptyState、AsyncJobProgress、PermissionHint、StatusBadge。Anti-patterns：长表单塞 Dialog，所有错误只 toast，空态只有插图，Tooltip 承载关键权限 / 金额 / 错误 / 条款，Status 只靠颜色。

## Shadcn-Vue Composition Rule

shadcn-vue 适合作为 Vue 项目的 primitive / registry / Tailwind token 基座。它不替代设计语言；先确定 foundations，再选择 primitive。

Primitive choice：single command 用 Button + Tooltip/Spinner；multi command 用 DropdownMenu / Command；short confirm 用 AlertDialog；side detail 用 Sheet / Drawer + ScrollArea；form field 用 Field/Form + Input/Select；remote select 用 Combobox + Command + Popover；dense list 用 Table + TanStack Table wrapper；feedback 用 Sonner/Toast + inline state；navigation skeleton 用 Sidebar / NavigationMenu。Avoid 自定义 div click、placeholder 当 label、巨大 Select 无搜索、每页手写 table 状态、所有错误只 toast、每页复制导航。

Boundary：`components.json` 只是 CLI 配置；theme 使用 CSS variables 承载 semantic tokens；Tailwind utility 不替代组件 contract；React shadcn blocks 只能作为 pattern source，必须转成 shadcn-vue primitive、project wrapper、props、events、slots 和 state owner。

## Shadcn Resource Audit

当 shadcn/ui blocks、shadcn-vue、shadcn.io templates、shadcnblocks、21st.dev 或 admin 模板要进入项目时，在本文件内完成审查，不再读取独立 prompt。

Capture：source、resource type、stack、license status、Product UI suitability、Vue translation required、primitive mapping、needed project wrapper、state coverage、density fit、a11y risk、motion risk、template risk、adopt、adapt、avoid。

输出 Shadcn Resource Decision：`adopt / adapt / reject / reference only`、reason、required contract、required wrapper、required state matrix、verification hooks。不得直接复制 React code、付费模板、未知 license 代码或截图；不得把 primitive 当完整设计系统。

## Admin Component Contract

写入 `ui-design.md#Admin Component Contract` 时使用 compact matrix；独立组件详情链接到 contract 文件。

Matrix columns：Project component、Primitive / companions、Wrapper responsibility、States owned、Contract file。每一行都要能回答：这个组件解决什么任务、谁拥有状态、primitive 只是底座还是被 wrapper 收口、实现和验证要读哪个 contract。

## Purpose

| Family | Use when | Not for | Components covered |
| --- | --- | --- | --- |
| App shell | 后台壳、工作台、设置、权限、多模块导航 | 单个内容卡片、营销区块 | LayoutShell, Navbar, Menu, Breadcrumb, Tabs, Avatar, TooltipPopover |
| Data work | 列表、审计、审批、监控、指标、对象操作 | 品牌叙事、少量入口卡片 | FilterBar, Table, Pagination, StatusBadge, Chart, Drawer, EmptyState, SkeletonProgress |
| Form flow | 创建、编辑、配置、导入导出、多步骤、高风险确认 | 纯展示、无状态装饰 | Form, Input, SelectCombobox, DatePicker, Button, Upload, Stepper, Dialog, Toast |
| Command / AI | AI 助手、命令面板、开发者工具、诊断链路、专家工作流 | 普通表单替代 | CommandPalette, AIInput, ToolTrace, EvidenceCard, ResultDrawer |
| Mobile / H5 | 移动表单、轻列表、个人中心、活动入口、现场工具 | 直接缩小桌面后台 | MobileShell, BottomActionBar, EntityCardList, BottomSheet, MobileUpload |

## Structure

| Family | Must explain |
| --- | --- |
| App shell | shell root、navigation、content frame、location、account、help layer；导航是否稳定、主内容是否独立滚动、breadcrumb / nav / title 是否同一业务命名 |
| Data work | toolbar、filters、table / list、selection、chart、detail drawer、footer、recovery；主对象、状态、owner、time、actions、last refreshed 可扫描 |
| Form flow | form root、field、selection、date / time、upload、stepper、action、feedback；字段含 label、required、helper、error、unit、counter |
| Command / AI | trigger、command surface、AI input、tool trace、result card、side context、feedback；工具状态、证据、copy / export、cancel / retry / rate limit 可见 |
| Mobile / H5 | viewport shell、input group、action bar、tabs、card list、drawer、upload、feedback；safe area、keyboard region、sticky bottom action、触控目标成立 |

## Variants

| Family | Candidate variants |
| --- | --- |
| App shell | admin-shell、workspace-shell、mobile-h5-shell、dashboard-shell、split-shell、lightweight-shell；不要默认 sidebar |
| Data work | resource-table、audit-table、editable-table、comparison-table、chart-metrics、entity-drawer、async-data-view |
| Form flow | simple-form、sectioned-form、wizard-form、inline-edit、bulk-action-form、upload-flow、destructive-confirm |
| Command / AI | global-command、context-command、ai-chat-input、tool-trace-timeline、evidence-card、developer-console |
| Mobile / H5 | mobile-form、mobile-list、personal-center、event-h5、field-tool、bottom-sheet-flow |

## States

| Family | Required state coverage |
| --- | --- |
| App shell | initializing、route-loading、authenticated / guest、permission-denied、session-expired、maintenance、offline、collapsed / mobile menu、workspace-switching、overflow、global-error、content-empty |
| Data work | loading、empty、filtered-empty、error、permission、selected / partial-selected、row-expanded / updating、stale / offline / retry、sort / filter / hidden-column、bulk-processing、export-running、chart no-data |
| Form flow | default、focus、dirty、validating、invalid、readonly、disabled、submitting、submitted、submit-failed、network-retry、permission-disabled、remote-options、uploading、step-blocked、summary-review |
| Command / AI | idle、focused、searching、empty、no-permission、composing、submitting、streaming、stopped、rate-limited、tool pending/running/success/failed/retry、source-missing、copy feedback |
| Mobile / H5 | keyboard-open、safe-area-active、network-slow、offline、input-focus、validation-error、readonly、disabled、pull-refreshing、loading-more、empty、permission、upload camera/failed/success、sheet-open |

## Density

| Family | Density rules |
| --- | --- |
| App shell | desktop admin 使用 16-24px page padding、固定 shell height、main 独立滚动；compact 不隐藏 active / focus / tooltip；mobile 处理 safe area、bottom actions、keyboard |
| Data work | compact row 36-44px，default 48-56px，comfortable 60-72px；数字、状态、动作列稳定；mobile 转 entity card / key-value summary |
| Form flow | compact field 32-36px 用于 filter / inline edit；default 36-40px；comfortable 44-48px；mobile label 不能只靠 placeholder |
| Command / AI | command rows 36-44px；AI input 到多行阈值前保持稳定高度；trace rows 紧凑但不隐藏 status / source |
| Mobile / H5 | touch target >= 44px；page padding 默认 16px，dense list 可 12px；sticky bottom action 不遮挡内容，移动端无 hover-only 关键操作 |

## shadcn-vue mapping

| Family | Primitive | Companions | Project wrappers | Props / events |
| --- | --- | --- | --- | --- |
| App shell | Sidebar、NavigationMenu、Sheet、Breadcrumb、Tabs、Avatar、Tooltip、Popover、ScrollArea、Separator、Command | Button、Badge、DropdownMenu、Kbd、Toast/Sonner | AppShell、AdminShell、WorkspaceShell、MobileShell、DashboardShell、AccountMenu、NavTabs | navItems、workspace、user、activeRoute、collapsed、layoutMode、permissions、routeState；nav-select、collapse-change、workspace-change |
| Data work | Table、Checkbox、DropdownMenu、Button、Input、Pagination、Badge、Sheet/Drawer、Skeleton、Chart | Tooltip、Popover、ScrollArea、Alert、Command、Tabs、Separator | FilterBar、ResourceTable、DataTable、AuditTable、ChartPanel、StatusBadge、EntityDrawer、EmptyState、AsyncProgress | columns、data、loading、error、density、rowKey、selection、pagination、filters、columnVisibility、chartConfig；sort-change、filter-change、bulk-action |
| Form flow | Form、Input、Textarea、Select、Combobox、Popover、Calendar、Button、Dialog、AlertDialog、Toast/Sonner、Progress | Tooltip、Badge、Separator、ScrollArea、Command、Skeleton | EntityForm、FieldGroup、RemoteCombobox、DateRangeField、UploadField、ImportWizard、AsyncButton、ConfirmDialog | modelValue、schema、options、remote、accept、maxSize、stepState；submit、validate、cancel、retry、upload、confirm、step-change |
| Command / AI | Command、Dialog、Input、Textarea、Button、Tooltip、Popover、Card、Drawer、Skeleton、Toast/Sonner | Badge、Kbd、ScrollArea、Separator、Progress、DropdownMenu | CommandCenter、AIInput、ToolTraceTimeline、EvidenceCard、ResultDrawer、AsyncCommandButton | commands、query、contextObject、mode、attachments、streaming、toolCalls、sources；command-select、submit、stop、retry、copy、open-source |
| Mobile / H5 | Button、Input、Tabs、Drawer/Sheet、Card、Toast/Sonner、Skeleton、Progress、Upload/FileInput | Badge、Avatar、Separator、ScrollArea、Tooltip、Dialog | MobileShell、BottomActionBar、MobileField、EntityCardList、BottomSheet、MobileUpload、SafeAreaToast | safeArea、keyboardState、items、activeTab、uploadState、offline；submit、tab-change、refresh、load-more、upload、retry、sheet-close |

## Content

| Family | Content rules |
| --- | --- |
| App shell | nav、title、breadcrumb 使用同一业务命名；tab 表达同一对象的同级视图；avatar menu 写真实动作；关键错误、权限、金额不能只放 tooltip |
| Data work | 列头写单位和口径；状态用文本 + 颜色 + 必要图标；图表写单位、时间范围、数据来源和空值说明；空态写恢复动作 |
| Form flow | label 是字段名，placeholder 只是示例；helper 写规则和影响；error 写原因和恢复动作；危险动作写对象数量、后果和可逆性 |
| Command / AI | command label 用动词 + 对象；AI 输入说明当前能力和限制；tool trace 写具体步骤；证据卡写 source、confidence、时间和路径 |
| Mobile / H5 | 移动按钮写具体动作；错误靠近字段；卡片首行是对象名或任务；上传说明写大小、格式、来源和失败恢复 |

## Anti-patterns

| Family | Avoid |
| --- | --- |
| App shell | 默认 sidebar 且没比较其他导航；sidebar 随内容滚走；每页手写 padding / loading / nav；tabs 承载跨模块主导航；avatar 只有装饰 |
| Data work | 只有 happy path；所有列等宽；KPI 卡片墙替代主任务；图表色复用按钮主色；筛选隐藏；Drawer 塞无尽表单；移动端缩小宽表 |
| Form flow | placeholder 当 label；所有错误只 toast；保存中按钮变窄或可重复提交；长表单放 Dialog；远程 Select 无搜索 / loading / empty / failure |
| Command / AI | AI 助手只有聊天框；command palette 只有导航；失败只 toast；复制无 feedback；关键 source、权限、风险藏 tooltip；抽象光效盖过结果 |
| Mobile / H5 | 直接缩小桌面表格；底部按钮遮住输入或列表尾部；icon-only 没有文本、tooltip 或 aria-label；入口大卡片导致首屏密度过低 |

## Handoff Checks

- `component_strategy` 必须说明使用 `primitive + wrapper`、`project components` 还是 `registry`。
- `shadcn_vue.primitive_layer[]` 只列 primitive；`project_wrapper_layer[]` 只列项目封装。
- 组件契约必须能追溯到 REQ / AC / UI section / Design Contract。
- Motion slot 必须写实现层级：CSS transition / Vue motion adapter / GSAP / N/A。
- Product UI 的表格、表单、权限、导入导出、审计、长任务不能只靠 toast 或页面散文描述。
