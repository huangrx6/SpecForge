# SpecForge Workflow Redesign

> 这份文档记录本轮改版后的目标架构和阶段边界。核心原则：流程不要复杂，但每一步必须知道输入、输出、用户确认点和停止条件。

## 1. 设计来源

本次参考了两个体系的优秀思想，但只吸收适合 SpecForge 的部分：

- GSD：文件化状态、WHAT/WHY 与 HOW 分离、模糊度门禁、任务来源审计、计划审查、目标倒推验证。
- Superpowers：先 brainstorm 再写代码、一轮只问关键问题、2-3 个方案带取舍、计划写给低上下文执行者、失败优先验证、完成前必须有证据。

不吸收的部分：

- 不引入过多命令、hook、agent 角色和安装复杂度。
- 不把 TDD 变成无条件教条，但行为变更默认失败优先验证。
- 不保留多种 UI 原型路线，避免 AI 在工具之间游移。

## 2. 新主线

```text
intake
  -> optional brainstorm
  -> optional PRD
  -> requirements
  -> optional UI design
  -> optional technical design
  -> tasks
  -> spec review
  -> implementation
  -> code review
  -> verification
  -> wiki / close
```

## 3. 阶段边界

| 阶段 | 负责 | 不负责 | 关键产物 |
|---|---|---|---|
| intake | 判断类型、拆分、workflow、是否需要 PRD / brainstorm | 不展开完整方案 | `00-intake/brief.md` |
| brainstorm | 用户参与式发散、研究、方案对比、取舍确认 | 不写最终规格或代码 | `00-intake/brainstorm.md` |
| PRD | 产品目标、用户、MVP、成功指标 | 不写系统行为和技术方案 | `00-intake/prd.md` |
| requirements | 可测试行为、边界、验收标准 | 不写 UI / API / DB / 任务 | `01-spec/requirements.md` |
| UI design | 视觉方向、页面地图、状态矩阵、Pencil 原型 | 不写工程设计 | `01-spec/ui-design.md`, `ui-mockup.pen`, screenshots |
| technical design | 技术影响面、选型确认、版本事实、架构/API/数据/NFR | 不替用户静默选型 | `01-spec/technical-design.md` |
| tasks | 可执行任务、来源覆盖、边界、验证 | 不写代码 | `01-spec/tasks.md` |
| spec review | 任一 spec 的局部审查，或实现前 gate | 不顺手实现 | `02-spec-review/*.md` |
| implementation | 按任务实现并记录证据 | 不扩大范围，不批准自己 | `03-implementation/*` |
| code review | 先 spec compliance，再 code quality | 不修代码 | `04-code-review/code-review-v1.md` |
| verification | 测试用例、命令、Playwright、证据闭环 | 不凭空声明 CI / 发布 | `05-verification/test-cases.md`, `report.md` |

## 4. 关键改版

### 4.1 Intake 与 Brainstorm 分离

复杂需求不能直接被 AI 整理成“看似完整”的需求。现在 intake 负责分诊，并在发现需要用户取舍时路由到独立的 `sf-brainstorm`。Brainstorm 必须先列：

- 已明确
- 高影响未知
- 可安全默认
- 2-3 个方案或 MVP 组合
- 推荐项、风险和取舍

需要竞品、政策、版本、SDK、AI 能力或安全事实时，先查当前可靠来源；技术类优先官方资料。

用户没有确认 MVP、核心方向、体验方向或关键技术边界前，不能进入 PRD、requirements、UI design 或 technical design。

### 4.2 PRD 和 requirements 分层

PRD 回答产品问题：为什么做、给谁做、MVP 做什么、成功怎么衡量。

Requirements 回答系统行为：系统在什么条件下必须有什么可观察表现，如何验收。

PRD 不能写接口、表结构、文件路径；requirements 不能替用户补造产品决策。

### 4.3 UI 固定 Pencil

UI 正式产物只保留 Pencil：

- `01-spec/ui-design.md`
- `01-spec/ui-mockup.pen`
- `01-spec/ui-mockup-export/*.png`

