# OpenSpec 实现研究

研究对象：[Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)

## 结论摘要

OpenSpec 的核心不是目录模板，而是一套围绕“变更产物图”运行的 CLI 和校验系统。它通过 schema 定义产物依赖，用命令生成上下文指令，用校验器约束规格格式，并在归档时把变更规格合并回长期规格。

对 SpecForge 最有价值的启发是：

| 机制 | OpenSpec 做法 | SpecForge 应吸收的点 |
|---|---|---|
| 流程建模 | `schema.yaml` 声明 artifacts、outputs、requires、apply | 用 artifact graph 替代硬编码阶段顺序 |
| 状态判断 | 根据 schema 和文件存在情况计算 done / ready / blocked | 状态应由 schema + change.yaml + gate 共同得出 |
| 指令生成 | `openspec instructions <artifact>` 输出上下文、依赖、模板、规则 | Agent 不应靠记忆写产物，应由命令吐出下一步指令 |
| 变更规格 | change 下的 delta spec 使用 ADDED / MODIFIED / REMOVED / RENAMED | 需要引入可合并的规格变更模型 |
| 归档 | archive 前校验、应用 delta、更新主规格、再移动到 archive | 归档不是移动文件夹，而是长期知识回流动作 |
| 配置注入 | `openspec/config.yaml` 提供项目 context 和 artifact rules | SpecForge 需要项目级上下文注入点 |

## 代码结构观察

OpenSpec 是一个 TypeScript npm CLI 包，入口是 `bin/openspec.js`，主要实现位于 `src/`。

| 区域 | 职责 |
|---|---|
| `src/cli/index.ts` | CLI 命令注册，包含 init、validate、archive、status、instructions、templates、schemas、new change |
| `src/core/artifact-graph/` | schema 解析、artifact 依赖图、完成状态检测、指令生成 |
| `src/core/validation/` | 规格和变更校验器 |
| `src/core/specs-apply.ts` | 把 change 下的 delta spec 应用到主规格 |
| `src/core/archive.ts` | 归档流程：校验、应用规格、检查任务、移动归档 |
| `src/core/command-generation/` | 适配多种 AI 工具的命令生成 |
| `schemas/spec-driven/` | 默认工作流 schema 和产物模板 |

## Artifact Graph

OpenSpec 的默认 schema 位于 `schemas/spec-driven/schema.yaml`。它声明：

| Artifact | 输出 | 依赖 |
|---|---|---|
| `proposal` | `proposal.md` | 无 |
| `specs` | `.specforge/**/*.md` | `proposal` |
| `design` | `design.md` | `proposal` |
| `tasks` | `tasks.md` | `specs`, `design` |

同时还有：

```yaml
apply:
  requires: [tasks]
  tracks: tasks.md
```

这意味着流程不是靠目录名排序，而是靠 artifact 的依赖关系决定下一步。

对应实现：

| 文件 | 关键能力 |
|---|---|
| `src/core/artifact-graph/types.ts` | 用 Zod 定义 artifact、apply、schema、change metadata |
| `src/core/artifact-graph/graph.ts` | 用拓扑排序计算 build order、ready、blocked |
| `src/core/artifact-graph/state.ts` | 检测产物是否完成 |
| `src/core/artifact-graph/instruction-loader.ts` | 把 schema、依赖、模板、项目配置合成 Agent 指令 |

SpecForge 当前的主要差距：阶段目录已经存在，但没有“产物依赖图”。所有文件在创建 change 时一次性生成，导致文件存在不能代表完成。

## Instructions 命令

OpenSpec 的 `instructions` 命令不是简单打印模板，它会生成结构化上下文：

- 当前 change 名称。
- 当前 artifact ID。
- schema 名称。
- 输出路径。
- 依赖文件及完成状态。
- project context。
- artifact-specific rules。
- artifact 模板。
- 完成该 artifact 后解锁什么。

