# Changelog

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
