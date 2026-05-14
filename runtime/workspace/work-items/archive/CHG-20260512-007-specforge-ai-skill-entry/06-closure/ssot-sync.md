# SSoT 同步

## 本变更是否影响项目 SSoT？

是。本次变更新增 AI 根技能入口、生命周期子技能、doctor 命令和 AI 使用文档，属于 SpecForge 使用模型和架构方向变化。

## 已更新文件

- `README.md`
- `.specforge/AGENTS.md`
- `docs/ai-usage.md`
- `.specforge/project/product/feature-list.md`
- `.specforge/project/engineering/architecture.md`
- `.specforge/project/engineering/validation-model.md`
- `.specforge/project/decisions/ADR-0007-ai-skill-entry.md`

## 契约变化

- 新增根技能：`.specforge/skills/specforge/SKILL.md`。
- 新增生命周期子技能：`.specforge/skills/specforge-*`。
- 新增健康检查命令：`node .specforge/tools/doctor.mjs`。
- 新增一键推进边界：`specforge-work`。

## 需要下游重新验证

- 修改技能入口或子技能时运行 `node .specforge/tools/validate-structure.mjs`。
- 自动推进前运行 `node .specforge/tools/doctor.mjs`。
- 后续若安装到全局 Codex skills，需要单独验证触发行为。

## 未更新原因

无。

## 备注

本次仍保持仓库内技能协议，未做全局 skill 安装。
