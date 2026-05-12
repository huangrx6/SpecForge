# 回滚记录

## 回滚触发条件

- `validate:skills` 对正常 skill 产生误报。
- `sync:codex-skills` 同步范围错误，污染全局技能目录。
- `doctor` 因 skill 校验误失败。

## 回滚步骤

- 从 `package.json` 移除 `validate:skills` 和 `sync:codex-skills`。
- 从 `.specforge/tools/doctor.mjs` 移除 `validate-skills` check。
- 删除 `.specforge/tools/validate-skills.mjs` 和 `.specforge/tools/sync-codex-skills.mjs`。
- 从 `.specforge/tools/validate-structure.mjs` 移除新增 required paths。
- 恢复 README、AI 使用文档、validation model、feature list 和 ADR-0008 相关内容。
- 如需清理全局同步结果，删除 `/Users/huangrx6/.codex/skills/specforge*`。

## 回滚后验证

- `node .specforge/tools/doctor.mjs`
- `node .specforge/tools/validate-structure.mjs`
