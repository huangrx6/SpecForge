# 工作流与边界标准

本标准回答：当前 work item 怎么推进、什么时候停、什么算越界、上下文如何加载、gate 如何批准。

## Golden Rule (核心法则)

**先理解，再行动。** 不确定就停下来问。不要在不理解的情况下修改代码、删除代码或强行推进阶段。

## 核心架构与加载顺序

1. **读取上下文**：首先读取业务最新请求和更高优先级指令。然后读取 `.specforge/AGENTS.md`、`.specforge/manifest.yaml`、`.specforge/registry.yaml`。
2. **加载 active 项**：若有且只有一个 active work item，读取其 `work.yaml` 和当前 ready artifact。
3. **健康检查与就绪判定**：自动推进或高风险动作前运行 `node .specforge/core/scripts/doctor.mjs`。运行 `node .specforge/core/scripts/instructions.mjs` 判断下一步。
4. **Wiki-first 定位**：已有代码项目先读 `.specforge/wiki/00-index.md` 和相关知识项，提取入口路径、模块、API、数据、运行和风险线索。
5. **按需加载**：只加载当前阶段需要的标准、模板、profile、wiki 和 wiki 指向的代码文件，避免上下文污染。

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
