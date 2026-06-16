# Design System Orchestration

本文件负责把 design-system 里的来源、颜色、字体、空间、材质、动效、组件、Pencil 和验证串成一条稳定链路。Agent 不允许一上来读取全量设计系统；必须先选择 profile，再按最短必读链路完成扫描清单和 Design Contract。

外部参考选择必须先走 Reference Picker。用户只选择参考需求，Agent 再路由来源；不要让用户用“参考站酷品牌气质 / Awwwards 动效 / shadcnblocks dashboard”这类专业且模糊的话承担来源选择。

## 1. Profile Routing

每次进入 UI 设计，先选 profile。profile 决定读取深度、输出规模和是否允许高级交互。

| Profile | 输入信号 | 必读文件 | 可选追加 | 默认输出 | 禁止 |
| --- | --- | --- | --- | --- | --- |
| `local-component` | 单个组件、小修视觉状态、按钮 / 表单 / badge / tooltip / card | `design-mode-routing`、`foundations/README`、`components/README`、相关 `components/*.md`、`output-contract` | `visual-qa-detectors`，仅当有截图或廉价感反馈 | compact | aesthetic 方向推荐、sample board、GSAP / Three.js |
| `product-page` | 后台列表、工作台、Dashboard、权限、设置、审批、表格 / 表单主页面 | `design-mode-routing`、`design-intelligence`、`product-ui-layout-quality`、`layout-archetypes`、`component-system`、相关 `pages/*.md`、`visual-qa-detectors`、`output-contract` | `motion-gsap`，仅当有 AI 工具调用 / 导入导出 / 步骤推进 | standard | Brand Surface 大标题、滚动叙事、Three.js 背景 |
| `brand-surface` | 官网、作品集、Web3 / AI / 活动页、品牌叙事、视觉探索 | `design-mode-routing`、`aesthetic-directions`、`color-system`、`palette-source-index`、`design-composition`、`advanced-interaction-source-index`、`pages/brand-surface.md`、`sample-board-template`、`visual-qa-detectors`、`output-contract` | `motion-gsap`、`font-source-index`、`design-md-extraction` | full | 通用 AI neon、每屏复杂动效、正文不可读 |
| `visual-calibration` | 用户指出“不好看 / AI 味 / 模板感 / 不像目标行业”，或已有截图 / 实现需要修 | `visual-calibration`、`visual-qa-detectors`、`color-system`、`design-composition`、`output-contract` | `advanced-interaction-source-index`，仅当问题涉及 GSAP / Three.js | compact / standard | 重跑完整设计系统、无证据重选全部方向 |
| `full-system` | 新建 / 重构完整设计系统、复杂 Hybrid、多阶段交付 | 本文件第 2 节 full-system 链路 | 所有相关 references / data / contracts | full | 在小任务中默认使用 |

## 2. Reference Picker Gate

以下任一情况必须追加 Reference Picker：

- 用户点名 shadcnblocks、shadcn.io、shadcn/ui blocks、21st.dev、shadcnuikit、shadcnspace、站酷、UXUE、UI 中国、MasterGo、Pixso、Awwwards、Crafted、Ant Design、Semi、Vue admin 模板等来源。
- 用户说“找参考、找案例、参考后台模板、参考国内产品感、参考动效、参考 UX / IA 方法”。
- Agent 准备主动检索外部设计案例。

读取顺序：

| 顺序 | 文件 | 作用 |
| --- | --- | --- |
| 1 | `references/reference-picker.md` | 把用户意图转成 UI 类型、参考目标、借鉴强度、模块和视觉方向 |
| 2 | `references/reference-source-routing.md` | 把选择映射到来源池 |
| 3 | `data/reference-source-catalog.csv` | 查询来源 id、URL、用途、许可边界和 Product UI guardrail |
| 4 | `references/reference-extraction-protocol.md` | 规定可抽取、必须转换、禁止复制和离线行为 |
| 5 | `contracts/reference-selection.schema.json` | 约束 `Design Contract JSON.reference_selection` |

Reference Picker 输出 `reference_selection`，它不替代 `design_mode`。后续仍必须继续做 mode routing、Composition Recipe、Product UI Layout Audit、Visual QA 和 Design Contract JSON。

## 3. Full-System 扫描顺序