这个机制很适合 Agent，因为它把“下一步应该读什么、写什么、受什么约束”变成命令输出，而不是散落在 README 或提示词里。

SpecForge 后续应提供：

```bash
specforge instructions requirements --change CHG-...
specforge instructions apply --change CHG-...
```

## Delta Spec 与归档

OpenSpec 的规格变更不是简单写一篇完整文档，而是在 change 中用 delta 表达对长期规格的修改：

| Delta | 含义 |
|---|---|
| `ADDED Requirements` | 新增需求 |
| `MODIFIED Requirements` | 修改已有需求，必须提供完整替换块 |
| `REMOVED Requirements` | 删除需求，需要说明原因和迁移 |
| `RENAMED Requirements` | 重命名需求 |

`src/core/specs-apply.ts` 会：

1. 读取 change 下的 delta spec。
2. 校验重复项和跨区冲突。
3. 加载主规格。
4. 按 `RENAMED -> REMOVED -> MODIFIED -> ADDED` 顺序应用。
5. 重新组装主规格。
6. 写入前再次校验。

`src/core/archive.ts` 会在归档前执行这套逻辑。也就是说，archive 是“把短期变更融入长期事实”的动作，而不是文件移动。

SpecForge 当前只有 `ssot-sync.md`，还没有机器可执行的规格回流机制。这是 v0.2 的核心升级点。

## Validation

OpenSpec 的校验分两层：

| 层级 | 说明 |
|---|---|
| Zod schema | 校验结构对象，例如 Spec、Change、Artifact schema |
| Markdown parser rules | 校验文档中的章节、requirement、scenario、delta section |

典型规则包括：

- 主规格必须有 Purpose 和 Requirements。
- change delta 至少要有一个有效操作。
- `ADDED` / `MODIFIED` 的 requirement 必须包含 `SHALL` 或 `MUST`。
- 每个 requirement 至少要有一个 scenario。
- 不允许同一 requirement 同时出现在 `ADDED` 和 `REMOVED`。

SpecForge 当前的 `node .specforge/tools/validate-structure.mjs` 只检查路径和 gate evidence。下一步应增加：

- artifact schema 校验。
- change.yaml 校验。
- requirements/design/tasks 结构校验。
- gate evidence 内容校验。
- archive 前 SSoT 同步校验。

## Config 与多来源 schema

OpenSpec 支持项目配置：

```yaml
schema: spec-driven
context: ...
rules:
  proposal:
    - ...
```

它还区分内置 schema、用户级 schema、项目级 schema，并能给出 schema 名称建议。这说明一个 SDD 工具不能只依赖全局默认模板，应允许项目局部定制。

SpecForge 后续可以采用三层优先级：

1. 项目内 `.specforge/schemas/`。
2. 用户级 SpecForge 配置。
3. 包内默认 schema。

## 可直接借鉴的设计

| 优先级 | 可借鉴内容 | SpecForge 落地方式 |
|---|---|---|
| P0 | Artifact graph | `.specforge/schemas/standard.json`，状态脚本先落地，后续 CLI 化 |
| P0 | Instructions 生成 | `specforge instructions` |
| P0 | Archive = apply + validate + move | archive 前强制 SSoT 回流 |
| P1 | Delta spec | 引入 `.specforge/<capability>/spec.md` 增量格式 |
| P1 | Project config context/rules | `.specforge/config.yaml` |
| P2 | 多 AI 工具命令生成 | adapters 层 |

## 不应照搬的地方

- OpenSpec 当前 schema 以英文 requirement 规则为中心，SpecForge 需要中文优先版本。
- OpenSpec 的默认 flow 偏 proposal/spec/design/tasks，SpecForge 已经明确区分 `.specforge/` 和 `.specforge/project/`，应保留这条边界。
- OpenSpec 的文件存在判断适合“按需生成 artifact”，但 SpecForge v0.1 已经一次性生成模板。后续要改 scaffolding，否则无法准确判断完成状态。

