# Stage Playbook

本文件回答：SpecForge 每一步如何搭配 AI、脚本、人工确认和证据，让流程既可控，也不把人埋进长文档。

## 设计来源

| 来源 | 吸收原则 | SpecForge 落地 |
|---|---|---|
| Spec-driven development / Kiro Specs | spec、design、tasks 先于实现；小任务可走轻量路径 | workflow 分流，`lite` 不套完整 feature 流程 |
| Spec Kit analyze / checklist | tasks 前做跨 artifact 一致性和覆盖分析 | `workflow-audit`、`traceability-summary` 作为实现前的一页审计 |
| Diátaxis / progressive disclosure | 文档按用户任务组织，先给可行动入口，再给背景解释 | 一页摘要、audit、HTML report 是阅读层；Markdown 保持 source of truth |
| Requirements traceability / NASA SE | 需求、设计、实现、测试需要双向可追溯 | `REQ/AC/NFR/GAP/UI/TD -> Txxx -> TC/PW` 追踪链 |
| OPA policy-as-code | 把流程规则声明成可检查数据 | workflow schema 定义 artifact DAG 和 `quality_policy` |
| GitHub Actions / Argo DAG | 显式依赖、可视化状态和 gate | artifact graph、ready / blocked / done、gate evidence |
| SLSA / NIST SSDF / AI RMF | provenance、验证证据、人类监督和风险接受 | evidence strength、decision checkpoints、manual-confirmed 记录 |
| Google Engineering Practices | review 先讲缺陷、风险和可验证建议 | spec review / code review 以 findings 和 traceability 为核心 |

## 工作方式

- **先短后长**：每个阶段先写一页摘要，再写矩阵和证据。
- **先问关键问题**：高影响未知只问一个最重要的问题；低风险默认必须写回退点。
- **先声明证据强度**：本地、mock、CI、真实环境、人工确认不能混写。
- **先看脚本状态**：`doctor`、`instructions`、`decision-checkpoints`、`artifact-graph-status` 比聊天记忆优先。
- **先保留 source of truth**：Markdown artifact 是主事实源；HTML / 图表 / dashboard 是阅读层。

## 阶段操作卡

