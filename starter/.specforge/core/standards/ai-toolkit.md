# AI 工具集与协作标准

本标准回答：在 SpecForge 流程中，不同阶段应该使用什么 AI 工具、产出什么证据、什么时候需要人工确认。

## 外部参考与吸收原则

| 来源 | 入口 | 可吸收原则 | SpecForge 落地 |
|---|---|---|---|
| GitHub Spec Kit / Spec-Driven Development | https://github.com/github/spec-kit | spec 是 source of truth，任务执行前先有 constitution / spec / plan / tasks，implementation 要按依赖和并行标记推进 | artifact graph 保持 source-of-truth；tasks 必须声明依赖、可并行边界和验证任务 |
| Kiro Specs | https://kiro.dev/docs/specs/ | 复杂功能走 requirements -> design -> tasks；清楚小任务可用 Quick Plan；steering files 维护项目长期上下文 | `lite` / `feature` / `standard` 分流；wiki / steering 作为存量项目上下文入口 |
| GitHub Copilot custom instructions / coding agent docs | https://docs.github.com/en/copilot | repository instructions、path-specific instructions、plan、test、review diff 是 agentic coding 的稳定器 | `.specforge/AGENTS.md` 和 stage skill 明确按阶段加载标准、运行命令和验证 |
| Claude Code workflows / memory / subagents | https://docs.anthropic.com/en/docs/claude-code | 先探索代码库、计划、再实现；长期记忆是上下文而不是硬性配置；复杂探索可与主实现分离 | `sf-steering` / wiki 先给 bounded context；人工 gate 和 hooks 才是硬约束 |
| RFC 2119 / Gherkin / OpenAPI / C4 | https://www.rfc-editor.org/rfc/rfc2119 / https://cucumber.io/docs/gherkin/ / https://spec.openapis.org/oas/latest.html / https://c4model.com/ | 需求关键词、Given/When/Then、API 契约和架构图都要结构化、可追溯、可检查 | requirements、technical design、verification 必须保留可测试语言、契约和追溯矩阵 |
| OPA / GitHub Actions / Argo DAG / SLSA | https://www.openpolicyagent.org/docs / https://docs.github.com/actions / https://argo-workflows.readthedocs.io / https://slsa.dev/spec | policy-as-code、显式依赖图、DAG 执行和 provenance 能减少隐性流程判断 | workflow schema 承载 artifact DAG 和 `quality_policy`；诊断脚本按 schema 输出质量提醒 |

## 核心原则

- **阶段清楚**：工具只服务当前阶段目标，不用一个工具包办需求、设计、实现、验证和归档。
- **人机共管**：AI 可以提出建议、生成草稿、执行验证；关键范围、风险接受、真实环境补证和上线判断必须由人工确认。
- **证据回流**：所有工具输出都要归一化到 SpecForge artifact、verification evidence 或 wiki，不把外部工具的临时输出当作最终事实。
- **轻量优先**：默认输出可读摘要、决策表和证据索引；只有高风险、跨域或审计需要时才展开完整长文档。
- **单一事实源**：Markdown artifact 是可版本管理事实源；代码、测试、HTML 报告和 wiki 必须能追溯回对应 artifact。

## 工作流选择

| 需求特征 | 推荐 workflow / 模式 | 产物策略 | 人工确认策略 |
|---|---|---|---|
| 小改、单字段、单页面文案、明确 bug | `lite` / Quick Plan 风格 | brief + requirements + tasks；合并或省略低价值大表 | 只确认范围、风险和验证方式 |
| 业务功能、AI 能力、跨前后端、外部集成 | `feature` / `standard` | PRD 可选；requirements、technical design、tasks 必须有追溯 | MVP、技术路线、依赖和验证口径必须确认 |
| 架构、数据、安全、权限、迁移、生产风险 | `standard` / `refactor` / `discovery` | technical design、risk、rollback、verification 详写 | 风险接受、回滚和真实环境补证必须确认 |
| 方向不清、依赖未知、外部资料不确定 | brainstorm / discovery | 先产出问题地图、研究证据、ADR 候选 | 每次只问一个会改变方向的问题 |

