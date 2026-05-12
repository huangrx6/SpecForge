# artifact-graph-status.mjs

`artifact-graph-status.mjs` 根据 `.specforge/schemas/standard.json` 展示某个 change 的 artifact graph 状态。它不是简单“打印阶段”，而是回答哪些 artifact 已完成、哪些可继续、哪些被依赖或 gate 阻塞。

## 用法

```bash
node .specforge/tools/artifact-graph-status.mjs
node .specforge/tools/artifact-graph-status.mjs CHG-20260512-008-codex-skill-sync-and-validation
node .specforge/tools/artifact-graph-status.mjs --json
node .specforge/tools/artifact-graph-status.mjs CHG-20260512-008-codex-skill-sync-and-validation --json
```

不传 change id 时，工具会优先使用唯一 active change。如果没有 active change，则回退到最新 archived change，方便在安静仓库里检查 graph。

## 输出内容

命令会输出：

- workflow schema id 和版本。
- change id 和路径。
- `change.yaml` 中记录的当前 stage。
- `done / total` 进度。
- 当前 ready artifact。
- 每个 artifact 的状态：`done`、`ready`、`blocked` 或 `partial`。
- 每个 artifact 的依赖、缺失依赖，以及相关 gate 状态。

输出示例：

```text
Artifact graph: standard@1
Change: CHG-20260512-008-codex-skill-sync-and-validation
Path: .specforge/changes/archive/CHG-20260512-008-codex-skill-sync-and-validation
Stage: 06-closure
Progress: 10/10 done
Ready: none

- intake: done (requires=none)
- requirements: done (requires=intake)
- spec_review: done (requires=requirements, design, tasks, gate=spec_review:APPROVED)
```

JSON 模式适合 Agent 或脚本消费，会提供：

- `progress`
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
node .specforge/tools/instructions.mjs
```

`artifact-graph-status.mjs` 是地图；`instructions.mjs` 是下一步行动卡。
