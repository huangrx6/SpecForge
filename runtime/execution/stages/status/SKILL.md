---
name: status
description: SpecForge 内部状态技能。用于汇总 active changes、stage、gate、artifact graph、blockers 和建议下一步。
---

# Status Skill

本技能汇总当前 SpecForge 状态，并给出下一步动作。它只读状态，不修复、不批准 gate、不推进实现。

## 读取

- `.specforge/manifest.yaml`
- `.specforge/registry.yaml`
- `.specforge/workspace/changes/active/*/change.yaml`
- `.specforge/artifacts/schemas/<workflow>.json`
- gate evidence files
- `.specforge/policy/rules/context/README.md`
- `.specforge/policy/rules/gates/README.md`

## 推荐命令

```bash
node .specforge/execution/tools/status.mjs
node .specforge/execution/tools/artifact-graph-status.mjs
node .specforge/execution/tools/instructions.mjs
node .specforge/execution/tools/doctor.mjs
```

## 输出内容

- active change 数量和路径。
- 当前 stage、workflow、status。
- gate 状态和证据路径。
- artifact graph：done、ready、blocked、partial。
- 当前 blocker 和 owner。
- 建议路由到哪个根级 `specforge-*` 技能。

## 判断规则

- 多个 active change 时，不猜测用户要继续哪一个。
- gate 缺证据时，状态视为 blocked。
- archived change 只在用户要求历史时读取。
- 下一步必须是可执行动作。

## 完成标准

- 状态摘要和工具输出一致。
- 没有隐藏 active work。
- blocked 原因清楚。
- 建议下一步可直接执行。
