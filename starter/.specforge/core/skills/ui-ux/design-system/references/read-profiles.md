# Read Profiles

本文件是 design-system 的控制面：负责选择读取范围、profile、add-on 和字段来源。每次使用 design-system 时先读本文件，再读取对应最短链路；不要把 colors、components、motion、reference picker 拆成顶层 skill，也不要默认读取全量设计系统。

## Layer Map

Layer routing：Profile / Design Mode / full-system orchestration -> 本文件；Creative Direction -> `references/creative-direction.md`；Product UI / Brand Surface 专题 -> 对应专题文件；Live Reference -> `references/reference-workflow.md#Live Evidence Protocol` + `data/reference-source-catalog.csv`；Composition -> `references/design-composition.md` + foundations / data；Product UI Patterns -> `references/product-ui-signature-patterns.md` + selected component family；Motion / Assets -> `references/motion-block-library.md`；Contract / Handoff -> `references/output-contract.md` + schema；QA / Calibration -> `references/visual-qa-detectors.md`。

## Design Mode Routing

先判断本次 UI 应该走哪种设计模式，再决定后续读取哪些文件。模式判断错了，token、组件、动效和样例板都会被错误使用。

Route：Product UI 用于后台、管理端、审批、配置台、数据表格、高频工作台、运营工具；读 `references/product-ui-signature-patterns.md`、`components/component-system.md`、`references/output-contract.md`，禁止营销页装饰、玻璃拟态、夸张渐变、漂浮 hero、KPI 空壳或装饰性动效替代任务效率。Brand Surface 用于官网、品牌页、活动页、作品集、landing、公开展示页；读 `references/creative-direction.md#Brand Surface Add-on`、`references/motion-block-library.md`、`references/output-contract.md`，不能牺牲正文、表单和导航可读性。Hybrid 用于 AI 助手、工作台首页、客户门户、低频入口、产品内欢迎页；展示面和工作面必须分层。Avatar-IP / Empty State 只影响头像、IP、空态、引导插画和局部情绪反馈，不扩散成全局控件 token。

Decision rules：高频、批量、审批、表格和配置类默认 Product UI；公开获客、品牌表达、作品展示和活动传播默认 Brand Surface；同时存在展示面和工作面时写 Hybrid 并拆分共享 / 隔离 token；用户指定的审美方向不能覆盖模式边界；`design_mode` 只允许 Product UI、Brand Surface、Hybrid、Avatar-IP、Empty State，头像/IP 与空态同时适用时写主对象并用 `scope: "both"`，不要写组合枚举。

Output requirements：Product UI 必须输出 Product UI Layout Audit、页面密度、组件 wrapper、状态矩阵、表格 / 表单 / 导航约束和 visual QA detector 结果；Brand Surface 必须输出首屏叙事、视觉资产、排版气质、媒体策略、品牌动效边界和可访问性底线；Hybrid 必须输出展示面 / 工作面边界、共享 / 隔离 token、入口转场和任务不被装饰打断的证据；Avatar-IP / Empty State 必须输出使用范围、资产边界、恢复动作和回到主任务的操作。

Color routing：Product UI 使用 `foundations/foundation-system.md#Color System`，neutral >= 70%，primary <= 15%，accent <= 5%；Brand Surface 可使用更强 signature 色，但正文、表单和导航回到高对比 neutral surface；Hybrid 使用 Product UI 信息纪律 + 一个 Brand Surface signature；Avatar-IP / Empty State palette 只影响局部反馈，不写入全局控件 token。

Stop signals：Product UI 被品牌 hero、玻璃、装饰插画或 KPI 空壳主导，且没有任务效率理由；Brand Surface 只剩后台表格和灰白卡片；Hybrid 没拆展示面 / 工作面；`Design Contract Summary` 缺 `design_mode` 或与输入信号冲突。

## Profile Routing

