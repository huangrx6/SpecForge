# Changelog

## 0.11.12

- 新增 Design Reference Picker 机制：用户只选择 UI 类型、参考目标、借鉴强度、后台模块和视觉方向，Agent 负责路由到 shadcn 生态、国内案例、Awwwards / Motion / GSAP、企业设计系统和 Vue admin 模板。
- 新增 `references/reference-picker.md`、`references/reference-source-routing.md`、`references/reference-extraction-protocol.md`、`data/reference-source-catalog.csv` 和 `contracts/reference-selection.schema.json`，明确来源池不是风格名，外部来源只能抽 pattern / anatomy / state coverage / motion boundary / UX IA / source basis。
- 新增 `prompts/reference-picker.md`、`prompts/source-routing.md`、`prompts/reference-extraction.md`、`prompts/shadcn-resource-audit.md`、`prompts/domestic-design-case-extraction.md`，让 shadcn 生态、国内设计案例和高级动效来源有独立抽取流程。
- Design Contract JSON 新增必填 `reference_selection`；`output-contract.md`、`cross-stage-handoff.md` 和 `design-system-orchestration.md` 同步增加 Reference Selection、Source Routing、Scan Manifest、Reuse Boundary、Extracted Patterns 和禁止复制边界。

## 0.11.11

- `SKILL.md` 瘦身为统一入口，只保留调用条件、read profile 选择、输出契约、阻断条件和完成标准，不再承载完整读取链路。
- 新增 `references/read-profiles.md` 作为 skill 内部子入口，按 `local-component`、`product-page`、`brand-surface`、`visual-calibration`、`full-system` 裁剪最短必读路径。
- 新增 `contracts/selected-data.schema.json` 和 `contracts/visual-qa.schema.json`，把 selected data / rationale 与 Visual QA 作为可独立复用的子契约，同时继续汇入统一 Design Contract。
- `validate-design-system-registry` 与 `framework-audit` 将 read profile 和两个子 schema 纳入关键文件检查，避免新增内部入口后机器清单漏读。

## 0.11.10

- Design Contract JSON 新增必填 `human_confirmation`，区分审美方向的用户确认、低风险可逆默认和未决状态。
- `artifact-quality` 增加 human confirmation 校验：需要人工确认的方向不能写 `defaulted`，`pending` 会阻断，`confirmed` 不能来自 Agent recommendation。
- `SKILL.md`、`output-contract.md` 和 `cross-stage-handoff.md` 同步说明 `confirmed` / `defaulted` / `pending` 的边界，避免后续阶段误把 Agent 推荐当成用户确认。

## 0.11.9

- Design Contract JSON 新增必填 `token_delivery_hint`，记录 CSS variables、Tailwind theme mapping、Pencil variable hints 和 notes，帮助 `sf-tech-design` 更快落地 token delivery。
- `token_delivery_hint` 明确只是实现提示，不替代 `sf-tech-design` 的最终工程决策；`artifact-quality` 会检查 notes 是否表达 hint / technical-design 边界。
- `output-contract.md`、`cross-stage-handoff.md` 和 `SKILL.md` 同步补充 token delivery hint 示例和交接说明。

## 0.11.8

- Design Contract JSON 新增必填 `visual_qa`，把 Visual QA detector 的 result、severity、evidence、fix、status 和 owner 写成机器可读 gate 数据。
- `artifact-quality` 增加 Visual QA JSON 校验，high severity issue 只有 `fixed` 或 `accepted` 才能通过，`pending` / `blocked` 会阻断后续验证。
- `visual-qa-detectors.md`、`output-contract.md`、`cross-stage-handoff.md` 和 `SKILL.md` 同步改为 Markdown 表 + JSON contract 双输出，避免 `sf-verify` 重新解析自然语言。

## 0.11.7

