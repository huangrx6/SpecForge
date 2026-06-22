# Foundation System

本文件把颜色、字体、空间、密度、圆角、阴影和图标收束为同一套可实现基础系统。不要只换 palette 或只调间距；视觉语言必须能落到 CSS variables、Tailwind theme、shadcn-vue theme、Pencil variable hints 和 Design Contract JSON。

## Token Strategy

三层 token 一起选：Semantic（`--color-bg-page`、`--color-text-primary`、`--color-border`）面向业务语义和跨组件复用；Component（`--button-height-md`、`--table-row-height`）面向 project wrapper 和复用组件；State（`--color-danger`、`--color-success`、`--color-focus`）面向状态反馈和可访问性。

Tailwind v4 用 `@theme` 暴露语义 token；shadcn-vue theme 只作为 primitive 基座；业务页面禁止大量 arbitrary value。design-system 只输出 Pencil variable hints，实际变量创建、绑定、截图和保存验证由 `core/skills/ui-ux/pencil` 执行。

## Color System

专业配色在本包内完成，不再读取独立 color reference。不要从单点 hex 直接生成 UI；先选 palette，再映射 semantic tokens，再按 design mode 做使用比例、对比度、许可和去模板判断。

Source stack：`data/aesthetic-palettes.csv` 提供 palette id、tokens、usage ratio、source / license、avoid；`data/color-support.csv` 提供 neutral / primary / accent / status 色阶纪律，并分离图表 / 地图 / 大屏配色和按钮主色；`data/reference-source-catalog.csv` + `references/reference-workflow.md` 只把外部 palette 作为 reference evidence 或 validation source；`contracts/design-contract.schema.json#color_system` 定义 color contract shape。

Selection protocol：先读 `references/read-profiles.md#Design Mode Routing` 得到 `design_mode`；根据 `references/creative-direction.md#Palette ID Mapping` 和 `data/aesthetic-palettes.csv` 选 `palette_id`；没有完全命中时选择同 mode 下最近 palette，并写 `palette_source: derived from <palette_id>`；从 palette row 读取 background、surface、text、muted、primary、secondary、accent、border、status、chart、usage_ratio、contrast_notes、avoid、source 和 license_note；外部 palette 原始 hex 只能作为灵感或校验输入，进入项目前必须归一化为 SpecForge semantic tokens，并记录 `source_url`、`license_note` 和 contrast checks；最终写入 Design Contract JSON 的 `color_system`。

Semantic mapping：background -> `--color-bg`；surface / surface_2 -> `--color-surface` / `--color-surface-muted`；text / muted -> `--color-text` / `--color-text-muted`；primary / secondary / accent -> action 和 emphasis；border -> control / divider；success / warning / danger -> state；chart_1/2/3 -> chart only。Product UI 中 accent 不做主按钮色，chart 色不直接复用按钮主色。

Usage discipline：Product UI neutral >= 70%、primary <= 15%、accent <= 5%、semantic <= 5%，状态色只表达状态，primary 只用于主操作、当前导航、焦点和关键强调；Brand Surface neutral >= 45%、primary <= 25%、accent <= 20%、signature / media <= 15%，正文、表单、导航、页脚回到高对比 token；Hybrid neutral >= 60%、primary <= 15%、accent <= 10%，展示入口和工作区分开且只允许一个 signature；Avatar-IP / Empty State 只影响局部角色、空态、onboarding，不污染按钮、表格、导航。

De-template check：cyan + violet + rose + glow + glass 时换 `obsidian-phosphor`、`black-white-cool`、深色 luxury 改造或 custom delta；多色科技渐变主按钮改成单色主行动、材质边框或 subtle light treatment；所有强调都靠高饱和色时降低 chroma，只保留一个 signal color；Web3 / AI / 科技品牌只有抽象霓虹时，引入终端、协议图、网格、链路、密钥、硬件信号或数据拓扑。

Contrast and OKLCH：普通正文和控件文字至少 4.5:1；大字号和非文本 UI 对象至少 3:1。primary / accent 不能承载小字号文字时，只能用于背景、边框、图形或大字号标题。对比度检查必须针对最终 token 组合。优先用 OKLCH / LCH 调整色阶：先 lightness，再 chroma，最后 hue。Dark mode 不是反色；需要重新定义 bg、surface、border、text、primary、status 的 lightness。

Color blockers：单点 hex 散落页面；Product UI 大面积 primary；accent 做主按钮；状态色被品牌色替代；图表色复用按钮主色；高密后台 5 个以上高饱和色；muted 文本在彩色背景上承载关键事实；只有 palette 没有字体、空间、圆角阴影和 motion recipe。

## Typography

