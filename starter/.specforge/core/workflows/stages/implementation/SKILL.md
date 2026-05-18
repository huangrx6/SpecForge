---
name: implementation
description: SpecForge 内部实现技能。用于 spec_review 已批准后，根据 tasks 的边界、依赖、验证方式和批准设计执行实现，并记录 implementation plan、report 与 changed files。
---

# 实现技能

本技能在 spec review 批准后执行实现。实现必须服从已批准 tasks 和写入边界，不借机做无关重构。实现阶段的核心产出不是“代码改完”，而是“代码、任务状态、验证证据、真实 diff 四者一致”。

## 前置条件

- `spec_review` gate 为 `APPROVED`。
- `01-spec/tasks.md` 存在且任务边界明确。
- `node .specforge/core/scripts/instructions.mjs -- apply` 显示 apply ready。

## 读取

- `work.yaml`
- `01-spec/requirements.md`（存在时）
- `01-spec/gap-report.md`（bugfix / issue）
- `01-spec/ui-design.md`（存在时）
- `01-spec/technical-design.md`（存在时）
- `01-spec/tasks.md`
- `02-spec-review/spec-review-v1.md`
- `core/profiles/README.md` 以及 `technical-design.md` 选中的技术选择卡
- `.specforge/core/standards/engineering.md`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/skills/README.md`（存在 Figma / 浏览器实现或验证辅助时）

## 写入

- 业务代码。
- `03-implementation/plan.md`
- `03-implementation/report.md`
- `03-implementation/changed-files.md`
- 勾选 `01-spec/tasks.md` 中完成的任务。

## 执行流程

1. **确认前置状态**
   - `spec_review` gate 必须为 `APPROVED`。
   - `node .specforge/core/scripts/instructions.mjs apply` 必须显示 ready。
   - 运行 `git status --short --untracked-files=all`，识别本次工作前已有改动；不要覆盖或回滚无关改动。
2. **先写 implementation plan**
   - 从 tasks 提取批次、依赖、`_Boundary:_`、`_Verification:_`、风险和预计变更文件。
   - 从 `technical-design.md#0. 影响面与读取计划` 提取 `yes` / `no` / `unknown`，形成实现影响面对账计划。
   - 如果任务边界不足以指导写入，停止回到 `sf-tasking` 或 `sf-spec-review`。
   - 如果影响面仍有会改变架构、数据、安全、成本、外部契约、发布或可靠性的 `unknown`，停止回到 `sf-tech-design` 或 `sf-spec-review`。
3. **新项目必须先执行脚手架初始化**
   - 根据 `technical-design.md` 的 Tech Profile Selection 和项目 wiki 选择脚手架命令。
   - 前端、后端、测试框架、ORM、迁移工具等通用骨架优先用官方 CLI / 模板生成。
   - 验证安装、构建或 dev server / service 冒烟启动后，才开始写业务代码。
   - 如果项目已有架构，沿用现有结构，不重新初始化。
4. **实现 UI 前先读取 `ui-design.md` 中批准的 UI 产物**：
   - 先读取 Visual Style Brief；实现阶段不得临时改风格、主色、密度或组件形态。
   - Figma Frame：读取 `core/skills/figma` 和 `core/skills/figma-implement-design`，先取 design context + screenshot，再按 Frame、Token 和组件约束实现；不要把 Figma MCP 生成片段原样提交。
   - Pencil 原型：读取导出截图和 `ui-design.md` 中的页面/状态矩阵，以原型为布局和交互参照实现。
   - HTML mockup：以 `01-spec/ui-mockup.html` 为视觉和结构参照实现。
   - ASCII 线稿：仅作为简单页面结构参照；复杂 UI 若只有 ASCII，先回到 `sf-ui-design` 补充可审查原型。
5. **实现技术变更前先读取 `technical-design.md`**，按其中的前后端边界、API、数据、权限、配置、NFR 和验证策略执行。
   - `yes` 影响面：必须落到代码 / 配置 / 文档变更、关联任务和快速验证。
   - `no` 影响面：不得出现未经批准的真实 diff；发现必须修改时停止退回 spec。
   - `unknown` 影响面：不得以实现代替澄清。
6. **按任务逐项实现，保持小步可审查**
   - 优先从 W0 的契约、脚手架、失败优先验证开始。
   - 每个 task 只改 `_Boundary:_` 允许的文件；确需越界时停止并回到 spec。
   - 任务完成必须同时满足：代码完成、验证或证据完成、变更文件清单更新、task 勾选。
7. **持续维护实现证据**
   - `03-implementation/report.md` 记录 task 状态、验证、偏离、风险和 code review 提示。
   - `03-implementation/report.md` 必须记录 technical_design 影响面实现对账：`yes` 的落地与验证、`no` 的未越界确认、`unknown` 的退回处理。
   - `03-implementation/changed-files.md` 记录每个真实变更文件、任务、批准边界来源、风险和验证。
   - 收尾时用 `git status --short --untracked-files=all`、`git diff --name-only`、`git diff --stat` 反查，发现未登记变更、未追踪文件或登记但无 diff 的项必须补齐或说明。
8. **执行启动验证清单**
   - 每个实现阶段结束后，必须执行适用的安装、构建、typecheck、lint、测试、dev server / service 启动、迁移、配置、健康检查或 smoke test。
   - 不能运行时写明环境缺口、风险、替代验证和 owner。

## 停止条件

- gate 未批准。
- 需要修改未批准范围。
- tasks 的 `_Boundary:_` 或 `_Verification:_` 不足以指导实现。
- 发现设计错误、需求矛盾或 UI 原型 / technical design 缺失。
- technical_design 影响面仍有关键 `unknown`，或实现需要修改被批准为 `no` 的影响面。
- 涉及安全、权限、数据迁移、AI 调用、外部集成、生产配置或发布风险但缺少验证计划。
- 既不能运行关键验证，也没有可接受的替代证据。

## 完成标准

- 所有已实现任务有对应代码和证据。
- tasks 勾选状态、实现报告、变更文件清单、technical_design 影响面对账和真实 git 状态一致。
- 启动 / 构建 / 局部验证结果已记录。
- implementation report 写清偏差、验证、已知缺口和 code review 重点。
