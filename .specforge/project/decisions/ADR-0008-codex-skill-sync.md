# ADR-0008: Codex Skill 校验和同步

## 状态

Accepted

## 背景

CHG-007 已经在仓库内新增 `specforge` 根技能和 `specforge-*` 生命周期子技能。但仓库内 skill 不一定会被 Codex 全局发现。为了验证真实使用链路，需要提供一个可重复的同步方式。

同时，早期内部阶段 skill 缺少 Codex frontmatter。为了避免 skill 文档和 runtime 命令漂移，需要将 skill 结构校验纳入 doctor。

## 决策

新增两类命令：

- `node .specforge/tools/validate-skills.mjs`：校验 `.specforge/skills` 中所有 `SKILL.md` 的 frontmatter、description、目录名和 npm script 引用。
- `node .specforge/tools/sync-codex-skills.mjs`：默认 dry-run，同步范围仅限 `specforge` 和 `specforge-*`。

真实同步使用：

```bash
node .specforge/tools/sync-codex-skills.mjs -- --apply
```

目标目录为：

```text
~/.codex/skills/<skill-name>/SKILL.md
```

## 后果

- SpecForge 的 AI 入口可以被同步到 Codex 全局 skills。
- 不会把 `requirements`、`design` 等通用内部 skill 名称暴露到全局，减少命名污染。
- doctor 会在每次健康检查中验证 skill 结构。
- 后续如果增加 `agents/openai.yaml` 或 UI metadata，可以在此基础上扩展。
