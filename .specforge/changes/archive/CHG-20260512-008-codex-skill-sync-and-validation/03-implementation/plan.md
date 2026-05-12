# 实现计划

## 范围

本阶段实现 SpecForge skills 的校验与 Codex 全局同步：

- 校验 repo-local skills 是否符合 Codex Skill 基本结构。
- 将 skill 校验纳入 doctor。
- 提供 dry-run / apply 同步到 `~/.codex/skills`。
- 默认只同步 `specforge` 命名空间，避免污染全局技能列表。

## 步骤

- [x] 新增 `.specforge/tools/validate-skills.mjs`。
- [x] 给早期内部阶段 skills 补齐 frontmatter。
- [x] 新增 `.specforge/tools/sync-codex-skills.mjs`。
- [x] 注册 `validate:skills` 和 `sync:codex-skills`。
- [x] 将 skill 校验加入 `doctor`。
- [x] 更新 README、AI 使用文档、validation model、feature list、ADR-0008。
- [x] 执行 `sync:codex-skills -- --apply` 同步全局 skills。
- [ ] 完成 review、verification、closure 并归档。

## 预计变更文件

| Path | Reason |
|---|---|
| `.specforge/tools/validate-skills.mjs` | Skill 结构和命令引用校验 |
| `.specforge/tools/sync-codex-skills.mjs` | Codex 全局 skill 同步 |
| `.specforge/tools/doctor.mjs` | 纳入 skill 校验 |
| `package.json` | 新增 npm scripts |
| `.specforge/skills/*/SKILL.md` | 补齐 frontmatter |
| `README.md` | 增加同步说明 |
| `docs/ai-usage.md` | 增加同步到 Codex 说明 |
| `.specforge/project/decisions/ADR-0008-codex-skill-sync.md` | 记录决策 |
