---
name: sf-requirements
description: 生成或更新 SpecForge work item 的 requirements；用于 active work item ready artifact 为 requirements，或需要把 PRD / brief 转成可测试行为、边界、用户故事、验收标准和影响面 flags 时。
---

# sf-requirements

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 brief（和可选 PRD）升级为可测试、可审查、可路由到后续设计阶段的需求规格。它不写 UI 方案、接口方案、数据库方案或实现任务。

如果存在 `00-intake/brainstorm.md`，先读取其中的用户确认、明确延后和未决问题；如果存在 `00-intake/prd.md`，把它当作产品意图输入：保留产品目标、用户价值、MVP 决策和指标线索，但必须进一步落成系统可观察行为、输入输出边界、错误处理、空状态、权限差异和验收标准。不要把 PRD 原样复制成 requirements。

如果 `00-intake/brief.md#PRD 决策` 标记需要 PRD，但 `00-intake/prd.md` 不存在或 `Decision Status` 不是 `approved-for-requirements`，先回到 `sf-prd`。不要在 PRD 未完成时直接写 requirements。

## 启动

运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

确认 ready artifact 包含 `requirements`，再：

```bash
node .specforge/core/scripts/create-artifact.mjs requirements
```

## 内部技能母本

写 requirements 前，读取 `.specforge/core/workflows/stages/requirements/SKILL.md`。需求质量标准、停止条件和完成标准以内置母本为准。

## 和 sf-prd 的边界

`sf-prd` 解决“为什么做、给谁做、先做哪些、成功怎么衡量”。`sf-requirements` 解决“系统必须表现出哪些可验证行为、哪些不做、如何验收、后续需要哪些设计产物”。

| 维度 | sf-prd | sf-requirements |
|---|---|---|
| 目标 | 产品意图、用户价值、MVP 决策 | 可测试行为、边界、验收标准 |
| 粒度 | 用户故事、候选功能、路线图、验收种子 | SHALL 需求、异常路径、边界值、NFR、验收矩阵 |
| 决策 | 产品范围和优先级 | 行为契约和影响面 flags |
| 不做 | 技术设计和任务拆解 | 产品脑暴、UI / API / DB 方案 |

如果 PRD 或 brainstorm 没有回答目标用户、MVP 边界或成功标准，先把问题写成 `[NEEDS CLARIFICATION]` 并路由到 `sf-brainstorm` 或 `sf-prd`，不要在 requirements 中补造产品决策。

## PRD 转译规则

写 requirements 时必须显式完成一次 PRD 转译，不允许复制粘贴：

1. 把每个已确认 MVP 能力映射到至少一个 `REQ-*`。
2. 把每个 PRD user story 改写为系统可观察行为：触发、条件、系统响应、用户可见结果。
3. 把 PRD 的 `Acceptance Seed` 拆成最终 AC：正常路径、失败路径、空状态、边界值、权限差异和重新验证触发条件。
4. 把 PRD 的产品指标转成验收线索或 NFR；无法验证的指标保留为产品指标，不伪装成工程 AC。
5. 把 PRD 的 UI / 技术 notes 只转成影响面 flags 和后续设计触发，不在 requirements 中展开方案。

requirements 不合格的信号：只剩用户故事、没有 SHALL 行为、没有失败/边界/权限、没有 AC、或者出现 API / DB / 文件路径实现方案。

## 第三方 Skill 联动

先读取 `.specforge/core/skills/ORCHESTRATION.md`，再读取 `.specforge/core/skills/README.md` 和 `.specforge/core/skills/registry.json`，只按需选择第三方 skill。第三方 skill 是参考输入，不是 SpecForge 产物格式。

| Skill | 什么时候读 | 归一化到 |
|---|---|---|
| `user-story-writing` | 需要用户故事、Given/When/Then、INVEST 检查、故事拆分或验收标准样例时 | `requirements.md#目标用户与场景`、`#功能需求`、`#验收标准` |
| `to-prd` | 只在 PRD handoff 不清晰时回看产品意图 | 作为输入摘要，不直接写入 requirements |

使用规则：

- 不要默认加载所有第三方 skill；每次最多选 1-2 个。
- 不保留第三方 skill 的输出路径、模板标题、Sprint、Assignee、故事点或 GitHub issue 行为。
- `user-story-writing` 的 Definition of Done 只作为验收启发，不直接变成 SpecForge 承诺。
- 如果第三方建议和用户确认、brief、PRD 冲突，以 SpecForge work item 中的已确认事实为准，并把冲突列入待澄清项。

## 关联标准

