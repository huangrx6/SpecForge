---
name: sf-implement
description: 根据已批准的 SpecForge tasks 执行实现；用于 implementation ready，且需要按任务边界、技术选型、UI/技术设计、验证计划落地代码并记录实现证据时。
---

# sf-implement

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

按照已批准 tasks 实现代码，并留下实现证据。实现不是“直接开始写代码”，而是把 tasks 的 `_Trace:_`、`_Boundary:_`、`_Verification:_` 落到真实文件、命令和证据上。本技能不批准自己的 code_review gate。

## 启动

运行：

```bash
node .specforge/core/scripts/instructions.mjs apply
```

如果 implementation 不是 ready，按 `instructions.mjs` 的 ready artifact 回到对应的 `sf-*` 子技能。

生成实现产物：

```bash
node .specforge/core/scripts/create-artifact.mjs implementation
```

## 内部技能母本

开始实现前，读取 `.specforge/core/workflows/stages/implementation/SKILL.md`。实现阶段的输入、写入、停止条件和完成标准以内置母本为准。

## 关联标准

- `.specforge/core/standards/workflow.md`：只改批准范围内文件，不加载无关历史。
- `.specforge/core/standards/engineering.md`：实现纪律、API 契约、安全、测试、配置、运行和回滚影响。
- `.specforge/core/profiles/README.md` 以及 `technical-design.md` 选中的技术选择卡：新项目或新模块优先使用官方脚手架 / 框架生成命令，不手写通用骨架。
- `.specforge/core/skills/ORCHESTRATION.md`：Figma 到代码实现、浏览器验证和第三方 skill 的阶段编排。
- `.specforge/core/skills/README.md`：Figma 到代码实现、浏览器验证和第三方 skill 归一化边界。

## 动作

1. 读取 `work.yaml`、`01-spec/tasks.md`、适用的 `requirements.md` / `gap-report.md` / `ui-design.md` / `technical-design.md`。
2. 运行 `git status --short`，识别已有未提交改动；不要覆盖或回滚不属于本次 work item 的用户改动。
3. 从 tasks 建立执行计划：任务 -> 批次 -> 写入边界 -> 预期文件 -> 验证方式。
4. 新项目、新前端、新后端或新模块必须先使用选中的技术选择卡推荐的脚手架 / 生成命令，跑通安装、构建或启动冒烟，再写业务代码。
5. 每次编辑前确认文件在 `_Boundary:_` 或已批准的 UI / technical design 允许范围内；边界不足时停止回到 spec，不自行扩大。
6. UI 实现必须追溯到 `ui-design.md` 的页面地图、状态矩阵、Visual Style Brief 和原型证据；有已批准 Figma Frame 时，先按 `.specforge/core/skills/ORCHESTRATION.md` 判断是否读取 `core/skills/figma` 和 `core/skills/figma-implement-design`：
   - 先获取 design context 和 screenshot，再写代码。
   - 把 Figma MCP 输出翻译成项目组件、token、路由和状态管理约定；不得原样提交生成片段。
   - 视觉还原和偏离记录写入 `03-implementation/report.md`，最终证据交给 `sf-verify`。
7. 技术实现必须追溯到 `technical-design.md` 的技术选择、API、数据、安全、配置、运行、可观测性和验证策略。
8. 每完成一个任务，运行该任务对应的快速验证或写明不能运行的原因；只有代码和验证证据都完成后才勾选 task。
9. 修改代码后同步更新：
   - `03-implementation/plan.md`
   - `03-implementation/report.md`
   - `03-implementation/changed-files.md`
10. 收尾时用 `git diff --name-only` 反查变更文件清单，确保无未登记变更。

## 实现报告必须包含

- 实际变更摘要、实现策略和主要取舍。
- 每个 task 的状态、证据、对应文件、验证结果。
- 变更文件、批准边界来源和风险。
- 与 requirements / gap_report、适用的 ui_design / technical_design、tasks 的对应关系。
- 本阶段已运行的快速验证、启动验证和未运行原因。
- 偏离、补偿、已知缺口、需要 code review 重点看的地方。

## 完成标准

- tasks 中实现项完成或明确剩余项。
- `03-implementation/plan.md`、`report.md`、`changed-files.md` 与真实 diff 一致。
- 关键验证已运行或有明确 N/A / 未运行理由。
- 下一步路由到 `sf-code-review` 做 code review。

## 不做

- 不批准 code_review gate。
- 不扩大到未写入 tasks / `ui-design.md` / `technical-design.md` 的范围。
- 不把通用项目骨架一个文件一个文件手写出来；能用官方脚手架就先用脚手架。
- 不修顺手看到的无关问题；需要时新开 work item。
