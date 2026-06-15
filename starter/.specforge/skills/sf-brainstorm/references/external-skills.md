# sf-brainstorm 参考 Skill 选择

本文件回答：`sf-brainstorm` 什么时候参考哪个辅助 skill、读到什么深度、如何归一化为 SpecForge artifact。参考 skill 是方法卡或执行契约，不是用户确认。

## 读取原则

1. 先读 `sf-brainstorm/SKILL.md` 和 `.specforge/skills/sf-brainstorm/stages/brainstorm/SKILL.md`，再决定是否读取参考 skill。
2. Brainstorm 包内 skill 可以组成链路使用；跨到产品、设计、验证等外部参考时，默认最多再选择 1 个最相关的 skill。
3. 先读目标 skill 的 `SKILL.md`；只有问题落到具体子领域时，才读 `references/` 或 `rules/` 下的相关文件。
4. 参考 skill 输出先转成 `问题重构 / 事实证据 / 发散方向 / 类比迁移 / 场景模拟 / 方案对比 / 批判质疑 / 评估矩阵 / 用户确认记录 / 下一步行动 / 后续阶段输入`，不能原样复制模板标题或结论。
5. 涉及当前事实、版本、法规、价格、竞品、安全或漏洞时，必须另行查可靠来源；参考 skill 不提供事实背书，除非它明确要求实际联网查证并记录来源。
6. 查证外部事实时优先读取 `.specforge/core/skills/brainstorm/research-source/SKILL.md`，把搜索计划、来源、日期、结论和置信度写入 `brainstorm.md#当前事实与研究证据`。

## Brainstorm 包内链路

先根据当前任务选择执行 profile，再选择子 skill。profile 写入 `brainstorm.md#执行配置`。

| Profile | 何时使用 | 必读子 skill | 可选子 skill | 输出约束 |
|---|---|---|---|---|
| `skip` | brief 已确认无需 brainstorm | 无 | 无 | 只写跳过理由和下一步路由 |
| `light` | 低风险取舍、用户只需要快速比较 | `problem-framing`、`divergent-thinking`、`critic-review`、`decision-matrix`、`output-shaping` | `research-source`、`execution-planning` | 未使用 section 写 `N/A + 理由` |
| `deep` | 方案空间不清、会影响产品/体验/技术方向 | `problem-framing`、`divergent-thinking`、`scenario-simulation`、`critic-review`、`decision-matrix`、`output-shaping`、`execution-planning` | `research-source`、`analogy-thinking` | 必须保留完整取舍链路 |
| `research-heavy` | 当前事实、版本、价格、法规、安全、竞品或 AI provider 证据影响方向 | `problem-framing`、`research-source`、`critic-review`、`decision-matrix`、`execution-planning` | `divergent-thinking`、`scenario-simulation`、`analogy-thinking` | 必须记录覆盖度、未查证项和是否升级 `sf-discovery` research |

| 触发问题 | 优先参考 | 按需读取的 reference | 提取为 | 归一化到 |
|---|---|---|---|---|
| 用户问题、目标用户、约束、成功标准或真实冲突不清楚 | `problem-framing` | `SKILL.md` | 问题重构、目标、约束、假设、必须确认问题 | `brainstorm.md#问题重构`、`#问题地图` |
| 当前事实、版本、价格、依赖、竞品、AI provider、漏洞或法规会影响取舍 | `research-source` | `SKILL.md`；按需读 `references/research-protocol.md`、`references/source-index.md`、`references/evidence-contract.md`、`references/dependency-version-map.md` | 搜索问题、本地事实、来源类型、证据表、版本依赖关系、置信度、未查证项 | `brainstorm.md#当前事实与研究证据`、`#问题地图`、`#方案对比` |
| 需要多个候选方向，或当前方案过早收敛 | `divergent-thinking` | `SKILL.md` | 保守、标准、激进、实验、反直觉方向 | `brainstorm.md#发散方向池` |
| 方案同质化，需要跨产品、行业或系统迁移机制 | `analogy-thinking` | `SKILL.md` | 类比来源、可迁移机制、调整方式、风险 | `brainstorm.md#类比迁移` |
| 方案需要放进真实使用流程、失败路径或边界场景里检验 | `scenario-simulation` | `SKILL.md` | 关键场景、用户动作、系统响应、失败点、补救策略 | `brainstorm.md#场景模拟` |
| 推荐前需要反驳自己、压缩范围或暴露假设 | `critic-review` | `SKILL.md` | 反方问题、最弱假设、删减项、风险和验证点 | `brainstorm.md#批判质疑` |
| 需要排序、推荐、授权默认或向用户解释取舍 | `decision-matrix` | `SKILL.md` | 评估维度、评分、推荐、放弃代价、置信度 | `brainstorm.md#方案评估矩阵`、`#推荐方案` |
| 输出容易变成自由散文，需要固定成可交接格式 | `output-shaping` | `SKILL.md` | 输出类型、最小必填 section、读者、交接边界 | `brainstorm.md` |
| 方向已收敛，需要转给 PRD / requirements / UI / tech / research / verification | `execution-planning` | `SKILL.md` | 下一步路由、行动项、owner、输入产物、验证入口 | `brainstorm.md#下一步行动`、`#下一步路由` |

