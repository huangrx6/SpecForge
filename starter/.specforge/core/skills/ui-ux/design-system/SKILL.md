---
name: design-system
description: SpecForge UI 设计规范 skill；用于提炼设计语言、建立 foundations/components/pages 规则、生成 shadcn-vue 友好的 UI 方案，并执行去廉价感与动效审查。
---

# Design System Skill

本 skill 负责把“好看的 UI 想法”转成可复用、可实现、可审查的设计语言。它不是 Pencil 操作 skill，也不是前端实现 skill；它为 `sf-ui-design` 提供设计判断、DESIGN.md 提取、组件契约、页面模式、提示词、样例板和审查基准，同时为 `sf-tech-design`、`sf-tasking`、`sf-implement` 和 `sf-verify` 提供可执行的 token、组件、动效和验证约束。

## 什么时候使用

- 需求涉及新页面、页面重构、后台 / 管理端 / 大屏 / 会员 / 直播间等可见体验。
- 用户希望“不要廉价感”“更有品味”“设计语言统一”“参考 shadcn-vue”。
- 项目缺少明确 token、组件形态、页面布局、状态矩阵或动效边界。
- `sf-ui-design` 需要把用户截图、竞品、现有组件库或品牌素材转译成 `ui-design.md`。
- 需要让人工先看 2-3 个样例方向，再确认是否符合宿主项目标准。
- 需要从真实网站、品牌截图或参考项目中抽取 DESIGN.md 风格的设计语言。
- 技术设计需要决定前端组件边界、shadcn-vue registry、project wrapper、token delivery 或动效依赖。
- 实现阶段需要按 `ui-design.md` 落地 token、组件状态、wrapper、可访问性和视觉回归证据，避免重新发明视觉风格。

## 读取顺序

1. 先读 `references/design-mode-routing.md`，判断 Product UI、Brand Surface、Hybrid 或 Avatar-IP / Empty State，并决定本轮输出深度和禁止项。
2. 再读 `references/design-intelligence.md`，明确 subject、audience、single job、design mode 和一个可辩护的 signature。
3. UX 证据、信息架构、交互恢复、微文案或可访问性不足时读 `references/ux-research-ia.md`。
4. 再读 `foundations/README.md`，按需读 colors / typography / spacing / density / radius-shadow / motion / accessibility。
5. 需要选择、生成或审查配色时读 `references/color-system.md`、`references/palette-usage-rules.md`、`data/aesthetic-palettes.csv` 和 `contracts/color-palette.schema.json`，不要从单点 hex 直接生成 UI。
6. 需要推荐风格方向时读 `references/aesthetic-directions.md` 和 `prompts/aesthetic-selection.md`，先推荐 3-5 个互斥美学风格（用户要求少量时 2-3 个），再把用户选择翻译成业务页面模式。
7. Product UI / shadcn-vue 场景读 `references/shadcn-vue.md`、`references/tailwind-v4.md`、`components/README.md`、`references/component-system.md`、`contracts/component-contract.template.md` 和相关 `components/*.md`。
8. 页面设计读 `pages/*.md` 中最接近的模式；没有命中的页面先读 `pages/dashboard.md`、`pages/list-detail.md`、`pages/form-flow.md`。
9. 需要从参考网站或截图提取风格时读 `references/design-md-extraction.md`，按 DESIGN.md 结构抽取 token、组件、布局和 do/don't。
10. 需要生成或审查提示词时读 `prompts/ui-generation.md`、`prompts/design-language.md`、`prompts/sample-board.md`、`prompts/taste-critique.md`、`prompts/anti-cheapness-review.md`、`prompts/motion-design.md`。
11. 需要给人看样例时读 `references/good-case.md`、`references/bad-case.md`、`references/sample-board-template.md`，形成“采用 / 不采用 / 原因 / 待确认”。
12. 做视觉质量审查时读 `references/visual-qa-detectors.md`，按 detector 输出 fail signal、severity 和 fix。
13. 需要跨阶段交付、前端技术设计、实现或验证时读 `references/cross-stage-handoff.md` 和 `contracts/design-contract.schema.json`。
14. 写入 `ui-design.md` 前读 `references/output-contract.md`，按 compact / standard / full 选择输出结构，并保留 Markdown Summary 和 machine-readable JSON block。
15. 需要复杂动效或编排时读 `references/motion-gsap.md`；Vue 项目可参考 Vue Bits / Motion Vue，但新增依赖必须在 technical design 中确认。

## 工具链

