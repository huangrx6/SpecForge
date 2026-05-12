# Artifact Graph 规则

Artifact Graph 是 SpecForge 的工作流控制面。它不负责替代规格内容，也不负责替代 gate；它负责回答四个问题：

1. 这个 workflow 里有哪些 artifact。
2. 每个 artifact 依赖谁。
3. 当前哪些 artifact 已完成、可继续、被阻塞或只完成了一半。
4. 下一步应该给 Agent 什么上下文，而不是让 Agent 靠目录猜。

SpecForge 采用“依赖图驱动推进，gate 约束关键跃迁”的模式。依赖图解决顺序和可达性，gate 解决质量和审批。

## 与固定阶段的区别

固定阶段只能回答“现在大概在哪一段”。Artifact Graph 必须回答“当前真正能做什么”。

| 问题 | 固定阶段 | Artifact Graph |
|---|---|---|
| 是否可并行 | 很难表达 | 通过多个 ready artifact 表达 |
| 为什么卡住 | 往往靠人解释 | 输出 missing deps 或 gate 状态 |
| 下一步读什么 | 容易过载 | 只读依赖 artifact、规则和模板 |
| 是否允许回写前序产物 | 容易失真 | 允许，但会影响后续状态判断 |
| 自定义 workflow | 成本高 | 通过 schema 声明 |

## 四类事实源

Artifact Graph 的状态判断必须基于四类事实，不得只看目录名：

| 事实源 | 作用 |
|---|---|
| `.specforge/schemas/<workflow>.json` | 声明 artifact、依赖、gate、apply、archive 条件 |
| `change.yaml` | 记录当前 change 的 workflow、stage、gate 状态与证据 |
| change 目录中的实际产物 | 判断输出文件是否存在、是否部分缺失 |
| `.specforge/registry.yaml` | 作为 active / blocked / archive 的索引，不承担细粒度事实 |

其中 schema 是图结构真相，change 目录是产物真相，`change.yaml` 是流程元数据真相。

## 状态模型

每个 artifact 只能处于以下状态之一：

| 状态 | 含义 |
|---|---|
| `blocked` | 至少一个依赖未完成 |
| `ready` | 依赖满足，可以创建或推进 |
| `partial` | 已出现部分输出，但还不满足完成条件 |
| `done` | 完成条件满足 |

### 状态判定顺序

1. 先看依赖是否全部 `done`。
2. 如果未满足，artifact 为 `blocked`。
3. 如果依赖满足，再判断本 artifact 是否 gate。
4. gate artifact 必须同时满足：
   - gate 状态为 `APPROVED`
   - 证据存在
   - 若 schema 声明 outputs，则 outputs 完整
5. 非 gate artifact：
   - 输出全存在且内容满足校验要求，则 `done`
   - 输出只存在一部分，则 `partial`
   - 输出尚未出现，则 `ready`

仅“目录存在”不能算完成；仅“文件存在”也不一定算完成。空模板、未填写状态、缺证据的 gate 都不能算 `done`。

## 依赖和 gate 的边界

依赖负责解锁，gate 负责放行。

| 机制 | 回答的问题 |
|---|---|
| `requires` | 我现在能不能开始做这个 artifact |
| `gate` | 做完之后，是否允许依赖它的下游继续 |
| `apply.requires` | 是否可以进入实现 |
| `archive.requires` | 是否可以归档 |

例如：

- `implementation` 依赖 `spec_review`。
- `spec_review` 的 outputs 可能已存在，但如果 gate 还没 `APPROVED`，`implementation` 仍然不应被判定 ready。

## schema 约束

每个 artifact 至少应包含：

- `id`：稳定机器标识，不能依赖标题。
- `stage`：产物目录段。
- `title`：人类可读名称。
- `description`：用途说明。
- `outputs`：一个或多个产物路径。
- `requires`：依赖 artifact。
- `gate`：如果该 artifact 承担门禁，必须绑定 gate 名。

新增 artifact 时，必须同步：

- `.specforge/schemas/<workflow>.json`
- `.specforge/templates/`
- `.specforge/tools/lib/specforge.mjs` 的模板映射
- `rules/gates/README.md` 或对应内部 skill
- 如会影响状态展示，再同步 `artifact-graph-status.mjs`

