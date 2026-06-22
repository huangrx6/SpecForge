# sf-brainstorm 参考能力选择

本文件回答：`sf-brainstorm` 什么时候读取 Brainstorm 包内 reference，什么时候再追加外部参考能力，以及如何归一化为 SpecForge artifact。参考能力不是用户确认，输出不能原样落库。

## 读取原则

1. 先读 `sf-brainstorm/SKILL.md`、`.specforge/skills/sf-brainstorm/stages/brainstorm/SKILL.md` 和 `.specforge/core/skills/brainstorm/SKILL.md`。
2. Brainstorm 包内只暴露一个根能力：`.specforge/core/skills/brainstorm/SKILL.md`。内部方法由 `references/brainstorm-playbook.md`、`references/methods.md`、`references/research-source.md`、`references/output-contract.md` 和 `data/case-source-catalog.csv` 承载。
3. 跨到产品、设计、验证等外部参考时，默认最多再选择 1 个最相关的外部 skill。`product` / `prd` 是 SpecForge 本地能力包，不计入外部 skill 预算。
4. 参考输出先转成 `问题重构 / 事实证据 / 优秀案例与机制拆解 / 发散方向 / 类比迁移 / 场景模拟 / 方案对比 / 批判质疑 / 评估矩阵 / 用户确认记录 / 下一步行动 / 后续阶段输入`。
5. 涉及当前事实、版本、法规、价格、竞品、安全或漏洞时，必须读取 `.specforge/core/skills/brainstorm/references/research-source.md` 并记录来源。
6. 查找优秀案例、竞品、模板站、作品站、官网或交互参考时，读取 `.specforge/core/skills/brainstorm/references/brainstorm-playbook.md#Case Study Protocol` 和 `.specforge/core/skills/brainstorm/data/case-source-catalog.csv`。

## Brainstorm 包内链路

先根据当前任务选择 execution profile，再选择 reference section。profile 写入 `brainstorm.md#执行配置`。

| Profile | 何时使用 | 必读 reference / section | 可选 reference / section | 输出约束 |
|---|---|---|---|---|
| `skip` | brief 已确认无需 brainstorm | 无 | 无 | 只写跳过理由和下一步路由 |
| `light` | 低风险取舍、用户只需要快速比较 | `methods.md#Problem Framing`、`#Divergent Thinking`、`#Critic Review`、`#Decision Matrix`、`#Output Shaping` | `research-source.md`、`brainstorm-playbook.md#Case Study Protocol`、`methods.md#Execution Planning` | 未使用 section 写 `N/A + 理由` |
| `deep` | 方案空间不清、会影响产品/体验/技术方向 | `brainstorm-playbook.md#Case Study Protocol`、`methods.md#Problem Framing`、`#Divergent Thinking`、`#Scenario Simulation`、`#Critic Review`、`#Decision Matrix`、`#Output Shaping`、`#Execution Planning` | `research-source.md`、`methods.md#Analogy Thinking` | 必须保留完整取舍链路；有 UI / 产品体验时必须保留案例机制拆解 |
| `research-heavy` | 当前事实、版本、价格、法规、安全、竞品或 AI provider 证据影响方向 | `methods.md#Problem Framing`、`research-source.md`、`methods.md#Critic Review`、`#Decision Matrix`、`#Execution Planning` | `brainstorm-playbook.md#Case Study Protocol`、`methods.md#Divergent Thinking`、`#Scenario Simulation`、`#Analogy Thinking` | 必须记录覆盖度、未查证项和是否升级 `sf-discovery` research |

| 触发问题 | 优先读取 | 提取为 | 归一化到 |
|---|---|---|---|
| 用户问题、目标用户、约束、成功标准或真实冲突不清楚 | `methods.md#Problem Framing` | 问题重构、目标、约束、假设、必须确认问题 | `brainstorm.md#问题重构`、`#问题地图` |
| 当前事实、版本、价格、依赖、竞品、AI provider、漏洞或法规会影响取舍 | `research-source.md` | 搜索问题、本地事实、来源类型、证据表、版本依赖关系、置信度、未查证项 | `brainstorm.md#当前事实与研究证据`、`#问题地图`、`#方案对比` |
| 用户给出优秀案例 / 模板站 / 竞品 / 截图，或体验需要跳出模板化 | `brainstorm-playbook.md#Case Study Protocol` + `data/case-source-catalog.csv` | 案例池、URL / 截图路径、访问日期、可迁移机制、不能照搬点、机制路线、反模板化提醒 | `brainstorm.md#优秀案例与机制拆解`、`#方案对比`、后续 `ui-design.md` / `prd.md` 输入 |
| 需要多个候选方向，或当前方案过早收敛 | `methods.md#Divergent Thinking` | 保守、标准、激进、实验、反直觉方向 | `brainstorm.md#发散方向池` |
| 方案同质化，需要跨产品、行业或系统迁移机制 | `methods.md#Analogy Thinking` | 类比来源、可迁移机制、调整方式、风险 | `brainstorm.md#类比迁移` |
| 方案需要放进真实使用流程、失败路径或边界场景里检验 | `methods.md#Scenario Simulation` | 关键场景、用户动作、系统响应、失败点、补救策略 | `brainstorm.md#场景模拟` |
| 推荐前需要反驳自己、压缩范围或暴露假设 | `methods.md#Critic Review` | 反方问题、最弱假设、删减项、风险和验证点 | `brainstorm.md#批判质疑` |
| 需要排序、推荐、授权默认或向用户解释取舍 | `methods.md#Decision Matrix` | 评估维度、评分、推荐、放弃代价、置信度 | `brainstorm.md#方案评估矩阵`、`#推荐方案` |
| 输出容易变成自由散文，需要固定成可交接格式 | `methods.md#Output Shaping` | 输出类型、最小必填 section、读者、交接边界 | `brainstorm.md` |
| 方向已收敛，需要转给产品需求文档、需求规格、界面设计、技术设计、研究或验证阶段 | `methods.md#Execution Planning` | 下一步路由、行动项、负责人、输入产物、验证入口 | `brainstorm.md#下一步行动`、`#下一步路由` |

