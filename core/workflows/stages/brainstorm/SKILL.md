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

## 过程

0. **读取 Brainstorm 模式。**
   - 从 `00-intake/brief.md#Brainstorm 决策` 读取 `Brainstorm mode: skip / light / deep`。
   - `skip` 时不要强行 brainstorm，回到 brief 指定下一步。
   - `light` 时执行框定、候选和收敛，但不做五维全量发散。
   - `deep` 时必须先做 Phase 1 发散，再做 Phase 2 聚焦。
1. **框定问题。**
   - 写清用户目标、目标用户、业务结果、约束和当前已知事实。
   - 分成 `已明确`、`高影响未知`、`可安全默认`。
2. **补足当前事实。**
   - 需要外部事实时先研究，不凭旧知识拍板。
   - 技术事实优先官方资料；产品/竞品事实至少说明来源、日期和结论。
   - 不需要外部研究时写明跳过理由。
3. **Phase 1 发散。**
   - 仅 `deep` 必填；`light` 可写 N/A 和理由。
   - 从五个维度列出可能性，不先筛选：用户目标、解法可能性、技术路线、风险未知、不做什么。
   - 给用户看发散清单，询问是否有遗漏的重要方向。
   - 给用户前先自检：至少一个反直觉方案；考虑做更少或不做；技术路线至少两条；明确最大未知风险。
4. **Phase 2 聚焦。**
   - 给出 2-3 个互斥方案或 MVP 组合。
   - 每个方案必须包含：用户价值、实现成本、主要风险、适用场景、放弃代价。
   - 方案之间必须真的不同，不能只是同一方案的措辞变化。
5. **收敛取舍。**
   - 给出推荐项和不推荐项，但标为 Agent recommendation。
   - 一轮只问 1-3 个会改变方向的问题。
   - 用户未确认前，不能把推荐项写成 approved。
6. **落档同步。**
   - 写入 `00-intake/brainstorm.md`。
   - 更新 `00-intake/brief.md` 的澄清记录、功能候选池、用户选择、PRD 决策和下一步路由。
   - 如果来自 PRD / requirements / UI / tech design 的返工，标明 `Return to` 和需要修改的 artifact。
   - 如果用户确认的是 UI / 视觉 / 体验方向，写入 `UI Direction Status: confirmed` 或 `[UI DECISION CONFIRMED]`，否则后续 `ui_design` 会继续被阻断。
   - 如果用户确认的是技术栈 / 架构 / 数据库 / 调度器 / AI provider / 部署 / 依赖方向，写入 `Tech Direction Status: confirmed` 或 `[TECH DECISION CONFIRMED]`；用户授权默认写 `Tech Direction Status: delegated_default`，否则后续 `technical_design` 会继续被阻断。
   - 如果用户确认的是新增 / 替换依赖，写入 `Dependency Decision Status: confirmed` 或 `[DEPENDENCY DECISION CONFIRMED]`；用户授权默认写 `Dependency Decision Status: delegated_default`，否则后续 `technical_design` 会继续被阻断。
   - 如果用户确认的是工程工具链，写入 `Tooling Decision Status: confirmed` 或 `[TOOLING DECISION CONFIRMED]`；用户授权默认写 `Tooling Decision Status: delegated_default`；沿用现有栈写 `Tooling Decision Status: existing_stack`，否则后续 `technical_design` 会继续被阻断。

## `brainstorm.md` 必含内容

- 问题框架。
- 当前事实和研究证据。
- 已明确 / 高影响未知 / 可安全默认。
- 方案对比表。
- 推荐方案和理由。
- 用户确认记录。
- 明确延后 / 不做。
- 未决问题。
- 下一步路由。

## 停止条件

- 用户尚未确认会改变范围或架构的关键选择。
- 需要当前资料支撑的判断没有来源。
- 方案没有形成互斥对比，无法帮助用户取舍。
- 后续阶段会误解“Agent 推荐”为“用户确认”。

## 完成标准

- 用户确认的选择、Agent 默认假设和未决问题被清楚区分。
- `brainstorm.md` 足以支撑 PRD、requirements、UI design 或 technical design 继续推进。
- `brief.md` 已同步，不存在和 brainstorm 相冲突的 PRD 决策或范围描述。

## 不做

- 不写最终 requirements。
- 不写完整技术设计。
- 不实现代码。
- 不批准任何 gate。
