# Color System

本文件把 aesthetic palette seed 升级为可执行色彩系统。不要从单点 hex 直接生成 UI；先选 palette，再映射 semantic tokens，再按 design mode 套用使用比例、对比度规则和来源许可纪律。

## Six-layer Model

| Layer | 文件 | 作用 |
| --- | --- | --- |
| Source index | `references/palette-source-index.md` | 判断 Radix / Tailwind / Happy Hues / Color Hunt / ColorBrewer 等来源只能做什么，是否需要 license note。 |
| Palette library | `data/aesthetic-palettes.csv` | 每个 aesthetic direction 的 token 候选、色阶线索、使用比例、source / license note 和 avoid rules。 |
| Scale library | `data/ui-color-scales.csv` | UI 色阶来源索引，用于 Product UI、dark mode、状态色和实现侧 Tailwind / CSS variables 映射。 |
| Inspiration candidates | `data/aesthetic-palette-candidates.csv` | Happy Hues / Color Hunt / Coolors 等灵感来源，只能作为候选，不能直接散落 hex。 |
| Chart palettes | `data/chart-palettes.csv` | 图表 / 地图 / 大屏配色来源，和按钮主色、状态色分离。 |
| Usage rules | `references/palette-usage-rules.md` | Product UI / Brand Surface / Hybrid / Avatar-IP 的比例、禁用组合和审查纪律。 |

## Palette Selection Protocol

1. 先读 `references/design-mode-routing.md` 得到 `design_mode`。
2. 再根据用户选择或推荐的 aesthetic direction，从 `references/aesthetic-directions.md#Palette ID Mapping` 和 `data/aesthetic-palettes.csv` 选 `palette_id`。
3. 如果没有完全命中，选择同 mode 下最近的 palette，并记录 `palette_source: derived from <palette_id>`。
4. 不允许只复制 `primary` 单色；必须读取 background、surface、text、muted、primary、secondary、accent、border、semantic、chart、usage_ratio、contrast_notes、avoid、source 和 license_note。
5. 选定 palette 后写入 Design Contract JSON 的 `color_system`。
6. 如果 palette 来自 Happy Hues / Color Hunt / Coolors 这类灵感来源，只能写 `source_type: inspiration`；进入实现前必须由 Agent 重新映射成 semantic tokens 并做 contrast check。
7. `color_system.accessibility.contrast_checks` 必须记录实际检查结果；`requires_contrast_check: true` 不能替代 ratio / status。
8. Brand Surface / Hybrid 选择科技、Web3、AI、赛博朋克、数据感方向时，必须额外执行 de-template check：如果 palette 落入 “cyan + violet + rose + glow + glass” 的通用组合，不能直接进入实现；要换 palette 或输出 custom palette delta。

## De-template Palette Check

| 信号 | 风险 | 修正 |
| --- | --- | --- |
| `primary` 是青色、`secondary` 是紫色、`accent` 是玫红，且页面使用强 glow | 常见 AI / cyber landing 模板 | 换非默认高识别 palette，例如 obsidian-phosphor、black-white-cool、luxury 的深色改造，或生成 custom delta |
| 主按钮使用多色科技渐变 | 廉价“高级感” | 改成单色主行动、材质边框或 subtle light treatment |
| 所有强调都靠高饱和色 | 视觉疲劳且缺少品牌判断 | 降低 chroma，保留一个 signal color，其余用中性色和材质表达 |
| Web3 / 协议 / 开发者品牌只用了抽象霓虹 | 行业物件缺失 | 引入终端、协议图、网格、链路、密钥、硬件信号或数据拓扑的结构 signature |

custom palette delta 必须写入 `visual_calibration.palette_delta`，并说明从哪个默认组合偏移，不能只写“换成更高级”。

## Palette Field Mapping

