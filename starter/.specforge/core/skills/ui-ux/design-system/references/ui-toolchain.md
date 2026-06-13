# UI Toolchain

这是 `sf-ui-design` 调用设计规范 skill 的推荐工具链。

## Chain

1. `sf-brainstorm`：模糊视觉方向、目标用户和体验取舍。
2. `sf-ui-design`：正式生成 UI design artifact 和 Pencil 原型证据。
3. `design-system`：提供 foundations、组件契约、页面模式、样例板和视觉审查。
4. `pencil`：创建正式 `.pen` 原型和截图。
5. implementation skill：按 `ui-design.md` 和组件 contract 实现，不重新发明视觉风格。
6. verification skill：截图、可访问性、交互和状态验证。

## Human gates

- Design direction gate：方向影响气质或信息架构时确认。
- Sample board gate：给用户看 2-3 个样例，确认采用/不采用。
- Prototype gate：Pencil 截图 review 后至少修一轮。

## Anti-slop guardrails

- 不用通用落地页手法做管理端。
- 不用默认 shadcn demo 代替项目组件系统。
- 不用视觉形容词代替 token、状态、组件和页面规则。
- 不用动效掩盖信息架构问题。
