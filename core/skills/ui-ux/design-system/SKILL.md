---
name: design-system
description: SpecForge UI 设计规范 skill；用于可见体验、设计语言、Design Contract、组件契约、token、动效、视觉 QA 和跨阶段交接。凡涉及新页面、页面重构、后台 / 品牌页 / Web3 / AI / 大屏 / 移动 H5 / 组件系统、Pencil handoff、截图审查、去廉价感、动效或 shadcn-vue UI 落地时，都应使用本 skill。
---

# Design System Skill

本 skill 是 SpecForge 的统一 UI 设计系统入口。不要把它拆成多个顶层 skill；颜色、字体、组件、动效、Pencil handoff requirements、视觉 QA 和实现提示必须汇总到同一个 Design Contract，避免后续阶段各读各的。

Reference Picker 是本 skill 的面向用户参考选择机制：用户只选择“组件封装、区块组合、后台模板、国内案例、动效、UX / IA”等需求，Agent 再自动路由到 shadcn 生态、国内设计案例、Awwwards / GSAP / Motion、Ant Design / Semi、Vue admin 模板等来源。不要让用户必须知道每个网站里有什么。

## 什么时候使用

- 需求涉及新页面、页面重构、可见组件、后台 / 管理端 / Dashboard / 大屏 / 会员 / 直播间 / 移动 H5。
- 用户提到“不要廉价感”“更有品味”“AI 味太重”“设计语言统一”“参考 shadcn-vue”“要动效 / GSAP / Three.js”。
- 用户提到“参考 shadcnblocks / 站酷 / Awwwards / 21st.dev / Ant Design / Semi / Vue admin 模板”，或表达“找一些参考案例 / 区块 / 动效 / 国内后台感觉”。
- 用户提到 shadcnblocks、shadcn.io templates、shadcn/ui blocks、21st.dev、站酷、UXUE、Awwwards、Crafted、MasterGo、Pixso、UI 中国、优设、Vue admin 模板等外部参考来源。
- 用户说“多看一些好的网站”“参考一些模板”“参考国内 UI 案例”“参考 shadcn 组件”“参考优秀后台页面”等，但不知道怎么描述具体方向。
- 用户希望以选择题方式确定参考目标，而不是手写专业提示词。
- `sf-ui-design` 需要把截图、竞品、品牌素材、现有组件库或 Pencil 证据转成 `ui-design.md`。
- `sf-tech-design`、`sf-tasking`、`sf-implement`、`sf-verify` 或 `pencil` 需要读取 token、组件、动效、视觉 QA、Pencil variable hints 或 prototype constraints。

不调用的情况：纯后端、纯数据迁移、无 UI 表面的脚本任务；若只是文案或图标微调，用 `local-component` profile，不走完整设计系统。

## 读取顺序

1. 先读 `references/read-profiles.md`，选择本轮 read profile。
2. 读 `references/design-mode-routing.md`，先判断 Product UI、Brand Surface、Hybrid、Avatar-IP 或 Empty State。
3. 如果用户提供外部模板、设计网站、设计社区、shadcn blocks、国内案例或要求“多参考一些好网站”，先读 `references/reference-picker.md` 和 `references/reference-source-routing.md`，用选择题收集 `reference_selection`，再决定读取 shadcn 生态、国内案例、动效案例、UX / IA 方法或 admin 模板来源。
4. 需要外部来源抽取时，继续读 `references/reference-extraction-protocol.md`，并用 `data/reference-source-catalog.csv` 生成来源路由、复用边界和禁止项。
5. 按 profile 读取最短链路；不要默认读取全量 references / data。
6. 需要完整编排时再读 `references/design-system-orchestration.md`。

| Profile | 适用场景 | 输出规模 |
| --- | --- | --- |
| `local-component` | 单组件、小状态、按钮 / 表单 / badge / tooltip / card | compact |
| `product-page` | 后台列表、工作台、权限、设置、Dashboard、表格 / 表单主任务 | standard |
| `brand-surface` | 官网、作品集、Web3 / AI / 活动页、品牌叙事 | full |
| `visual-calibration` | 用户反馈“不好看 / AI 味 / 模板感”，或已有截图 / 实现要修 | compact / standard |
| `full-system` | 新建 / 重构完整设计系统、复杂 Hybrid、多阶段交付 | full |

如果实际读取超过 profile 必读链路 2 个以上文件，必须在 `scan_manifest.skipped_with_reason` 或扫描记录里说明升级原因。

## 工具链

