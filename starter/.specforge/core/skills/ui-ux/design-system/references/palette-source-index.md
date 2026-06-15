# Palette Source Index

本文件回答“配色从哪里来、能当什么证据、不能怎么用”。不要把外部 palette 的 hex 批量复制进设计系统；先记录来源角色，再归一化为 SpecForge 的 semantic tokens。

## Source Categories

| Source type | Sources | Use as | Notes |
| --- | --- | --- | --- |
| UI color scales | Radix Colors、Tailwind Colors、Material 3、IBM Carbon | base scales / role discipline | 用来建立 neutral、primary、accent、status 的系统性，不直接替代业务 token。 |
| Inspiration palettes | Happy Hues、Color Hunt、Coolors | aesthetic candidates | 只做灵感种子；必须经过 token mapping、contrast check 和 license note。 |
| Accessibility / chart palettes | ColorBrewer、Adobe Color、Coolors contrast checker | validation / chart tokens | ColorBrewer 优先服务 chart / map，不做按钮主色来源。 |
| Brand / trend references | Adobe Color、Coolors、品牌 guideline | human exploration | 只在用户要求品牌表达或提供品牌色时使用。 |

## Source Index

| Source | Best for | Use as | Notes |
| --- | --- | --- | --- |
| Radix Colors | Product UI / dark mode / accessible UI states | base color scale | 12-step scales、light/dark、alpha variants，适合 app token 基座。 |
| Tailwind Colors | Tailwind implementation / OKLCH scales | implementation scale | 适合把 semantic tokens 落到 Tailwind utilities / CSS variables。 |
| Material Theme Builder | brand-to-tonal palette | generated role-color model | 适合用户给品牌色时推导 Material 3 role tokens。 |
| IBM Carbon Colors | enterprise Product UI | token discipline reference | 适合政企、管理端、严肃 Product UI 的状态色和主题纪律。 |
| Happy Hues | Brand Surface / landing / illustration | contextual inspiration | 看颜色在页面角色里的用法，不作为完整 UI token 系统。 |
| Color Hunt | aesthetic candidates | inspiration seed | 常见 Pastel / Vintage / Retro / Neon / Nature 等方向；必须归一化。 |
| Coolors | quick generation / image picker / contrast preview | human tool | 可用于人工生成候选，再导入 CSV；不要跳过 license note。 |
| Adobe Color | accessibility and harmony checks | validation tool | 用于对比度和配色关系校验，不替代最终 token contract。 |
| ColorBrewer | charts / maps / dashboards | chart palette source | 优先选择 colorblind-safe 的 sequential / diverging / qualitative。 |

## License Discipline

- `data/aesthetic-palettes.csv` 中的 `source`、`source_url`、`license_note` 必填。
- 外部 palette 的原始 hex 只能作为灵感或校验输入；进入项目时必须是 SpecForge curated token mapping。
- 如果要批量复制某个外部色表，先查该来源的 license，并在 `license_note` 写清楚可分发依据。
- 未确认 license 的来源只能写 `inspiration only`，不能作为可再分发事实数据。
- Chart palette 如果来自 ColorBrewer，要记录 attribution / license 检查结果；不要把 chart 色拿去做 Button primary。