| Profile | 输入信号 | 必读文件 | 可选追加 | 输出 |
| --- | --- | --- | --- | --- |
| `local-component` | 单个组件、小修视觉状态、按钮 / 表单 / badge / tooltip / card | 本文件的 Design Mode Routing、`components/component-system.md` 的相关 family section、`references/output-contract.md` | `foundations/foundation-system.md`，仅当 token / 颜色 / 字体 / 圆角 / 图标 / 尺寸 / 密度 / 响应式变化；`references/visual-qa-detectors.md`，仅当有截图或廉价感反馈 | compact |
| `product-page` | 后台列表、工作台、Dashboard、权限、设置、审批、表格 / 表单主页面 | `references/creative-direction.md`、本文件的 Design Mode Routing、`references/product-ui-signature-patterns.md`、`components/component-system.md`、`references/visual-qa-detectors.md`、`references/output-contract.md` | `references/motion-block-library.md`，仅当有 AI 工具调用 / 导入导出 / 步骤推进 / 对象迁移 | standard |
| `brand-surface` | 官网、作品集、Web3 / AI / 活动页、品牌叙事、视觉探索 | `references/creative-direction.md#Brand Surface Add-on`、本文件的 Design Mode Routing、`foundations/foundation-system.md`、`references/design-composition.md`、`references/motion-block-library.md`、`references/visual-qa-detectors.md`、`references/output-contract.md` | `references/reference-workflow.md#Live Evidence Protocol`、`references/reference-workflow.md#DESIGN.md Extraction` | full |
| `visual-calibration` | 用户指出“不好看 / AI 味 / 模板感 / 不像目标行业”，或已有截图 / 实现需要修 | `references/creative-direction.md`、`references/visual-qa-detectors.md`、`foundations/foundation-system.md`、`references/design-composition.md`、`references/output-contract.md` | `references/reference-workflow.md#Live Evidence Protocol`、`references/motion-block-library.md`，按反馈原因追加 | compact / standard |
| `full-system` | 新建 / 重构完整设计系统、复杂 Hybrid、多阶段交付 | 本文件的 Full-System Orchestration + 所有相关专题文件 | 所有相关 references / data / contracts | full |

## Add-on Matrix

Add-on 不会自动把任务升级到 `full-system`。它们只在当前 profile 上追加证据、素材、动效或交接要求。

Add-on routing：Reference Picker 读 `references/reference-workflow.md` + catalog + schema，输出 `reference_selection`，有 URL / 截图时加 `reference_evidence`；Shadcn resource audit 读 `components/component-system.md#Shadcn Resource Audit`，输出 Vue translation / primitive mapping / project wrapper；Domestic extraction 读 `reference-workflow.md#Domestic Case Extraction`；Creative Direction 输出 `creative_direction`；Asset Brief 输出 `asset_manifest`；Motion Block 输出 `interaction_signature` / `motion`；Component Contract 读 component system、相关 family 和 template，输出 component strategy、shadcn-vue 层和独立 contract。

## Pencil Handoff Add-on

当用户要求 `.pen`、Pencil handoff、原型截图交付，或后续阶段需要视觉证据时，在当前 profile 基础上追加 `Pencil Handoff Requirements`。design-system 只输出 handoff requirements，不调用 Pencil 工具；实际创建、修改、截图、导出、布局快照和保存验证由 `core/skills/ui-ux/pencil` 执行。

Pencil Handoff Requirements 至少写 target file、artboards（name / route / viewport / state / primary work surface）、required token groups、component contracts、asset reuse 和 evidence required（variables synced、components checked、screenshot exported、layout snapshot clean、persistence checked）。

## Selection Rules

- 先选 profile，再选 design mode；不要先选 palette、字体或动效。
- `local-component` 只读取相关组件文件，不读取 aesthetic / sample board / advanced interaction。
- `product-page` 默认禁用 GSAP / Three.js；只有步骤推进、导入导出、AI 工具链路、对象迁移或大屏编排才追加高级动效。
- `brand-surface` 允许一个主 signature，但必须有 fallback、reduced motion 和验证方式。
- `visual-calibration` 只处理修正；如果 design mode 错了，再升级到 `product-page` 或 `brand-surface`。
- `full-system` 需要写清触发原因，例如新建设计系统、复杂 Hybrid、多阶段交付或多个 profile 同时成立。
- 外部参考需求先写 `reference_selection`，再进入 design mode、palette、字体、动效和组件选择；不要把站点名当风格名。
- 没有外部参考诉求时，Markdown 写 `Reference Selection: N/A`，Design Contract JSON 不写 `reference_selection`，并在 `scan_manifest.skipped_with_reason` 记录 `reference_selection: no external reference requested`。

## Contract Hooks

本文件只负责让 profile 和 add-on 进入 `scan_manifest.workflow`，不维护第二份 required 字段表。具体 Markdown 输出、JSON 字段、条件字段和 stop conditions 以 `references/output-contract.md` 和 `contracts/design-contract.schema.json` 为准。

