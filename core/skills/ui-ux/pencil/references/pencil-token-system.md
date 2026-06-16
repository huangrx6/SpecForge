# Pencil Token System

Pencil variables 必须和 Design Contract JSON 对齐。不要在 Pencil 里只同步颜色，也不要把字体、字号、间距、圆角和阴影当作画布局部属性。

## 变量命名

| 类型 | Pencil variable | 来源 |
| --- | --- | --- |
| 背景 | `color-bg` | `color_system.tokens.background` |
| 表面 | `color-surface` | `color_system.tokens.surface` |
| 次级表面 | `color-surface-muted` | `color_system.tokens.surface_muted` |
| 正文 | `color-text` | `color_system.tokens.text` |
| 弱文案 | `color-text-muted` | `color_system.tokens.text_muted` |
| 主色 | `color-primary` | `color_system.tokens.primary` |
| 辅助色 | `color-accent` | `color_system.tokens.accent` |
| 边框 | `color-border` | `color_system.tokens.border` |
| 状态色 | `color-success / warning / danger` | `color_system.tokens.*` |
| 字体 | `font-sans / font-heading / font-mono` | `foundation_system.typography.font_family` |
| 字号 | `text-page-title / text-body / text-caption / text-metric` | `foundation_system.typography.scale` |
| 行高 | `leading-page-title / leading-body / leading-caption` | `foundation_system.typography.line_height` |
| 间距 | `space-page-x / space-section / space-panel / space-card-gap` | `foundation_system.spacing.*` |
| 控件高度 | `height-toolbar / height-control / height-table-row` | `foundation_system.spacing.*` |
| 圆角 | `radius-control / radius-panel / radius-overlay` | `foundation_system.radius_shadow.radius_scale` |
| 阴影 | `shadow-card / shadow-overlay` | `foundation_system.radius_shadow.*` |
| 动效 | `motion-fast / motion-base / motion-panel / ease-standard` | `foundation_system.motion.css_tokens` |

## 同步步骤

1. 调用 `pencil_get_variables` 获取当前变量。
2. 对照 Design Contract JSON 生成缺失变量清单。
3. 调用 `pencil_set_variables` 创建或更新变量。
4. 使用 `pencil_search_all_unique_properties` 检查散落值。
5. 对可替换的散落值使用 `pencil_replace_all_matching_properties` 收敛。
6. 截图验证实际视觉是否仍符合 Composition Recipe。

## 禁止

- 只同步 `primary / background / text` 三个颜色就开始画页面。
- 在 Pencil 节点上写随机 `fontSize: 17`、`gap: 22`、`cornerRadius: 13`。
- 为了贴近截图临时新增不进入 Design Contract 的变量。
- 把状态色当装饰色使用。
- Product UI 用 Brand Surface 的 display scale、editorial spacing 或 glass shadow。

## Token Sync Result

```md
Pencil Token Sync:
| Token group | Source | Pencil variables | Status | Notes |
| --- | --- | --- | --- | --- |
| Color | color_system | | synced / partial / blocked | |
| Typography | foundation_system.typography | | synced / partial / blocked | |
| Spacing | foundation_system.spacing | | synced / partial / blocked | |
| Radius / shadow | foundation_system.radius_shadow | | synced / partial / blocked | |
| Motion | foundation_system.motion | | synced / partial / blocked | |
```
