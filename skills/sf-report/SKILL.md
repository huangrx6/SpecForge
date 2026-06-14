---
name: sf-report
description: 生成或刷新 SpecForge HTML 阅读报告；用于用户说“生成 HTML 报告 / 看当前需求进展 / 整理成页面 / 生成评审材料 / 只看 requirements、ui design、technical design、verification 等模块”时。用户不指定模块时自动关联当前 active work item；指定模块时生成报告并返回对应 HTML 锚点，不要求用户记命令。
---

# sf-report

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，必须先定位宿主项目根：项目根是“包含 `.specforge/` 目录的业务项目目录”，不是 `.specforge/` 目录本身。若当前目录是 `.specforge/` 或其任意子目录，先 `cd ..` 回到宿主项目根；若当前目录是 `frontend/`、`backend/` 等子目录，也先向上回到包含 `.specforge/` 的项目根。禁止从 `.specforge/` 内执行 `node .specforge/core/scripts/...`，否则会形成 `.specforge/.specforge/...` 的错误路径。

`sf-report` 是面向非命令行用户的 HTML 阅读层入口。用户只需要自然语言说明想看什么；命令是 Agent 内部执行细节，不要求用户记忆。

## 启动扫描

先运行：

```bash
node .specforge/core/scripts/status.mjs
```

如果需要判断当前 work item、route、blocker 或质量状态，再运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

如果没有 active work item：

- 用户指定了归档 work item id：用 `--work-item <id>` 生成。
- 用户没有指定：说明当前没有 active work item，并建议用户先选择一个 work item 或说“生成最近归档需求的报告”。不要创建新 work item。

## 用户意图识别

| 用户说法 | 目标 |
|---|---|
| “生成当前需求 HTML / 报告 / 页面 / 评审材料” | 生成当前 work item 总览 HTML |
| “生成评审包 / 交付包 / 给别人看的材料” | 运行 `workflow-package.mjs`，生成 HTML + handoff + review package |
| “只看 requirements / 需求” | 生成总览 HTML，并返回 `#artifact-requirements` |
| “只看 UI / ui design / 原型” | 生成总览 HTML，并返回 `#artifact-ui_design` |
| “只看技术方案 / technical design” | 生成总览 HTML，并返回 `#artifact-technical_design` |
| “只看 tasks / 任务” | 生成总览 HTML，并返回 `#artifact-tasks` |
| “只看实现 / implementation” | 生成总览 HTML，并返回 `#artifact-implementation` |
| “只看 code review / review” | 生成总览 HTML，并返回 `#artifact-code_review` |
| “只看 verification / 验证 / 测试” | 生成总览 HTML，并返回 `#artifact-verification` |
| “只看 wiki / 知识沉淀” | 生成总览 HTML，并返回 `#artifact-wiki_sync` |
| “只看关闭 / 发布 / 回滚” | 生成总览 HTML，并返回 `#artifact-closure` |
| “质量 / 风险 / blocker” | 生成总览 HTML，并返回 `#quality-suite` 或 `#warnings` |
| “决策点 / 需要人工确认” | 生成总览 HTML，并返回 `#decision-checkpoints` |

短期实现中，模块级报告通过 HTML 锚点聚焦；Markdown artifact 仍是事实源，HTML 是派生阅读层。不要承诺已生成独立的单模块 HTML 文件，除非脚本后续支持。

## 样式与一致性

生成 HTML 时应保持统一的 SpecForge 报告风格：

- 使用 `render-work-report.mjs` 生成，不手写临时 HTML。
- 默认设计语言采用 `政企可信风 + 日式留白 + 高效工具感`：可信、清晰、克制、证据优先，不做营销页或炫技页。
- 保持同一套 semantic token、状态颜色、卡片、表格、代码块和导航样式。
- 密度默认 `comfortable`，表格和代码证据区接近 `compact`；不要把每个 section 都做成大留白宣传块。
- 动效只用于导航、hover、状态反馈和轻微层级变化；遵守 `prefers-reduced-motion`，不要做大幅飞入、弹跳或旋转。
- 报告首屏优先展示 Action Board、当前状态、下一步、质量和风险，不把长表堆到第一屏。
- 用户指定模块时，只返回同一报告的锚点，不另起一套样式。
- 如果用户要求“好看一点 / 给领导看 / 给业务看”，仍先使用统一报告模板；不要在单次任务里随意换主题、字体或颜色。
- Markdown artifact 是事实源，HTML 是阅读层；样式只服务于阅读和评审，不改变事实内容。

## 生成总览 HTML

默认生成当前 active work item 的 HTML：

```bash
node .specforge/core/scripts/render-work-report.mjs
```

指定 work item：

```bash
node .specforge/core/scripts/render-work-report.mjs --work-item <work-id>
```

默认输出：

```text
<work-item>/07-report/work-summary.html
```

生成后返回给用户：

- 报告路径。
- 如果用户指定模块，返回带锚点的路径，例如 `07-report/work-summary.html#artifact-requirements`。
- 简短说明：Markdown artifact 仍是事实源，HTML 是阅读层。
- 如果有 blocker / quality warning，提醒用户优先看 Action Board 和 Quality Suite。

## 生成评审包

当用户说“评审材料 / 交付包 / 发给别人看 / handoff / review package”时，运行：

```bash
node .specforge/core/scripts/workflow-package.mjs
```

输出包括：

- `07-report/work-summary.html`
- `07-report/handoff.md`
- `07-report/review-package.md`

返回给用户时按“先给页面，再给交接文件，再给源 artifact”的顺序说明。

## 模块锚点

常用 artifact 锚点：

| 模块 | 锚点 |
|---|---|
| PRD | `#artifact-prd` |
| Requirements | `#artifact-requirements` |
| UI Design | `#artifact-ui_design` |
| Technical Design | `#artifact-technical_design` |
| Tasks | `#artifact-tasks` |
| Spec Review | `#artifact-spec_review` |
| Implementation | `#artifact-implementation` |
| Code Review | `#artifact-code_review` |
| Verification | `#artifact-verification` |
| Wiki Sync | `#artifact-wiki_sync` |
| Closure | `#artifact-closure` |

常用报告区域锚点：

| 区域 | 锚点 |
|---|---|
| 当前行动面板 | `#action-board` |
| 当前焦点 | `#current-focus` |
| 质量套件 | `#quality-suite` |
| 工作流健康 | `#health` |
| Traceability | `#traceability` |
| Blockers / Warnings | `#warnings` |
| 决策点 | `#decision-checkpoints` |
| 决策简报 | `#decision-brief` |

## 完成标准

- 已生成或刷新 `07-report/work-summary.html`。
- 用户指定模块时，返回对应锚点路径。
- 用户要求评审材料时，同时生成 `handoff.md` 和 `review-package.md`。
- 输出不要只说“已执行命令”；要告诉用户打开哪个文件、先看哪个区域、为什么。

## 不做

- 不修改 Markdown artifact 内容，除非用户明确要求更新事实源。
- 不把 HTML 当成唯一证据。
- 不在没有 active work item 且用户未指定 work item 时自动创建新需求。
- 不要求用户手动运行命令；命令由 Agent 执行。
