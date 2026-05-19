---
name: closure
description: SpecForge 内部关闭技能。用于 wiki_sync 已批准后，写 release、rollback，确认归档前置条件，并执行 work item archive。
---

# 关闭技能

本技能完成 work item 的最后收口：发布说明、回滚方案、归档检查和 archive。关闭不是“结束对话”，而是确认长期知识、发布风险和回退路径都已经落地。

## 前置条件

- `verification` gate 为 `APPROVED`。
- `wiki_sync` gate 为 `APPROVED`，且 evidence 指向 `06-close/wiki-sync.md`。
- `node .specforge/core/scripts/instructions.mjs` 显示 ready artifact 为 `closure`。

## 读取

- `work.yaml`
- `06-close/wiki-sync.md`
- `05-verification/report.md`
- `04-code-review/code-review-v1.md`
- `03-implementation/report.md`
- `03-implementation/changed-files.md`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/wiki.md`
- `.specforge/core/standards/engineering.md`

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
   - 如果本次不涉及生产发布，写清 N/A 理由和交付状态。

3. **写 rollback**
   - 写触发条件、回滚步骤、数据 / 配置回退、回滚后验证。
   - 如果无法回滚，必须写不可回滚原因、风险接受人和补偿措施。
   - 回滚触发条件必须覆盖 verification 残余风险、release 观察点和关键业务 / 技术指标。

4. **归档前检查**

   ```bash
   node .specforge/core/scripts/doctor.mjs
   node .specforge/core/scripts/archive-work.mjs --dry-run
   ```

5. **归档**

   ```bash
   node .specforge/core/scripts/archive-work.mjs
   ```

## 停止条件

- `verification` 或 `wiki_sync` 未批准。
- release / rollback 缺少关键事实。
- verification 残余风险没有进入 release 观察点或 rollback 触发条件。
- doctor 或 archive dry-run 失败。
- hook 阻断关闭。

## 完成标准

- `release.md`、`rollback.md` 已填写，不是空模板。
- release、rollback、wiki-sync 和 verification 证据互相一致。
- 归档前 doctor 和 archive dry-run 通过。
- archive 成功，work item 从 active 移到 archive。
- registry 中 active / archive 状态正确。

## 不做

- 不自动安装或同步 Agent 技能到 Codex / Claude Code / cc-switch / Trae CN；如需安装，必须由用户单独明确要求。
- 不用 release / rollback 替代 verification evidence。
- 不在 wiki_sync 未批准时归档。
