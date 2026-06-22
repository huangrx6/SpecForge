# Brainstorm Playbook

本文件是 Brainstorm 能力包的执行总纲。它合并 profile routing、案例侦察协议、多轮讨论协议和完整编排规则，解决“读了很多文件但仍不知道怎么做”的问题。

使用原则：先用本文件决定本轮怎么跑，再读取必要子 skill；不要把所有子 skill 平铺读取，也不要只凭直觉回答。

## 1. Execution Model

Brainstorm 的目标不是生成更多想法，而是把模糊空间收束为：

- 已确认选择。
- 授权默认。
- Agent recommendation。
- 明确延后项。
- 仍阻断下一阶段的 pending decision。

执行顺序：

1. 读取用户请求、brief、已有 brainstorm 和相关 spec。
2. 选择 `Brainstorm profile`。
3. 选择 `Case study depth`。
4. 选择 `Discussion depth`。
5. 按最短链路读取子 skill。
6. 需要事实时查证；需要体验参考时侦察案例。
7. 发散候选路线。
8. 用场景、批判和矩阵压测。
9. 按 `Expose -> Ask -> Record` 和用户逐轮确认。
10. 读取 `output-contract.md` 落档并交接下游。

## 2. Profile Routing

| Profile | 输入信号 | 必读文件 | 可选追加 | 输出深度 |
|---|---|---|---|---|
| `clarify-light` | 用户只需要快速想清楚 1-2 个取舍；范围低风险；无明显外部案例诉求 | `problem-framing/SKILL.md`、`decision-matrix/SKILL.md`、`references/output-contract.md` | `case-study-scout` 仅当用户给案例或体验方向会影响推荐；`research-source` 仅当事实会改变取舍 | compact |
| `product-discovery` | 新产品能力、AI 功能、后台工具、跨角色流程、MVP 不清 | `problem-framing/SKILL.md`、`case-study-scout/SKILL.md`、`divergent-thinking/SKILL.md`、`critic-review/SKILL.md`、`decision-matrix/SKILL.md`、`references/output-contract.md` | `research-source`、`scenario-simulation`、`execution-planning`、`product` | standard |
| `experience-exploration` | 管理端、Dashboard、官网、品牌页、作品页、H5、AI 工具；用户明确要高级案例、不模板化或给参考站 | `data/case-source-catalog.csv`、`case-study-scout/SKILL.md`、`divergent-thinking/SKILL.md`、`analogy-thinking/SKILL.md`、`scenario-simulation/SKILL.md`、`decision-matrix/SKILL.md`、`references/output-contract.md` | `design-system`、`design-taste-frontend`、`research-source` | full |
| `technical-decision` | 技术栈、依赖、AI provider、部署、成本、安全、版本兼容需要取舍 | `problem-framing/SKILL.md`、`research-source/SKILL.md`、`critic-review/SKILL.md`、`decision-matrix/SKILL.md`、`references/output-contract.md` | `case-study-scout` 仅当工具产品体验或竞品机制会影响决策；`sf-discovery` research | standard |
| `research-heavy` | 竞品 / 价格 / 法规 / AI 能力 / 市场定位 / 公开资料冲突会影响方向 | `research-source/SKILL.md`、`case-study-scout/SKILL.md`、`critic-review/SKILL.md`、`decision-matrix/SKILL.md`、`references/output-contract.md` | `sf-discovery` research、`scenario-simulation` | standard / full |

Selection rules：

- 先选 profile，再决定读哪些子 skill；不要从“我想回答什么”倒推 profile。
- 用户给 URL、截图、模板站、竞品、作品站或说“多查询优秀案例”时，至少走 `product-discovery`。
- 涉及 UI、体验、品牌、管理端、Dashboard、工作台、AI 工具或“感觉”时，升级为 `experience-exploration`。
- 管理后台不是只走技术取舍。只要用户关心效率、布局、工作流、视觉层级或交互签名，必须使用 `experience-exploration` 或追加 `case-study-scout`。
- 事实查证和案例侦察不同：价格、版本、功能声明、法规、安全走 `research-source`；交互机制、信息架构、视觉节奏、工作流组织走 `case-study-scout`。
- `clarify-light` 也必须输出 N/A 理由，不能空着“优秀案例与机制拆解”。

## 3. Case Study Protocol

案例侦察的目标不是“找几个好看网站”，而是把外部案例转成当前项目可讨论、可取舍、可验证的机制路线。

### 3.1 Case Study Depth

| Depth | 适用场景 | 最小要求 |
|---|---|---|
| `none` | 纯后端、小修、用户已明确禁止外部参考 | 写 N/A 理由 |
| `quick` | light 取舍，有 1 个外部参考诉求 | 3 个案例，至少 2 类来源，1 条机制路线 |
| `standard` | 产品 / 管理端 / AI 工具 / 官网体验会影响方案 | 5 个案例，至少 3 类来源，2 条互斥机制路线 |
| `deep` | 用户明确追求高级、差异化、滚动叙事、复杂后台体验或给多个参考站 | 6-8 个案例，覆盖直接竞品、相邻行业、优秀作品 / 模式库，输出反模板化矩阵和降级策略 |