选择某个 add-on 后，必须输出对应证据或在 `scan_manifest.skipped_with_reason` 解释跳过原因；不要用 `null`、空对象、空字符串、`"N/A"` 或占位数组绕过合同。

## Contract Field Owners

Owners：`creative_direction` -> Creative Direction；`reference_selection` / `reference_evidence` -> Live Reference；`asset_manifest`、`interaction_signature` -> Motion / Assets；`color_system` / `foundation_system` -> Composition；`layout` / `state_matrix` / `product_ui_quality` -> Product UI Patterns；`visual_qa` / `visual_calibration` -> QA / Calibration。这些字段不替代彼此；它们把设计判断、证据、素材、动效、token、布局和质量门禁分开交接。

## Full-System Orchestration

只在 `full-system` profile、多个 profile 同时成立、参考 / 素材 / motion / Pencil / 技术交接同时出现，或后续阶段消费 Design Contract 需要检查扫描责任时启用。

Gate protocol：方向影响气质、信息架构、素材或动效时需要 Creative Direction + sample board / human question；用户给 URL、模板站、截图或外部来源时需要 `reference_selection` + `reference_evidence`；任何非小修 UI 需要 `color_system` + `foundation_system` + `token_delivery_hint`；UI 影响组件库、token、素材或动效依赖时 technical design 必须消费 Design Contract；请求 `.pen` 或视觉证据时需要 Pencil handoff requirements + screenshot review；implementation 后验证 token、状态、a11y、截图、动效和 fallback。

推荐阶段链路：`sf-ui-design` 生成 Design Contract；`pencil` 消费已确认合同生成 `.pen`；`sf-tech-design` 转成 token delivery、组件架构、asset pipeline 和 motion dependency；`sf-tasking` 拆任务；implementation 不重新发明视觉风格；verification 证明结果。

Full-system order：本文件选 profile / 升级理由 / `design_mode` -> `creative-direction.md` 输出 `creative_direction` -> `reference-workflow.md` 输出 `reference_selection` / `reference_evidence` -> `design-composition.md` + `foundations/foundation-system.md` + `data/foundation-recipes.csv` 输出 source basis、palette、font、Composition Recipe、`foundation_system` -> `motion-block-library.md#Asset Brief Add-on` 输出 `asset_manifest` -> `motion-block-library.md` + `foundation-recipes.csv#advanced_interaction` 输出 `interaction_signature` -> `product-ui-signature-patterns.md` + `components/component-system.md` 输出 layout、component strategy、state matrix -> `visual-qa-detectors.md` 输出 fail / fix / accepted reason -> `output-contract.md` + schema 输出 Markdown Summary、Design Contract JSON、Pencil handoff requirements 和 cross-stage handoff。

Mode boundary：Product UI 的参考源只能转成结构、状态和组件策略，不把 hero、Three.js 背景或全站 GSAP 带进高频工作面；Brand Surface / Hybrid 的 signature 必须有 fallback、reduced motion、asset plan 和验证方式；Hybrid 要把展示面和工作面分别扫描，写清共享 token 与隔离 token；Avatar-IP / Empty State 只影响局部反馈，不污染主系统 token。

Data selection chain：profile -> `creative_direction` unless local-component -> `reference_selection` only when external reference requested -> `reference_evidence` when URL / screenshot / reference scan exists -> `design_mode` -> palette / font / type scale -> spacing / radius-shadow / motion recipe -> asset / advanced interaction / interaction signature if needed -> component contracts -> visual QA detectors。

Manifest authority：扫描记录结构只看 `references/output-contract.md#Design Scan Manifest` 和 `contracts/design-contract.schema.json`。Full-system 只负责确保每个实际经过的阶段都进入 `scanned_files`，未走分支写入 `skipped_with_reason`，并且 `workflow` marker 与输出字段或跳过理由一致。

Full-system blockers：外部参考缺 selection / evidence / reuse boundary；React shadcn 资源进入 Vue 项目但缺 translation contract；未知 license / 付费来源被直接复制；缺 Design Scan Manifest 或 `scan_manifest.profile`；小任务默认走 full-system 且无升级理由；`selected_data` / `selection_rationale` 不对齐；Product UI 被 Brand Surface 的大标题、滚动叙事、Three.js 背景或全站动效污染；GSAP / Three.js 缺触发场景、禁用场景、fallback、reduced motion 或验证方式。
