# Requirements

## 摘要

本变更要求 SpecForge 的新变更创建和核心文档语言更接近后续真实使用方式：新 change 应按 artifact graph 渐进生成，人类可读内容应中文优先。

## 边界

### 本变更负责

- 调整 `new:change` 的生成策略。
- 增加 `new:artifact`。
- 调整 `validate` 和 `graph:status`。
- 中文化核心入口、rules、skills、commands、templates 和部分 project SSoT。
- 更新 README、getting-started、架构和验证模型。

### 本变更不负责

- 全量历史 archive 迁移。
- 完整 CLI。
- 自动 approval / archive 命令。
- OpenSpec 式 delta apply。

### 依赖

- `.specforge/schemas/standard.json`
- 当前 `change.yaml` gate 格式。
- 现有 npm scripts。

### 重新验证触发条件

- workflow schema 改变 artifact ID 或输出路径。
- change.yaml gate 格式改变。
- 新增 workflow 类型。
- 后续引入正式 CLI 替代 scripts。

## 待澄清项

- 无。

## 功能需求

### FR-1 渐进式 change 创建

- WHEN 创建新 change, THE SYSTEM SHALL 只生成 `change.yaml`、`00-intake/original-request.md` 和 `00-intake/brief.md`。

### FR-2 Artifact 生成

- WHEN 用户运行 `node .specforge/tools/create-artifact.mjs <artifact-id>`, THE SYSTEM SHALL 按 workflow schema 生成该 artifact 的输出文件。

### FR-3 Active change 校验

- WHEN active change 仍未完成, THE SYSTEM SHALL 允许缺少后续 artifact，但不允许半写入 artifact。

### FR-4 Archived change 校验

- WHEN change 位于 archive, THE SYSTEM SHALL 要求所有 artifact 输出存在，required gates 有 approved evidence。

### FR-5 中文优先

- WHERE 内容面向人类阅读, THE SYSTEM SHALL 优先使用中文。

## 非功能需求

- 不引入外部依赖。
- 保持 `node .specforge/tools/validate-structure.mjs`、`node .specforge/tools/status.mjs`、`node .specforge/tools/artifact-graph-status.mjs` 可用。
- 变更应可通过本仓库当前脚本验证。

## 不在范围内

- 自动推进 gate。
- 自动归档。
- 多 workflow schema 完整生成。

## 验收标准

| 标准 | 验证方式 |
|---|---|
| `new:change` dry run 显示仅创建 intake | `node .specforge/tools/create-change.mjs --dry-run "Progressive Probe"` |
| `new:artifact` 能按 graph 判断 blocked / ready | `node .specforge/tools/create-artifact.mjs --dry-run implementation` |
| active change 未完成时 validate 通过 | `node .specforge/tools/validate-structure.mjs` |
| graph status 不把依赖未满足的空模板判为 done | `node .specforge/tools/artifact-graph-status.mjs` |
| 核心文档和模板已中文化 | 人工检查核心入口、rules、skills、templates |
