# Drawer

Drawer 用于在保留页面上下文的同时查看详情、编辑对象、筛选条件或执行局部流程。

## Purpose

- 列表 + 详情。
- 筛选面板。
- 局部编辑。
- 任务详情、日志、引用来源、诊断依据。

## Anatomy

header / subtitle / status / content / sticky footer / close / dirty guard / loading / error.

## Variants

- detail drawer：对象详情。
- edit drawer：编辑表单。
- filter drawer：移动端筛选。
- inspector drawer：日志、依据、上下文。

## States

opening / open / loading / dirty / saving / error / permission / empty / closing.

## Layout

- PC 宽度按内容：360 / 480 / 640 / 720。
- 复杂表单使用分组和 sticky footer。
- 移动端转 full screen 或 bottom sheet。
- Drawer 内滚动，页面背景不滚动。

## shadcn-vue

- Primitive: Drawer, Sheet, ScrollArea, Button, Form.
- Project wrapper: DetailDrawer, EditDrawer, FilterDrawer, InspectorDrawer.

## Anti-patterns

- Drawer 宽度固定 50%，内容松散。
- 没有 dirty guard，关闭丢失编辑。
- 把主流程整页塞进 Drawer。
