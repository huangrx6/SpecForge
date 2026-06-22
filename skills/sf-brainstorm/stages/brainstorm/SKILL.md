---
name: brainstorm
description: SpecForge 内部 brainstorm 阶段技能。用于在 intake、产品需求文档、需求规格、界面设计或技术设计前后，对模糊方向做用户参与式发散、优秀案例侦察、事实研究、多轮探讨、取舍和确认。
---

# Brainstorm Skill

Brainstorm 是 graph 外的协作收敛阶段。它服务于后续产品需求文档、需求规格、界面设计和技术设计，但不替代这些产物。它的核心职责是让 Agent 暂停单向推理，和用户一起把“可能性空间”变成“已确认选择 + 明确延后项 + 可安全默认”。

## 输入

- 用户当前问题和上下文。
- `00-intake/original-request.md`。
- `00-intake/brief.md`。
- 可选：`00-intake/prd.md`、`01-spec/requirements.md`、`01-spec/ui-design.md`、`01-spec/technical-design.md`。
- 相关 `.specforge/wiki/` 长期事实。
- 当前可靠外部资料；技术类优先官方文档，产品/竞品类记录来源和访问日期。
- `.specforge/core/skills/brainstorm/SKILL.md`（Brainstorm 能力包根入口；必须先读它，再由它路由到 references 和 data）。
- `.specforge/core/skills/brainstorm/references/brainstorm-playbook.md`（由根入口读取，用于选择 profile、case study depth、discussion depth、案例侦察协议、多轮讨论协议和最短读取链路）。
- `.specforge/core/skills/brainstorm/references/output-contract.md`（用于落档合同、条件 section、handoff 和停止条件）。
- `.specforge/core/skills/brainstorm/references/methods.md`（用于问题重构、发散、类比、场景模拟、批判质疑、方案矩阵、输出塑形和行动规划）。
- `.specforge/core/skills/brainstorm/references/research-source.md`（需要外部事实、版本、竞品、价格、漏洞、法规或 AI provider 资料时，用于搜索来源和证据记录）。
- `.specforge/core/skills/ORCHESTRATION.md`（需要参考 skill 时，用于选择 skill、读取 reference 和归一化输出）。

## 触发

- 模糊产品想法、页面体验、AI 能力、运营后台、多角色流程、审批/权限/数据生命周期。
- 用户给出网站、模板站、优秀案例、竞品、截图或要求“高级一点 / 不要模板化 / 多找案例 / 多探讨方向”。
- 产品需求文档或需求规格前缺少最小可行版本、用户角色、成功标准、非目标或功能候选池。
- UI design 前缺少信息架构、关键任务、状态矩阵或交互风格方向。
- `instructions.mjs` 给出 `ui-direction-unconfirmed` blocker。
- `instructions.mjs` 给出 `tech-direction-unconfirmed` blocker。
- `instructions.mjs` 给出 `dependency-decision-unconfirmed` blocker。
- `instructions.mjs` 给出 `tooling-decision-unconfirmed` blocker。
- technical design 前缺少技术路线、版本、依赖、部署、成本、安全或长期维护取舍。
- 任一 spec review 发现“方案还没被用户确认”。

## 参考 Skill 归一化

需要参考 skill 时，先读 `.specforge/core/skills/ORCHESTRATION.md`，再选择最相关的 skill 和最小必要 reference。

1. 参考输出先提取为 `问题重构 / 事实证据 / 优秀案例与机制拆解 / 发散方向 / 类比迁移 / 场景模拟 / 批判质疑 / 评估矩阵 / 候选方案 / 风险提示 / 验收问题 / 下一步行动 / 后续阶段输入`。
2. 再并入问题地图：会改变方向的放入 `[必须确认]`；只影响后续细化的写入对应下游阶段输入。
3. 不把参考 skill 的角色设定、产品需求文档、故事、审查清单、测试建议或技术推荐写成已确认，除非用户明确确认。
4. 用户确认后，立即写入对应确认状态或真实 confirmed marker。

## 控制层读取

预算用于控制上下文和避免“为了完整而完整”。先读 `.specforge/core/skills/brainstorm/SKILL.md`，再由根入口读取 `references/brainstorm-playbook.md`，选择 `clarify-light / product-discovery / experience-exploration / technical-decision / research-heavy`，并读取该 profile 的最短链路。

