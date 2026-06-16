---
name: wiki-sync
description: SpecForge 内部 Wiki 同步技能。用于 closure 前判断 work item 是否影响 .specforge/wiki 长期项目知识，并更新或说明不更新原因。
---

# Wiki 同步技能

本技能在 closure 前判断 work item 是否影响长期项目知识，并更新 `.specforge/wiki/` 或说明不需要更新。它是防止“代码已变、知识库过期”的收口步骤。Wiki 只保存当前事实，不保存过程流水账。

## 读取

- `01-spec/requirements.md`
- `00-intake/prd.md`（存在时）
- `01-spec/ui-design.md`（存在时）
- `01-spec/technical-design.md`（存在时）
- `02-spec-review/spec-review-v1.md`（存在时）
- `03-implementation/report.md`
- `04-code-review/code-review-v1.md`
- `05-verification/report.md`
- `.specforge/wiki/`
- `.specforge/core/standards/wiki.md`
- `.specforge/core/standards/engineering.md`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/ai-toolkit.md`
- `.specforge/core/standards/pc-ui-design-spec.md`（本次确认或落地 PC 端业务系统 UI 规范时）
- `node .specforge/core/scripts/wiki-update-plan.mjs --json` 输出

## 写入

- `06-close/wiki-sync.md`
- 必要时更新 `.specforge/wiki/01-project-overview.md`
- 必要时更新 `.specforge/wiki/02-product-rules.md`
- 必要时更新 `.specforge/wiki/03-architecture.md`
- 必要时更新 `.specforge/wiki/module-<name>.md`
- 必要时更新 `.specforge/wiki/api-<domain>.md`
- 必要时更新 `.specforge/wiki/external-interfaces.md`
- 必要时更新 `.specforge/wiki/integration-<system>.md`
- 必要时更新 `.specforge/wiki/config-env.md`
- 必要时更新 `.specforge/wiki/security-auth.md`
- 必要时更新 `.specforge/wiki/jobs-events.md`
- 必要时更新 `.specforge/wiki/design-system.md`
- 必要时更新 `.specforge/wiki/04-data-model.md`
- 必要时更新 `.specforge/wiki/05-operations.md`
- 必要时更新 `.specforge/wiki/06-decisions.md`
- 必要时更新 `.specforge/wiki/07-glossary.md`
- 必要时更新 `.specforge/wiki/08-risks.md`
- 每次更新后同步 `.specforge/wiki/00-index.md`

## 判断维度

| 变化类型 | 目标文件 |
|---|---|
| 项目目标、用户、整体状态 | `01-project-overview.md` |
| 产品规则、角色、权限、审批、状态机 | `02-product-rules.md` |
| 架构、模块边界、技术栈、关键数据流 | `03-architecture.md` 或 `module-<name>.md` |
| API、事件、Webhook、SDK 契约 | `api-<domain>.md` |
| 对外接口总览、第三方集成、CLI、文件导入导出、公开前端入口 | `external-interfaces.md` / `integration-<system>.md` |
| 核心实体、表、关系、状态、迁移注意事项 | `04-data-model.md` |
| 环境、配置、启动、任务、发布、回滚、观测 | `05-operations.md` |
| 环境变量、secret、feature flag、配置源 | `config-env.md` |
| 认证、授权、权限、敏感数据边界 | `security-auth.md` |
| 后台任务、队列、事件、定时任务、消息契约 | `jobs-events.md` |
| 稳定 UI 组件、token、设计系统、风格规则、PC 端业务系统规范落地规则 | `design-system.md` |
| 长期架构 / 产品 / 技术决策 | `06-decisions.md` |
| 术语、缩写、领域语言 | `07-glossary.md` |
| 已知风险、技术债、后续事项 | `08-risks.md` |

不进入 wiki 的内容：一次性调试记录、命令长日志、截图、未批准草稿、只对本 work item 有意义的实现备注。

## 回写流程

0. **生成机器回写计划**：运行 `node .specforge/core/scripts/wiki-update-plan.mjs --json`。
   - 必须把 `wiki_state`、`long_term_fact_candidates`、`required_targets`、`can_write_na`、`blocking_gaps` 写入 `06-close/wiki-sync.md`。
   - 若 `can_write_na=false`，不得写 `N/A - 无长期事实`。
   - 若当前 work item verification 已批准且 wiki 仍为 `missing` / `bootstrap`，先运行 `node .specforge/core/scripts/wiki-hydrate.mjs --mode close --write`，再补充人工可确认事实。
1. **生成 diff 级 Wiki 刷新计划**：implementation / verification 后运行 `node .specforge/core/scripts/wiki-refresh-plan.mjs --from-diff --json`；若返回 `wiki_update_needed=true`，把 targets 写入 `wiki-sync.md#2-必须更新的-wiki-目标`。
2. **收集候选事实**：从 PRD / requirements / ui_design / technical_design / implementation report / verification report 提取长期有效事实。
   - 从 `technical-design.md#7.1 Architecture Contract`、`#Implementation Handoff`、`#12. Operability & Maintenance` 提取 owner、boundary、interface、operability、extension point、deprecation path、wiki target、technical debt 和 revisit trigger。
