# Cross-stage Design System Handoff

本文件定义 design-system 如何贯穿 `sf-ui-design`、`sf-tech-design`、`sf-implement` 和 `sf-verify`。设计系统不是只给设计阶段看的审美材料，而是可被 AI agent 和工程实现共同读取的约束源。

## Research notes

| # | Source | Takeaway | SpecForge action |
| --- | --- | --- | --- |
| 1 | Impeccable | AI 前端需要共享设计词汇、命令化审查和 deterministic detector，而不是只靠“更高级”这类模糊提示。 | 增加 stage command vocabulary：shape、critique、harden、animate、polish 映射到 SpecForge 阶段。 |
| 2 | Impeccable | `PRODUCT.md` / `DESIGN.md` 让 agent 每次迭代都能读取 audience、brand lane、voice、anti-reference、colors、type 和 components。 | `ui-design.md` 必须产出可被 tech / implement 引用的 Design Contract Summary。 |
| 3 | Impeccable | 设计质量可以有 deterministic rules：nested cards、purple gradients、gray text on color、bounce easing、cramped padding、small touch targets。 | 在 visual QA 和 implementation self-check 中增加可机械检查的 anti-slop rule。 |
| 4 | Agentic Design Systems | AI 是设计系统的新用户；机器需要结构化 metadata，而不是只读人类长文档。 | 组件文档增加 Machine contract：identity、props、variants、states、usage、anti-pattern。 |
| 5 | Agentic Design Systems | JSON 适合作为组件/API 契约，Markdown 适合 LLM 指令；混合模式比纯 Markdown 更稳。 | 后续可添加 `components/*.contract.json`，当前先在 Markdown 中稳定字段名。 |
| 6 | Agentic Design Systems | Foundations 应该 always-on，组件细节按需读取，避免 token 漏读后模型回到互联网平均值。 | `sf-tech-design` 和 `sf-implement` 必须先读 foundations，再按页面读组件。 |
| 7 | Spec-driven development | Design system constraints 不应该后置；它们属于 technical plan，并直接指导 implementation。 | technical design 要写 Component Architecture、Registry / Wrapper、Motion Decision。 |
| 8 | Addy Osmani spec guidance | 大规格会吃掉注意力，smart spec 要短、明确、可演进。 | design-system 输出按 compact / standard / full 分层，避免把全部规范复制进 artifact。 |
| 9 | shadcn-vue | shadcn-vue 是可定制、可扩展、可自建 registry 的基础，不是完整项目设计系统。 | design-system 必须要求 project wrapper，technical design 决定 registry / local wrapper 边界。 |
| 10 | Vue Bits | Vue Bits 是 React Bits 的官方 Vue port，提供可定制 props 的 Vue/Nuxt 动效组件。 | 作为 inspiration / optional source；Product UI 只引入有任务价值的组件，不照搬装饰型特效。 |
| 11 | Motion | Motion 支持 React、JavaScript 和 Vue，适合生产级 UI 动效和 agent-compatible docs。 | Vue 项目优先考虑 Motion 或 CSS transition；复杂品牌/大屏再考虑 GSAP / Vue Bits。 |
| 12 | Design token practice | AI 如果不能读取 token，会产生硬编码颜色、间距、不可访问状态和组件雪花化。 | implementation 阶段禁止绕过 semantic token 和 project wrapper 直接堆 Tailwind arbitrary value。 |

## Stage contract

| Stage | design-system role | Must produce / consume | Stop condition |
| --- | --- | --- | --- |
| `sf-brainstorm` | 给 2-3 个互斥审美方向、体验取舍和样例板 | Aesthetic options、sample board、人工确认点 | 用户未确认会影响气质或 IA 的方向 |
| `sf-ui-design` | 把选择的方向落成可审查的设计语言 | Design Contract Summary、Reference Selection、Reference Scan Manifest、Extracted Reference Patterns、Foundations Pack、Component Contract、Page Patterns、Motion Boundary | 没有 signature、token、组件状态、reference boundary 或 visual QA |
| `sf-tech-design` | 把设计语言和参考来源转成工程架构 | 消费 `reference_selection`，判断哪些来源只是 inspiration，哪些可以转成 component wrapper / registry / implementation reference；产出 Component Architecture、shadcn-vue registry / local wrapper、token delivery、motion dependency、test surface | UI 有影响但未决定组件库、wrapper、token、动效实现或 reference reuse boundary |
| `sf-tasking` | 把 design contract 和外部参考转译拆成任务边界 | Token task、wrapper task、page task、state task、a11y task、visual verification task；外部参考只能拆成 wrapper / page / state / visual verification task | 任务写成“照某模板实现”，或只写页面文件，不覆盖组件契约和状态验证 |
| `sf-implement` | 按 contract 实现，不重新设计、不复制外部来源 | Read order、semantic tokens、project wrappers、motion adapter、state matrix evidence；禁止直接复制未知 license、付费模板或 React shadcn 代码到 Vue | 硬编码 token、直接拼 primitive、重新选择视觉风格、复制外部代码 / 资产 |
| `sf-verify` | 检查设计实现一致性和 reference boundary | Screenshot / DOM / a11y / responsive / motion evidence；检查 reuse boundary、state matrix、visual QA、token adherence 和是否违反 forbidden | 只验证接口或构建，不验证 UI 状态、视觉回归或 reference forbidden |
| `sf-wiki` | 沉淀长期可复用规则 | `.specforge/wiki/design-system.md` 或 N/A reason | 稳定 token / component 只留在单个 work item |

