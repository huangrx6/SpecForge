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
| NIST AI RMF / human oversight | https://www.nist.gov/itl/ai-risk-management-framework | AI 工作流需要人类监督、风险识别、记录和治理，而不是无条件自动推进 | `decision-brief`、manual-confirmed、risk acceptance、evidence strength 让人工确认可追溯 |
| Runbook / handoff practice | https://sre.google/sre-book/table-of-contents/ | 交接材料要突出当前状态、下一步、owner、触发条件和恢复动作 | `workflow-package` / `handoff-summary` / HTML Action Board 先给行动摘要，再给证据 |

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

Traceability 由 workflow schema 的 `traceability_policy` 控制：`off` 不提示，`advisory` 只进入 warnings / health / report，`strict` 会在 `enforced_gates` 指定的 gate preflight 中升级为 `FAIL`。默认策略是复杂或高风险 workflow 在 `code_review`、`verification` 严格，小型 `lite` 保持 advisory，`discovery` 关闭实现链路追溯。

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

## 推荐 AI 工具集

| 工具 | 最适合阶段 | 使用方式 | SpecForge 约束 |
|---|---|---|---|
| Codex | 代码实现、代码审查、脚本化验证、跨文件重构 | 先读 stage contract、tasks、traceability，再改代码和跑验证 | 不越过 gate；发现规格缺口先回写 artifact |
| Trae / SOLO | 多页面、多模块或重复性前端开发 | 按 tasks wave 拆窗口并行推进，统一回收 diff 和验证结果 | 每个窗口必须有文件边界、验证命令和回滚点 |
| Pencil | UI design 正式原型 | 生成 / 修改 `.pen`，导出截图作为证据 | HTML / Figma / 截图只能做参考输入，不能替代 Pencil 正式证据 |
| Playwright | 浏览器端 verification | 自动点击、输入、提交、截图和响应式检查 | 有浏览器流程时优先用真实操作证据，不只看组件静态渲染 |
| 官方文档 / Web research | 新技术、外部接口、规范不确定时 | 优先官方文档、标准、源码和一手材料 | 搜索结论必须转译到 technical design / research，不作为口头记忆 |
| Mock / fixture / fake provider | 外部环境不可访问时 | 证明协议、状态和失败态 | 只能标记 `mocked`，不能冒充真实环境 proven |
| SpecForge scripts | 自动推进、审查、接力、关闭 | audit、health、contract、preflight、package、doctor | 脚本输出是流程证据入口，不替代人工确认或真实验证 |

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

当需要判断人工确认是否足以支撑继续推进时，运行 `node .specforge/core/scripts/decision-quality.mjs` 或 `specforge decision-quality --dir .`。它检查 open decision、`delegated_default` 的默认理由 / 风险 / 回退触发条件，以及 `manual-confirmed` / `deferred` 的 owner、影响和重新验证触发条件。所有 gate preflight 在 `APPROVED` 前都会自动执行同类检查。

日常推进建议先运行 `node .specforge/core/scripts/workflow-audit.mjs` 或 `specforge audit --dir .`。它把 Action Summary、route、blocker、open decision、quality warning、traceability 和推荐命令合并成一页，适合作为人工确认、跨 Agent 接力和自动推进前的第一入口。没有 active work item 时，它只推荐 status / create-work / doctor 这类可执行入口，不推荐阶段命令。

需要快速判断当前流程是否可继续时，运行 `node .specforge/core/scripts/workflow-health.mjs` 或 `specforge health --dir .`。它给出 health score、level、维度扣分和 Top priorities；除 blocker、decision、traceability、gate 外，也会把 `quality-suite.mjs` 中 source、implementation、evidence、wiki、closure 等阶段感知质量缺口纳入健康分。health 用来排序下一步，不替代 gate evidence。

需要一条命令判断“当前阶段质量是否够继续”时，运行 `node .specforge/core/scripts/quality-suite.mjs` 或 `specforge quality-suite --dir .`。它按 ready artifact 自动启用相关检查：早期只看可读性、决策和追踪；进入设计后看来源；进入实现后看 diff 账本；进入验证、wiki、关闭后再看证据、知识沉淀和 release / rollback。先看总表，再按 Recommended Commands 下钻专项脚本。

