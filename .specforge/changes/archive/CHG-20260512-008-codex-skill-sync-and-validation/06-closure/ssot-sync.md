# SSoT 同步

## 本变更是否影响项目 SSoT？

是。本次变更新增 skill 校验、Codex 全局同步和 doctor 校验项，影响 SpecForge 的 AI 使用和验证模型。

## 已更新文件

- `README.md`
- `docs/ai-usage.md`
- `.specforge/project/engineering/validation-model.md`
- `.specforge/project/product/feature-list.md`
- `.specforge/project/decisions/ADR-0008-codex-skill-sync.md`

## 契约变化

- 新增命令：
  - `node .specforge/tools/validate-skills.mjs`
  - `node .specforge/tools/sync-codex-skills.mjs`
- `node .specforge/tools/doctor.mjs` 增加 `validate-skills`。
- 默认同步范围限定为 `specforge` 和 `specforge-*`。

## 需要下游重新验证

- 修改任一 skill 后运行 `node .specforge/tools/validate-skills.mjs`。
- 同步前运行 `node .specforge/tools/sync-codex-skills.mjs` dry-run。
- 修改同步规则后验证 `~/.codex/skills/specforge/SKILL.md` 和非同步项。

## 未更新原因

无。

## 备注

本次已真实同步到 `/Users/huangrx6/.codex/skills/specforge*`。
