---
name: discovery
description: SpecForge 内部 discovery / intake 路由技能。用于将原始请求判断为无需 spec、单 work item、多 work item、扩展已有 work item、是否需要 PRD、是否需要 research 或混合路线。
---

# Discovery Skill

Discovery 是新工作的分诊入口，也是协作式问题澄清入口。它负责把模糊诉求变成可推进的 work item：判断路线、识别缺口、做必要代码库 / 外部研究、和用户一起完成关键取舍，并创建可恢复的 intake 证据。它不直接写完整 PRD、requirements、设计或实现代码。

## 读取

- 用户原始请求和当前对话约束。
- `.specforge/manifest.yaml`、`.specforge/registry.yaml`。
- `.specforge/core/standards/workflow.md`、`.specforge/core/standards/workflow.md`、`.specforge/core/standards/product.md`。
- 新功能、复杂 bug、重构、API / DB / 架构调整必须读取 `.specforge/core/standards/product.md`。
- 产品、页面、全栈应用、AI 功能或复杂功能必须读取 `.specforge/core/standards/product.md`。
- 与请求直接相关的 `.specforge/wiki/` 文件。

## 动作

1. 判断是否已有 active work item。
2. 判断 work item kind：功能、缺陷、issue、重构、研究、运维、文档、测试补强或混合任务。
3. 判断分析深度：`light`、`standard` 或 `deep`。
4. 按深度执行代码库探索；绿地项目也要记录“无既有实现”和项目规范。
5. 判断风险等级：安全、数据迁移、生产发布、权限、外部依赖、跨模块契约。
6. 需要新框架、第三方库、部署、安全或版本敏感事实时执行外部官方资料研究；不触发时写明跳过理由。
7. 对产品、页面、全栈应用或复杂功能，先进入协作式 brainstorm：
   - 先复述问题空间和目标，不急着定方案。
   - 生成 2-3 个互斥方案或 MVP 组合，写清价值、成本、风险、推荐项和不推荐项。
   - 一次只问会改变方向的关键问题；优先给可选项和取舍影响。
   - 用户没有确认 MVP / 核心方向前，不把默认方案写成已批准。
8. 需要新领域知识、竞品、政策、框架 / SDK / 版本事实、AI 能力边界、部署 / 安全事实时，必须查当前可靠来源；技术类优先官方文档，产品/竞品类记录来源日期和结论。若跳过外部研究，写明为什么对本次决策无影响。
9. 对产品、页面、全栈应用或复杂功能，生成候选功能池，按 `MVP / 可选增强 / 后续版本` 分组，并给出推荐组合。
10. 先汇总“已明确 / 待确认 / 可能遗漏”，再向用户澄清关键问题并记录答案。
11. 明确哪些选择已由用户确认，哪些只是 Agent 默认假设。
12. 判断是否需要 PRD，并写入 `brief.md#PRD 决策`。PRD 是 graph 外产品澄清产物；需要时下一步路由到 `sf-prd`，不需要时写清跳过理由。
13. 选择 workflow：`lite`、`feature`、`standard`、`bugfix`、`issue`、`refactor` 或 `discovery`，并写出影响面矩阵。
14. 根据影响面设置 `components` flags：`has_ui`、`has_api`、`has_db`、`has_domain`、`has_ai`、`has_nfr`、`has_security`、`has_integration`、`has_infra`、`has_background_job`、`needs_research`。纯预研使用 `discovery` workflow，不用在 feature / standard 内模拟 discovery 阶段。
15. 没有 active work item 时，运行 `node .specforge/core/scripts/create-work.mjs --workflow <workflow> "工作项标题"`，已确定的影响面可用 `--has-ui false`、`--has-api true` 等参数写入。
16. 如果 work item 已存在，根据 brief 的影响面矩阵同步更新 `work.yaml` 的 `components`；明确无 UI 或无技术影响时写 `false`，不确定时保留 `auto`。
17. 写入 `00-intake/original-request.md` 和 `00-intake/brief.md`。

## Workflow 分流