1. **Read profile routing**：先判断本轮是 `local-component`、`product-page`、`brand-surface`、`visual-calibration` 还是 `full-system`，控制读取成本。
2. **Design mode routing**：判断 Product UI / Brand Surface / Hybrid / Avatar-IP / Empty State，避免把品牌页审美套到高频后台工作面。
3. **Reference picker**：把用户模糊的外部参考诉求转为选择题，包括 UI 类型、参考目标、借鉴强度、后台模块、视觉方向和技术约束。
4. **Reference source routing**：根据选择结果路由到合适来源池，例如 shadcnblocks components、shadcn/ui blocks、21st.dev、站酷、UXUE、Awwwards、MasterGo、Pixso、Vue admin 模板等。
5. **Reference extraction**：只抽取 pattern、layout anatomy、component anatomy、state coverage、visual completion、motion boundary、UX / IA 方法和 anti-reference，不复制外部代码、图片、截图、文案或付费资产。
6. **Composition recipe**：把颜色、字体、字号、行高、间距、圆角、阴影、动效和 GSAP / Three.js signature 合成同一套 foundation system。
7. **Component contract**：把组件来源转成 shadcn-vue primitive、project wrapper、状态矩阵、props / events / slots 和验证面。
8. **Visual QA**：用 detector 检查 generic SaaS shell、card soup、KPI wallpaper、default AI neon、motion noise、state missing 等问题。
9. **Cross-stage handoff**：输出 Markdown Summary 和 Design Contract JSON，让 technical design、tasking、implementation、verification 稳定消费。

## 输出契约

所有 profile 都必须输出 Design Contract Summary，并包含机器可读 JSON。核心 contract 见：

- `contracts/design-contract.schema.json`：顶层一体化 Design Contract。
- `contracts/reference-selection.schema.json`：`reference_selection` 子契约。
- `contracts/selected-data.schema.json`：`scan_manifest.selected_data` 和 `selection_rationale` 子契约。
- `contracts/visual-qa.schema.json`：`visual_qa` 子契约。
- `contracts/component-contract.template.md`：复杂 / 复用组件独立契约模板。
- `references/output-contract.md`：compact / standard / full 输出格式。
- `references/cross-stage-handoff.md`：交给 `sf-tech-design`、`sf-tasking`、`sf-implement`、`sf-verify` 的读取规则。
- `references/read-profiles.md#Pencil Handoff Add-on`：给 `pencil` skill 的画板、状态、token group、组件契约和证据要求。
- `prompts/reference-picker.md`：把模糊外部参考诉求转成选择题。
- `prompts/source-routing.md`：把用户选择路由到合适来源池。
- `prompts/reference-extraction.md`：从外部来源抽取可复用 pattern。
- `prompts/shadcn-resource-audit.md`：审查 shadcn 生态资源并转成 Vue / wrapper 契约。
- `prompts/domestic-design-case-extraction.md`：抽取国内设计案例的 UI / UX pattern。

Design Contract JSON 至少要让后续阶段稳定读取：

- `scan_manifest.profile`、`selected_data`、`selection_rationale`
- `reference_selection`（仅外部参考诉求时出现；无外部参考时省略）
- `design_mode`、`human_confirmation`
- `color_system`、`foundation_system`、`token_delivery_hint`
- `component_strategy`、`shadcn_vue`
- `layout`、`state_matrix`、`product_ui_quality`（Product UI / Hybrid）
- `motion`、`visual_qa`、`visual_calibration`
- `verification_hooks`、`anti_slop_rules`

## 输出到 SpecForge

| 内容 | 写入位置 |
| --- | --- |
| Reference Selection：UI 类型、参考目标、借鉴强度、来源路由和复用边界 | `01-spec/ui-design.md#Reference Selection` 和 `Design Contract JSON.reference_selection` |
| Reference Scan Manifest：来源是否访问、fallback、license 状态、抽取结果 | `01-spec/ui-design.md#Reference Scan Manifest` |
| Extracted Patterns：从 shadcn / 国内案例 / Awwwards 等来源抽取的结构、组件、动效和 UX pattern | `01-spec/ui-design.md#Extracted Reference Patterns` |
| 设计语言摘要、token、密度、动效边界 | `01-spec/ui-design.md#Visual Style Brief` |
| Design Scan Manifest：profile、扫描文件、选择的数据 id、跳过理由 | `01-spec/ui-design.md#Design Scan Manifest` 和 `Design Contract JSON.scan_manifest` |
| Composition Recipe：字体、空间、圆角阴影、动效、signature、source basis、anti-reference | `01-spec/ui-design.md#Composition Recipe` 和 `Design Contract JSON.foundation_system` |
| 组件契约、shadcn-vue primitive / project wrapper 映射 | `01-spec/ui-design.md#Admin Component Contract` 和 `01-spec/design/components/*.contract.md` |
| Product UI 主要使用者、业务对象、任务、布局模式、首屏工作表面和空白预算 | `01-spec/ui-design.md#Product UI Layout Audit` |
| 视觉质量审查、修正动作、接受理由 | `01-spec/ui-design.md#Visual QA` 和 `Design Contract JSON.visual_qa` |
| Pencil Handoff Requirements：目标 `.pen`、画板、状态、token group、组件契约和证据要求 | `01-spec/ui-design.md#Pencil Handoff Requirements` |
| 跨阶段 token / wrapper / motion / verification hooks | `01-spec/ui-design.md#Design Contract Summary` |