字体决定阅读速度、信息密度、数字可信度和品牌气质。先读 `references/design-composition.md#Font Source Discipline`，再从 `data/foundation-recipes.csv` 的 `recipe_type=font_pairing` 和 `recipe_type=type_scale` 选择 `font_pairing_id` 与 `scale_id`。

Source defaults：后台 / 管理端 / 表格用 `system-cn-ui` + `system-productive-cn`；政企 / Windows 内网用 `system-cn-windows`；AI / 数据 / 开发者工具用 `system-cn-ui` + `system-mono`；科技品牌 / 移动端用 `harmonyos-sans` 或 `misans`；活动 / 专题 / 品牌叙事用 display font + system body，display 只做标题，不进正文。

规则：Product UI 默认不用下载字体；外部字体记录官方 URL、license note、fallback；表格和密集数据优先 13-14px；中文界面避免负字距；字重最多 regular / medium / semibold；mono 只用于 ID、日志、代码、数值证据；muted 文案不能承载关键事实、错误、权限和金额。

## Spacing And Density

空间、密度、栅格、断点和触控目标必须一起选，不能只把内容“放开一点”。先从 `data/foundation-recipes.csv` 的 `recipe_type=spacing_density` 选择 `spacing_density_id`，再决定 padding、gap、控件高度、表格行高和触控目标。

- `compact`：运营后台、表格、配置台、审批台；28-32px 控件；列表优先，筛选紧凑，卡片少用。
- `comfortable`：常规 SaaS、工作台、AI 助手、业务表单；36-40px 控件；信息清晰，主任务突出。
- `expressive`：品牌页、会员中心、活动页、直播间；40-48px 控件；媒体和动效可以更强。
- `command`：命令面板、快捷工具、搜索选择；36-44px 控件；键盘路径、分组和最近使用明显。

表格页默认 compact，除非触控或现场操作需要加大目标。H5 触控目标不小于 44px；PC 工具栏按钮不小于 28px。

| Token | Compact | Comfortable | 用途 |
| --- | --- | --- | --- |
| `--space-page-x` | `24px` | `32px` | 桌面页面左右边距 |
| `--space-section` | `16px` | `24px` | 主要区块间距 |
| `--space-panel` | `16px` | `20px` | 面板 / 卡片内边距 |
| `--space-card-gap` | `12px` | `16px` | 同组卡片或控件间距 |
| `--height-toolbar` | `44px` | `52px` | 工具栏高度 |
| `--height-control` | `32px` | `36px` | 输入框 / 按钮高度 |
| `--height-table-row` | `40px` | `44px` | 表格行高 |
| `--width-sidebar` | `240px` | `260px` | PC 侧栏宽度 |

Layout rules：基础间距使用 4 / 8 的倍数。同一页面只允许一个主密度；侧栏、表格、表单和卡片不能各用一套节奏。页面边距、表单列宽、表格列宽要有稳定规则。卡片只服务重复对象，不当页面 section 容器。Product UI 第一屏空白 framed area 不能超过 40%，且必须服务扫描、分组或状态；Brand Surface 的大留白不能直接带到后台工作区。

Responsive strategy：`mobile` 单列、底部操作、触控优先；`tablet` 双列或折叠侧栏；`desktop` 主工作区、表格、筛选、批量操作；`wide` 大屏 dashboard、监控、数据对比。窄屏表格要说明列裁剪、卡片化或横向滚动策略；主操作不能因断点隐藏到不可发现的位置；筛选折叠后必须显示已选条件数量。

## Radius, Shadow, Iconography

先从 `data/foundation-recipes.csv` 的 `recipe_type=radius_shadow` 选择 `radius_shadow_recipe_id`。Product UI 的质感通常来自边框、背景层级和稳定密度，不来自厚重阴影。

Product UI 默认：control radius 4-6px，panel radius 6-8px，overlay radius 8-10px，card shadow none，overlay shadow only。超大圆角、玻璃材质和厚重阴影只用于 Brand Surface、Avatar-IP 或特殊 signature；同一页面不要同时使用粗边框、重阴影、半透明材质和大圆角。

Vue / shadcn-vue 项目优先使用 lucide-vue-next 或项目已有图标库。同一页面只使用一种图标风格；工具按钮优先 icon-only + tooltip；状态图标必须配文字。

## Output

写入 `Design Contract JSON.color_system`、`foundation_system.typography`、`foundation_system.spacing`、`foundation_system.radius_shadow`、`token_delivery_hint` 和 `scan_manifest.selected_data`。字段结构由 schema 和 `references/output-contract.md` 管，本文件只给选择依据。

Markdown 只输出 Foundation System 短摘要：Palette id / source / license、Usage ratio / contrast checks / avoid、Font source / pairing / scale、Density / layout rules、Radius-shadow recipe、Icon set、Semantic tokens、Pencil variable hints、Do not use。
