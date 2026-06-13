# Requirements Authoring Guide

本文件保存 PRD 转译、第三方 skill 归一化、自适应需求访谈、写作细则和影响面 flags。`SKILL.md` 只保留入口执行顺序、门禁和产物边界。

## PRD / Requirements 边界

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

requirements 不合格的信号：只剩用户故事、没有 SHALL 行为、没有失败/边界/权限、没有 AC，或者出现 API / DB / 文件路径实现方案。

## 第三方 Skill 归一化

先读取 `.specforge/core/skills/ORCHESTRATION.md`、`README.md` 和 `registry.json`，只按需选择第三方 skill。第三方 skill 是参考输入，不是 SpecForge 产物格式。

| Skill | 什么时候读 | 归一化到 |
|---|---|---|
| `user-stories` | 需要用户故事、3C、Given/When/Then、INVEST 检查或验收标准样例时 | `requirements.md#目标用户与场景`、`#功能需求`、`#验收标准` |
| `create-prd` | 只在 PRD handoff 不清晰时回看产品意图、目标、非目标和 release 分期 | 作为输入摘要，不直接写入 requirements |

规则：

- 不要默认加载所有第三方 skill；每次最多选 1-2 个。
- 不保留第三方 skill 的输出路径、模板标题、Sprint、Assignee、故事点或 GitHub issue 行为。
- `user-stories` 的 acceptance criteria 只作为验收启发，不直接变成 SpecForge 承诺。
- 如果第三方建议和用户确认、brief、PRD 冲突，以 SpecForge work item 中的已确认事实为准，并把冲突列入待澄清项。

## 自适应需求访谈

不要用固定问卷机械追问。先做一次证据盘点，再决定问什么：

1. 已确认事实：来自 original request、brief、PRD、research、wiki 和用户澄清。
2. 高影响未知：会改变 MVP、权限、数据边界、AI 质量、上线风险或验收口径的问题。
3. 可防守默认：不影响第一版方向、可在后续设计阶段细化的默认假设。

按触发信号选择访谈镜头。问题数量不设硬上限；有多少会改变需求行为或验收口径的高影响未知，就问多少，但要分轮收敛。每轮只问当前最影响 requirements 的问题或一小组强相关问题，优先单问。

| 镜头 | 触发信号 | 输出到 requirements |
|---|---|---|
| Role / Permission | 多角色、管理员、审批、可见性 | 角色矩阵、权限边界、验收标准 |
| Workflow / State | 审批、上线、异步任务、状态流转 | 状态机需求、异常路径、重新验证触发 |
| Data / File | 上传、导入导出、分隔符、结果地址 | 输入输出契约、边界值、失败处理 |
| AI Quality | 意图识别、提示词、置信度、人工复核 | 质量阈值、抽检、失败兜底、隐私约束 |
| UI Impact | 页面、表单、操作效率、视觉风格 | `has_ui` 判断、页面范围和 UI 验收线索 |
| Runtime / Ops | 并发、调度、执行时间、重试、告警 | NFR、运维约束、技术设计触发条件 |

问题优先给 2-4 个可选方向、影响说明和推荐项；开放问题只用于没有合理选项的场景。

## 写作细则

- 写用户可观察行为，不写实现细节。
- 从 brief 的分析证据包追溯需求来源；复杂需求不能丢失代码探索、外部研究和用户澄清结论。
- 产品类需求必须记录功能候选、MVP 选择、明确延后项和用户确认。
- 必须包含范围、非目标、依赖和验收标准。
- 如果需求可能需要新增 / 替换直接依赖、SDK、插件、组件库、ORM、驱动、测试库、浏览器自动化库或外部 provider，必须在 requirements 的依赖小节写 `[DEPENDENCY DECISION REQUIRED]` 或 `[NEEDS DEPENDENCY DECISION]`，并说明需要用户确认；不要在 requirements 中替用户选择具体依赖。
- 如果需求会迫使技术设计选择包管理器、UI 组件库、样式方案、Python 依赖管理 / 虚拟环境、构建工具、测试 runner、任务运行器或 monorepo 工具，必须写 `[TOOLING DECISION REQUIRED]` 或 `[NEEDS TOOLING DECISION]`，并说明需要用户确认；不要在 requirements 中替用户选择 npm / pnpm / yarn、uv / Poetry / pip / Conda 等偏好。
- 每条功能需求至少覆盖正常路径；有失败、空状态、边界值、权限差异时必须显式写出。
- 每条 `MUST` 需求必须至少有一个 `AC-*`，并在 PRD / Brief 追溯表中标明来源。
- 将 PRD 用户故事转成需求时，保留“角色 / 目标 / 价值”作为来源说明，但需求正文使用系统行为语言。
- 适合时使用 EARS：
  - `WHEN <event>, THE SYSTEM SHALL <response>.`
  - `IF <condition>, THE SYSTEM SHALL <response>.`

## 影响面回写

requirements 完成前，检查 `work.yaml` / `brief.md` 的 components 是否和需求一致：

| Flag | 何时为 true / auto |
|---|---|
| `has_ui` | 有页面、表单、交互、可视化、配置台、审批台或用户可见状态 |
| `has_api` | 有 HTTP API、RPC、SDK、事件、webhook、外部契约或前后端通信 |
| `has_db` | 有持久化模型、迁移、索引、导入导出、审计记录或结果存储 |
| `has_domain` | 有核心业务规则、权限、审批、状态机、任务生命周期或 AI 质量策略 |
| `needs_research` | requirements 后通常不再新增；若发现必须补研究，标记 blocker 并回到 discovery / research |

如果 flags 错了，先更新 work item 的 `work.yaml`，再运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

这样后续 `sf-ui-design` / `sf-tech-design` 才会正确出现或跳过。

## 质量标准

- 每条需求能被测试、审查或人工验收。
- PRD 的 MVP 能力和验收种子已经转成 REQ / AC / NFR / 非目标 / 待澄清项之一。
- 非目标和边界足以防止实现阶段扩大范围。
- 验收标准描述输入、动作、期望结果。
- 风险需求明确触发后续 design、security、testing 或 delivery 规则。
- requirements 能解释为什么需要或不需要 `ui_design` / `technical_design`。
