# AI 工具集与协作标准

本标准回答：在 SpecForge 流程中，不同阶段应该使用什么 AI 工具、产出什么证据、什么时候需要人工确认。

## 核心原则

- **阶段清楚**：工具只服务当前阶段目标，不用一个工具包办需求、设计、实现、验证和归档。
- **人机共管**：AI 可以提出建议、生成草稿、执行验证；关键范围、风险接受、真实环境补证和上线判断必须由人工确认。
- **证据回流**：所有工具输出都要归一化到 SpecForge artifact、verification evidence 或 wiki，不把外部工具的临时输出当作最终事实。
- **轻量优先**：默认输出可读摘要、决策表和证据索引；只有高风险、跨域或审计需要时才展开完整长文档。

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

