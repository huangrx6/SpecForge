---
name: design-system
description: SpecForge UI 设计规范 skill；用于提炼设计语言、建立 foundations/components/pages 规则、生成 shadcn-vue 友好的 UI 方案，并执行去廉价感与动效审查。
---

# Design System Skill

本 skill 负责把“好看的 UI 想法”转成可复用、可实现、可审查的设计语言。它不是 Pencil 操作 skill，也不是前端实现 skill；它为 `sf-ui-design` 提供设计判断、DESIGN.md 提取、组件契约、页面模式、提示词、样例板和审查基准。

## 什么时候使用

- 需求涉及新页面、页面重构、后台 / 管理端 / 大屏 / 会员 / 直播间等可见体验。
- 用户希望“不要廉价感”“更有品味”“设计语言统一”“参考 shadcn-vue”。
- 项目缺少明确 token、组件形态、页面布局、状态矩阵或动效边界。
- `sf-ui-design` 需要把用户截图、竞品、现有组件库或品牌素材转译成 `ui-design.md`。
- 需要让人工先看 2-3 个样例方向，再确认是否符合宿主项目标准。
- 需要从真实网站、品牌截图或参考项目中抽取 DESIGN.md 风格的设计语言。

## 读取顺序

1. 先读 `references/design-intelligence.md`，明确 subject、audience、single job、design mode 和一个可辩护的 signature。
2. 再读 `foundations/README.md`，按需读 colors / typography / spacing / density / radius-shadow / motion / accessibility。
3. 需要推荐风格方向时读 `references/aesthetic-directions.md` 和 `prompts/aesthetic-selection.md`，按业务、用户、页面模式推荐 2-3 个互斥方向。
4. Product UI / shadcn-vue 场景读 `references/shadcn-vue.md`、`references/tailwind-v4.md`、`components/README.md`、`references/component-system.md` 和相关 `components/*.md`。
5. 页面设计读 `pages/*.md` 中最接近的模式；没有命中的页面先读 `pages/dashboard.md`、`pages/list-detail.md`、`pages/form-flow.md`。
6. 需要从参考网站或截图提取风格时读 `references/design-md-extraction.md`，按 DESIGN.md 结构抽取 token、组件、布局和 do/don't。
7. 需要生成或审查提示词时读 `prompts/ui-generation.md`、`prompts/design-language.md`、`prompts/sample-board.md`、`prompts/taste-critique.md`、`prompts/anti-cheapness-review.md`、`prompts/motion-design.md`。
8. 需要给人看样例时读 `references/good-case.md`、`references/bad-case.md`、`references/sample-board-template.md`，形成“采用 / 不采用 / 原因 / 待确认”。
9. 写入 `ui-design.md` 前读 `references/output-contract.md`，按 compact / standard / full 选择输出结构。
10. 需要复杂动效或编排时读 `references/motion-gsap.md`；普通状态反馈优先使用 CSS transition。

## 工具链

