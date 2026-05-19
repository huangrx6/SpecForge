---
name: sf-close
description: 完成 SpecForge 关闭阶段；用于当前 workflow 已到 wiki_sync / closure，需要 Wiki sync、release、rollback、doctor、archive dry-run 和 archive 时。
---

# sf-close

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

关闭 work item：同步长期知识、写发布和回滚记录、归档。它是防止文档过期和发布风险悬空的最后一道门。

## 内部技能母本

- Wiki 同步前读取 `.specforge/core/workflows/stages/wiki-sync/SKILL.md`。
- Closure 前读取 `.specforge/core/workflows/stages/closure/SKILL.md`。
- 涉及长期方向、项目约束或维护者规则时读取 `.specforge/core/workflows/stages/steering/SKILL.md`。
- wiki_sync 与 closure 的长期知识判断、发布记录、回滚记录和归档完成标准以内置母本为准。

## 关联标准

- `.specforge/core/standards/workflow.md`：Wiki sync、archive 前置、下游重新验证和关闭记录。
- `.specforge/core/standards/wiki.md`：长期项目知识回写。
- `.specforge/core/standards/engineering.md`：release、rollback 和上线准备。

## 动作

0. 查看当前 ready artifact：

```bash
node .specforge/core/scripts/instructions.mjs
```

1. 如果 ready artifact 是 `wiki_sync`，生成 Wiki sync：

```bash
node .specforge/core/scripts/create-artifact.mjs wiki_sync
```

2. 判断是否影响 `.specforge/wiki/`：
   - 功能状态。
   - API / 数据模型。
   - 架构现状。
   - 安全模型。
   - 部署方式。
   - ADR / 长期决策。
3. 回写受影响的 wiki 长期事实，或明确说明不更新原因。
4. 批准 Wiki gate：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync APPROVED --evidence 06-close/wiki-sync.md
```

5. 如果 ready artifact 是 `closure`，生成 closure：

```bash
node .specforge/core/scripts/create-artifact.mjs closure
```

6. 写 `release.md` 和 `rollback.md`：
   - release 写交付摘要、发布步骤、发布前检查、发布后观察。
   - rollback 写触发条件、回滚步骤、数据 / 配置回退、回滚后验证。
   - 不涉及生产发布也必须写 N/A 理由。
   - release / rollback 必须引用 verification、wiki_sync、implementation report 中的证据和残余风险；不能凭空声明可发布或可回滚。
7. 如果当前仓库是 SpecForge 本体，且本次 work item 修改了 `core/workflows/stages/**` 或 `agent-skills/sf*/SKILL.md`，只在 release 备注中提示“需要用户另行决定是否同步安装到 Codex / Claude Code / cc-switch / Trae CN”，不要自动执行安装命令。

8. 归档前检查：

```bash
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/archive-work.mjs --dry-run
```

9. 归档：

```bash
node .specforge/core/scripts/archive-work.mjs
```

## 完成标准

- `wiki-sync.md`、`release.md`、`rollback.md` 都存在。
- wiki_sync gate 为 `APPROVED`。
- verification 残余风险、release 观察点、rollback 触发条件三者已对齐。
- doctor 和 archive dry-run 通过。
- archive 成功，registry 已更新。

## 不做

- 不在 Wiki 未同步时 archive。
- 不把动态 work item 内容复制进规则目录。
- 不自动安装 / 同步外部 Agent 技能副本；除非用户单独明确要求。
