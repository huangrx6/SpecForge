# SpecForge Claude Code 专用指令

先阅读 `AGENTS.md`。本文件只补充 Claude Code 在 SpecForge 仓库和已安装 SpecForge 的业务项目中的专用行为约束。

## 在本仓库开发时

需要以仓库维护者视角检查时，优先使用 package scripts：

```bash
npm run selftest
npm run validate:skills
npm run validate
npm run doctor
```

业务项目中也可以直接运行底层工具命令：

```bash
node .specforge/tools/doctor.mjs
node .specforge/tools/instructions.mjs
node .specforge/tools/gate.mjs <gate> APPROVED --evidence <path>
node .specforge/tools/archive-change.mjs
```

修改根级技能时，要保持对应 `.specforge/skills/*/SKILL.md` 一致。内部 skill 是阶段行为母本，根级 skill 是可安装的运行时指令。

## 在业务项目中使用时

常规对话入口是：

```text
specforge
```

如果用户已经知道阶段，也可以直接调用生命周期技能，例如 `specforge-intake`、`specforge-spec`、`specforge-verify`。

## 门禁处理

不要在对话中模拟门禁结果。先用下面的命令检查当前 change：

```bash
node .specforge/tools/instructions.mjs
node .specforge/tools/artifact-graph-status.mjs
```

只有写好对应证据文件后，才能批准门禁：

```bash
node .specforge/tools/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
```

如果门禁被阻断，说明阻断原因，并路由回需要修改的 artifact。不要继续进入下一个生命周期阶段。

## 禁止行为

- 不要把 archived change 当作当前上下文，除非任务明确要求历史证据。
- `spec_review` 未批准前，不要开始实现。
- `verification`、`ssot_sync` 和 `closure` 条件未满足前，不要 archive。
- 除非用户要求仓库打包或源码改动，不要在 `.specforge/` 之外新增项目资产。