- `.specforge/core/standards/product.md`：PRD 输入、候选功能、用户故事、验收标准和可测试需求。
- `.specforge/core/standards/workflow.md`：范围、非目标、写入边界和中文协作。

## 自适应需求访谈

不要用固定问卷机械追问。先做一次“证据盘点”，再决定问什么：

1. 已确认事实：来自 original request、brief、PRD、research、wiki 和用户澄清。
2. 高影响未知：会改变 MVP、权限、数据边界、AI 质量、上线风险或验收口径的问题。
3. 可防守默认：不影响第一版方向、可在后续设计阶段细化的默认假设。

按触发信号选择访谈镜头，一轮最多问 5 个问题：

| 镜头 | 触发信号 | 输出到 requirements |
|---|---|---|
| Role / Permission | 多角色、管理员、审批、可见性 | 角色矩阵、权限边界、验收标准 |
| Workflow / State | 审批、上线、异步任务、状态流转 | 状态机需求、异常路径、重新验证触发 |
| Data / File | 上传、导入导出、分隔符、结果地址 | 输入输出契约、边界值、失败处理 |
| AI Quality | 意图识别、提示词、置信度、人工复核 | 质量阈值、抽检、失败兜底、隐私约束 |
| UI Impact | 页面、表单、操作效率、视觉风格 | `has_ui` 判断、页面范围和 UI 验收线索 |
| Runtime / Ops | 并发、调度、执行时间、重试、告警 | NFR、运维约束、技术设计触发条件 |

问题优先给 2-4 个可选方向、影响说明和推荐项；开放问题只用于没有合理选项的场景。

## 写作流程

- 写用户可观察行为，不写实现细节。
- 从 brief 的分析证据包追溯需求来源；复杂需求不能丢失代码探索、外部研究和用户澄清结论。
- 产品类需求必须记录功能候选、MVP 选择、明确延后项和用户确认。
- 必须包含范围、非目标、依赖和验收标准。
- 每条功能需求至少覆盖正常路径；有失败、空状态、边界值、权限差异时必须显式写出。
- 每条 `MUST` 需求必须至少有一个 `AC-*`，并在 PRD / Brief 追溯表中标明来源。
- 将 PRD 用户故事转成需求时，保留“角色 / 目标 / 价值”作为来源说明，但需求正文使用系统行为语言。
- 适合时使用 EARS：
  - `WHEN <event>, THE SYSTEM SHALL <response>.`
  - `IF <condition>, THE SYSTEM SHALL <response>.`

## 影响面回写

requirements 完成前，检查 `work.yaml` / `brief.md` 的 components 是否和需求一致：

- `has_ui`：有页面、表单、交互、可视化、配置台、审批台或用户可见状态。
- `has_api`：有 HTTP API、RPC、SDK、事件、webhook、外部契约或前后端通信。
- `has_db`：有持久化模型、迁移、索引、导入导出、审计记录或结果存储。
- `has_domain`：有核心业务规则、权限、审批、状态机、任务生命周期或 AI 质量策略。
- `needs_research`：需求进入 requirements 后通常不再新增；若发现必须补研究，标记 blocker 并回到 discovery / research。

如果 flags 错了，先更新 work item 的 `work.yaml`，再运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

这样后续 `sf-ui-design` / `sf-tech-design` 才会正确出现或跳过。

## 完成标准

- `requirements.md` 可以独立支撑后续影响面判断。
- PRD 中每个已确认 MVP 能力都能追溯到 requirements 中的需求或非目标。
- PRD 的每个验收种子都已转成最终 AC、NFR、非目标或待澄清项。
- 每个 user-visible / operator-visible 行为都有验收标准。
- 影响面 flags 已校准，后续 ready artifact 路由可信。
- 涉及用户可见页面、交互、视觉或原型时，下一步路由到 `sf-ui-design`。
- 涉及前端工程、后端、API、数据、权限、配置、任务或 NFR 时，下一步路由到 `sf-tech-design`。
- 同时涉及 UI 和技术实现时，先 `sf-ui-design`，再 `sf-tech-design`，由 `instructions.mjs` 的 ready artifact 决定实际顺序。
- 所有未决问题都显式标记 `[NEEDS CLARIFICATION]`。

## 不做

- 不写设计方案。
- 不把未澄清需求包装成已批准规格。
- 不把 `brainstorm.md` 里的 Agent recommendation 当成用户已确认需求。
- 不把 PRD、第三方 skill 模板或用户故事原样复制成 requirements。
- 不把产品指标、路线图或方案备注伪装成已批准系统行为。
- 不用故事点、排期或 Sprint 信息替代验收标准。
