# Script Modules

根目录脚本只允许作为稳定 CLI wrapper。模块目录是脚本实现的唯一归属：新逻辑先归入模块，再由根入口按需兼容跳转。

| 模块 | 目录 | 实现脚本 |
|---|---|---|
| routing | `routing/` | `status.mjs`, `instructions.mjs`, `workflow-audit.mjs`, `workflow-health.mjs`, `stage-contract.mjs`, `artifact-graph-status.mjs` |
| authoring | `authoring/` | `create-work.mjs`, `create-artifact.mjs`, `sync-wiki.mjs` |
| quality | `quality/` | `quality-suite.mjs`, `artifact-quality.mjs`, `decision-brief.mjs`, `decision-checkpoints.mjs`, `decision-quality.mjs`, `source-quality.mjs`, `implementation-quality.mjs`, `test-case-quality.mjs`, `evidence-summary.mjs`, `wiki-quality.mjs`, `closure-quality.mjs`, `gate-preflight.mjs` |
| gates | `gates/` | `gate.mjs` |
| reporting | `reporting/` | `render-work-report.mjs`, `workflow-package.mjs`, `handoff-summary.mjs`, `traceability-summary.mjs` |
| code-intelligence | `code-intelligence/` | `codebase-map.mjs`, `codebase-index.mjs`, `graph-freshness.mjs`, `graph-impact.mjs`, `wiki-refresh-plan.mjs` |
| wiki | `wiki/` | `wiki-update-plan.mjs`, `wiki-hydrate.mjs` |
| maintenance | `maintenance/` | `doctor.mjs`, `self-test.mjs`, `framework-audit.mjs`, `sync-starter.mjs`, `update-skills.mjs`, `validate-structure.mjs`, `validate-skills.mjs`, `validate-external-skills.mjs` |
| archive | `archive/` | `archive-work.mjs` |

## 结构规则

- 根目录脚本必须保持稳定入口，但只能是薄 wrapper。
- 模块目录必须包含对应实现脚本，不能只放 README。
- 新的可复用逻辑优先放到 `core/scripts/lib/` 或对应模块目录。
- 模块 README 是 owner 边界；新增脚本前先确认能归入一个模块。
- `framework-audit.mjs` 负责检查本目录、root wrapper 和 starter 覆盖。
