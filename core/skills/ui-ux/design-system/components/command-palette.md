# Command Palette

命令面板用于快捷搜索、工具启动、全局跳转和 AI 工具选择。

## Contract

- 支持 keyboard first：打开、上下选择、确认、关闭。
- 分组显示最近使用、推荐、全部结果。
- 搜索为空时展示推荐动作；搜索无结果时给出可恢复文案。
- 命令文案使用动词 + 对象；危险动作必须二次确认。

## shadcn-vue mapping

- Primitive: Command, Dialog, ScrollArea, Badge.
- Project components: GlobalCommand, ToolCommand, UserCommand.

## States

default / searching / empty / no-result / permission / loading / error.
