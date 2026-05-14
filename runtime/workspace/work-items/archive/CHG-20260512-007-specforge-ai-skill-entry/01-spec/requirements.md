# 需求规格

## 摘要

本变更把 SpecForge 从“已有 runtime 命令”推进到“AI 可自然使用”的入口层。目标是提供类似 CodeStable `cs` 的根技能：用户只说一个需求，Agent 能先扫描仓库状态，再判断是否初始化、是否有 active change、下一步该调用哪个 SpecForge 子技能或命令。

本次优先完成 Codex Skills 风格的仓库内技能协议，不急着做跨工具插件。需要同时给出严格分阶段模式和一键推进模式的使用边界。

## 边界

### 本变更负责

- 新增 `specforge` 根技能，职责是扫描、判断和路由，不直接替子技能写完整产物。
- 新增一组 AI 面向的 `specforge-*` 技能骨架，覆盖 onboard、intake、spec、implement、review、verify、close、doctor、work。
- 新增 `doctor` 本地命令，聚合 `selftest`、`validate`、`status`、`graph:status`，便于根技能快速判断仓库健康状态。
- 新增 AI 使用文档，说明人类、技能、命令之间的关系。
- 更新 `.specforge/AGENTS.md`，明确 Agent 优先使用 `instructions` 和技能入口，而不是一次性读完整目录。
- 回写项目 SSoT 和 Obsidian 项目状态。

### 本变更不负责

- 不把技能安装到用户全局 `~/.codex/skills`。
- 不实现完整 npm package 或全局 `specforge` CLI。
- 不实现 Claude / OpenCode / Cursor 的真实适配器，只定义映射原则。
- 不让一键模式绕过 gate、evidence、verification 或 SSoT sync。

### 依赖

- CHG-005 已完成 runtime 命令：`instructions`、`gate`、`archive`。
- CHG-006 已完成 `selftest` 和 registry 一致性校验。
- `.specforge/schemas/standard.json` 继续作为 artifact graph 事实源。
- 现有 `.specforge/skills/*` 可作为阶段技能基础，但需要补 root 和命名空间层。

### 重新验证触发条件

- 修改技能路由表。
- 修改 `doctor` 命令。
- 修改 `AGENTS.md` 加载顺序。
- 新增或重命名 `.specforge/skills/specforge-*`。

## 待澄清项

无。

## 功能需求

必要时使用 EARS 风格：

- WHEN 用户触发 `specforge`, THE SYSTEM SHALL 扫描当前仓库是否已存在 `.specforge/` 和 `.specforge/registry.yaml`。
- WHEN 仓库未初始化, THE SYSTEM SHALL 路由到 `specforge-onboard`，不得继续执行 change 流程。
- WHEN 仓库已有 active change, THE SYSTEM SHALL 读取 `change.yaml` 和 `node .specforge/tools/instructions.mjs` 的结果，判断下一步阶段。
- WHEN 用户诉求是新需求, THE SYSTEM SHALL 路由到 `specforge-intake` 或 `specforge-spec`，而不是直接实现。
- WHEN 用户诉求是“下一步”或“继续”, THE SYSTEM SHALL 根据 active change 和 artifact graph 路由。
- WHEN 用户诉求是检查健康度, THE SYSTEM SHALL 路由到 `specforge-doctor`。
- WHEN 用户诉求是“一直做完”或“自动推进”, THE SYSTEM SHALL 路由到 `specforge-work`，但仍保留 gate 和 evidence。
- IF required gate 未通过, THE SYSTEM SHALL 不允许进入后续阶段。
- IF `doctor` 检查失败, THE SYSTEM SHALL 先报告结构或自测问题，不继续执行实现。

## 非功能需求

- Skill 文档要短，遵守 progressive disclosure：根技能只放路由和硬规则，阶段细节放子技能。
- 技能命名使用小写短横线，便于 Codex、Claude 和 OpenCode 映射。
- 命令输出要能被 Agent 快速读懂。
- 所有新增文档优先中文，保留必要英文术语。

## 不在范围内

- 完整工具市场分发。
- 跨 AI 工具真实插件打包。
- 自动生成全部项目实现代码的 runner。
- 无人审批的生产级自动发布。

## 验收标准

| 标准 | 验证方式 |
|---|---|
| 根技能存在且职责清楚 | 查看 `.specforge/skills/specforge/SKILL.md` |
| 子技能骨架覆盖完整生命周期 | 查看 `.specforge/skills/specforge-*/SKILL.md` |
| `doctor` 可以聚合健康检查 | `node .specforge/tools/doctor.mjs` |
| `validate` 覆盖新增技能和命令 | `node .specforge/tools/validate-structure.mjs` |
| AI 使用说明存在 | 查看 `docs/ai-usage.md` |
| 全流程通过 SpecForge 自举归档 | `node .specforge/tools/archive-change.mjs` |
