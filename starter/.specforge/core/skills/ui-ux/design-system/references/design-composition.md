# Design Composition System

资深设计不是把颜色、字体、间距、圆角、阴影和动效分别调对，而是让它们服务同一个产品气质和任务节奏。本文件定义 design-system 的组合层，避免 Agent 只会套色、堆卡片和写抽象审美词。

## 0. 来源驱动原则

Composition Recipe 必须先读 `references/composition-source-index.md`。外部系统不是用来复制视觉身份，而是用来借鉴成熟判断：字体如何建立层级，空间如何表达关系，阴影如何表达深度，动效如何表达状态，GSAP 如何只承载真正值得编排的 signature。

| 设计问题 | 成熟来源启发 | SpecForge 规则 |
| --- | --- | --- |
| Product UI 字体为什么不该像品牌海报 | IBM Carbon 把 productive / expressive type sets 分开 | 后台、审批、表格、工作台默认 productive scale；Brand Surface 才允许 expressive scale |
| 为什么不能只靠颜色做层级 | Shopify Polaris 强调用 weight、size、position 建立层级 | 标题、正文、说明、数字必须有字号 / 字重 / 位置差异；颜色只能辅助 |
| 字体为什么要和间距一起决定 | Atlassian 要求 typography tokens 与 space / color tokens 一起使用 | Composition Recipe 必须同时给 Typography、Spacing、Color；不能单独写字体表 |
| 空间为什么不是平均分布 | Fluent 2 用 spacing / proximity 表达关系和重要性 | 同组元素靠近，不同任务区拉开；必须写“哪些属于同组” |
| 阴影为什么不能乱用 | Material Design elevation 关注 surface relationship | Product UI 优先 border / tonal surface；阴影只给 overlay、drag、popover 等层级变化 |
| 顶层页面为什么不该大幅飞入 | Fluent 2 motion 建议 top-level transition 使用快速 fade，减少迷失 | 页面级切换默认 fade；列表 / 步骤才允许小幅 travel 或 stagger |
| 复杂动效如何不失控 | GSAP matchMedia 支持 responsive / reduced motion / cleanup | GSAP signature 必须写 matchMedia、reduced motion 和 cleanup / revert 策略 |

## 1. 设计组合顺序

每次设计必须按这个顺序收敛，不允许先画页面再补 token：

| 顺序 | 设计层 | 必须产出 | 失败信号 |
| --- | --- | --- | --- |
| 1 | Design mode | Product UI / Brand Surface / Hybrid / Avatar-IP / Empty State | 模式混用，后台像营销页 |
| 2 | Subject + job | 业务对象、主要使用者、主要任务 | 像任何同类模板 |
| 3 | Composition recipe | 字体、空间、圆角、阴影、动效的一体化配方 | 颜色正确但气质散 |
| 4 | Color system | palette_id、semantic tokens、contrast checks | 单点 hex 或状态色乱用 |
| 5 | Layout archetype | primary work surface、导航、滚动区 | 首屏无主任务 |
| 6 | Component language | wrapper、variants、states、density | 直接堆 primitive |
| 7 | Motion language | CSS / Motion / GSAP 层级、节奏和降级 | 装饰动效或完全无反馈 |
| 8 | Prototype handoff | 目标画板、状态、token group、组件契约和证据要求 | 原型和 design contract 脱节 |

## 2. Composition Recipe

设计方向必须落成一张组合配方表。没有这张表，不能进入 Pencil handoff。

