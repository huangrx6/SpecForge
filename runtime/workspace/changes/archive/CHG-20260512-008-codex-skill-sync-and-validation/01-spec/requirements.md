# 需求规格

## 摘要

本变更验证并落地 SpecForge 仓库内 skills 到 Codex 全局 skills 的同步方式。目标不是把所有 `.specforge/skills` 都复制出去，而是只同步 AI 入口层：`specforge` 和 `specforge-*`，避免 `requirements`、`design`、`status` 等通用命名污染全局技能空间。

同时新增 skill 校验脚本，确保每个待同步 skill 符合 Codex Skill 基本要求：目录名、frontmatter、description、引用命令和路由关系可检查。

## 边界

### 本变更负责

- 新增 `validate:skills` 脚本，检查 `.specforge/skills` 中的 `SKILL.md` 基本结构。
- 新增 `sync:codex-skills` 脚本，默认 dry-run，同步范围仅限 `specforge` 和 `specforge-*`。
- 支持 `--apply` 将 SpecForge AI 入口 skills 同步到 `~/.codex/skills`。
- 更新 `doctor`，将 skill 校验纳入健康检查。
- 更新 README、AI 使用文档、SSoT 和 Obsidian 项目状态。

### 本变更不负责

- 不同步旧的通用阶段 skill：`requirements`、`design`、`implementation` 等。
- 不修改 Codex 系统内置 skill。
- 不生成 `agents/openai.yaml`；后续需要 UI metadata 时再补。
- 不实现自动监听或双向同步。

### 依赖

- CHG-007 已新增 `specforge` 根技能和 `specforge-*` 子技能。
- Codex 技能目录约定为 `~/.codex/skills/<skill-name>/SKILL.md`。
- `package.json` 作为 runtime 命令事实源。

### 重新验证触发条件

- 新增或重命名 `specforge-*` skill。
- 修改 skill frontmatter。
- 修改 package scripts。
- 修改 sync 目标目录。

## 待澄清项

无。

## 功能需求

必要时使用 EARS 风格：

- WHEN 用户运行 `node .specforge/tools/validate-skills.mjs`, THE SYSTEM SHALL 检查所有 `.specforge/skills/**/SKILL.md` 的 frontmatter。
- IF skill 目录名与 frontmatter `name` 不一致, THE SYSTEM SHALL 校验失败。
- IF skill 缺少 `description`, THE SYSTEM SHALL 校验失败。
- IF skill 引用了不存在的 `npm run <script>`, THE SYSTEM SHALL 校验失败。
- WHEN 用户运行 `node .specforge/tools/sync-codex-skills.mjs`, THE SYSTEM SHALL 默认 dry-run，不写入全局目录。
- WHEN 用户运行 `node .specforge/tools/sync-codex-skills.mjs -- --apply`, THE SYSTEM SHALL 同步 `specforge` 和 `specforge-*` 到 `~/.codex/skills`。
- IF 目标目录已有同名 skill, THE SYSTEM SHALL 覆盖 `SKILL.md`，并输出 synced。
- WHERE 同步范围默认生效, THE SYSTEM SHALL 排除非 `specforge` 命名空间 skill。

## 非功能需求

- 同步脚本必须零第三方依赖。
- dry-run 输出必须清楚说明将写入哪些目标。
- 脚本失败必须非 0 退出。
- 不产生无关 README、安装指南或临时文件。

## 不在范围内

- 全局 skills 自动删除。
- UI metadata 生成。
- 多机器同步。
- 插件市场发布。

## 验收标准

| 标准 | 验证方式 |
|---|---|
| skill 校验通过 | `node .specforge/tools/validate-skills.mjs` |
| doctor 包含 skill 校验 | `node .specforge/tools/doctor.mjs` |
| dry-run 可看到同步目标 | `node .specforge/tools/sync-codex-skills.mjs` |
| apply 后全局目录存在 SpecForge skills | `node .specforge/tools/sync-codex-skills.mjs -- --apply` 后检查 `~/.codex/skills/specforge/SKILL.md` |
| 不同步通用旧 skill | 检查 `~/.codex/skills/requirements` 未由脚本创建 |
