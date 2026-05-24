---
name: research
description: SpecForge 内部预研技能。执行架构论证、API可行性测试或技术栈 Spike。
---

# Research Skill

本技能专为 Discovery 流程服务。它的结果是决策，而不是生产环境的代码。

## 读取

- `00-intake/original-request.md`
- `00-intake/brief.md`
- `.specforge/core/standards/product.md`
- `.specforge/core/standards/engineering.md`
- 与调研主题相关的官方文档、源码、release note 或项目内证据
- `.specforge/core/skills/deep-research/SKILL.md`（需要多来源综合、引用、共识 / 争议或研究空白结构时）

## 写入

- `01-spec/research.md`

## 调研流程

1. 根据 brief，澄清本次预研的核心假说。
2. 收集来源时优先使用官方文档、源码、标准或项目事实；记录版本、日期和权威度。
3. 需要多来源综合时，参考 `deep-research` 的结构组织来源、关键发现、共识、争议和进一步研究空白；版本敏感事实仍必须实时核验。
4. 进行极简 PoC 或可复现实验；无法实验时写明原因和替代证据。
5. 提供多个技术或架构路径的横向对比，覆盖实施成本、迁移、运维和回滚。
6. 评估 License / Security / Operations / Performance / Vendor Lock-in / Migration 风险。
7. 做出最终决策：`ADOPT`、`REJECT`、`DEFER` 或 `SPLIT`。
8. 给出后续 workflow 路由；需要落地时关闭 discovery work item 后新开 feature / standard / refactor / bugfix work item。

## 必含章节

- 决策摘要：状态、推荐方向、置信度和后续 workflow。
- 调研背景、核心论证问题、成功判定标准和明确不研究的内容。
- 来源与情报池。
- 实验方法与可复现性。
- 核心发现。
- 架构方案对比。
- 风险评估。
- 结论与 ADR。
- 后续路由和未解决问题。

## 停止条件

- 关键事实依赖版本敏感资料，但未查到官方或一手来源。
- PoC 结论无法复现，也没有替代证据。
- 调研问题实际已经变成待实现的新功能、bugfix 或重构，需要重新开对应 workflow。

## 完成标准

- 输出了足够支撑未来 Feature 开发的确定性结论。
- 不承诺在当前 discovery work item 中直接实现生产代码。
