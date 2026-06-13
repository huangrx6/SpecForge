# Routing Module

职责：判断当前 work item 状态、下一步、阶段契约、工作流健康和 artifact graph。

稳定入口：`status.mjs`、`instructions.mjs`、`workflow-audit.mjs`、`workflow-health.mjs`、`stage-contract.mjs`、`artifact-graph-status.mjs`。

不要在这里放 artifact 写入逻辑。
