# Colors

色彩不再只给单点 hex。需要专业配色时，先读：

- `references/color-system.md`
- `references/palette-source-index.md`
- `references/palette-usage-rules.md`
- `data/aesthetic-palettes.csv`
- `data/ui-color-scales.csv`
- `data/aesthetic-palette-candidates.csv`
- `data/chart-palettes.csv`
- `contracts/color-palette.schema.json`

`foundations/colors.md` 只保存全局原则；具体 palette 从 palette library 选择，最后映射到 semantic token。

## 色彩角色

| Token | 用途 | 建议 |
|---|---|---|
| `brand` | 主操作、导航选中、关键强调 | 只占 5-10%，避免整页单色 |
| `surface` | 页面背景、容器、浮层 | 用亮度和边框区分层级，不靠大片阴影 |
| `text` | 标题、正文、辅助说明、禁用 | 至少 4 个语义层级 |
| `border` | 分隔、输入框、表格线 | 低对比但可见 |
| `success/warning/error/info` | 状态反馈 | 不与品牌色混用 |

## 色阶要求

每个进入 Design Contract 的 palette 至少包含：

- `palette_id` 和 `aesthetic_direction`
- `tokens`：background / surface / surface_muted / text / text_muted / primary / secondary / accent / border / success / warning / danger / chart
- `usage_rules`：primary、accent、background 的使用边界
- `accessibility`：contrast check / dark mode ready 标记
- `source_url` 和 `license_note`
- `avoid`：禁止组合和错误使用场景

## 去廉价感规则

- 不用大面积纯色渐变、荧光色、低透明度彩色卡片堆满页面。
- 不把所有按钮、标签、图标都染成主色。
- 状态色只服务状态，不做装饰。
- 深色模式要重做层级，不能简单反色。
- Product UI 默认 neutral >= 70%，primary <= 15%，accent <= 5%。
- Brand Surface 可以有 signature 色，但正文、表单和导航必须回到高对比 token。
- Hybrid 只允许一个 signature，工作区回到 Product UI 纪律。
- 图表色必须来自 chart tokens，不直接复用按钮主色。

## SpecForge 输出

在 `ui-design.md` 中写：

```text
Color language:
- Palette id:
- Aesthetic direction:
- Tokens:
- Usage rules:
- Accessibility:
- Source / license note:
- Contrast checks:
- Do not use:
```
