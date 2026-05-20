---
name: sf-tasking
description: 生成或更新 SpecForge work item 的 tasks；用于 requirements、gap_report 或 technical_design 已完成后，把已批准前的规格拆成可执行、可验证、可并行的实现任务。
---

# sf-tasking

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 requirements、gap_report、适用的 UI design 和适用的 technical design 拆成可执行任务图。任务不是待办愿望，而是实现者可以逐项完成、reviewer 可以逐项核对、verification 可以逐项取证的工作单元。

## 启动

运行：

```bash
node .specforge/core/scripts/artifact-graph-status.mjs
node .specforge/core/scripts/instructions.mjs
```

确认 ready artifact 包含 `tasks`，再：

```bash
node .specforge/core/scripts/create-artifact.mjs tasks
```

## 内部技能母本

写 tasks 前，读取 `.specforge/core/workflows/stages/task-planning/SKILL.md`。任务格式、输入选择、并行规则、停止条件和完成标准以内置母本为准。

## 关联标准

- `.specforge/core/standards/workflow.md`：ready artifact、scope、任务边界和中文协作。
- `.specforge/core/standards/product.md`：需求追踪、验收标准和非目标。
- `.specforge/core/standards/design.md`：UI 状态、原型证据和体验验证。
- `.specforge/core/standards/engineering.md`：实现纪律、测试验证、配置、回滚、可观测性和代码审查。
- `.specforge/core/profiles/README.md`：技术选型和 profile 偏离需要转成实施任务。

## 先确定输入范围

根据 `work.yaml` 的 workflow 和 components 决定读取哪些产物：

| Workflow / 条件 | 必读输入 |
|---|---|
| `feature` / `standard` | `brief.md`、`requirements.md`、适用的 `ui-design.md`、适用的 `technical-design.md` |
| `lite` | `brief.md`、`requirements.md` |
| `bugfix` / `issue` | `brief.md`、`gap-report.md` |
| `refactor` | `brief.md`、`technical-design.md` |
| `needs_research: true` 或已有 research | `research.md` 中的约束和结论 |
| workflow 不包含 `tasks` | 不执行本技能，回到 `sf-router` |

`components` 为 `auto` 时保守读取对应设计；只有明确 `false` 且上游 artifact 能证明不涉及，才跳过。

## 拆解要求

- 每个任务必须有 `_Trace:_`、`_Impact:_`、`_Files:_`、`_Boundary:_`、`_Depends:_`、`_Verification:_`、`_Rollback:_`，有测试设计时还要有 `_TestCase:_`。
- 任务必须能追溯到 requirements / gap_report / ui_design / technical_design / research，不要凭实现冲动新增范围。
- 读取 `technical-design.md#0. 影响面与读取计划` 后，必须把每个 `yes` 影响面映射到实现任务和验证任务；`no` 写 N/A 理由；关键 `unknown` 不能进入 tasks，必须退回澄清。
- 任务应小到一次实现或一次 review 可以聚焦完成；如果一个任务同时改多个主要模块、多个页面或多个风险面，继续拆。
- `_Files:_` 写预期写入文件、目录或模块类别；如果实现者需要重新猜主要文件，说明任务还不够细。
- `_Rollback:_` 写撤回方式、feature flag、迁移补偿、配置回退或“不适用及理由”；数据、权限、发布和依赖任务不得留空。
- 先列契约任务（API、schema、类型、配置、迁移、权限、提示词 / 评估集），再列实现任务，再列验证任务。
- 新项目或新前端 / 后端子项目必须先列脚手架和启动冒烟任务，不能一个个手写骨架文件。
- UI 任务必须覆盖页面、组件、状态和原型证据；不能只写“实现页面”。
- 有浏览器流程、上传、提交、审批、下载、权限或错误提示时，必须单独列 `05-verification/test-cases.md` 用例编写、Playwright 自动执行和证据登记任务；单元测试任务不能替代。
- 数据迁移、权限、安全、发布、回滚、可观测性任务必须单独列出。
- 每个验收标准至少能映射到一个实现任务和一个验证任务。

## 停止条件

- 上游 artifact 不足以拆任务，比如 API 契约、UI 状态、数据库迁移或权限边界缺失。
- 任务会扩大已确认范围。
- tasks 无法映射到验收标准或验证证据。
- technical_design 中仍有 `[NEEDS TECH DECISION]` 或 `[NEEDS DEPENDENCY DECISION]`，说明关键技术选型或新增依赖尚未确认。
- technical_design 中存在会影响架构、数据、安全、成本、外部契约、发布或可靠性的 `unknown`。
- technical_design 的 `yes` 影响面无法拆出实现任务或验证任务。
- 存在未决产品取舍、设计方向或技术方案选择，应该先回到 `sf-brainstorm`；如果只是规格表达不完整，再回到 `sf-requirements`、`sf-ui-design` 或 `sf-tech-design`。

## 完成标准

- `01-spec/tasks.md` 能驱动 implementation，不需要实现者重新猜范围。
- 每个任务都有追踪来源、影响面、预期文件边界、依赖、验证和回滚提示。
- 每个 technical_design `yes` 影响面都有任务承接；`no` / N/A 有可信理由；无关键 `unknown` 留给 implementation。
- 并行波次不会让多个任务同时写同一核心文件或共享未完成契约。
- 测试、启动验证、回滚 / 观察和安全验证在适用时单独列出。
- `tasks.md` 能直接生成 verification 测试用例矩阵，不需要验证阶段重新猜边界。
- 下一步路由到 `sf-spec-review`，以 `instructions.mjs` 为准。

## 不做

- 不写业务代码。
- 不发明超出 requirements、gap_report、ui_design 或 technical_design 边界的新任务。
- 不把 verification / close 阶段的报告提前写好；只定义后续需要验证和回写的工作。