| Palette 字段 | Token |
| --- | --- |
| `background` | `--color-bg` |
| `surface` | `--color-surface` |
| `surface_2` | `--color-surface-muted` |
| `text` | `--color-text` |
| `muted` | `--color-text-muted` |
| `primary` | `--color-primary` |
| `secondary` | `--color-secondary` |
| `accent` | `--color-accent` |
| `border` | `--color-border` |
| `success` | `--color-success` |
| `warning` | `--color-warning` |
| `danger` | `--color-danger` |
| `chart_1` | `--color-chart-1` |
| `chart_2` | `--color-chart-2` |
| `chart_3` | `--color-chart-3` |

## Semantic Mapping

| Token | Product UI mapping | Brand Surface mapping | Notes |
| --- | --- | --- | --- |
| `--color-bg` | palette `background` | palette `background` / dark background | 页面主背景，不用 primary 大面积铺底。 |
| `--color-surface` | palette `surface` | palette `surface` / opaque fallback | 内容容器；Brand Surface 也要保留正文可读面。 |
| `--color-surface-muted` | palette `surface_2` | palette `surface_2` / controlled accent surface | 次级背景、hover 区域。 |
| `--color-border` | palette `border` | palette `border` | 分隔和控件边界，不能低到不可见。 |
| `--color-text` | palette `text` | palette `text` | 正文必须满足 contrast。 |
| `--color-text-muted` | palette `muted` | palette `muted` only on safe surface | 辅助文字仍需可读，不能用 decorative accent。 |
| `--color-primary` | palette `primary` | palette `primary` | 主操作、导航选中、关键强调。 |
| `--color-secondary` | palette `secondary` | palette `secondary` | 次级行动或柔和强调，不能抢主操作。 |
| `--color-accent` | palette `accent` limited | palette `accent` | Product UI 中 accent 不做主按钮色。 |
| `--color-focus-ring` | derived from primary | primary / accent with contrast | focus ring 不用低对比阴影替代。 |
| `--color-success` | palette `success` | palette `success` | 状态色只表达状态。 |
| `--color-warning` | palette `warning` | palette `warning` | warning 不等于品牌金色。 |
| `--color-danger` | palette `danger` | palette `danger` | danger 不能被 accent 替代。 |
| `--color-chart-*` | chart tokens only | chart tokens only | 图表色不能直接复用按钮主色；chart token 也不能表达状态，除非图表语义就是状态。 |

## Use Rules

1. 不允许直接把 aesthetic palette 的 hex 散落到页面。
2. 必须先映射为 semantic tokens，再由 Tailwind / CSS variables / theme config 承载。
3. Product UI 中 `primary` 只能用于主行动、当前状态和关键高亮，不能大面积铺底。
4. Brand Surface 可以更强表达，但正文、按钮、表单、导航和状态色仍必须可读。
5. 深色、玻璃拟态、赛博朋克方向必须额外检查 contrast、blur fallback 和 reduced motion。
6. 图表色不能直接复用按钮主色，必须使用 `--color-chart-*`。
7. 状态色和品牌色分离：`danger` 不能做装饰红，`warning` 不能被品牌金色替代。

## Forbidden Combinations

- 不允许 “紫蓝渐变 + 玻璃 + 大圆角 + 阴影” 成为默认组合。
- 不允许 Web3 / AI / 科技品牌页默认使用 “青紫玫红霓虹 + 抽象光效 + 渐变按钮”。
- 不允许高密后台使用 5 个以上高饱和色。
- 不允许文本使用 muted 色放在彩色背景上。
- 不允许状态色和品牌色混用，例如 danger 被拿来做装饰。
- 不允许每个卡片都有不同 pastel icon background。
- 不允许在 Product UI 中把 Color Hunt / Happy Hues 的灵感色直接写进组件 class。

## Contrast Rules

- 普通正文和控件文字目标：至少 4.5:1。
- 大字号文本目标：至少 3:1。
- 非文本 UI 组件和图形对象目标：至少 3:1。
- 如果 palette 的 `primary` 或 `accent` 不能承载小字号文字，只能用于背景、边框、图形或大字号标题。
- 状态 badge 推荐用浅背景 + 深文案，或深底 + 白字并验证 contrast。
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
| default | primary on light, lighter primary on dark after contrast check |
| hover | light mode 用 primary darkening 或 surface-muted；dark mode 用更高 lightness 的 primary |
| active | 比 hover 更深或更高对比，不只加阴影 |
| selected | secondary 背景 + primary 文案，或明确左边界 |
| disabled | surface_2 bg + muted text；禁用态不能只靠透明度 |
| focus | outline / ring 明确可见，不能被 box shadow 和渐变淹没 |
| error | danger，不用 brand / accent 替代 |

