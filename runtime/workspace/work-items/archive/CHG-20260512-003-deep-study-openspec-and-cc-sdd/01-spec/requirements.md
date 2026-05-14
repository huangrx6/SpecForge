# Requirements

## Summary

本变更要求 SpecForge 基于 OpenSpec 和 cc-sdd 的真实实现补足研究、架构和初步机制，而不是继续停留在轻量目录模板。

## Boundary

### Owns

- 深度研究 OpenSpec 和 cc-sdd 的实现结构。
- 输出中文研究文档、差距分析和 v0.2 参考架构。
- 更新 SpecForge SSoT 与 ADR。
- 增加最小可运行 artifact graph 状态能力。
- 建立中文优先规则。

### Does Not Own

- 完整 CLI 产品化。
- 完整 OpenSpec 式 delta spec apply。
- 完整 cc-sdd 式多工具 installer。
- 全仓库一次性中文迁移。

### Dependencies

- OpenSpec 仓库源码。
- cc-sdd 仓库源码。
- 当前 SpecForge v0.1 文件协议。

### Revalidation Triggers

- 如果后续改变 change scaffolding 策略，需要重新验证 artifact graph 状态判断。
- 如果引入 YAML parser 或正式 CLI，需要重新验证 `standard.json` 是否迁移为 YAML。
- 如果进行全量中文化，需要重新审查规则、模板、技能是否一致。

## Clarifications

- 无待澄清项。

## Functional Requirements

### FR-1 OpenSpec 实现研究

- WHEN 研究 OpenSpec, THE SYSTEM SHALL 记录其 CLI、artifact graph、instructions、validation、apply/archive、config 的实现机制。

### FR-2 cc-sdd 实现研究

- WHEN 研究 cc-sdd, THE SYSTEM SHALL 记录其 installer、manifest、agent registry、shared rules、skills、review gate、implementation validation 的实现机制。

### FR-3 差距分析

- WHEN 两个项目研究完成, THE SYSTEM SHALL 输出 SpecForge 当前问题、可借鉴机制和分阶段升级路线。

### FR-4 Artifact graph 初步落地

- WHEN 用户查看当前 active change, THE SYSTEM SHALL 能基于 `.specforge/schemas/standard.json` 输出 artifact 的 ready / blocked / done / missing 状态。

### FR-5 中文优先

- WHERE 内容面向人类阅读, THE SYSTEM SHALL 优先使用中文，保留必要命令、路径、状态值和外部项目原名。

## Non-functional Requirements

- 新增脚本不得引入外部依赖。
- 更新内容应可被 `node .specforge/tools/validate-structure.mjs` 验证。
- 文档应清晰表达机制、差距和后续落地顺序，避免泛泛价值描述。

## Out of Scope

- 自动生成下一 artifact。
- 自动归档和 delta apply。
- 多工具安装器。

## Acceptance Criteria

| Criterion | Verification |
|---|---|
| OpenSpec 研究文档存在且覆盖实现机制 | `docs/research/openspec-implementation-study.md` |
| cc-sdd 研究文档存在且覆盖实现机制 | `docs/research/cc-sdd-implementation-study.md` |
| 差距分析和升级路线存在 | `docs/research/specforge-gap-analysis.md` |
| v0.2 参考架构存在 | `docs/architecture/v0.2-reference-architecture.md` |
| Artifact graph 状态脚本可运行 | `node .specforge/tools/artifact-graph-status.mjs` |
| 结构校验通过 | `node .specforge/tools/validate-structure.mjs` |
