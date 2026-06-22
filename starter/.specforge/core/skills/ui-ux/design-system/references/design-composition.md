# Design Composition

资深设计不是分别调颜色、字体、间距、圆角、阴影和动效，而是让它们服务同一个产品气质和任务节奏。本文件只负责组合决策；具体 token 细节进入 `foundations/*.md` 和 `data/*.csv`，输出字段进入 schema / `references/output-contract.md`。

## 1. Source Discipline

外部系统不是风格库，而是成熟判断来源。只能借鉴原则，不能复制品牌身份、组件命名、数值或视觉资产。

组合判断：Product UI vs Brand Surface 可借 Carbon productive / expressive type 和 Apple legibility，但高频工作面默认 productive；层级不能只靠颜色，Typography、Spacing、Color 必须一起选；空间关系借 Fluent proximity / choreography，同组靠近、跨任务区拉开，motion 解释状态和空间；表面和阴影借 Material elevation，但 Product UI border-first，阴影只给 overlay / drag / popover；GSAP signature 必须写 responsive、reduced motion、cleanup / revert。

Transfer rules：Product UI 优先 IBM Carbon、Polaris、Atlassian、Fluent 2 的工作面原则；Brand Surface 优先 Material、Apple HIG、Fluent motion 和上下文灵感；Hybrid 必须拆展示面 / 工作面。至少记录 2 个 `source_basis`：source、adopt、adapt、avoid。

## 2. Font Source Discipline

中文 UI 优先可访问、可授权、可实现、可回退。Product UI 默认系统字体栈；品牌页或混合入口才考虑外部字体。

Source priority：系统内置字体栈和官方开源 / 官方发布字体为 A；大厂公开字体为 B，必须从官方入口确认授权；字体聚合站 / 文章推荐为 C，只能做灵感发现；盗链、网盘、未注明授权为 D，禁止写入设计契约、下载或内置。

字体 id、pairing 和使用场景见 `foundations/foundation-system.md` 与 `data/foundation-recipes.csv` 的 `font_pairing` / `type_scale`。阻断条件：无官方 URL 却要求下载字体；无 license note 却要求内置字体文件；Product UI 用海报字体做正文；只写“高级字体 / 中文字体 / 品牌字体”。

## 3. Composition Flow

每次设计按这个顺序收敛，不允许先画页面再补 token：

Order：Design mode -> Subject + job -> Composition recipe -> Color system -> Layout archetype -> Component language -> Motion language -> Prototype handoff。每一步都要产出对应证据：mode、业务对象 / 使用者 / 任务、字体空间圆角阴影动效配方、palette / semantic tokens / contrast、primary work surface、wrapper / variants / states / density、motion layer / fallback、Pencil 画板 / 状态 / token group / 组件契约。失败信号分别是模式混用、像任何模板、颜色正确但气质散、单点 hex、首屏无主任务、直接堆 primitive、装饰动效、原型和 contract 脱节。

## 4. Composition Recipe

没有 Composition Recipe，不能进入 Pencil handoff。Recipe 必须同时覆盖 Font source、Font pairing、Typography tone、Spatial rhythm、Surface treatment、Radius language、Motion personality、Advanced interaction、Signature carrier、Source basis、Anti-reference。

`foundation_system`、`color_system`、`token_delivery_hint` 的字段结构由 schema 和 `output-contract.md` 管；本文件只说明这些字段为什么这样组合。具体值来自 `foundations/foundation-system.md`、`references/motion-block-library.md#Foundation Motion Tokens` 和 `data/foundation-recipes.csv`。

## 5. Recipe Families

Agent 不应该每次从零发明配方。先选一类，再按项目品牌和业务对象微调。

Shortcuts：enterprise-productive 用 system type、紧凑空间、border-first、短反馈；commerce-admin 列表和工具栏优先，入口不做卡片汤；collaboration-workflow 用 proximity 和状态 / 空间关系动效；material-adaptive 用 role-based type、响应式容器、tonal surface；fluent-enterprise 用稳定基线、4px ramp、layered surface、quick fade；brand-expressive 用 display/body 对比、叙事空间、一个 signature moment；ai-command 分输入区 / 结果区 / 证据区并做 trace reveal；protocol-brand 用 display + body + mono 分工、局部拓扑 / 3D / protocol field。

禁止海报标题污染后台、玻璃拟态、大面积渐变、彩色 icon 汤、所有模块等距等权、把 elevation 当廉价投影、每屏滚动飞入、抽象光效盖过结果、默认青紫 AI neon。

## 6. Mode Boundaries

模式权威在 `references/read-profiles.md#Design Mode Routing` 和 `references/creative-direction.md#Brand Surface Add-on`。本文件只记录组合层差异：

- Product UI：productive density、13-14px 正文、稳定行高、4/8 grid、4-8px 控件圆角、border-first、短反馈。
- Brand Surface：display/body 对比、可读正文、叙事空间、真实素材或一个动效 / 材质 signature。
- Hybrid：展示面可有 signature；工作面回到 Product UI 密度、状态和可访问性。
- Avatar-IP / Empty State：局部风格服务恢复动作，不扩散成全局 token。
- De-template gate 只在这里记录 composition delta；具体检测和修正动作交给 `references/visual-qa-detectors.md`。

## 7. Source Notes

`ui-design.md` 必须记录 Composition Source Notes。它不是论文引用，而是让后续阶段知道“为什么这样组合”：来源、采用点、本地化改造、禁止复制。若使用 GSAP，必须补触发条件、timeline intent、持续时间上限、responsive matchMedia、reduced motion、cleanup / revert。

## 8. Senior Review

交付前自问：去掉颜色后是否还像这个产品；第一屏是否让目标用户知道下一步；字体、行高、间距和圆角是否来自同一密度；是否只有一个 signature 主角；高级感是否来自内容结构和细节纪律，而不是渐变、玻璃、阴影和大圆角；动效是否说明状态、空间关系、进度或品牌记忆；Pencil handoff 是否明确同一套 token group、组件契约和证据要求。

## 9. Output

Markdown 输出 `Composition Recipe` 和 `Composition Source Notes` 的短表即可；完整 JSON 字段以 `contracts/design-contract.schema.json` 为准。Product UI 同时输出 Product UI Layout Audit；需要 `.pen` 或视觉证据时，把同一套 recipe 写入 Pencil handoff requirements。
