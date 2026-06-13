# Breadcrumb

## Purpose

Breadcrumb 表达当前位置和上级路径。它适合层级较深的后台/详情页，不替代主导航。

## Structure

- root：语义 nav 和 ordered list
- item：上级可点击、当前不可点击
- separator：低强调，不抢视觉
- ellipsis：中间层级过长时折叠
- home/root：产品或模块起点
- context：对象名、编号或当前视图

## Variants

- simple：模块 > 当前页
- entity：列表 > 对象详情
- deep：组织 > 项目 > 资源 > 详情
- mobile：返回按钮 + 当前标题
- with-actions：只在必要时搭配复制路径
- dynamic：路由加载后补对象名

## States

- loading-current、not-found-current
- permission-hidden-parent
- truncated、ellipsis-open
- hover、focus
- route-changing
- stale-object-name

## Density

- height 28-36px，页面标题上方
- item gap 4-8px，separator 12-16px
- mobile 显示返回 + 当前页，不展示长链
- 对象名超过 24 字截断并 tooltip
- 和 page title 间距 8-12px

## shadcn-vue mapping

- Primitive：Breadcrumb、DropdownMenu、Tooltip、Button
- Companions：Skeleton for loading route name
- Project wrappers：AppBreadcrumb、EntityBreadcrumb、MobileBackTitle
- Props：items、loading、maxItems、currentLabel、mobileMode
- Events：navigate、copy-path

## Content

- 路径用用户语言，不用路由名或接口名
- 当前对象名优先，其次编号
- 上级文案保持和导航一致
- 权限隐藏的父级不要露出敏感名称
- 找不到对象时显示“对象不存在”并给返回路径

## Anti-patterns

- 每页都放很长面包屑，信息噪音
- 当前页仍可点击自己
- 路由英文 slug 暴露给用户
- 移动端挤满层级文字
- 面包屑和标题重复且占空间
- 用面包屑承载筛选或状态
