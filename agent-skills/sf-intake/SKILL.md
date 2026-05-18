---
name: sf-intake
description: 为新请求创建或整理 SpecForge work item；用于用户提出新需求、bug、issue、重构、预研、低风险小改或边界不清的工作，需要分类 workflow、决定是否需要 PRD、校准 components flags，并写出可支撑下一步的 brief 时。
---

# sf-intake

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把用户的原始诉求变成一个可推进的 active work item。`sf-intake` 是分诊入口：判断 work item 类型、workflow、是否需要 PRD、是否需要 research、影响面 flags、是否需要拆分。它负责 intake，不负责写完整 PRD、requirements、设计或实现代码。

## 启动扫描

1. 读取 `.specforge/AGENTS.md`。
2. 读取 `.specforge/registry.yaml`。
3. 读取相关 `.specforge/wiki/` 长期事实；只读和请求相关的文件。
4. 运行 `node .specforge/core/scripts/status.mjs`，确认 active work item 数量。

## 内部技能母本

开始整理 intake 前，读取 `.specforge/core/workflows/stages/discovery/SKILL.md`。本根级 skill 只保留入口动作；discovery 的输入、输出、停止条件和完成标准以内置母本为准。

## 关联标准

- `.specforge/core/standards/workflow.md`：上下文加载、workflow 分类、scope、命名和 gate 边界。
- `.specforge/core/standards/product.md`：分析深度、PRD 决策、功能候选池、澄清和需求可测试性。

## 分诊顺序

按这个顺序做判断，避免一上来就创建错误类型的 work item：

1. **是否已有 active work item。**
   - 没有：为本次请求创建新 work item。
   - 一个：判断是扩展已有 work item，还是应新开。
   - 多个：先让用户指定，不猜。
2. **是否需要拆分。**
   - 同时包含新增功能 + bugfix + 重构 + 预研时，优先拆成多个 work item。
   - 只有同一个交付目标下的前后端 / UI / 数据 / 测试，才保留在同一个 work item。
3. **选择 work item kind 和 workflow。**
4. **决定是否需要 PRD。**
5. **校准 components flags。**
6. **写 brief，并明确下一步路由。**

## Workflow 分类表

| 类型 | 触发信号 | workflow | 下一步 |
|---|---|---|---|
| 新增用户能力 / 产品功能 | 新页面、新后台、新 AI 能力、多角色、审批、导入导出 | `feature` | PRD 判断后进入 requirements |
| 通用标准变更 | 不属于 feature / bugfix / refactor / discovery，但风险需要完整规格 | `standard` | PRD 判断后进入 requirements |
| 低风险小改 | 文案、配置、小样式、单点行为，范围清楚且无设计风险 | `lite` | requirements |
| 已确认缺陷 | 有复现、当前行为、期望行为，明确是 bug | `bugfix` | gap_report |
| 未定性问题 | 告警、异常、现象排查，尚未确认代码缺陷 | `issue` | gap_report |
| 行为不变重构 | 解耦、依赖升级、架构整理、性能重构，用户行为不变 | `refactor` | technical_design |
| 纯预研 | Spike、可行性、方案调研、黑盒系统理解，不承诺实现 | `discovery` | research |
| 混合请求 | 跨多个目标或多种性质 | 不直接创建万能 work item | 先拆分 |

## PRD 决策

`sf-prd` 不是 artifact graph 的固定阶段，所以 intake 必须把是否需要 PRD 写进 `brief.md`，供 `sf-router` 和人类判断。

需要 PRD 的情况：

- 产品型功能：新工具、新后台、全栈应用、AI 能力、运营平台、面向多角色的功能。
- 用户只给了高层目标，尚未明确目标用户、MVP、成功标准、路线图或功能候选。
- 涉及 AI 质量、审批上线、权限、数据生命周期、任务调度、结果交付等产品决策。
- 用户明确希望先设计产品方案或 PRD。

可以跳过 PRD 的情况：

