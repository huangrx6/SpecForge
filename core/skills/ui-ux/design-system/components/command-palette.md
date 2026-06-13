# Command Palette

## Purpose

命令面板用于跨页面快速搜索、跳转和执行命令。它适合高频专家用户，也可作为 AI 助手入口。

## Structure

- trigger：快捷键、搜索入口或 AI 输入入口
- input：搜索词、命令语气、loading
- groups：最近、页面、动作、对象、AI 建议
- item：icon、label、description、shortcut、status
- empty：无结果、创建/反馈/帮助入口
- footer：快捷键提示、范围、权限说明

## Variants

- global-search：全局对象搜索
- action-command：执行动作和跳转
- ai-command：自然语言转换命令或问答
- page-local：当前页面内搜索和操作
- developer-command：调试、配置、隐藏功能

## States

- closed、open、typing、loading、empty、error
- keyboard-active：上下选择、enter 执行
- permission-denied：命令可见但不可执行时解释
- recent：无输入时展示最近使用
- ai-thinking / ai-ready / ai-failed
- ambiguous：需要用户二次选择对象

## Density

- overlay width：560-720px，移动端全屏或 bottom sheet
- item height：40-56px，描述型命令更高
- group spacing：8-12px，组标题低强调
- shortcut 靠右固定宽度
- 结果超过 8-10 项滚动，不拉长页面

## shadcn-vue mapping

- Primitive：Command、Dialog、Kbd、Badge、Avatar、Spinner
- Companions：Button、Separator、ScrollArea
- Project wrappers：AppCommandPalette、AiCommandPalette、EntitySearchCommand
- Props：scope、groups、loading、recentItems、aiEnabled
- Events：search、select、execute、open-change

## Content

- 命令 label 用动词短句：“新建问题单”“打开客户”
- description 写对象范围或后果
- 快捷键格式一致：⌘K、Enter、Esc
- AI 建议要说明会做什么，不要写玄学话
- 无结果保留反馈或新建入口

## Anti-patterns

- 把命令面板当普通搜索框，没有动作语义
- 结果没有分组，用户无法判断类型
- 执行危险命令不确认
- 键盘不可用或焦点乱跳
- AI 命令直接执行高风险操作
- 移动端遮挡输入且无法关闭
