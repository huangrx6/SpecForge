# External PRD Skill Normalization

外部 `create-prd` 只能作为结构和检查视角，不能替代 `core/skills/prd/SKILL.md`。

## 可以吸收

- 背景、目标、用户、价值、假设和 release 分期的组织方式。
- 目标和非目标的表达。
- 成功指标和 open questions 的提醒。

## 必须丢弃

- 保存为 `PRD-[product-name].md` 的外部投递动作。
- Technology / Technical Considerations 中的架构扩写。
- 直接进入 requirements 的暗示。
- 自动决定 MVP 的输出。
- 与 SpecForge artifact graph 不匹配的章节。

## Normalization

| 外部输出 | SpecForge PRD |
|---|---|
| Executive Summary | Product Decision Summary |
| Goals / Non-goals | Scope & MVP Decision / Non-goals |
| User Personas | Users, Roles & Scenarios |
| Features | Candidate Feature Pool |
| Release Plan | Roadmap / Release Slicing |
| Technical Considerations | Notes for technical_design, only if product-relevant |
| Open Questions | Open Questions & Decisions |