- `scan_manifest` 新增必填 `selection_rationale`，在保留 `selected_data` 机器 id 的同时，强制记录每个 palette、字体、type scale、spacing、radius / shadow、motion 和 advanced interaction 的选择理由、拒绝项、风险和置信度。
- `artifact-quality` 增加 selection rationale 校验，要求 rationale id 与 `selected_data` 对齐，并拦截空理由、空风险、空拒绝项和非法 confidence。
- `output-contract.md`、`cross-stage-handoff.md` 和 `design-system-orchestration.md` 同步补充 rationale 示例，避免后续阶段只知道“选了什么”，不知道“为什么不能换”。

## 0.11.6

- `contracts/design-contract.schema.json` 新增按 `design_mode` 条件化的 `allOf` 规则：Product UI / Hybrid 必须包含 `layout`、`state_matrix`、`product_ui_quality`，Brand Surface 必须包含 layout 和 reduced motion，Avatar-IP / Empty State 必须声明 scope 且不能新建全局 token。
- `motion.layer_3_gsap` 升级为对象数组；一旦使用 GSAP，必须记录 `effect`、`fallback` 和 `verification`，避免高级动效没有降级和验证。
- `artifact-quality` 同步增加 Design Contract 条件检查，拦截 Product UI / Hybrid 缺真实工作表面、主要用户 / 对象 / 任务、验证 hook、反模板规则，以及 Brand Surface / GSAP 缺降级验证。

## 0.11.5

- `core/skills/registry.json` 的 `design-system.source.files` 扩展为完整支持文件清单，覆盖 references、data、contracts、foundations、components、pages 和 prompts 下的 107 个文件。
- 新增 `validate-design-system-registry.mjs`，校验 design-system 的 `SKILL.md` / orchestration 引用、关键文件、完整支持文件、registry 和 starter 镜像是否一致。
- `validate-external-skills` 与默认 `npm run validate` 接入 design-system registry 校验，避免新增 Composition Recipe、字体来源、高级交互或视觉校准文件后机器入口继续停留在旧清单。

## 0.11.4

- 将 `SKILL.md` 从全量 19 步读取顺序改为 profile-driven read path，新增 `local-component`、`product-page`、`brand-surface`、`visual-calibration` 和 `full-system` 五类入口。
- `references/design-system-orchestration.md` 升级为强制 profile routing，避免小组件、后台页面和截图校准任务默认读取完整设计系统。
- Design Contract JSON 的 `scan_manifest` 新增必填 `profile` 字段，`output-contract.md` 和 `cross-stage-handoff.md` 同步记录 profile，方便后续阶段按任务规模消费设计约束。

## 0.11.3

- 新增 `references/visual-calibration.md`，把实现、截图或用户反馈中的“不好看 / AI 味 / 模板感 / 不像目标行业 / GSAP 或 Three.js 不明显”转成可执行的诊断表、影响层、palette delta 和修正状态。
- `data/aesthetic-palettes.csv` 新增 `obsidian-phosphor`，作为 Web3 个人官网、协议品牌和开发者作品集的非默认青紫霓虹候选。
- `references/color-system.md`、`references/visual-qa-detectors.md`、`pages/brand-surface.md` 和 `references/design-composition.md` 增加 Brand Surface de-template 规则，拦截 cyan + violet + rose + glow + glass 的通用 AI / cyber 模板。
- Design Contract JSON 新增可选 `visual_calibration`，`references/output-contract.md` 增加 Visual Calibration 与 Palette Delta 输出区块。

## 0.11.2

- 新增 `references/design-system-orchestration.md`，将 design mode、来源扫描、字体、色彩、Composition Recipe、高级交互、组件、视觉 QA 和输出契约串成强制 Design Scan Manifest。
- 新增 `references/font-source-index.md` 和 `data/font-pairing-recipes.csv`，内置中国用户可稳定使用的系统字体栈，并记录阿里巴巴普惠体、HarmonyOS Sans、MiSans、OPPO Sans、思源字体、站酷字体、优设标题黑等官方来源和许可边界。
- 新增 `references/advanced-interaction-source-index.md` 和 `data/advanced-interaction-recipes.csv`，将 GSAP、ScrollTrigger、Flip、matchMedia、Three.js、React Three Fiber、Drei、TresJS 转成可选择的高级交互配方、fallback、reduced motion 和验证要求。
- Design Contract JSON 新增必填 `scan_manifest`，要求记录 scanned files、selected data、skipped reasons，并由 artifact-quality 与 framework audit 校验。

