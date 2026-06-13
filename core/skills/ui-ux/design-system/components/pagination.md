# Pagination

## Purpose

分页帮助用户理解数据范围并在大列表中移动。它要和筛选、排序、总数、加载策略一致。

## Structure

- range：当前显示范围和总数
- controls：首页/上一页/页码/下一页/末页
- page size：每页条数，按场景可选
- jump：大页数时跳转
- loading：翻页中禁用重复操作
- summary：筛选后总数、更新时间

## Variants

- simple：上一页/下一页，移动端或轻列表
- numbered：页码型后台列表
- infinite：消息流/动态流，需加载边界
- cursor：服务端 cursor，不展示总页数
- virtual：大数据量滚动，保留已加载数量
- compact-footer：表格内底部分页

## States

- default、loading、empty、first-page、last-page
- page-size-changing、invalid-jump
- total-unknown：无法获取总数
- filter-reset：筛选变化回第一页
- selection-retained：跨页选择需明确
- error：翻页失败保留当前页

## Density

- compact：高度 32px，表格 footer
- default：36-40px
- mobile：只展示上一页/下一页和范围
- 页码超过 7 个使用省略
- 分页和表格间距 12-16px

## shadcn-vue mapping

- Primitive：Pagination、Select、Button、Input
- Companions：Tooltip、Skeleton、Table footer、URL query sync
- Project wrappers：AppPagination、TablePagination、CursorPagination
- Props：page、pageSize、total、loading、mode、pageSizeOptions
- Events：page-change、page-size-change、jump
- Store：与 URL query 或列表状态同步

## Content

- 显示“1-20 / 共 356 条”比只显示页码更有用
- 未知总数写“已加载 120 条”
- page size 文案写“每页 20 条”
- 翻页失败写“加载第 3 页失败，请重试”
- 跨页选择要提示“已选择全部 356 条”

## Anti-patterns

- 筛选后仍停留在不存在的页码
- 只展示页码，没有总数和范围
- 页码按钮过密，移动端难点
- 切页时表格高度跳动
- 跨页选择语义不清
- cursor 分页伪装成精确页码
