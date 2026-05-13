# SpecForge 状态传递协议 v0.2

本文档定义 SpecForge 生命周期技能如何通过文件系统传递状态。技能推进不能依赖隐藏内存、环境变量或只存在于聊天里的状态。

## 控制面

SpecForge 的状态由三类文件共同计算：

| 来源 | 作用 |
|---|---|
| `.specforge/manifest.yaml` | 声明 SpecForge 版本、profile、workflow、路径和必需门禁。 |
| `.specforge/artifacts/schemas/<workflow>.json` | 声明 artifact、依赖、输出、门禁、apply 条件和 archive 条件。 |
| `.specforge/workspace/changes/active/<change-id>/change.yaml` | 记录单个 change 的 workflow、当前 stage、status、门禁状态和证据路径。 |

`.specforge/registry.yaml` 是 active、blocked、archive 的索引。单个 change 的完整状态仍以 change 目录为准。

## 变更 ID

`create-change.mjs` 当前生成的 change id 格式为：

```text
CHG-YYYYMMDD-NNN-slug
```

规则：

- `YYYYMMDD` 是本地创建日期。
- `NNN` 是当天序号，计算范围包含 active 和 archived changes。
- `slug` 从标题生成，会转为小写 kebab-case，最长 48 个字符。

示例：

```text
CHG-20260512-001-bootstrap-v0.1
CHG-20260512-008-codex-skill-sync-and-validation
```

不要手工创建不兼容命名的 change 目录。使用：

```bash
node .specforge/execution/tools/create-change.mjs "变更标题"
```

## Workflow 变体

| Workflow | 路径 | 用途 |
|---|---|---|
| `feature` | requirements -> design -> tasks -> spec_review -> implementation -> code_review -> verification -> ssot_sync -> closure | 新增用户能力和产品功能扩展 |
| `standard` | requirements -> design -> tasks -> spec_review -> implementation -> code_review -> verification -> ssot_sync -> closure | 通用标准变更和兼容默认流 |
| `lite` | requirements -> tasks -> implementation -> code_review -> verification -> ssot_sync -> closure | 边界明确的小改动 |
| `bugfix` | gap_report -> tasks -> implementation -> code_review -> verification -> ssot_sync -> closure | 缺陷、回归和漏洞修复 |
| `refactor` | design -> tasks -> spec_review -> implementation -> code_review -> verification -> ssot_sync -> closure | 行为不变的技术债治理 |
| `discovery` | research -> ssot_sync -> closure | 纯预研、Spike 和黑盒理解 |

创建指定 workflow 的 change 时使用：

```bash
node .specforge/execution/tools/create-change.mjs --workflow feature "变更标题"
```

## 变更目录

workflow 会按 schema 渐进创建 artifact。新 change 初始只包含 `change.yaml` 和 intake 输出；下方是 superset 视图，实际产物以 `.specforge/artifacts/schemas/<workflow>.json` 为准。

```text
.specforge/workspace/changes/active/<change-id>/
├── change.yaml
├── 00-intake/
│   ├── original-request.md
│   └── brief.md
├── 01-spec/
│   ├── gap-report.md
│   ├── research.md
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
├── 02-spec-review/
│   └── spec-review-v1.md
├── 03-implementation/
│   ├── plan.md
│   ├── report.md
│   └── changed-files.md
├── 04-code-review/
│   └── code-review-v1.md
├── 05-verification/
│   ├── report.md
│   └── ci-result.md
└── 06-closure/
    ├── ssot-sync.md
    ├── release.md
    └── rollback.md
```

权威 artifact 列表和依赖关系在 `.specforge/artifacts/schemas/<workflow>.json` 中声明；上面的目录树只是便于人阅读的视图。

## change.yaml 必需结构

`change.yaml` 必须包含：