## 阶段质量条

每个阶段结束前都必须回答三件事：**下一阶段能否直接开工、用户是否读得动、风险是否有证据承接**。

| 阶段 | 必须产出 | 不应产出 | 完成前自检 |
|---|---|---|---|
| Intake | workflow、scope、components flags、AI 工具链计划、下一步路由 | 完整方案、代码实现 | 是否过度流程化；是否需要 brainstorm / PRD / research |
| Brainstorm | 问题地图、候选方案、用户确认、延后项 | 假确认、无差异选项 | 是否还有高影响 `[NEEDS ... DECISION]` |
| PRD | 问题、目标用户、MVP、成功指标、验收种子 | 最终 REQ、接口、文件路径 | 是否足够进入 requirements；是否能一页看懂 |
| Requirements | `REQ-*`、`AC-*`、NFR、非目标、行为覆盖 | 技术方案、任务拆解 | 每条 MUST 是否可测试；冲突是否已处理 |
| UI Design | 页面、状态、角色、交互、原型证据 | 后端实现细节 | 状态矩阵是否覆盖空 / 错 / 权限 / 边界 |
| Technical Design | 影响面、读取计划、选型、契约、风险、验证策略 | UI 视觉细节、无根据依赖 | 设计是否最小充分；新增依赖是否确认 |
| Tasks | 来源审计、依赖图、并行边界、验证任务、回滚 | 宽泛待办、无文件边界任务 | 实现者是否不用重新猜范围 |
| Implementation | 代码、测试、实现报告、changed files | 未批准的范围扩张 | diff 是否完全回到 tasks 和 spec |
| Code Review | 缺陷、偏离、风险、缺测项 | 风格化总结优先 | findings 是否可定位、可修复、可验证 |
| Verification | test cases、证据分级、report、CI / local 结果 | 无证据批准 | 证据强度是否覆盖风险强度 |
| Wiki / Close | 长期事实、release、rollback、archive | 重复 wiki、临时过程噪音 | 是否只沉淀未来会复用的信息 |

`status` / `instructions` 可以输出非阻断 `quality_warnings`，用于提示已存在 artifact 缺少阶段质量条。它不是 gate，不替代人工判断；只有 P0 / P1 风险、缺 gate evidence、未确认关键决策等才进入 blocker。

`quality_warnings` 必须来自当前 workflow schema 的 `quality_policy.section_checks`。不同 workflow 的质量条不同：`feature` / `standard` 可以要求完整 requirements、UI、technical design、spec review 和 verification 证据；`lite` 只保留轻量需求、任务图和证据闭环；`bugfix` / `issue` 重点检查 gap report 的复现、根因和规格缺口；`discovery` 重点检查来源质量和 ADR 摘要。不要把所有 workflow 都套同一张大表。

## 工具集地图

| 阶段 | 推荐工具 / 能力 | 主要用途 | 归一化产物 |
|---|---|---|---|
| Intake / 澄清 | `sf-intake`、`sf-brainstorm` | 判断需求类型、范围、风险、是否需要 PRD / UI / 技术设计 | `00-intake/brief.md`、`brainstorm.md` |
| 产品与验收 | `sf-prd`、`sf-requirements` | 明确目标用户、MVP、验收标准、异常场景 | `prd.md`、`requirements.md` |
| UI / 交互 | Pencil、`sf-ui-design` | 页面地图、状态矩阵、原型、截图证据 | `ui-design.md`、`.pen`、导出 PNG |
| 技术方案 | `sf-tech-design`、官方文档检索 | 架构、API、数据、权限、安全、配置、验证策略 | `technical-design.md` |
| 任务拆解 | `sf-tasking` | 把规格拆成可实现、可验证、可回滚任务 | `tasks.md` |
| 代码实现 | Codex、Trae、SOLO 模式 | 代码实现、重构、测试补充、并行推进 | 业务代码、`implementation report` |
| 联调模拟 | Mock API、fixture、fake provider | 无真实环境时验证契约、边界和失败态 | `05-verification/evidence/` |
| 浏览器验证 | Playwright | 点击、输入、提交、路由、响应式和失败提示验证 | `test-cases.md`、`verification report`、截图 / trace |
| 审查 | `sf-spec-review`、`sf-code-review` | 聚焦越界、缺陷、安全、测试缺口和规格偏离 | review evidence |
| 验收 | `sf-verify` | 归集本地、mock、CI、真实环境和人工确认结果 | `verification report` |
| 知识沉淀 | `sf-wiki`、`sf-close`、Wiki Sync | 长期事实、接口契约、配置、风险、回滚沉淀 | `.specforge/wiki/*.md`、release / rollback |

