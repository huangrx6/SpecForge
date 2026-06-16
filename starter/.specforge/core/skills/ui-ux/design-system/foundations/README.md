# Foundations

Foundations 是设计语言的最小事实源。不要一上来写页面，先确认这些基础层：

| 文件 | 回答的问题 |
|---|---|
| `tokens.md` | CSS variables、Tailwind theme、Pencil variable hints 和语义 token |
| `colors.md` | 色彩角色、状态色、对比度和品牌 / 业务语义 |
| `typography.md` | 字体层级、数字、表格、标题和长文案规则 |
| `spacing.md` | 栅格、密度、间距节奏和响应式断点 |
| `density.md` | 后台、H5、展示页、大屏的密度档位和控件尺寸 |
| `radius-shadow.md` | 圆角、边框、阴影、层级和浮层质感 |
| `motion.md` | 动效目的、时长、缓动和禁用边界 |
| `accessibility.md` | 对比度、焦点、键盘、语义和错误提示 |
| `iconography.md` | 图标风格、尺寸、线宽、颜色和按钮内图标规则 |
| `content.md` | 微文案、错误提示、空态、按钮命名和字段说明 |
| `data-visualization.md` | 指标、图表、颜色编码和空值处理 |
| `responsive.md` | 移动、桌面、宽屏和表格折叠策略 |

输出时只写当前项目需要的 token，不要生成一整套没人维护的设计系统。

## 组合优先

Foundations 必须一起选择，不要只选颜色。每次进入页面设计前先读 `references/composition-source-index.md` 和 `references/design-composition.md`，并从以下数据表选择或派生一套组合配方：

| 数据源 | 用途 |
|---|---|
| `references/design-system-orchestration.md` | 串联 mode、source、font、color、composition、advanced interaction、component、QA 和 output |
| `references/composition-source-index.md` | 记录 Material、Carbon、Polaris、Atlassian、Fluent、Apple、GSAP 等来源的可迁移原则 |
| `references/font-source-index.md` | 字体官方来源、国内可访问优先级、系统字体栈和许可边界 |
| `data/font-pairing-recipes.csv` | 字体来源、标题 / 正文 / 数字 / 代码搭配 |
| `data/type-scales.csv` | 字体家族、字号、行高、数字规则 |
| `data/spacing-density-scales.csv` | 页面 padding、section gap、控件高度、表格行高 |
| `data/radius-shadow-recipes.csv` | 圆角、边框、阴影、材质层级 |
| `data/motion-recipes.csv` | CSS / Motion / GSAP 层级和 signature motion |
| `references/advanced-interaction-source-index.md` | GSAP、Three.js、React Three Fiber、Drei、TresJS 的使用边界 |
| `data/advanced-interaction-recipes.csv` | 高级交互 recipe、fallback、reduced motion 和验证方式 |

这套配方必须写入 `Design Contract JSON.scan_manifest` 和 `Design Contract JSON.foundation_system`，其中 `source_basis` 至少记录 2 个来源的采用、改造和禁止复制项；需要 `.pen` 或视觉证据时，同步输出 Pencil handoff requirements。

## 最小输出

每次被 `sf-ui-design` 调用时，至少输出：

- 设计方向：Product UI / Brand Surface / Hybrid。
- 语义 token：primary、surface、text、border、state、focus。
- 扫描清单：scanned files、selected data、跳过理由。
- 组合配方：font source、font pairing、typography、spacing、radius / shadow、motion、signature carrier。
- 密度档位：compact / comfortable / expressive，并说明适用页面。
- 组件气质：圆角、边框、阴影、图标和按钮高度。
- 动效边界：哪些用 CSS transition，哪些允许 GSAP / Three.js / R3F / TresJS，哪些禁止动效。
- 人工确认：已确认 / 待确认 / 低风险默认。
