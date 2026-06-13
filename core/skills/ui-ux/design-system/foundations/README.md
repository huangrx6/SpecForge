# Foundations

Foundations 是设计语言的最小事实源。不要一上来写页面，先确认这些基础层：

| 文件 | 回答的问题 |
|---|---|
| `tokens.md` | CSS variables、Tailwind theme、Pencil variables 和语义 token |
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

## 最小输出

每次被 `sf-ui-design` 调用时，至少输出：

- 设计方向：Product UI / Brand Surface / Hybrid。
- 语义 token：primary、surface、text、border、state、focus。
- 密度档位：compact / comfortable / expressive，并说明适用页面。
- 组件气质：圆角、边框、阴影、图标和按钮高度。
- 动效边界：哪些用 CSS transition，哪些允许 GSAP，哪些禁止动效。
- 人工确认：已确认 / 待确认 / 低风险默认。
