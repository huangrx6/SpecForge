---
name: sf-intake
description: 为新请求创建或整理 SpecForge work item；用于用户提出新需求、bug、重构、预研或边界不清的工作，需要进入 intake/discovery 时。
---

# sf-intake

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把用户的原始诉求变成一个可推进的 active work item。先分类：feature、bugfix、refactor、discovery、lite、standard 或 mixed。它负责 intake，不负责写完整规格或实现代码。

## 启动扫描

1. 读取 `.specforge/attention.md`。
2. 读取 `.specforge/registry.yaml`。
3. 读取相关 `.specforge/workspace/knowledge/` 长期事实；只读和请求相关的文件。
4. 运行 `node .specforge/execution/tools/status.mjs`，确认 active work item 数量。

## 内部技能母本

开始整理 intake 前，读取 `.specforge/execution/stages/discovery/SKILL.md`。本根级 skill 只保留入口动作；discovery 的输入、输出、停止条件和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/context/README.md`：只加载必要上下文。
- `.specforge/policy/rules/analysis-workflow/README.md`：判断分析深度、代码探索、外部研究和计划确认证据。
- `.specforge/policy/rules/product-discovery/README.md`：产品、页面、全栈应用必须展开候选功能池。
- `.specforge/policy/rules/boundaries/README.md`：判断范围、非目标和写入边界。
- `.specforge/policy/rules/spec-quality/README.md`：遇到歧义必须标记 `[NEEDS CLARIFICATION]`。
- `.specforge/policy/rules/localization.md`：面向人类的产物优先中文。

## 动作

1. 没有 active work item 时创建：

```bash
node .specforge/execution/tools/create-work-item.mjs --workflow <workflow> "Work item title"
```

可在创建时直接声明已知影响面，例如：

```bash
node .specforge/execution/tools/create-work-item.mjs --workflow feature --has-ui true --has-api true --has-db false "Work item title"
```

未确定的组件 flag 保持 `auto`，表示保守保留对应 artifact；明确为 `false` 时，后续 artifact graph 会跳过对应阶段。

2. 写清：
   - `00-intake/original-request.md`
   - `00-intake/brief.md`
3. 判断 work item kind 和 workflow：`lite`、`feature`、`standard`、`bugfix`、`refactor`、`discovery`；混合请求先拆分，不要塞进一个万能 work item。
4. 更新 `work-item.yaml` 中的 `components`：
   - `has_ui`：是否有用户可见 UI / 页面 / 交互。
   - `has_api`：是否涉及 HTTP API、RPC、SDK、事件或 webhook 契约。
   - `has_db`：是否涉及数据库、迁移、索引、持久化模型或数据导入导出。
   - `has_domain`：是否涉及领域模型、权限状态机、审批流、任务生命周期或核心业务规则。
   - `has_nfr` / `has_security` / `has_infra` / `has_background_job`：是否涉及非功能、安全、部署或后台任务。
   - `needs_research`：是否需要在 requirements 前插入外部研究 artifact；纯预研请直接选择 `discovery` workflow。
5. 在 brief 中写：
   - 背景和目标。
   - 分析深度、代码库探索、外部研究或跳过理由、澄清记录和分析综合。
   - 候选功能池、推荐 MVP、用户已确认选择和明确延后项。
   - 本次负责 / 不负责。
   - 影响面矩阵：UI、frontend、backend、API、data、security、delivery、tests。
   - 依赖、风险、澄清项。

## 停止条件

- 有多个 active work item，且用户未指定要继续哪一个。
- 需求边界不清，无法判断是 bugfix、feature、refactor、discovery、lite 或 standard。
- 产品 / 页面 / 全栈应用的 MVP 功能组合尚未确认，且无法安全默认。
- `standard` / `deep` 缺少代码库探索证据或明确跳过原因。
- `deep` 缺少外部研究证据或明确跳过原因。
- 存在生产、安全、权限、数据迁移风险但没有足够上下文。

## 完成标准

- work item 已进入 `.specforge/workspace/work-items/active/`。
- brief 足以支撑 requirements。
- `work-item.yaml` 的 `workflow` 和 `components` 已与 brief 影响面矩阵一致；不适用的 UI / 技术设计阶段已明确标成 `false`，不确定的保持 `auto`。
- 下一步明确路由到 `sf-requirements` / `sf-ui-design` / `sf-tech-design` / `sf-discovery`，或因澄清项暂停。

## 不做

- 不直接实现。
- 不手工绕过 artifact graph；是否跳过 ui_design / technical_design 由 `components` 和 workflow schema 共同决定。
