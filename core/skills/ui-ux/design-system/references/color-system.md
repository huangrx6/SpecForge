# Color System

本文件把 aesthetic palette seed 升级为可执行色彩系统。不要再从单点 hex 直接生成 UI；先选 palette，再映射 token，再按 design mode 套用使用比例和对比度规则。

## Three-layer Model

| Layer | 文件 | 作用 |
| --- | --- | --- |
| Palette library | `data/aesthetic-palettes.csv` | 每个 aesthetic direction 的 neutral / primary / accent / semantic / chart 色阶、使用比例和 avoid rules。 |
| Token mapping | 本文件 | 把 palette 色阶映射到 semantic tokens、状态 tokens、dark mode、hover / active / disabled。 |
| Usage rules | `references/palette-usage-rules.md` | Product UI / Brand Surface / Hybrid / Avatar-IP 的比例、禁用组合和审查纪律。 |

## Palette Selection Protocol

1. 先读 `references/design-mode-routing.md` 得到 `design_mode`。
2. 再根据用户选择或推荐的 aesthetic direction，从 `data/aesthetic-palettes.csv` 选 `palette_id`。
3. 如果没有完全命中，选择同 mode 下最近的 palette，并记录 `palette_source: derived from <palette_id>`。
4. 不允许只复制 `primary` 单色；必须读取 neutral、primary、accent、semantic、chart、usage_ratio、contrast_notes 和 avoid。
5. 选定 palette 后写入 Design Contract JSON 的 `color_system`。

## Token Mapping

| Token | Product UI mapping | Brand Surface mapping | Notes |
| --- | --- | --- | --- |
| `--color-bg` | neutral-50 | neutral-50 / neutral-900 | 页面主背景，不用 primary 大面积铺底。 |
| `--color-surface` | neutral-50 / neutral-100 | neutral-50 / primary-50 / accent-50 | 内容容器；Brand Surface 也要保留正文可读面。 |
| `--color-surface-muted` | neutral-100 | neutral-100 / accent-50 | 次级背景、hover 区域。 |
| `--color-border` | neutral-200 / neutral-300 | neutral-200 / primary-100 | 分隔和控件边界，不能低到不可见。 |
| `--color-text` | neutral-900 | neutral-900 or neutral-50 | 正文必须满足 contrast。 |
| `--color-text-muted` | neutral-700 / neutral-500 | neutral-700 / neutral-300 | 辅助文字仍需可读，不能用 decorative accent。 |
| `--color-primary` | primary-500 / primary-700 | primary-500 | 主操作、导航选中、关键强调。 |
| `--color-primary-hover` | primary-700 | primary-700 / primary-300 on dark | hover 必须可感知但不改变语义。 |
| `--color-primary-active` | primary-700 / neutral-900 mix | primary-700 | active 态比 hover 更明确。 |
| `--color-accent` | accent-500 limited | accent-500 / accent-300 | Product UI 中 accent 不做主按钮色。 |
| `--color-disabled-bg` | neutral-100 / neutral-200 | neutral-100 / neutral-800 | disabled 不只靠 opacity。 |
| `--color-disabled-text` | neutral-500 | neutral-500 / neutral-400 | 必须和 enabled 文案明显不同。 |
| `--color-focus-ring` | primary-300 + outline | primary-300 / accent-300 | focus ring 不用低对比阴影替代。 |
| `--color-success` | semantic success | semantic success | 状态色只表达状态。 |
| `--color-warning` | semantic warning | semantic warning | warning 不等于品牌金色。 |
| `--color-danger` | semantic danger | semantic danger | danger 不能被 accent 替代。 |
| `--color-info` | semantic info | semantic info | 信息提示和品牌主色可相同，但需语义明确。 |

## Contrast Rules

- 普通正文和控件文字目标：至少 4.5:1。
- 大字号文本目标：至少 3:1。
- 非文本 UI 组件和图形对象目标：至少 3:1。
- 如果 palette 的 `primary-500` 或 `accent-500` 不能承载小字号文字，只能用于背景、边框、图形或大字号标题。
- `semantic_scale` 必须为状态提供可读 foreground / background 对；状态 badge 推荐用 50/100 背景 + 700 文案，或深底 + 白字并验证 contrast。
- 对比度检查必须针对最终 token 组合，不是只检查 palette 单色。

## OKLCH Guidance

- 优先用 OKLCH / LCH 思路调整色阶：先控制 lightness，再控制 chroma，最后微调 hue。
- Product UI 降低 chroma，保持 neutral 的层级和扫描效率。
- Brand Surface 可以提高 chroma，但正文、表单、按钮和导航必须回到高对比 token。
- Dark mode 不是反色：需要重新定义 bg、surface、border、text、primary、status 的 lightness。
- 同一 palette 的 50 -> 900 应保持 hue 稳定；如果 hue 需要漂移，只允许为了避免脏色或提升 contrast。

## State Derivation

| State | Derivation |
| --- | --- |
| default | primary-500 on light, primary-300 or primary-400 on dark after contrast check |
| hover | light mode 用 primary-700 或 surface-muted；dark mode 用更高 lightness 的 primary |
| active | 比 hover 更深或更高对比，不只加阴影 |
| selected | primary-50 / primary-100 背景 + primary-700 文案，或明确左边界 |
| disabled | neutral-100/200 bg + neutral-500 text；禁用态不能只靠透明度 |
| focus | outline / ring 明确可见，不能被 box shadow 和渐变淹没 |
| error | semantic danger，不用 brand / accent 替代 |

## Required Output

```md
Color system:
- Palette id:
- Design mode:
- Neutral scale:
- Primary scale:
- Accent scale:
- Semantic scale:
- Chart scale:
- Usage ratio:
- Token mapping:
- Contrast checks:
- Forbidden combinations:
```

```json
"color_system": {
  "palette_id": "minimal-tech",
  "mode": "Product UI",
  "token_mapping": {
    "background": "neutral-50",
    "surface": "neutral-50",
    "text": "neutral-900",
    "primary": "primary-500",
    "accent": "accent-500"
  },
  "usage_ratio": "neutral 75 / primary 15 / accent 5 / semantic 5",
  "contrast_checks": ["text on background >= 4.5:1", "focus ring >= 3:1"],
  "avoid": ["default enterprise blue template"]
}
```

## Source Index

| Source | URL | Used for |
| --- | --- | --- |
| WCAG 2.2 Contrast Minimum | https://www.w3.org/TR/WCAG22/#contrast-minimum | 4.5:1 normal text and 3:1 large text threshold. |
| WCAG 2.2 Non-text Contrast | https://www.w3.org/TR/WCAG22/#non-text-contrast | 3:1 UI component and graphical object threshold. |
| MDN OKLCH | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch | OKLCH syntax and lightness / chroma / hue model. |
