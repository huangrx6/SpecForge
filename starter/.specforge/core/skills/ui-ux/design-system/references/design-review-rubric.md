# Design Review Rubric

| 维度 | 通过标准 | 失败信号 |
|---|---|---|
| 宿主适配 | 气质、密度、组件和业务场景一致 | 像无关模板 |
| Composition Recipe | 字体、空间、圆角阴影、动效和 signature 服务同一气质 | 颜色还行，但排版、间距、材质和动效各说各话 |
| 信息层级 | 主任务、状态、下一步明确 | 用户不知道先看哪里 |
| Product UI 工作表面 | 主要使用者、业务对象、任务和首屏 primary work surface 明确 | 工作台只有 KPI、空白卡片和快捷入口 |
| 组件系统 | 组件规则可复用 | 页面一次性拼装 |
| 状态覆盖 | loading / empty / error / permission 明确 | 只有 happy path |
| 可访问性 | focus、对比度、语义、错误提示可用 | 只靠颜色或图标 |
| 动效 | 服务反馈和空间关系 | 装饰化、抢注意力 |
| 实现友好 | 可映射到 shadcn-vue / 项目组件 | 视觉稿无法落地 |
| 样例确认 | 有 2-3 个方向、采用/不采用和确认状态 | Agent 自行决定风格 |
| Token 纪律 | 颜色、间距、圆角、阴影来自 semantic tokens | 页面里大量一次性值 |

结论使用：`pass / needs revision / blocked`。

## Blockers

- 无 UI 方向确认且方向会影响核心体验。
- Design Contract JSON 缺少 `foundation_system`，或没有 typography / spacing / radius_shadow / motion 配方。
- 有 UI 影响但没有状态矩阵或 Pencil 证据。
- Product UI 没有主要使用者、业务对象、主要任务或首屏工作表面。
- Dashboard / 工作台首屏是 KPI strip + 大空白面板 + 通用快捷入口。
- 使用 shadcn-vue primitive 但没有项目级组件 contract。
- 视觉质量依赖无法落地的截图效果、随机渐变或不可维护动效。
