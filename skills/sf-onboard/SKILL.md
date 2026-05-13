---
name: sf-onboard
description: 将新仓库或已有仓库接入 SpecForge；初始化唯一项目目录 .specforge/，复制规范、模板和工具，并建立空 registry、knowledge 与 changes 工作区。
---

# sf-onboard

本技能把业务仓库接入 SpecForge。它只做两件事：搭骨架、归旧档。骨架完成后其他 `sf-*` 技能才能运行。

## 前置关系

本技能需要先安装到 AI 工具。推荐从 npm 或 GitHub 使用 CLI：

```bash
npx specforge skill add --target codex --apply
npx specforge skill add --target claude-code --apply
npx specforge skill add --target cc-switch --apply
```

本地源码维护时也可以运行：

```bash
node cli/specforge.mjs skill add --target all --apply --prune-legacy
```

## 内部技能母本

初始化或迁移前，读取 `.specforge/execution/stages/steering/SKILL.md`。项目边界、长期约束和 knowledge 归档判断以内置母本为准。

## 核心原则

- 项目接入后只新增或补齐 `.specforge/`。
- 不创建根 `specs/`、根 `scripts/`，也不强制修改业务项目 `package.json`。
- 初始化素材来自 CLI 生成的唯一 starter 快照：源码仓库中的 `starter/.specforge/`。
- 项目内命令直接运行 `node .specforge/execution/tools/<name>.mjs`。
- 已有 `.specforge/workspace/knowledge/`、`.specforge/workspace/changes/`、`.specforge/registry.yaml` 不覆盖。

## 标准骨架

```text
.specforge/
├── attention.md
├── AGENTS.md
├── manifest.yaml
├── registry.yaml
├── policy/
├── artifacts/
├── execution/
└── workspace/
```

## 初始化内容透明清单

onboard 完成后，业务项目内会拥有这些类别的文件：

| 路径 | 用途 |
|---|---|
| `.specforge/AGENTS.md` | 项目内 Agent 入口和加载顺序 |
| `.specforge/attention.md` | 每次进入项目都应先看的短注意事项 |
| `.specforge/manifest.yaml` | SpecForge 版本、workflow、路径和 gate 策略 |
| `.specforge/registry.yaml` | active / blocked / archive change 索引 |
| `.specforge/policy/rules/` | 稳定流程、边界、测试、安全和 review 规则 |
| `.specforge/policy/tech-profiles/` | 可组合技术栈 profile，用于 design 阶段选型 |
| `.specforge/policy/workflows/` | lite / standard / bugfix workflow 描述 |
| `.specforge/artifacts/schemas/` | artifact graph schema |
| `.specforge/artifacts/templates/` | 各阶段产物模板 |
| `.specforge/execution/tools/` | 本地 runtime 命令 |
| `.specforge/execution/hooks/` | 默认 noop 生命周期钩子，业务项目可覆盖 |
| `.specforge/execution/stages/` | 阶段行为母本，供 Agent 运行时读取 |
| `.specforge/workspace/knowledge/` | 轻量长期知识库：产品、架构、术语、风险、决策 |
| `.specforge/workspace/changes/inbox/` | 暂存请求 |
| `.specforge/workspace/changes/active/` | 正在推进的 change |
| `.specforge/workspace/changes/archive/` | 已关闭 change，只读历史证据 |

onboard 只应创建或补齐 `.specforge/`。不要在业务项目根目录额外创建 `specs/`、`scripts/` 或强制修改 `package.json`。

## Starter 来源与预判方式

唯一 starter 快照位于源码仓库：

```text
starter/.specforge/
```

用户或维护者可以在运行 onboard 前直接查看这个目录，预判会生成哪些文件。`starter/.specforge/` 是隐藏目录；如果普通目录列表看起来为空，使用 `ls -la starter` 或 `find starter -maxdepth 2` 查看。

初始化业务项目时优先调用 CLI：

```bash
npx specforge init --dir .
```

在 SpecForge 源码仓库维护时，可运行：

```bash
node cli/specforge.mjs init --dir /path/to/project
```

