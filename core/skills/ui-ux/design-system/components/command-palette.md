# Command Palette

命令面板是 keyboard-first 的动作入口，适合专家用户、高频工具、全局跳转和 AI 工具选择，不适合替代所有导航。

## Anatomy

trigger / search input / groups / item icon / item title / meta / shortcut / empty / no-result / footer hint.

## Variants

- global command：全局跳转和动作。
- tool command：AI 工具选择。
- entity command：查人、查工单、查资源。
- inline command：输入框内快捷补全。

## Contract

- 支持 keyboard first：打开、上下选择、确认、关闭。
- 分组显示最近使用、推荐、全部结果。
- 搜索为空时展示推荐动作；搜索无结果时给出可恢复文案。
- 命令文案使用动词 + 对象；危险动作必须二次确认。
- 结果项要显示对象类型、来源或权限，避免同名歧义。

## States

closed / open / searching / empty / no-result / permission / loading / error / executing.

## shadcn-vue

- Primitive: Command, Dialog, ScrollArea, Badge.
- Project wrapper: GlobalCommand, ToolCommand, UserCommand, InlineCommand.

## Anti-patterns

- 所有工具无分组。
- 搜索无结果时空白。
- 鼠标可用但键盘路径不可用。
- 危险命令可直接回车执行。
