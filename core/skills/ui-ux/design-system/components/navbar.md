# Navbar

Navbar 表达产品层级、当前位置和全局操作。导航不是装饰条，也不是所有入口的堆放处。

## Anatomy

brand / primary nav / secondary nav / search / environment switch / user menu / notification / mobile menu.

## Variants

- top nav：产品区、全局搜索、用户入口。
- side nav：后台模块和资源层级。
- mobile nav：bottom tabs 或 collapsible menu。
- brand nav：轻量、浮动或透明，但不遮挡主体。

## States

current / hover / focus / collapsed / expanded / unread / permission-hidden / environment-warning.

## Layout

- 主导航 5-7 项以内；更多用分组或侧边导航。
- 当前项必须明确，不只靠颜色。
- 移动端菜单打开/关闭要有清晰状态，触控目标 >= 44px。
- 固定导航要给内容预留空间，不遮挡标题。

## shadcn-vue

- Primitive: NavigationMenu, DropdownMenu, Sheet, Avatar, Badge.
- Project wrapper: AppNav, SideNav, MobileNav, UserMenu.

## Anti-patterns

- 顶部导航塞满所有模块。
- 当前项不明显。
- 用户、组织、环境切换位置不稳定。
- Brand Surface 透明导航压住不可读图片。
