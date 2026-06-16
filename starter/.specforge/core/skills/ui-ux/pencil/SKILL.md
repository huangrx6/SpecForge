---
name: pencil
description: SpecForge 本地 Pencil 原型技能；当 UI design 已确认、需要创建/修改 `.pen` 原型、把 Design Contract JSON 转成 Pencil variables、复用 Pencil 组件、导出截图或从 Pencil 生成前端代码时必须使用。它不负责重新决定审美，只负责把已确认的设计系统稳定落到 Pencil。
---

# SpecForge Pencil Skill

本 skill 是 SpecForge 对 Pencil 的本地封装。外部 Pencil 工具只负责画布操作；设计判断来自 `core/skills/ui-ux/design-system` 和 `01-spec/ui-design.md#Design Contract Summary`。

## 边界

| 本 skill 负责 | 本 skill 不负责 |
| --- | --- |
| 读取 Design Contract JSON 和 Composition Recipe | 临时选择新的审美方向 |
| 把 color / foundation / component / motion token 映射为 Pencil variables | 用 Pencil 风格指南覆盖已确认设计方向 |
| 复用 `.pen` 内已有组件和资产 | 从零重画已有按钮、输入框、表格、导航 |
| 按页面模式生成 `.pen` 原型 | 用通用后台模板替代 Product UI Layout Audit |
| 截图、布局检查、溢出检查、保存后重读 | 跳过视觉验证或交付空 `.pen` |
| 把 Pencil 设计转成实现提示 | 绕过 technical design 直接决定依赖和组件架构 |

如果没有确认的 `ui-design.md`、Design Contract JSON 或人工授权默认，停止并回到 `sf-ui-design`。

## 读取顺序

1. 读 `01-spec/ui-design.md#Design Contract Summary`，解析 Design Contract JSON。
2. 读 `ui-design.md#Composition Recipe`、`#Product UI Layout Audit`、`#视觉质量 Review` 和组件契约链接。
3. 读 design-system 的 `references/design-composition.md`、`references/product-ui-layout-quality.md`、`references/output-contract.md` 和相关 foundations。
4. 读本 skill 的：
   - `references/specforge-design-contract-handoff.md`
   - `references/pencil-token-system.md`
   - `references/pencil-quality-gate.md`
5. 只有需要从 Pencil 生成代码时，再读 `references/design-to-code-workflow.md` 和 `references/tailwind-shadcn-mapping.md`。

## 工作流

1. **Contract intake**：确认 `design_mode`、`color_system`、`foundation_system`、`layout`、`product_ui_quality`、`motion`、`anti_slop_rules` 都存在。
2. **Pencil state**：打开目标 `01-spec/ui-mockup.pen`，读取 editor state、现有 variables、reusable components、assets。
3. **Token sync**：把 Design Contract JSON 映射到 Pencil variables；颜色、字体、字号、间距、圆角、阴影、motion token 都不硬编码。
4. **Component reuse**：优先插入 `.pen` 里已有 reusable component；没有时才创建新组件，并设置 reusable。
5. **Section build**：按 layout archetype 分段构建，不一次性糊完整屏。
6. **Visual verification**：每个 section 后截图 + `pencil_snapshot_layout(problemsOnly: true)`；有溢出、重叠、空白失衡就修。
7. **Persistence check**：保存或重读 `.pen`，确认文件非空且包含目标 artboard。
8. **Handoff**：导出截图，记录 Pencil evidence、token sync result、layout QA 和剩余风险。

## Token 映射底线

| Design Contract 字段 | Pencil variable |
| --- | --- |
| `color_system.tokens.background` | `color-bg` |
| `color_system.tokens.surface` | `color-surface` |
| `color_system.tokens.text` | `color-text` |
| `foundation_system.typography.scale` | `type-scale-*` |
| `foundation_system.spacing.*` | `space-*` / `height-*` |
| `foundation_system.radius_shadow.*` | `radius-*` / `shadow-*` |
| `foundation_system.motion.*` | `motion-*` |

变量不存在时可以创建，但必须来自 Design Contract，不允许凭画布感觉新增随机值。

## Product UI 原型规则

- 工作台 / Dashboard 第一屏必须可见 primary work surface：queue、table、inspector、timeline、command surface 或 anomaly board。
- KPI、快捷入口、欢迎语、icon grid 都不能成为主工作区。
- 大面积空白 framed card 在 Pencil 截图中必须被判为问题，除非它是明确的 empty / loading / error / permission 状态。
- 表格、队列、待办必须有真实字段：对象、状态、优先级 / SLA、时间、负责人、下一步动作。

## 质量门禁

交付前必须满足：

- `.pen` 已保存并重读成功。
- Pencil variables 覆盖颜色、字体、字号、间距、圆角、阴影、动效。
- 没有散落 hex、随机字号、随机 gap、随机圆角。
- 复用了现有 reusable components，或写明为什么新增。
- 每个目标 artboard 有截图。
- `pencil_snapshot_layout(problemsOnly: true)` 无未处理问题。
- Visual QA Detectors 的 high severity issue 已修复或有接受理由。
- 截图能证明 Design Contract 的 `foundation_system` 和 `product_ui_quality` 被实际用到。

## 常见错误

| 错误 | 正确做法 |
| --- | --- |
| 在 Pencil 里重新选风格 | 回读 `ui-design.md`，只执行已确认方向 |
| 只同步颜色变量 | 同步 `foundation_system` 的字体、空间、圆角阴影、动效 |
| 生成通用后台首页 | 按 Product UI Layout Audit 构建真实工作表面 |
| 直接画按钮 / 卡片 | 先查 reusable components，再插入 ref |
| 硬编码 `#2563EB`、`8px`、`14px` | 使用或创建语义变量 |
| 画完才截图 | 每个 section 后截图和布局检查 |
| 工具调用成功就认为保存成功 | 保存后重读 `.pen`，确认非空 |

## 输出到 SpecForge

| 内容 | 写入位置 |
| --- | --- |
| Pencil 原型 | `01-spec/ui-mockup.pen` |
| 导出截图 | `01-spec/ui-mockup-export/` |
| Pencil token sync 记录 | `01-spec/ui-design.md#Wireframe / Prototype Evidence` |
| 未能执行的 Pencil 阻塞 | `01-spec/ui-design.md#UI Artifact Decision` |
| 实现提示 | `02-implementation/implementation-plan.md#Frontend Notes` 或 technical design |
