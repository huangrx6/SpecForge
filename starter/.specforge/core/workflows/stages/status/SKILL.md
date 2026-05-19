---
name: status
description: SpecForge 内部状态技能。用于汇总 active work items、stage、gate、artifact graph、blockers 和建议下一步。
---

# 状态技能

本技能汇总当前 SpecForge 状态，并给出下一步动作。它只读状态，不修复、不批准 gate、不推进实现。状态判断必须来自工具输出和 work item 文件，不来自聊天记忆。

## 读取

- `.specforge/manifest.yaml`
- `.specforge/registry.yaml`
- `.specforge/work/active/*/work.yaml`
- `.specforge/core/artifacts/schemas/<workflow>.json`
- gate evidence files
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/product.md`（PRD 分流时）
- `.specforge/core/standards/wiki.md`（wiki_sync / closure 时）
- `.specforge/core/scripts/codebase-index.mjs` 输出（无 active work 且已有代码、wiki 为空时）

## 推荐命令

```bash
node .specforge/core/scripts/status.mjs
node .specforge/core/scripts/artifact-graph-status.mjs
node .specforge/core/scripts/instructions.mjs
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/codebase-index.mjs --json
```

机器消费或二次分析时使用 JSON：

```bash
node .specforge/core/scripts/status.mjs --json
node .specforge/core/scripts/artifact-graph-status.mjs --json
node .specforge/core/scripts/instructions.mjs --json
```

## 输出内容

- active work item 数量和路径。
- 当前 stage、workflow、status。
- gate 状态和证据路径。
- artifact graph：done、ready、blocked、partial。
- 当前 blocker 和 owner。
- 建议路由到哪个根级 `sf-*` 技能。
- 如果是 requirements ready，说明是否需要先走 `sf-prd`。
- 如果任一 gate 为 `REQUEST_CHANGES` / `REJECTED`，说明应回到哪个 artifact / `sf-*` 技能。
- 如果是 closure ready，说明 release / rollback / archive 前置。

## 判断规则

- 多个 active work item 时，不猜测用户要继续哪一个。
- 没有 active work item、仓库已有代码且 wiki 基线为空时，推荐 `sf-steering`，先建立存量项目画像。
- gate 缺证据时，状态视为 blocked。
- gate 为 `REQUEST_CHANGES` / `REJECTED` 时，不推荐下游 artifact；先推荐修复路径。
- `status.mjs`、`artifact-graph-status.mjs`、`instructions.mjs` 的 route / blocker 来自同一诊断逻辑；如果脚本输出与聊天记忆冲突，以脚本输出为准。
- archived work item 只在用户要求历史时读取。
- 下一步必须是可执行动作。
- 用户只说“继续”时推荐当前 ready artifact 对应的单个 `sf-*` 技能。
- 用户明确说“自动推进 / 继续做完 / 不要停”时推荐 `sf-work`。
- 没有 ready artifact 时，输出 artifact graph 和阻断原因，不猜。
- implementation ready 但 tasks 缺 `_Impact:_`、technical_design 有关键 `unknown`、或前序 evidence 不完整时，推荐回到对应设计 / tasking 阶段。
- closure ready 时，release / rollback 必须对齐 verification 残余风险和 wiki_sync 证据；否则推荐 `sf-close` 修补收口材料。

## 完成标准

- 状态摘要和工具输出一致。
- 没有隐藏 active work。
- blocked 原因清楚。
- 建议下一步可直接执行。

## 输出格式

```text
SpecForge: connected / missing / broken
Active: <id or none>
Workflow: <workflow>
Stage: <stage>
Gates: spec_review=<status>, code_review=<status>, verification=<status>, wiki_sync=<status>
Ready artifact: <artifact or none>
Route: <sf-*>
Reason: <one sentence>
Blockers: <none or list>
```
