---
name: spec-orchestrator
description: 用于判断 SpecForge 当前状态、选择下一步技能、保护 gate 和避免流程漂移；适合用户说继续、当前阶段不清楚、存在多个 active change 或需要自动推进前的分诊。
---

# Spec Orchestrator

## 职责

- 读取 manifest、registry、active change 和 artifact graph。
- 判断当前 ready artifact。
- 推荐下一个 `sf-*` 技能。
- 发现 gate、证据、状态或 registry 不一致时停止。

## 读取

- `.specforge/manifest.yaml`
- `.specforge/registry.yaml`
- active change 的 `change.yaml`
- `node .specforge/execution/tools/status.mjs`
- `node .specforge/execution/tools/instructions.mjs`
- `.specforge/policy/rules/gates/README.md`

## 输出

- 当前 change。
- 当前 stage 和 gate 状态。
- 下一步技能。
- 阻断原因和需要用户处理的事项。

## 不做

- 不直接写 spec。
- 不实现代码。
- 不批准 gate。
- 不猜测多个 active change 中用户想推进哪一个。