`brainstorm-playbook.md` 是执行权威；本文件只执行它。实际读取超过 profile 必读链路 2 个以上文件时，必须在 `brainstorm.md#执行配置` 说明升级原因、预期输出和被跳过内容。

必须同步记录：

- `Brainstorm profile`
- `Case study depth`
- `Discussion depth`
- `Package references used`
- `External references used`
- `Sections marked N/A`

## 过程

0. **读取 Brainstorm 模式。**
   - 从 `00-intake/brief.md#Brainstorm 决策` 读取 `Brainstorm mode: skip / light / deep`。
   - 从同一表读取 `Execution profile: skip / light / deep / research-heavy`；如果为空，则根据 `Brainstorm mode` 和事实风险推导，并回写 brief。
   - `skip` 时不要强行 brainstorm，回到 brief 指定下一步。
   - `light` 时执行框定、候选和收敛，但不做五维全量发散。
   - `deep` 时必须先做 Phase 1 发散，再做 Phase 2 聚焦。
   - 涉及事实争议、依赖版本、AI provider、价格、法规、安全或竞品取舍时，将执行 profile 记为 `research-heavy`，即使 brief 原始模式是 `light`。
   - 在 `brainstorm.md#执行配置` 记录：`Brainstorm mode`、`Execution profile`、`Brainstorm profile`、`Case study depth`、`Discussion depth`、`Package references used`、`External references used`、`Sections marked N/A`。
   - 模式来源见 `sf-intake` 的“Brainstorm 分流规则”和 `core/artifacts/templates/brief.md#Brainstorm 决策`。
   - 读取 `.specforge/core/skills/brainstorm/SKILL.md`，用根入口和 profile 路由决定本轮读取范围；不要直接从零散方法开始。
   - 读取 `.specforge/core/skills/brainstorm/references/brainstorm-playbook.md`，用 `Expose -> Ask -> Record` 循环安排多轮探讨。
1. **框定问题和事实输入。**
   - 请求、目标用户、成功标准、约束或真实冲突不清楚时，先读取 `.specforge/core/skills/brainstorm/references/methods.md#Problem Framing`。
   - 写清用户目标、目标用户、业务结果、约束和当前已知事实。
2. **补足当前事实和外部参考。**
   - 需要外部事实时先读取 `.specforge/core/skills/brainstorm/references/research-source.md`，按其中的 source index、evidence contract 和 dependency version map 查证，不凭旧知识拍板。
   - 以下情况必须调用 `research-source`，不允许跳过：
     - 涉及具体版本号、依赖兼容性、API 限制：查官方文档 + GitHub releases / package changelog。
     - 涉及新引入的库或工具：查 npmjs / GitHub Issues / releases / 已知 bug。
     - 涉及 AI provider 能力边界、上下文长度、价格、限流或数据使用：查各厂商官方文档，带访问日期。
     - 涉及竞品功能声明、定价或市场定位：查竞品官网、官方 changelog、官方 blog，不引用二手评测当事实。
     - 涉及法规、合规、数据隐私、安全漏洞：查官方法规 / 标准 / NVD / Snyk / OWASP 等权威来源。
   - 查证结果必须先记录搜索计划，再记录来源 URL、访问 / 发布日期、关键结论（1-2 句）、置信度（confirmed / likely / unclear）。
   - 涉及新增 / 替换依赖、SDK、插件、组件库、测试库、运行时或 package manager 时，必须按 `research-source/references/dependency-version-map.md` 记录版本依赖关系：direct、peer、runtime、lockfile、transitive、breaking、override / resolution。
   - 版本依赖关系只作为 brainstorm 风险和交接；最终锁版本、依赖确认、兼容策略和验证方案交给 `sf-tech-design`。
   - 不需要外部研究时写明 `跳过理由：[具体原因]`，不允许只写“无需外部研究”。
   - 需要参考 skill 时，按 `.specforge/core/skills/ORCHESTRATION.md` 选择并读取；输出必须按“参考 Skill 归一化”处理。
