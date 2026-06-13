# SpecForge Core

`core/` 是 SpecForge 的可分发运行时母本。它包含流程定义、标准、技术选择卡、脚本、模板和经过审查的辅助 skill。

## 目录职责

| 目录 | 放什么 | 不放什么 |
|---|---|---|
| `artifacts/` | artifact schema 和模板 | 阶段规则、长期项目知识 |
| `workflows/` | workflow DAG 和流程定义 | 阶段规则、具体项目事实、第三方 skill 内容 |
| `standards/` | 跨阶段的原则、门禁、证据和质量标准 | 技术选择卡、一次性执行计划 |
| `profiles/` | 可复用技术选择卡 | 长篇教程、UI 视觉规范 |
| `scripts/` | CLI 后端脚本和共享库 | 项目业务脚本、一次性迁移脚本 |
| `skills/` | 经过审查的辅助 skill 快照 | SpecForge 入口 skill |
| `hooks/` | gate / close 事件 hook | 普通验证脚本 |

## 阅读顺序

1. 想知道当前怎么推进：读 `standards/workflow.md` 和 `standards/stage-playbook.md`。
2. 想知道某阶段怎么做：读 `.specforge/skills/<stage-owner>/stages/<stage>/SKILL.md`。
3. 想知道脚本怎么用：读 `scripts/README.md`。
4. 想选技术栈：读 `profiles/README.md` 和对应 profile。
5. 想调用 UI / 研究 / 测试等辅助能力：读 `core/skills/ORCHESTRATION.md`。

## 维护原则

- `workflows/` 定义“流程怎么走”，`standards/` 定义“什么算好”，`profiles/` 定义“技术怎么选”。
- 长文只保留在必须作为事实源的位置；日常阅读入口要给地图、决策表和下一步命令。
- 新增内容前先判断是否已有相同职责文件。重复概念优先合并、引用或改名，不继续堆叠。
- 会影响已初始化项目的路径变更，必须先保留兼容入口，再同步 starter 并跑验证。