| 阶段 | 目标 | AI / 脚本组合 | 人工确认点 | 输出契约 | 退出标准 |
|---|---|---|---|---|---|
| Intake | 判断 work item 类型、workflow、scope、components | `status.mjs`、`sf-intake`、必要时 `codebase-index.mjs` | workflow、拆分、PRD 是否需要、无法安全默认的 scope | `brief.md` 一页摘要、workflow 理由、AI 工具链计划 | active item 唯一，下一步 route 清楚 |
| Brainstorm | 把模糊取舍收敛成一个可执行方向 | `sf-brainstorm`、外部 research / design skill 仅作输入 | MVP、UI 方向、技术路线、依赖、验收口径 | 问题地图、方案对比、用户确认记录 | 无关键 `[NEEDS ... DECISION]`，或明确暂停 |
| PRD | 说明为什么做、给谁做、MVP 和成功指标 | `sf-prd`、产品资料、历史需求 | MVP、非目标、成功指标 | `prd.md`，可直接转译 requirements | `Decision Status: approved-for-requirements` |
| Research / Gap | 证明事实、复现问题或形成 ADR 候选 | 官方资料、源码、日志、PoC、`sf-discovery` | 是否继续、拆分、放弃或降级 | `research.md` / `gap-report.md`，来源质量分级 | 结论、证据和后续 workflow 明确 |
| Requirements | 转成可测试行为和边界 | `sf-requirements`、PRD / brief / research / wiki | 目标用户、验收、冲突需求 | `REQ-*`、`AC-*`、NFR、非目标、影响面 flags | 每条 MUST 可测试，无未决核心冲突 |
| UI Design | 明确页面、状态、交互、视觉和原型证据 | Pencil、`sf-ui-design`、设计标准 | 视觉方向、关键流程、原型交付方式 | 一页摘要、状态矩阵、Pencil 证据、验证策略 | UI 方向确认，空 / 错 / 权限 / 边界态覆盖 |
| Technical Design | 给实现者最小充分工程设计 | `sf-tech-design`、profiles、官方文档、wiki | 新技术、依赖、工具链、核心决策 review | 一页摘要、影响面、ADR、契约、风险、验证策略 | 无关键 unknown，确认状态清楚 |
| Tasks | 拆成可执行、可并行、可验证的任务图 | `sf-tasking`、artifact graph、wiki | 是否扩大 scope、是否拆 follow-up | 一页摘要、来源覆盖、任务波次、文件边界、验证任务 | 每个来源项有实现和验证承接 |
| Spec Review | 审查规格是否足以进入实现 | `sf-spec-review`、traceability matrix | P0/P1 修复、低风险残余是否接受 | findings、断链、gate 证据 | Gate Review 无 P0/P1，或 REQUEST_CHANGES 有 return path |
| Implementation | 按任务图实现和快速验证 | Codex / Trae / SOLO、测试命令、`git diff` | 发现规格缺口、越界、无法验证 | code、changed-files、implementation report | diff、tasks、report、验证结果一致 |
| Code Review | 找缺陷、偏离、安全和缺测 | `sf-code-review`、真实 diff、测试证据 | 是否修复、是否退回 spec、是否接受低风险残余 | findings、任务图对账、验证提示 | 无阻断缺陷，gate evidence 完整 |
| Verification | 用证据证明风险已覆盖 | `sf-verify`、CI、Playwright、logs、mock / real env | 外部补证、跳过项、风险接受 | test-cases、report、证据强度、manual-confirmed 记录 | 证据强度覆盖风险强度，gate 可解释 |
| Wiki Sync | 把长期事实回写知识库 | `sf-wiki`、wiki index、source artifacts | 哪些事实长期有效，哪些 N/A | wiki files、wiki-sync evidence | current wiki 唯一，不重复、不塞临时噪音 |
| Close | 发布、回滚、报告和归档 | `sf-close`、doctor、report renderer、archive dry-run | 发布判断、回滚、外部观察 | release、rollback、HTML report、archive | doctor 通过，残余风险有 owner 和触发条件 |

## 推荐命令节奏

```bash
node .specforge/core/scripts/workflow-audit.mjs
node .specforge/core/scripts/workflow-health.mjs
node .specforge/core/scripts/stage-contract.mjs
node .specforge/core/scripts/workflow-package.mjs
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/instructions.mjs
node .specforge/core/scripts/decision-checkpoints.mjs
node .specforge/core/scripts/decision-brief.mjs
node .specforge/core/scripts/traceability-summary.mjs
node .specforge/core/scripts/artifact-graph-status.mjs
```

进入实现前补看：

```bash
node .specforge/core/scripts/instructions.mjs apply
git status --short --untracked-files=all
```

关闭前补看：

```bash
node .specforge/core/scripts/render-work-report.mjs
node .specforge/core/scripts/handoff-summary.mjs --output <work-item>/07-report/handoff.md
node .specforge/core/scripts/workflow-package.mjs
node .specforge/core/scripts/doctor.mjs
```

## 轻重分流

| Workflow | 读者主要关心 | 保留内容 | 压缩内容 |
|---|---|---|---|
| `lite` | 改什么、影响什么、怎么验证 | brief、requirements、tasks、verification | PRD、UI / technical design 默认不生成 |
| `bugfix` / `issue` | 复现、根因、修复、回归 | gap report、tasks、verification、rollback | 产品背景和完整 PRD |
| `feature` / `standard` | 行为、体验、技术、验证闭环 | requirements、适用 UI / technical design、tasks、review | 重复背景和泛化最佳实践 |
| `refactor` | 行为不变、边界、回归 | technical design、tasks、spec review、verification | 业务 PRD 和无关 UI |
| `discovery` | 证据、结论、后续路线 | research、source quality、ADR、wiki | implementation / review / verification 链路 |