1. **Design intake**：提取宿主产品、目标用户、使用场景、实现栈、已有组件、约束和用户审美偏好。
2. **Subject grounding**：用真实业务对象、行业材料、用户语言和场景物件推导视觉方向，不从通用 SaaS 模板开始。
3. **Design mode**：判断 Product UI、Brand Surface 或 Hybrid；后台工具默认 Product UI，除非用户明确要求表达型品牌页面。
4. **Reference extraction**：有参考网站/截图时，抽取 DESIGN.md 风格的 atmosphere、tokens、typography、components、layout、do/don't。
5. **Aesthetic direction recommendation**：基于 `aesthetic-directions.md` 推荐 2-3 个互斥美学方向；每个方向必须说明适用业务、页面模式、组件气质、风险和不适用场景。
6. **Design language**：输出 2-3 个互斥方向，每个方向包含色彩、排版、密度、组件气质、动效边界、适合点、风险和 signature。
7. **Self-critique pass**：先问“这个方案是不是任何同类产品都会长这样”，若是，必须替换 palette、type、layout 或 signature 中至少一项。
8. **Human taste gate**：方向会影响视觉气质、信息架构或核心流程时，先让用户确认；低风险小改可写可逆默认。
9. **Foundations pack**：把确认方向落成 semantic tokens、字体层级、空间密度、圆角阴影、动效、可访问性约束。
10. **Component system**：按 `components/README.md` 和 `references/component-system.md` 定义 structure、variants、states、density、content、a11y、shadcn-vue primitive / companion / project wrapper。
11. **Component contract**：优先映射到 shadcn-vue primitive，再定义项目级组件；写清 props、events、slots、density、文案规则、empty/error/loading/permission/partial/stale 等复杂状态。
12. **Page patterns**：选择页面模式，明确导航、主任务、状态矩阵、响应式、微文案和不做项。
13. **Sample board**：生成可给人看的样例板，包含 2-3 张关键页面或关键组件片段的描述、采用/不采用理由和修改建议。
14. **Taste review**：检查模板感、廉价渐变、无意义卡片、单色堆叠、默认控件、文案空泛、动效噪音和不可落地样式。
15. **Handoff**：把设计语言、组件契约、页面模式和样例板归一化写入 `ui-design.md`，供 Pencil 和 implementation 使用。

## 输出到 SpecForge

| 内容 | 写入位置 |
|---|---|
| 设计语言摘要、token、密度、动效边界 | `01-spec/ui-design.md#Visual Style Brief` |
| 美学方向推荐、用户选择和不适用方向 | `01-spec/ui-design.md#Aesthetic Direction` |
| 参考网站 / 截图提取的 DESIGN.md 规则 | `01-spec/ui-design.md#Design Reference Extraction` |
| 组件契约、shadcn-vue primitive 映射 | `01-spec/ui-design.md#Admin Component Contract` |
| 页面模式、关键状态、空错权加载 | `01-spec/ui-design.md#页面地图` 和 `#状态矩阵` |
| 2-3 个方向样例、人工确认和放弃项 | `01-spec/ui-design.md#UI Direction Options` |
| 去廉价感审查、修正动作 | `01-spec/ui-design.md#视觉质量 Review` |
| Pencil 原型输入 | `01-spec/ui-mockup.pen` 和导出截图 |

输出规模按 `references/output-contract.md` 选择 compact / standard / full，避免又回到大而难读的文档。

## 工作原则

- 先定义设计语言，再画页面；先定组件规则，再谈实现。
- 每个 UI 方向必须有 subject、audience、single job 和 signature；没有 signature 的方向通常只是模板换皮。
- Product UI 以清晰、密度、稳定和可重复使用为主，不做营销页式装饰。
- Brand Surface 可以更有表达，但仍要有 token、网格、动效边界和内容策略。
- shadcn-vue 是 primitive / registry / theme 基座，不等于完整设计系统；必须定义项目级组件 contract。
- Tailwind / CSS variables 是 token 承载层，不允许用大量一次性 arbitrary value 代替设计系统。
- 动效服务状态变化、空间关系和反馈，不做分散注意力的装饰。
- GSAP 只用于 timeline、复杂状态编排、品牌型动效或大屏动效；普通 hover、focus、collapse、toast 使用 CSS transition。
- 人工感官确认必须保留：给用户 2-3 个方向、样例和取舍，不让 AI 自说自话完成风格选择。
- 设计输出要让实现者能做，也要让用户能判断；不要只写抽象形容词。
- 大胆只花在一个地方：signature、排版、媒体、交互或动效选一个主角，其余部分保持纪律。

## 完成标准

- `ui-design.md` 能看出明确设计语言，不是通用灰白后台。
- 设计方向能解释“为什么属于这个产品”，而不是“为什么看起来高级”。
- 颜色、字体、间距、圆角、阴影、动效和组件形态可复用。
- 关键页面至少覆盖 default / loading / empty / error / permission / success 中适用状态。
- 组件契约能指导 shadcn-vue 或项目组件封装。
- 有 sample board、人工确认状态、去廉价感 review 和至少一轮修正建议。
- 生成的样例可以给人工确认，并能说明好在哪里、不好在哪里、为什么适合宿主项目。