需要判断 artifact 是否“人能读完”时，运行 `node .specforge/core/scripts/artifact-quality.mjs` 或 `specforge quality --dir .`。它检查已存在 artifact 的摘要 section、摘要长度、模板占位和长文档提示；结果也会进入 `quality_warnings`，帮助 audit / health / report 提前暴露阅读负担。

需要判断研究和技术方案是否“有可信来源”时，运行 `node .specforge/core/scripts/source-quality.mjs` 或 `specforge source-quality --dir .`。它检查 `research.md` 的来源池、来源日期 / 版本、primary / secondary / anecdotal / stale / unknown 分级，以及 `technical-design.md` 的当前版本事实和官方基准来源。缺来源或缺权威度是 FAIL，弱来源或缺日期是 WARN；`spec_review` 的 gate preflight 会自动执行同类检查。

需要判断 wiki 是否“下次能复用”时，运行 `node .specforge/core/scripts/wiki-quality.mjs` 或 `specforge wiki-quality --dir .`。它检查 `.specforge/wiki/` 的 frontmatter、`00-index.md` 引用、重复 current 项、日期 / 版本化命名、模板占位和导航证据；`wiki_sync` 的 gate preflight 会自动执行同类检查。结构断链是 FAIL，内容薄、占位偏多是 WARN，避免把知识沉淀变成又一份厚模板。

需要判断实现证据是否“能被 code review 接住”时，运行 `node .specforge/core/scripts/implementation-quality.mjs` 或 `specforge implementation-quality --dir .`。它对账 `tasks.md`、implementation report、changed-files、排除清单和真实 `git diff/status`，防止完成任务缺证据、真实 diff 未登记、changed-files 无任务或验证方式。`code_review` 的 gate preflight 会自动执行同类检查。

需要判断关闭材料是否“能支撑归档”时，运行 `node .specforge/core/scripts/closure-quality.mjs` 或 `specforge closure-quality --dir .`。它检查 release / rollback 是否覆盖发布结论、影响范围、发布前检查、证据引用、观察点、回滚触发条件、风险来源和补偿措施；它不替代 doctor 或 archive dry-run，只提前暴露关闭材料断链。

准备批准 gate 前运行 `node .specforge/core/scripts/gate-preflight.mjs <gate> APPROVED --evidence <path>` 或 `specforge gate-preflight --dir . <gate> APPROVED --evidence <path>`。它按 policy-as-code 的方式把证据文件、artifact ready 状态、P0 / P1 blocker、open decision、traceability 和 health 汇总为 PASS / WARN / FAIL；预检不改写 gate，`FAIL` 不能继续批准，`WARN` 必须在 evidence 中说明接受或处理结果。预检通过后优先用 `specforge gate --dir . <gate> APPROVED --evidence <path>` 更新 gate。

准备批准 verification gate 前，先运行 `node .specforge/core/scripts/evidence-summary.mjs` 或 `specforge evidence --dir .`。它解析 `05-verification/report.md#3.2 证据强度分级` 和 `#12 人工确认与外部补证`，汇总 proven / mocked / manual-confirmed / deferred / missing，并指出缺少证据、缺人工确认或缺 owner / 重新验证触发条件的问题。`gate-preflight verification APPROVED` 会自动执行同类检查；`missing` 或无可解析证据不能批准。

想先看全流程怎么走时，运行 `node .specforge/core/scripts/stage-contract.mjs --overview` 或 `specforge roadmap --dir .`。它把当前 workflow 的每个 artifact、状态、推荐工具、推荐命令、人工确认点和退出标准放在一张 roadmap 表里，适合给人看“后面每一步怎么配合”。

进入具体阶段前建议运行 `node .specforge/core/scripts/stage-contract.mjs` 或 `specforge contract --dir .`。它把当前 artifact 的目标、应读取内容、必须产出、人工确认点、must prove 和 exit standard 单独列出，避免 Agent 只读长模板却漏掉阶段完成标准。

