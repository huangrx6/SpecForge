# Product Discovery Playbook

本文件是产品发现能力包的执行总纲。它合并原 `foundations/` 和 `transforms/` 的职责：阶段边界、确认状态、机会语言、outcome / evidence 规则，以及 request / feedback / brainstorm 到 product discovery、product discovery 到 PRD 的转译规则。

## Product Discovery Boundary

Product discovery 负责把模糊产品想法、用户反馈、业务问题、候选功能和数据事实整理成机会、候选方案、MVP 推荐、实验和下游 handoff。

Product discovery 可以决定：

- 用户问题空间。
- 机会分类。
- 候选功能池。
- 功能优先级建议。
- 实验设计。
- MVP 推荐。
- 需要 PRD / brainstorm / research 的下游路径。

Product discovery 不可以决定：

- 最终 MVP 批准。
- requirements MUST / SHALL。
- UI 方案。
- 技术方案。
- 上线排期。
- 预算承诺。

Product discovery 可以推荐，不可以批准。任何 `mvp-recommended` 进入 PRD 前，都必须成为 `user-confirmed-mvp` 或 `delegated-default`。

## Confirmation Status

| 状态 | 含义 | 可进入 PRD |
|---|---|---|
| `opportunity-confirmed` | 用户或研究确认的问题机会 | yes |
| `solution-candidate` | 候选解决方案 | candidate only |
| `mvp-recommended` | Agent 推荐的 MVP | needs user confirmation |
| `user-confirmed-mvp` | 用户确认 MVP | yes |
| `delegated-default` | 用户授权按默认推荐推进 | yes, with risk note |
| `pending` | 尚未确认 | candidate only |
| `needs-research` | 需要补研究 | no |
| `experiment-needed` | 需要实验验证 | maybe, as risk |

规则：

- `mvp-recommended` 不是用户批准。
- `delegated-default` 必须写风险、回退点和复核触发条件。
- `pending`、`needs-research` 不能进入 PRD 的已确认 MVP。
- 高风险推荐必须有证据或明确实验。

## Opportunity Language

Opportunity 不是功能。

坏写法：

- 增加客户经理画像页面。
- 支持导出报表。
- 接入 DeepSeek。

好写法：

- 客户经理无法快速判断哪些客户最需要优先跟进。
- 运营人员无法确认报表口径是否可信。
- 用户在 AI 回答错误时缺少人工复核和纠错入口。

转换示例：

```md
Feature request: 支持导出报表
Opportunity: 运营人员需要离线分发和复核经营数据，但当前无法获得可信的可追溯报表。
Candidate feature: 报表导出。
```

规则：

- Opportunity 必须从用户痛点或业务结果出发。
- Solution 才能写功能。
- Feature 必须回连 Opportunity。
- 如果用户只给功能，要反推它想解决的问题。
- 如果反推不出来，提问。

## Outcome And Evidence

Product discovery 必须先定义 outcome，否则 feature pool 会变成愿望清单。

Outcome 类型：

- 用户价值指标。
- 业务 KPI。
- 运营效率指标。
- 质量指标。
- 风险降低指标。
- AI 质量指标。

Outcome 格式：

```md
| Outcome | Metric | Baseline | Target | Evidence |
|---|---|---|---|---|
```

Evidence level：

| Level | 含义 | 可用于 |
|---|---|---|
| `confirmed` | 用户确认、研究结论、日志数据、wiki 事实或已批准 artifact 支撑 | opportunity / PRD input |
| `likely` | 有合理推断或弱证据，但未确认 | candidate / assumption |
| `unclear` | 缺证据或冲突 | open question / research-needed |

规则：

- 没有 baseline 可以写 unknown，不能伪造。
- 没有 target 可以写 direction，例如 reduce / increase / maintain。
- 不伪造用户研究数据、RICE 分数、baseline 或 market fact。
- 高风险 MVP recommendation 需要 `confirmed` 或用户授权默认。
- `unclear` 不能直接进入 PRD MVP。
- PRD 阶段必须把 outcome 变成 success criteria。
- Requirements 阶段再把 success criteria 变成可测试行为或 NFR。

## Source Transforms

### Request To Opportunity Map

输入：

- 用户原始请求。
- brief。
- brainstorm。
- research。
- wiki。
- 产品反馈。
- 业务指标。

输出：

```md
| Source | User / Role | Pain / Need | Opportunity | Evidence | Confidence |
|---|---|---|---|---|---|
```

规则：

- 如果 source 是功能请求，先反推 pain / need。
- 如果没有 evidence，confidence = unclear。
- 如果机会影响 MVP，需要用户确认。
- 机会不能直接变成需求，必须经过 solution / scope decision。

### Feedback To Feature Pool

```md
| Feedback / Request | Underlying opportunity | Candidate feature | Value | Complexity | Risk | Decision |
|---|---|---|---|---|---|---|
```

Decision：

- `mvp-candidate`
- `optional`
- `later`
- `reject`
- `needs-research`
- `needs-user-decision`

规则：

- 客户说的功能不是自动进入 MVP。
- 同类请求要聚类成 opportunity。
- 高风险功能必须写 risk 和 validation。
- Agent recommendation 不能等于 user-confirmed。

### Brainstorm To Product Discovery

| Brainstorm 内容 | Product discovery 位置 |
|---|---|
| 问题重构 | Desired outcome / Opportunity map |
| 当前事实与研究证据 | Evidence map |
| 发散方向池 | Solution candidates |
| 类比迁移 | Candidate feature pool / experiment ideas |
| 场景模拟 | Risks / validation |
| 方案评估矩阵 | Prioritization matrix |
| 用户确认记录 | Confirmation status |
| 明确延后 / 不做 | later / reject / out-of-scope candidates |

规则：

- Brainstorm recommendation 不是 user-confirmed MVP。
- 场景失败路径要进入 risk 或 experiment。
- 未查证事实标记 `unclear`。

### Product Discovery To PRD

| 产品发现内容 | 产品需求文档位置 |
|---|---|
| 目标结果 | 产品决策摘要 / 指标 |
| 机会 | 问题 / 背景 / 候选功能池 |
| 方案候选 | 候选功能池 |
| 最小可行版本建议 | 范围与最小可行版本决策，等待确认 |
| 实验 | 风险 / 路线图 / 验证 |
| 证据缺口 | 开放问题 / 需要研究 |

规则：

- `mvp-recommended` 进入产品需求文档时必须标为候选，不能直接写入 PRD 的 MVP。
- 只有 `confirmation_status=user-confirmed-mvp` 或 `confirmation_status=delegated-default` 的方案，才能进入 PRD 的最小可行版本。
- `delegated-default` 必须在 PRD Decision JSON 的对应 MVP 项里写 `confirmation_type=delegated-default`、风险和回退点。
- 产品需求文档负责产品决策；产品发现只提供机会、候选、证据和推荐。
- 没有证据的机会只能写 likely / unclear。
