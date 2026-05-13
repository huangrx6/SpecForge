---
name: sf-prd
description: 生成或更新产品需求文档（PRD）；用于产品型 change 需要在 requirements 前明确产品目标、用户画像、核心场景、成功指标和功能边界时。
---

# sf-prd

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 brief 的分析结论升级为可对齐产品与工程的 PRD。它的受众是产品决策者和工程负责人，不是实现者。

## 启动

1. 读取 `00-intake/brief.md`。
2. 读取 `.specforge/workspace/knowledge/` 中与产品相关的长期事实。
3. 运行 `node .specforge/execution/tools/doctor.mjs`。

## 内部技能母本

写 PRD 前，读取 `.specforge/execution/stages/discovery/SKILL.md` 中关于候选功能池和用户确认的章节，确保 PRD 的功能边界已经过用户选择，不是 Agent 单方面假设。

## 关联规则

- `.specforge/policy/rules/product-discovery/README.md`：功能候选和用户选择。
- `.specforge/policy/rules/experience-design/README.md`：用户流程和体验方向。
- `.specforge/policy/rules/boundaries/README.md`：明确非目标。
- `.specforge/policy/rules/spec-quality/README.md`：可测试、可验证的目标陈述。
- `.specforge/policy/rules/localization.md`：面向人类的产物优先中文。

## 动作

写入 `00-intake/prd.md`，必含：

- **产品目标**：用户要解决的核心问题，成功定义和可量化指标。
- **用户画像**：目标用户群、典型场景和关键痛点。
- **功能边界**：已确认 MVP 范围、明确延后项和非目标。
- **核心用户流程**：主路径和关键分支，不写 UI 细节。
- **成功指标**：用于验收的可度量标准。
- **依赖和约束**：外部依赖、资源限制和已知风险。
- **开放问题**：需要产品或业务决策才能推进的未决项。

## 停止条件

- 目标用户或核心问题无法从 brief 中推断。
- MVP 功能边界未经用户确认。
- 存在产品方向冲突需要决策。

## 完成标准

- `prd.md` 存在且内容足以支撑 `sf-requirements`。
- 功能边界和成功指标已有用户确认或明确默认假设。
- 下一步路由到 `sf-requirements`。

## 不做

- 不写技术方案。
- 不替用户做产品决策。
- 不把延后功能列入 MVP。
