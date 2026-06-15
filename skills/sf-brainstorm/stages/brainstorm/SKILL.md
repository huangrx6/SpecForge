---
name: brainstorm
description: SpecForge 内部 brainstorm 阶段技能。用于在 intake、PRD、requirements、UI design 或 technical design 前后，对模糊方向做用户参与式发散、研究、取舍和确认。
---

# Brainstorm Skill

Brainstorm 是 graph 外的协作收敛阶段。它服务于后续 PRD、requirements、UI design 和 technical design，但不替代这些产物。它的核心职责是让 Agent 暂停单向推理，和用户一起把“可能性空间”变成“已确认选择 + 明确延后项 + 可安全默认”。

## 输入

- 用户当前问题和上下文。
- `00-intake/original-request.md`。
- `00-intake/brief.md`。
- 可选：`00-intake/prd.md`、`01-spec/requirements.md`、`01-spec/ui-design.md`、`01-spec/technical-design.md`。
- 相关 `.specforge/wiki/` 长期事实。
- 当前可靠外部资料；技术类优先官方文档，产品/竞品类记录来源和访问日期。
- `.specforge/core/skills/ORCHESTRATION.md`（需要参考 skill 时，用于选择 skill、读取 reference 和归一化输出）。
- `.specforge/core/skills/research/brainstorm-search/SKILL.md`（需要外部事实、版本、竞品、价格、漏洞、法规或 AI provider 资料时，用于搜索来源和证据记录）。

## 触发

- 模糊产品想法、页面体验、AI 能力、运营后台、多角色流程、审批/权限/数据生命周期。
- PRD 或 requirements 前缺少 MVP、用户角色、成功标准、非目标或功能候选池。
- UI design 前缺少信息架构、关键任务、状态矩阵或交互风格方向。
- `instructions.mjs` 给出 `ui-direction-unconfirmed` blocker。
- `instructions.mjs` 给出 `tech-direction-unconfirmed` blocker。
- `instructions.mjs` 给出 `dependency-decision-unconfirmed` blocker。
- `instructions.mjs` 给出 `tooling-decision-unconfirmed` blocker。
- technical design 前缺少技术路线、版本、依赖、部署、成本、安全或长期维护取舍。
- 任一 spec review 发现“方案还没被用户确认”。

## 参考 Skill 归一化

需要参考 skill 时，先读 `.specforge/core/skills/ORCHESTRATION.md`，再选择最相关的 skill 和最小必要 reference。

1. 参考输出先提取为 `候选方案 / 风险提示 / 访谈镜头 / 研究问题 / 验收问题 / 后续阶段输入`。
2. 再并入问题地图：会改变方向的放入 `[必须确认]`；只影响后续细化的写入对应下游阶段输入。
3. 不把参考 skill 的 persona、PRD、故事、审查清单、测试建议或技术推荐写成已确认，除非用户明确确认。
4. 用户确认后，立即写入对应确认状态或真实 confirmed marker。

## 过程

0. **读取 Brainstorm 模式。**
   - 从 `00-intake/brief.md#Brainstorm 决策` 读取 `Brainstorm mode: skip / light / deep`。
   - `skip` 时不要强行 brainstorm，回到 brief 指定下一步。
   - `light` 时执行框定、候选和收敛，但不做五维全量发散。
   - `deep` 时必须先做 Phase 1 发散，再做 Phase 2 聚焦。
   - 模式来源见 `sf-intake` 的“Brainstorm 分流规则”和 `core/artifacts/templates/brief.md#Brainstorm 决策`。
1. **框定问题和事实输入。**
   - 写清用户目标、目标用户、业务结果、约束和当前已知事实。
2. **补足当前事实和外部参考。**
   - 需要外部事实时先读取 `.specforge/core/skills/research/brainstorm-search/SKILL.md`，再按其 `references/source-index.md` 和 `references/evidence-contract.md` 查证，不凭旧知识拍板。
   - 以下情况必须调用 `brainstorm-search`，不允许跳过：
     - 涉及具体版本号、依赖兼容性、API 限制：查官方文档 + GitHub releases / package changelog。
     - 涉及新引入的库或工具：查 npmjs / GitHub Issues / releases / 已知 bug。
     - 涉及 AI provider 能力边界、上下文长度、价格、限流或数据使用：查各厂商官方文档，带访问日期。
     - 涉及竞品功能声明、定价或市场定位：查竞品官网、官方 changelog、官方 blog，不引用二手评测当事实。
     - 涉及法规、合规、数据隐私、安全漏洞：查官方法规 / 标准 / NVD / Snyk / OWASP 等权威来源。
   - 查证结果必须先记录搜索计划，再记录来源 URL、访问 / 发布日期、关键结论（1-2 句）、置信度（confirmed / likely / unclear）。
   - 涉及新增 / 替换依赖、SDK、插件、组件库、测试库、运行时或 package manager 时，必须按 `brainstorm-search/references/dependency-version-map.md` 记录版本依赖关系：direct、peer、runtime、lockfile、transitive、breaking、override / resolution。
   - 版本依赖关系只作为 brainstorm 风险和 handoff；最终锁版本、依赖确认、兼容策略和验证方案交给 `sf-tech-design`。
   - 不需要外部研究时写明 `跳过理由：[具体原因]`，不允许只写“无需外部研究”。
   - 需要参考 skill 时，按 `core/skills/ORCHESTRATION.md` 选择并读取；输出必须按“参考 Skill 归一化”处理。
