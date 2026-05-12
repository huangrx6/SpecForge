# 实现计划

## 范围

本阶段落地 SpecForge AI 使用入口层：

- `specforge` 根技能。
- `specforge-*` 生命周期子技能。
- `doctor` 健康检查命令。
- `specforge.doctor` 和 `specforge.work` command card。
- AI 使用文档、README、AGENTS 和 SSoT 更新。

## 步骤

- [x] 新增根技能 `.specforge/skills/specforge/SKILL.md`。
- [x] 新增子技能：onboard、intake、spec、implement、review、verify、close、doctor、work。
- [x] 新增 `.specforge/tools/doctor.mjs` 和 `node .specforge/tools/doctor.mjs`。
- [x] 新增 command cards：`specforge.doctor`、`specforge.work`。
- [x] 更新 `.specforge/AGENTS.md` 和 README。
- [x] 新增 `docs/ai-usage.md`。
- [x] 新增 ADR-0007。
- [x] 更新 validate required paths。
- [ ] 完成 review、verification、closure 并归档。

## 预计变更文件

| Path | Reason |
|---|---|
| `.specforge/skills/specforge/SKILL.md` | AI 根入口 |
| `.specforge/skills/specforge-*/SKILL.md` | 生命周期子技能 |
| `.specforge/tools/doctor.mjs` | 健康检查命令 |
| `.specforge/commands/specforge.doctor.md` | doctor command card |
| `.specforge/commands/specforge.work.md` | 一键推进 command card |
| `docs/ai-usage.md` | AI 使用说明 |
| `.specforge/project/decisions/ADR-0007-ai-skill-entry.md` | 架构决策 |
