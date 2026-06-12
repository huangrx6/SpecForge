---
name: design-system
description: SpecForge UI 设计规范 skill；用于提炼设计语言、建立 foundations/components/pages 规则、生成 shadcn-vue 友好的 UI 方案，并执行去廉价感与动效审查。
---

# Design System Skill

本 skill 负责把“好看的 UI 想法”转成可复用、可实现、可审查的设计语言。它不是 Pencil 操作 skill，也不是前端实现 skill；它为 `sf-ui-design` 提供设计系统、组件契约、页面模式、提示词和审查基准。

## 什么时候使用

- 需求涉及新页面、页面重构、后台 / 管理端 / 大屏 / 会员 / 直播间等可见体验。
- 用户希望“不要廉价感”“更有品味”“设计语言统一”“参考 shadcn-vue”。
- 项目缺少明确 token、组件形态、页面布局、状态矩阵或动效边界。
- `sf-ui-design` 需要把用户截图、竞品、现有组件库或品牌素材转译成 `ui-design.md`。

## 读取顺序

1. 先读 `foundations/README.md`，再按需读 colors / typography / spacing / radius-shadow / motion。
2. Product UI / shadcn-vue 场景读 `references/shadcn-vue.md` 和相关 `components/*.md`。
3. 页面设计读 `pages/*.md` 中最接近的模式。
4. 需要生成或审查提示词时读 `prompts/ui-generation.md`、`prompts/anti-cheapness-review.md`、`prompts/motion-design.md`。
5. 需要给人看样例时读 `references/good-case.md` / `bad-case.md`，形成“采用 / 不采用 / 原因”。

## 输出到 SpecForge

| 内容 | 写入位置 |
|---|---|
| 设计语言摘要、token、密度、动效边界 | `01-spec/ui-design.md#Visual Style Brief` |
| 组件契约、shadcn-vue primitive 映射 | `01-spec/ui-design.md#Admin Component Contract` |
| 页面模式、关键状态、空错权加载 | `01-spec/ui-design.md#页面地图` 和 `#状态矩阵` |
| 去廉价感审查、修正动作 | `01-spec/ui-design.md#视觉质量 Review` |
| Pencil 原型输入 | `01-spec/ui-mockup.pen` 和导出截图 |

## 工作原则

- 先定义设计语言，再画页面；先定组件规则，再谈实现。
- Product UI 以清晰、密度、稳定和可重复使用为主，不做营销页式装饰。
- Brand Surface 可以更有表达，但仍要有 token、网格、动效边界和内容策略。
- shadcn-vue 是 primitive / registry / theme 基座，不等于完整设计系统；必须定义项目级组件 contract。
- 动效服务状态变化、空间关系和反馈，不做分散注意力的装饰。
- 人工感官确认必须保留：给用户 2-3 个方向、样例和取舍，不让 AI 自说自话完成风格选择。

## 完成标准

- `ui-design.md` 能看出明确设计语言，不是通用灰白后台。
- 颜色、字体、间距、圆角、阴影、动效和组件形态可复用。
- 关键页面至少覆盖 default / loading / empty / error / permission / success 中适用状态。
- 组件契约能指导 shadcn-vue 或项目组件封装。
- 有去廉价感 review 和至少一轮修正建议。
- 生成的样例可以给人工确认，并能说明好在哪里、不好在哪里、为什么适合宿主项目。
