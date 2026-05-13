# Implementation Plan

## Scope

1. 阅读 OpenSpec 和 cc-sdd 关键实现。
2. 新增中文研究文档和差距分析。
3. 新增 artifact graph schema、规则和状态脚本。
4. 更新 README、SSoT、ADR。
5. 完成验证和归档准备。

## Steps

1. 克隆并检查 OpenSpec、cc-sdd 仓库源码。
2. 研究 OpenSpec 的 artifact graph、instructions、validation、apply/archive。
3. 研究 cc-sdd 的 installer、manifest、agent registry、skills、review gates、impl validation。
4. 编写 `docs/research/*` 和 `docs/architecture/v0.2-reference-architecture.md`。
5. 新增 `.specforge/schemas/standard.json`、artifact graph 规则、中文优先规则。
6. 新增 `.specforge/tools/artifact-graph-status.mjs` 和 `node .specforge/tools/artifact-graph-status.mjs`。
7. 更新 SSoT、ADR、当前 change 产物。
8. 运行校验。

## Files Expected to Change

- `README.md`
- `package.json`
- `.specforge/schemas/standard.json`
- `.specforge/rules/index.md`
- `.specforge/rules/artifact-graph.md`
- `.specforge/rules/localization.md`
- `.specforge/tools/artifact-graph-status.mjs`
- `.specforge/tools/validate-structure.mjs`
- `docs/research/openspec-implementation-study.md`
- `docs/research/cc-sdd-implementation-study.md`
- `docs/research/specforge-gap-analysis.md`
- `docs/research/sdd-reference-synthesis.md`
- `docs/architecture/v0.2-reference-architecture.md`
- `.specforge/project/engineering/architecture.md`
- `.specforge/project/engineering/validation-model.md`
- `.specforge/project/product/feature-list.md`
- `.specforge/project/decisions/ADR-0004-artifact-graph-driven-workflow.md`
- `.specforge/project/decisions/ADR-0005-chinese-first-content.md`
