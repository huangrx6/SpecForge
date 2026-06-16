---
name: sf-wiki
description: 更新 SpecForge 项目 Wiki；用于用户要求“回写知识库、更新 wiki、同步 Wiki”，或 close 前需要把 work item 的长期事实沉淀到 .specforge/wiki/*.md 时。
---

# sf-wiki

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，必须先定位宿主项目根：项目根是“包含 `.specforge/` 目录的业务项目目录”，不是 `.specforge/` 目录本身。若当前目录是 `.specforge/` 或其任意子目录，先 `cd ..` 回到宿主项目根；若当前目录是 `frontend/`、`backend/` 等子目录，也先向上回到包含 `.specforge/` 的项目根。禁止从 `.specforge/` 内执行 `node .specforge/core/scripts/...`，否则会形成 `.specforge/.specforge/...` 的错误路径。

`sf-wiki` 维护项目当前长期事实，不复制 work item 过程流水账。Wiki 是项目记忆，也是后续任务的入口地图，不是 implementation report、verification report 或 release note 的第二份副本。

如果用户目标是“先理解整个存量项目 / 建立项目画像 / 扫描大型代码库”，优先路由 `sf-steering`。`sf-wiki` 负责把已确认事实或完成 work item 的结论同步成当前 wiki。

## 必读

- `references/wiki-sync-rules.md`：回写判断、目标文件选择、frontmatter、index 对账、gate 决策。
- `.specforge/skills/sf-wiki/stages/wiki-sync/SKILL.md`
- `.specforge/core/artifacts/templates/wiki-sync.md`
- `.specforge/core/standards/wiki.md`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/engineering.md`
- `.specforge/core/standards/ai-toolkit.md`
- 涉及设计系统或 PC 端业务系统规范时读取 `.specforge/core/standards/design.md` 和 `.specforge/core/standards/pc-ui-design-spec.md`。
- 涉及第三方 skill 长期事实时读取 `.specforge/core/skills/ORCHESTRATION.md`，只沉淀已被 SpecForge artifact 证实的稳定内容。

## 启动扫描

1. 运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

2. 如果 ready artifact 是 `wiki_sync`，生成 evidence：

```bash
node .specforge/core/scripts/create-artifact.mjs wiki_sync
```

3. 如果 `.specforge/wiki/` 缺少基础文件，先补齐：

```bash
node .specforge/core/scripts/sync-wiki.mjs
```

4. 在写 `06-close/wiki-sync.md` 或判断 N/A 前，必须先生成机器计划：

```bash
node .specforge/core/scripts/wiki-update-plan.mjs --json
```

若输出 `can_write_na=false`，不得写 `N/A - 无长期事实`；必须更新 `required_targets` 或写明阻断缺口。若 wiki 仍处于 `missing` / `bootstrap` 且当前 work item verification 已批准，先运行：

```bash
node .specforge/core/scripts/wiki-hydrate.mjs --mode close --write
```

5. 若当前没有 active work item，但用户明确要求更新 wiki，可进入 Lightweight wiki 更新；必须写清来源证据，不能凭口头印象改当前事实。

## 执行序列

### A. 收集来源

优先读取 active work 的最终产物：

- `00-intake/brief.md`
- `00-intake/prd.md`（存在时）
- `01-spec/requirements.md`
- `01-spec/gap-report.md`（存在时）
- `01-spec/ui-design.md`（存在时）
- `01-spec/technical-design.md`（存在时）
- `00-steering/codebase-intelligence.md`（存在时）
- `node .specforge/core/scripts/wiki-refresh-plan.mjs --from-diff --json`（implementation / verification 后判断长期 Wiki 目标）
- `02-spec-review/spec-review-v1.md`（存在时）
- `03-implementation/report.md`
- `04-code-review/code-review-v1.md`
- `05-verification/report.md`
- `06-close/release.md` / `rollback.md`（存在时）

### B. 判断是否回写

1. 运行 `wiki-update-plan.mjs --json`，把 `wiki_state`、`long_term_fact_candidates`、`required_targets`、`can_write_na` 和 `blocking_gaps` 写入 `06-close/wiki-sync.md#0` 到 `#2`。
2. 提取候选长期事实。
3. 按 `references/wiki-sync-rules.md#回写矩阵` 判断目标文件，并与 `required_targets` 对账。
4. 按 `ai-toolkit.md#持续演进` 判断是否至少有一个可复用事实；只有 `can_write_na=true` 且候选事实都已说明不复用时，才允许写 `N/A - 无长期事实`。
5. 只影响一次性实现、临时日志、测试输出、截图或局部无复用备注时，在 `06-close/wiki-sync.md` 写 N/A 理由，不更新 wiki。
6. 改变长期产品、架构、接口、数据、运行、设计系统、术语、风险时，必须更新对应 wiki 文件。
   - 接口总览优先写 `external-interfaces.md`；接口域详情按需写 `api-<domain>.md`，第三方系统详情按需写 `integration-<system>.md`。
   - 配置 / 环境变量 / secret / feature flag 写 `config-env.md`。
   - 认证 / 授权 / 权限 / 敏感数据边界写 `security-auth.md`。
   - 后台任务 / 队列 / 事件 / 定时任务写 `jobs-events.md`。
   - SQL / DDL / dump 文件默认不是当前事实。只有被 migration/runtime/CI/tests 引用或用户确认时，才能写进“当前数据权威”或“当前实体 / 表”；否则写入 `04-data-model.md#历史--未受信-sql-产物` 或 `08-risks.md`。
7. 若 `wiki-refresh-plan.mjs --from-diff --json` 返回 `wiki_update_needed=true`，必须把 targets 写入 `wiki-sync.md#2-必须更新的-wiki-目标`，更新对应 Wiki 或写阻断原因。
8. 若 `technical-design.md#7.1 Architecture Contract`、`#Implementation Handoff` 或 `#12. Operability & Maintenance` 声明了 owner、extension point、deprecation path、wiki target、technical debt 或 revisit trigger，必须按其 wiki target 回写或在 `wiki-sync.md` 写明可信 N/A。

### C. 更新 wiki

1. 优先更新现有 current 文件，不创建日期版、v2 版、work item 版。
2. 确需新增时使用短名：`module-<name>.md`、`api-<domain>.md`、`design-system.md`。
3. 每个更新文件都保留并刷新 frontmatter：`title`、`kind`、`owner`、`last_updated`、`source_work`、`status`。
4. 按 `references/wiki-sync-rules.md#Wiki 质量清单` 检查信息密度；架构、模块、API、数据、运维类文件不能只写概述，还要能支持后续任务从 wiki 入手定位代码。
5. 对缺失事实执行一次补证：用 `rg` / provider / 关键配置读取查找路由、模型、migration、服务入口、脚本和测试。仍无法确认的，写 `未确认` 并同步到 `08-risks.md`。
6. 更新 `.specforge/wiki/00-index.md` 的摘要、当前文件索引和最后同步时间。
7. 在 `06-close/wiki-sync.md` 记录更新文件、写入事实、来源证据、不更新原因、未确认缺口和下游重新验证要求。
8. 更新后运行严格质量检查：

```bash
node .specforge/core/scripts/wiki-quality.mjs --mode close
```

`FAIL` 必须修复；`WARN` 必须在 `wiki-sync.md#8-质量检查结果` 记录接受理由或后续补证路径。

### D. 更新 gate

批准：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync APPROVED --evidence 06-close/wiki-sync.md
```

缺少事实证据或冲突未解决：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync REQUEST_CHANGES
```

## 判定表

| 条件 | 状态 |
|---|---|
| verification 未批准，且处于 close 前 wiki_sync | 停止，回 `sf-verify` |
| 只是一次性过程记录、日志、截图、临时调试 | 不更新 wiki，写 N/A 理由 |
| `wiki-update-plan` 输出 `can_write_na=false` | 必须更新 required targets 或阻断，不得 N/A |
| 已验证 work item 后 wiki 仍为 bootstrap | 先 `wiki-hydrate --mode close --write`，再人工补证 |
| 长期产品 / 架构 / API / 数据 / 运行 / 设计系统 / 风险变化 | 更新对应 wiki |
| technical design 声明 wiki target、owner、extension point、deprecation path、technical debt 或 revisit trigger | 更新对应 wiki / `08-risks.md` / `06-decisions.md` |
| artifact 与现有 wiki 冲突且无法判断最新事实 | `REQUEST_CHANGES` |
| 会产生重复 current 文件 | 停止，合并到唯一目标文件 |

## 完成标准

- `06-close/wiki-sync.md` 写明影响或不影响。
- 更新的 wiki 文件 frontmatter 完整，`status: current` 正确。
- 同一知识项只有一个 current 文件。
- `.specforge/wiki/00-index.md` 反映最新 current 文件列表。
- wiki 只包含当前事实；旧事实被更新，必要背景进入 `06-decisions.md`。
- 架构 / API / 数据 / 运维文件满足最低完整度；不足项已明确标注 `未确认`，并在 `08-risks.md` 或 `06-close/wiki-sync.md` 记录补证路径。
- 架构 / 模块 / API / 数据 / 运维文件包含后续任务可用的入口路径、关键符号 / 路由、上游下游、测试位置、运行命令或推荐检索词。
- `wiki-update-plan` 的 `required_targets` 已更新或有阻断说明，且 `wiki-quality.mjs --mode close` 无 `FAIL`。
- wiki_sync gate 状态与 evidence 一致。
- 完成后运行 `node .specforge/core/scripts/instructions.mjs`，将输出展示给用户，让用户知道当前 workflow 的下一步是什么。

## 不做

- 不把临时日志、测试输出、截图或实现流水账复制进 wiki。
- 不创建按日期、版本号或 work item 命名的 wiki 文件。
- 不用 wiki 替代 work item evidence。
- 不把第三方 skill 的模板、persona 或建议当成项目事实；只有经 SpecForge artifact 确认后才可沉淀。
