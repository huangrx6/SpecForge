# 风险与技术债

## 已安装技能副本可能过期

SpecForge 的 `skills/sf*` 技能会被复制安装到 Codex、Claude Code、cc-switch 和 agents 的用户级技能目录。仓库内 `runtime/execution/stages/` 或 `skills/sf*` 更新后，`validate-skills` 只能证明仓库内映射完整，不能证明这些已安装副本已经刷新。

涉及 `runtime/execution/stages/` 或 `skills/sf*` 的改动落地后，运行：

```bash
node cli/specforge.mjs skill add --target all --apply --prune-legacy
```

否则 AI 工具可能继续读取旧版技能，引用已删除的路径或旧工作流结构。
