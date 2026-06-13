# Select And Combobox

选择器用于小集合，Combobox 用于搜索型大集合。

## Decision

| 场景 | 组件 |
|---|---|
| 2-8 个稳定选项 | Select |
| 选项多、需要搜索 | Combobox |
| 多选标签 | MultiSelect |
| 命令式跳转或工具启动 | Command Palette |

## Contract

- 必须有 empty、loading、error、disabled 状态。
- 远程搜索要说明 debounce、最小搜索字符数和空结果文案。
- 选中项显示要能被扫描，避免只显示模糊名称。

## shadcn-vue mapping

- Primitive: Select, Popover, Command, Checkbox.
- Project components: RemoteCombobox, UserPicker, OrgPicker, TagMultiSelect.
