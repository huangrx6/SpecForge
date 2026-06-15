# Design Mode Routing

本文件只做一件事：先判断本次 UI 应该走哪种设计模式，再决定后续读取哪些 design-system 文件。模式判断错了，token、组件、动效和样例板都会被错误使用。

## Routing Table

| 输入信号 | Design mode | 输出深度 | 必读文件 | 禁止 |
| --- | --- | --- | --- | --- |
| 后台 / 管理端 / 审批 / 配置台 / 数据表格 / 高频工作台 / 运营工具 | Product UI | standard | `references/component-system.md` + relevant `pages/*.md` + `references/output-contract.md` | 不做营销页装饰；不用大面积玻璃拟态、夸张渐变、漂浮 hero 或装饰性动效替代任务效率 |
| 官网 / 品牌页 / 活动页 / 作品集 / landing / 公开展示页 | Brand Surface | full | `references/aesthetic-directions.md` + `references/sample-board-template.md` + `foundations/motion.md` + `references/output-contract.md` | 不把品牌视觉直接带到后台控件；不牺牲内容可读性和可访问性 |
| AI 助手 / 工作台首页 / 客户门户 / 低频入口 / 产品内欢迎页 | Hybrid | standard / full | `references/design-intelligence.md` + `references/aesthetic-directions.md` + `references/component-system.md` + `references/output-contract.md` | 不让装饰抢主任务；展示面和工作面必须分层 |
| 空态 / 插画 / 头像 / IP / 品牌吉祥物 / 局部情绪化反馈 | Avatar-IP / Empty State | compact | `references/aesthetic-directions.md` + `references/sample-board-template.md` + relevant component docs | 不影响主系统 token；不把局部插画风格扩散成全局控件风格 |

## Decision Rules

1. 先看使用频率和任务风险：高频、批量、审批、表格和配置类默认 Product UI。
2. 再看页面目标：公开获客、品牌表达、作品展示和活动传播默认 Brand Surface。
3. 同时存在展示面和工作面时标记 Hybrid，并拆成两个区域写：哪些共享 token，哪些隔离。
4. 用户指定的审美方向不能覆盖模式边界。比如用户说“赛博朋克后台”，也要先写 Product UI 约束，再把赛博朋克只转译为有限 signature。
5. 模式选择必须写入 Design Contract Summary 和 machine-readable JSON block 的 `design_mode`。

## Mode Output Requirements

| Design mode | 必须输出 | 典型 signature |
| --- | --- | --- |
| Product UI | 页面密度、组件 wrapper、状态矩阵、表格 / 表单 / 导航约束、visual QA detector 结果 | structural / typographic / interaction |
| Brand Surface | 首屏叙事、视觉资产、排版气质、媒体策略、品牌动效边界、可访问性底线 | typographic / material / motion |
| Hybrid | 展示面与工作面边界、共享 token、隔离 token、入口转场、任务不被装饰打断的证据 | structural / interaction |
| Avatar-IP / Empty State | 使用范围、插画 / IP 资产边界、空态文案、回到主任务的操作 | material / typographic |

## Stop Signals

- Product UI 输出里出现大面积玻璃拟态、品牌 hero、装饰插画主导首屏，但没有任务效率理由。
- Brand Surface 输出里只有后台表格、筛选栏和灰白卡片，无法表达品牌或对象。
- Hybrid 输出没有拆分展示面和工作面，导致同一套组件同时承担营销和高频操作。
- `Design Contract Summary` 没有 `design_mode` 或 `design_mode` 与输入信号冲突。
