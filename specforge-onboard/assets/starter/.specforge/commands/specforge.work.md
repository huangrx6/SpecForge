# specforge.work

一键推进模式：让 Agent 尽量从用户诉求推进到可验证产物，但不绕过 SpecForge gate。

## 使用时机

- 用户说“继续做完”、“一直运行下去”、“自动推进”。
- 任务范围较小，且用户希望减少中间确认。

## 规则

- 必须先运行 `node .specforge/tools/doctor.mjs`。
- 没有 active change 时，先创建 change。
- 每个 artifact 仍由 workflow graph 解锁。
- required gate 仍必须有 evidence。
- verification 和 SSoT sync 不能省略。
- archive 前必须 `node .specforge/tools/validate-structure.mjs` 通过。

## 推荐命令序列

```bash
node .specforge/tools/doctor.mjs
node .specforge/tools/instructions.mjs
node .specforge/tools/create-artifact.mjs <ready-artifact>
node .specforge/tools/gate.mjs <gate> APPROVED --evidence <path>
node .specforge/tools/archive-change.mjs
```

## 停止条件

- 出现 `[NEEDS CLARIFICATION]`。
- gate 需要人工判断。
- doctor、validate 或 selftest 失败。
- 变更触及安全、权限、数据迁移、生产发布等高风险范围。