## Required Output

```md
Color system:
- Palette id:
- Aesthetic direction:
- Design mode:
- Tokens:
  - background:
  - surface:
  - surface_muted:
  - text:
  - text_muted:
  - primary:
  - secondary:
  - accent:
  - border:
  - success:
  - warning:
  - danger:
  - chart:
- Usage ratio:
- Token mapping:
- Source / license note:
- Contrast checks:
- Forbidden combinations:
```

```json
"color_system": {
  "palette_id": "minimal-tech",
  "aesthetic_direction": "极简科技风",
  "design_mode": "Product UI",
  "tokens": {
    "background": "#F8FAFC",
    "surface": "#FFFFFF",
    "surface_muted": "#EEF4FF",
    "text": "#0F172A",
    "text_muted": "#64748B",
    "primary": "#2563EB",
    "secondary": "#DBEAFE",
    "accent": "#14B8A6",
    "border": "#CBD5E1",
    "success": "#16A34A",
    "warning": "#F59E0B",
    "danger": "#DC2626",
    "chart": ["#2563EB", "#14B8A6", "#7C3AED"]
  },
  "usage_rules": {
    "primary_usage": "主行动、当前状态和关键高亮；不铺满页面",
    "accent_usage": "诊断链路、局部高亮和图表辅助",
    "background_usage": "工作区保持 neutral surface",
    "avoid": ["default enterprise blue template"]
  },
  "accessibility": {
    "requires_contrast_check": true,
    "dark_mode_ready": false,
    "contrast_checks": [
      {
        "pair": "text_on_surface",
        "ratio": "12.1",
        "status": "pass"
      },
      {
        "pair": "text_muted_on_surface",
        "ratio": "4.8",
        "status": "pass"
      },
      {
        "pair": "primary_button_text",
        "ratio": "not checked",
        "status": "not-checked"
      }
    ]
  },
  "source": "Tailwind Colors",
  "source_url": "https://tailwindcss.com/docs/customizing-colors",
  "license_note": "curated token mapping; verify source license before redistribution"
}
```

## Source Index

| Source | URL | Used for |
| --- | --- | --- |
| Radix Colors | https://www.radix-ui.com/colors | Product UI 12-step UI scale、dark mode、alpha variants 和 accessible text discipline。 |
| Tailwind Colors | https://tailwindcss.com/docs/customizing-colors | Tailwind implementation scale 和 OKLCH-aware CSS variable mapping。 |
| Material 3 Color | https://m3.material.io/styles/color/overview | Brand source color -> role colors / tonal palette discipline。 |
| IBM Carbon Color Tokens | https://carbondesignsystem.com/elements/color/tokens/ | Enterprise Product UI token discipline and status color separation。 |
| Happy Hues | https://www.happyhues.co/ | Brand Surface / empty state contextual inspiration; not a full token system。 |
| Color Hunt | https://colorhunt.co/ | Aesthetic palette inspiration seed; normalize before use。 |
| ColorBrewer | https://colorbrewer2.org/ | Chart / map / dashboard palette source; prefer colorblind-safe options。 |
| Adobe Color Contrast Analyzer | https://color.adobe.com/create/color-contrast-analyzer | Contrast validation tool。 |
| Coolors | https://coolors.co/ | Human palette generation and contrast preview tool。 |
| WCAG 2.2 Contrast Minimum | https://www.w3.org/TR/WCAG22/#contrast-minimum | 4.5:1 normal text and 3:1 large text threshold. |
| WCAG 2.2 Non-text Contrast | https://www.w3.org/TR/WCAG22/#non-text-contrast | 3:1 UI component and graphical object threshold. |
| MDN OKLCH | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch | OKLCH syntax and lightness / chroma / hue model. |
