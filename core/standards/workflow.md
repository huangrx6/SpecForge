# 工作流与边界标准

本标准回答：当前 work item 怎么推进、什么时候停、什么算越界、上下文如何加载、gate 如何批准。

## Golden Rule (核心法则)

**先理解，再行动。** 不确定就停下来问。不要在不理解的情况下修改代码、删除代码或强行推进阶段。

## 核心架构与加载顺序

1. **读取上下文**：首先读取业务最新请求和更高优先级指令。然后读取 `.specforge/AGENTS.md`、`.specforge/manifest.yaml`、`.specforge/registry.yaml`。
2. **加载 active 项**：若有且只有一个 active work item，读取其 `work.yaml` 和当前 ready artifact。
3. **健康检查与就绪判定**：自动推进或高风险动作前运行 `node .specforge/core/scripts/doctor.mjs`。运行 `node .specforge/core/scripts/instructions.mjs` 判断下一步。
4. **人工确认扫描**：遇到不确定、handoff、gate、verification 或上线前，运行 `node .specforge/core/scripts/decision-checkpoints.mjs` 查看 open `[NEEDS ...]`、已确认项和风险接受候选。
5. **Wiki-first 定位**：已有代码项目先读 `.specforge/wiki/00-index.md` 和相关知识项，提取入口路径、模块、API、数据、运行和风险线索。
6. **按需加载**：只加载当前阶段需要的标准、模板、profile、wiki 和 wiki 指向的代码文件，避免上下文污染。

## Work Item 命名与创建

推荐通过 `create-work.mjs` 创建 work item，目录 ID 使用可读、可排序的短命名：

```text
YYYYMMDD-kind-NNN-short-title
```

- `YYYYMMDD` 是本地创建日期。
- `kind` 使用 `feat`、`bugfix`、`issue` / `bug`、`refactor`、`research` / `discovery`、`docs`、`chore`、`ops` 等。
- `NNN` 是当天序号，计算范围包含 active 和 archived work items。
- `short-title` 从标题或 `--short-title` 生成，保持短、清楚、kebab-case。

示例：
- `20260518-feat-001-intent-recognition`
- `20260518-bugfix-002-start-failure`

不要手工创建不兼容命名的目录。创建命令示例：
```bash
node .specforge/core/scripts/create-work.mjs --workflow feature "工作项标题"
```
未指定 `--workflow` 时默认使用 `feature`。如果是 bugfix、issue、refactor、discovery 或 lite 小改，必须显式指定 workflow。

## 工作流状态机

SpecForge 的主线生命周期是：

```text
feature:   intake -> [research] -> requirements -> [ui_design] -> [technical_design] -> tasks -> spec_review -> implementation -> code_review -> verification -> wiki_sync -> closure
standard:  intake -> [research] -> requirements -> [ui_design] -> [technical_design] -> tasks -> spec_review -> implementation -> code_review -> verification -> wiki_sync -> closure
lite:      intake -> requirements -> tasks -> implementation -> code_review -> verification -> wiki_sync -> closure
bugfix:    intake -> gap_report -> tasks -> implementation -> code_review -> verification -> wiki_sync -> closure
issue:     intake -> gap_report -> tasks -> implementation -> code_review -> verification -> wiki_sync -> closure
refactor:  intake -> technical_design -> tasks -> spec_review -> implementation -> code_review -> verification -> wiki_sync -> closure
discovery: intake -> research -> wiki_sync -> closure
```

Brainstorm 和 PRD 都是 graph 外的澄清产物：`intake -> sf-brainstorm -> sf-prd -> requirements`。Brainstorm 只在需要用户参与式取舍时出现；PRD 只在 brief 明确需要时出现。

每个 workflow schema 除了定义 artifact DAG、apply 和 archive 条件，还必须定义适合该 workflow 的 `quality_policy.section_checks`。`status` / `instructions` 读取该策略输出非阻断质量提醒，避免 `lite`、`bugfix`、`discovery` 被套用同一套重型 feature 检查，也避免高风险 feature 缺少必要质量条。

