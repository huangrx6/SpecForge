---
name: sf-discovery
description: 对新请求执行深度探索、缺陷根因分析或预研；用于 brief 不足以支撑后续 artifact，或 ready artifact 为 gap_report / research 时。
---

# sf-discovery

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把原始诉求升级为有分析证据支撑的 brief，或生成 bugfix 的 `gap_report`、discovery workflow 的 `research`。它不写业务实现代码。

## 启动

1. 读取 `.specforge/attention.md`。
2. 读取 `.specforge/registry.yaml`，确认当前 active work item。
3. 读取 `00-intake/original-request.md` 和已有 `brief.md`（如存在）。
4. 运行 `node .specforge/execution/tools/doctor.mjs`。
5. 运行 `node .specforge/execution/tools/instructions.mjs` 判断当前 ready artifact。

## 内部技能母本

开始 discovery 前，读取 `.specforge/execution/stages/discovery/SKILL.md`。brief 的必含内容、停止条件和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/analysis-workflow/README.md`：分析深度、代码库探索、外部研究、澄清和计划确认。
- `.specforge/policy/rules/product-discovery/README.md`：产品、页面、全栈应用的功能候选池和用户选择。
- `.specforge/policy/rules/boundaries/README.md`：范围、非目标和写入边界。
- `.specforge/policy/rules/spec-quality/README.md`：遇到歧义必须标记 `[NEEDS CLARIFICATION]`。
- `.specforge/policy/rules/context/README.md`：只加载必要上下文。
- `.specforge/policy/rules/localization.md`：面向人类的产物优先中文。

## 动作

1. 按 `analysis-workflow` 规则判断分析深度：`light`、`standard` 或 `deep`。
2. 按深度执行代码库探索；绿地项目也要记录"无既有实现"和项目规范。
3. 需要新框架、第三方库或版本敏感事实时执行外部官方资料研究；不触发时写明跳过理由。
4. 对产品、页面、全栈应用，生成候选功能池，按 `MVP / 可选增强 / 后续版本` 分组并给出推荐组合，再向用户澄清并记录答案。
5. 如果 ready artifact 是 `gap_report`，运行 `node .specforge/execution/tools/create-artifact.mjs gap_report`，并写清复现、当前行为、期望行为、根因、修复策略和回归测试。
6. 如果 ready artifact 是 `research`，运行 `node .specforge/execution/tools/create-artifact.mjs research`，并写清研究问题、来源、实验、发现、决策和未解决问题。
7. 其他 discovery 场景更新 `00-intake/brief.md`。

## 停止条件

- 请求边界无法判断。
- 产品 / 页面 / 全栈应用的 MVP 功能组合尚未被用户确认，且复杂度超过简单小改。
- `standard` / `deep` 缺少代码库探索证据或明确跳过原因。
- `deep` 缺少外部研究证据或明确跳过原因。
- 涉及生产、安全、权限或数据风险但缺少关键事实。

## 完成标准

- `brief.md` / `gap-report.md` / `research.md` 包含足以支撑下一步的分析证据。
- 下一步明确路由到 `sf-requirements`、`sf-tasking`、`sf-close`，或因澄清项暂停。

## 不做

- 不写 requirements 或 design。
- 不实现任何代码。
- 不把未确认选项伪装成已确认需求。
