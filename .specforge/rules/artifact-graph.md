# 产物图规则

SpecForge 不应只依赖固定目录顺序来判断流程状态。标准流程必须同时具备：

- `schema`：声明 artifact、输出文件、依赖关系、gate 和归档要求。
- `change.yaml`：记录单个变更的状态、当前阶段、gate 状态和证据。
- `registry.yaml`：记录 active / blocked / archive 索引。

## 核心规则

1. 新流程优先从 `.specforge/schemas/<workflow>.json` 读取 artifact 图。
2. Artifact 的 `requires` 决定可执行顺序，不由目录名隐式推断。
3. Gate 型 artifact 必须以 `change.yaml` 中对应 gate 的 `APPROVED` 状态作为完成条件。
4. 非 gate 型 artifact 在 v0.1 过渡期可通过 `stage` 推断完成状态；v0.2 应改为按文件内容和结构校验判断。
5. 归档前必须满足 `archive.requires`。

## 状态来源

| 状态问题 | 优先读取 |
|---|---|
| 当前有哪些 change | `.specforge/registry.yaml` |
| 当前 change 到哪一步 | `change.yaml.stage` 和 schema |
| 某 gate 是否通过 | `change.yaml.gates.<gate>.status` |
| 某 gate 证据在哪里 | `change.yaml.gates.<gate>.evidence` |
| 下一个可执行 artifact | schema 中 `requires` 已满足且未完成的 artifact |
| 是否可归档 | schema `archive.requires` 和 `ssot_sync` gate |

## artifact 定义要求

schema 中每个 artifact 应包含：

- `id`：稳定标识，不能依赖标题。
- `stage`：所在阶段目录。
- `title`：人类可读名称。
- `outputs`：产出文件。
- `requires`：依赖 artifact。
- `gate`：如果该 artifact 是门禁，必须绑定 gate 名。

新增 artifact 时，应同步：

- `.specforge/schemas/<workflow>.json`
- `.specforge/templates/`
- `.specforge/tools/lib/specforge.mjs` 的模板映射
- `rules/gates.md` 或相关 stage guide

## 完成状态判断

| 类型 | 完成条件 |
|---|---|
| 普通 artifact | 输出文件存在，且内容不再是空模板；v0.1 可人工确认 |
| Gate artifact | gate 状态为 `APPROVED`，且 evidence 文件存在 |
| Verification artifact | 测试或替代验证证据存在，失败和缺口已记录 |
| Closure artifact | release、rollback、ssot-sync 完成，并满足 archive requires |

仅文件存在不等于完成。模板文件、空报告、未填状态都不能作为完成证据。

## registry 规则

- `active` 只保存正在推进的 change。
- `blocked` 保存被外部依赖、决策或失败 gate 阻断的 change。
- `archive` 保存已关闭 change。
- 同一个 change 只能出现在一个分区。
- 移动 active 到 archive 时，必须同步路径、状态和关闭原因。
- registry 是索引，不是事实全文；具体状态仍以 change 目录为准。

## 归档规则

归档前必须检查：

- 所有 required gate 已批准或按 workflow 合法跳过。
- `06-closure/release.md` 写清发布或无需发布原因。
- `06-closure/rollback.md` 写清回滚方式或无需回滚原因。
- `06-closure/ssot-sync.md` 写清长期知识是否同步。
- registry 已从 active 移动到 archive。

## 后续要求

v0.2 应停止一次性生成所有阶段模板，改为按 artifact 图逐步生成下一个产物。否则仅凭文件存在无法判断“已完成”和“只是模板”。
