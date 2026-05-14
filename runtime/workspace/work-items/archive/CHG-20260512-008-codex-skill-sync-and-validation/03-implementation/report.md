# 实现报告

## 摘要

已完成 Codex skill 校验和同步：

- `validate:skills` 现在检查 21 个 repo-local skills 的 frontmatter、目录名、description 和 npm script 引用。
- 早期内部阶段 skill 已补齐 `name` 和 `description`。
- `sync:codex-skills` 默认 dry-run，默认只选择 `specforge` 与 `specforge-*`。
- 已执行 `sync:codex-skills -- --apply`，将 10 个 SpecForge AI 入口 skills 写入 `~/.codex/skills/specforge*`。
- `doctor` 已纳入 skill 校验。

## 变更内容

- 新增 `.specforge/tools/validate-skills.mjs`。
- 新增 `.specforge/tools/sync-codex-skills.mjs`。
- 更新 `.specforge/tools/doctor.mjs`。
- 更新 README、AI 使用文档、validation model、feature list。
- 新增 ADR-0008。

## 审查提示

- 重点审查 sync 默认范围是否只包含 `specforge` 命名空间。
- 重点审查 `validate:skills` 是否能发现未知 npm script 引用。
- 重点确认全局目录未创建 `~/.codex/skills/requirements`。
