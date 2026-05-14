# 原始请求

用户要求继续推进 SpecForge 仓库目录结构重组。当前结构存在根级 `specforge-*` 技能平铺、`.specforge/` 作为仓库母本与业务项目副本同名、`.specforge/skills/` 与根级 Agent skills 语义重叠、`specforge-onboard/assets/starter/.specforge/` 嵌套过深、根级文档和 CLI 散乱等问题。

用户提出的目标方向：

- 将根级 `specforge-*` 聚合到 `skills/`，并采用 `sf-*` 前缀，便于在 AI 中输入 `sf` 后发现全部相关技能。
- 将仓库母本 `.specforge/` 改为语义更清楚的 `runtime/`，区别于业务项目中的 `.specforge/` 副本。
- 将内部阶段母本从 `runtime/skills/` 改为 `runtime/stages/`，避免与 Agent 入口技能重名。
- 将 `specforge-onboard/assets/starter/.specforge/` 扁平化为顶层 `starter/`。
- 将维护者文档和适配说明迁移到 `docs/`，CLI 迁移到 `cli/`。
- 重新思考 `runtime/` 内部结构，按信息流动方向拆分为 policy、artifacts、execution、workspace。
- 设计 hooks：`tools/` 主动调用，`hooks/` 被生命周期事件触发；默认 noop，业务项目可覆盖以接入 Slack / CI / Jira 等。
- 明确 commands 的定位：commands 是 Agent / slash command 快捷入口卡片，不是规则也不是底层工具。
