# Composition Source Index

本文件记录 Composition Recipe 的一手参考来源和 SpecForge 转译方式。不要照搬外部系统的品牌样式、数值和组件名称；只吸收可迁移的结构原则。

## Source Matrix

| Source | 适合借鉴 | 关键启发 | SpecForge 转译 |
| --- | --- | --- | --- |
| Material Design 3 Typography | type roles、层级、large / medium / small scale | 字体不是单个字号表，而是一组表达层级和内容用途的 roles | `type-scales.csv` 必须区分 page title、section title、body、caption、metric |
| Material Design 3 Motion | easing、duration、进入退出、状态变化 | 动效要跟运动方向、屏幕关系和状态目的绑定 | `motion-recipes.csv` 必须写 motion purpose 和 reduced motion |
| Material Design 3 Elevation | elevation level、tonal elevation、surface relationship | 深度是组件关系，不是装饰阴影 | `radius-shadow-recipes.csv` 中 Product UI 优先 border / tonal surface，阴影只给 overlay |
| IBM Carbon Typography | productive / expressive type sets | Product UI 和品牌表达应该使用不同 type strategy；Productive 更适合任务密集界面 | `product-compact`、`enterprise-productive` 使用固定、紧凑、任务导向的 type scale |
| IBM Carbon Spacing | 2 / 4 / 8 倍数 spacing scale | 间距 token 同时服务组件内部和组件之间的布局关系 | spacing recipe 必须区分 component gap、section gap、page padding |
| Atlassian Typography | typography tokens 与 space / color tokens 共同使用 | 字体不能脱离 spacing 和 color 单独设计；metric / code 需要专门角色 | Composition Recipe 必须同时写 Typography、Spacing、Color，并支持 metric / code rules |
| Shopify Polaris Typography | 用 weight、size、position 建立层级，不只靠颜色 | Product UI 文字层级要服务扫描和任务，不要用颜色假装层级 | `Color-only design` detector 直接拦截只调色不调排版 |
| Shopify Polaris Tokens | semantic text / space token | primitive token 不够，Product UI 需要语义 token 对应组件用途 | `foundation_system` 使用 semantic fields，不只输出 raw px |
| Fluent 2 Layout | spacing / proximity、global spacing ramp、grid | 空间表达信息关系；同距暗示同组和同权重 | spacing recipe 必须说明哪些元素属于同组，哪些用更大 gap 拉开层级 |
| Fluent 2 Motion | enter/exit、elevation、top-level transition、stagger、hierarchy | 动效有 choreography：先后顺序和重要性必须可解释 | motion recipe 必须说明 hierarchy、stagger offset、top-level 是否只 fade |
| Apple HIG Typography / Motion | legibility、hierarchy、accessibility、reduced motion | 自定义字体和动效不能损害可读性、动态字体和可访问性 | Brand Surface 可以 expressive，但正文和控件必须回到可读 token |
| GSAP matchMedia | responsive animation、reduced motion、cleanup | 复杂 timeline 必须能按 media query 和 reduced motion 自动重建 / 回收 | GSAP signature 必须写 matchMedia / cleanup / reduced motion 策略 |

## Transfer Rules

| 外部原则 | 不要照搬 | SpecForge 应该怎么写 |
| --- | --- | --- |
| Carbon productive / expressive | 不要把 IBM Plex 和 Carbon token 全套复制进项目 | 写成 Product UI / Brand Surface 两类 type strategy |
| Polaris semantic token | 不要复制 Shopify Admin 的品牌风格 | 建立 `text-*`、`space-*`、`height-*` 等语义 token |
| Fluent spacing ramp | 不要机械使用同一个 gap | 说明 proximity：哪些更近表示同组，哪些更远表示层级 |
| Material elevation | 不要把阴影当高级感 | 写 surface relationship：border、tonal surface、overlay shadow |
| Apple motion | 不要靠大幅运动制造记忆点 | 写可读性、reduced motion、状态不丢失 |
| GSAP timeline | 不要给普通控件套 GSAP | 只用于有状态过程或品牌 signature 的 timeline，并写 cleanup |

## Design Mode Source Routing

不同模式优先借鉴不同来源。不要在后台管理端优先借鉴品牌页，也不要把 Product UI 的密度直接套到品牌叙事页。