## 0.11.1

- 新增 `references/composition-source-index.md`，把 Material、IBM Carbon、Shopify Polaris、Atlassian、Fluent、Apple HIG 和 GSAP 的字体、空间、层级、动效原则转译为 SpecForge Composition Recipe 来源索引。
- 扩展 `references/design-composition.md`，新增来源驱动原则、配方族、字体组合、空间节奏、圆角阴影、动效 / GSAP signature 和 Composition Source Notes 输出要求。
- 扩展 `data/type-scales.csv`、`data/spacing-density-scales.csv`、`data/radius-shadow-recipes.csv`、`data/motion-recipes.csv`，补充 enterprise、commerce、collaboration、material、fluent、brand、AI 等可选配方。
- Design Contract JSON 的 `foundation_system` 新增必填 `source_basis`，要求记录采用来源、本地化改造和禁止复制项，并由 artifact-quality 与 framework audit 校验。

## 0.11.0

- 新增 `references/design-composition.md`，把字体、空间、圆角阴影、动效、GSAP signature 和业务 signature 合成 Composition Recipe，避免只约束颜色。
- 新增 `data/type-scales.csv`、`data/spacing-density-scales.csv`、`data/radius-shadow-recipes.csv`、`data/motion-recipes.csv`，让 Agent 有可选的字体、空间、材质和动效配方。
- Design Contract JSON 新增必填 `foundation_system`，覆盖 typography、spacing、radius_shadow 和 motion，并由 artifact-quality 校验。
- Visual QA 新增 `Color-only design`，拦截“颜色正确但排版、空间、材质和动效不成系统”的设计。
- 本地化 `core/skills/ui-ux/pencil`，Pencil 只消费已确认 Design Contract，不再作为外部通用设计 skill 主导审美。

## 0.10.0

- 将 `data/aesthetic-palettes.csv` 调整为 Agent 查询友好的 semantic token 结构，新增 background、surface、text、primary、secondary、accent、status、chart、source_url 和 license_note 等字段，同时保留色阶线索。
- 新增 `references/palette-source-index.md`、`data/ui-color-scales.csv`、`data/aesthetic-palette-candidates.csv` 和 `data/chart-palettes.csv`，区分 UI 色阶、灵感 palette、图表 palette、校验工具和许可边界。
- `contracts/color-palette.schema.json` 与 Design Contract JSON 改为 `tokens / usage_rules / accessibility / source` 结构，避免后续阶段继续从自由文本推断颜色。
- `references/aesthetic-directions.md` 新增 Palette ID Mapping，让“美学方向 -> palette_id -> semantic token -> 可访问性检查”形成闭环。
- framework audit 增加 palette source contract 校验，检查关键 palette id、token 字段、source_url、license_note 和新数据文件。

## 0.9.0

- 新增 `data/aesthetic-palettes.csv`，提供 20 个 aesthetic palette，每个包含 neutral / primary / accent / semantic / chart 色阶、usage ratio、contrast notes 和 avoid rules。
- 新增 `references/color-system.md`、`references/palette-usage-rules.md` 和 `contracts/color-palette.schema.json`，把配色升级为 palette library -> token mapping -> usage rules 三层结构。
- Design Contract JSON 增加 `color_system`，让后续阶段稳定读取 palette_id、token mapping、contrast checks 和禁止组合。

## 0.8.0

- 新增 `references/design-mode-routing.md`，把 Product UI、Brand Surface、Hybrid、Avatar-IP 和 Empty State 作为第一步路由，防止审美方向误套到不合适的 UI 场景。
- 新增 `contracts/design-contract.schema.json`，要求 Design Contract Summary 同时输出 Markdown 和 machine-readable JSON。
- 新增 `references/visual-qa-detectors.md`，把去模板感、去廉价感和状态缺失变成可执行 detector。
- 新增 `contracts/component-contract.template.md`，定义 `01-spec/design/components/<component-name>.contract.md` 的独立组件契约格式。