### 3.2 Source Families

| Family | 适合查什么 | 输出重点 |
|---|---|---|
| `direct-competitor` | 同类产品、同类后台、同类 AI 工具、同类业务流程 | 功能边界、信息架构、关键对象、工作流节奏 |
| `adjacent-product` | 相邻行业、不同业务但任务相似的产品 | 可迁移机制、反馈方式、权限 / 审计 / 批处理 |
| `design-gallery` | Awwwards、Godly、Lapa、Mobbin、国内设计社区、作品集 | 视觉完成度、首屏叙事、滚动节奏、动效目的 |
| `design-system-source` | Ant Design、Semi、Material、shadcn、Element Plus、企业级设计系统 | 组件结构、状态、表格 / 表单 / 导航模式 |
| `template-library` | admin template、blocks、UI kit、page template | 页面骨架、常见反模式、可抽象 block |
| `real-product-demo` | 官方 demo、docs、changelog、公开视频 | 真实使用流、限制、状态反馈、可信度 |

### 3.3 Search Plan

每次案例侦察先写搜索计划：

| 侦察问题 | Source family | 查询入口 / URL | 需要观察什么 | 足够性 |
|---|---|---|---|---|
| | | | | insufficient / enough |

禁止只写“参考竞品”或“参考高级网站”。必须写具体要观察什么，例如：批量审批如何组织、AI 结果如何可编辑、Dashboard 如何避免 KPI wallpaper、滚动叙事如何服务转化。

### 3.4 Observation Checklist

Product UI / 管理端：

- 首屏是否直接出现工作对象，而不是空洞欢迎页。
- 导航、筛选、批量操作、详情、反馈和错误恢复如何组织。
- 表格、卡片、看板、时间线之间如何切换。
- 权限、审计、状态、失败、空态、部分加载如何表达。
- 高频动作是否少跳转、可撤销、可预览、可批处理。
- 是否有工作流签名，例如 command palette、split view、object timeline、bulk review queue、inline diff、live preview、audit trail。

Brand Surface / 官网 / 作品页：

- 首屏主张、视觉资产、滚动节奏、叙事段落如何推进。
- 动效服务什么：解释产品、制造记忆点、引导滚动、展示能力，还是纯装饰。
- 是否依赖视频、3D、WebGL、粒子、生成图、摄影或插画。
- 移动端如何降级；reduced motion 如何处理。
- CTA、表单、导航和正文是否可读。

AI / Agent / 创作工具：

- 用户如何提供上下文、修正输出、比较版本和追踪来源。
- AI 的不确定性、执行状态、工具调用、失败恢复如何表达。
- 结果是否可编辑、可回滚、可审计、可导出。
- Prompt、artifact、conversation、canvas 如何分层。

Technical / Product Mechanism：

- 案例中的机制依赖什么工程能力：实时协作、权限模型、数据聚合、搜索、事件流、媒体处理、模型调用、3D / WebGL。
- 哪些机制只是表现层，哪些会改变数据模型或系统边界。
- 当前项目是否已有基础设施；没有时是否应降级为静态、批处理、离线或人工确认。

### 3.5 Mechanism Extraction

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

### 3.6 Anti-Copy Boundary

禁止复制：

- 商业文案、品牌资产、插画、摄影、视频、3D 模型、图标包。
- 付费模板、未知 license 组件、竞品专有交互和代码。
- 与当前设计模式冲突的表层风格，例如把 Brand Surface 的全屏滚动和 WebGL 直接套到高频后台表格。

允许迁移：

- 信息架构、对象关系、状态表达、批量处理、审计链路、反馈节奏、降级策略。
- 视觉完成度方法，例如层级、留白、密度、对比、素材位置，但必须重建为当前项目 token 和组件。

### 3.7 Mechanism Routes

案例池结束后形成 2-3 条互斥路线：

| Route | 适用 | 代价 | 风险 | 放弃什么 |
|---|---|---|---|---|
| `conservative-productivity` | 高频后台 / 工具 | 低 | 容易普通 | 放弃强视觉记忆点 |
| `signature-workflow` | 需要差异化工作流 | 中 | 需要更多状态和交互验证 | 放弃最快实现 |
| `brand-led-experience` | 官网 / 低频入口 / 品牌页 | 中高 | 动效、素材、性能风险 | 放弃纯功能密度 |
| `experimental-lab` | 创新展示 / 高风险探索 | 高 | 维护和兼容风险 | 放弃稳定 MVP |

Escalation：

- 案例事实冲突、价格 / 功能 / 发布状态影响决策 -> 交给 `research-source`。
- 需要真实交互截图、滚动、响应式观察 -> 使用浏览器 / Playwright 工具，记录 viewport 和访问结果。
- 案例要求生成图片、3D、视频或复杂素材 -> 输出 asset prompt、目标目录、fallback，不在 brainstorm 阶段实现。
- 机制路线涉及大工程成本 -> 在 `decision-matrix` 降低落地性或升级 `sf-discovery` research / spike。