| 字段 | 必填内容 | 示例 |
| --- | --- | --- |
| Font source | 字体来源、官方 URL、license note、fallback | system-cn-ui；不下载字体；PingFang SC -> Microsoft YaHei |
| Font pairing | 标题 / 正文 / 数字 / 代码字体组合 | system-productive-cn；数字 tabular，日志 mono |
| Typography tone | 字体气质、标题 / 正文 / 数字策略 | 克制工程感；标题 20/28，正文 14/22，数字 tabular |
| Spatial rhythm | 页面边距、section gap、卡片内边距、表格行高 | 24px page padding，16px section gap，44px table row |
| Surface treatment | 背景层级、边框、阴影、分割方式 | border-first，阴影只给 overlay |
| Radius language | 控件、卡片、浮层圆角策略 | 控件 6px，面板 8px，浮层 10px |
| Motion personality | 反馈、进入退出、列表错峰、复杂编排 | Product UI 快速克制，Brand Surface 可有 signature |
| Advanced interaction | GSAP / Three.js / R3F / TresJS 使用或禁用理由 | Product UI: none-product-ui；AI: ai-tool-trace-gsap |
| Signature carrier | 哪一层承载记忆点 | 结构 / 排版 / 材质 / 交互 / 动效，只选 1-2 个 |
| Source basis | 借鉴来源、采用点、改造点、禁止复制点 | Carbon productive type -> 本地 Product UI scale |
| Anti-reference | 明确拒绝的廉价组合 | 紫蓝渐变 + 玻璃 + 大圆角 + 卡片汤 |

### 2.1 配方族

Agent 不应该每次从零发明配方。先从以下 recipe family 选一类，再按项目品牌和业务对象微调。

| Recipe family | 适合场景 | 字体策略 | 空间策略 | 材质策略 | 动效策略 | 禁止 |
| --- | --- | --- | --- | --- | --- | --- |
| enterprise-productive | 政企后台、审批台、权限、审计 | 14px 正文、固定标题层级、数字 tabular | 24/16/12 紧凑节奏，表格 40-44px 行高 | border-first，浮层才有阴影 | hover / active / drawer / toast 短反馈 | 海报级标题、玻璃拟态、大面积渐变 |
| commerce-admin | 商家后台、订单、库存、客服 | 层级靠字号 / 字重 / 位置，不靠颜色 | 工具栏和列表优先，入口区不做大卡片汤 | 中性 surface + 少量状态色 | 状态反馈、批量操作进度 | 每个入口一个彩色 icon 背景 |
| collaboration-workflow | 协作、文档、看板、项目管理 | 正文和说明可扫描，metric / code 有专门角色 | 同组靠近，跨任务区拉开 | 分割和 hover 层级清晰 | 只解释状态和空间关系 | 所有模块等距、等权、等大小 |
| material-adaptive | 移动优先、跨端产品、轻工作台 | role-based type，正文可读性优先 | 响应式容器和 tonal 分层 | elevation 表达层级，不当装饰 | 标准进入 / 退出 / 状态变化 | 把 elevation 当廉价投影 |
| fluent-enterprise | Windows / 企业工具 / 桌面工作台 | Segoe / system 风格，稳定基线 | 4px ramp，触控场景放大目标 | layered surface，少量 acrylic-like 只用于浮层 | 顶层 quick fade，局部 choreography | 页面级大幅滑动和迷失感 |
| brand-expressive | 官网、活动页、作品集、品牌叙事 | display 与 body 对比明确，正文仍可读 | 叙事节奏，首屏露出下一段 | 材质服务主体，不全站铺同一效果 | 一个 signature moment | 每屏滚动飞入、内容空洞靠动效补 |
| ai-command | AI 工具、诊断链路、命令中心 | 数据、代码、状态文本清晰，数字强对齐 | 输入区、结果区、证据区分层 | 边框 / surface 表达工具感 | tool-call timeline、streaming、trace reveal | 抽象光效盖过业务结果 |
| protocol-brand | Web3 个人官网、协议品牌、开发者作品集 | display 强身份，body 保持可信；mono 只做协议 / 数据标签 | 大叙事段落 + 可见下一屏 + 局部数据 readout | 黑曜石 / 石墨 / 金属边界，少量磷光或铜色 signal | scroll-driven 3D / topology / protocol field | 默认青紫 AI neon、渐变按钮、与内容无关的粒子背景 |

## 3. Foundation Token Contract

Design Contract JSON 必须包含 `foundation_system`。它不是装饰说明，而是实现和 Pencil handoff 都要读取的源头。

