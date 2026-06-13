# Layout Shell

Layout Shell 定义页面骨架、导航、内容宽度、滚动区和全局反馈。它决定页面是否稳定。

## Anatomy

app header / side nav / content header / main region / aside / footer / global toast / modal layer.

## Variants

- admin shell：顶部 + 侧边。
- resource shell：标题 + toolbar + table。
- mobile shell：顶部状态 + 内容 + 底部操作。
- split shell：主列表 + inspector。

## States

loading / nav-collapsed / permission / offline / route-transition / dirty.

## Layout

- 页面滚动区必须明确，避免 body 和内部容器双滚动。
- header / footer 固定时要给内容预留空间。
- 移动端底部操作考虑 safe area。
- 宽屏内容有最大宽度或分栏策略。

## shadcn-vue

- Primitive: Sidebar, Separator, ScrollArea, Toaster.
- Project wrapper: AppShell, ResourceShell, MobileShell, SplitShell.

## Anti-patterns

- 页面 section 全部漂浮卡片化。
- 固定导航遮挡内容。
- 每个页面自己实现导航和间距。
