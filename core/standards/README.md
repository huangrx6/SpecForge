# Standards Map

`core/standards/` 保存跨阶段的长期标准。标准文件要精，不追求多；每个文件必须回答一个清楚问题。

## 文件分层

| 文件 | 回答的问题 | 主要读者 |
|---|---|---|
| `index.md` | 当前有哪些标准、每个阶段该读什么 | Agent / 维护者 |
| `workflow.md` | work item 怎么推进、什么时候停、gate 如何批准 | 所有阶段 |
| `operating-model.md` | SpecForge 如何控制深度、上下文、人机确认、证据和长期演进 | 所有阶段 / 维护者 |
| `evolution.md` | SpecForge 后续如何按 SDD / HITL / Agent eval 思路继续演进 | 维护者 / 框架改造 |
| `stage-playbook.md` | 每一步怎么配合、工具如何组合、阅读层如何降噪 | 自动推进 / 接力 |
| `ai-toolkit.md` | AI 工具链如何选择、人工确认和证据如何回流 | Agent / 人工审查 |
| `product.md` | 产品、PRD、需求和验收如何表达 | PRD / requirements |
| `design.md` | UI 影响、设计方向、Pencil 原型和视觉质量如何确认 | UI design |
| `engineering.md` | 技术设计、实现、审查和验证如何可靠交付 | tech design / implement |
| `code-intelligence.md` | 存量项目如何做代码画像和 CodeGraph / provider 编排 | steering / onboarding |
| `playwright.md` | 浏览器验证如何形成可重复证据 | verification |
| `wiki.md` | 长期知识如何沉淀和去重 | wiki sync / close |
| `pc-ui-design-spec.md` | PC 业务系统的具体 UI token 和组件约束 | Product UI |

## 避免重复

- 流程路由写在 `workflow.md`；具体阶段操作写在 `.specforge/skills/<stage-owner>/stages/<stage>/SKILL.md`。
- UI 总原则写在 `design.md`；具体设计语言和组件细则交给 `core/skills/ui-ux/design-system`。
- 技术选型标准写在 `engineering.md`；可选技术组合写在 `profiles/`。
- 测试证据原则写在 `engineering.md` / `playwright.md`；具体测试用例模板写在 `artifacts/templates/test-cases.md`。
- 代码画像原则写在 `code-intelligence.md`；具体扫描命令由 `scripts/codebase-index.mjs` 输出。
- 框架后续演进写在 `evolution.md`；阶段打法和日常命令不要把演进路线复制一遍。

## 写作规范

- 先给适用范围和决策表，再给细节。
- 每个标准都必须能落到 artifact、gate、quality check、profile 或 script。
- 长列表要说明“什么时候读”；不让所有阶段默认读取所有标准。
- 发现两个标准在讲同一件事，优先保留一个事实源，另一个改为引用。
