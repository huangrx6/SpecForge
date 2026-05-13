---
name: sf-doctor
description: 检查 SpecForge 仓库健康度；用于用户问当前状态、下一步、是否可继续、结构是否健康，或任何自动推进前。
---

# sf-doctor

检查项目状态并给出下一步，不修改产物。

## 启动

运行：

```bash
node .specforge/execution/tools/doctor.mjs
```

必要时补充：

```bash
node .specforge/execution/tools/instructions.mjs
node .specforge/execution/tools/status.mjs
node .specforge/execution/tools/artifact-graph-status.mjs
```

## 内部技能母本

状态汇总和下一步判断前，读取 `.specforge/execution/stages/status/SKILL.md`。状态字段、blocker 解释和路由建议以内置母本为准。

## 关联规则

- `.specforge/policy/rules/context/README.md`：状态判断读取顺序。
- `.specforge/policy/rules/artifact-graph.md`：ready / blocked / done。
- `.specforge/policy/rules/gates/README.md`：gate 状态解释。

## 输出

- 是否接入 SpecForge。
- active change 数量。
- 当前 stage。
- gate 状态。
- ready artifact 或 blocker。
- 下一步建议路由到哪个子技能。

## 完成标准

- doctor 通过时，给出下一步子技能。
- doctor 失败时，列失败项和修复方向。

## 不做

- 不修改产物。
- 不批准 gate。