3. **判断复用价值**：至少沉淀一个未来 work item 会复用的事实；只有 `can_write_na=true` 且 wiki refresh plan 没有必须更新目标时，才允许写 `N/A - 无长期事实`，不要把过程流水账塞进 wiki。
3. **判定写入目标**：使用“判断维度”表选择唯一目标文件；一个知识项只维护一个 current 文件。
4. **对照现有 wiki**：读取目标文件和 `00-index.md`，判断是更新当前事实、补充新章节，还是写 N/A。
5. **检查最低完整度**：按 `.specforge/core/standards/wiki.md#最低完整度` 检查目标文件。架构、API、数据、运维文件缺少关键事实时，先补扫相关代码 / 配置 / 测试；仍缺失时写 `未确认`，并同步到 `08-risks.md` 或本次 wiki-sync 的缺口表。
   - SQL / DDL / dump 文件默认不是当前事实。只有被 migration/runtime/CI/tests 引用或用户确认时，才能写进“当前数据权威”或“当前实体 / 表”；否则写入 `04-data-model.md#历史--未受信-sql-产物` 或 `08-risks.md`。
6. **处理冲突**：如果 artifact 与现有 wiki 冲突，以已批准并验证的最新 work item 为准；同时在 `06-decisions.md` 或目标文件中保留必要决策理由。
7. **刷新元数据**：每个更新文件都刷新 frontmatter 的 `last_updated`、`source_work` 和 `status: current`。
8. **同步索引**：新增或重命名 wiki 文件后更新 `00-index.md`；不得产生重复 current 条目。
9. **严格质量检查**：运行 `node .specforge/core/scripts/wiki-quality.mjs --mode close`。`FAIL` 必须修复；`WARN` 必须写接受理由、影响和补证路径。

## 输出要求

- 明确“影响”或“不影响”。
- 写明 `wiki-update-plan` 的 `can_write_na`、`required_targets` 和 `blocking_gaps`。
- 列出更新文件。
- 每个更新的 wiki 文件必须保持 `status: current`，除非被明确替代。
- 同一知识项不得存在多个 current 文件；不得创建日期版、work item 版或 v2 版 wiki。
- 说明没有更新的理由。
- 写明契约变化、下游重新验证要求和来源证据。
- 写明 Architecture Contract、Implementation Handoff、Operability & Maintenance 中哪些事实已回写，哪些 N/A，以及对应 wiki target。
- 写明未确认缺口：缺失的 API、数据模型、架构链路、运行配置或证据不足项。
- 本次若确认或实现了 PC 端业务系统 UI 规范，写明是否更新 `design-system.md`；不更新时说明该规范是否只是一次性页面约束。
- 更新 `.specforge/wiki/00-index.md` 的当前知识项、摘要和最后同步时间。
- 写明 `wiki-quality.mjs --mode close` 的结果。

## 停止条件

- verification 未批准。
- 无法判断长期影响。
- 需要更新 wiki 但缺少事实证据。
- `wiki-update-plan` 输出 `can_write_na=false` 但未更新 required targets。
- `wiki-quality.mjs --mode close` 仍有 `FAIL`。
- 发现 wiki 与代码 / 验证证据冲突，且无法判断哪个为准。
- 会产生重复 current wiki 文件，或无法把新事实合并到唯一目标文件。

## 完成标准

- `wiki-sync.md` 存在。
- wiki 更新与 work item 证据一致。
- `00-index.md` 已列出所有 current 知识项和最后同步时间。
- 目标 wiki 文件达到最低完整度；未达到的部分已标注 `未确认` 并进入风险 / 缺口记录。
- `wiki-update-plan` 与实际更新文件一致；`wiki-quality.mjs --mode close` 无 `FAIL`。
- `wiki_sync` gate 可以被批准或有明确阻断原因。
