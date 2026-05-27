---
name: sf-close
description: 完成 SpecForge 关闭阶段；用于当前 workflow 已到 wiki_sync / closure，需要 Wiki sync、release、rollback、doctor、archive dry-run 和 archive 时。
---

# sf-close

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

`sf-close` 完成 work item 的最后收口：同步长期知识、写发布和回滚记录、跑归档前检查、归档。关闭不是“结束对话”，而是确认知识、发布风险和回退路径都已经落地。

## 必读

- `references/closure-playbook.md`：wiki sync 判断、release / rollback 对账、archive 和安装提示边界。
- `.specforge/core/workflows/stages/wiki-sync/SKILL.md`
- `.specforge/core/workflows/stages/closure/SKILL.md`
- `.specforge/core/artifacts/templates/wiki-sync.md`
- `.specforge/core/artifacts/templates/release.md`
- `.specforge/core/artifacts/templates/rollback.md`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/wiki.md`
- `.specforge/core/standards/engineering.md`

## 启动扫描

运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

按 ready artifact 分流：

| Ready artifact | 动作 |
|---|---|
| `wiki_sync` | 执行 Wiki sync，批准后继续看下一步 route |
| `closure` | 写 release / rollback，doctor，archive dry-run，archive |
| 其他 | 停止，按 `instructions.mjs` 路由到对应阶段 |

## Wiki Sync

1. 生成 artifact：

```bash
node .specforge/core/scripts/create-artifact.mjs wiki_sync
```

2. 读取 implementation、code review、verification、requirements / gap report、ui design、technical design。
3. 判断是否影响长期知识：
   - 产品规则、用户流程、术语。
   - UI 设计系统、PC 端规范、页面规则。
   - 架构、模块边界、API、事件、SDK。
   - 数据模型、配置、权限、安全。
   - 运行、发布、回滚、可观测性。
   - 决策、风险、技术债。
4. 更新 `.specforge/wiki/` 中当前知识文件，或在 `06-close/wiki-sync.md` 写明不更新理由。
5. 批准 gate：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync APPROVED --evidence 06-close/wiki-sync.md
```

## Closure

1. 生成 artifact：

```bash
node .specforge/core/scripts/create-artifact.mjs closure
```

2. 写 `06-close/release.md`：
   - 交付摘要。
   - 影响范围。
   - 发布前检查。
   - 发布步骤或 N/A 理由。
   - 发布后观察点。
   - 引用 verification、wiki sync、implementation report、code review。

3. 写 `06-close/rollback.md`：
   - 回滚触发条件。
   - 回滚步骤。
   - 数据 / 配置 / feature flag / 外部服务回退。
   - 回滚后验证。
   - 不可回滚时写原因、风险接受人和补偿措施。

4. 归档前检查：

```bash
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/archive-work.mjs --dry-run
```

5. 归档：

```bash
node .specforge/core/scripts/archive-work.mjs
```

## 判定表

| 条件 | 状态 |
|---|---|
| verification gate 未批准 | 停止，回 `sf-verify` |
| wiki_sync gate 未批准且 ready 已到 closure | 停止，先做 wiki sync |
| release / rollback 缺少 verification 残余风险或观察点对账 | 停止，补齐 |
| rollback 无触发条件或不可回滚未写补偿 | 停止，补齐 |
| doctor 或 archive dry-run 失败 | 停止，按错误处理 |
| hook 阻断关闭 | 停止，按 hook 说明处理 |

## 完成标准

- `06-close/wiki-sync.md` 存在，wiki_sync gate 为 `APPROVED`。
- `06-close/release.md`、`06-close/rollback.md` 已填写，不是空模板。
- verification 残余风险、release 观察点、rollback 触发条件互相对齐。
- doctor 和 archive dry-run 通过。
- archive 成功，work item 从 active 移到 archive，registry 状态正确。

## 不做

- 不在 Wiki 未同步时 archive。
- 不把动态 work item 内容复制进规则目录。
- 不自动安装 / 同步 Agent 技能到 Codex / Claude Code / cc-switch / Trae CN；如需安装，必须由用户单独明确要求。
- 不用 release / rollback 替代 verification evidence。
