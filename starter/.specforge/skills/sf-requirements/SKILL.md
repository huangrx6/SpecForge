---
name: sf-requirements
description: 生成或更新 SpecForge 工作项的需求规格；用于活跃工作项的 ready artifact 为 requirements，或需要把产品需求文档 / 简报转成可测试行为、边界、用户故事、验收标准和影响面标记时。
---

# sf-requirements

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，必须先定位宿主项目根：项目根是“包含 `.specforge/` 目录的业务项目目录”，不是 `.specforge/` 目录本身。若当前目录是 `.specforge/` 或其任意子目录，先 `cd ..` 回到宿主项目根；若当前目录是 `frontend/`、`backend/` 等子目录，也先向上回到包含 `.specforge/` 的项目根。禁止从 `.specforge/` 内执行 `node .specforge/core/scripts/...`，否则会形成 `.specforge/.specforge/...` 的错误路径。

## 运行模式检测

1. 当前目录向上存在 `.specforge/` 且有 active work item：**Embedded 模式**，按 artifact graph 写入 `01-spec/requirements.md`。
2. 存在 `.specforge/` 但无 active work item：**Lightweight 模式**，可把用户提供的简报 / 产品需求文档草稿整理成需求规格草稿；需要落档时输出 `specforge-import-ready.md` 格式内容，或先路由 `sf-intake` 创建 work item。
3. 不存在 `.specforge/`：**Standalone 模式**，不要运行 `.specforge/...` 命令；输出 `specforge-import-ready.md` 格式内容，保留 SHALL 需求、AC、非目标、影响面建议和未决问题，后续由 `sf-intake` 导入。

`sf-requirements` 把简报（和可选产品需求文档）升级为可测试、可审查、可路由到后续设计阶段的需求规格。它不写界面方案、接口方案、数据库方案或实现任务。

## 必读

- `.specforge/core/skills/requirements/SKILL.md`：requirements 行为契约能力包入口，定义确认边界、转译规则、可测试性、追踪和下游 handoff。
- `.specforge/core/skills/requirements/references/output-contract.md`：输出 profile、必填 section 和 REQ / AC 表格契约。
- `.specforge/core/skills/requirements/references/behavior-contract.md`：确认边界、需求语言、可测试性、Given / When / Then、Source -> REQ -> AC -> downstream 追踪规则和 NFR 边界。
- `.specforge/core/skills/requirements/references/source-translation.md`：brief / brainstorm / PRD / research / gap / wiki 到 REQ / AC / NFR / Out of Scope / Pending 的转译规则。
- `.specforge/core/skills/requirements/references/coverage-patterns.md`：role-permission、workflow-state、data-file、ai-quality、ui-impact、integration-api、runtime-ops 覆盖 pattern。
- `.specforge/core/skills/requirements/references/handoff-and-authoring.md`：访谈、验收标准、歧义审查和下游交接。
- `.specforge/core/skills/requirements/references/quality-guide.md`：artifact-quality 对齐、anti-pattern fixer 和修复顺序。
- `references/requirements-authoring-guide.md`：产品需求文档转译补充、第三方 skill 归一化、访谈镜头、写作细则和影响面标记回写。
- `.specforge/skills/sf-requirements/stages/requirements/SKILL.md`：内部需求质量标准、停止条件和完成标准。
- `.specforge/core/standards/product.md`：产品需求文档输入、候选功能、用户故事、验收标准和可测试需求。
- `.specforge/core/standards/workflow.md`：范围、非目标、写入边界和中文协作。
- `.specforge/core/standards/ai-toolkit.md`：spec source-of-truth、输出预算、阶段质量条和人工确认点。
- `.specforge/core/skills/code-intelligence/SKILL.md`：只在需要验证现有行为、权限边界、数据来源、运行事实或 Wiki 契约可信度时读取；CodeGraph 结果不能直接生成 MUST / SHALL。
- `.specforge/core/skills/ORCHESTRATION.md`、`README.md`、`registry.json`：第三方 requirements skill 的选择、边界和来源风险。