3. **建立问题地图。**
   - 建立问题地图：`[已明确]`、`[必须确认]`、`[可安全默认]`。
   - 若对某项是否“明显最优”存在任何不确定，强制划入 `[必须确认]`。
   - 将所有 `[必须确认]` 按以下维度排序：核心目标/范围 > 体验方向 > 数据与安全 > 集成与依赖 > 交付验收。
4. **Phase 1 发散。**
   - 仅 `deep` 必填；`light` 可写 N/A 和理由。
   - 从五个维度列出可能性，不先筛选：用户目标、解法可能性、技术路线、风险未知、不做什么。
   - 给用户看发散清单，询问是否有遗漏的重要方向。
   - 给用户前先自检：至少一个反直觉方案；考虑做更少或不做；技术路线至少两条；明确最大未知风险。
5. **Phase 2 聚焦。**
   - 给出 2-3 个互斥方案或 MVP 组合。
   - 每个方案必须包含：用户价值、实现成本、主要风险、适用场景、放弃代价。
   - 方案之间必须真的不同，不能只是同一方案的措辞变化。
6. **收敛取舍（Socratic 逐问协议）。**

   **铁律：每次只问一个问题。用户回答之前不得提出下一个问题。**

   问题优先级（从高到低依次问）：
   - P1 核心目标/范围：「这是为谁做的，解决什么核心问题？」「MVP 做什么，明确不做什么？」
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
   - ✅ MVP 范围已明确
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
7. **每轮落档同步。**
   - 每轮结束都更新阶段记录；不要只在最终收敛时才回忆写入。
   - Embedded 模式写入 `00-intake/brainstorm.md` 并同步 `00-intake/brief.md`。
   - Standalone / Lightweight 模式写入 `specforge-import-ready.md` 格式内容。
8. **收敛落档。**
   - 写入 `00-intake/brainstorm.md`。
   - 更新 `00-intake/brief.md` 的澄清记录、功能候选池、用户选择、PRD 决策和下一步路由。
   - 如果来自 PRD / requirements / UI / tech design 的返工，标明 `Return to` 和需要修改的 artifact。
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

- 问题框架。
- 当前事实和研究证据。
  - 必须先写搜索计划表：`事实问题 | 来源类型 | 查询入口 | 足够性`。
  - 必须写本地事实输入：已读取哪些 artifact / manifest / lockfile / wiki，哪些仍是 `unknown`。
  - 必须使用表格：`问题 | 来源 | 日期 | 结论 | 置信度`。
  - 涉及依赖 / SDK / runtime / package manager 时，必须写版本依赖关系表：`依赖 / 技术 | 当前 / 候选版本 | 关系类型 | 约束来源 | 影响 | Handoff`。
  - 必须写覆盖度说明：已达到 quick / standard / dependency / high-stakes 哪个查证深度，缺口是什么。
  - 未查证项必须列 checklist：`- [ ] 问题描述 → 待查来源`。
- 问题地图：已明确 / 必须确认 / 可安全默认，且必须确认项带优先级。
- 方案对比表。
- 推荐方案和理由。
- 用户确认记录。
- 参考 Skill 使用记录：读取了什么、提取了什么、如何归一化。
- 明确延后 / 不做。
- 未决问题。
- 下一步路由。

## 判定表

| 条件 | 状态 |
|---|---|
| 用户尚未确认会改变范围、体验、架构、成本或安全的关键选择 | 停止 |
| 需要当前资料支撑的判断没有来源 | 停止 |
| 方案没有形成互斥对比，无法帮助用户取舍 | 停止 |
| 后续阶段会误解“Agent 推荐”为“用户确认” | 停止 |
| 任一 `[NEEDS ... DECISION]` 仍存在 | 停止 |
| 用户确认的选择、授权默认、Agent recommendation 和未决问题被清楚区分 | 完成条件之一 |
| `brainstorm.md` 足以支撑 PRD、requirements、UI design 或 technical design 继续推进 | 完成条件之一 |
| `brief.md` 已同步，不存在和 brainstorm 相冲突的 PRD 决策或范围描述 | 完成 |

## 不做

- 不写最终 requirements。
- 不写完整技术设计。
- 不实现代码。
- 不批准任何 gate。