只有 profile 为 `full-system`，或 profile 明确升级时，才按下面顺序推进。某一步不适用时也要写跳过理由。

| 顺序 | 阶段 | 必读 / 按需文件 | 产物 | 不能跳过的原因 |
| --- | --- | --- | --- | --- |
| 1 | 参考源选择（按需） | `references/reference-picker.md`、`references/reference-source-routing.md`、`references/reference-extraction-protocol.md` | `reference_selection`、Reference Source Routing、Reference Scan Manifest、Extracted Reference Patterns | 用户提供外部参考或要求多看好网站时，需要防止 Agent 把网站名误读成风格名，或直接复制外部资产 |
| 2 | 模式路由 | `references/design-mode-routing.md` | `design_mode`、输出深度、禁止项 | 模式判断错了，后面所有审美都会误套 |
| 3 | 设计意图 | `references/design-intelligence.md`、`references/ux-research-ia.md` | subject、audience、single job、signature | 避免像任何同类模板 |
| 4 | 来源扫描 | `references/composition-source-index.md`、`references/font-source-index.md` | source basis、font source | 确保字体、空间、动效不是凭感觉 |
| 5 | 色彩系统 | `references/color-system.md`、`references/palette-source-index.md`、`data/aesthetic-palettes.csv` | palette_id、semantic tokens、contrast checks | 色彩必须映射 token 和许可来源 |
| 6 | 组合配方 | `references/design-composition.md`、4 张 foundation 数据表、`data/font-pairing-recipes.csv` | Composition Recipe、foundation_system | 让字体、间距、圆角、阴影、动效同气质 |
| 7 | 高级交互 | `references/advanced-interaction-source-index.md`、`data/advanced-interaction-recipes.csv`、`references/motion-gsap.md` | advanced interaction decision | GSAP / Three.js 只能在合适场景出现 |
| 8 | 页面与组件 | `references/product-ui-layout-quality.md`、`references/layout-archetypes.md`、`references/component-system.md`、组件契约 | layout、component strategy、state matrix | 避免卡片汤、空壳 Dashboard、primitive pile |
| 9 | 视觉审查 | `references/visual-qa-detectors.md`、`references/design-review-rubric.md` | fail signal、fix / accepted reason | 把“垃圾设计”变成可修复检查 |
| 10 | 视觉校准 | `references/visual-calibration.md` | 用户反馈 / 截图诊断、palette delta、修正状态 | 防止实现后仍像 AI 模板或默认审美 |
| 11 | 输出交接 | `references/output-contract.md`、`references/cross-stage-handoff.md`、`contracts/design-contract.schema.json` | Markdown Summary、Design Contract JSON、Pencil handoff | 后续阶段不再凭自然语言猜 |

## 4. Design Mode 扫描矩阵

| Design mode | 必扫来源 | 参考源路由 | 必选数据 | 高级交互默认 | 不允许 |
| --- | --- | --- | --- | --- | --- |
| Product UI | mode、intelligence、font source、color、composition、product layout、component、visual QA | 可用 shadcn / admin / 国内 B 端案例作为结构和组件参考；Awwwards / Brand Surface 动效默认 N/A | palette、font source、type scale、spacing density、radius / shadow、motion recipe | `N/A` 或 Product UI 级微交互 | Hero 动效、Three.js 背景、全站 GSAP |
| Brand Surface | mode、intelligence、font source、color、composition、advanced interaction、visual QA | 可用 Awwwards / Crafted / 炫网站 / 站酷 / UI 中国作为版式、动效、视觉完成度参考，但必须保留可访问性、fallback 和 license boundary | palette、display/body 字体搭配、brand spacing、signature material、motion recipe | 可选一个 GSAP / Three.js signature | 每屏都有复杂动效、正文不可读 |
| Hybrid | mode、intelligence、font source、color、composition、advanced interaction、product layout、component | 展示面和工作面分别路由来源；展示面可参考品牌 / 动效案例，工作面回到 Product UI 来源 | 展示面和工作面各自的 foundation | 展示面可用高级交互，工作面回到 Product UI | 把展示面装饰带进表格 / 表单 |
| Avatar-IP | mode、font source、color、composition、advanced interaction | 可参考国内插画 / 空态 / 微文案案例，但不能污染全局 token | 局部字体 / 插图 / motion recipe | 只用于头像、空态、引导 | 污染主系统 token |
| Empty State | mode、font source、color、composition、component、visual QA | 可参考国内插画 / 空态 / 微文案案例，但不能污染全局 token | 空态文案、恢复动作、轻动效 | 通常不用 Three.js | 只有插图没有下一步 |

