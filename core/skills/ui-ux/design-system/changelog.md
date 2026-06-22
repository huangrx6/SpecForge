# Changelog

## 0.11.13

本版目标：把 design-system 从“大而全平铺库”压成可裁剪的设计操作系统。执行规则只保留一个权威入口，历史薄片、重复 schema、重复 prompt 和重复字段表都收束到对应层级。

### Current Consolidation

- Schema 收束：`reference-selection`、`selected-data`、`visual-qa` 和 `color-palette` 子 schema 并入 `contracts/design-contract.schema.json`；字段结构不再多处维护。
- 入口收束：旧 `references/00-index.md` 并入 `references/read-profiles.md`；`SKILL.md` 只保留触发、profile、add-on、输出权威和阻断摘要。
- 入口协议再压缩：`SKILL.md` 将触发场景、profile、add-on、工作原则和完成标准合并为短规则，保留 Reference Picker 必需路径和输出权威。
- Read Profiles 表格压缩：`references/read-profiles.md` 将 layer map、add-on matrix、Pencil handoff 模板和 field owners 表合并为短路由规则，保留 profile routing 和 scan manifest 职责。
- 合同收束：`references/output-contract.md` 不再复制完整 JSON 样板或 required 清单，只负责 Markdown 输出、条件字段、payload map、Pencil handoff 和 stop conditions；字段权威为 schema + `artifact-quality`。
- Output Contract 压缩：`references/output-contract.md` 退回输出路由、字段 ownership、scan manifest、cross-stage handoff 和 stop conditions；creative / reference / asset / interaction 字段细节回到 schema 与专题文件。
- Output Contract 表格压缩：`references/output-contract.md` 将 conditional output、field ownership 和 scan manifest 表合并为紧凑规则，保留 workflow marker、字段 owner 和跳过理由纪律。
- Output Contract handoff 压缩：`references/output-contract.md` 将 payload map、handoff rules、engineering consumption 和 component handoff 清单合并为可消费短规则，继续保持 schema / artifact-quality 为字段权威。
- 入口合同去重：`SKILL.md` 和 `references/read-profiles.md` 不再维护第二份 required / conditional 字段表；profile / add-on 只负责路由和 `scan_manifest.workflow`。
- Orchestration 去重：旧 orchestration 文件不再复制 mode scan matrix 和 `scan_manifest` 字段表；模式权威回到 read-profiles，扫描合同权威回到 `output-contract.md` 与 schema。
- Orchestration 表格压缩：旧 orchestration 文件将 toolchain gates、read conditions、full-system order 和 data selection code block 合并为顺序协议，保留升级门禁和 manifest authority。
- Orchestration 融合：full-system 升级门禁、编排顺序和 manifest authority 并入 `references/read-profiles.md#Full-System Orchestration`，删除独立 orchestration 文件，入口控制面归一。
- Foundation 收束：颜色、字体、空间、圆角、阴影、图标和 motion token 回到 foundation pack 与 CSV；Composition 只保留组合纪律。
- Visual Tokens 压缩：foundation pack 合并重复 token / semantic mapping 表，保留 source stack、selection protocol、usage discipline、de-template、contrast、字体和 radius / shadow / icon 决策链。
- Visual Tokens 表格压缩：foundation pack 将 token strategy、source stack、selection protocol、usage discipline、de-template、typography source 和 output 模板合并为短规则，保留 color_system / foundation_system / token_delivery_hint 输出责任。
- Foundation System 合并：颜色、字体、空间、密度、圆角、阴影和图标统一进入 `foundations/foundation-system.md`，删除独立 visual token / layout density 入口，减少 profile 路由和 registry 维护面。
- Color support 合并：UI 色阶和图表色板统一进入 `data/color-support.csv`，保留 `scale` / `chart_palette` 类型区分，减少色彩来源文件数量。
- Composition 压缩：`references/design-composition.md` 退回 Source Discipline、Font Source Discipline、Composition Order、Recipe Families 和 Senior Review；`foundation_system` / `color_system` / `token_delivery_hint` 字段结构回到 schema 与 output contract。
- Composition 表格压缩：`references/design-composition.md` 将 source discipline、font priority、composition order 和 recipe family 表合并为短规则，保留组合判断、字体授权和 recipe 约束。
- Foundation 索引去除：删除 `foundations/README.md`，由 `read-profiles.md` 直接路由到真实 foundation pack，避免 local-component 先读索引再读规则。
- 外部参考收束：reference picker、source routing、live evidence protocol、extraction protocol、DESIGN.md extraction、domestic case extraction 和 UX / IA 方法并入 `references/reference-workflow.md`，删除独立 `live-reference-research.md`。
- Reference selection 去重：`references/reference-workflow.md` 不再维护第二份 enum 表，字段和枚举权威回到 `design-contract.schema.json#/$defs/referenceSelection`。
- Reference workflow 压缩：`references/reference-workflow.md` 保留 Live Evidence / UX IA / Domestic / Vue / DESIGN.md 锚点，但删除长 JSON 样例和重复输出模板，证据字段回到 schema 与 `output-contract.md`。
- Reference workflow 调研强化：`references/reference-workflow.md` 把 source routing 从大表压成问题导向规则，并明确 live evidence 是 desktop / mobile / scroll / interaction 的状态采样，不能只看 hero 或站点名。
- Reference workflow 表格压缩：`references/reference-workflow.md` 将 Live Evidence access table 和 Extraction Matrix 合并为 access modes / required capture 短规则，保留可审查 evidence 与 adopt / adapt / avoid 纪律。
- Creative Direction 收束：审美方向库、sample board、direction card 和执行模板并入 `references/creative-direction.md`；不再维护独立 prompt 薄片。
- Creative Direction 再压缩：`references/creative-direction.md` 退回方向和 signature carrier 权威，mode 禁止项、Visual QA detector、素材和高级动效细节分别回到 routing、QA 和 motion 权威文件。
- Creative Direction 瘦身：`references/creative-direction.md` 保留 aesthetic family / palette mapping / Brand Surface / Sample Board 锚点，但删除长 direction 模板和 JSON 样例，Contract 字段回到 schema。
- Creative Direction 模板压缩：`references/creative-direction.md` 把 Direction Card 数量、Direction Families 和 Sample Board 从填表式模板压成设计导演决策规则，保留审美 / business translation 边界。
- Creative Direction 再瘦身：`references/creative-direction.md` 把 grounding facts、signature carrier、palette mapping 和 mode handoff 从表格 / 列表压成短规则，保留审美族群、非模板方向和 Brand Surface 边界。
- Creative Direction 族群压缩：`references/creative-direction.md` 将 Direction Families 长列表、Design Read 模板和 Sample Board 表格合并为短规则，保留审美族群 marker、palette mapping、business translation 和 mixing rules。
- Product UI 收束：页面配方、dashboard 质量、layout archetypes 和 Product UI signature 合并到 `references/product-ui-signature-patterns.md`；pattern 直接决定 primary work surface、组件族和 motion boundary。
- Product UI 合同去重：`references/product-ui-signature-patterns.md` 不再维护 `layout / state_matrix / product_ui_quality` 字段清单，字段结构回到 schema 与 `output-contract.md`。
- Product UI 决策器压缩：`references/product-ui-signature-patterns.md` 从页面配方手册退回 Decision Gate、First Viewport Contract、Pattern Picker、KPI / Queue / Blank Budget 和状态内容 gate，明确要求后台非模板候选。
- Product UI 非模板强化：`references/product-ui-signature-patterns.md` 新增 conservative candidate 与 signature work-surface candidate 对照，强制把默认 sidebar + KPI + card 壳转成对象驱动工作表面或明确拒绝。
- Product UI pattern 表压缩：`references/product-ui-signature-patterns.md` 将 pattern 大表合并为 pattern map 和组件族默认规则，保留非模板候选、primary surface 和 anti-pattern 约束。
- Product UI 输出再瘦身：`references/product-ui-signature-patterns.md` 将 pattern picker、recipe tags 和 layout audit 输出合并为更短的候选 / pattern / quality gates，继续保留非传统工作表面候选。
- Brand Surface 收束：品牌展示页、Web3 / AI 去模板、signature 和高级交互合同并入 `references/creative-direction.md#Brand Surface Add-on`；删除独立 pages 入口。
- Motion / Asset 收束：Asset Brief、GSAP 实现边界、高级交互来源和 motion prompt 并入 `references/motion-block-library.md`；素材 prompt、target path、fallback、reduced motion 和 verification 同源。
- Motion 职责压缩：`references/motion-block-library.md` 不再维护官方 source index、完整 reduced-motion CSS 或 Vue cleanup 实现细节；设计阶段只输出 motion / asset 决策，依赖、renderer 和 lifecycle 交给 `sf-tech-design`。
- Motion / Asset 再瘦身：`references/motion-block-library.md` 保留 Motion Brief、Asset Brief、Foundation Motion Tokens 和 Motion Blocks 锚点，但删除长 prompt 模板和 JSON 样例，字段权威回到 schema / output contract。
- Motion / Asset 表格压缩：`references/motion-block-library.md` 把 asset strategy、motion token、layer decision 和 verification 表合并为决策规则，保留高级动效边界、素材 brief、fallback 与验证要求。
- Motion / Asset block 压缩：`references/motion-block-library.md` 将 Motion Blocks 表、Asset Brief 细项和 selection rules 合并为 block map / asset discipline / rules，保留 Motion Brief、Asset Brief、Foundation Motion Tokens、Layer Decision 和 Verification。
- 组件层收束：旧 component-system、feedback-overlay 和组件选择薄片并入组件入口；组件族保留为 `app-shell`、`data-work`、`form-flow`、`command-ai`、`mobile-h5` 等按工作面读取。
- 组件入口压缩：组件入口退回 family routing、architecture levels、wrapper rule、shadcn audit 和 handoff checks；组件族细节交给子文件，独立组件详情交给 `contracts/component-contract.template.md`。
- 组件入口表格压缩：组件入口把 family routing、architecture level、wrapper promotion、Feedback / Overlay 和 shadcn primitive choice 表压成路由规则，避免入口变成第二份组件族细节。
- 组件入口再瘦身：组件入口将 family routing、architecture levels、global states 和 Admin Component Contract 模板压成短规则，保留 wrapper 晋升、shadcn resource audit 和 handoff checks。
- 组件族文件压缩：五个组件族文件统一为短 contract 摘要，保留审计章节和 Primitive / Companions / Project wrappers 映射，删除重复长清单。
- 组件族融合：五个同构 family 文件合并为组件族谱，组件入口只保留组件层路由和 wrapper 晋升，单组件细节继续交给 `contracts/component-contract.template.md`。
- Component System 合并：组件入口、family routing、shadcn 审查和 family 矩阵统一进入 `components/component-system.md`，删除 README / families 双入口。
- 组件合同模板压缩：`contracts/component-contract.template.md` 改为短可填 contract，保留 trace、状态覆盖、primitive / wrapper mapping、motion 和验证证据，不再复制大表。
- 密度 / 路由 / 组合再分层：foundation pack 保留 density card 和响应式规则；mode routing 只保留模式判断、必读路径和阻断；`references/design-composition.md` 只保留组合来源、recipe 和 senior review。
- Mode routing 融合：Design Mode Routing 并入 `references/read-profiles.md`，Profile、Mode 和 full-system orchestration 统一为一个控制面，删除独立 mode routing 文件。
- Recipe 数据融合：`font-pairing`、`type-scale`、`spacing-density`、`radius-shadow`、`motion` 和 `advanced-interaction` 六个小 CSV 合并为 `data/foundation-recipes.csv`，用 `recipe_type` 分组，保留原 id，减少跳文件成本。
- QA / Calibration 收束：taste review、visual calibration、QA prompt、palette de-template 和 screenshot feedback 并入 `references/visual-qa-detectors.md`。
- Visual QA 压缩：`references/visual-qa-detectors.md` 保留稳定 detector 名称和 severity，但删除长 review prompt 与 JSON 样例，输出字段回到 schema 与 `artifact-quality`。
- Visual QA 再瘦身：`references/visual-qa-detectors.md` 将 taste matrix、calibration loop 和 review prompt 表格压成检测 / 修正规则，稳定 detector 清单继续保留。
- Visual QA 协议压缩：`references/visual-qa-detectors.md` 保留 detector 表和 JSON gate，压缩 review protocol 与 output 模板，避免 QA 文件变成第二份 artifact-quality 说明。
- 合同示例对齐：`reference-workflow.md`、`motion-block-library.md` 的 JSON 示例已按 schema 与 `artifact-quality` 校验字段更新，避免按文档写出失败合同。
- Starter / registry / doctor 已同步：registry 校验、framework audit、self-test 和 doctor 均覆盖当前分层。

