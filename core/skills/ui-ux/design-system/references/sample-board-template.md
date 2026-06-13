# Sample Board Template

样例板用于让人快速判断“这个方向像不像我们的产品”。它不是完整设计稿，但必须足够具体。

## Format

| Direction | Best for | Risk | Visual language | Components | Motion | Decision |
|---|---|---|---|---|---|---|
| A | 高频工具、后台效率 | 表达偏弱 | 冷静、中性、高密度 | Table, FilterBar, Drawer | CSS feedback | recommended |
| B | AI 助手、工作台 | 需要控制装饰 | 温和、轻量、强调上下文 | ChatInput, ContextCard | CSS + small timeline | alternative |
| C | 品牌展示、活动页 | 可能不适合后台 | 更强媒体和动效 | Hero, FeatureBlock | GSAP timeline | reject unless brand page |

## Required notes

- Adopt: 保留哪些视觉、组件和交互。
- Avoid: 明确不用哪些模板化做法。
- Human question: 只问会改变方向的问题。
- Implementation mapping: 对应 shadcn-vue primitive 和项目组件。
