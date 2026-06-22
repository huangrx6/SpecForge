# Brainstorm Read Profiles

本文件是 brainstorm 的控制面。它负责选择本轮读取范围、执行 profile、案例侦察深度、讨论节奏和输出合同。每次进入 `sf-brainstorm` 后先读本文件，再按最短链路读取子 skill；不要把所有子 skill 平铺读取，也不要只凭直觉回答。

## Layer Map

Layer routing：Profile / Mode / orchestration -> 本文件；Case Study -> `references/case-study-protocol.md` + `data/case-source-catalog.csv` + `case-study-scout`；Current Facts -> `research-source/SKILL.md` + 其 references；Discussion -> `references/discussion-protocol.md`；Divergence -> `divergent-thinking` + `analogy-thinking`；Stress Test -> `scenario-simulation` + `critic-review`；Convergence -> `decision-matrix`；Output -> `references/output-contract.md` + `output-shaping` + `execution-planning`。

## Profile Routing

| Profile | 输入信号 | 必读文件 | 可选追加 | 输出深度 |
|---|---|---|---|---|
| `clarify-light` | 用户只需要快速想清楚 1-2 个取舍；范围低风险；无明显外部案例诉求 | `problem-framing/SKILL.md`、`references/discussion-protocol.md`、`decision-matrix/SKILL.md`、`references/output-contract.md` | `case-study-scout`，仅当用户给案例或体验方向会影响推荐；`research-source`，仅当事实会改变取舍 | compact |
| `product-discovery` | 新产品能力、AI 功能、后台工具、跨角色流程、MVP 不清 | `problem-framing/SKILL.md`、`references/case-study-protocol.md`、`case-study-scout/SKILL.md`、`divergent-thinking/SKILL.md`、`critic-review/SKILL.md`、`decision-matrix/SKILL.md`、`references/output-contract.md` | `research-source`、`scenario-simulation`、`execution-planning`、`product` | standard |
| `experience-exploration` | 管理端、Dashboard、品牌页、官网、作品页、H5、AI 工具、用户明确要高级案例 | `references/case-study-protocol.md`、`data/case-source-catalog.csv`、`case-study-scout/SKILL.md`、`divergent-thinking/SKILL.md`、`analogy-thinking/SKILL.md`、`scenario-simulation/SKILL.md`、`decision-matrix/SKILL.md`、`references/output-contract.md` | `design-system`、`design-taste-frontend`、`research-source` | full |
| `technical-decision` | 技术栈、依赖、AI provider、部署、成本、安全、版本兼容需要取舍 | `problem-framing/SKILL.md`、`research-source/SKILL.md`、`critic-review/SKILL.md`、`decision-matrix/SKILL.md`、`references/discussion-protocol.md`、`references/output-contract.md` | `case-study-scout`，仅当工具产品体验或竞品机制会影响决策；`sf-discovery` research | standard |
| `research-heavy` | 竞品 / 价格 / 法规 / AI 能力 / 市场定位 / 公开资料冲突会影响方向 | `research-source/SKILL.md`、`references/case-study-protocol.md`、`case-study-scout/SKILL.md`、`critic-review/SKILL.md`、`decision-matrix/SKILL.md`、`references/output-contract.md` | `sf-discovery` research、`scenario-simulation` | standard / full |

## Selection Rules

- 先选 profile，再决定读哪些子 skill；不要从“我想回答什么”倒推 profile。
- 用户给 URL、截图、模板站、竞品、作品站或说“多查询优秀案例”时，至少走 `product-discovery`；涉及 UI / 体验 / 品牌 / 管理端时升级 `experience-exploration`。
- 管理后台不是只走技术取舍。只要用户关心“感觉、效率、布局、工作流、交互”，必须走 `experience-exploration` 或至少追加 `case-study-scout`。
- 事实查证和案例侦察不同：价格、版本、功能声明、法规、安全走 `research-source`；交互机制、信息架构、视觉节奏、工作流组织走 `case-study-scout`。
- `clarify-light` 也必须输出 N/A 理由，不能空着“优秀案例与机制拆解”。
- `experience-exploration` 默认需要至少 5 个候选案例、2 条机制路线、1 条反模板化路线和 1 个降级方案。

## Case Study Depth

| Depth | 适用场景 | 最小要求 |
|---|---|---|
| `none` | 纯后端、小修、用户已明确禁止外部参考 | 写 N/A 理由 |
| `quick` | light 取舍，有 1 个外部参考诉求 | 3 个案例，至少 2 类来源，1 条机制路线 |
| `standard` | 产品 / 管理端 / AI 工具 / 官网体验会影响方案 | 5 个案例，至少 3 类来源，2 条互斥机制路线 |
| `deep` | 用户明确追求高级、差异化、滚动叙事、复杂后台体验或给多个参考站 | 6-8 个案例，覆盖直接竞品、相邻行业、优秀作品 / 模式库，输出反模板化矩阵和降级策略 |

## Discussion Depth

| Depth | 使用方式 |
|---|---|
| `single-decision` | 只问一个核心取舍，用户回答后即可落档 |
| `guided-options` | 先给 2-3 个候选方向，再逐轮确认核心目标、体验、成本 / 风险 |
| `workshop` | 先展示问题地图、案例机制、方案矩阵，再分轮确认，不一次性要求用户拍板所有问题 |

## Stop Signals

- profile 未写入 `brainstorm.md#执行配置`。
- 用户要求参考案例，但没有案例池、URL / 截图路径、访问日期或 inaccessible 说明。
- 案例只被写成“风格像 X”，没有可迁移机制、不能照搬点和成本风险。
- 方案只有一个“综合最优”大方案，没有互斥路线和放弃代价。
- 用户没有确认，却把 agent recommendation 写成 user-confirmed。
- 仍存在 `[NEEDS ... DECISION]`，但输出宣布可以进入下游。

## Full Orchestration

Full order：选择 profile -> 读取 `discussion-protocol.md` 确定提问节奏 -> 需要案例则读取 `case-study-protocol.md` + catalog + `case-study-scout` -> 需要事实则读取 `research-source` -> `divergent-thinking` 生成候选 -> `analogy-thinking` 补跨域机制 -> `scenario-simulation` 压测 -> `critic-review` 反驳 -> `decision-matrix` 收敛 -> `output-contract.md` 检查落档 -> `execution-planning` 写下一步路由。

Full blockers：缺 profile；缺案例证据；缺讨论记录；缺互斥方案；缺用户确认边界；缺下游 handoff；案例和事实混用；把美观案例直接套进 Product UI 工作面。
