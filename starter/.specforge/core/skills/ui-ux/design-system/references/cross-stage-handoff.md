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
| `sf-ui-design` | 把选择的方向落成可审查的设计语言 | Design Contract Summary、Foundations Pack、Component Contract、Page Patterns、Motion Boundary | 没有 signature、token、组件状态或 visual QA |
| `sf-tech-design` | 把设计语言转成工程架构 | Component Architecture、shadcn-vue registry / local wrapper、token delivery、motion dependency、test surface | UI 有影响但未决定组件库、wrapper、token 或动效实现 |
| `sf-tasking` | 把 design contract 拆成任务边界 | Token task、wrapper task、page task、state / a11y task、visual verification task | 任务只写页面文件，不覆盖组件契约和状态验证 |
| `sf-implement` | 按 contract 实现，不重新设计 | Read order、semantic tokens、project wrappers、motion adapter、state matrix evidence | 硬编码 token、直接拼 primitive、重新选择视觉风格 |
| `sf-verify` | 检查设计实现一致性 | Screenshot / DOM / a11y / responsive / motion evidence | 只验证接口或构建，不验证 UI 状态和视觉回归 |
| `sf-wiki` | 沉淀长期可复用规则 | `.specforge/wiki/design-system.md` 或 N/A reason | 稳定 token / component 只留在单个 work item |

## Design Contract Summary

`ui-design.md` 应提供这段可被后续阶段直接复制引用的摘要。Markdown 给人读，JSON 给后续 agent 稳定解析；两者必须表达同一组事实。

```md
Design Contract Summary:
- Design mode:
- Aesthetic direction:
- Signature:
- Token source:
- Component strategy:
- shadcn-vue primitive layer:
- Project wrapper layer:
- Motion source:
  - Layer 1 (CSS):
  - Layer 2 (Motion Vue / CSS animation):
  - Layer 3 (GSAP):
  - Reduced motion:
  - Handoff artifact:
- Anti-slop rules:
- Verification hooks:
```

```json
{
  "design_mode": "Product UI",
  "aesthetic_direction": "",
  "signature": {
    "type": "structural",
    "description": ""
  },
  "token_source": "existing",
  "component_strategy": "primitive + wrapper",
  "shadcn_vue": {
    "primitive_layer": [],
    "project_wrapper_layer": []
  },
  "motion": {
    "layer_1_css": [],
    "layer_2_motion_vue": [],
    "layer_3_gsap": [],
    "reduced_motion": ""
  },
  "verification_hooks": [],
  "anti_slop_rules": []
}
```

JSON 字段必须符合 `contracts/design-contract.schema.json`。如果某字段不适用，填空数组或明确 N/A 文本，不要省略字段。

## Technical design additions

前端相关 technical design 必须回答：

- Token delivery：CSS variables、Tailwind theme、组件局部变量还是现有项目 token。
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
- 若实现与 Pencil 截图或 design contract 冲突，停止并回到 `sf-ui-design` 或 `sf-tech-design`，不要在代码里临场改风格。

## Verification checklist

| Check | Evidence |
| --- | --- |
| Token adherence | CSS variables / Tailwind theme / computed styles |
| Component adherence | wrapper props、slots、events、states 覆盖 |
| Component contract files | `01-spec/design/components/*.contract.md` 存在或 N/A 理由 |
| State matrix | default、loading、empty、error、permission、success 截图或 DOM 证据 |
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
