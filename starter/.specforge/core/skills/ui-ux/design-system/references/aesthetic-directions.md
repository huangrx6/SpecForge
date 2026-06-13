# Aesthetic Directions

本文件用于给用户推荐多个可选美学方向。方向必须服务业务和页面模式，不是装饰风格列表。

## Recommendation protocol

1. 根据 `Subject / Audience / Single job / World material` 先排除不适合方向。
2. 推荐 2-3 个互斥方向，不要给同一方向换颜色。
3. 每个方向必须包含：适合业务、视觉气质、组件语言、布局倾向、动效策略、风险、禁用场景。
4. 用户选择后，把该方向映射到 foundations、components、pages、prompts 和 Pencil 原型约束。

## Product UI directions

| Direction | Best for | Signature | Component language | Avoid |
|---|---|---|---|---|
| Operational Calm | 运营后台、审批、数据管理 | 稳定表格 + 精准状态 | compact, hairline border, restrained primary | 大面积 hero、彩色卡片 |
| Command Center | AI 工具、全局搜索、快捷工具 | 命令面板 + 最近/推荐动作 | command palette, split inspector, keyboard-first | 工具入口全部大卡片 |
| Diagnostic Chain | 故障诊断、工单、AI 问答 | 上下文卡 + 诊断步骤链 | timeline, source card, tool status | 只有聊天气泡 |
| Data Instrument | 指标、监控、经营看板 | 指标仪表 + 异常入口 | metric card, table, chart, alert | 无口径指标卡 |
| Structured Workflow | 导入、审批、配置向导 | stepper + summary + recover | stepper, form, result table | 长表单一屏到底 |
| Knowledge Workspace | 文档、知识库、问答 | 左导航 + 语义标签 + 阅读面板 | tabs, tree, search, citation card | 只做普通文章页 |
| Field Mobile | 外勤、现场办公、App 内 H5 | 底部主操作 + 状态提示 | touch target, sticky input, toast | 桌面缩小版 |
| Secure Enterprise | 权限、政企、金融、审计 | 权限边界 + 变更摘要 | badge, audit table, confirmation | 模糊成功/失败状态 |

## Brand Surface directions

| Direction | Best for | Signature | Component language | Avoid |
|---|---|---|---|---|
| Editorial Authority | 专业服务、咨询、政企展示 | 强排版 + 证据段落 | serif/display title, reading band | 空泛大口号 |
| Product Immersion | 产品、硬件、空间、场馆 | 真实产品图/场景为主角 | full-bleed media, grounded CTA | 抽象渐变 hero |
| Technical Blueprint | 开发者工具、平台、AI 基建 | 代码/图谱/网格 | monospace labels, blueprint panels | 伪代码装饰 |
| Warm Service | 会员、服务、客户关怀 | 温和文案 + 明确下一步 | soft surface, human copy, simple cards | 过度可爱 |
| Civic Clarity | 政务、公共服务、运营保障 | 明确信息层级 + 可信状态 | direct labels, clear status, accessible contrast | 过度潮流风 |
| Premium Restraint | 高价值产品、品牌页 | 大留白 + 少量精确视觉资产 | sparse CTA, strong type, quiet motion | 堆阴影和玻璃 |

## Direction output card

```md
Direction:
Why it fits:
Why it might fail:
Signature:
Foundations:
- Palette:
- Type:
- Density:
- Radius/shadow:
- Motion:
Component language:
- Primary components:
- States to emphasize:
- shadcn-vue primitives:
Page patterns:
Human question:
```
