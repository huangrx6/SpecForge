# External Sources

本 skill 的规则优先来自项目现有设计系统；没有项目规则时，参考这些一手资料，并转译为 SpecForge artifact。

| Source | Use |
|---|---|
| Anthropic frontend-design skill | subject grounding、signature、两轮 critique、反模板默认值 |
| Taste Skill | taste review、archetype、动效和高级感反模式；仅吸收方法，不照搬夸张规则 |
| Impeccable | 共享设计词汇、命令化审查、anti-slop deterministic detector、live iteration；吸收为 SpecForge 阶段 vocabulary 和 visual QA |
| getdesign.md / DESIGN.md | 从真实网站提取 atmosphere、tokens、components、layout、do/don't |
| UI UX Pro Max | 行业匹配、style / palette / typography / anti-pattern 多维推荐 |
| Agentic Design Systems | 机器可读组件 metadata、JSON/Markdown 混合、always-on foundations、progressive disclosure 和 human trust gate |
| shadcn-vue Introduction | 组件分发和“构建自己的组件库”理念 |
| shadcn-vue Registry | 自建 registry，向 Vue 项目分发 custom components、hooks、pages 和 files |
| shadcn-vue Theming | CSS variables 和 semantic theme tokens |
| shadcn-vue Components | primitive 候选清单 |
| Tailwind Theme Variables | Tailwind v4 token 承载方式 |
| Vue Bits | React Bits 的官方 Vue port；作为 Vue/Nuxt 动效组件 inspiration，不作为 Product UI 默认依赖 |
| Motion | 支持 Vue 的生产级动画库；用于普通 CSS transition 之外的状态动效和 gesture |
| Spec-driven development with AI | design system constraints 属于 technical plan 和 implementation source of truth，而不是后置视觉材料 |
| Addy Osmani good spec | 规格要短、明确、可演进；design-system 输出按 compact / standard / full 分层 |
| WCAG 2.2 | 可访问性底线 |
| GSAP Docs | timeline、复杂动画和插件边界 |

不要把外部文档原文复制进 `ui-design.md`；只提取当前项目需要的约束和决策。
