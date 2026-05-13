---
name: task-planning
description: SpecForge 内部任务规划技能。用于 requirements 和 design 批准后生成 01-spec/tasks.md，拆解边界、依赖、验证和并行波次。
---

# Task Planning Skill

本技能把 design 拆成可执行任务图。任务不是待办愿望，而是实现者可以逐项完成、审查者可以逐项核对的工作单元。

## 读取

- `01-spec/requirements.md`
- `01-spec/design.md`
- `.specforge/policy/rules/artifact-graph.md`
- `.specforge/policy/rules/boundaries/README.md`
- `.specforge/policy/rules/testing/README.md`

## 写入

- `01-spec/tasks.md`

## 拆解流程

1. 先列契约任务：API、schema、类型、配置、迁移、接口边界。
2. 有 UI / 产品体验时先列体验基础任务：页面结构、组件状态、主题 token、原型或线稿落实。
3. 再列实现任务：按模块、层次或用户路径拆分。
4. 再列测试和验证任务：单元、集成、E2E、响应式、手工验证或替代证据。
5. 标注依赖关系和并行波次。
6. 为每个任务写清 `_Boundary:_`、`_Depends:_`、`_Verification:_`。

## 任务格式要求

每个任务应包含：

- 具体动作，不写“处理相关逻辑”这类空话。
- 明确允许写入范围。
- 前置依赖或上游契约。
- 可验证结果。
- UI 任务必须指向对应页面、组件和状态；不能只写“美化页面”。
- 风险或 owner，适用于高风险任务。

## 并行规则

- 并行任务不得共享同一主要写入文件。
- 共享契约必须先完成再并行实现。
- 验证任务不能藏在实现任务里。
- 数据迁移、权限、安全、发布任务必须单独列出。

## 停止条件

- design 不足以拆任务。
- 任务会扩大写入范围。
- 存在未解决的契约或数据迁移风险。

## 完成标准

- tasks 能驱动 implementation。
- 每个任务都有边界、依赖和验证。
- reviewer 可以用 tasks 判断实现是否完整。