## 图计算必须支持的能力

Artifact Graph 引擎或脚本至少应支持：

- 拓扑可达性：识别依赖是否合法。
- next artifacts：列出当前 `ready` 的 artifact。
- blocked artifacts：列出 `blocked` artifact 及缺失依赖。
- progress：统计 `done / total`。
- unlocks：当某 artifact 完成后，哪些下游可能解锁。
- completion：判断 workflow 是否完成。

这些能力是 `status`、`instructions`、`work`、`doctor` 的共同底座。

## 信息流

推荐工作方式：

1. `status` / `artifact-graph-status` 先读图，明确当前状态。
2. `instructions` 选择一个 ready artifact。
3. 指令生成时只注入：
   - schema 中该 artifact 的模板和说明
   - 依赖 artifact 的内容
   - 当前项目 rules
   - change 级元数据
4. artifact 完成后重新计算图状态。

不要一次性把所有阶段模板、全部规则和全部历史内容塞给 Agent。Artifact Graph 的价值之一，就是把上下文约束在“当前可行动作”附近。这个设计与 OpenSpec 的 artifact-driven 指令生成思路一致。

## 与迭代修改的关系

SpecForge 是规范驱动，但不应假装理解永远线性增长。

- 已完成的前序 artifact 可以被修订。
- 修订后，如果后续产物依赖了被改写的事实，应重新评估后续 artifact。
- 如果修订影响 gate 结论，应重新走相应 review / verification。
- `stage` 只是当前推进位置，不是完整 truth source。

这部分借鉴 OpenSpec “dependencies enable progress, not rigid phases” 的思路，但 SpecForge 保留 gate，以确保在实现、验证和归档前仍有明确质量门槛。

## registry 规则

- `active` 只保存正在推进的 change。
- `blocked` 保存被外部依赖、决策或失败 gate 阻断的 change。
- `archive` 保存已关闭 change。
- 同一个 change 只能出现在一个分区。
- 移动 active 到 archive 时，必须同步路径、状态和关闭原因。
- registry 是索引，不是事实全文；具体状态仍以 change 目录、schema 和 `change.yaml` 为准。

## 归档规则

归档前必须检查：

- `archive.requires` 中的 artifact 全部 `done`。
- 所有 required gate 已批准或按 workflow 合法跳过。
- `06-closure/release.md` 写清发布或无需发布原因。
- `06-closure/rollback.md` 写清回滚方式或无需回滚原因。
- `06-closure/ssot-sync.md` 写清长期知识是否同步。
- registry 已从 active 移动到 archive。

## 工具职责

| 工具 | 应承担的职责 |
|---|---|
| `artifact-graph-status.mjs` | 展示 progress、ready、blocked、partial、gate 状态，支持机器读取 |
| `instructions.mjs` | 基于 ready artifact 生成下一步最小上下文 |
| `status.mjs` | 面向用户汇总 change 级状态 |
| `doctor.mjs` | 检查图状态和结构一致性 |
| `validate-structure.mjs` | 校验 schema、依赖、归档证据、starter 一致性 |

## 审查清单

- schema 是否能表达真实 workflow，而不是反过来被目录迁就。
- 是否存在不必要的线性依赖，导致本可并行的 artifact 被强行串行。
- gate artifact 是否把“审批”和“产物存在”混成一个条件。
- instructions 是否只读取当前 artifact 所需上下文。
- status 输出是否能解释“为什么 blocked”。
- 归档是否真正依赖图完成，而不是只看 stage 名称。
- 新 workflow 是否能被 validator 发现循环依赖、未知依赖和缺模板。

## 后续演进方向

优先级高：

- `artifact-graph-status.mjs` 输出 JSON。
- 输出 `missingDeps`、`unlocks` 和 progress。
- `instructions.mjs` 显示“为什么选中该 artifact”。
- validator 检测空模板和无效 gate evidence。

优先级中：

- 支持更多 workflow schema。
- 支持 change 级 schema override。
- 支持图可视化和多 change 总览。