## 5. 数据选择顺序

先选择 mode，再选择数据。不要先选动效或字体。

```text
profile
  -> reference_selection / N/A
  -> source_routing / N/A
  -> extracted_patterns / N/A
  -> design_mode
design_mode
  -> palette_id
  -> palette_de_template_check
  -> font_source_id
  -> font_pairing_id
  -> type_scale_id
  -> spacing_density_id
  -> radius_shadow_recipe_id
  -> motion_recipe_id
  -> advanced_interaction_recipe_id / N/A
  -> component_contracts
  -> visual_qa_detectors
  -> visual_calibration / N/A
```

## 5.1 Brand Surface De-template Gate

Brand Surface / Hybrid 不能因为用户说“Web3 / AI / 科技 / 炫酷”就默认使用青紫霓虹。选择 palette 后必须执行一次 de-template gate：

| 检查项 | 如果为 yes |
| --- | --- |
| 是否是常见 cyan + violet + rose + glow 组合 | 选择非默认 palette，或写 custom palette delta |
| 主按钮是否靠多色渐变显得“高级” | 改成单色、材质色或边框 / 光强变化 |
| Three.js / GSAP 是否只是抽象背景 | 让滚动、内容状态或品牌对象驱动高级交互 |
| 字体、间距、材质是否仍像通用 SaaS 模板 | 至少替换 type scale、surface treatment 或 signature carrier |

如果用户或截图反馈“AI 味 / 模板感 / 不像目标行业”，必须读 `references/visual-calibration.md` 并把修正写入 `visual_calibration`。

## 6. 字体决策规则

| 情况 | 决策 |
| --- | --- |
| Product UI / 后台 / 审批 / 表格 | 默认使用内置系统字体栈；除非用户明确要求品牌字体 |
| 用户要求中文品牌感 | 从 `font-source-index.md` 选择国内可访问官方来源，并记录 license note |
| 字体许可不清楚 | 不下载、不内置、不写进实现；改用 system stack 或开源字体 |
| 字体下载源不是官方 | 可以作为发现入口，不能作为 license source |
| 需要离线 / 内网部署 | 优先 system stack；如需内置，必须把字体文件来源、许可和文件体积写入 technical design |

## 7. 高级交互决策规则

| 情况 | 允许 | 默认 |
| --- | --- | --- |
| 普通表格、表单、后台菜单 | CSS transition | 禁止 GSAP / Three.js |
| 多步骤导入、审批流、AI 工具调用 | CSS + Motion + 少量 GSAP timeline | GSAP 只表达进度和状态 |
| 品牌首页、活动页、作品集 | GSAP ScrollTrigger / timeline 或 Three.js signature | 只能有一个主 signature |
| 3D 产品展示、空间关系、数据网络 | Three.js / React Three Fiber / TresJS | 必须有静态 fallback |
| 用户开启 reduced motion | 停止 travel、循环、视差和 3D 镜头运动 | 保留最终状态和可读内容 |

## 8. Design Scan Manifest

`ui-design.md` 必须输出扫描记录。没有扫描记录，后续阶段无法知道 design-system 是否真的被调用。

```md
Design Scan Manifest:
| Profile | local-component / product-page / brand-surface / visual-calibration / full-system |
| --- | --- |

| 文件 | 用途 | 状态 | 结论 / 跳过理由 |
| --- | --- | --- | --- |
| references/design-mode-routing.md | 模式路由 | scanned | Product UI |
| references/font-source-index.md | 字体来源 | scanned | system-ui + PingFang SC |
| references/advanced-interaction-source-index.md | 高级交互 | skipped | Product UI 高频后台不使用 |
```

JSON 中同步写入：