```json
{
  "foundation_system": {
    "source_basis": [
      {
        "source": "",
        "adopt": "",
        "adapt": "",
        "avoid": ""
      }
    ],
    "typography": {
      "font_family": "",
      "scale": "",
      "line_height": "",
      "numeric": "",
      "usage_rules": []
    },
    "spacing": {
      "density": "compact",
      "grid": "4px / 8px",
      "page_padding": "",
      "section_gap": "",
      "component_gap": "",
      "usage_rules": []
    },
    "radius_shadow": {
      "radius_scale": "",
      "surface_treatment": "",
      "overlay_shadow": "",
      "usage_rules": []
    },
    "motion": {
      "motion_personality": "",
      "css_tokens": [],
      "gsap_signature": "",
      "reduced_motion": ""
    }
  }
}
```

## 4. 字体组合规则

字体不是“选一个好看的 font”，而是要建立阅读、扫描、判断和输入的秩序。

| 场景 | 字号 / 行高建议 | 字重策略 | 数字 / 代码 | 失败信号 |
| --- | --- | --- | --- | --- |
| Product UI 高频任务 | 正文 13-14px，行高 20-22px；页面标题 20-24px | 标题 600-650，正文 400，重要标签 500-600 | 指标、金额、剩余天数用 tabular；代码用 mono | KPI 很大但不可行动，说明文字小灰且承载关键信息 |
| 数据表格 / 审批 | 单元格 13-14px / 20px，行高 40-44px | 表头 500-600，正文 400 | 数值右对齐或 tabular | 表格像海报，行高过大导致首屏信息少 |
| Brand Surface | display 40px+ 可用，但 body 不低于 15-16px | display 可 650-750，body 保持舒适 | 数字可做局部 signature | 全页只有大标题 + 小灰字 |
| AI / 开发者工具 | 正文 13-14px，代码 12-13px，结果标题 16-18px | 状态和证据层级清楚 | code、metric、trace 专门角色 | 科技感标题抢走输入和结果 |

硬规则：

- 不允许只写“Inter / PingFang SC”。必须写 `scale_id`、标题 / 正文 / 说明 / 数字的字号、行高、字重和使用边界。
- 不允许把 muted 文案作为关键事实承载层；muted 只用于补充信息。
- 不允许用颜色替代字体层级；若去掉颜色，标题、正文、行动、状态仍要能区分。
- 长文本、表单说明、错误说明必须优先可读，不为品牌气质牺牲行高。

## 5. 空间组合规则

空间决定信息关系。成熟 Product UI 的关键不是“留白多”，而是知道哪里该密、哪里该松、哪里必须稳定。

| 空间层 | 必须说明 | 推荐策略 | 失败信号 |
| --- | --- | --- | --- |
| Page padding | 页面边距和最大宽度 | 后台 24-32px；品牌页 48px+；移动端单独写 | 桌面首屏像移动卡片放大 |
| Section gap | 任务区之间距离 | 同任务 12-16px，不同任务 24-32px | 所有区块同距，层级不明 |
| Panel padding | 面板内部呼吸 | Product UI 16-20px，品牌页可 24-32px | 卡片内边距比内容更抢眼 |
| Component gap | 控件、表单、列表间距 | 8/12/16px 为主，按 proximity 解释 | 按钮和字段等距乱排 |
| Row height | 表格 / 列表可扫描性 | Product UI 40-44px，移动触控更高 | 行高过大导致信息密度低 |
| Empty space budget | 首屏空白占比 | Product UI 首屏必须有主工作面 | 大空白 + KPI wallpaper |

硬规则：

- 同一视觉层级必须共享 spacing token；不要到处写一次性 px。
- 同组靠近，不同组拉开；如果不能解释 gap 的关系含义，就回到更简单布局。
- Product UI 不用“巨大留白”制造高级感，高级感来自稳定基线、可扫描信息和任务效率。
- Brand Surface 可以有叙事空间，但首屏必须露出下一段内容或明确行动。

## 6. 圆角、阴影与表面规则

圆角和阴影是层级语言，不是审美滤镜。

