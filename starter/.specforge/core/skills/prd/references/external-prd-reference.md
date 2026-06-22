# External PRD Reference

本文件替代原 `create-prd/` 子目录和 `external-prd-skill-normalization.md`。外部 `create-prd` 只能作为结构和检查视角，不能替代 `core/skills/prd/SKILL.md`。

## Source Snapshot

外部参考来源：

- Skill: `create-prd`
- Repo: `phuryn/pm-skills`
- Path: `pm-execution/skills/create-prd/SKILL.md`
- Use: 8 段式 PRD 结构参考，包含 summary、contacts、background、objective、market segments、value propositions、solution、release。

外部参考提醒：

- 它建议保存为 `PRD-[product-name].md`，SpecForge 中必须忽略该投递动作。
- 它包含 `Technology` 小节，SpecForge 中不能扩写成技术设计；只保留产品影响和下游备注。
- 它可能把 solution 写成较完整方案，SpecForge 中必须重新归一化为候选功能、MVP、非目标和开放问题。

## 可以吸收

- 背景、目标、用户、价值、假设和版本分期的组织方式。
- 目标和非目标的表达。
- 成功指标和开放问题的提醒。
- 8 段式结构作为覆盖检查。

## 必须丢弃

- 保存为 `PRD-[product-name].md` 的外部投递动作。
- 技术考虑中的架构扩写。
- 直接进入需求阶段的暗示。
- 自动决定 MVP 的输出。
- 与 SpecForge 产物图不匹配的章节。

## 归一化

| 外部输出 | SpecForge PRD |
|---|---|
| Summary | 产品决策摘要 |
| Background | 背景与目标结果 |
| Objective | 目标结果 / 指标与评估 |
| Market Segment(s) | 用户、角色与场景 |
| Value Proposition(s) | 问题、用户价值、候选功能池 |
| Solution | 候选功能池、范围与 MVP 决策、非目标 |
| Technology | 只在和产品相关时，写入给技术设计阶段的备注 |
| Release | 路线图与版本切分 |
| Assumptions | 假设台账 / 开放问题 |

## 使用边界

- 先读本地 `prd` 和 `product` 能力包，再按需读取本文件。
- 外部参考只能补结构视角，不能反向决定 SpecForge 模板。
- 外部参考输出与用户确认或本地 PRD 边界冲突时，以用户确认和 SpecForge 边界为准。
- 在 `prd.md#0. 产品需求文档控制` 记录是否参考了本文件，以及归一化位置。