## 启动扫描

1. 运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

2. 确认 ready artifact 包含 `requirements`，再运行：

```bash
node .specforge/core/scripts/create-artifact.mjs requirements
```

3. 读取：
   - `00-intake/original-request.md`
   - `00-intake/brief.md`
   - `00-intake/brainstorm.md`（如果存在）
   - `00-intake/prd.md`（如果存在）
   - `.specforge/wiki/00-index.md` 和相关 `.specforge/wiki/` 文件
   - `01-spec/requirements.md`（如果是更新）

## 执行序列

### A. 检查前置门禁

1. 如果 `brief.md#产品需求文档决策` 标记需要产品需求文档，但 `00-intake/prd.md` 不存在或决策状态不是 `approved-for-requirements`，先回到 `sf-prd`。
2. 如果存在 `brainstorm.md`，读取其中用户确认、明确延后和未决问题。
3. 如果产品需求文档或头脑风暴没有回答目标用户、最小可行版本边界或成功标准，按 `[NEEDS CLARIFICATION]` 标记并暂停。

### B. 转译为可测试行为

1. 先建立 `上游确认输入` 表：原始请求、简报、头脑风暴、产品需求文档、研究、缺陷根因报告和 wiki 事实都必须标注确认类型。
2. 只有 `user-confirmed` 和 `delegated-default` 可以转成 `MUST` / `SHALL` 行为需求；`agent-recommendation` 只能写成候选 / 建议，`pending` 必须留在未决问题。
3. 按 `.specforge/core/skills/requirements/references/source-translation.md` 的前后对照样例和 `references/requirements-authoring-guide.md#产品需求文档转译规则` 显式完成来源转译。
4. 从 brief 的 Wiki 上下文入口和相关 wiki 中提取既有产品规则、模块边界、API / 数据约束和已知风险，只转成需求约束或影响面，不展开全仓代码探索。
5. 如果需要验证现有行为或边界，按 code-intelligence 的 Wiki-first 规则做局部补证；结果只能写成 existing behavior / current fact / pending evidence，不能直接升级为用户确认需求。
6. 把产品需求文档 / 简报 / 头脑风暴中已确认的用户故事、候选功能和验收种子转成 `REQ-*`、`AC-*`、NFR、非目标、明确延后或待澄清项。
7. 需求正文使用系统行为语言，不复制产品需求文档原文，不写实现方案；优先使用 EARS 或 RFC 2119 层级表达。
8. 如需用户故事或验收样例，按 `references/requirements-authoring-guide.md#第三方 Skill 归一化` 读取 `user-stories`，但它只补视角，不替代主 requirements 包。
9. 按需求风险读取 1-3 个 pattern 文件：角色 / 权限、状态流转、数据文件、AI 质量、UI 影响、集成 API、运行时约束；每个命中的 pattern 至少补一个常见漏项检查。
10. 对中高复杂度需求执行一致性检查：用户目标、最小可行版本、角色权限、数据口径、验收标准和非目标不得互相冲突；冲突必须回到用户确认。

### C. 写 requirements

1. 写入 `01-spec/requirements.md`。
2. 每条 `MUST` / `SHALL` 需求至少有一个 `AC-*`，并在 `REQ / AC Trace` 中连回来源。
3. 适用时覆盖正常路径、失败路径、空状态、边界值、权限差异和重新验证触发条件；不适用时写 N/A 理由。
4. 涉及依赖或工具链选择时，写 `[NEEDS DEPENDENCY DECISION]` / `[NEEDS TOOLING DECISION]`，不要替用户选择。
5. 填写 `Spec Quality Gate`，说明输出预算、冲突扫描、可测试性扫描和下一阶段是否可直接开工。
6. 标出非目标、依赖、风险、重新验证触发条件和已知歧义；无法确认的行为必须写 `[NEEDS CLARIFICATION]`，不得猜测或包装成已批准规格。
7. **新增字段或数据变更时，必须枚举所有读取或展示该数据的页面**（不仅是新增/编辑表单，还包括列表页、详情页、只读视图、导出等），每个页面单独列为影响面，不得合并或遗漏。
8. 写清 `Downstream Handoff`：哪些 REQ / AC 触发 UI design、technical design、tasking、verification，哪些未决项会阻断下游。

