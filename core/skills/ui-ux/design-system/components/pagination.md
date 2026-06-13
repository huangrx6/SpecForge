# Pagination

分页用于数据浏览和性能控制，让用户理解当前范围和总量。

## Anatomy

page info / previous / next / page items / page size / total / jumper.

## Variants

- simple pagination：上一页/下一页。
- full pagination：页码、总数、page size。
- cursor pagination：游标翻页。
- infinite load：移动端或内容流。

## States

loading / first-page / last-page / empty / error / page-size-changing.

## Rules

- 表格页显示 total 和 page size。
- 游标分页不能假装有总页数。
- 切换 page size 后要回到合理页。
- 移动端可简化为上一页/下一页。

## shadcn-vue

- Primitive: Pagination, Select, Button.
- Project wrapper: TablePagination, CursorPagination.

## Anti-patterns

- 总数和筛选条件不一致。
- loading 时页码跳动。
- 无限加载没有结束提示。
