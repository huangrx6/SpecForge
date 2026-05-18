# SpecForge Project Runtime

本目录是业务项目内 `.specforge/` 的运行时入口。它保存规则、模板、工具、项目知识和 work item 证据；业务代码仍留在项目源码目录，不放进 `.specforge/`。

## 项目约束

- 本文件是 Agent 进入业务项目后首先读取的人类可读入口。
- 机器可读配置以 `.specforge/manifest.yaml` 为准；work item 索引以 `.specforge/registry.yaml` 为准。
- 动态 work item 证据只放在 `.specforge/work/` 下，长期事实只放在 `.specforge/wiki/` 下。
- 常用健康检查命令：`node .specforge/core/scripts/doctor.mjs`。
- 存量项目或大型代码库接入后，先运行 `node .specforge/core/scripts/codebase-map.mjs --json` 并通过 `sf-steering` 建立 wiki 基线。
- 项目级特殊约束可以追加到本节；不要把未经用户确认的业务事实写成硬约束。

## 加载顺序

1. 读取当前用户请求，以及更高优先级的系统 / 开发者指令。
2. 读取 `.specforge/AGENTS.md`、`.specforge/manifest.yaml`、`.specforge/registry.yaml`。
3. 如果有且只有一个 active work item，读取它的 `work.yaml`。
4. 自动推进或高风险操作前，运行 `node .specforge/core/scripts/doctor.mjs`。
5. 运行 `node .specforge/core/scripts/instructions.mjs` 判断下一个 ready artifact。
6. 如果 ready artifact 是 `requirements`，但 active work 的 `00-intake/brief.md#PRD 决策` 标记需要 PRD 且 `00-intake/prd.md` 还未完成，先执行 `sf-prd`。
7. 如果是已有代码项目且 wiki 仍是空模板或缺少相关模块事实，先执行 `sf-steering`，再创建或推进 work item。
8. 如果 ready artifact 是 `technical_design`、`spec_review` 或 `code_review`，并涉及 API、安全、可靠性、可观测性或交付影响，读取对应标准入口；每个入口已内嵌唯一主基准。
9. 只加载当前 artifact 需要的 standards、templates、profiles 和 wiki。

## 状态传递协议

SpecForge 生命周期不能依赖隐藏内存、环境变量或只存在于聊天里的状态。状态由三类文件共同计算：

| 来源 | 作用 |
|---|---|
| `.specforge/manifest.yaml` | 声明版本、profile、workflow、路径和必需门禁 |
| `.specforge/core/artifacts/schemas/<workflow>.json` | 声明 artifact、依赖、输出、门禁、apply 条件和 archive 条件 |
| `.specforge/work/active/<work-item-id>/work.yaml` | 记录单个 work item 的 workflow、stage、status、components、门禁状态和证据路径 |

`.specforge/registry.yaml` 是 active、blocked、archive 的索引。单个 work item 的完整状态以 `work.yaml` 所在目录为准。

## Work Item 命名

推荐通过 `create-work.mjs` 创建 work item，目录 ID 使用可读、可排序的短命名：

```text
YYYYMMDD-kind-NNN-short-title
```

- `YYYYMMDD` 是本地创建日期。
- `kind` 使用 `feat`、`bugfix`、`issue`、`refactor`、`research`、`docs`、`chore`、`ops` 等。
- `NNN` 是当天序号，计算范围包含 active 和 archived work items。
- `short-title` 从标题或 `--short-title` 生成，保持短、清楚、kebab-case。

示例：

```text
20260518-feat-001-意图识别审批
20260518-issue-002-任务启动失败
```

不要手工创建不兼容命名的目录。使用：

```bash
node .specforge/core/scripts/create-work.mjs --workflow feature "工作项标题"
```

未指定 `--workflow` 时默认使用 `feature`。如果是 bugfix、issue、refactor、discovery 或 lite 小改，必须显式指定 workflow。

## 工作流状态机