### External Skill Cleanup

- `skills/sf-ui-design/SKILL.md` 压缩为入口协议，复杂 design-system 读取交给 design-system 自身。
- `skills/sf-ui-design/references/ui-design-process.md` 压缩为阶段流程，删除重复的 admin/product UI、design mode 和 PC business system 参考文件。
- `artifact-quality` 的缺字段修复提示改为要求 required 字段写可消费值；条件字段不适用时省略字段并写 skip reason，不再建议填空数组或 N/A。

## Historical Milestones

| Version | Theme |
| --- | --- |
| 0.11.12 | Design Reference Picker：把外部网站、模板站、shadcn 资源、国内案例和 motion 来源转成有证据的 selection / routing / extraction 流程。 |
| 0.11.11 | Profile-driven read path：新增 `local-component`、`product-page`、`brand-surface`、`visual-calibration`、`full-system`，避免默认全量读取。 |
| 0.11.10 | Human confirmation：区分用户确认、低风险默认和 pending，阻断 Agent 把自己的推荐写成 confirmed。 |
| 0.11.9 | Token delivery hint：把 CSS variables、Tailwind theme、Pencil variables 和工程映射交给后续阶段消费。 |
| 0.11.8 | Visual QA JSON：把 detector、severity、evidence、fix、status 和 owner 变成可验证 gate。 |
| 0.11.7 | Selection rationale：要求每个 selected data id 有 why、rejected、risk 和 confidence。 |
| 0.11.6 | Conditional design contract：Product UI / Hybrid / Brand Surface / Avatar-IP / Empty State 按 mode 触发布局、状态和质量字段。 |
| 0.11.5 | Registry validation：完整支持文件清单、starter 镜像和 design-system registry 进入维护校验。 |
| 0.11.4 | Profile routing：将旧 19 步全量读取顺序改为按任务规模裁剪。 |
| 0.11.3 | Visual calibration：把“不好看 / AI 味 / 模板感 / 不像目标行业”转成 palette delta 和可执行修正。 |
| 0.11.0-0.11.2 | Composition system：引入 source basis、font / spacing / radius / shadow / motion recipes 和强制 Design Scan Manifest。 |
| 0.8.0-0.10.0 | Design Contract 基线：建立 mode routing、visual QA、component contract、palette library 和 color system。 |
| 0.1.0-0.7.0 | 初始扩展：从 foundations / components / pages / prompts / references 扩展到审美方向、组件深度契约、页面模式、动效边界和 UX / IA 方法。 |