1. **Design intake**：提取宿主产品、目标用户、使用场景、实现栈、已有组件、约束和用户审美偏好。
2. **Subject grounding**：用真实业务对象、行业材料、用户语言和场景物件推导视觉方向，不从通用 SaaS 模板开始。
3. **UX grounding**：需要时用 `ux-research-ia.md` 补齐用户、任务、信息架构、交互恢复、微文案和可访问性底线；关键未知必须回到人工确认。
4. **Design mode routing**：用 `references/design-mode-routing.md` 判断 Product UI、Brand Surface、Hybrid 或 Avatar-IP / Empty State；后台工具默认 Product UI，除非用户明确要求表达型品牌页面且不破坏任务效率。
5. **Reference extraction**：有参考网站/截图时，抽取 DESIGN.md 风格的 atmosphere、tokens、typography、components、layout、do/don't。
6. **Aesthetic direction recommendation**：基于 `aesthetic-directions.md` 推荐 3-5 个互斥美学方向；方向必须是审美气质，例如极简主义、玩具感、水彩风、赛博朋克、森系，而不是 Operational Calm 这类业务模式。
7. **Business translation**：用户选择美学后，再把它翻译成业务页面模式、组件气质、密度、状态、动效边界和 signature。
7. **Self-critique pass**：先问“这个方案是不是任何同类产品都会长这样”，若是，必须替换 palette、type、layout 或 signature 中至少一项。
8. **Human taste gate**：方向会影响视觉气质、信息架构或核心流程时，先让用户确认；低风险小改可写可逆默认。
9. **Color system**：从 `data/aesthetic-palettes.csv` 选择完整色阶，按 `references/color-system.md` 映射 semantic tokens，并按 `references/palette-usage-rules.md` 校准 Product UI / Brand Surface / Hybrid 的使用比例、状态色、dark mode 和禁止组合。
10. **Foundations pack**：把确认方向落成 semantic tokens、字体层级、空间密度、圆角阴影、动效、可访问性约束。
11. **Component system**：按 `components/README.md`、`references/component-system.md` 和 `contracts/component-contract.template.md` 定义 structure、variants、states、density、content、a11y、shadcn-vue primitive / companion / project wrapper。
12. **Component contract files**：复杂或复用组件写入 `01-spec/design/components/<component-name>.contract.md`；优先映射到 shadcn-vue primitive，再定义项目级组件；写清 props、events、slots、density、文案规则、empty/error/loading/permission/partial/stale 等复杂状态。
13. **Page patterns**：选择页面模式，明确导航、主任务、状态矩阵、响应式、微文案和不做项。
14. **Sample board**：生成可给人看的样例板，包含 2-3 张关键页面或关键组件片段的描述、采用/不采用理由和修改建议。
15. **Visual QA detectors**：按 `references/visual-qa-detectors.md` 检查 generic SaaS shell、card soup、fake premium gradient、motion noise、state missing、primitive pile 等问题，并给出修正动作。
16. **Taste review**：检查模板感、廉价渐变、无意义卡片、单色堆叠、默认控件、文案空泛、动效噪音和不可落地样式。
17. **Cross-stage handoff**：按 `references/cross-stage-handoff.md` 和 `contracts/design-contract.schema.json` 生成 Design Contract Summary，明确 color system、token source、component strategy、shadcn-vue primitive / wrapper、motion source 和 verification hooks。
18. **Handoff**：把设计语言、组件契约、页面模式、JSON contract 和样例板归一化写入 `ui-design.md`，供 Pencil、technical design、tasking、implementation 和 verification 使用。

## 输出到 SpecForge

| 内容 | 写入位置 |
|---|---|
| 设计语言摘要、token、密度、动效边界 | `01-spec/ui-design.md#Visual Style Brief` |
| 色阶、palette_id、token mapping、usage ratio、contrast checks 和 avoid rules | `01-spec/ui-design.md#Design Contract Summary` 的 `color_system` |
| 美学方向推荐、用户选择和不适用方向 | `01-spec/ui-design.md#Aesthetic Direction` |
| 参考网站 / 截图提取的 DESIGN.md 规则 | `01-spec/ui-design.md#Design Reference Extraction` |
| 组件契约、shadcn-vue primitive 映射 | `01-spec/ui-design.md#Admin Component Contract` |
| 复杂 / 复用组件独立契约 | `01-spec/design/components/<component-name>.contract.md` |
| 页面模式、关键状态、空错权加载 | `01-spec/ui-design.md#页面地图` 和 `#状态矩阵` |
| 2-3 个方向样例、人工确认和放弃项 | `01-spec/ui-design.md#UI Direction Options` |
| 去廉价感审查、修正动作 | `01-spec/ui-design.md#视觉质量 Review` |
| Pencil 原型输入 | `01-spec/ui-mockup.pen` 和导出截图 |
| Design Contract Summary、machine-readable JSON block、跨阶段 token / wrapper / motion / verification hooks | `01-spec/ui-design.md#Design Contract Summary`；后续由 `technical-design.md`、tasking、implementation 和 verification 读取 |

输出规模按 `references/output-contract.md` 选择 compact / standard / full，避免又回到大而难读的文档。

## 工作原则

- 先定义设计语言，再画页面；先定组件规则，再谈实现。
- 每个 UI 方向必须有 subject、audience、single job 和 signature；没有 signature 的方向通常只是模板换皮。
- Product UI 以清晰、密度、稳定和可重复使用为主，不做营销页式装饰。
- 设计模式必须先路由：Product UI、Brand Surface、Hybrid、Avatar-IP / Empty State 不能混用质量标准。
- 色彩系统不能只有单点 hex；必须有 neutral / primary / accent / semantic / chart 色阶、usage ratio、contrast checks 和 avoid rules。
- Brand Surface 可以更有表达，但仍要有 token、网格、动效边界和内容策略。
- shadcn-vue 是 primitive / registry / theme 基座，不等于完整设计系统；必须定义项目级组件 contract。
- React Bits 类灵感在 Vue 项目中优先找 Vue Bits / Motion Vue / CSS transition 等对应实现；没有任务价值的动效不进入 Product UI。
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
- 色彩有 palette_id、完整色阶、token mapping、usage ratio、contrast checks、状态映射和禁用组合。
- 关键页面至少覆盖 default / loading / empty / error / permission / success 中适用状态。
- 组件契约能指导 shadcn-vue 或项目组件封装。
- Design Contract Summary 同时有人读 Markdown 和机器读 JSON，能指导 technical design 选择组件架构、registry、token delivery、motion dependency 和验证面。
- 复杂 / 复用组件有独立 `01-spec/design/components/<component-name>.contract.md`，或写明 N/A 理由。
- 有 sample board、人工确认状态、去廉价感 review 和至少一轮修正建议。
- 生成的样例可以给人工确认，并能说明好在哪里、不好在哪里、为什么适合宿主项目。