```text
feature:   intake -> [research if needs_research] -> requirements -> [ui_design if has_ui] -> [technical_design if technical components] -> tasks -> spec_review -> implementation -> code_review -> verification -> wiki_sync -> closure
standard:  intake -> [research if needs_research] -> requirements -> [ui_design if has_ui] -> [technical_design if technical components] -> tasks -> spec_review -> implementation -> code_review -> verification -> wiki_sync -> closure
lite:      intake -> requirements -> tasks -> implementation -> code_review -> verification -> wiki_sync -> closure
bugfix:    intake -> gap_report -> tasks -> implementation -> code_review -> verification -> wiki_sync -> closure
issue:     intake -> gap_report -> tasks -> implementation -> code_review -> verification -> wiki_sync -> closure
refactor:  intake -> technical_design -> tasks -> spec_review -> implementation -> code_review -> verification -> wiki_sync -> closure
discovery: intake -> research -> wiki_sync -> closure
```

PRD 是 graph 外的产品澄清产物：`intake -> sf-prd -> requirements`。它只在 brief 明确需要时出现。

## Artifact 与技能契约

artifact 是否完成，只以 artifact graph 计算出的 `done` 为准。不要凭目录猜状态，使用：

```bash
node .specforge/core/scripts/instructions.mjs
node .specforge/core/scripts/artifact-graph-status.mjs
```

根级 `sf-*` 技能只写自己负责的产物：

| 技能 | 写入 |
|---|---|
| `sf-steering` | `.specforge/wiki/*.md` 中的项目画像、架构、模块、API、数据、运行和风险事实 |
| `sf-intake` | `work.yaml`、`00-intake/original-request.md`、`00-intake/brief.md` |
| `sf-prd` | `00-intake/prd.md` |
| `sf-discovery` | `00-intake/brief.md`、`01-spec/gap-report.md` 或 `01-spec/research.md` |
| `sf-requirements` | `01-spec/requirements.md` |
| `sf-ui-design` | `01-spec/ui-design.md` 和可选 UI 原型证据 |
| `sf-tech-design` | `01-spec/technical-design.md` |
| `sf-tasking` | `01-spec/tasks.md` |
| `sf-spec-review` | `02-spec-review/spec-review-v1.md`，然后更新 `spec_review` 门禁 |
| `sf-implement` | 业务代码、`03-implementation/*`、task 勾选状态 |
| `sf-code-review` | `04-code-review/code-review-v1.md`，然后更新 `code_review` 门禁 |
| `sf-verify` | `05-verification/report.md`、`05-verification/ci-result.md`，然后更新 `verification` 门禁 |
| `sf-wiki` | `.specforge/wiki/*.md`、`06-close/wiki-sync.md`，然后更新 `wiki_sync` 门禁 |
| `sf-close` | `06-close/release.md`、`06-close/rollback.md`，然后 archive |

## 门禁纪律

必需门禁由当前 workflow schema 和 `work.yaml` 的 `components` 共同决定，记录在 `work.yaml` 中，并且必须绑定证据文件：

- `spec_review`：`02-spec-review/spec-review-v1.md`
- `code_review`：`04-code-review/code-review-v1.md`
- `verification`：`05-verification/report.md` 或 `05-verification/ci-result.md`
- `wiki_sync`：`06-close/wiki-sync.md`

必需门禁未处于 `APPROVED`，或证据文件不存在时，不得进入下游阶段。

更新门禁必须使用：

```bash
node .specforge/core/scripts/gate.mjs <gate> <status> --evidence <relative-path>
```

当状态为 `APPROVED` 时，证据路径必填，并且必须存在于 active work item 目录下。证据文档必须包含决策结论、执行者或 reviewer、日期、findings 或理由、已知缺口和后续 owner。

## 归档纪律

只有 active work item 可以 archive。归档前必须满足：

- workflow 中所有 artifacts 都是 `done`。
- `schema.archive.requires` 中列出的 artifacts 都是 `done`。
- `wiki_sync` 已批准，或 workflow 明确允许其他处理方式。
- closure 的 `release.md` 和 `rollback.md` 已存在。

使用：

```bash
node .specforge/core/scripts/archive-work.mjs
```

archive 命令会把 work item 从 `.specforge/work/active/` 移动到 `.specforge/work/archive/`，并更新 `.specforge/registry.yaml`。

## 边界约束

- 动态 work item 证据放在 `.specforge/work/active/<work-item-id>/`。
- 长期事实放在 `.specforge/wiki/`。
- 稳定标准放在 `.specforge/core/standards/`，不要把一次性 work item 报告粘进去。
- 如果实现需要扩大已批准写入范围，先停下来更新 spec 或询问用户。