| Design mode | 优先来源 | 借鉴重点 | 必须本地化 | 不要借鉴 |
| --- | --- | --- | --- | --- |
| Product UI | IBM Carbon、Shopify Polaris、Atlassian、Fluent 2 | productive type、semantic token、spacing proximity、稳定控件层级 | 中文行高、业务对象、表格 / 表单密度、状态矩阵 | Hero display、滚动叙事、全站材质特效 |
| Brand Surface | Material、Apple HIG、Happy Hues 类上下文灵感、Fluent motion | type contrast、首屏叙事、可读性、一个 signature moment | 正文可读性、按钮 / 表单 token、响应式首屏 | Product UI 的过度压缩、无情绪的默认后台结构 |
| Hybrid | Material adaptive、Fluent layout、Apple motion、GSAP matchMedia | 展示面 / 工作面分区、跨端适配、短反馈、复杂 timeline 降级 | 明确哪些区域 expressive，哪些回到 Product UI | 把展示面装饰带进表格 / 表单 |
| Avatar-IP | Apple legibility、Material motion、Brand Surface 灵感 | 局部亲和力、空态情绪、角色动效 | 不污染主系统 token，只影响空态 / 头像 / 引导 | 玩具质感扩散到权限、审计、订单等严肃流程 |
| Empty State | Polaris / Atlassian 状态文案、Material motion | 恢复动作、原因说明、低负担插图 | 用业务语言写可恢复路径 | 只有插画，没有下一步 |

## Recipe Construction Checklist

每个 Composition Recipe 至少回答这些问题：

| 层 | 检查问题 | 通过标准 |
| --- | --- | --- |
| Typography | 去掉颜色后，标题、正文、说明、数字是否仍可区分？ | 有 scale_id、字号、行高、字重、numeric 规则 |
| Spacing | 哪些元素是同组，哪些是跨任务区？ | 有 page padding、section gap、component gap、row height 和 proximity 理由 |
| Surface | 哪些是普通层，哪些是 overlay，哪些是 selected / active？ | 有 radius / border / shadow recipe，阴影不被滥用 |
| Motion | 动效说明反馈、空间关系、进度还是品牌？ | 有 motion_id、CSS / Motion / GSAP 层级和 reduced motion |
| GSAP | 复杂 timeline 是否真的需要？ | 有触发条件、总时长上限、matchMedia、cleanup 和降级策略 |
| Color | palette 是否映射到 semantic tokens？ | 有 palette_id、usage rules、contrast checks、状态色边界 |

## 常见错误转译

| 错误写法 | 为什么不够 | 修正写法 |
| --- | --- | --- |
| “参考 Carbon，做高级后台” | 没有说借鉴点和本地化 | “借鉴 Carbon productive type 的紧凑层级；用 system/PingFang 字体、14/20 正文、40px 表格行高；不复制 IBM 品牌视觉” |
| “用 Fluent 动效” | Fluent 不是一个动效滤镜 | “页面级 quick fade；局部步骤使用 40ms stagger offset；不做大幅 travel” |
| “GSAP 做高级感” | GSAP 只是编排工具 | “GSAP 只用于 AI 调用链路 timeline；`matchMedia` 处理桌面 / 移动 / reduced motion；unmount cleanup” |
| “Apple 风，更精致” | Apple HIG 的核心是可读性、层级和系统一致性 | “Brand Surface 标题可更 expressive，但正文 / 按钮 / 表单回到可读 token；reduced motion 下保留最终状态” |
| “Material elevation” | elevation 不是卡片阴影套装 | “普通 panel 用 tonal surface + border；popover / dialog 才用 overlay shadow” |

## Required Evidence In UI Design

```md
Composition Source Notes:
| Source | Adopt | Adapt | Avoid |
| --- | --- | --- | --- |
| Carbon productive type | product density | map to local font stack | copy Carbon visual identity |
| Fluent spacing/proximity | grouping and hierarchy | map to 4/8 grid | same gap everywhere |
| GSAP matchMedia | responsive timeline cleanup | use in signature only | animate every hover |
```

## Source URLs

| Source | URL |
| --- | --- |
| Material Design 3 Typography | https://m3.material.io/styles/typography/overview |
| Material Design 3 Motion | https://m3.material.io/styles/motion/easing-and-duration |
| Material Design 3 Elevation | https://m3.material.io/styles/elevation |
| IBM Carbon Typography | https://carbondesignsystem.com/elements/typography/overview/ |
| IBM Carbon Spacing | https://carbondesignsystem.com/elements/spacing/overview/ |
| Atlassian Typography | https://atlassian.design/foundations/typography/applying-typography |
| Shopify Polaris Typography | https://polaris-react.shopify.com/design/typography |
| Shopify Polaris Layout Tokens | https://polaris-react.shopify.com/design/layout/layout-tokens |
| Fluent 2 Layout | https://fluent2.microsoft.design/layout |
| Fluent 2 Motion | https://fluent2.microsoft.design/motion |
| Apple HIG Typography | https://developer.apple.com/design/human-interface-guidelines/typography |
| Apple HIG Motion | https://developer.apple.com/design/human-interface-guidelines/motion |
| GSAP matchMedia | https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/ |
