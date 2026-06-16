# Changelog

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