```json
{
  "reference_selection": {
    "ui_type": ["dashboard", "admin", "data-table"],
    "stack": ["vue", "shadcn-vue", "tailwind"],
    "selected_needs": ["page-structure", "block-composition", "domestic-ui-case"],
    "borrow_strength": "moderate",
    "admin_modules": ["app-shell", "dashboard", "data-table"],
    "visual_direction": ["domestic-internet-product", "clean-professional"],
    "source_routing": [
      {
        "selected_need": "page-structure",
        "source_pool": ["shadcn-vue", "vue-vben-admin", "soybean-admin"],
        "use_for": ["app shell anatomy", "dashboard layout", "state coverage"],
        "reuse_mode": "page-pattern-only",
        "required_extraction": ["layout anatomy", "component composition", "state coverage"],
        "avoid": ["template source copy", "theme clone", "unknown license assets"],
        "offline_fallback": "Use local page patterns, component-system and visual-qa-detectors"
      }
    ],
    "reuse_boundary": [
      "Extract layout anatomy, component anatomy and state coverage only",
      "Translate React shadcn resources into shadcn-vue component contract / project wrapper before implementation",
      "Do not copy code, screenshots, paid template assets, illustrations or brand copy"
    ],
    "offline_behavior": "If sources are offline, use data/reference-source-catalog.csv and local design-system references; record fallback in Reference Scan Manifest",
    "human_confirmation": {
      "status": "defaulted",
      "reason": "User requested external references; Product UI uses moderate borrow strength as reversible default"
    },
    "forbidden": ["Do not copy React code into Vue", "Do not apply Awwwards motion to Product UI tables"]
  },
  "scan_manifest": {
    "profile": "product-page",
    "workflow": ["mode", "reference", "source", "font", "color", "composition", "advanced_interaction", "component", "qa", "calibration", "output"],
    "scanned_files": [
      {
        "path": "references/design-mode-routing.md",
        "purpose": "模式路由",
        "status": "scanned",
        "finding": "Product UI"
      }
    ],
    "selected_data": {
      "palette_id": "",
      "font_source_id": "",
      "font_pairing_id": "",
      "type_scale_id": "",
      "spacing_density_id": "",
      "radius_shadow_recipe_id": "",
      "motion_recipe_id": "",
      "advanced_interaction_recipe_id": "none-product-ui"
    },
    "selection_rationale": {
      "palette": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "font_source": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely",
        "license": ""
      },
      "font_pairing": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "type_scale": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "spacing_density": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "radius_shadow": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "motion": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "advanced_interaction": {
        "id": "none-product-ui",
        "why": "Product UI 高频后台不需要 GSAP / Three.js signature",
        "rejected": ["brand-hero-gsap", "three-data-spatial"],
        "risk": "若后续出现多步骤导入或 AI 工具调用，需要重新选择高级交互 recipe",
        "confidence": "likely"
      }
    },
    "skipped_with_reason": [
      {
        "path": "references/advanced-interaction-source-index.md",
        "reason": "Product UI 高频后台不需要 GSAP / Three.js signature"
      }
    ]
  }
}
```

## 9. 阻断条件

以下情况必须退回补设计，不允许进入 Pencil / implement：

- 用户要求外部参考但没有 `reference_selection`、来源路由、扫描记录、复用边界和禁止项。
- 用户提供外部参考，但没有 Reference Selection。
- 使用外部来源，但没有复用边界。
- React shadcn 资源进入 Vue 项目但没有 Vue translation contract。
- 未知 license / 付费来源被直接复制。
- Product UI 使用 Awwwards / Brand Surface 动效污染高频后台控件。
- 来源不可访问但未记录 fallback。
- 没有 `Design Scan Manifest`。
- 没有 `scan_manifest.profile`，或小任务默认走 `full-system` 且没有升级理由。
- `selected_data` 只有 palette，没有字体、间距、圆角阴影、动效配方。
- `selected_data` 只有 id，没有 `selection_rationale` 说明选择理由、拒绝项、风险和置信度。
- Product UI 使用 Brand Surface 的大标题、滚动叙事、Three.js 背景或全站动效。
- Brand Surface 使用高级交互但没有 fallback、reduced motion 和性能预算。
- Brand Surface / Hybrid 被指出 AI 味、模板感或默认 cyber 风，但没有 Visual Calibration 和 palette delta。
- 字体来源没有官方 URL 或 license note。
- React shadcn 资源直接进入 Vue 实现，没有 `Shadcn Resource Audit`。
- Awwwards / 品牌页动效污染 Product UI 表格、表单、权限、长期办公工作面。
- GSAP / Three.js 方案没有说明触发场景、禁用场景和验证方式。
