# AI 使用方式

SpecForge 面向 AI Agent 使用时分三层：

| 层 | 入口 | 职责 |
|---|---|---|
| 全局根技能 | `specforge` | 扫描仓库、判断状态、路由到一个子技能 |
| 全局子技能 | `specforge-*` | 执行生命周期中的一个阶段 |
| 项目内运行时 | `.specforge/tools/*.mjs` | 创建、校验、生成 artifact、更新 gate、归档 |

## 先安装全局技能

在 SpecForge 源码仓库执行：

```bash
node .specforge/tools/install-agent-skills.mjs --target codex --apply
node .specforge/tools/install-agent-skills.mjs --target claude-code --apply
node .specforge/tools/install-agent-skills.mjs --target cc-switch --apply
```

目标说明：

| target | 默认路径 |
|---|---|
| `codex` | `~/.codex/skills` |
| `claude-code` | `~/.claude/skills` |
| `cc-switch` | `~/.cc-switch/skills` |

## 再初始化项目

进入业务项目，对已安装技能的 AI 工具说：

```text
specforge-onboard
```

它会初始化：

```text
.specforge/
```

## 标准入口

用户只说“继续”“现在到哪一步”“做一个新需求”时，AI 应先加载全局 `specforge` 技能。

根技能会运行或读取：

```bash
node .specforge/tools/doctor.mjs
node .specforge/tools/instructions.mjs
```

然后只路由到一个子技能。

## 技能到命令映射

| 技能 | 常用命令 |
|---|---|
| `specforge-doctor` | `node .specforge/tools/doctor.mjs` |
| `specforge-intake` | `node .specforge/tools/create-change.mjs "Title"` |
| `specforge-spec` | `node .specforge/tools/instructions.mjs`, `node .specforge/tools/create-artifact.mjs requirements/design/tasks/spec_review` |
| `specforge-implement` | `node .specforge/tools/instructions.mjs -- apply`, `node .specforge/tools/create-artifact.mjs implementation` |
| `specforge-review` | `node .specforge/tools/create-artifact.mjs spec_review/code_review`, `node .specforge/tools/gate.mjs ...` |
| `specforge-verify` | `node .specforge/tools/create-artifact.mjs verification`, `node .specforge/tools/gate.mjs verification ...` |
| `specforge-close` | `node .specforge/tools/create-artifact.mjs ssot_sync/closure`, `node .specforge/tools/archive-change.mjs` |
| `specforge-work` | 循环调用 doctor、instructions、对应子技能 |
