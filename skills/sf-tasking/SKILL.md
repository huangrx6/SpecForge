---
name: sf-tasking
description: 生成或更新 SpecForge change 的 tasks；用于 active change 处于 01-spec 阶段且 ready artifact 为 tasks 时。
---

# sf-tasking

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 design 拆成可执行任务图。任务不是待办愿望，而是实现者可以逐项完成、审查者可以逐项核对的工作单元。

## 启动

运行：

```bash
node .specforge/execution/tools/instructions.mjs
```

确认 ready artifact 包含 `tasks`，再：

```bash
node .specforge/execution/tools/create-artifact.mjs tasks
```

## 内部技能母本

写 tasks 前，读取 `.specforge/execution/stages/task-planning/SKILL.md`。任务格式、并行规则、停止条件和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/artifact-graph.md`：判断 ready artifact。
- `.specforge/policy/rules/boundaries/README.md`：任务不能扩大写入范围。
- `.specforge/policy/rules/testing/README.md`：验证任务必须单独列出，不能藏在实现任务里。
- `.specforge/policy/rules/localization.md`：中文优先。

## 拆解要求

- 每个任务必须有 `_Boundary:_`、`_Depends:_`、`_Verification:_`。
- 任务必须能追溯到 requirements / design / 分析证据，不要凭实现冲动新增范围。
- 任务应小到可以一次聚焦完成。
- 先列契约任务（API、schema、类型、配置、迁移），再列实现任务，再列验证任务。
- 数据迁移、权限、安全、发布任务必须单独列出。

## 完成标准

- `tasks.md` 能驱动 implementation。
- 每个任务都有边界、依赖和验证。
- 下一步路由到 `sf-spec-review`。

## 不做

- 不写业务代码。
- 不发明超出 design 边界的新任务。
