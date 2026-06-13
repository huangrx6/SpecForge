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
- 移动端没有安全区，输入栏被遮挡
- sidebar 折叠后图标无 tooltip
- 全局 loading 让页面空白
- 每个页面自己写一套导航和 padding