## 人工确认点

以下场景必须让人工确认后再继续：

| 场景 | AI 应提供的信息 | 可接受的人类决策 |
|---|---|---|
| MVP / 范围取舍不清 | 方案对比、推荐项、影响范围 | 选择方案、拆分、延后、授权默认 |
| UI 方向或体验路径未定 | 页面地图、状态矩阵、关键交互差异 | 选定方向、要求原型、声明无 UI 影响 |
| 新增依赖 / 技术路线 | 当前项目证据、备选方案、风险 | 采用、拒绝、沿用现有栈 |
| 外部真实环境不可访问 | 本地和 mock 证据、未覆盖风险、补证方式 | 接受外部待补证、要求继续联调、降级上线 |
| 高风险跳过项 | owner、影响、重新验证触发条件 | 接受跳过、要求补证、回退实现 |
| Gate `REQUEST_CHANGES` 争议 | 阻断项、return path、可选修复 | 修复、重开规格、人工接受低风险残余 |

自动推进、handoff 或 gate 前建议运行 `node .specforge/core/scripts/decision-checkpoints.mjs`。该脚本汇总当前 work item 中的 open `[NEEDS ...]` 标记、已确认标记和人工接受 / 外部补证候选，用于把“需要人拍板的点”从长文档里提出来。`specforge checkpoints --dir .` 是对外 CLI 入口。

当需要把确认点发给用户或负责人时，运行 `node .specforge/core/scripts/decision-brief.mjs` 或 `specforge decision-brief --dir .`。它把 top open decision、当前阶段契约、traceability、blocker、quality warning 和风险接受候选整理成一页，并给出可复制的回复格式。

日常推进建议先运行 `node .specforge/core/scripts/workflow-audit.mjs` 或 `specforge audit --dir .`。它把 route、blocker、open decision、quality warning、traceability 和推荐命令合并成一页，适合作为人工确认、跨 Agent 接力和自动推进前的第一入口。

需要快速判断当前流程是否可继续时，运行 `node .specforge/core/scripts/workflow-health.mjs` 或 `specforge health --dir .`。它给出 health score、level、维度扣分和 Top priorities，用来排序下一步，不替代 gate evidence。

进入具体阶段前建议运行 `node .specforge/core/scripts/stage-contract.mjs` 或 `specforge contract --dir .`。它把当前 artifact 的目标、应读取内容、必须产出、人工确认点、must prove 和 exit standard 单独列出，避免 Agent 只读长模板却漏掉阶段完成标准。

## 输出预算

| Work item 规模 | 对用户输出 | Artifact 内容 | 禁止事项 |
|---|---|---|---|
| 小型 | 5-10 行结论 + 风险 + 下一步 | 表格压缩，N/A 合并 | 为单字段小改生成长 PRD |
| 中型 | 摘要 + 关键矩阵 + 明确确认点 | 保留需求、设计、任务追溯 | 大段背景重复 |
| 大型 / 高风险 | 摘要 + 决策表 + 风险表 + 证据索引 | 完整矩阵、ADR、验证计划、回滚 | 隐藏跳过项或弱证据 |

