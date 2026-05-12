# Brief: 深入研究 OpenSpec 和 cc-sdd

## Summary

本次变更对 OpenSpec 和 cc-sdd 做实现级研究，并把结论回流到 SpecForge 项目。重点不是简单润色文档，而是识别当前 SpecForge 与成熟 SDD 工具之间的机制差距。

## Change Type

FEATURE / RESEARCH / ARCHITECTURE ENRICHMENT

## Suggested Workflow

standard

## Initial Scope

- 克隆并阅读 OpenSpec 的 CLI、artifact graph、validation、archive、apply、schema 相关实现。
- 克隆并阅读 cc-sdd 的 installer、manifest、agent registry、shared rules、skills、review gate、implementation validation 相关实现。
- 输出中文研究文档和差距分析。
- 为 SpecForge 增加初版 artifact graph schema 和状态脚本。
- 更新项目 SSoT、ADR、README 和验证模型。

## Out of Scope

- 本次不实现完整 CLI。
- 本次不实现 delta spec apply。
- 本次不做全仓库彻底中文化，只建立中文优先规则和关键文档基线。
- 本次不接入多 AI 工具 adapter installer。