## Design Contract Summary

`ui-design.md` 应提供这段可被后续阶段直接复制引用的摘要。Markdown 给人读，JSON 给后续 agent 稳定解析；两者必须表达同一组事实。

```md
Design Contract Summary:
- Reference selection:
  - UI type:
  - Selected needs:
  - Source routing:
  - Reuse boundary:
  - Offline behavior:
  - Human confirmation:
- Scan manifest:
  - Profile:
  - Scanned files:
  - Selected data:
  - Skipped with reason:
- Design mode:
- Aesthetic direction:
- Signature:
- Color system:
- Foundation system:
  - Source basis:
  - Typography:
  - Spacing:
  - Radius / shadow:
  - Motion recipe:
- Token source:
- Component strategy:
- Product UI layout audit:
  - Primary user / object / job:
  - Layout archetype:
  - Primary work surface:
  - KPI actionability:
  - Content budget:
  - Right rail purpose:
  - Rejected filler:
- shadcn-vue primitive layer:
- Project wrapper layer:
- Motion source:
  - Layer 1 (CSS):
  - Layer 2 (Motion Vue / CSS animation):
  - Layer 3 (GSAP):
  - Reduced motion:
  - Handoff artifact:
- Advanced interaction:
  - Recipe:
  - Dependency decision:
  - Fallback:
  - Verification:
- Visual calibration:
  - Feedback source:
  - Palette delta:
  - Anti-reference:
  - Next review:
- Anti-slop rules:
- Verification hooks:
```

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
        "path": "references/design-system-orchestration.md",
        "purpose": "设计流程编排",
        "status": "scanned",
        "finding": ""
      },
      {
        "path": "references/design-mode-routing.md",
        "purpose": "模式路由",
        "status": "scanned",
        "finding": ""
      },
      {
        "path": "references/font-source-index.md",
        "purpose": "字体来源",
        "status": "scanned",
        "finding": ""
      },
      {
        "path": "references/design-composition.md",
        "purpose": "组合配方",
        "status": "scanned",
        "finding": ""
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
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      }
    },
    "skipped_with_reason": []
  },
  "design_mode": "Product UI",
  "aesthetic_direction": "",
  "human_confirmation": {
    "required": true,
    "reason": "Aesthetic direction changes information architecture or first viewport task hierarchy",
    "options_presented": [
      "minimal editorial",
      "dense command center",
      "warm operational"
    ],
    "selected": "dense command center",
    "status": "confirmed",
    "default_reversibility": "Safe to change palette and spacing without schema, permission or data migration"
  },
  "signature": {
    "type": "structural",
    "description": ""
  },
  "color_system": {
    "palette_id": "",
    "aesthetic_direction": "",
    "design_mode": "Product UI",
    "tokens": {
      "background": "",
      "surface": "",
      "surface_muted": "",
      "text": "",
      "text_muted": "",
      "primary": "",
      "secondary": "",
      "accent": "",
      "border": "",
      "success": "",
      "warning": "",
      "danger": "",
      "chart": []
    },
    "usage_rules": {
      "primary_usage": "",
      "accent_usage": "",
      "background_usage": "",
      "avoid": []
    },
    "accessibility": {
      "requires_contrast_check": true,
      "dark_mode_ready": false,
      "contrast_checks": [
        {
          "pair": "text_on_surface",
          "ratio": "",
          "status": "not-checked"
        }
      ]
    },
    "source": "",
    "source_url": "",
    "license_note": ""
  },
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
  },
  "token_source": "existing",
  "token_delivery_hint": {
    "css_variables": [
      "--sf-bg",
      "--sf-surface",
      "--sf-text",
      "--sf-primary",
      "--sf-radius-card",
      "--sf-motion-fast"
    ],
    "tailwind_mapping": {
      "colors.background": "var(--sf-bg)",
      "colors.primary": "var(--sf-primary)",
      "borderRadius.card": "var(--sf-radius-card)"
    },
    "pencil_variables": [
      "color.background",
      "color.surface",
      "type.body",
      "space.3"
    ],
    "notes": "Implementation hint only; final token delivery is decided by sf-tech-design."
  },
  "component_strategy": "primitive + wrapper",
  "shadcn_vue": {
    "primitive_layer": [],
    "project_wrapper_layer": []
  },
  "layout": {
    "navigation_decision": "",
    "layout_archetype": "",
    "primary_work_surface": "",
    "scroll_regions": [],
    "responsive_strategy": ""
  },
  "product_ui_quality": {
    "primary_user": "",
    "primary_object": "",
    "primary_job": "",
    "kpi_actionability": "pass",
    "content_budget": "pass",
    "right_rail_purpose": "",
    "rejected_filler": []
  },
  "motion": {
    "layer_1_css": [],
    "layer_2_motion_vue": [],
    "layer_3_gsap": [],
    "reduced_motion": ""
  },
  "visual_qa": [
    {
      "detector": "Empty dashboard skeleton",
      "result": "ok",
      "severity": "high",
      "evidence": {
        "artifact": "01-spec/ui-mockup-export/dashboard.png",
        "viewport": "1440x900",
        "region": "first viewport"
      },
      "fix": "N/A - primary work surface is present",
      "status": "not-applicable",
      "owner": "sf-ui-design"
    }
  ],
  "visual_calibration": {
    "feedback_source": "",
    "diagnosis": [],
    "palette_delta": [],
    "anti_reference": [],
    "next_review": ""
  },
  "verification_hooks": [],
  "anti_slop_rules": []
}
```

JSON 字段必须符合 `contracts/design-contract.schema.json`。如果某字段不适用，填空数组或明确 N/A 文本，不要省略字段。
`human_confirmation.status` 只有用户明确选择时才能写 `confirmed`；低风险可逆默认写 `defaulted`，需要确认但未确认写 `pending`，不能把 Agent 推荐写成 confirmed。
`scan_manifest.selected_data` 只记录 id；`scan_manifest.selection_rationale` 必须解释为什么选、拒绝了什么、替换风险和置信度，且每个 rationale id 必须与 selected_data 对齐。
`reference_selection` 记录用户选择题、来源路由、复用边界、离线行为和禁止项；扫描记录写入 Reference Scan Manifest。它不是 design mode，也不能把网站名当风格名。
`token_delivery_hint` 只是 design-system 给 `sf-tech-design` 的实现映射提示，不是最终工程决策；technical design 必须确认实际 CSS variables、Tailwind theme 和 Pencil variables 落点。
`visual_qa` 是 sf-verify 的机器可读 gate 来源；high severity issue 只能是 `fixed` 或 `accepted`，不能以 `pending` / `blocked` 进入 verify。
`motion.layer_3_gsap` 不使用时写空数组；一旦使用，数组项必须包含 `effect`、`fallback` 和 `verification`。

`design_mode` 只能是 `Product UI`、`Brand Surface`、`Hybrid`、`Avatar-IP` 或 `Empty State`。不要写 `Avatar-IP / Empty State`；两者同时适用时，用 `scope: "both"` 表达组合。

## Technical design additions

前端相关 technical design 必须回答：

- Token delivery：CSS variables、Tailwind theme、组件局部变量还是现有项目 token。
- Reference source decision：哪些来源用于 component contract，哪些用于 page pattern，哪些只用于 visual inspiration / UX method。
- Reference selection：本次参考需求、来源路由、抽取 pattern、复用边界、禁止复制项、离线 fallback；React shadcn 来源如何转成 shadcn-vue contract / project wrapper。
- Vue translation：React shadcn block 如何转成 shadcn-vue primitive、project wrapper、props、events、slots、state owner。
- License / reuse boundary：未知 license、付费资源、商业素材、截图、图片、文案必须禁止复制。
- Offline fallback：外部来源不可访问时，是否使用本地 source catalog。
- Color system：palette_id、aesthetic_direction、semantic token mapping、usage rules、contrast / dark mode flags、source_url 和 license_note。
- Foundation system：typography scale、spacing density、radius / shadow recipe、motion recipe 和 GSAP signature；这些必须映射到 CSS variables / Tailwind theme / Pencil variables。
- Visual calibration：如果存在用户反馈、截图诊断或 palette delta，implement 必须以校准后的 token / surface / motion 为准；不能回退到初版 palette 或默认 cyber / AI neon。
- Product UI layout：主要使用者、业务对象、主要任务、layout archetype、primary work surface、KPI 可行动性、首屏空白预算和右侧栏职责。
- Component source：现有组件、shadcn-vue primitive、自建 registry、项目 wrapper、domain component。
- Component contract files：读取 `01-spec/design/components/<component-name>.contract.md`，确认 primitive、companions、project wrapper、states、props、events、slots、motion 和 verification。
- Registry boundary：是否需要 shadcn-vue custom registry；registry item 负责什么，项目代码负责什么。
- Motion source 必答五问：
  - Layer 1 (CSS)：哪些组件使用 transition，使用哪些 duration / easing token。
  - Layer 2 (Motion Vue / CSS animation)：哪些组件需要进入退出、presence、stagger 或轻量页面切换；是否新增依赖。
  - Layer 3 (GSAP)：是否使用；只允许写具体场景，例如 AI 工具调用步骤推进、品牌页 timeline、大屏编排。
  - Reduced motion：降级策略是 remove travel、keep opacity、skip all 还是 jump to final state。
  - Handoff artifact：提供给 `sf-implement` 的 Motion Contract 表格位置。
- State ownership：loading、empty、error、permission、stale、partial 状态由页面、wrapper、hook 还是后端状态负责。
- Visual verification：哪些页面和状态必须截图，哪些可用 DOM / a11y / unit 验证。

## Implementation guardrails

- 先读 `Design Contract Summary`，再读 foundations，最后按需读组件文件；不要全量复制整套设计系统。
- 使用 semantic tokens，不使用散落 hex、一次性 Tailwind arbitrary value 或 UI 库默认主题。
- 页面不能直接堆 primitive；有权限、加载、错误、空态、远程数据、审计或批量操作时必须使用 project wrapper。
- 动效只能服务状态、焦点、空间关系或品牌 signature；Product UI 禁止无任务价值的背景特效。
- Vue Bits / Motion / GSAP 都是 optional implementation source；新增依赖必须在 technical design 中确认。
- 不要把外部模板当实现规格；只按 Design Contract 和 component contract 实现。
- 不允许直接复制未知 license、付费模板或 React shadcn 代码到 Vue。
- React-only shadcn 资源必须通过 Vue translation contract。
- Inspiration gallery 不进入代码实现。
- 国内设计案例只影响 visual completion、information density、UX / IA，不复制资产。
- 若实现与 Pencil 截图或 design contract 冲突，停止并回到 `sf-ui-design` 或 `sf-tech-design`，不要在代码里临场改风格。

## Verification checklist

| Check | Evidence |
| --- | --- |
| Token adherence | CSS variables / Tailwind theme / computed styles |
| Foundation adherence | 字号、行高、间距、圆角、阴影、motion token 与 `foundation_system` 一致 |
| Component adherence | wrapper props、slots、events、states 覆盖 |
| Component contract files | `01-spec/design/components/*.contract.md` 存在或 N/A 理由 |
| State matrix | default、loading、empty、error、permission、success 截图或 DOM 证据 |
| Product UI layout | primary work surface、KPI actionability、content budget、right rail purpose、rejected filler |
| Reference selection | 外部参考被使用时存在 Reference Selection |
| Source routing | source routing 与 selected needs 一致 |
| Reference boundary | 外部来源只抽 pattern / anatomy / source basis；无代码、图片、截图、文案、付费模板复制 |
| Reuse boundary | reuse boundary 未被违反 |
| Shadcn adaptation | React shadcn 来源已转 shadcn-vue primitive / project wrapper / page pattern |
| React-to-Vue translation | React-to-Vue translation contract 存在 |
| License safety | 无复制付费 / 未知 license 资产 |
| Product UI motion safety | Product UI 未被 Brand Surface motion 污染 |
| Motion boundary | 每个动效有 duration token / easing token / reduced motion 覆盖 / 无 layout 属性动效 |
| Motion intent | 每个动效能说明：反馈 / 空间关系 / 进度 / 品牌 signature |
| Accessibility | keyboard path、focus、ARIA、contrast、touch target |
| Anti-slop | nested cards、generic gradients、icon tiles、gray-on-color、text overflow |

## Source index

| Source | URL | Used for |
| --- | --- | --- |
| Impeccable | https://github.com/pbakaus/impeccable | design vocabulary、commands、anti-slop detector、live iteration |
| Impeccable site | https://impeccable.style/ | shared language for hierarchy、contrast、restraint |
| Agentic Design Systems | https://www.intodesignsystems.com/agentic-design-systems | machine-readable metadata、trust levels、progressive disclosure |
| Spec-driven development with AI | https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/ | design system constraints as part of spec / plan |
| Good specs for AI agents | https://addyosmani.com/blog/good-spec/ | smart spec、attention budget、evolving docs |
| shadcn-vue | https://www.shadcn-vue.com/ | foundation for custom design system |
| shadcn-vue Registry | https://www.shadcn-vue.com/docs/registry | custom registry distribution |
| Vue Bits | https://github.com/DavidHDev/vue-bits | Vue port of React Bits、animated component inspiration |
| Motion | https://motion.dev/ | Vue-compatible production motion library |
| React Bits | https://reactbits.dev/ | animated component inspiration; map to Vue alternatives before adoption |