## 工作原则

- 外部网站不是风格名，而是资源池；用户选择参考目标，系统负责来源路由。
- shadcnblocks / shadcn.io / 21st.dev 等优先作为组件、区块、页面和模板 pattern source，不默认作为视觉风格。
- 站酷 / UXUE / UI 中国 / MasterGo / Pixso 等优先作为国内 UI 案例、设计方法、行业案例、视觉完成度和中文信息密度来源，不写成“站酷品牌气质”。
- Awwwards / Crafted 等优先用于 Brand Surface / Hybrid 的动效、交互、版式和视觉完成度；Product UI 高频后台默认不引入品牌页式动效。
- React shadcn 资源必须转译成 shadcn-vue component contract / project wrapper，不能直接复制代码。
- 未确认 license、付费模板、商业资产、截图、插画、文案一律只能抽象为 pattern，不允许复制。
- Reference Picker 不替代 `design_mode`、Composition Recipe、Product UI Layout Audit 或 Visual QA；它只负责把“参考什么”变成可路由、可审查的来源选择记录。
- 如果外部来源不可访问，必须记录 offline fallback，不允许假装已经扫描。

## 阻断条件

以下情况不允许进入 Pencil handoff / technical design / implementation：

- 没有选择 read profile，或小任务默认走 `full-system` 且没有升级理由。
- 有外部参考诉求但没有 `reference_selection`、`Reference Source Routing`、`Reuse Boundary` 和 `forbidden`。
- 缺少可解析的 Design Contract JSON。
- 需要人工确认的审美方向、IA、首屏层级或核心流程仍是 `human_confirmation.status: "pending"`。
- Agent 推荐被写成用户已确认；只有用户明确选择才能写 `confirmed`。
- `selected_data` 只有 id，没有 `selection_rationale` 说明选择理由、拒绝项、风险和置信度。
- 缺少 `token_delivery_hint`，导致 tech design 无法判断 CSS variables / Tailwind / Pencil variable hints。
- Product UI / Hybrid 缺少真实工作表面、状态矩阵或 `product_ui_quality`。
- `visual_qa` 里 high severity issue 仍是 `pending` / `blocked`。
- GSAP / Three.js 被使用但没有 fallback、reduced motion 和 verification。
- React shadcn 资源直接进入 Vue 实现，没有先转成 shadcn-vue component contract / project wrapper / page pattern。
- Awwwards / 品牌动效被用于 Product UI 高频表格、表单、权限或长期办公工作面。

## 完成标准

- `ui-design.md` 能说明设计为什么属于这个产品，而不是只解释为什么“高级”。
- Design Contract JSON 符合 `contracts/design-contract.schema.json`，并同步 Markdown Summary。
- 如果使用外部参考，用户选择题、来源路由、扫描记录、抽取 pattern、复用边界和禁止项都写入 `reference_selection`。
- 用户提出外部参考时，`ui-design.md` 必须包含 Reference Selection 和 Reference Scan Manifest。
- 使用外部参考时，Design Contract JSON 必须包含 object 形式的 `reference_selection`；没有外部参考时，Markdown 写 `Reference Selection: N/A`，JSON 不写 `reference_selection`，并在 `scan_manifest.skipped_with_reason` 说明。
- 每个外部来源必须写清 adopt / adapt / avoid / reuse boundary。
- 如果外部来源不可访问，必须记录 offline fallback，不允许假装已扫描。
- Product UI 没有 empty dashboard skeleton、KPI wallpaper、blank framed content、card soup 或 primitive pile。
- Brand Surface / Web3 / AI 页面避免默认 cyan + violet + rose + glow 模板，并有 signature、fallback 和 reduced motion。
- 后续阶段能直接读取 token、组件、状态、动效、Pencil handoff requirements、Visual QA 和验证 hook，不需要重新猜设计意图。