交给他人审查、跨 Agent 接力或 close 前，运行 `node .specforge/core/scripts/workflow-package.mjs` 或 `specforge package --dir .`。它生成 `07-report/review-package.md`，并派生 `work-summary.html` 和 `handoff.md`，把健康度、阶段契约、人工决策、追踪缺口和下一步命令收束成一包。

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
- 可用 `node .specforge/core/scripts/artifact-quality.mjs` 检查 artifact 摘要、摘要长度、模板占位和长文档风险。
- 可用 `node .specforge/core/scripts/source-quality.mjs` 检查 research 来源质量、technical design 版本事实和官方基准来源。
- 可用 `node .specforge/core/scripts/wiki-quality.mjs` 检查 wiki frontmatter、索引引用、重复 current、日期 / 版本化命名、模板占位和导航证据。
- 可用 `node .specforge/core/scripts/implementation-quality.mjs` 检查 tasks、implementation report、changed-files 和真实 git diff/status 对账。
- 可用 `node .specforge/core/scripts/closure-quality.mjs` 检查 release、rollback、观察点、风险来源和补偿措施是否闭环。
- HTML report 的首屏必须优先呈现 Action Board：当前状态、下一步理由、最高优先级、可复制命令和阅读顺序。Artifact excerpt、traceability 表和长矩阵放在下方，避免读者先被长文档淹没。
- 可用 `node .specforge/core/scripts/handoff-summary.mjs --output <work-item>/07-report/handoff.md` 生成接力摘要，用于跨 Agent、跨线程或人工复盘。
- Handoff summary 和 review package 必须先呈现 Action Summary：状态、下一步、健康度、open decisions、blockers、trace gaps、policy、下一组命令和阅读顺序；证据、图谱、artifact 摘录放在后面。
- 可用 `node .specforge/core/scripts/workflow-package.mjs` 一键生成 review package、HTML report 和 handoff，适合审查、汇报、接力和关闭前复盘。
- 可用 `node .specforge/core/scripts/decision-brief.mjs` 生成面向人工审批 / 澄清 / 授权默认的决策包。
- 可用 `node .specforge/core/scripts/decision-quality.mjs` 检查人工确认、授权默认和风险接受记录是否具备 owner、影响、理由和重新验证触发条件。
- 可用 `node .specforge/core/scripts/evidence-summary.mjs` 检查 verification report 中的证据强度分级、人工确认和外部补证记录。
- 可用 `node .specforge/core/scripts/traceability-summary.mjs` 检查 source item、tasks、test cases 之间的追溯缺口；先作为提示使用，稳定后再考虑升级为 gate。
- 可用 `node .specforge/core/scripts/workflow-audit.mjs` 生成一页流程审计摘要，先判断是否 BLOCKED / NEEDS_DECISION / NEEDS_ATTENTION，再进入具体阶段。
- 可用 `node .specforge/core/scripts/workflow-health.mjs` 生成健康分、`quality_suite` 维度和 Top priorities，帮助人和 Agent 快速决定先修 blocker、先问人、先补 traceability，还是先下钻 source / implementation / evidence / wiki / closure 质量缺口。
- 可用 `node .specforge/core/scripts/stage-contract.mjs --overview` 或 `specforge roadmap --dir .` 查看当前 workflow 每个 artifact 的状态、阶段契约、工具搭配、命令、人工确认点和退出标准；也可用 `--artifact tasks` 聚焦单阶段。
- 可用 `node .specforge/core/scripts/gate-preflight.mjs <gate> APPROVED --evidence <path>` 在真正更新 gate 前做只读预检，适合本地审批、CI advisory check 和发布前复核。

## 持续演进

- 每个 archived work item 至少沉淀一个可复用事实，或明确 `N/A - 无长期事实`。
- 如果 verification 多次依赖 `manual-confirmed` / `deferred`，应回到 workflow 或 template 优化，而不是把风险留给下一次。
- 如果用户连续两次表示“文档太长 / 看不下去”，优先缩短模板和输出预算，再考虑增加 HTML 派生报告。
