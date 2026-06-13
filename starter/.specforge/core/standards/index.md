# 标准索引

`standards/` 是 SpecForge 的唯一规范层。这里不再区分“内部规则 / 外部规范”，每个领域只保留一份当前可执行的标准，并在标准中吸收权威来源。

## 目录原则

- 少文件：优先合并成稳定入口，避免为了一个小检查项新增目录。
- 一事一责：流程、阶段打法、产品、设计、工程、代码智能、Wiki 分开。
- 可执行：每条标准都要能落到 artifact、gate、tasks 或 verification evidence。
- 可偏离：项目事实优先于通用标准，但偏离必须写清理由和验证补偿。
- 按需加载：Agent 只读当前阶段需要的标准，不全量加载。

## 加载地图

| 标准 | 什么时候读 | 主要回答 |
|---|---|---|
| `workflow.md` | intake、路由、gate、scope、上下文控制、关闭归档 | 当前到哪一步、能不能前进、边界在哪里 |
| `operating-model.md` | 框架级改动、自动推进策略、人工确认、证据强度、上下文预算、复盘沉淀 | SpecForge 如何作为可审计、可演进的 AI 研发工作流运行 |
| `stage-playbook.md` | 自动推进、handoff、长流程复盘、用户问“每一步怎么配合” | 每一步用什么 AI / 脚本 / 人工确认 / 证据契约 |
| `product.md` | PRD、requirements、research、功能澄清、验收标准 | 用户到底要什么，哪些能力进入 MVP，如何验收 |
| `design.md` | UI / UX、页面、交互、视觉方向、原型证据 | 用户看见什么，怎么操作，状态是否完整；具体设计语言读 `core/skills/ui-ux/design-system` |
| `pc-ui-design-spec.md` | PC 端业务系统、运营后台、管理控制台、数据表格工具，或用户明确提供该规范 | 具体颜色、字号、行高、间距、组件尺寸和 HTML/CSS token |
| `engineering.md` | technical design、implementation、review、verification | 工程上怎么做才可靠、安全、可维护、可验证 |
| `ai-toolkit.md` | intake、自动推进、人工确认、verification、wiki sync、AI 工具链沉淀 | 不同阶段用什么 AI 工具，证据强度如何分级，什么时候需要人工确认 |
| `code-intelligence.md` | 存量项目、老项目、大型代码库理解、项目画像 | 该用哪个 provider，什么时候暂停，如何把代码事实归一到 wiki |
| `playwright.md` | verification、UI 自动化、浏览器流程、截图 / trace / console / network 证据 | 浏览器证据如何真实执行、脱敏归档和可复现 |
| `wiki.md` | wiki sync、close、长期知识回写 | 哪些事实要沉淀，写到哪，何时更新 |

## 阶段到标准

| 阶段 / artifact | 必读标准 |
|---|---|
| intake / brief | `workflow.md`、`operating-model.md`、`stage-playbook.md`、`product.md`、`ai-toolkit.md` |
| prd | `product.md`、`workflow.md`、`operating-model.md`、`stage-playbook.md`、`ai-toolkit.md` |
| research / gap_report | `product.md`、`engineering.md`、`workflow.md`、`stage-playbook.md` |
| steering / 存量项目画像 | `code-intelligence.md`、`wiki.md`、`workflow.md`、`operating-model.md` |
| requirements | `product.md`、`workflow.md`、`stage-playbook.md`、`ai-toolkit.md` |
| ui_design | `design.md`、`product.md`、`workflow.md`、`stage-playbook.md`、`ai-toolkit.md`、`core/skills/ui-ux/design-system`；PC 业务系统场景加读 `pc-ui-design-spec.md` |
| technical_design | `engineering.md`、`workflow.md`、`stage-playbook.md`、`ai-toolkit.md` |
| tasks | `workflow.md`、`engineering.md`、`stage-playbook.md`、`ai-toolkit.md` |
| spec_review | `workflow.md`、`stage-playbook.md`、`product.md`、`design.md`、`engineering.md` |
| implementation | `engineering.md`、`workflow.md`、`stage-playbook.md` |
| code_review | `engineering.md`、`workflow.md`、`stage-playbook.md` |
| verification | `engineering.md`、`playwright.md`、`workflow.md`、`operating-model.md`、`stage-playbook.md`、`ai-toolkit.md` |
| wiki_sync / closure | `wiki.md`、`workflow.md`、`operating-model.md`、`stage-playbook.md`、`ai-toolkit.md` |

## 领域主基准与官方入口

AI 后续先读本目录的本地标准；需要细则、版本敏感事实或用户要求来源时，再打开官方入口查当前原文。

| 领域 | 本地入口 | 主基准 | 官方入口 |
|---|---|---|---|
| Code review | `engineering.md` | Google Engineering Practices | https://google.github.io/eng-practices/review/ |
| REST API | `engineering.md` | Microsoft REST API Guidelines | https://github.com/microsoft/api-guidelines |
| Security | `engineering.md` | OWASP ASVS | https://owasp.org/www-project-application-security-verification-standard/ |
| Delivery / Reliability | `engineering.md` | AWS Well-Architected Framework | https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html |
| Observability | `engineering.md` | OpenTelemetry Semantic Conventions | https://opentelemetry.io/docs/specs/semconv/ |
| Code intelligence | `code-intelligence.md` | SCIP / MCP graph indexing patterns | https://github.com/sourcegraph/scip |

这些主基准已经吸收到对应标准里；不要再新增平行的“规范合集”目录。