```yaml
id: CHG-YYYYMMDD-NNN-slug
title: 变更标题
type: FEATURE
workflow: standard

status: ACTIVE
stage: 00-intake

created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD

paths:
  intake: 00-intake
  spec: 01-spec
  spec_review: 02-spec-review
  implementation: 03-implementation
  code_review: 04-code-review
  verification: 05-verification
  closure: 06-closure

gates:
  spec_review:
    required: true
    status: PENDING
    evidence: null
  code_review:
    required: true
    status: PENDING
    evidence: null
  verification:
    required: true
    status: PENDING
    evidence: null
  ssot_sync:
    required: true
    status: PENDING
    evidence: null
```

门禁状态值为：

```text
PENDING | APPROVED | REQUEST_CHANGES | REJECTED | SKIPPED
```

不适用于当前 workflow 的 gate 应写为 `required: false` 和 `SKIPPED`。只有 workflow 允许该门禁可选，并且证据写清跳过原因时，`SKIPPED` 才合法。

## Artifact 完成条件

artifact 是否完成，只以 artifact graph 计算出的 `done` 为准。

对非门禁 artifact，v0.2 工具当前检查声明的全部输出文件是否存在。对门禁 artifact，对应门禁必须是 `APPROVED`，且声明的证据文件必须存在。

不要凭目录猜状态，使用：

```bash
node .specforge/execution/tools/instructions.mjs
node .specforge/execution/tools/artifact-graph-status.mjs
node .specforge/execution/tools/instructions.mjs -- apply
```

## 技能读写契约

| 技能 | 读取 | 写入 |
|---|---|---|
| `sf-intake` | 用户请求、knowledge、registry | `change.yaml`、`00-intake/original-request.md`、`00-intake/brief.md` |
| `sf-discovery` | intake、analysis rules、代码探索、外部研究 | `00-intake/brief.md`、`01-spec/gap-report.md` 或 `01-spec/research.md` |
| `sf-spec` | intake、rules、knowledge | `01-spec/requirements.md`、`01-spec/design.md`、`01-spec/tasks.md`、`02-spec-review/spec-review-v1.md` |
| `sf-review` | spec 或 implementation artifacts | `02-spec-review/spec-review-v1.md` 或 `04-code-review/code-review-v1.md`，然后更新门禁 |
| `sf-implement` | 已批准的 spec 和 tasks | 业务代码、`03-implementation/*`、task 勾选状态 |
| `sf-verify` | design、tasks、implementation、review | `05-verification/report.md`、`05-verification/ci-result.md`，然后更新 verification 门禁 |
| `sf-close` | verification、knowledge、closure rules | `06-closure/ssot-sync.md`、`06-closure/release.md`、`06-closure/rollback.md`，然后更新 ssot 门禁并 archive |
| `sf-work` | artifact graph 和 instructions 输出 | 委托给阶段技能；不应发明绕过路径 |

## 门禁证据契约

更新门禁必须使用：

```bash
node .specforge/execution/tools/gate.mjs <gate> <status> --evidence <relative-path>
```

当状态为 `APPROVED` 时，证据路径必填，并且必须存在于 active change 目录下。

证据文档必须包含：

- 决策结论。
- reviewer 或执行 Agent。
- 日期。
- findings 或理由。
- 已知缺口和后续 owner。

## 归档契约

只有 active change 可以 archive。归档前必须满足：

- workflow 中所有 artifacts 都是 `done`。
- `schema.archive.requires` 中列出的 artifacts 都是 `done`。
- `ssot_sync` 已批准，或 workflow 明确允许其他处理方式。
- closure 的 `release.md` 和 `rollback.md` 已存在。

使用：

```bash
node .specforge/execution/tools/archive-change.mjs
```

archive 命令会把 change 从 `.specforge/workspace/changes/active/` 移动到 `.specforge/workspace/changes/archive/`，并更新 `.specforge/registry.yaml`。

## 兼容说明

历史 archive 可能早于严格门禁 schema。新工具不应静默改写历史 archive；如果确实需要兼容旧记录，应写清 legacy 兼容规则，而不是篡改历史证据。