## Artifact 与技能契约

每一阶段只回答一个层级的问题，artifact 是否完成只以 artifact graph 计算出的 `done` 为准：

| 阶段 / Artifact | 技能 | 写入证据/产物 | 退出门禁 / 约束 |
|---|---|---|---|
| intake / brief | `sf-intake` | `work.yaml`、`00-intake/original-request.md`、`00-intake/brief.md` | 问题类型已确认；需要取舍时路由到 brainstorm |
| brainstorm | `sf-brainstorm` | `00-intake/brainstorm.md`、回写 `00-intake/brief.md` | 关键方向、MVP、体验或技术路线取舍已确认 |
| prd | `sf-prd` | `00-intake/prd.md` | 产品澄清完毕，可进入 requirements |
| research | `sf-discovery` | `01-spec/research.md` 或 `01-spec/gap-report.md` | 预研、Spike 或 Gap 分析完成 |
| requirements | `sf-requirements` | `01-spec/requirements.md` | 行为、边界、验收标准清楚 |
| ui_design | `sf-ui-design` | `01-spec/ui-design.md`、Pencil 原型及 PNG 截图 | Pencil 原型、状态矩阵通过自检 |
| technical_design | `sf-tech-design` | `01-spec/technical-design.md` | 技术选择、依赖、版本事实和验证策略确认 |
| tasks | `sf-tasking` | `01-spec/tasks.md` | 每个来源项有具体的实现与验证任务 |
| spec_review | `sf-spec-review` | `02-spec-review/spec-review-v1.md` | 必需门禁更新为 `APPROVED`（Gate Review） |
| implementation | `sf-implement` | 业务代码、`03-implementation/*` | 对应 task 勾选，产出快速验证结果 |
| code_review | `sf-code-review` | `04-code-review/code-review-v1.md` | 必需门禁更新为 `APPROVED` |
| verification | `sf-verify` | `05-verification/test-cases.md`、`report.md` 或 `ci-result.md` | 必需门禁更新为 `APPROVED`，Playwright E2E 闭环 |
| wiki_sync | `sf-wiki` | `.specforge/wiki/*.md`、`06-close/wiki-sync.md` | 长期知识回写完毕，门禁更新为 `APPROVED` |
| closure | `sf-close` | `06-close/release.md`、`06-close/rollback.md` | 满足归档纪律，执行 archive 移动目录 |

- 已关闭、已归档或所有 required gate 已完成的 work item 是历史证据；后续发现的缺陷、遗漏、体验问题或测试漏测必须新建 follow-up work item，不继续修改旧 scope。
- follow-up work item 应在 `work.yaml#relations.parent` 记录来源 work item id，并用 `relations.relation` 标明 `follow_up`、`bugfix`、`issue` 或 `split_from`。

## Workflow 选择

| Workflow | 使用场景 | 核心路径 |
|---|---|---|
| `feature` | 新增用户能力或产品功能 | intake -> optional research -> requirements -> optional ui_design -> optional technical_design -> tasks -> review -> implementation -> verification -> wiki -> close |
| `standard` | 普通工程变更或跨域改动 | 同 feature，偏通用 |
| `lite` | 低风险小改 | intake -> requirements -> tasks -> implementation -> review -> verification -> close |
| `bugfix` | 明确缺陷修复 | intake -> gap_report -> tasks -> implementation -> review -> verification -> close |
| `issue` | 运维、配置、环境或非产品问题 | intake -> gap_report -> tasks -> implementation -> review -> verification -> close |
| `refactor` | 行为不变的技术债治理 | intake -> technical_design -> tasks -> review -> implementation -> verification -> close |
| `discovery` | 预研、Spike、黑盒探索 | intake -> research -> wiki -> close |

## Gate 标准