- bugfix、issue、纯 refactor、纯 discovery。
- lite 小改，目标和验收标准已经清楚。
- 已有 PRD / 业务规格，且 brief 已把 MVP 和边界摘录清楚。

在 `brief.md#PRD 决策` 中写：

- `PRD required: yes / no`
- `PRD depth: N/A / prd-lite / prd-standard / prd-deep`
- `Reason`
- `Blocking product decisions`
- `Next route: sf-prd / sf-requirements / sf-discovery / sf-tech-design`

## 动作

1. 没有 active work item 时创建：

```bash
node .specforge/core/scripts/create-work.mjs --workflow <workflow> "Work item title"
```

可在创建时直接声明已知影响面，例如：

```bash
node .specforge/core/scripts/create-work.mjs --workflow feature --has-ui true --has-api true --has-db false "Work item title"
```

未确定的组件 flag 保持 `auto`，表示保守保留对应 artifact；明确为 `false` 时，后续 artifact graph 会跳过对应阶段。

2. 写清：
   - `00-intake/original-request.md`
   - `00-intake/brief.md`
3. 判断 work item kind 和 workflow：`lite`、`feature`、`standard`、`bugfix`、`issue`、`refactor`、`discovery`；混合请求先拆分，不要塞进一个万能 work item。
4. 更新 `work.yaml` 中的 `components`：
   - `has_ui`：是否有用户可见 UI / 页面 / 交互。
   - `has_api`：是否涉及 HTTP API、RPC、SDK、事件或 webhook 契约。
   - `has_db`：是否涉及数据库、迁移、索引、持久化模型或数据导入导出。
   - `has_domain`：是否涉及领域模型、权限状态机、审批流、任务生命周期或核心业务规则。
   - `has_ai`：是否涉及 AI 分类、生成、提示词、评估、模型调用、置信度或人工复核。
   - `has_nfr` / `has_security` / `has_integration` / `has_infra` / `has_background_job`：是否涉及非功能、安全、第三方集成、部署或后台任务。
   - `needs_research`：是否需要在 requirements 前插入外部研究 artifact；纯预研请直接选择 `discovery` workflow。
   - 问题/异常尚未确认是代码缺陷时，优先选择 `issue`；确认是缺陷修复时选择 `bugfix`。
5. 在 brief 中写：
   - 背景和目标。
   - PRD 决策：是否需要 PRD、深度、原因和下一步。
   - 分析深度、代码库探索、外部研究或跳过理由、澄清记录和分析综合。
   - 候选功能池、推荐 MVP、用户已确认选择和明确延后项。
   - 本次负责 / 不负责。
   - 影响面矩阵：UI、frontend、backend、API、data、AI、integration、security、delivery、tests。
   - 依赖、风险、澄清项。

## 停止条件

- 有多个 active work item，且用户未指定要继续哪一个。
- 需求边界不清，无法判断是 bugfix、feature、refactor、discovery、lite 或 standard。
- 产品 / 页面 / 全栈应用的 MVP 功能组合尚未确认，且无法安全默认。
- 产品型 work item 需要 PRD，但缺少会改变 PRD 的核心决策，且不能写成安全默认假设。
- `standard` / `deep` 缺少代码库探索证据或明确跳过原因。
- `deep` 缺少外部研究证据或明确跳过原因。
- 存在生产、安全、权限、数据迁移风险但没有足够上下文。

## 完成标准

- work item 已进入 `.specforge/work/active/`。
- brief 足以支撑 PRD 或 requirements。
- PRD 决策清楚：需要就路由到 `sf-prd`，不需要就写明跳过理由。
- `work.yaml` 的 `workflow` 和 `components` 已与 brief 影响面矩阵一致；不适用的 UI / 技术设计阶段已明确标成 `false`，不确定的保持 `auto`。
- 下一步明确路由到 `sf-prd` / `sf-requirements` / `sf-discovery` / `sf-tech-design`，或因澄清项暂停。

## 不做

- 不直接实现。
- 不手工绕过 artifact graph；是否跳过 ui_design / technical_design 由 `components` 和 workflow schema 共同决定。