| Workflow | 何时选择 | 下一步 artifact |
|---|---|---|
| `lite` | 边界清楚、低风险、无需设计评审的小改动 | `requirements` |
| `feature` | 新增用户能力、产品功能扩展、需要功能候选和体验/技术设计的新功能 | `sf-prd` 或 `requirements` |
| `standard` | 无法归入 feature / bugfix / refactor / discovery，但仍需要完整规格和双门禁的通用标准变更 | `requirements` |
| `bugfix` | 缺陷、回归、安全漏洞或线上异常修复 | `gap_report` |
| `issue` | 尚未完全定性为 bug 的异常、告警、线上问题或技术问题 | `gap_report` |
| `refactor` | 行为不变的结构调整、解耦、依赖升级、性能重构 | `technical_design` |
| `discovery` | 纯预研、Spike、可行性验证、黑盒系统理解，不承诺实现 | `research` |

`feature` 是新增功能的首选 workflow；不要再把新增功能默认塞进 `standard`。`bugfix` 是已经确认的缺陷修复；`issue` 是尚未完全定性的异常、告警或问题排查，不要把它写成新增功能。`refactor` 不跳业务分析，它跳过的是终端用户需求规格；brief 仍必须说明重构动机、现状证据、风险和成功判据。`discovery` 不写实现任务；如果研究结果需要落地，应关闭 discovery work item 后新开 feature / standard / refactor / bugfix / issue work item。

## PRD 决策

需要 PRD：

- 产品型功能、后台工具、全栈应用、AI 功能、运营能力或多角色系统。
- 用户目标宽泛，尚未确认目标用户、MVP、成功标准、功能候选或路线图。
- 涉及审批、权限、AI 质量、数据生命周期、上线执行、人工复核或运营责任。

跳过 PRD：

- `bugfix`、`issue`、`refactor`、`discovery`。
- `lite` 小改。
- 已有等价 PRD / 业务规格，且 brief 已摘录产品边界。

PRD 决策只写在 `brief.md`，不修改 artifact graph。需要 PRD 时，下一步由 `sf-router` 路由到 `sf-prd`；PRD 完成后再进入 `sf-requirements`。

## 路由结果

| 结果 | 含义 | 下一步 |
|---|---|---|
| `NO_SPEC_NEEDED` | 小改动，风险低，边界明确 | 直接实现并记录验证 |
| `SINGLE_WORK_ITEM` | 一个独立 work item 可交付 | 进入对应 workflow |
| `MULTI_WORK_ITEM` | 需要拆多个 work item | 先写 roadmap 或拆分计划 |
| `EXTEND_EXISTING` | 属于已有 active work item | 更新该 work item intake |
| `MIXED` | 同时包含多个性质 | 先拆范围，不急着实现 |

## brief 必含内容

- 背景和目标。
- 分析深度、代码库探索、外部研究或跳过理由、澄清记录和分析综合。
- 候选功能池、推荐 MVP、用户已确认选择和明确延后项。
- 本次负责和不负责。
- 受影响区域。
- 候选 workflow 和理由。
- PRD required / skipped、PRD depth、跳过理由或阻塞问题。
- 影响面矩阵：UI、frontend、backend、API、data、AI、integration、security、delivery、tests。
- `work.yaml` components flags 与影响面矩阵的一致性说明。
- 风险、依赖和澄清项。
- 下一步建议。

## 停止条件

- 多个 active work item，用户未指定目标。
- 请求边界无法判断。
- 产品 / 页面 / 全栈应用的 MVP 功能组合尚未被用户确认，且复杂度超过简单小改。
- 需要 brainstorm 的需求尚未完成用户参与式取舍，却试图直接进入 PRD / requirements。
- PRD 决策不清，导致后续无法判断应进 `sf-prd` 还是 `sf-requirements`。
- `standard` / `deep` 缺少代码库探索证据或明确跳过原因。
- `deep` 缺少外部研究证据或明确跳过原因。
- 涉及生产、安全、权限或数据风险但缺少关键事实。
- 用户的目标和现有 `wiki` 明显冲突。

## 完成标准

- work item 已创建或已有 work item 已被明确选中。
- intake 产物足以支撑 PRD 或 requirements。
- `brief.md` 已写清 PRD 决策和下一步路由。
- 所有歧义都用 `[NEEDS CLARIFICATION: question]` 标记。
