# Script Modules

根目录脚本是稳定 CLI 入口，不直接移动。模块目录定义职责边界和后续抽取目标：新逻辑先归入模块，再由根入口调用。

| 模块 | 目录 | 根入口 |
|---|---|---|
| routing | `routing/` | `status.mjs`, `instructions.mjs`, `workflow-audit.mjs`, `workflow-health.mjs`, `stage-contract.mjs`, `artifact-graph-status.mjs` |
| authoring | `authoring/` | `create-work.mjs`, `create-artifact.mjs`, `sync-wiki.mjs` |
| quality | `quality/` | `quality-suite.mjs`, `artifact-quality.mjs`, `decision-quality.mjs`, `source-quality.mjs`, `implementation-quality.mjs`, `test-case-quality.mjs`, `evidence-summary.mjs`, `wiki-quality.mjs`, `closure-quality.mjs`, `gate-preflight.mjs` |
| gates | `gates/` | `gate.mjs` |
| reporting | `reporting/` | `render-work-report.mjs`, `workflow-package.mjs`, `handoff-summary.mjs`, `traceability-summary.mjs` |
| code-intelligence | `code-intelligence/` | `codebase-map.mjs`, `codebase-index.mjs` |
| maintenance | `maintenance/` | `doctor.mjs`, `self-test.mjs`, `framework-audit.mjs`, `sync-starter.mjs`, `update-skills.mjs`, `validate-structure.mjs`, `validate-skills.mjs`, `validate-external-skills.mjs` |
| archive | `archive/` | `archive-work.mjs` |

## 抽取规则

- 根目录脚本必须保持稳定入口；不要让外部用户改命令。
- 新的可复用逻辑优先放到 `core/scripts/lib/` 或对应模块目录。
- 模块 README 是 owner 边界；新增脚本前先确认能归入一个模块。
- `framework-audit.mjs` 负责检查本目录的存在和 starter 覆盖。
