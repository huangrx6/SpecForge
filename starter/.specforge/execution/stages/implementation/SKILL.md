---
name: implementation
description: SpecForge 内部实现技能。用于 spec_review 已批准后，根据 tasks 的边界和依赖执行实现，并记录 implementation report 与 changed files。
---

# Implementation Skill

本技能在 spec review 批准后执行实现。实现必须服从已批准 tasks 和写入边界，不借机做无关重构。

## 前置条件

- `spec_review` gate 为 `APPROVED`。
- `01-spec/tasks.md` 存在且任务边界明确。
- `node .specforge/execution/tools/instructions.mjs -- apply` 显示 apply ready。

## 读取

- `01-spec/requirements.md`
- `01-spec/ui-design.md`（存在时）
- `01-spec/technical-design.md`
- `01-spec/tasks.md`
- `.specforge/policy/rules/engineering/README.md`
- `.specforge/policy/rules/boundaries/README.md`
- `.specforge/policy/rules/security/README.md`
- `.specforge/policy/rules/testing/README.md`

## 写入

- 业务代码。
- `03-implementation/plan.md`
- `03-implementation/report.md`
- `03-implementation/changed-files.md`
- 勾选 `01-spec/tasks.md` 中完成的任务。

## 执行流程

1. **先写 implementation plan**，确认任务顺序和写入范围。
2. **新项目必须先执行脚手架初始化**（参考 `engineering/references/project-scaffolding.md`），验证开发服务器可正常冒烟启动后，才开始写业务代码。
3. **实现 UI 前先读取 `ui-design.md` 中批准的 UI 产物**：
   - 先读取 Visual Style Brief；实现阶段不得临时改风格、主色、密度或组件形态。
   - Figma Frame：优先使用 `figma-implement-design` Skill，按 Frame、Token 和组件约束实现。
   - Pencil 原型：读取导出截图和 `ui-design.md` 中的页面/状态矩阵，以原型为布局和交互参照实现。
   - HTML mockup：以 `01-spec/ui-mockup.html` 为视觉和结构参照实现。
   - ASCII 线稿：仅作为简单页面结构参照；复杂 UI 若只有 ASCII，先回到 `sf-ui-design` 补充可审查原型。
4. **实现技术变更前先读取 `technical-design.md`**，按其中的前后端边界、API、数据、权限、配置、NFR 和验证策略执行。
5. 按任务逐项实现，保持小步可审查。
6. 遇到任务外需求、边界扩大或设计不成立，停止并回到 spec。
7. 同步维护 changed-files 和 implementation report。
8. **每个实现阶段结束后，必须执行启动验证清单**（参考 `engineering/references/startup-validation.md`），并将验证结果写入 implementation report。
9. 能运行的局部验证先运行，不能运行时写明原因。

## 停止条件

- gate 未批准。
- 需要修改未批准范围。
- 发现设计错误或需求矛盾。
- 涉及安全、数据或生产风险但缺少验证计划。

## 完成标准

- 所有已实现任务有对应代码和证据。
- changed-files 反映真实改动。
- implementation report 写清偏差、验证和已知缺口。
