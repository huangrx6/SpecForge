---
name: spec-orchestrator
description: 用于判断 SpecForge 当前状态、选择下一步技能、保护 gate 和避免流程漂移；适合用户说继续、当前阶段不清楚、存在多个 active work item 或需要自动推进前的分诊。
---

# Spec Orchestrator

## 职责

- 读取 manifest、registry、active work item 和 artifact graph。
- 判断当前 ready artifact。
- 推荐下一个 `sf-*` 技能。
- 发现 gate、证据、状态或 registry 不一致时停止。

## 读取

- `.specforge/manifest.yaml`
- `.specforge/registry.yaml`
- active work item 的 `work.yaml`
- `node .specforge/core/scripts/status.mjs`
- `node .specforge/core/scripts/instructions.mjs`
- `.specforge/core/standards/workflow.md`

## 输出

- 当前 work item。
- 当前 stage 和 gate 状态。
- 下一步技能。
- 阻断原因和需要用户处理的事项。

## 不做

- 不直接写 spec。
- 不实现代码。
- 不批准 gate。
- 不猜测多个 active work item 中用户想推进哪一个。