3. **侦察优秀案例和可迁移机制。**
   - 先读取 `.specforge/core/skills/brainstorm/references/brainstorm-playbook.md#Case Study Protocol` 和 `.specforge/core/skills/brainstorm/data/case-source-catalog.csv`。
   - 用户提供案例、截图、模板站、竞品或要求更高级 / 不模板化时，必须执行 `.specforge/core/skills/brainstorm/references/brainstorm-playbook.md#Case Study Protocol`。
   - 产品体验、管理端、数据看板、AI 工具、网站、品牌页、内容工具或工作流方向会影响后续设计 / 实现时，默认执行 Case Study Protocol；跳过必须写具体理由。
   - 不能只列案例名。必须记录案例池、URL 或截图路径、访问日期、值得看的点、可迁移机制、不能照搬点和证据状态。
   - 至少形成 2 条互斥机制路线，并写清成本、风险和后续验证；不要把所有优秀案例特点堆成一个不可落地的大方案。
   - 如果案例声明涉及具体功能、价格、发布状态、性能、安全或法规，交给 `research-source` 查证，不能让案例侦察替代事实查证。
4. **建立问题地图。**
   - 建立问题地图：`[已明确]`、`[必须确认]`、`[可安全默认]`。
   - 若对某项是否“明显最优”存在任何不确定，强制划入 `[必须确认]`。
   - 将所有 `[必须确认]` 按以下维度排序：核心目标/范围 > 体验方向 > 数据与安全 > 集成与依赖 > 交付验收。
5. **Phase 1 发散。**
   - 仅 `deep` 必填；`light` 可写 N/A 和理由。
   - 需要发散时读取 `.specforge/core/skills/brainstorm/references/methods.md#Divergent Thinking`；候选方案同质化或需要差异化机制时，再读取 `methods.md#Analogy Thinking`。
   - 从六个维度列出可能性，不先筛选：用户目标、解法可能性、案例机制路线、技术路线、风险未知、不做什么。
   - 给用户看发散清单，询问是否有遗漏的重要方向。
   - 给用户前先自检：至少一个反直觉方案；至少一个来自案例机制但经过本项目适配的方案；考虑做更少或不做；技术路线至少两条；明确最大未知风险。
6. **Phase 2 聚焦。**
   - `deep` profile 给出方案前，读取 `.specforge/core/skills/brainstorm/references/methods.md#Scenario Simulation`，用关键场景、失败路径和边界条件压测候选。
   - `light` / `research-heavy` profile 只有当场景、失败路径或边界条件会改变推荐时才读取 `methods.md#Scenario Simulation`；否则在 `执行配置` 标记 `场景模拟: N/A + 理由`。
   - 推荐方案前，读取 `.specforge/core/skills/brainstorm/references/methods.md#Critic Review`，暴露最弱假设、反例、可删范围和验证点。
   - 需要排序、推荐或用户授权默认时，读取 `.specforge/core/skills/brainstorm/references/methods.md#Decision Matrix`，把取舍写成矩阵而不是散文判断。
   - 给出 2-3 个互斥方案或最小可行版本组合。
   - 每个方案必须包含：用户价值、实现成本、主要风险、适用场景、放弃代价。
   - 方案之间必须真的不同，不能只是同一方案的措辞变化。
