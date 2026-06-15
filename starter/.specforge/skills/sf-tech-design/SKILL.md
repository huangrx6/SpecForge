---
name: sf-tech-design
description: 生成或更新 SpecForge work item 的 technical_design；用于 ready artifact 为 technical_design，或需求涉及前端工程、后端架构、API、数据、权限、配置、任务或 NFR 时。
---

# sf-tech-design

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，必须先定位宿主项目根：项目根是“包含 `.specforge/` 目录的业务项目目录”，不是 `.specforge/` 目录本身。若当前目录是 `.specforge/` 或其任意子目录，先 `cd ..` 回到宿主项目根；若当前目录是 `frontend/`、`backend/` 等子目录，也先向上回到包含 `.specforge/` 的项目根。禁止从 `.specforge/` 内执行 `node .specforge/core/scripts/...`，否则会形成 `.specforge/.specforge/...` 的错误路径。

## 运行模式检测

1. 当前目录向上存在 `.specforge/` 且有 active work item：**Embedded 模式**，按 artifact graph 写入 `01-spec/technical-design.md`，并遵守选型 / 依赖 / 工具链 / 核心决策 review 门禁。
2. 存在 `.specforge/` 但无 active work item：**Lightweight 模式**，可先做技术影响面、候选方案和风险草稿；需要落档时输出 `specforge-import-ready.md` 格式内容，或先路由 `sf-intake` 创建 work item。
3. 不存在 `.specforge/`：**Standalone 模式**，不要运行 `.specforge/...` 命令；输出可导入的 `specforge-import-ready.md`，必须区分用户已确认、沿用现有栈、用户授权默认和 Agent recommendation。

`sf-tech-design` 把 requirements 和可选 UI design 转成可实现、可审查、可验证、可运行、可维护的工程设计。它不负责画页面线稿或决定视觉风格。

## 必读

- `references/technical-decision-guide.md`：影响面扫描、分批确认卡、依赖 / 工具链确认、版本事实检查、核心决策 review 和写作细则。
- `references/architecture-contract.md`：架构视图、ADR、实施交接、运行态、维护演进和长期约束；本次涉及架构、跨模块、API、数据、任务、权限、部署或长期维护时必须读取。
- `.specforge/skills/sf-tech-design/stages/technical-design/SKILL.md`：内部技术设计母本。
- `.specforge/core/artifacts/templates/technical-design.md`：写入骨架。
- `.specforge/core/standards/product.md`、`.specforge/core/standards/workflow.md`、`.specforge/core/standards/engineering.md`。
- `.specforge/core/standards/ai-toolkit.md`：阶段质量条、输出预算、依赖确认、source-of-truth 和证据分级。
- `.specforge/core/profiles/README.md`：技术选型维度、数据库选择矩阵和 profile selection 写法。
- 前端 / UI 会影响组件架构、token、组件库、registry、动效依赖或可视验证时，读取 `.specforge/core/skills/ui-ux/design-system/SKILL.md` 和 `.specforge/core/skills/ui-ux/design-system/references/cross-stage-handoff.md`；再按需读 `references/shadcn-vue.md`、`references/component-system.md`、`references/ui-toolchain.md`、`foundations/tokens.md`、`foundations/motion.md`。

## 启动扫描

1. 运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

2. 如果输出是 `Instructions blocked`，按 `Route` 处理阻断。尤其当 blocker 为 `tech-direction-unconfirmed`、`dependency-decision-unconfirmed` 或 `tooling-decision-unconfirmed` 时，停止 technical design，向用户输出确认卡。
3. 确认 ready artifact 包含 `technical_design` 后，再运行：

```bash
node .specforge/core/scripts/create-artifact.mjs technical_design
```

4. 读取 `00-intake/brief.md`、`00-intake/prd.md`（如果存在）、`00-intake/brainstorm.md`（如果存在）、`01-spec/requirements.md`、`01-spec/ui-design.md`（如果存在）、`.specforge/wiki/00-index.md` 和相关 `.specforge/wiki/`。
5. 只沿 wiki 给出的入口路径、模块、API、数据、运行命令和风险线索读取现有代码结构；wiki 缺入口、过期或与代码冲突时，先路由 `sf-steering`，不要在 technical design 中临时全量探索。

## 执行序列

### A. 建立影响面与读取计划

