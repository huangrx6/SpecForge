# SSoT Sync

## Does This Change Affect Project SSoT?

Yes.

## Updated Files

- `.specforge/project/engineering/architecture.md`
- `.specforge/project/engineering/validation-model.md`
- `.specforge/project/product/feature-list.md`
- `.specforge/project/decisions/ADR-0004-artifact-graph-driven-workflow.md`
- `.specforge/project/decisions/ADR-0005-chinese-first-content.md`

## Contract Changes

- SpecForge 引入 artifact graph 作为后续 workflow 状态计算方向。
- SpecForge 明确中文优先内容规则。
- `node .specforge/tools/artifact-graph-status.mjs` 成为当前 v0.1 的可用状态检查命令。

## Downstream Revalidation Needed

- 后续 change scaffolding 需要对齐 artifact graph。
- 后续 instructions CLI 需要读取同一 schema。
- 后续中文化专项需要遵守 `localization.md`。

## No-update Rationale

不适用。

## Notes

本次研究还新增了 `docs/research/*` 和 `docs/architecture/v0.2-reference-architecture.md`，作为 v0.2 规划依据。
