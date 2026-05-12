# 需求规格

## 摘要

本变更把 SpecForge 从“可以描述流程的目录结构”推进到“可以运行流程的轻量工作流内核”。核心目标是补齐三类能力：

- 指令生成：根据当前 change、workflow schema、artifact 依赖和 gate 状态，告诉 Agent 下一步应该读取什么、产出什么、为什么被阻塞。
- 门控更新：通过命令更新 spec/code/verification/ssot gate，避免手工编辑 `change.yaml` 造成状态不一致。
- 归档收口：把 closure 纳入 artifact 图，在 release/rollback/ssot 证据齐全后才能归档。

这次变更同时作为 SpecForge 自举实践：所有改动必须通过一个真实 change 跑完整生命周期验证。

## 边界

### 本变更负责

- 新增指令生成命令，支持默认下一步、指定 artifact、apply 模式和 JSON 输出。
- 新增 gate 更新命令，支持校验证据文件并同步 `change.yaml`。
- 新增归档命令，支持检查 archive 依赖、移动 active change、更新 registry。
- 将 `closure` 作为 `standard` workflow 的显式 artifact，输出 `release.md` 和 `rollback.md`。
- 加强结构校验：schema 依赖、模板映射、循环依赖、change 目录和生命周期状态。
- 用 CHG-005 实际运行一遍工具链，暴露并修复问题。

### 本变更不负责

- 不实现完整 CLI 包发布、npm bin、交互式 TUI 或插件市场能力。
- 不接入真实 GitHub PR、CI API、IDE extension。
- 不重构所有既有脚本到统一库，除非当前命令稳定性需要。
- 不引入外部依赖；v0.1 继续保持纯 Node.js 标准库。

### 依赖

- `.specforge/schemas/standard.json` 必须继续作为 artifact 图事实源。
- `change.yaml` 仍然是单个 change 的状态事实源。
- `.specforge/registry.yaml` 仍然是 active/archive 索引。
- 现有归档 change 必须继续通过校验。

### 重新验证触发条件

- workflow schema 增加、删除或重命名 artifact。
- gate 名称或 `change.yaml` gate 结构变化。
- registry YAML 格式变化。
- artifact 输出路径或模板映射变化。

## 待澄清项

无。

## 功能需求

必要时使用 EARS 风格：

- WHEN 用户运行 `node .specforge/tools/instructions.mjs`, THE SYSTEM SHALL 解析当前 active change，并输出下一个 ready artifact 的执行指令。
- WHEN 用户运行 `node .specforge/tools/instructions.mjs -- <artifact>`, THE SYSTEM SHALL 输出指定 artifact 的依赖、输出、gate、规则和状态。
- WHEN 用户运行 `node .specforge/tools/instructions.mjs -- apply`, THE SYSTEM SHALL 检查 `schema.apply.requires`，并输出 task 完成度和实现上下文文件。
- WHEN 用户运行 `node .specforge/tools/gate.mjs <gate> APPROVED --evidence <path>`, THE SYSTEM SHALL 校验证据存在，并更新对应 gate 状态和 evidence。
- IF gate 被设置为 `APPROVED`, THE SYSTEM SHALL 要求 evidence 非空且指向当前 change 内已存在文件。
- IF archive 依赖 artifact 未完成, THE SYSTEM SHALL 拒绝归档并列出阻塞项。
- WHEN 用户运行 `node .specforge/tools/archive-change.mjs`, THE SYSTEM SHALL 将 active change 移动到 archive，并同步更新 `.specforge/registry.yaml`。
- WHERE workflow schema 定义 artifact 输出, THE SYSTEM SHALL 要求每个输出都有模板映射。
- IF workflow schema 中存在未知依赖或循环依赖, THE SYSTEM SHALL 在 `node .specforge/tools/validate-structure.mjs` 中失败。

## 非功能需求

- 命令输出必须适合人类阅读；关键命令支持 `--json` 供后续 Agent 或 CLI 集成。
- 默认不依赖第三方包，降低 v0.1 启动成本。
- 命令失败必须给出具体阻塞原因，不能只输出泛化错误。
- 既有 archive 记录不能因为新增工具失效。
- 中文内容优先，保留必要英文术语如 artifact、gate、workflow、schema。

## 不在范围内

- 真正执行代码实现任务的 Agent runner。
- 自动生成需求、设计、任务的 LLM 集成。
- 多 workflow 的完整实现；本次只把 `standard` 跑通。
- schema JSON Schema 校验器。

## 验收标准

| 标准 | 验证方式 |
|---|---|
| 可以创建 CHG-005 并识别 requirements 为下一步 artifact | `npm run new:change` + `node .specforge/tools/instructions.mjs` |
| 可以按 artifact 图逐步生成 requirements/design/tasks/spec-review 等文件 | `node .specforge/tools/create-artifact.mjs <artifact>` |
| gate 命令能设置 APPROVED 并校验证据存在 | `node .specforge/tools/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md` |
| apply 指令能读取 tasks 并输出任务进度 | `node .specforge/tools/instructions.mjs -- apply` |
| archive 命令在 closure 完成后归档 change 并更新 registry | `node .specforge/tools/archive-change.mjs` |
| 增强校验可以通过，并覆盖 schema、registry、change evidence | `node .specforge/tools/validate-structure.mjs` |