7. **收敛取舍（Socratic 逐问协议）。**

   **铁律：每次只问一个问题。用户回答之前不得提出下一个问题。**

   问题优先级（从高到低依次问）：
   - P1 核心目标/范围：「这是为谁做的，解决什么核心问题？」「最小可行版本做什么，明确不做什么？」
   - P2 体验方向（有 UI 时）：「什么感觉？参考哪类产品？主要用户是什么角色？」
   - P3 数据与安全：「谁能看到数据，数据生命周期如何？」「有没有敏感数据或合规要求？」
   - P4 集成与依赖：「会依赖哪些外部系统或服务？」「现有系统有哪些约束？」
   - P5 交付验收：「怎么算做完？」「用户通过什么操作验证功能正常？」

   每个问题的正确格式：
   1. 先给 1 句背景（为什么要问这个）
   2. 提供 2-3 个选项（真实权衡，不是假选项）
   3. 结尾清楚提问，等待回答

   **收敛信号（满足全部才能进入下一阶段）：**
   - ✅ 所有 `[必须确认]` 问题有明确回答或明确授权默认
   - ✅ 最小可行版本范围已明确
   - ✅ 影响架构/体验/成本的高影响未知已清零或明确延后
   - ✅ 用户知道下一步是什么
   - ❌ 任何「[NEEDS ... DECISION]」标记存在 → 不得宣布收敛

   每轮对话结束前自检：是否还有未解决的高影响问题？如有，补写对应 `[NEEDS ... DECISION]` 后再输出回复或路由。

   用户确认后立即写确认状态，不要等到最后回忆：

   - UI / 视觉 / 体验方向：`UI Direction Status: confirmed` 或真实 `[UI DECISION CONFIRMED]`。
   - 技术栈 / 架构 / 数据库 / 调度器 / AI provider / 部署方向：`Tech Direction Status: confirmed` 或真实 `[TECH DECISION CONFIRMED]`；用户授权默认写 `Tech Direction Status: delegated_default`。
   - 新增 / 替换依赖：`Dependency Decision Status: confirmed` 或真实 `[DEPENDENCY DECISION CONFIRMED]`；用户授权默认写 `Dependency Decision Status: delegated_default`。
   - 工程工具链：`Tooling Decision Status: confirmed` 或真实 `[TOOLING DECISION CONFIRMED]`；用户授权默认写 `Tooling Decision Status: delegated_default`；沿用现有栈写 `Tooling Decision Status: existing_stack`。

   用户未确认前，不能把推荐项写成 approved。
8. **每轮落档同步。**
   - 每轮结束都更新阶段记录；不要只在最终收敛时才回忆写入。
   - 按 `brainstorm-playbook.md#Discussion Trace` 记录轮次、展示给用户的判断、问题、选项、用户回答和记录结果。
   - Embedded 模式写入 `00-intake/brainstorm.md` 并同步 `00-intake/brief.md`。
   - Standalone / Lightweight 模式写入 `specforge-import-ready.md` 格式内容。
9. **收敛落档。**
   - 写入前读取 `.specforge/core/skills/brainstorm/references/output-contract.md`，检查 Always Output、Conditional Output、Stop Conditions 和 Cross-stage Handoff。
   - 写入前读取 `.specforge/core/skills/brainstorm/references/methods.md#Output Shaping`，选择适合本轮的输出形态。
   - 需要进入产品需求文档、需求规格、界面设计、技术设计、研究或验证阶段时，读取 `.specforge/core/skills/brainstorm/references/methods.md#Execution Planning`，写清交接、负责人、输入产物和验证入口。
   - 写入 `00-intake/brainstorm.md`。
   - 更新 `00-intake/brief.md` 的澄清记录、功能候选池、用户选择、产品需求文档决策和下一步路由。
   - 如果来自产品需求文档、需求规格、界面设计或技术设计的返工，标明 `Return to` 和需要修改的 artifact。
   - 如果用户确认的是 UI / 视觉 / 体验方向，写入 `UI Direction Status: confirmed` 或 `[UI DECISION CONFIRMED]`，否则后续 `ui_design` 会继续被阻断。
   - 如果用户确认的是技术栈 / 架构 / 数据库 / 调度器 / AI provider / 部署 / 依赖方向，写入 `Tech Direction Status: confirmed` 或 `[TECH DECISION CONFIRMED]`；用户授权默认写 `Tech Direction Status: delegated_default`，否则后续 `technical_design` 会继续被阻断。
   - 如果用户确认的是新增 / 替换依赖，写入 `Dependency Decision Status: confirmed` 或 `[DEPENDENCY DECISION CONFIRMED]`；用户授权默认写 `Dependency Decision Status: delegated_default`，否则后续 `technical_design` 会继续被阻断。
   - 如果用户确认的是工程工具链，写入 `Tooling Decision Status: confirmed` 或 `[TOOLING DECISION CONFIRMED]`；用户授权默认写 `Tooling Decision Status: delegated_default`；沿用现有栈写 `Tooling Decision Status: existing_stack`，否则后续 `technical_design` 会继续被阻断。

## 正向执行断言

- 沉默不是确认；必须等到用户给出明确答复才能继续。
- 会影响架构、体验、成本或范围的问题，现在就要问，不能推给后续阶段。
- 用户说“你来决定”时，必须写明授权内容、推荐理由、风险和回退点。
- 每轮只问一个会改变方向的问题。
- 对 Agent 明显不等于对用户明显；只要不确定，就归入 `[必须确认]`。