| 层 | Product UI | Brand Surface / Hybrid | 禁止 |
| --- | --- | --- | --- |
| Control | 4-8px；按钮、输入、标签一致 | 可随品牌略放大，但控件仍可读 | 输入 16px+ 圆角导致玩具感 |
| Panel / card | 6-10px；border-first | 10-16px 可用，但必须服务主体材质 | 卡片套卡片、每张卡都有阴影 |
| Overlay | 8-16px；阴影统一 | 可更强，但不能影响可读性 | 浮层和普通卡同层级 |
| Shadow | 页面结构不用重阴影 | signature 区域可有材质阴影 | 用阴影假装高级 |
| Tonal surface | 用浅背景区分任务区 | 可配合品牌材质 | surface 层级和背景无差别 |

硬规则：

- Product UI 默认 `product-border-first` 或同类 recipe；除 overlay、drag、popover、toast 外不使用重阴影。
- 大圆角、玻璃、渐变和阴影不能同时成为主角；如果一起出现，必须有明确品牌理由和可读性证据。
- State surface 要统一：loading、empty、error、permission 不应该各自长成不同风格。

## 7. 动效与 GSAP 组合规则

动效必须解释状态、空间关系、进度或品牌记忆。无法说明目的的动效默认删除。

| 动效层 | 用途 | Product UI 默认 | Brand / Hybrid 默认 | GSAP 边界 |
| --- | --- | --- | --- | --- |
| CSS transition | hover、active、focus、toast、drawer、菜单 | 必须有，短、稳、只动 opacity / transform / color | 必须有 | 不需要 GSAP |
| Motion Vue / React / CSS animation | enter / exit、presence、列表轻错峰 | 按需，不能妨碍扫描 | 可用于 section reveal | 普通 presence 不用 GSAP |
| GSAP timeline | 多步骤进度、AI 调用链路、滚动叙事、大屏编排 | 只用于确实需要 timeline 的流程 | 可作为唯一 signature moment | 必须写 matchMedia、cleanup、reduced motion |

硬规则：

- Product UI 页面级切换默认 quick fade；不要整页滑入、飞入、弹跳。
- 列表 stagger 的 offset 是编排节奏，不是 duration token；需要记录 offset 上限和总时长，避免列表越长越慢。
- AI / 诊断 / 导入导出这类“等待用户信任”的流程，动效应展示步骤、进度、阻塞点和结果，不展示抽象光效。
- GSAP signature 必须写：触发条件、timeline 步骤、持续时间上限、responsive matchMedia、reduced motion、cleanup / revert。

## 8. Product UI 组合原则

Product UI 的高级感来自清晰、稳定、密度和可信的层级，不来自装饰。

| 层 | 推荐 | 禁止 |
| --- | --- | --- |
| 字体 | 13-14px 正文，16-20px 页面标题，数字等宽或 tabular | 大量 display 字、负字距、过轻灰字 |
| 空间 | 4/8 网格，紧凑工具栏，稳定行高 | 大卡片包小卡片，首屏空白过大 |
| 圆角 | 控件 4-6px，卡片 6-8px，浮层 8-10px | 所有东西 16px+ 圆角 |
| 阴影 | overlay 有阴影，页面结构用边框和背景区分 | 每张卡都有重阴影 |
| 动效 | hover / active / drawer / toast 有短反馈 | 首屏元素飞入、弹跳、旋转 |
| GSAP | 只用于步骤推进、AI 调用、诊断链路、大屏编排 | 普通表单、列表、hover 全部 GSAP |

## 9. Brand Surface 组合原则

Brand Surface 可以更有表达，但仍必须有可读性和实现纪律。

| 层 | 推荐 | 禁止 |
| --- | --- | --- |
| 字体 | 明确的 display / body 对比，hero 标题有字重和行高策略 | 只有默认 Inter + 大字号 |
| 空间 | 首屏叙事节奏，下一屏有露出 | 整屏居中卡片、无内容层次 |
| 圆角 / 材质 | 和品牌材质一致，局部使用 signature | 全站统一玻璃拟态 |
| 动效 | 一个 signature moment，服务叙事 | 每个 section 都滚动飞入 |
| GSAP | timeline、scroll scene、数字 / 形态编排 | 用动效掩盖内容空洞 |

