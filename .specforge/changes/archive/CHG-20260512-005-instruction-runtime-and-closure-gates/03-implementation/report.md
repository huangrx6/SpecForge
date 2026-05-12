# 实现报告

## 摘要

已完成运行时闭环第一版实现：

- `standard` workflow 新增 `closure` artifact，归档前必须具备 release/rollback 证据。
- 新增共享库 `.specforge/tools/lib/specforge.mjs`，提供 change 解析、schema 加载、artifact 状态计算、gate 读写、模板映射和任务解析。
- 新增 `instructions` 命令，支持默认下一步、指定 artifact、apply 模式和 JSON 输出。
- 新增 `gate` 命令，批准 gate 时必须提供已存在 evidence。
- 新增 `archive` 命令，归档前检查 archive 依赖和全量 artifact 状态，并同步 registry。
- 增强 validate，检查 schema 模板映射、依赖环、生命周期状态和 registry 路径归属。

## 变更内容

- SpecForge 现在可以根据 artifact 图告诉 Agent 下一步要做什么。
- Gate 状态可以由命令更新，减少手改 `change.yaml` 的不一致风险。
- Active change 可以由命令归档，且归档前必须完成 closure。
- `instructions -- apply` 可以读取任务清单并输出实现进度。

## 审查提示

- 重点审查 `archive-change.mjs` 的 registry 更新逻辑是否会误删其他 entry。
- 重点审查 `gate.mjs` 是否在 APPROVED 时强制要求 evidence 存在。
- 重点审查 `validate-structure.mjs` 新增校验是否会误伤历史归档。