## 外部参考

| 触发问题 | 优先参考 | 按需读取 | 归一化到 |
|---|---|---|---|
| 产品目标、MVP、功能候选、机会、假设压力测试或优先级不清楚 | `product` | `SKILL.md`；按需读 output contract、prioritization、experiment references | `brainstorm.md#问题地图`、`#方案对比`、`brief.md#功能候选池`、后续 `prd.md` 输入 |
| 需要外部机会树视角补机会或功能优先级方法 | `product/references/external-ost-reference.md` | 外部 OST 归一化检查点 | 先归一化到 `product` 产物，再写入 `brainstorm.md` / `prd.md` 输入 |
| 体验方向、用户旅程、信息架构、交互风格、可访问性或美学方向不清楚 | `design-system` | 先读 `SKILL.md`；再按需读 creative direction、composition、signature patterns、visual QA | `brainstorm.md#问题地图`、`#优秀案例与机制拆解`、`#方案对比`、后续 `ui-design.md` 输入 |
| 官网、落地页、作品集、品牌页或重设计的视觉方向容易模板化 | `design-taste-frontend` | `SKILL.md`；只在需要时读取参考资料 | `brainstorm.md#界面与体验方向确认`、后续 `ui-design.md#视觉风格简报` |
| 管理端采用 shadcn/ui，需要判断组件封装、注册表候选或避免基础组件拼装 | shadcn 官方 skill / registry reference | 官方 shadcn skill、registry docs、component review | `brainstorm.md#技术路线确认`、`#界面与体验方向确认`、后续 `ui-design.md` 和 `technical_design.md` 输入 |
| 用户故事、验收口径、边界条件会影响方案取舍 | `user-stories` | `SKILL.md` | `brainstorm.md#问题地图`、后续 `requirements.md` 输入 |
| 产品需求文档信息已经足够，需要判断是否进入产品需求文档合成 | `prd` | `SKILL.md`；按需读 output contract 和 PRD playbook | `prd.md` 输入，不直接写 brainstorm 结论 |
| 验证路径、浏览器流程、角色操作是否可证明 | `playwright-skill` | `SKILL.md`；需要脚本细节时读 API reference | 后续 `test-cases.md` / `verification-report.md` 输入 |

## 升级 sf-discovery Research

| 条件 |
|---|
| 技术选型有 2+ 个不明显最优的方案，且需要 PoC、benchmark 或源码级验证 |
| 竞品比较会影响 MVP 范围、定价策略或定位决策，且来源之间存在冲突 |
| AI 能力边界是方案成本模型的关键变量 |
| 用户提到 agent 不熟悉的库、框架、服务、协议或法规要求，且 quick / standard 查证不足以支持决策 |
| 法规、合规、数据隐私、安全漏洞会影响架构方向 |
| 公开资料存在明显争议或多来源结论冲突 |

## 记录格式

在 `brainstorm.md#参考 Skill 使用记录` 中记录：

| Reference | 读取内容 | 提取结果 | 归一化到 | 不能替代的确认 |
|---|---|---|---|---|
| brainstorm methods / research-source / external skill | 具体 reference 或 section | 简短列出 2-5 条 | 问题重构 / 事实证据 / 案例机制 / 发散 / 类比 / 场景 / 批判 / 矩阵 / 下一步 / 下游输入 | 用户确认 MVP / 界面方向 / 技术路线 / 依赖 / 工具链 / 验收口径 |

## 禁止事项

- 不因为读了参考能力就跳过 Socratic 单问。
- 不把参考能力的角色设定、产品需求文档、故事、审查清单或测试建议写成用户已确认。
- 不在头脑风暴中写完整产品需求文档、需求规格、界面设计、技术设计或验证报告。
- 不把外部参考能力的投递动作带入 SpecForge，例如创建 issue、发布页面、上传外部系统。
