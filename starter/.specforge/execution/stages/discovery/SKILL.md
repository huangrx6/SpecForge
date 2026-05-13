---
name: discovery
description: SpecForge 内部 discovery 路由技能。用于将原始请求判断为无需 spec、单 change、多 change、扩展已有 change 或混合路线。
---

# Discovery Skill

Discovery 是新工作的分诊入口，只负责判断路线和创建可恢复的 intake 证据，不直接写完整规格或实现代码。

## 读取

- 用户原始请求和当前对话约束。
- `.specforge/manifest.yaml`、`.specforge/registry.yaml`。
- `.specforge/policy/rules/context/README.md`、`.specforge/policy/rules/boundaries/README.md`、`.specforge/policy/rules/spec-quality/README.md`。
- 新功能、复杂 bug、重构、API / DB / 架构调整必须读取 `.specforge/policy/rules/analysis-workflow/README.md`。
- 产品、页面、全栈应用或复杂功能必须读取 `.specforge/policy/rules/product-discovery/README.md`。
- 与请求直接相关的 `.specforge/workspace/knowledge/` 文件。

## 动作

1. 判断是否已有 active change。
2. 判断请求类型：功能、缺陷、重构、研究、运维、文档或混合任务。
3. 判断分析深度：`light`、`standard` 或 `deep`。
4. 按深度执行代码库探索；绿地项目也要记录“无既有实现”和项目规范。
5. 判断风险等级：安全、数据迁移、生产发布、权限、外部依赖、跨模块契约。
6. 需要新框架、第三方库、部署、安全或版本敏感事实时执行外部官方资料研究；不触发时写明跳过理由。
7. 对产品、页面、全栈应用或复杂功能，生成候选功能池，按 `MVP / 可选增强 / 后续版本` 分组，并给出推荐组合。
8. 先汇总“已明确 / 待确认 / 可能遗漏”，再向用户澄清关键问题并记录答案。
9. 明确哪些选择已由用户确认，哪些只是 Agent 默认假设。
10. 选择 workflow：`lite`、`feature`、`standard`、`bugfix`、`refactor` 或 `discovery`。
11. 没有 active change 时，运行 `node .specforge/execution/tools/create-change.mjs --workflow <workflow> "变更标题"`。
12. 写入 `00-intake/original-request.md` 和 `00-intake/brief.md`。

## Workflow 分流

| Workflow | 何时选择 | 下一步 artifact |
|---|---|---|
| `lite` | 边界清楚、低风险、无需设计评审的小改动 | `requirements` |
| `feature` | 新增用户能力、产品功能扩展、需要功能候选和体验/技术设计的新功能 | `requirements` |
| `standard` | 无法归入 feature / bugfix / refactor / discovery，但仍需要完整规格和双门禁的通用标准变更 | `requirements` |
| `bugfix` | 缺陷、回归、安全漏洞或线上异常修复 | `gap_report` |
| `refactor` | 行为不变的结构调整、解耦、依赖升级、性能重构 | `design` |
| `discovery` | 纯预研、Spike、可行性验证、黑盒系统理解，不承诺实现 | `research` |

`feature` 是新增功能的首选 workflow；不要再把新增功能默认塞进 `standard`。`refactor` 不跳业务分析，它跳过的是终端用户需求规格；brief 仍必须说明重构动机、现状证据、风险和成功判据。`discovery` 不写实现任务；如果研究结果需要落地，应关闭 discovery change 后新开 feature / standard / refactor / bugfix change。

## 路由结果

| 结果 | 含义 | 下一步 |
|---|---|---|
| `NO_SPEC_NEEDED` | 小改动，风险低，边界明确 | 直接实现并记录验证 |
| `SINGLE_CHANGE` | 一个独立 change 可交付 | 进入 requirements |
| `MULTI_CHANGE` | 需要拆多个 change | 先写 roadmap 或拆分计划 |
| `EXTEND_EXISTING` | 属于已有 active change | 更新该 change intake |
| `MIXED` | 同时包含多个性质 | 先拆范围，不急着实现 |

## brief 必含内容

- 背景和目标。
- 分析深度、代码库探索、外部研究或跳过理由、澄清记录和分析综合。
- 候选功能池、推荐 MVP、用户已确认选择和明确延后项。
- 本次负责和不负责。
- 受影响区域。
- 候选 workflow 和理由。
- 风险、依赖和澄清项。
- 下一步建议。

## 停止条件

- 多个 active change，用户未指定目标。
- 请求边界无法判断。
- 产品 / 页面 / 全栈应用的 MVP 功能组合尚未被用户确认，且复杂度超过简单小改。
- `standard` / `deep` 缺少代码库探索证据或明确跳过原因。
- `deep` 缺少外部研究证据或明确跳过原因。
- 涉及生产、安全、权限或数据风险但缺少关键事实。
- 用户的目标和现有 `knowledge` 明显冲突。

## 完成标准

- change 已创建或已有 change 已被明确选中。
- intake 产物足以支撑 requirements。
- 所有歧义都用 `[NEEDS CLARIFICATION: question]` 标记。
