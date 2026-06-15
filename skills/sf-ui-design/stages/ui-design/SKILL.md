---
name: ui-design
description: SpecForge 内部 UI 设计技能。用于根据 requirements 生成或确认视觉风格、页面地图、用户流程、交互状态和固定 Pencil 原型证据。
---

# UI Design Skill

本技能只处理用户可见体验，不处理后端架构、API、数据库或部署方案。SpecForge 的默认且唯一 UI 原型通道是 **Pencil**：有 UI 影响时，必须产出 `01-spec/ui-mockup.pen` 和导出截图；Figma、HTML、ASCII、设计类第三方 skill 只能作为参考输入，不能作为本阶段的正式交付通道。

若本 work item 不涉及 UI，写一个明确的 N/A 结论，说明为什么跳过以及后续如何验证"无 UI 影响"。

## 读取

- `00-intake/brief.md`
- `00-intake/prd.md`（存在时）
- `00-intake/brainstorm.md`（存在时，用于获取用户画像和体验方向确认）
- `01-spec/requirements.md`
- `.specforge/core/standards/product.md`（用户画像、调研方法论）
- `.specforge/core/standards/design.md`（无障碍红线、信息架构、交互设计、视觉层级）
- `.specforge/core/standards/pc-ui-design-spec.md`（PC 端业务系统、运营后台、管理系统、数据管理工具，或用户明确提供该规范时读取；具体数值优先于通用设计基准）
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/ai-toolkit.md`
- 现有页面、组件库、设计系统、Pencil 文件、截图、参考产品或用户提供的设计资料
- 需要操作 Pencil 时读取 `core/skills/ui-ux/pencil/SKILL.md`
- 需要设计语言、去廉价感、shadcn-vue 映射、页面模式、样例板、动效边界、UX 研究、IA、交互、微文案或可访问性检查时读取 `core/skills/ui-ux/design-system/SKILL.md`
- 使用 design-system 时先读取 `core/skills/ui-ux/design-system/references/design-mode-routing.md`；交接后续阶段前输出 Design Contract Summary 的 Markdown 表和符合 `core/skills/ui-ux/design-system/contracts/design-contract.schema.json` 的 JSON block。
- 配色必须读取 `core/skills/ui-ux/design-system/references/color-system.md`、`references/palette-usage-rules.md` 和 `data/aesthetic-palettes.csv`，并把 palette_id、色阶、usage ratio、contrast checks 和 avoid rules 写入 Design Contract JSON。
- 做视觉质量审查时优先读取项目设计系统、已确认 UI 方向和 `core/skills/ui-ux/design-system/references/ux-research-ia.md`；不再内置 `web-design-guidelines`

## 写入

- `01-spec/ui-design.md`
- `01-spec/ui-mockup.pen`
- `01-spec/ui-mockup-export/*.png`

## 设计原则

- **先调研，再讨论，再画图。** 没有用户画像、视觉方向、页面范围和关键流程确认时，不创建随意原型。
- **用户确认优先于 Agent 品味。** Agent 可以推荐方向，但在用户确认、现有设计系统或明确低风险默认之前，不能把推荐当成批准方案。
- **Pencil 是唯一正式原型证据。** 参考 Figma、截图、HTML 或竞品时，必须把设计语言转译到 `ui-design.md` 和 Pencil 原型。
- **不要给用户丢 5 种工具。** 工具不让用户选，体验方向让用户选。
- **设计要像真实产品。** 后台和工具类界面优先信息密度、扫描效率、稳定布局和状态反馈；不要用营销页式大卡片、空泛 hero、默认控件堆叠来糊弄 UI 设计。
- **先区分设计模式。** Product UI、Brand Surface、Hybrid 的质量标准不同；管理端采用 shadcn/ui 时必须定义上层 Admin Component Contract，而不是直接拼官方基础组件。
- **无障碍是底线而非附加功能。** 颜色对比度、键盘导航、语义标签和焦点管理必须在设计阶段纳入，而不是"实现后再补"。
- **实现阶段不得重新发明视觉风格。** `ui-design.md` 和 Pencil 截图是后续实现与验证的依据。
- **按规模裁剪。** 单页面小改写 compact UI 差异和验证点；多角色、多流程、高风险 UI 才展开完整状态矩阵、Pencil 证据和视觉质量报告。

## 设计流程（Discover → Define → Ideate → Prototype → Test → Handoff）

### 1. 发现与调研（Discover）

- **判断 UI 影响**：检查页面、组件、路由、视觉状态、角色视图、响应式、可访问性和用户操作流。
- 无 UI 影响时写 N/A、跳过理由和验证方式；不要继续生成风格或原型。
- **提取用户画像**：从 `prd.md`、`brainstorm.md` 或 `requirements.md` 中提取目标用户画像（Persona），确认用户的目标、痛点和行为模式。
- **按需补齐 UX 证据**：如果用户画像、信息架构、交互流程、微文案、可访问性或视觉层级证据不足，读取 `core/skills/ui-ux/design-system/references/ux-research-ia.md`，并归一化为本文件内容。
- **竞品与参考分析**：若有现有设计系统、品牌手册、页面、Pencil、Figma、截图或参考产品，提取可执行规则：布局、导航、密度、色彩、字体、表格、表单、反馈、空态和错误态。不要只贴链接；每个参考都要写"采用什么、不采用什么、如何落地"。
- **PC 业务系统模板**：若产品是后台 / 管理系统 / 数据表格系统，或用户明确给出 PC 端 UI 规范，读取 `pc-ui-design-spec.md`，在 Visual Style Brief 中写入设计系统来源和核心 token；后续 Pencil、HTML/CSS、前端实现都不得擅自改这些数值。
- **shadcn 管理端模式**：若实现层采用 shadcn/ui，把 shadcn 视为 primitive / registry / theming 层；在 UI design 中定义 App Shell、Resource Page、Entity Table、Detail/Form、State Feedback 和 Ops Pattern 的封装契约。
- **design-system 工具链**：若需要设计语言或组件规范，读取 `design-system`，把 design intelligence、美学方向推荐、DESIGN.md extraction、foundations、组件契约、页面模式、样例板、动效边界和去廉价感 review 归一化到 UI design。
- **Design mode routing**：先判断 Product UI、Brand Surface、Hybrid 或 Avatar-IP / Empty State；后台、审批、数据表格和高频工作台默认 Product UI，不把品牌页视觉直接套到控件层。
- **Color system**：从 palette library 选完整色阶，按 Product UI / Brand Surface / Hybrid 的比例纪律映射 semantic tokens；不能只输出 background / surface / text / primary / accent 单点色。

### 2. 定义（Define）

- **做 UI 设计访谈**：先列 `已确认 / 高影响未知 / 可安全默认`。
- 没有现成设计系统时，给用户 2-3 个互斥体验方向，写清适合点、风险和推荐项；复杂项目可以扩展到 5 个方向，但不要机械凑数。
- 方向选项必须像样例板：写清 subject、audience、single job、signature、色彩、排版、密度、组件形态、关键页面片段、动效边界、采用/不采用理由和需要用户确认的问题。
- 用户选择方向后，必须把方向转成组件约束：组件 anatomy、variants、states、layout、content、a11y 和 shadcn-vue project wrapper。
- 一轮只问会改变 UI 的关键问题，例如信息密度、主流程、角色差异、表单复杂度、错误反馈、数据展示方式。
- **绘制信息架构（IA）**：定义主导航结构、页面层级、标签命名。遵循"5-7 项主导航"、"按用户心智模型分组"原则。
- **确认导航模式**：主导航可以是 fixed sidebar、top nav、hybrid、tabs、command nav、mobile bottom nav 或无常驻导航。导航位置和滚动行为属于高影响 UX 决策；如果需求没有现成设计系统依据，需要给出 2-3 个选项和推荐理由让用户确认，且至少包含一种非 sidebar 方案。桌面主 sidebar 通常 fixed/sticky，不应跟随内容滚动。
- **定义滚动区域**：明确全局导航、页面头部、主内容、右侧辅助栏、表格和局部列表分别是 fixed / sticky / scroll / static；长页面不能让主导航被内容滚动带走。
- **定义 HMW 问题**：用"如何能"框架将用户痛点转化为设计机会。
- 用户未确认前，不调用 Pencil，不创建完整页面方案，不写"我将使用某某风格"作为既定事实。
- 如果需要用户在多个体验方向中取舍，退回 brainstorm；`ux-research-ia.md` 在 UI design 中只用于细化已确认方向，不用于绕过确认。
- 用户确认后，在上游 artifact 留下可检索标记：`[UI DECISION CONFIRMED]` 或 `UI Direction Status: confirmed`，并记录用户选择、放弃项和影响。
- 用户暂不确认且 UI 风险低时，可以只写默认假设和待确认点；默认假设必须可逆，不能推进到 Pencil 原型。

### 3. 构思与设计（Ideate）

- **建立体验规格**：页面地图、入口出口、角色流程、主路径、异常路径。
- **选择输出预算**：按 work item 风险写 compact / standard / full；不要为了小改生成难以审阅的完整设计报告。
- **建立 foundations pack**：把确认方向写成 semantic tokens、密度、排版、圆角阴影、图标、文案、动效和可访问性底线。
- **建立 taste critique**：检查这个方向是否可以套到任意同类产品；如果可以，必须替换 signature、布局、排版或色彩策略中的至少一项。
- **写组件封装契约**：管理端必须说明哪些页面级、资源级和状态级组件由项目封装；避免每个页面重复散落基础 `Button`、`Card`、`Table`。
- **写组件契约文件**：复杂或复用组件必须写入 `01-spec/design/components/<component-name>.contract.md`，覆盖 anatomy、variants、states、mapping、props、events、slots、motion 和 verification。
- 页面 × 状态矩阵：default、loading、empty、error、permission、disabled、success、boundary、responsive、a11y。
- 明确不做项，防止实现阶段扩大 UI 范围。
- **用户流程设计**：先绘制 happy path，再设计错误和边缘情况。最小化步骤，3 步以上流程提供进度指示器。
- **微文案（Microcopy）规划**：按钮用"动词 + 名词"；错误文案具体可操作无责备；空态告诉用户下一步做什么。
- **无障碍预审**：在绘制原型前确认颜色对比度方案、键盘导航路径、焦点管理策略。

### 4. 原型（Prototype）

- **创建或更新 Pencil 原型**：读取 `core/skills/ui-ux/pencil/SKILL.md`。
- 输出 `01-spec/ui-mockup.pen`。
- 空 `.pen` / 空画布最多读取一次。确认为空后必须立即创建第一屏，不能陷入空读循环。
- 每次完成 `pencil_batch_design` 后，必须确认目标 `.pen` 已保存 / 持久化；如果 Pencil MCP 没有单独 `save` 工具，则仍必须立刻重新打开或重读 `01-spec/ui-mockup.pen`。
- 保存后重读校验必须确认至少存在一个 screen / frame / artboard 或第一屏节点，且不是空画布；校验通过后才能导出截图。
- 导出关键页面截图到 `01-spec/ui-mockup-export/`。
- Pencil 创建连续失败 2 次时，停止并写阻断原因；不要降级成 HTML / ASCII 作为正式 UI 证据。
- **原型必须体现**：Visual Style Brief 中的设计 token、信息层级、导航模式和无障碍基础。
- 采用 PC 端业务系统模板时，原型必须体现顶部导航 `64px`、侧边导航 `208px / 68px`、模块间距 `16px`、控件高度 `32px`、表格行高 `46px`、圆角 `8px` 和主色 `#277DEA`。

### 5. 测试与验证（Test）

- **执行视觉质量自检并修一轮**：必须基于截图检查信息层级、间距、对齐、密度、颜色、组件一致性、状态反馈、响应式和可访问性基础。
- **执行去廉价感审查**：检查默认模板味、无意义卡片、廉价渐变、随机图标、一次性 token、动效噪音和无法映射到项目组件的问题。
- **执行 visual QA detectors**：按 `design-system/references/visual-qa-detectors.md` 检查 Generic SaaS shell、Card soup、Fake premium gradient、Motion noise、State missing、Primitive pile 等 detector。
- 发现问题先修 Pencil，再把 review 发现和修正结果写入 `ui-design.md`。
- "实现时再优化 UI"不是通过条件。
- **无障碍自查**：WCAG 2.1 AA 四原则逐项检查（感知性、可操作性、可理解性、健壮性），任何项不通过必须修正后才能交付。
- **UX 可用性评估**：定义后续可用性测试的测量指标——任务成功率、任务耗时、错误率和满意度评分。

### 6. 交付（Handoff）

- **写 UI 验证策略**：明确 Playwright 后续要覆盖的页面、操作、角色、状态、截图和失败路径。
- **记录所有设计决策**：确认来源、选择、放弃项和影响，方便 reviewer 和实现者理解设计意图。
- **交互状态文档化**：所有页面/组件的状态（default、hover、focus、active、disabled、error、loading、empty、success）必须有明确描述。
- **机器可读交接**：`Design Contract Summary` 必须包含 JSON block，供 technical design、tasking、implementation 和 verification 读取。
- **色彩交接**：JSON block 必须包含 `color_system`，供后续阶段校验 token、对比度、dark mode 和禁止组合。

## 停止条件

- `instructions.mjs` 返回 `ui-direction-unconfirmed`，或上游没有用户确认的 UI / 视觉 / 体验方向。
- 用户可见体验的关键风格、页面范围或角色流程尚未确认，且默认假设风险高。
- 有 UI 变更但没有 Pencil `.pen`、导出截图或明确 Pencil 阻断原因。
- Pencil `.pen` 未保存、保存后无法重读、重读后仍为空画布，或截图不是来自保存后的目标文件。
- Pencil 原型只是默认控件堆叠，没有参考设计语言、状态矩阵或视觉质量自检。
- 原型默认采用 sidebar / topbar 但没有导航候选、推荐理由、用户确认或滚动区域说明。
- 桌面主导航跟随主内容滚动，且没有明确业务理由、替代方案和用户确认。
- 原型与 requirements 的角色、流程、审批、权限或异常态不一致。
- 设计需要改变产品范围或技术能力，但没有回到 PRD / requirements / technical design。
- 无障碍自查存在未通过项且未修正。

## 完成标准

- `ui-design.md` 能让 reviewer 判断 UI 是否满足需求。
- 有 UI 变更时，存在用户画像提取、Visual Style Brief、页面地图、信息架构、用户流程、微文案、状态矩阵、Pencil `.pen`、导出截图、无障碍自查和视觉质量修正记录。
- 需要设计系统时，存在 design intelligence、aesthetic direction、foundations pack、sample board、人工确认状态、组件契约、页面模式、taste critique 和 motion boundary。
- Design Contract Summary 同时包含 Markdown 表和 machine-readable JSON block。
- Design Contract JSON 包含 `color_system`，且 palette 不只是单点 hex。
- 复杂 / 复用组件有独立 component contract 文件，或写明 N/A 理由。
- Pencil `.pen` 保存后可重读，且 `ui-design.md#9. Pencil 原型证据` 记录保存状态、重读校验和截图证据。
- 无 UI 影响时，N/A 理由和验证方式清楚。
- 实现者能据此实现页面结构和交互状态。
- `technical-design.md` 只引用本文件的 UI 结论，不重复维护视觉和交互细节。
