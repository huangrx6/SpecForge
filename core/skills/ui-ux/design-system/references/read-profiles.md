# Read Profiles

本文件是 design-system 的内部子入口。每次使用 design-system 时先选择 profile，再读取对应最短链路；不要把 colors、components、motion、reference picker 拆成顶层 skill，也不要默认读取全量设计系统。

## Profile Routing

| Profile | 输入信号 | 必读文件 | 可选追加 | 默认输出 | 禁止 |
| --- | --- | --- | --- | --- | --- |
| `local-component` | 单个组件、小修视觉状态、按钮 / 表单 / badge / tooltip / card | `references/design-mode-routing.md`、`foundations/README.md`、`components/README.md`、相关 `components/*.md`、`references/output-contract.md` | `references/visual-qa-detectors.md`，仅当有截图或廉价感反馈 | compact | aesthetic 方向推荐、sample board、GSAP / Three.js |
| `product-page` | 后台列表、工作台、Dashboard、权限、设置、审批、表格 / 表单主页面 | `references/design-mode-routing.md`、`references/design-intelligence.md`、`references/product-ui-layout-quality.md`、`references/layout-archetypes.md`、`references/component-system.md`、相关 `pages/*.md`、`references/visual-qa-detectors.md`、`references/output-contract.md` | `references/motion-gsap.md`，仅当有 AI 工具调用 / 导入导出 / 步骤推进 | standard | Brand Surface 大标题、滚动叙事、Three.js 背景 |
| `brand-surface` | 官网、作品集、Web3 / AI / 活动页、品牌叙事、视觉探索 | `references/design-mode-routing.md`、`references/aesthetic-directions.md`、`references/color-system.md`、`references/palette-source-index.md`、`references/design-composition.md`、`references/advanced-interaction-source-index.md`、`pages/brand-surface.md`、`references/sample-board-template.md`、`references/visual-qa-detectors.md`、`references/output-contract.md` | `references/motion-gsap.md`、`references/font-source-index.md`、`references/design-md-extraction.md` | full | 通用 AI neon、每屏复杂动效、正文不可读 |
| `visual-calibration` | 用户指出“不好看 / AI 味 / 模板感 / 不像目标行业”，或已有截图 / 实现需要修 | `references/visual-calibration.md`、`references/visual-qa-detectors.md`、`references/color-system.md`、`references/design-composition.md`、`references/output-contract.md` | `references/advanced-interaction-source-index.md`，仅当问题涉及 GSAP / Three.js | compact / standard | 重跑完整设计系统、无证据重选全部方向 |
| `full-system` | 新建 / 重构完整设计系统、复杂 Hybrid、多阶段交付 | `references/design-system-orchestration.md` 第 2 节 full-system 链路 | 所有相关 references / data / contracts | full | 在小任务中默认使用 |

## Reference Picker Add-on

如果用户点名参考来源，或选择“组件 / 区块 / 页面 / 国内案例 / 动效 / UX / IA”等外部参考需求，在当前 profile 的基础上追加：

- `references/reference-picker.md`
- `references/reference-source-routing.md`
- `references/reference-extraction-protocol.md`
- `data/reference-source-catalog.csv`
- `contracts/reference-selection.schema.json`

Reference Picker 是 add-on，不会把 `local-component` 自动升级为 `full-system`。只有用户选择 `visual_completion`、`motion`、`domestic_design_case`、`industry_case` 或 `borrow_strength: expressive`，才考虑升级读取更多来源。

## Selection Rules

- 先选 profile，再选 design mode；不要先选 palette、字体或动效。
- `local-component` 只允许读取相关组件文件，不读取 aesthetic / sample board / advanced interaction。
- `product-page` 默认禁用 GSAP / Three.js；只有明确的步骤推进、导入导出、AI 工具链路或大屏编排才追加高级动效。
- `brand-surface` 可以使用高级交互，但只能有一个主 signature，并必须有 fallback、reduced motion 和验证方式。
- `visual-calibration` 只处理修正；如果发现 design mode 本身错误，再升级到 `product-page` 或 `brand-surface`。
- `full-system` 需要写清触发原因，例如新建设计系统、复杂 Hybrid、多阶段交付或多个 profile 同时成立。
- 外部参考需求先写 `reference_selection`，再进入 design mode、palette、字体、动效和组件选择；不要把站点名当风格名。

## Required Contract Hooks

无论 profile 大小，都必须在 Design Contract JSON 中写：

- `scan_manifest.profile`
- `scan_manifest.scanned_files`
- `scan_manifest.selected_data`
- `scan_manifest.selection_rationale`
- `reference_selection`（有外部参考诉求时必填）
- `human_confirmation`
- `token_delivery_hint`
- `visual_qa`
- `verification_hooks`
- `anti_slop_rules`

## Stop Conditions

- 未写 profile。
- 读取文件和 profile 不匹配，且没有升级理由。
- 有外部参考诉求但缺 `reference_selection`、来源路由、复用边界或禁止项。
- `selected_data` 与 `selection_rationale` id 不一致。
- 需要用户确认的方向仍是 `pending`。
- high severity `visual_qa` issue 仍是 `pending` / `blocked`。
- Product UI 缺少真实工作表面、状态矩阵或 Product UI Layout Audit。
- Brand Surface 使用高级交互但缺 fallback、reduced motion 或 verification。
