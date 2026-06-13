# Navbar

## Purpose

Navbar 表达产品级或模块级导航。它帮助用户定位和切换主要区域，不承担页面内筛选或大量操作。

## Structure

- brand / product mark：产品或系统名
- primary nav：一级模块，数量受控
- secondary nav：子模块、当前上下文或 tabs
- utility：搜索、通知、帮助、用户菜单
- active indicator：当前页、父级和权限隐藏项
- responsive：折叠、抽屉、底部导航或 sidebar 协同

## Variants

- top-nav：轻量产品和 H5
- sidebar-nav：后台系统、模块多、频繁切换
- hybrid：顶部全局 + 侧边模块
- mobile-bottom-nav：3-5 个高频入口
- context-nav：详情页内锚点或子视图
- workspace-nav：多租户/多组织切换

## States

- active、hover、focus、collapsed、expanded
- permission-hidden：无权限不展示或展示锁定说明
- notification：徽标、未读、异常
- loading-route：导航后骨架或进度反馈
- offline：保留当前位置并提示
- overflow：更多菜单、搜索命令面板

## Density

- compact top：48-56px，高密后台
- default top：56-64px
- sidebar：56px collapsed / 220-280px expanded
- mobile bottom：56-64px，安全区适配
- nav item padding 一致，图标和文字基线对齐

## shadcn-vue mapping

- Primitive：NavigationMenu、Menubar、DropdownMenu、Sidebar、Sheet、Command、Avatar
- Companions：Breadcrumb、Tabs、Badge、Tooltip
- Project wrappers：AppNavbar、AppSidebar、WorkspaceSwitcher、UserMenu、MobileNav
- Props：items、activeKey、collapsed、permissions、workspace、notifications
- Events：select、collapse-change、workspace-change、logout

## Content

- 一级导航用业务名词：“客户”“工单”“知识库”
- 不要把动词动作放进主导航，如“新增”
- 当前模块要有可读标题，不只靠图标高亮
- 用户菜单项写清结果：“退出登录”“切换组织”
- 通知数字超过上限用 99+，异常要有 severity

## Anti-patterns

- 导航项过多且无分组，用户扫不完
- 只靠颜色表示当前页，无文字或位置反馈
- 把筛选、页面动作、系统设置全塞进 navbar
- 移动端菜单覆盖内容但没有返回路径
- 图标风格混乱，品牌区过度装饰
- 权限项忽隐忽现导致布局跳动
