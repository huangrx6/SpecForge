# Select And Combobox

选择组件用于从可控集合中选值。不要用 Select 承载复杂对象搜索，也不要用 Combobox 承载 3 个以内的静态选项。

## Decision

| 场景 | 组件 |
|---|---|
| 2-8 个稳定选项 | Select |
| 选项多、需要搜索 | Combobox |
| 多选标签 | MultiSelect |
| 命令式跳转或工具启动 | Command Palette |

## Anatomy

trigger / selected value / placeholder / clear / list / group label / option meta / empty / loading / error.

## Contract

- 必须有 empty、loading、error、disabled 状态。
- 远程搜索要说明 debounce、最小搜索字符数和空结果文案。
- 选中项显示要能被扫描，避免只显示模糊名称。
- 多选必须有上限、清除、批量删除和截断策略。
- 级联选择要说明父子关系和重置规则。

## States

closed / open / focused / searching / selected / empty / no-result / loading / error / disabled / permission.

## shadcn-vue

- Primitive: Select, Popover, Command, Checkbox.
- Project wrapper: RemoteCombobox, UserPicker, OrgPicker, TagMultiSelect.

## Anti-patterns

- 远程搜索没有 loading 和 no-result。
- 选中项只显示姓名，不显示组织/手机号等消歧信息。
- 多选标签撑爆一行。
- 权限不足选项只是 disabled，没有解释。