## 4. Discussion Protocol

Brainstorm 使用“三段式循环”：

1. **Expose**：展示当前理解、案例机制或方案选项。
2. **Ask**：只问一个会改变方向的问题。
3. **Record**：用户回答后立即写入确认记录、pending 或 delegated default。

### 4.1 Discussion Depth

| Depth | 使用方式 |
|---|---|
| `single-decision` | 只问一个核心取舍，用户回答后即可落档 |
| `guided-options` | 先给 2-3 个候选方向，再逐轮确认核心目标、体验、成本 / 风险 |
| `workshop` | 先展示问题地图、案例机制、方案矩阵，再分轮确认，不一次性要求用户拍板所有问题 |

### 4.2 Question Types

| Type | 何时问 | 格式 |
|---|---|---|
| `scope` | MVP、非目标、目标用户不清 | 2-3 个范围包，说明各自牺牲什么 |
| `experience` | UI / 交互 / 感觉 / 案例方向不清 | 2-3 条体验路线，绑定案例机制和成本 |
| `trust-risk` | 数据、安全、权限、AI 不确定性、审计影响方向 | 2-3 个风险姿态，说明保护强度和成本 |
| `tech-cost` | 技术路线、依赖、模型、部署影响长期维护 | 2-3 个技术路线，说明锁定成本和回退点 |
| `validation` | 怎么证明完成不清 | 2-3 个验收方式，说明证据强度 |

One-question rule：

- 每轮只问一个问题，但问题可以包含 2-3 个选项。
- 禁止问“你还想要什么？”“还有别的要求吗？”
- 禁止一次问目标、用户、技术、颜色、验收。
- 禁止把推荐方案包装成唯一合理答案。

Option quality：

- 好选项必须有真实差异：MVP 边界、体验机制、成本 / 风险姿态、上线节奏、验证强度。
- 坏选项是：A 好、B 更好、C 最好；A 现代、B 高级、C 简约；A 立刻做、B 以后做但不说明代价。

### 4.3 Discussion Trace

落档时记录：

| 轮次 | 展示给用户的判断 | 问题 | 选项 | 用户回答 | 记录结果 |
|---|---|---|---|---|---|
| 1 | | | | | user-confirmed / delegated-default / pending |

如果用户说“你决定”，记录授权范围：

- 授权默认的具体问题。
- Agent 推荐。
- 推荐理由。
- 风险影响。
- 回退 / 重新验证触发条件。

### 4.4 Convergence Rules

只有满足以下条件才算收敛：

- MVP 做什么 / 不做什么明确。
- 高影响体验或技术路线已确认、授权默认或明确延后。
- 案例机制路线已选定或明确不采用。
- 未决问题不会阻断下一阶段。
- 用户知道下一步进入 PRD、requirements、UI design、tech design、research 还是停止。

如果用户疲劳或上下文太长，输出“当前已确认 + 只剩一个阻断问题”，不要继续堆问题。

## 5. Full Orchestration

完整链路：

1. 选择 profile、case study depth、discussion depth。
2. 读取 `problem-framing`，重构目标、受众、约束和必须确认问题。
3. 需要案例时读取 `data/case-source-catalog.csv` 和 `case-study-scout`。
4. 需要事实时读取 `research-source` 和其 references。
5. 用 `divergent-thinking` 生成候选。
6. 候选同质化或需要差异化时用 `analogy-thinking`。
7. 方案要落地前用 `scenario-simulation` 压测关键场景、失败路径和边界。
8. 推荐前用 `critic-review` 暴露最弱假设、反例和可删范围。
9. 用 `decision-matrix` 排序、推荐或记录授权默认。
10. 输出前读取 `references/output-contract.md`。
11. 需要交接时读取 `output-shaping` 和 `execution-planning`。

## 6. Stop Signals

- profile 未写入 `brainstorm.md#执行配置`。
- 用户要求参考案例，但没有案例池、URL / 截图路径、访问日期或 inaccessible 说明。
- 案例只被写成“风格像 X”，没有可迁移机制、不能照搬点和成本风险。
- 有事实诉求但没有来源 URL、访问日期、发布日期或置信度。
- 方案只有一个“综合最优”大方案，没有互斥路线和放弃代价。
- 用户没有确认，却把 agent recommendation 写成 user-confirmed。
- 仍存在 `[NEEDS ... DECISION]`，但输出宣布可以进入下游。
- 把 Brand Surface 的视觉手法直接套到 Product UI 高频工作面，没有说明降级、性能和可用性边界。

## 7. Anti-patterns

- 用“现代、高级、简洁、炫酷”替代机制描述。
- 查了设计网站，但没有打开或观察实际使用路径。
- 管理端只给卡片、表格、筛选和弹窗，没有工作流签名。
- 官网只堆大字、渐变和卡片，没有资产、节奏、叙事和动效目的。
- 把用户给的参考站当成要复制的风格，而不是拆成可迁移机制。
- 把案例灵感当事实证据。
- 把用户沉默当确认。
- 为了完整读取所有文件，反而没有给用户可选择的路线。
