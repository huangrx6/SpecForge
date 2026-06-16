# UI Toolchain

这是 `sf-ui-design` 调用设计规范 skill 的推荐工具链。

## Chain

1. `sf-brainstorm`：模糊视觉方向、目标用户和体验取舍。
2. `sf-ui-design`：正式生成 UI design artifact 和 Pencil handoff evidence。
3. `design-system`：提供 Design Mode、Composition Recipe、color_system、foundation_system、组件契约、页面模式、样例板和视觉审查。
4. `pencil`：消费已确认 Design Contract，创建正式 `.pen` 原型、variables、组件复用证据和截图。
5. `sf-tech-design`：把 Design Contract Summary 转成 token delivery、组件架构、shadcn-vue registry / wrapper、motion dependency、GSAP 边界和验证面。
6. `sf-tasking`：把 token、foundation_system、wrapper、页面、状态、a11y、视觉验证拆成可执行任务。
7. implementation skill：按 `ui-design.md`、technical design 和组件 contract 实现，不重新发明视觉风格。
8. verification skill：截图、可访问性、交互、状态、动效和 token adherence 验证。

## Human gates

- Design direction gate：方向影响气质或信息架构时确认。
- Sample board gate：给用户看 2-3 个样例，确认采用/不采用。
- Engineering handoff gate：UI 会影响前端架构、组件库、registry、动效依赖或 token delivery 时，technical design 必须确认。
- Prototype gate：Pencil handoff screenshot review 后至少修一轮。
- Foundation gate：Design Contract JSON 必须包含 `color_system` 和 `foundation_system`，`pencil` skill 必须证明两者都已同步。

## Anti-slop guardrails

- 不用通用落地页手法做管理端。
- 不用默认 shadcn demo 代替项目组件系统。
- 不用视觉形容词代替 token、状态、组件和页面规则。
- 不只约束颜色；字体、字号、行高、间距、圆角、阴影和动效必须形成同一套 Composition Recipe。
- 不用动效掩盖信息架构问题。
- 不在实现阶段重新选择字体、主色、圆角、密度、动效或组件形态。