当 artifact 超过用户正常可读范围时，顶部必须增加“一页摘要”：目标、已确认决策、最大风险、下一步、需要用户确认的唯一问题。

## 证据分级

Verification 报告必须区分证据强度：

| 等级 | 含义 | 能否支持 gate |
|---|---|---|
| `proven` | 本地命令、CI、Playwright、契约测试或真实日志直接证明 | 可支持 |
| `mocked` | Mock API / fake provider 证明协议、状态和失败态 | 可支持局部结论，不能替代真实外部系统 |
| `manual-confirmed` | 用户或负责人明确接受外部待补证 / 低风险跳过 | 可支持 gate，但必须记录 owner、影响和触发条件 |
| `deferred` | 已知缺口留到 follow-up 或真实环境 | 只能在低风险或用户明确接受时支持 gate |
| `missing` | 无证据、无确认、无补偿 | 不能支持 gate |

## 轻量产物规则

- 每个 artifact 顶部必须先给出 5-10 行以内的摘要、决策和下一步。
- 长表格只保留可执行字段；背景解释放到附录或 wiki。
- 重复模板项可以写 N/A，但必须说明为什么 N/A。
- 对用户输出时优先给“结论 + 风险 + 下一步”，完整表格留在 artifact。
- `lite` workflow 不生成 PRD / UI / technical design，除非风险或用户要求触发。

## HTML / 可视化产物

Markdown 仍是版本管理主格式；HTML / 可视化产物用于提升阅读和复盘效率。

可视化产物适用场景：

- 多角色流程、状态机、接口链路或 E2E 路径复杂。
- verification 矩阵过长，普通 Markdown 难以快速审查。
- 需要给非研发人员展示方案、风险或成果。

约束：

- HTML / 图表必须由 Markdown artifact 派生，不能成为唯一事实来源。
- HTML 产物应放在对应 work item 的 `evidence/`、`ui-mockup-export/` 或报告目录，并在 Markdown 中登记路径。
- 不把 token、cookie、密钥、个人隐私和生产敏感日志写入 HTML。
- 可用 `node .specforge/core/scripts/render-work-report.mjs` 生成 `07-report/work-summary.html`，用于快速浏览 artifact graph、gate、blocker、quality warning 和关键 artifact 摘要。
- 可用 `node .specforge/core/scripts/handoff-summary.mjs --output <work-item>/07-report/handoff.md` 生成接力摘要，用于跨 Agent、跨线程或人工复盘。
- 可用 `node .specforge/core/scripts/decision-brief.mjs` 生成面向人工审批 / 澄清 / 授权默认的决策包。
- 可用 `node .specforge/core/scripts/traceability-summary.mjs` 检查 source item、tasks、test cases 之间的追溯缺口；先作为提示使用，稳定后再考虑升级为 gate。
- 可用 `node .specforge/core/scripts/workflow-audit.mjs` 生成一页流程审计摘要，先判断是否 BLOCKED / NEEDS_DECISION / NEEDS_ATTENTION，再进入具体阶段。
- 可用 `node .specforge/core/scripts/workflow-health.mjs` 生成健康分和 Top priorities，帮助人和 Agent 快速决定先修 blocker、先问人、还是先补 traceability。
- 可用 `node .specforge/core/scripts/stage-contract.mjs --overview` 查看当前 workflow 每个 artifact 的阶段契约，或用 `--artifact tasks` 聚焦单阶段。

## 持续演进

- 每个 archived work item 至少沉淀一个可复用事实，或明确 `N/A - 无长期事实`。
- 如果 verification 多次依赖 `manual-confirmed` / `deferred`，应回到 workflow 或 template 优化，而不是把风险留给下一次。
- 如果用户连续两次表示“文档太长 / 看不下去”，优先缩短模板和输出预算，再考虑增加 HTML 派生报告。
