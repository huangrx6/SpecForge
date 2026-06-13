# Layout Shell

## Purpose

LayoutShell 定义应用骨架、导航、内容区和响应式规则。它决定页面是否稳定、可扫描和可长期扩展。

## Structure

- app root：全局背景、字体、token、z-index
- navigation：topbar/sidebar/mobile nav
- content frame：page header、toolbar、main、aside
- scroll regions：页面滚动还是局部滚动
- safe area：移动端、底部操作、键盘区域
- global feedback：toast、modal、command、loading bar

## Navigation decision

导航位置是信息架构决策，不是视觉默认值。UI design 必须根据模块数量、任务切换频率、屏幕尺寸、角色工作台和内容密度给出选型，并在高影响场景让用户确认。

| Pattern | 适用 | 风险 |
| --- | --- | --- |
| fixed sidebar | 后台 / 控制台 / 模块多 / 高频切换 | 占用横向空间，移动端需折叠 |
| top nav | 模块少、品牌面或轻量产品 | 二级层级多时容易塞满 |
| hybrid top + sidebar | 全局组织切换 + 模块内导航 | 容易层级过重 |
| tabs / segmented | 同一对象下的同级视图 | 不可替代主导航 |
| command / search nav | 专家用户、高频跳转 | 新手发现性弱 |
| mobile bottom nav | 移动端 3-5 个高频入口 | 不适合深层管理系统 |

输出 UI 方案前必须写 `Navigation Decision`：

- Candidate A / B / C：至少包含一种非 sidebar 方案，除非已有设计系统强制 sidebar。
- Recommended：推荐方案、为什么适合当前任务、为什么放弃其他方案。
- Scroll regions：哪些区域 fixed / sticky，哪些区域 scroll。
- Responsive collapse：桌面、平板、移动端分别如何收敛。
- Human confirmation：用户确认、设计系统依据或低风险可逆默认。

默认桌面 sidebar 必须 fixed 或 sticky，不随主内容滚动；主内容滚动、侧栏保持定位。若故意让导航随内容滚动，必须写明原因、风险、替代方案和用户确认。

## Variants

- admin-shell：sidebar + content
- workspace-shell：组织/项目切换
- mobile-h5-shell：顶部标题 + 底部工具
- dashboard-shell：全屏看板和筛选栏
- chat-shell：消息区 + 输入区 + 侧栏
- split-shell：列表详情或主从布局

## States

- initializing、route-loading、authenticated、guest
- permission-denied、maintenance、offline
- sidebar-collapsed、mobile-menu-open
- global-error、session-expired
- theme-switching
- content-empty

## Density

- content max width 按页面类型，不统一居中卡片
- admin padding：16-24px，高密页面可 12px
- dashboard gap：12-16px，避免装饰性大留白
- mobile safe area：顶部/底部/键盘
- 固定区域高度稳定，内容变化不推动导航
- 桌面 sidebar / topbar / command trigger 等全局导航区域不应被页面内容滚动带走
- 对于长页面，优先使用 app-shell 固定导航 + main 独立滚动；不要让 body 滚动同时拖走主导航

## shadcn-vue mapping

- Primitive：Sidebar、NavigationMenu、Sheet、ScrollArea、Separator、Command、Toast/Sonner
- Companions：Breadcrumb、Tabs、Button、Avatar
- Project wrappers：AppShell、AdminShell、MobileShell、DashboardShell、ChatShell
- Props：navItems、user、workspace、collapsed、layoutMode、routeState
- Events：nav-select、collapse-change、workspace-change、logout

## Content

- 页面标题、导航项和面包屑使用同一业务命名
- 空权限/维护/离线属于 shell 级状态
- 全局错误需要错误码和恢复路径
- 不要在 shell 写页面功能说明
- 导航文案短而稳定，避免频繁改名

## Anti-patterns

- 页面 section 全部做成浮动卡片
- 滚动区域混乱，头尾操作跟着滚走
- sidebar 作为主导航却跟随页面内容滚动
- 没和用户确认导航模式，就默认采用侧边栏或顶部导航
- 只画一个 sidebar 方案，没有提供 top nav / hybrid / tabs / command nav 的取舍
- 未声明滚动区，导致实现时导航、右侧栏、表格和内容一起滚动
- 移动端没有安全区，输入栏被遮挡
- sidebar 折叠后图标无 tooltip
- 全局 loading 让页面空白
- 每个页面自己写一套导航和 padding
