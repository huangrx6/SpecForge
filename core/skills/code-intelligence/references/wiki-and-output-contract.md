# Wiki And Output Contract

本文件定义代码智能结果写到哪里，以及 diff 后如何生成 Wiki 回写候选。

## 归一化输出

| 目标 artifact | 写入内容 |
| --- | --- |
| `00-intake/brief.md#现有系统上下文` | bounded context、候选模块、低置信限制 |
| `01-spec/requirements.md#上游确认输入` | existing behavior / current fact / pending evidence |
| `01-spec/technical-design.md#影响面与读取计划` | graph facts、read plan、affected modules |
| `01-spec/technical-design.md#Architecture Contract` | entry、module、call、dependency、API、data facts |
| `01-spec/tasks.md` | `_Impact:_` 追踪 GF id，`_Verification:_` 承接受影响测试 |
| `03-implementation/report.md` | touched symbols、graph freshness、affected area、冲突 |
| `04-code-review/code-review-v1.md` | impact、affected tests、边界偏离、风险 |
| `05-verification/report.md` | affected tests 执行结果、补充验证范围 |
| `.specforge/wiki/*.md` | 已验证长期事实 |

## Technical Design 写入

| Graph fact | 技术设计位置 |
| --- | --- |
| entry / module | 影响面与读取计划、Architecture Contract |
| call / dependency | Impact Analysis、Affected Modules |
| api / data / operation | 对应 API / data / runtime 设计章节 |
| test | Affected Tests、验证策略 |
| risk | ADR、风险与回滚 |

规则：

- Technical design 只能引用已归一化事实，不粘贴 provider 原文。
- 每个关键影响面必须写来源：Wiki、`GF-*`、source path 或测试。
- graph facts 与 requirements 冲突时，暂停并回到用户确认或 requirements 修订。
- affected tests 进入 implementation handoff 和 task verification。

## Wiki Refresh Plan

机器入口：

```bash
node .specforge/core/scripts/wiki-refresh-plan.mjs --from-diff --json
```

目标选择：

| 事实类型 | Wiki 目标 |
| --- | --- |
| module / entry / symbol / dependency | `03-architecture.md` 或 `module-<name>.md` |
| api | `external-interfaces.md` 或 `api-<domain>.md` |
| data | `04-data-model.md` |
| config | `config-env.md` |
| security | `security-auth.md` |
| jobs-events | `jobs-events.md` |
| operation | `05-operations.md` |
| risk | `08-risks.md` |
| test | verification artifact；不一定进 Wiki |

写入规则：

- 只写当前长期事实，不写 provider 原始输出。
- 每条写入事实保留 `GF-*` id、source path 或 query 摘要。
- `used_for_wiki=true` 的 fact 必须能在 Wiki 中被引用，或在风险中写未采纳原因。
- freshness 不是 `ready` 或 `manual-verified` 时，只能写未确认缺口。
- `wiki-refresh-plan` 有 required / review-required target 时，`sf-wiki` / `sf-close` 不能直接写 N/A。