### D. 回写 flags 和路由

1. 按 `references/requirements-authoring-guide.md#影响面回写` 校准 `work.yaml` / `brief.md` 的 components flags。
2. requirements 写完后运行：

```bash
node .specforge/core/scripts/artifact-quality.mjs
```

3. 检查 `Issues`：`FAIL` 必须修复后才能进入 UI / technical design / tasking；`WARN` 必须修复，或在 `Spec Quality Gate` 中写清 owner、影响和接受理由。

## 判定表

| 条件 | 状态 |
|---|---|
| `brief.md` 要求产品需求文档，但产品需求文档缺失或未批准 | 停止：产品需求文档尚未就绪 |
| 目标用户、成功标准或范围无法判断 | 停止：澄清或补充探索 |
| intake 证据包不足以支撑需求 | 停止：补探索、研究或澄清记录 |
| 存量项目相关 wiki 缺入口且无法判断既有边界 | 停止：退回 `sf-intake` 或 `sf-steering` 补上下文 |
| 产品功能组合、目标用户或版本边界没有确认 | 停止：需先完成方向取舍 |
| 需求互相冲突 | 停止：列冲突并请求决策 |
| 验收标准无法定义 | 停止：补清触发、条件、系统响应和可见结果 |
| 需要产品或业务决策才能继续 | 停止：不要包装成已批准规格 |

## 完成标准

- `01-spec/requirements.md` 可以独立支撑后续影响面判断。
- 产品需求文档中每个已确认最小可行版本能力都能追溯到需求规格中的需求或非目标。
- 产品需求文档的每个验收种子都已转成最终验收标准、非功能需求、非目标或待澄清项。
- 所有 `MUST` / `SHALL` 都来自 `user-confirmed` / `delegated-default` / 既有系统契约，不把 Agent recommendation 写成用户确认。
- `REQ-*`、`AC-*`、NFR 和下游 handoff 可以从来源追溯。
- `Spec Quality Gate` 已证明需求可测试、无未处理冲突，且输出预算与 work item 规模匹配。
- 每个 user-visible / operator-visible 行为都有验收标准。
- 影响面 flags 已校准。
- 所有未决问题都显式标记 `[NEEDS CLARIFICATION]`、`[NEEDS DEPENDENCY DECISION]` 或 `[NEEDS TOOLING DECISION]`。
- `artifact-quality.mjs` 的 requirements 相关 `FAIL` 已清零；`WARN` 已修复或在 `Spec Quality Gate` 中有明确接受理由。
- **按需求规模裁剪**：单字段 / 单页面 / 配置类小需求，`产品需求文档转译边界`、`行为覆盖矩阵`、`用户流程` 等章节可省略或合并为一行摘要；不要为了填满模板而生成无意义内容。目标是让用户有审批欲望，而不是让文档看起来完整。
- 完成后运行 `node .specforge/core/scripts/instructions.mjs`，将输出展示给用户，让用户知道当前 workflow 的下一步是什么。

## 不做

- 不写设计方案。
- 不把未澄清需求包装成已批准规格。
- 不把 `brainstorm.md` 里的 Agent recommendation 当成用户已确认需求。
- 不把产品需求文档、第三方 skill 模板或用户故事原样复制成需求规格。
- 不把产品指标、路线图或方案备注伪装成已批准系统行为。
- 不用故事点、排期或 Sprint 信息替代验收标准。
