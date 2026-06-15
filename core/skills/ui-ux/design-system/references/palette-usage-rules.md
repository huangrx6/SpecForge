# Palette Usage Rules

本文件规定 palette 在不同 design mode 中怎么用。它的目标是让 Agent 不乱配色：Product UI 克制、Brand Surface 可表达、Hybrid 有一个 signature、Avatar-IP 不污染主系统 token。

## Mode Discipline

| Design mode | Neutral | Primary | Accent | Semantic | Signature / media | Rule |
| --- | --- | --- | --- | --- | --- | --- |
| Product UI | >= 70% | <= 15% | <= 5% | <= 5% | optional <= 5% | 低饱和 neutral + 克制 primary；状态色只表达状态。 |
| Brand Surface | >= 45% | <= 25% | <= 20% | <= 5% | <= 15% | 可以有强 signature，但正文和表单区域必须回到高对比 token。 |
| Hybrid | >= 60% | <= 15% | <= 10% | <= 5% | <= 10% | Product UI 的信息纪律 + Brand Surface 的一个 signature。 |
| Avatar-IP / Empty State | >= 55% | <= 15% | <= 20% | <= 10% | scoped | 只影响空态、头像、IP 或低频入口，不写入全局控件 token。 |

## Source Discipline

- `source`、`source_url`、`license_note` 是 palette contract 的一部分，不是备注。
- Radix / Tailwind / Material / Carbon 可作为 UI 色阶和角色色纪律来源；外部色值进入项目前仍要归一化为本仓库 token。
- Happy Hues / Color Hunt / Coolors 只能作为 aesthetic candidate；不能直接把它们的 hex 写入页面或组件 class。
- ColorBrewer 只优先进入 `--color-chart-*`；不要把 chart palette 拿去做 Button primary 或状态色。
- License 不确定时写 `inspiration only`，并在 Design Contract 中记录需要人工确认。

## Product UI Rules

- neutral 占页面 70% 以上；表格、表单、审批、配置、审计默认 75-85%。
- primary 只用于主操作、当前导航、焦点和关键强调，不染满 icon、badge、卡片和背景。
- accent 不超过 5%，只用于辅助识别、局部提示或 signature。
- semantic 色只表达 success / warning / danger / info，不用于装饰。
- 表格 hover、selected、active 使用 neutral / primary 的浅层，不用彩色块堆叠。
- 禁止：高饱和整页背景、玻璃拟态覆盖正文、渐变按钮泛滥、状态色当品牌色。

## Brand Surface Rules

- 可以使用强 accent、渐变、氛围色和媒体色，但正文阅读区必须有 neutral surface。
- 首屏 signature 可以强，但 CTA、表单、导航、页脚仍要满足 contrast。
- 不允许全页面高饱和；高 chroma 区域要有留白或 neutral 间隔。
- Brand Surface 的色彩不能直接迁移到后台控件；最多迁移一个 signature token 或局部图形语言。
- 渐变必须服务叙事、品牌物件或空间关系，不做无意义“高级感”背景。

## Hybrid Rules

- 先拆区域：展示入口 / AI 欢迎 / 空态可以更有表达；工作区、表格、表单回到 Product UI 纪律。
- 只允许一个 signature：色彩、排版、材质、动效或插画选一个主角。
- 共享 token 要说明：哪些来自 Product UI，哪些来自 Brand Surface，哪些只在入口区使用。
- AI 助手、工作台首页和低频入口可以更有记忆点，但不能干扰主任务、状态识别和可访问性。

## Avatar-IP / Empty State Rules

- IP / 插画 palette 只在 avatar、empty state、onboarding、low-frequency entry 生效。
- 不把插画中的高饱和色写进按钮、表格、导航和状态色。
- 空态必须有恢复路径：下一步操作、权限解释、筛选清除或重试。
- 同一系统中最多保留一个 IP 主色系，避免每个空态都像不同素材库。

## Forbidden Combinations

| Combination | Why | Fix |
| --- | --- | --- |
| accent text on accent-50 without contrast check | 容易低对比 | 使用 accent-700 或 neutral-900，并验证 contrast。 |
| warning gold as brand primary | 状态语义混乱 | warning 只保留给状态，brand 用 primary scale。 |
| danger red used for decorative emphasis | 削弱错误识别 | 装饰改用 accent，danger 只用于风险/删除/失败。 |
| Brand gradient behind forms | 表单可读性和焦点差 | 表单放 neutral surface，gradient 只做外部背景。 |
| Dark mode by inversion | 层级和 chroma 失控 | 重新映射 neutral、surface、border、text、primary。 |
| Pastel icon grid in Product UI | 缺少任务优先级 | 改为状态指标、任务分组、table、timeline 或 command surface。 |

## Verification Checklist

| Check | Evidence |
| --- | --- |
| Palette completeness | neutral / primary / accent / semantic / chart 色阶齐全 |
| Token completeness | background / surface / text / primary / secondary / accent / border / status / chart tokens 齐全 |
| Source evidence | source_url 和 license_note 已写入 Design Contract JSON |
| Mode match | palette mode 与 Design Mode Routing 一致 |
| Usage ratio | Product UI neutral >= 70%；Brand Surface 高 chroma 有 neutral 阅读区 |
| Contrast | 正文 4.5:1，large text 3:1，UI component 3:1 |
| State coverage | hover / active / selected / disabled / focus / error 已映射 |
| Dark mode | 有明确 dark mode token 或写 N/A 理由 |
| Forbidden combinations | avoid rules 已进入 Design Contract JSON |