## 人工确认策略

- 高影响未知：写 `[NEEDS ... DECISION]`，用 `decision-checkpoints.mjs` 汇总后一次只问最关键一个。
- 低风险默认：写 `delegated_default`、默认理由、回退方式和重新验证触发条件。
- 外部待补证：写 `manual-confirmed` / `deferred`、owner、影响、已有证据和补证触发条件。
- Gate 争议：优先给 return path；只有低风险残余且记录完整时才允许人工接受。
- 向用户请求确认时，优先生成 `decision-brief.mjs`：它必须带上当前阶段目标、待决 marker、可接受回复、风险接受候选和补证触发条件，避免只问“确认吗”。

## 产物读法

1. 先读一页摘要。
2. 再看 `workflow-audit.mjs` 的 audit status、route 和 recommended commands。
3. 再看 `stage-contract.mjs` 的当前阶段 goal / must prove / exit standard。
4. 再看 `Decision checkpoints` 和 `Quality warnings`。
5. 再看 traceability / task graph / verification evidence。
6. 最后才读附录、长表和派生 HTML。
7. 交给他人或新 Agent 前，生成 `handoff.md`，让接手者先看一页状态、下一步、阻断和证据入口。

## 后续雕琢路线

| 优化方向 | 目标体验 | 技术落点 | 约束 |
|---|---|---|---|
| Audit-first | 用户和 Agent 先看一页就知道卡在哪里 | `workflow-audit.mjs` 汇总 route、blocker、decision、traceability、推荐命令 | audit 只提示，不私自推进 gate |
| Health score | 用一个总览分数暴露当前流程是否能继续 | `workflow-health.mjs` 汇总 blocker、decision、quality、traceability、gate | score 只做排序和扫读，不替代 gate evidence |
| Contract-first | 当前阶段先看输入、输出、人工确认和退出标准 | `stage-contract.mjs` 从 artifact id 输出阶段契约 | contract 是执行约束，不替代 artifact 证据 |
| Trace-first | tasks 前发现需求、设计、验证断链 | `traceability-summary.mjs` 和 HTML report Traceability section | 稳定前先 P2/P3 warning，不默认阻断低风险需求 |
| Human-in-the-loop | 高影响未知灵活找人工确认，低风险可授权默认 | `decision-checkpoints.mjs`、`[NEEDS ...]`、`manual-confirmed`、`delegated_default` | 必须记录 owner、影响、回退和补证触发条件 |
| Decision package | 让人工确认有上下文、有选项、有可复制回复格式 | `decision-brief.mjs` 汇总 top decision、contract、traceability、blockers、risk candidates | 人工回复必须能写回 artifact 或 gate evidence |
| Lightweight artifacts | 人能读完，Agent 能接手 | 一页摘要、artifact summary、handoff、HTML reading layer | Markdown 仍是版本管理事实源，HTML 不能成为唯一证据 |
| Review package | 审查、接力、关闭前一键生成可交付材料 | `workflow-package.mjs` 输出 review-package、handoff、HTML report | 派生包引用 source artifacts，不替代 source of truth |
| Stage quality policy | 不同 workflow 有不同质量条 | schema `quality_policy.section_checks`、diagnostics warnings | 不把 `lite` 套成完整 `feature` 流程 |
| Evidence grading | gate 不是形式，证据强度和风险强度匹配 | verification evidence strength、mock / proven / manual-confirmed / deferred | `missing` 不能批准 gate；弱证据必须说明边界 |
| Knowledge compaction | 关闭后下次不用重读全仓 | wiki sync、archive、handoff summary、长期事实索引 | 只沉淀未来会复用的信息，不写过程噪音 |
| Reviewability | code review 和 spec review 小而可审 | tasks wave、changed-files、traceability、findings-first | 大 diff 要拆任务或说明不可拆原因 |
