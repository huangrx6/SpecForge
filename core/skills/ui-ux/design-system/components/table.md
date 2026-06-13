# Table

表格用于高密度扫描、比较和批量操作。不是所有列表都需要表格；移动端或内容型列表可改用 entity card。

## Anatomy

| Part | Rule |
|---|---|
| Toolbar | 标题、筛选摘要、批量操作、列设置 |
| Header | 排序、列说明、单位 |
| Row | 主列、状态、时间、责任人、操作 |
| Selection | checkbox、selected count、bulk action |
| Footer | pagination、total、page size |
| Empty/Error | 区分无数据、筛选无结果、加载失败、无权限 |

## Column rules

- 主列可点击时要有视觉提示。
- 数字右对齐，单位在列头或数值旁。
- 状态用文本 + 色彩，不只用颜色。
- 时间统一格式，必要时显示相对时间 + tooltip。
- 行操作不超过 3 个；更多放入 menu。

## States

loading / empty / filtered-empty / error / permission / selected / partial-data / stale / updating.

## Layout

- compact row 40-46px，comfortable row 48-56px。
- 固定操作列；宽表需要列设置或横向滚动策略。
- 移动端优先 card list 或关键列折叠，不直接压缩 10 列。
- 表格高度要有分页或虚拟滚动策略，不让整页无限长。

## shadcn-vue

- Primitive: Table, Checkbox, DropdownMenu, Pagination, Skeleton.
- Project wrapper: ResourceTable, DataTable, AuditTable, SelectionToolbar.

## Anti-patterns

- 只画 happy path，无空态/错误态。
- 所有列等宽。
- 操作按钮铺满一行。
- 筛选状态不可见，用户不知道当前数据范围。
- 表格既承担导航又承担编辑又承担详情，职责过多。
