---
name: sf-work
description: SpecForge 一键推进模式；用于用户明确要求“继续做完”“自动推进”“不要停”，但仍必须保留 gate、evidence、verification 和 archive 纪律。
---

# sf-work

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

一键推进模式。它不是跳过流程，而是自动循环调用正确的 `sf-*` 子技能。`sf-work` 可以减少用户手动输入，但不能替用户做产品确认、风险接受、gate 审查或缺证据批准。

## 启动

```bash
node .specforge/core/scripts/doctor.mjs
```

## 内部技能母本

每轮自动推进前，读取 `.specforge/core/workflows/stages/status/SKILL.md` 判断当前 ready artifact，再交给对应 `sf-*` 子技能；阶段细节由子技能继续读取自己的内部母本。

## 关联标准

- `.specforge/core/standards/workflow.md`：ready artifact、required gate、scope 和停止条件。
- `.specforge/core/standards/engineering.md`：verification evidence 和高风险变更暂停。

## 循环

0. 每轮先运行：

```bash
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/instructions.mjs
node .specforge/core/scripts/artifact-graph-status.mjs
```

1. 判断当前 ready artifact。
2. 对 ready artifact 调用对应子技能：
   - requirements：先检查 `00-intake/brief.md#PRD 决策`；如果 `PRD required: yes` 或表格中 `PRD required | yes`，且 `00-intake/prd.md` 不存在、`Decision Status` 不是 `approved-for-requirements`，或仍有 `[NEEDS PRODUCT DECISION]`，先调用 `sf-prd`；否则调用 `sf-requirements`
   - gap_report：`sf-discovery`
   - research：`sf-discovery`
   - ui_design：`sf-ui-design`
   - technical_design：`sf-tech-design`
   - tasks：`sf-tasking`
   - spec_review：`sf-spec-review`
   - implementation：`sf-implement`
   - code_review：`sf-code-review`
   - verification：`sf-verify`
   - wiki_sync：`sf-wiki`
   - closure：`sf-close`
3. 每完成一个 gate 或阶段后再次运行 doctor 和 `instructions.mjs`。
4. ready artifact 进入 `closure` 后交给 `sf-close`，由 `sf-close` 负责 release、rollback、archive dry-run 和 archive。
5. archive 成功后停止，并输出已完成 artifact、gate、验证和归档路径。

## 机器检查纪律

`sf-work` 的“不跳过 gate”不能只靠口头承诺。每一轮推进都要使用工具脚本确认状态：

```bash
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/instructions.mjs
node .specforge/core/scripts/artifact-graph-status.mjs
```

遇到 gate artifact 时，必须先生成对应 evidence 文件，再由对应子技能按自己的审查规则调用：

```bash
node .specforge/core/scripts/gate.mjs <gate> APPROVED --evidence <path>
```

如果 `instructions.mjs` 显示依赖未满足、gate 不是 `APPROVED`、artifact 是 `blocked` / `partial`，或者 doctor 失败，必须停止并说明阻断原因。不要通过手写总结替代 gate evidence。

每轮推进都要更新或检查对应 artifact 文件；如果子技能只能给建议，不能产出完整证据，`sf-work` 必须暂停让用户决策。

## 必须暂停

- 出现 `[NEEDS CLARIFICATION]`。
- 当前 work item 是 `standard` / `feature` / `issue` 但 brief 缺少代码探索、外部研究 / 跳过理由、澄清记录或分析综合。
- feature / standard 的 brief 标记需要 PRD，但 `00-intake/prd.md` 不存在、`Decision Status` 不是 `approved-for-requirements`，或仍有产品决策阻塞。
- 产品、页面、全栈应用的功能候选池或 MVP 组合尚未被用户确认。
- 有用户可见页面但缺少页面地图、线稿 / 原型、视觉风格确认或交互状态。
- 技术栈、组件库、编辑器、数据层或测试方案没有 profile / 取舍理由。
- spec_review / code_review 发现 P0 / P1 阻断项。
- gate 需要用户判断、产品取舍、风险接受或上线确认。
- doctor、validate、selftest 失败。
- 变更触及生产发布、安全、权限、数据迁移或高风险外部影响。
- 需要安装依赖、访问网络、执行破坏性命令但未获确认。
- `sf-close` 提示需要同步安装到 Codex / Claude Code / cc-switch；该动作必须单独等待用户明确要求。

## 完成标准

- work item 归档。
- `node .specforge/core/scripts/validate-structure.mjs` 通过。
- 最终说明完成了哪些 artifact、哪些 gate、验证结果。
- 不存在未记录的 wiki / release / rollback 缺口。

## 不做

- 不为了“自动推进”跳过审查。
- 不隐瞒测试失败或未验证状态。
- 不自动安装 / 同步 Agent 技能副本到外部工具。
