# Workflow Core

`core/workflows/` 定义 SpecForge 的流程骨架。

## 目录

| 目录 | 职责 |
|---|---|
| `definitions/` | workflow DAG、required gates、quality policy 和 traceability policy |
| `stages/` | 每个阶段的内部 skill 母本，定义输入、动作、停止条件和完成标准 |

## 边界

- workflow definition 是机器可读流程图，不写长篇方法论。
- stage skill 是阶段执行手册，不复制所有 standards 内容，只引用需要的标准。
- 入口 `skills/sf-*` 负责路由和用户交互，不复制 stage skill 的完整正文。

## 新增或修改流程

1. 修改 `definitions/<workflow>.yaml`。
2. 确认对应 artifact schema / template 存在。
3. 更新或新增 `stages/<stage>/SKILL.md`。
4. 更新 `core/scripts/lib/stage-contracts.mjs` 的阶段契约。
5. 运行 `npm run validate && npm run selftest && npm run check:starter`。