### 9.1 Brand Surface 反模板校准

Brand Surface 完成第一版实现、截图或样例板后，必须做一次反模板校准：

| 检查 | 失败信号 | 修正 |
| --- | --- | --- |
| Palette 是否过熟 | cyan + violet + rose + glow，像默认 AI 官网 | 换 `obsidian-phosphor`、`black-white-cool` 或 custom palette delta |
| Signature 是否真实 | Three.js / GSAP 只是抽象背景 | 让内容、滚动或品牌对象驱动高级交互 |
| 字体是否默认 | 只有 system font 大字号，没有 display/body/mono 分工 | 重选 font pairing 和 type scale |
| 材质是否模板 | 玻璃、渐变、阴影同时出现 | 保留一种材质主角，其余回到边框 / surface |

如果用户反馈“不好看 / AI 味 / 模板感”，按 `references/visual-calibration.md` 写 Visual Calibration，并至少调整 color、surface、motion、advanced_interaction 或 signature 中两项。

## 10. Hybrid 组合原则

Hybrid 必须分清展示面和工作面。

| 区域 | 可表达 | 必须克制 |
| --- | --- | --- |
| 展示面 | 品牌色、signature motion、情绪化插图 | 不影响任务入口 |
| 工作面 | Product UI 密度、表格、表单、状态反馈 | 不继承大面积装饰 |
| 过渡 | 轻量、短、可跳过 | 不让用户等待动效完成 |

## 11. 来源记录要求

`ui-design.md` 必须记录 Composition Source Notes。它不是论文引用，而是让后续阶段知道“为什么这样组合”。

```md
Composition Source Notes:
| 来源 | 采用 | 本地化改造 | 禁止复制 |
| --- | --- | --- | --- |
| Carbon productive type | Product UI 紧凑层级 | 映射到本项目字体和中文行高 | 复制 Carbon 视觉身份 |
| Fluent spacing / proximity | 用间距表达同组和层级 | 映射到 4/8 grid 和页面模式 | 所有 gap 一样 |
| GSAP matchMedia | 复杂 timeline 的响应式与降级 | 只用于 AI 调用链路 signature | 普通 hover 用 GSAP |
```

至少记录 2 个来源；如果使用 GSAP，必须包含 GSAP source note。

## 12. 资深审查问题

设计交付前必须自问：

- 如果去掉颜色，这个页面还像这个产品吗？
- 第一屏是否让目标用户知道下一步该做什么？
- 字体、行高、间距和圆角是否来自同一个密度档位？
- 是否只有一个 signature 主角，而不是每一层都在抢戏？
- 高级感是否来自内容结构和细节纪律，而不是渐变、玻璃、阴影和大圆角？
- 这个 Brand Surface 是否像默认 AI / cyber 模板？如果是，palette、材质或 signature 必须重做。
- 动效是否能说明状态、空间关系、进度或品牌记忆？
- Pencil handoff 是否明确同一套 token group、组件契约和证据要求，而不是让原型阶段重新猜？

## 13. 输出要求

`ui-design.md` 必须包含：

```md
Composition Recipe:
| 层 | 选择 | 理由 | 禁止 |
| --- | --- | --- | --- |
| Font Source | | | |
| Font Pairing | | | |
| Typography | | | |
| Spacing | | | |
| Radius / Shadow | | | |
| Motion | | | |
| Advanced Interaction | | | |
| Signature | | | |
```

并且必须包含：

```md
Composition Source Notes:
| 来源 | 采用 | 本地化改造 | 禁止复制 |
| --- | --- | --- | --- |
| | | | |
```

如果本轮是 Product UI，还必须和 `Product UI Layout Audit` 一起输出；如果本轮需要 `.pen` 或视觉证据，必须把同一套 recipe 写入 Pencil handoff requirements。
