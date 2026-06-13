# Button

## Purpose

按钮表示用户主动触发的命令。按钮不是标签、状态或导航装饰。每个页面区域最多一个 primary action；批量操作、危险操作和工具按钮必须有清晰语义。

## Anatomy

| Part | Rule |
|---|---|
| Label | 动词 + 对象，例如 `保存配置`、`导出报表` |
| Icon | 只在提高识别时使用；icon-only 必须有 tooltip / aria-label |
| Loading | 保留按钮宽度，显示 loading 文案或 spinner |
| Permission | 无权限时说明原因，不只 disabled |
| Danger confirm | 删除、撤销、覆盖类操作必须二次确认 |

## Variants

| Variant | Use | Visual |
|---|---|---|
| primary | 当前主任务 | brand fill，区域内唯一 |
| secondary | 次任务 | neutral surface + border |
| ghost | 工具栏、弱操作 | transparent，hover 有反馈 |
| danger | 删除、撤销、禁用 | error semantic，不与 brand 混用 |
| icon | 表格行操作、工具按钮 | fixed size，tooltip 必须 |
| link | 跳转或查看详情 | text action，不用于提交 |

## States

default / hover / active / focus / disabled / permission-disabled / loading / success / danger-pending.

## Layout

- compact: 28-32px height, table / toolbar。
- comfortable: 36-40px height, form / page action。
- mobile: 44-48px touch target。
- icon button 必须固定宽高，避免 hover 改变布局。

## shadcn-vue

- Primitive: Button, Tooltip, AlertDialog.
- Project wrapper: AppButton, IconButton, ConfirmButton, PermissionButton.
- Props: variant, size, loading, disabledReason, icon, confirm, permission.

## Anti-patterns

- 页面里多个 primary 并列。
- disabled 后不给原因。
- danger 只换红色但没有确认和后果说明。
- icon-only 无 tooltip。
- 按钮文字使用 `提交`、`确定`、`操作` 这类模糊词。
