---
name: closure
description: SpecForge 内部关闭技能。用于 wiki_sync 已批准后，写 release、rollback，确认归档前置条件，并执行 work item archive。
---

# 关闭技能

本技能完成 work item 的最后收口：发布说明、回滚方案、归档检查和 archive。关闭不是“结束对话”，而是确认长期知识、发布风险和回退路径都已经落地。

## 前置条件

- `verification` gate 为 `APPROVED`。
- `wiki_sync` gate 为 `APPROVED`，且 evidence 指向 `06-close/wiki-sync.md`。
- `node .specforge/core/scripts/wiki-update-plan.mjs --json` 已执行；若 `can_write_na=false`，`06-close/wiki-sync.md` 必须列出更新文件或阻断原因。
- `node .specforge/core/scripts/wiki-quality.mjs --mode close` 无 `FAIL`。
- `node .specforge/core/scripts/instructions.mjs` 显示 ready artifact 为 `closure`。

## 读取

- `work.yaml`
- `06-close/wiki-sync.md`
- `05-verification/report.md`
- `04-code-review/code-review-v1.md`
- `03-implementation/report.md`
- `03-implementation/changed-files.md`
- `01-spec/technical-design.md`（存在时，用于 release observation、rollback seam、owner、revisit trigger）
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/wiki.md`
- `.specforge/core/standards/engineering.md`
- `.specforge/core/standards/ai-toolkit.md`
- `.specforge/core/skills/code-intelligence/SKILL.md`（归档前需要根据 diff / impact 确认 Wiki 是否还有长期事实未同步时）

## 写入

- `06-close/release.md`
- `06-close/rollback.md`
- 归档成功后移动 work item 到 `.specforge/work/archive/`
- 更新 `.specforge/registry.yaml`

## 关闭流程

1. **创建 closure artifact**

   ```bash
   node .specforge/core/scripts/create-artifact.mjs closure
   ```

2. **写 release**
   - 摘要本次交付了什么、影响哪些用户 / 模块 / 环境。
   - 记录发布前检查、发布步骤、发布后观察点。
   - 引用 verification gate、wiki_sync gate、implementation report 和 residual risks；不能只写“已完成”。
   - 对齐 technical design 的 release observation、owner、wiki target、technical debt 和 revisit trigger。
   - 如果 verification 包含 `manual-confirmed`、`deferred` 或外部待补证项，必须进入发布后观察点或 follow-up。
   - 如果本次不涉及生产发布，写清 N/A 理由和交付状态。

3. **写 rollback**
   - 写触发条件、回滚步骤、数据 / 配置回退、回滚后验证。
   - 如果无法回滚，必须写不可回滚原因、风险接受人和补偿措施。
   - 回滚触发条件必须覆盖 verification 残余风险、release 观察点和关键业务 / 技术指标。
   - 回滚步骤必须对齐 technical design 的 rollback seam；不能只写“回滚代码”。

4. **归档前检查**

   ```bash
   node .specforge/core/scripts/wiki-refresh-plan.mjs --from-diff --json
   node .specforge/core/scripts/wiki-update-plan.mjs --json
   node .specforge/core/scripts/wiki-quality.mjs --mode close
   node .specforge/core/scripts/doctor.mjs
   node .specforge/core/scripts/archive-work.mjs --dry-run
   ```

5. **派生 HTML 摘要（按需）**

   面向非研发评审、周报或复盘时，可以生成 `07-report/work-summary.html`，并在 release / wiki-sync 的派生报告索引中登记。该文件只用于阅读，Markdown artifacts 仍是事实源。

   ```bash
   node .specforge/core/scripts/render-work-report.mjs
   ```

6. **归档**

   ```bash
   node .specforge/core/scripts/archive-work.mjs
   ```

## 停止条件

- `verification` 或 `wiki_sync` 未批准。
- release / rollback 缺少关键事实。
- verification 残余风险没有进入 release 观察点或 rollback 触发条件。
- `wiki-update-plan` 发现 required targets 但 `wiki-sync.md` 写成 N/A。
- `wiki-quality.mjs --mode close` 仍有 `FAIL`。
- doctor 或 archive dry-run 失败。
- hook 阻断关闭。

## 完成标准

- `release.md`、`rollback.md` 已填写，不是空模板。
- release、rollback、wiki-sync 和 verification 证据互相一致。
- wiki-sync 与 `wiki-update-plan` 一致，且 `wiki-quality.mjs --mode close` 无 `FAIL`。
- release 观察点、rollback 触发条件和 verification 残余风险已对齐。
- 归档前 doctor 和 archive dry-run 通过。
- archive 成功，work item 从 active 移到 archive。
- registry 中 active / archive 状态正确。
- 关闭后发现的缺陷、遗漏、体验问题或测试漏测，不重新打开本 work item；通过 `sf-intake` 新建 follow-up work item，并用 `relations.parent` 关联本 work item id。

## 不做

- 不自动安装或同步 Agent 技能到 Codex / Claude Code / cc-switch / Trae CN；如需安装，必须由用户单独明确要求。
- 不用 release / rollback 替代 verification evidence。
- 不在 wiki_sync 未批准时归档。
