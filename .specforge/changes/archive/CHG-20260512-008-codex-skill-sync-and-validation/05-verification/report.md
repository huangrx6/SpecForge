# 验证报告

## 范围

验证 skill 校验、doctor 集成、Codex 全局 skill 同步和命名空间保护。

## 命令

- `node .specforge/tools/validate-skills.mjs`
- `node .specforge/tools/doctor.mjs`
- `node .specforge/tools/sync-codex-skills.mjs`
- `node .specforge/tools/sync-codex-skills.mjs -- --apply`
- `test -f /Users/huangrx6/.codex/skills/specforge/SKILL.md`
- `test ! -e /Users/huangrx6/.codex/skills/requirements`

## 结果

- `validate:skills` 通过，检查 21 个 skills 和 npm script 引用。
- `doctor` 通过，并包含 `validate-skills`。
- `sync:codex-skills` dry-run 输出 10 个 `specforge` 命名空间 skills，目标为 update。
- `sync:codex-skills -- --apply` 已成功写入全局 Codex skills。
- 已验证 `~/.codex/skills/specforge/SKILL.md` 和 `~/.codex/skills/specforge-work/SKILL.md` 存在。
- 已验证未创建 `~/.codex/skills/requirements`。

## 边界检查

- 同步范围未包含旧内部通用 skills。
- 未修改 Codex 系统内置 skills。
- 未引入第三方依赖。
- 写入全局目录需要显式 `--apply`。

## 重新验证触发条件

- 新增或重命名 `specforge-*` skill。
- 修改 skill frontmatter。
- 修改 package scripts。
- 修改 sync 目标目录或默认过滤规则。

## Evidence

- `05-verification/ci-result.md`
- `/Users/huangrx6/.codex/skills/specforge/SKILL.md`
- `/Users/huangrx6/.codex/skills/specforge-work/SKILL.md`

## 已知缺口

- 当前没有生成 `agents/openai.yaml` UI metadata。
- 当前同步是单向覆盖 `SKILL.md`，没有 backup 和删除策略。