## 0.7.0

- 吸收并替代独立 `ux-designer`：新增 `references/ux-research-ia.md`，沉淀用户研究、信息架构、交互恢复、微文案、可访问性和视觉层级规则。
- 扩展 aesthetic directions 到 13 类，新增专业可信、材质/3D、插画/角色、图形/排版实验、地域文化灵感、情绪/体验调性等方向，并加入混搭规则。
- aesthetic-selection prompt 改为默认推荐 3-5 个互斥美学方向，并要求跨气质筛选，避免只在同一类中换名字。
- 强化导航决策：新增 sidebar / top nav / hybrid / tabs / command nav 等候选比较、滚动区域说明和人工确认要求；桌面主 sidebar 默认 fixed / sticky，不随主内容滚动。

## 0.6.0

- 重写 aesthetic-directions：将“美学方向”和“业务设计模式”拆开，补充简洁高级、可爱活泼、艺术氛围、复古怀旧、科技未来、潮流个性、自然温柔七类审美风格。
- aesthetic-selection prompt 增加约束：先推荐纯审美风格，再做 business translation，禁止把 Operational Calm / Command Center 等业务模式当作美学。
- sf-ui-design 流程更新为“美学方向确认 -> 业务翻译 -> 组件/页面约束”。

## 0.5.0

- 组件规范统一升级为 Purpose / Structure / Variants / States / Density / shadcn-vue mapping / Content / Anti-patterns 八段式契约。
- 全量扩写常见组件文档，补充复杂状态、业务变体、移动端密度、文案规则、项目 wrapper 和反廉价感规则。
- component-system 增加 completeness matrix、project wrapper rule 和 content quality rules，避免只停留在 primitive 说明。
- framework audit 增加组件章节完整性校验，防止后续组件文档退化为薄说明。

## 0.4.0

- 新增 aesthetic directions 和 aesthetic selection prompt，用于按业务推荐 2-3 个互斥美学方向，并在用户选择后映射到 foundations、components、pages 和 Pencil 约束。
- 新增 components/README 和 component-system reference，建立组件深度契约：anatomy、variants、states、layout、content、a11y、shadcn-vue、anti-patterns。
- 全面加厚常见组件文档，覆盖按钮、卡片、表单、输入、选择器、表格、弹窗、抽屉、命令面板、导航、筛选、反馈、图表、空态等组件。
- 更新 sf-ui-design 流程：先推荐美学方向，用户选择后再生成稳定组件契约和页面设计。

## 0.3.0

- 增强设计判断层：新增 subject grounding、single job、world material、signature、default detector 和 self-critique pass。
- 新增 DESIGN.md extraction，用于从真实网站、截图或品牌材料提取 atmosphere、tokens、typography、components、layout、motion 和 do/don't。
- 新增 taste review、layout archetypes、taste critique prompt 和 DESIGN.md extraction prompt，强化反模板、去廉价感和人工确认。
- 吸收 frontend-design、Taste Skill、getdesign.md / DESIGN.md、UI UX Pro Max 的方法论，并转译为 SpecForge 可执行规则。

## 0.2.0

- 扩展 design-system 为可被 `sf-ui-design` 调用的完整 UI 工具链：foundations、component contract、page patterns、sample board、anti-cheapness review 和 motion / GSAP 边界。
- 新增 density、iconography、content foundations。
- 新增 input、select/combobox、tooltip/popover、command palette、date picker、upload、skeleton/progress、stepper、breadcrumb、avatar 等常见组件规范。
- 新增 AI assistant、settings、permission management、mobile H5 页面模式。
- 新增 sample board、visual QA、UI toolchain、motion/GSAP 和 external sources references。

## 0.1.0

- 建立 foundations / components / pages / prompts / references 结构。
- 增加 shadcn-vue、去廉价感、动效和 Product UI 页面模式基线。
