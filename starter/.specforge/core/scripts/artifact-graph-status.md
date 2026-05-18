# artifact-graph-status.mjs

`artifact-graph-status.mjs` 根据当前 work item 的 `workflow` 和 `components` 自动加载有效 schema，展示 artifact graph 状态。它不是简单“打印阶段”，而是回答哪些 artifact 已完成、哪些可继续、哪些被依赖或 gate 阻塞。

## 用法

```bash
node .specforge/core/scripts/artifact-graph-status.mjs
node .specforge/core/scripts/artifact-graph-status.mjs 20260518-feat-001-意图识别审批
node .specforge/core/scripts/artifact-graph-status.mjs --work-item 20260518-feat-001-意图识别审批
node .specforge/core/scripts/artifact-graph-status.mjs --json
node .specforge/core/scripts/artifact-graph-status.mjs 20260518-feat-001-意图识别审批 --json
```

不传 work item id 时，工具会使用唯一 active work item。多个 active work item 同时存在时必须显式传 `--work-item <id>` 或位置参数。

## 输出内容

命令会输出：

- workflow schema id 和版本。
- components flags（如 `has_ui=false` 会跳过 UI 设计 artifact）。
- work item 生命周期（active / archive，JSON 模式）。
- work item id 和路径。
- `work.yaml` 中记录的当前 stage。
- `done / total` 进度。
- 当前 ready artifact。
- 建议 route、原因和阻断项；如果 gate 退回、PRD 未完成、technical design 有 `unknown`、tasks 缺 `_Impact:_`，会优先显示这些阻断。
- 每个 artifact 的状态：`done`、`ready`、`blocked` 或 `partial`。
- 每个 artifact 的依赖、缺失依赖，以及相关 gate 状态。

输出示例：

```text
Artifact graph: standard@1
Work item: 20260518-feat-001-意图识别审批
Path: .specforge/work/active/20260518-feat-001-意图识别审批
Stage: 06-close
Progress: 10/10 done
Ready: none
Route: sf-doctor
Reason: 没有 ready artifact，需查看 artifact graph 的阻断依赖。

- intake: done (requires=none)
- requirements: done (requires=intake)
- spec_review: done (requires=requirements, ui_design, technical_design, tasks, gate=spec_review:APPROVED)
```

JSON 模式适合 Agent 或脚本消费，会提供：

- `progress`
- `route` / `route_reason`
- `blockers`
- `readyArtifacts`
- `blockedArtifacts`
- `artifacts[].missingDeps`
- `artifacts[].gateStatus`
- `artifacts[].status`

## 适用场景

- `specforge-work` 自动推进前检查状态。
- `specforge-doctor` 诊断。
- 用户询问“现在到哪一步”或“卡在哪里”。
- 修改 workflow schema 后确认依赖行为。

如果需要下一步行动指令，优先使用：

```bash
node .specforge/core/scripts/instructions.mjs
```

`artifact-graph-status.mjs` 是地图；`instructions.mjs` 是下一步行动卡。