1. 按 `references/technical-decision-guide.md#影响面扫描` 标记 frontend、backend、domain、API、data、auth/security、config/delivery、jobs、observability、reliability。
2. 从 wiki 建立本次的读取计划：关联知识项、代码入口、上游 / 下游、测试位置、运行命令和需要补证的缺口。
3. 把每个影响面写成 `yes / no / unknown`；会改变架构、数据、安全、成本或上线风险的 `unknown` 必须暂停澄清。
4. 只读取本次需要的内部子模块和 profile，不默认全量读取：
   - frontend：`.specforge/skills/sf-tech-design/stages/technical-design/frontend-design.md`
   - backend：`.specforge/skills/sf-tech-design/stages/technical-design/backend-design.md`
   - domain：`.specforge/skills/sf-tech-design/stages/technical-design/domain-design.md`
   - API：`.specforge/skills/sf-tech-design/stages/technical-design/api-design.md`
   - data：`.specforge/skills/sf-tech-design/stages/technical-design/data-design.md`
   - NFR：`.specforge/skills/sf-tech-design/stages/technical-design/nfr-design.md`

### B. 先确认选型、依赖和工具链

1. 技术设计动笔前必须先完成确认门禁。任何 `[NEEDS TECH/DEPENDENCY/TOOLING DECISION]` 维度未确认，不得写架构设计正文。
2. 新项目、空仓库、技术栈缺失，或要新增 / 替换关键技术时，按 `references/technical-decision-guide.md#分批确认卡` 输出候选方案，等用户确认。
3. 需要新增直接依赖、SDK、插件、组件库、ORM、驱动、测试库、浏览器自动化库或外部 provider 时，按 `references/technical-decision-guide.md#新增依赖确认` 单独确认。
4. 需要决定或替换包管理器、UI 组件库、样式方案、Python 依赖管理 / 虚拟环境、构建工具、测试 runner、任务运行器或 monorepo 工具时，必须确认或引用现有栈证据。
5. 用户确认后，写入 `[TECH DECISION CONFIRMED]`、`[DEPENDENCY DECISION CONFIRMED]`、`[TOOLING DECISION CONFIRMED]` 或对应状态：`existing_stack`、`delegated_default`、`scaffold_confirmed`、`not_required`。

### C. 写 technical design

1. 按模板填写 `01-spec/technical-design.md`。
2. 当前版本事实不能只靠记忆；新增或替换框架、SDK、云服务、数据库、部署平台、AI provider、模型、测试工具或安全相关依赖时，按 `references/technical-decision-guide.md#当前版本事实检查` 查询官方资料或读取 lockfile / manifest。
3. 按影响面展开工程设计；不涉及的章节保留一行 N/A 理由，不写空表。
4. 对齐 `references/architecture-contract.md`：选择本次需要的最小 Architecture View（Context / Container / Component / Runtime / Data / Deployment），写清 boundary、responsibility、interface、state、data、security、operability、delivery、testability、maintainability 和 cost 中适用维度。
5. 对齐规则主基准：按影响面写采用点、偏离理由和验证证据。
6. 填写 `Design Quality Gate`：设计规模、现有架构复用、新增依赖确认、更简单方案、契约可测试性和是否可拆 tasks。
7. 若存在 UI / 前端工程影响，必须把 `ui-design.md#Design Contract Summary` 转成工程决策：token delivery、component source、project wrapper、shadcn-vue registry boundary、motion source、state ownership 和 visual verification hooks。
8. React Bits 类灵感在 Vue 项目中不得直接照搬；优先评估 Vue Bits、Motion Vue、CSS transition 或现有动画工具。新增 Vue Bits、Motion、GSAP 等依赖必须走 dependency decision。
9. 中高风险、跨模块、长期维护、数据、安全、运行或质量属性决策必须写 ADR 摘要；ADR 包含 context、options、outcome、consequences、confidence 和 revisit trigger。小改可写 `N/A - no long-lived architecture decision`。
10. 输出 Implementation Handoff：change slices、files/modules、sequence、test seams、feature flags / rollout、rollback seam、do-not-touch 和 open assumptions。
11. 输出 Maintenance & Evolution：owner、change frequency、extension point、deprecation path、wiki target、technical debt、revisit trigger。
12. 输出必须能直接支持 `sf-tasking`：每个技术决策都要能拆成任务、验证或明确 N/A。

### D. 初稿后核心决策 Review