## 外部参考

| 触发问题 | 优先参考 | 按需读取的 reference | 提取为 | 归一化到 |
|---|---|---|---|---|
| 产品目标、MVP、功能候选、机会树、假设压力测试或优先级不清楚 | `opportunity-solution-tree` | `SKILL.md`；按需读 `references/brainstorm-ideas-new.md`、`references/brainstorm-ideas-existing.md`、`references/analyze-feature-requests.md`、`references/prioritize-features.md`、`references/prioritization-frameworks.md` | 用户机会、候选方向、关键假设、实验、取舍问题、优先级线索 | `brainstorm.md#问题地图`、`#方案对比`、`brief.md#功能候选池` |
| 体验方向、目标用户、用户旅程、信息架构、交互风格、可访问性或美学方向不清楚 | `design-system` | 先读 `SKILL.md`；再按需读 `references/ux-research-ia.md`、`references/aesthetic-directions.md`、`prompts/aesthetic-selection.md`、`references/design-intelligence.md` | 体验方向候选、用户旅程风险、信息架构问题、可访问性约束、美学方向候选 | `brainstorm.md#问题地图`、`#方案对比`、`#参考 Skill 使用记录`、后续 `ui-design.md` 输入 |
| 官网、landing、portfolio、品牌页或 redesign 的视觉方向容易模板化 | `design-taste-frontend` | `SKILL.md`；只在需要时读取其 references | Brand Surface 的视觉气质、版式候选、动效边界、反模板化风险 | `brainstorm.md#UI / 体验方向确认`、后续 `ui-design.md#Visual Style Brief` |
| 管理端采用 shadcn/ui，但需要判断组件封装、registry 候选或避免基础组件拼装 | shadcn 官方 skill / shadcn registry reference | 官方 shadcn skill、`npx shadcn@latest docs/search/view` 输出；按需参考 `shadcn-component-discovery` / `shadcn-component-review` | primitive 选择、registry 候选、Admin Component Contract、组件审查点 | `brainstorm.md#技术路线确认`、`#UI / 体验方向确认`、后续 `ui-design.md` 和 `technical_design.md` 输入 |
| 用户故事、验收口径、边界条件会影响方案取舍 | `user-stories` | `SKILL.md` | 用户故事候选、验收问题、边界/异常问题 | `brainstorm.md#问题地图`、后续 `requirements.md` 输入 |
| PRD 信息已经足够，需要判断是否进入 PRD 合成 | `create-prd` | `SKILL.md` | PRD 交接检查、非目标、目标用户、价值主张、release 分期覆盖缺口 | `prd.md` 输入，不直接写 brainstorm 结论 |
| 验证路径、浏览器流程、角色操作是否可证明 | `playwright-skill` | `SKILL.md`；需要脚本细节时读 `API_REFERENCE.md` | E2E 验证问题、用户路径、证据要求 | 后续 `test-cases.md` / `verification-report.md` 输入 |

## 升级 sf-discovery research 的具体条件

| 条件 |
|---|
| 技术选型有 2+ 个不明显最优的方案，且需要 PoC、benchmark 或源码级验证 |
| 竞品比较会影响 MVP 范围、定价策略或定位决策，且来源之间存在冲突 |
| AI 能力边界（context、价格、模型行为、限流、数据使用）是方案成本模型的关键变量 |
| 用户提到一个 agent 不熟悉的库、框架、服务、协议或法规要求，且 quick / standard 查证不足以支持决策 |
| 法规、合规、数据隐私、安全漏洞会影响架构方向 |
| 公开资料存在明显争议或多来源结论冲突，需要拆解共识 / 争议 / 研究空白 |

## 记录格式

在 `brainstorm.md#参考 Skill 使用记录` 中记录：

| Skill | 读取内容 | 提取结果 | 归一化到 | 不能替代的确认 |
|---|---|---|---|---|
| problem-framing / research-source / divergent-thinking / analogy-thinking / scenario-simulation / critic-review / decision-matrix / output-shaping / execution-planning / external skill | `SKILL.md` / specific reference path | 简短列出 2-5 条 | 问题重构 / 事实证据 / 发散方向 / 类比 / 场景 / 批判 / 矩阵 / 下一步 / 下游输入 | 用户确认 MVP / UI 方向 / 技术路线 / 依赖 / 工具链 / 验收口径 |

## 禁止事项

- 不因为读了参考 skill 就跳过 Socratic 单问。
- 不把参考 skill 的 persona、PRD、故事、审查清单或测试建议写成用户已确认。
- 不在 brainstorm 中写完整 PRD、requirements、UI design、technical design 或 verification report。
- 不把参考 skill 的外部投递动作带入 SpecForge，例如创建 issue、发布页面、上传外部系统。