如果只是想看安装后结构，不要在业务项目里试探性运行破坏性命令；优先查看根级 starter 目录或在临时目录运行。

starter 是发行快照，不是第二份源头。不要在 `skills/sf-onboard/assets/` 下维护第二份 starter；`sf-onboard` 只负责指导用户调用 CLI 或检查生成后的 `.specforge/`。

维护 SpecForge 自身时，静态 runtime 资产以 `runtime/` 为母本，并按 `runtime/starter.manifest.json` 生成 starter：

```bash
node runtime/execution/tools/sync-starter-assets.mjs
node runtime/execution/tools/sync-starter-assets.mjs --check
```

manifest 会复制 policy、artifacts、execution 等静态资产，并生成空 registry、空 changes 工作区和轻量 knowledge 占位。`.specforge/workspace/knowledge/`、`.specforge/workspace/changes/` 和 `.specforge/registry.yaml` 属于项目事实或动态证据，不会从源码仓库原样同步到 starter。

## 已有项目的覆盖规则

| 已存在内容 | onboard 行为 |
|---|---|
| `.specforge/workspace/knowledge/` | 保留，不覆盖长期项目知识 |
| `.specforge/workspace/changes/` | 保留，不覆盖 active / archive evidence |
| `.specforge/registry.yaml` | 保留，不重建索引 |
| `.specforge/policy/rules/` | 可用 starter 补齐或刷新稳定规则 |
| `.specforge/artifacts/templates/` | 可用 starter 补齐或刷新模板 |
| `.specforge/execution/tools/` | 可用 starter 补齐或刷新 runtime 工具 |
| 旧版根 `specs/`、根 `scripts/` | 只报告迁移建议，不自动移动或删除 |

低置信度迁移必须先问用户，不要把看起来像规格的文档自动塞进 `.specforge/workspace/knowledge/`。

## 启动扫描

1. 检查 `.specforge/` 是否存在。
2. Glob 全仓库 Markdown 文档，排除 `.git/`、`node_modules/`、`.specforge/workspace/changes/archive/`。
3. 检查是否有旧版根 `specs/` 或根 `scripts/`。
4. 汇报走空仓库路径还是迁移路径。

## 空仓库路径

执行：

```bash
npx specforge init --dir .
node .specforge/execution/tools/doctor.mjs
```

如果当前就在 SpecForge 源码仓库中测试本地版本，改用：

```bash
node cli/specforge.mjs init --dir /path/to/project
```

只允许根据用户已给出的项目信息填写 `.specforge/attention.md`，不要凭空补业务事实。

## 迁移路径

生成映射表：

| 现有文件 | 推测内容类型 | 建议归入 SpecForge | 置信度 |
|---|---|---|---|
| `docs/ARCHITECTURE.md` | 架构现状 | `.specforge/workspace/knowledge/architecture.md` | 高 |
| `SPEC.md` | 需求或功能规格 | 需用户确认 | 低 |

规则：

- 高置信度可列出后执行。
- 中/低置信度必须问用户。
- 不移动、不删除用户未确认的文件。
- `.specforge/policy/rules/`、`.specforge/artifacts/templates/`、`.specforge/execution/tools/` 可用 starter 刷新。
- `.specforge/workspace/knowledge/`、`.specforge/workspace/changes/`、`.specforge/registry.yaml` 保留已有内容。

## 关联规则

- 初始化边界：`.specforge/policy/rules/boundaries/README.md`
- 上下文加载：`.specforge/policy/rules/context/README.md`
- 中文输出：`.specforge/policy/rules/localization.md`

## 验收

- `.specforge/attention.md` 存在。
- `.specforge/registry.yaml` 存在。
- `.specforge/workspace/knowledge/`、`.specforge/workspace/changes/`、`.specforge/execution/tools/` 存在。
- `node .specforge/execution/tools/doctor.mjs` 通过。

## 不做

- 不在项目根目录创建 `specs/` 或 `scripts/`。
- 不把全局 skill 文件复制进业务项目。
- 不替用户迁移低置信度文档。