## `brainstorm.md` 必含内容

- 执行配置：Brainstorm mode、Execution profile、Brainstorm profile、Case study depth、Discussion depth、Package references used、External references used、N/A section reason。
- 问题框架。
- 问题重构：原始表述、重写后的问题、核心冲突、成功标准、必须确认项。
- 当前事实和研究证据。
  - 必须先写搜索计划表：`事实问题 | 来源类型 | 查询入口 | 足够性`。
  - 必须写本地事实输入：已读取哪些 artifact / manifest / lockfile / wiki，哪些仍是 `unknown`。
  - 必须使用表格：`问题 | 来源 | 日期 | 结论 | 置信度`。
  - 涉及依赖 / SDK / runtime / package manager 时，必须写版本依赖关系表：`依赖 / 技术 | 当前 / 候选版本 | 关系类型 | 约束来源 | 影响 | 交接`。
  - 必须写覆盖度说明：已达到 quick / standard / dependency / high-stakes 哪个查证深度，缺口是什么。
  - 未查证项必须列 checklist：`- [ ] 问题描述 → 待查来源`。
- 优秀案例与机制拆解。
  - 必须先写侦察问题：本轮找什么、不找什么。
  - 必须写案例池：`案例 | 类型 | 来源 / URL | 访问日期 | 值得看的点 | 可迁移机制 | 不能照搬 | 证据状态`。
  - 必须写机制路线：`路线 | 来自哪些案例 | 适合当前项目的原因 | 成本 | 风险 | 后续验证`。
  - 必须写反模板化提醒：当前最容易落入的套路、应避免的视觉 / 交互、可以尝试的差异化机制。
  - 无需案例侦察时写 `N/A + 具体理由`，不能留空。
- 问题地图：已明确 / 必须确认 / 可安全默认，且必须确认项带优先级。
- 发散方向池：保守 / 标准 / 激进 / 实验 / 反直觉方向。
- 类比迁移：类比来源、可迁移机制、调整方式和风险。
- 场景模拟：关键场景、失败路径、边界条件和补救策略。
- 批判质疑：最弱假设、反方问题、可删范围和验证点。
- 方案评估矩阵：价值、成本、风险、落地性、可扩展性、置信度和推荐。
- 方案对比表。
- 推荐方案和理由。
- 用户确认记录：必须区分 `user-confirmed`、`delegated-default`、`agent-recommendation`、`pending`，防止下游把 Agent recommendation 当成用户确认。
- 讨论轨迹：轮次、展示给用户的判断、问题、选项、用户回答和记录结果。
- 参考 Skill 使用记录：读取了什么、提取了什么、如何归一化。
- 明确延后 / 不做。
- 未决问题。
- 下一步行动：下游阶段、输入产物、owner、阻断条件和验证入口。
- 下一步路由。

`light` profile 可将 `类比迁移`、`场景模拟` 或其他未使用 section 写为 `N/A`，但必须说明理由。`deep` 和 `research-heavy` profile 不能省略会影响推荐可信度的 section；缺证据时写入未查证项，而不是删 section。

## 判定表

| 条件 | 状态 |
|---|---|
| 用户尚未确认会改变范围、体验、架构、成本或安全的关键选择 | 停止 |
| 需要当前资料支撑的判断没有来源 | 停止 |
| 方案没有形成互斥对比，无法帮助用户取舍 | 停止 |
| 后续阶段会误解“Agent 推荐”为“用户确认” | 停止 |
| 任一 `[NEEDS ... DECISION]` 仍存在 | 停止 |
| 用户确认的选择、授权默认、Agent recommendation 和未决问题被清楚区分 | 完成条件之一 |
| `brainstorm.md` 足以支撑产品需求文档、需求规格、界面设计或技术设计继续推进 | 完成条件之一 |
| `brief.md` 已同步，不存在和 brainstorm 相冲突的产品需求文档决策或范围描述 | 完成 |

## 不做

- 不写最终 requirements。
- 不写完整技术设计。
- 不实现代码。
- 不批准任何 gate。