外部截图、既有设计资料和参考产品只能作为参考输入。UI 阶段必须有 Visual Style Brief、状态矩阵、Pencil 截图和视觉质量修正记录。

### 4.4 Tech design 必须确认选型和版本事实

AI 不再静默决定技术栈。以下情况必须给确认卡：

- 新项目或空仓库
- 新增 / 替换框架、数据库、队列、AI provider、部署、测试栈
- 新增直接依赖、SDK、插件、ORM、驱动
- 多个方案会影响成本、上线、维护、安全或兼容性

还必须记录当前版本事实：官方文档、lockfile、package manifest 或 wiki 证据。

### 4.5 Tasks 变成可执行任务图

每个任务必须包含：

- `_Trace:_`
- `_Impact:_`
- `_Boundary:_`
- `_Depends:_`
- `_Verification:_`
- `_TestCase:_`（适用时）
- `_Risk:_`（适用时）

任务要覆盖 `GOAL / PRD / REQ / UI / TECH / RESEARCH / CONTEXT` 来源审计。浏览器流程必须拆出 `test-cases.md`、Playwright 执行和证据登记任务。

### 4.6 Spec review 可随时调用

`sf-spec-review` 不再只等完整流程结束。

- Artifact Review：任一 spec 已存在就能审，不更新 gate。
- Gate Review：ready artifact 为 `spec_review` 时才审完整包并更新 gate。

这解决了“前面多个阶段都有 spec，但 review 只能最后跑”的问题。

### 4.7 Verification 先用例，后执行

验证阶段必须先写：

```text
05-verification/test-cases.md
```

再执行单元、集成、契约、启动、Playwright 或人工验证。涉及表单、上传、提交、审批、下载、权限、错误提示的浏览器流程，必须用 Playwright 真实点击、填写、提交并断言，不用“手工看过”替代。

## 5. 最小但清晰的门禁

| 门禁 | 通过条件 |
|---|---|
| Clarity Gate | 问题类型已确认；如需要取舍，`brainstorm.md` 已记录用户确认 |
| Product Gate | PRD 可进入 requirements |
| Requirement Gate | 行为可测试，影响面 flags 可信 |
| UI Gate | Pencil 原型和截图可审查 |
| Tech Gate | 选型、依赖、版本事实和技术边界已确认 |
| Task Gate | 每个来源项都有实现与验证任务 |
| Spec Review Gate | 完整 spec 包足以进入 implementation |
| Code Review Gate | 实现先通过 spec compliance，再通过工程风险审查 |
| Verification Gate | test-cases、命令、Playwright、证据和缺口闭环 |

## 6. 这次已改的核心文件

- `core/workflows/stages/discovery/SKILL.md`
- `core/workflows/stages/ui-design/SKILL.md`
- `core/workflows/stages/technical-design/SKILL.md`
- `core/workflows/stages/task-planning/SKILL.md`
- `core/workflows/stages/spec-review/SKILL.md`
- `core/workflows/stages/implementation/SKILL.md`
- `core/workflows/stages/verification/SKILL.md`
- `core/workflows/stages/code-review/SKILL.md`
- `agent-skills/sf-intake/SKILL.md`
- `agent-skills/sf-brainstorm/SKILL.md`
- `agent-skills/sf-ui-design/SKILL.md`
- `agent-skills/sf-tech-design/SKILL.md`
- `agent-skills/sf-tasking/SKILL.md`
- `agent-skills/sf-spec-review/SKILL.md`
- `agent-skills/sf-implement/SKILL.md`
- `agent-skills/sf-verify/SKILL.md`
- `agent-skills/sf-code-review/SKILL.md`
- `agent-skills/sf-router/SKILL.md`
- `core/artifacts/templates/ui-design.md`
- `core/artifacts/templates/brainstorm.md`
- `core/artifacts/templates/technical-design.md`
- `core/artifacts/templates/tasks.md`
- `core/artifacts/templates/spec-review.md`
- `core/artifacts/templates/verification-report.md`
- `core/artifacts/templates/test-cases.md`
