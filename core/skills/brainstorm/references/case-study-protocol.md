# Case Study Protocol

本文件定义 brainstorm 如何查询和拆解优秀案例。目标不是“找几个好看网站”，而是把外部案例转成当前项目可讨论、可取舍、可验证的机制路线。

## Source Families

| Family | 适合查什么 | 输出重点 |
|---|---|---|
| `direct-competitor` | 同类产品、同类后台、同类 AI 工具、同类业务流程 | 功能边界、信息架构、关键对象、工作流节奏 |
| `adjacent-product` | 相邻行业、不同业务但任务相似的产品 | 可迁移机制、反馈方式、权限 / 审计 / 批处理 |
| `design-gallery` | Awwwards、Godly、Lapa、Mobbin、国内设计社区、作品集 | 视觉完成度、首屏叙事、滚动节奏、动效目的 |
| `design-system-source` | Ant Design、Semi、Material、shadcn、Element Plus、企业级设计系统 | 组件结构、状态、表格 / 表单 / 导航模式 |
| `template-library` | admin template、blocks、UI kit、page template | 页面骨架、常见反模式、可抽象 block |
| `real-product-demo` | 官方 demo、docs、changelog、公开视频 | 真实使用流、限制、状态反馈、可信度 |

## Search Plan

每次案例侦察先写搜索计划：

| 侦察问题 | Source family | 查询入口 / URL | 需要观察什么 | 足够性 |
|---|---|---|---|---|
| | | | | insufficient / enough |

不允许只写“参考竞品”或“参考高级网站”。必须写具体要观察什么，例如：批量审批如何组织、AI 结果如何可编辑、Dashboard 如何避免 KPI wallpaper、滚动叙事如何服务转化。

## Observation Checklist

### Product UI / 管理端

- 首屏是否直接出现工作对象，而不是空洞欢迎页。
- 导航、筛选、批量操作、详情、反馈和错误恢复如何组织。
- 表格 / 卡片 / 看板 / 时间线之间如何切换。
- 权限、审计、状态、失败、空态、部分加载如何表达。
- 高频动作是否少跳转、可撤销、可预览、可批处理。

### Brand Surface / 官网 / 作品页

- 首屏主张、视觉资产、滚动节奏、叙事段落如何推进。
- 动效服务什么：解释产品、制造记忆点、引导滚动、展示能力，还是纯装饰。
- 是否依赖视频、3D、WebGL、粒子、生成图、摄影或插画。
- 移动端如何降级；reduced motion 如何处理。
- CTA、表单、导航和正文是否可读。

### AI / Agent / 创作工具

- 用户如何提供上下文、修正输出、比较版本和追踪来源。
- AI 的不确定性、执行状态、工具调用、失败恢复如何表达。
- 结果是否可编辑、可回滚、可审计、可导出。
- Prompt / artifact / conversation / canvas 如何分层。

## Mechanism Extraction

每个案例必须拆成机制，不写空泛风格词。

| 维度 | 问法 |
|---|---|
| `structure` | 它如何组织信息和任务？ |
| `interaction` | 用户怎么推进、撤销、比较、确认？ |
| `feedback` | 系统如何反馈状态、错误、进度、风险？ |
| `visual` | 哪个视觉机制真的服务目标？ |
| `motion` | 动效是否解释关系、引导注意或提供状态？ |
| `trust` | 它如何建立可信度、证据链或可控感？ |
| `cost` | 迁移到当前项目的工程 / 内容 / 资产成本是什么？ |

## Anti-Copy Boundary

禁止复制：

- 商业文案、品牌资产、插画、摄影、视频、3D 模型、图标包。
- 付费模板、未知 license 组件、竞品专有交互和代码。
- 与当前设计模式冲突的表层风格，例如把 Brand Surface 的全屏滚动和 WebGL 直接套到高频后台表格。

允许迁移：

- 信息架构、对象关系、状态表达、批量处理、审计链路、反馈节奏、降级策略。
- 视觉完成度方法，例如层级、留白、密度、对比、素材位置，但必须重建为当前项目 token 和组件。

## Mechanism Routes

案例池结束后必须形成 2-3 条互斥路线：

| Route | 适用 | 代价 | 风险 | 放弃什么 |
|---|---|---|---|---|
| `conservative-productivity` | 高频后台 / 工具 | 低 | 容易普通 | 放弃强视觉记忆点 |
| `signature-workflow` | 需要差异化工作流 | 中 | 需要更多状态和交互验证 | 放弃最快实现 |
| `brand-led-experience` | 官网 / 低频入口 / 品牌页 | 中高 | 动效、素材、性能风险 | 放弃纯功能密度 |
| `experimental-lab` | 创新展示 / 高风险探索 | 高 | 维护和兼容风险 | 放弃稳定 MVP |

## Escalation

- 案例事实冲突、价格 / 功能 / 发布状态影响决策 -> 交给 `research-source`。
- 需要真实交互截图、滚动、响应式观察 -> 使用浏览器 / Playwright 工具，记录 viewport 和访问结果。
- 案例要求生成图片、3D、视频或复杂素材 -> 输出 asset prompt、目标目录、fallback，不在 brainstorm 阶段实现。
- 机制路线涉及大工程成本 -> 在 `decision-matrix` 降低落地性或升级 `sf-discovery` research / spike。