1. 详细 technical design 初稿完成后，必须先向用户展示 `references/technical-decision-guide.md#核心决策摘要 Review`，等待确认、调整或授权默认。
2. 确认前不得进入 `sf-tasking`、`sf-spec-review` approval 或 `sf-implement`。
3. 用户确认后，在 `technical-design.md#1. 技术选型与依赖确认` 写 `Core Decision Review Status: confirmed` 或 `delegated_default` / `not_required`，并保留 `[TECH DESIGN REVIEW CONFIRMED]`。
4. technical design 定稿前运行：

```bash
node .specforge/core/scripts/artifact-quality.mjs
```

5. 检查 `Issues`：technical_design 相关 `FAIL` 必须修复，尤其是 open decision、关键影响面 `unknown`、Architecture Contract / Implementation Handoff / Operability & Maintenance 空壳；`WARN` 必须修复或在 `Design Quality Gate` 中写明 owner、影响和接受理由。

## 判定表

| 条件 | 状态 |
|---|---|
| 技术方向尚未确认 | 停止：确认技术方向 |
| 新增 / 替换依赖尚未确认 | 停止：确认新增 / 替换依赖 |
| 工具链选择尚未确认 | 停止：确认包管理器、组件库、依赖管理、测试工具等 |
| requirements 仍有阻断歧义 | 停止：上游需求需先澄清 |
| 存量项目 wiki 无法给出本次相关入口、边界或上下游 | 停止：路由 `sf-steering` 刷新 wiki |
| 新项目、空仓库或关键技术缺失，但没有确认来源 | 停止 |
| 新增 / 替换技术或依赖缺少版本事实、官方资料、lockfile 证据或明确风险说明 | 停止 |
| UI 有前端实现影响，但 technical design 未承接 Design Contract Summary、token delivery、组件架构、动效来源或视觉验证面 | 停止 |
| 跨模块 / API / 数据 / 权限 / 任务 / 集成 / 运行变更缺少 Architecture Contract、Implementation Handoff 或 Maintenance & Evolution | 停止 |
| 设计只描述 happy path，没有失败模式、回滚、观察点或验证路径 | 停止 |
| `technical-design.md` 仍残留 `[NEEDS TECH DECISION]`、`[NEEDS DEPENDENCY DECISION]` 或 `[NEEDS TOOLING DECISION]` | 停止 |
| `Core Decision Review Status` 不是 `confirmed`、`delegated_default` 或 `not_required` | 停止 |

## 完成标准

- `01-spec/technical-design.md` 存在。
- 有技术影响时，影响面、读取计划、选型依据、依赖和工具链确认来源清楚。
- 无技术影响时，明确写出 N/A、理由和验证方式。
- 技术栈选择引用 profile、现有项目证据或说明偏离理由。
- 新项目、新增 / 替换关键技术、新增直接依赖或工具链选择都有用户确认、授权默认、沿用现有栈或已确认脚手架依据。
- `Design Quality Gate` 证明设计最小充分、没有无根据新增依赖，且关键契约可测试。
- 当前版本事实、规则基准采用点、偏离理由和验证证据已写入。
- 有 UI / 前端影响时，Design Contract Summary 已转成工程可执行的 token、wrapper、registry、motion 和 visual verification 方案。
- 有架构或长期维护影响时，Architecture Contract、ADR、Implementation Handoff、Operability 和 Maintenance & Evolution 已写入或明确 N/A。
- 初稿后的核心决策摘要已经被用户确认、用户授权默认，或明确 N/A。
- `artifact-quality.mjs` 的 technical_design 相关 `FAIL` 已清零；`WARN` 已修复或在 `Design Quality Gate` 中有明确接受理由。
- **按需求规模裁剪**：单字段 / 单页面 / 配置类小需求，`Tech Profile Selection`、`Requirements Trace`、`核心决策摘要 Review` 等章节可省略或合并为一行摘要；沿用现有栈时不需要重复列出所有技术选型表格。目标是让文档可读可审批，而不是填满模板。
- 完成后运行 `node .specforge/core/scripts/instructions.mjs`，将输出展示给用户，让用户知道当前 workflow 的下一步是什么。

## 不做

- 不写业务代码。
- 不重复维护 UI 原型、视觉风格和页面交互细节；这些只引用 `ui-design.md`。
- 不在用户尚未确认技术栈 / 依赖 / 外部 provider / 部署方向时定稿 technical design。
- 不在用户尚未确认工具链时替用户决定 npm / pnpm / yarn、UI 组件库、uv / Poetry / pip / Conda 等工程偏好。
