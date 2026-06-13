# Table

## Purpose

表格用于高密度扫描、比较、筛选和批量操作。它适合结构化数据，不适合内容叙事、移动端长文本或少量卡片入口。

## Structure

- toolbar：标题、筛选摘要、视图切换、批量操作、列设置
- filter row：搜索、条件、已选标签、清空入口
- header：排序、列说明、单位、固定列
- row：主列、状态、时间、责任人、关键指标、操作
- selection：checkbox、selected count、bulk action、不可选原因
- footer：pagination、page size、total、刷新时间
- empty/error：无数据、筛选无结果、加载失败、无权限分开处理

## Variants

- resource-table：后台资源列表
- audit-table：审计日志，强调时间线和不可编辑
- editable-table：少量可编辑字段，必须有行级校验
- tree-table：层级数据，展开状态清晰
- comparison-table：套餐、权限、配置对比
- virtual-table：大数据量，明确虚拟滚动和固定高度

## States

- loading、skeleton、empty、filtered-empty、error、permission
- selected、partial-selected、row-expanded、row-updating
- stale：数据过期，展示刷新提示
- offline / network-retry：保留旧数据并提示
- column-hidden、sort-active、filter-active
- bulk-processing：展示进度和失败项

## Density

- compact：row 36-44px，适合运营高频扫描
- default：row 48-56px，适合大多数后台列表
- comfortable：row 60-72px，带摘要/双行信息
- wide：操作列固定，长表横向滚动或列设置
- mobile：转 entity card 或关键字段折叠，不硬压 10 列

## shadcn-vue mapping

- Primitive：Table、Checkbox、DropdownMenu、Button、Input、Pagination、Skeleton
- Companions：Tooltip、Popover、Badge、ScrollArea、Alert、EmptyState
- Data engine：TanStack Table for sorting/filtering/visibility/selection/pagination
- Project wrappers：ResourceTable、DataTable、AuditTable、EditableTable、SelectionToolbar
- Props：columns、data、loading、error、density、rowKey、selection、pagination、columnVisibility
- Events：sort-change、filter-change、row-click、selection-change、bulk-action、refresh

## Content

- 列头写单位和口径：“收入(元)”“更新时间”
- 主列可点击要有 hover 和可访问焦点
- 状态用文本 + 颜色 + 必要图标，不只靠颜色
- 时间格式统一，必要时 tooltip 展示完整时间
- 行操作不超过 3 个，更多进入菜单
- 筛选摘要可读：“状态=处理中，时间=近7天”

## Anti-patterns

- 只画 happy path，没有空、错、权、加载
- 所有列等宽，数字和文本都左对齐
- 操作按钮铺满一行，抢走数据焦点
- 筛选条件隐藏，用户不知道当前范围
- 把详情、编辑、导航、批量全塞进表格
- 移动端直接缩小字体显示大宽表