- required gate 必须有 evidence 文件，不能空批准。
- `spec_review` 有两种模式：Artifact Review 可随时审查任一已有 spec 且不更新 gate；Gate Review 只在 requirements、适用的 ui_design / technical_design、tasks 足以直接实现时批准。
- `code_review` 只在实现满足 approved spec、边界和测试证据时批准。
- `verification` 必须先产出 `05-verification/test-cases.md`，再留下命令、结果、覆盖范围和未覆盖风险。
- `wiki_sync` 只在长期事实已回写或明确 N/A 时批准。

### 人工确认与风险接受

SpecForge 不追求机械卡死，也不允许无记录跳过。遇到外部环境、真实账号、生产数据、第三方系统、权限审批或低风险残余无法由 Agent 直接证明时，必须进入人工确认路径：

1. 写清缺口：缺什么证据、为什么当前拿不到、影响哪些验收项。
2. 写清已有证据：本地测试、mock、静态检查、代码审查、截图或日志覆盖了什么。
3. 写清风险：影响范围、失败后果、回滚方式、重新验证触发条件。
4. 请求人工判断：继续补证、接受外部待补证、降级范围、拆 follow-up 或退回实现。
5. 将确认结果写入对应 artifact：brief 的澄清记录、technical design 的决策、verification 的人工确认记录、release / rollback 或 wiki 风险项。

人工确认只能接受**低风险残余**或**外部真实环境待补证**；不能覆盖 P0 / P1 缺陷、未解决安全风险、数据破坏风险、生产不可回滚风险或核心验收标准缺失。

### 验证证据分级

Verification 报告必须区分证据强度，避免把 mock、人工口头确认和真实验证混在一起：

| 等级 | 含义 | Gate 使用规则 |
|---|---|---|
| `proven` | 本地命令、CI、Playwright、契约测试、真实日志或真实环境直接证明 | 可支持批准 |
| `mocked` | Mock API、fake provider、fixture 证明协议、状态和失败态 | 可支持局部批准；外部系统仍需标注未覆盖 |
| `manual-confirmed` | 用户或负责人明确接受外部待补证 / 低风险跳过 | 可支持批准，但必须记录 owner、影响和重新验证触发条件 |
| `deferred` | 缺口被拆成 follow-up 或真实环境补证事项 | 仅在低风险或人工确认后支持批准 |
| `missing` | 无证据、无确认、无补偿 | 不得批准 |

### 轻量产物与可视化

- 每个 artifact 顶部先写简短摘要、关键决策、风险和下一步；详细矩阵放后文。
- `lite` workflow 默认不生成 PRD、UI design、technical design，除非用户要求或风险触发。
- 长文档必须减少模板化说明，保留能指导实现、验证或审查的字段。
- Markdown 是唯一可版本管理事实源；HTML / 图表 / 看板可以作为阅读友好的派生产物。
- HTML / 可视化报告适合复杂验证矩阵、状态流、跨系统链路和对非研发人员展示，但必须在 Markdown artifact 中登记路径和来源。

## 上下文标准

- 先读入口标准，再按需读 profile / template / wiki。
- 存量项目默认遵循 wiki-first：先用 wiki 找入口点，再顺着模块、API、数据、测试和运行链路读取必要文件。
- 不把 `rg`、provider、Repomix 或文件阅读当作全仓重新理解工具；它们只用于验证 wiki 给出的路径、符号和上下游。
- 不读取无关 archive work item，除非当前问题明确依赖历史。
- 外部事实、框架版本、API 行为、安全标准可能变化时，查当前官方资料。
- 用户明确说“不要改代码”“只分析”“先给建议”时，不进入实现。

全仓扫描或大型代码库 provider 建图只属于 `sf-steering`、显式 discovery / audit，或 wiki 缺失、过期、冲突且无法用局部补证解决的情况。

## 输出语言

- 面向用户和项目文档默认中文。
- 命令、路径、API 字段、代码标识保留原文。
- 引用来源时写链接和适用结论，不复制大段原文。

## 阻断项

- active work item 多个且用户未指定。
- registry、work.yaml、schema 状态互相矛盾。
- required gate 缺 evidence。
- 当前需求越过已批准范围。
- 高风险安全、数据、生产操作缺少验证路径。
