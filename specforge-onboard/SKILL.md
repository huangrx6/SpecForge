---
name: specforge-onboard
description: 将新仓库或已有仓库接入 SpecForge；初始化唯一项目目录 .specforge/，复制规范、模板和工具，并建立空 registry、knowledge 与 changes 工作区。
---

# specforge-onboard

本技能把业务仓库接入 SpecForge。它只做两件事：搭骨架、归旧档。骨架完成后其他 `specforge-*` 技能才能运行。

## 前置关系

本技能需要先安装到 AI 工具。推荐从 npm 或 GitHub 使用 CLI：

```bash
npx @huangrx6/specforge skill add --target codex
npx @huangrx6/specforge skill add --target claude-code
npx @huangrx6/specforge skill add --target cc-switch
```

本地源码维护时也可以运行：

```bash
node bin/specforge.mjs skill add --target all --apply
```

## 核心原则

- 项目接入后只新增或补齐 `.specforge/`。
- 不创建根 `specs/`、根 `scripts/`，也不强制修改业务项目 `package.json`。
- 初始化素材来自本技能目录：`assets/starter/.specforge/`。
- 项目内命令直接运行 `node .specforge/tools/<name>.mjs`。
- 已有 `.specforge/knowledge/`、`.specforge/changes/`、`.specforge/registry.yaml` 不覆盖。

## 标准骨架

```text
.specforge/
├── attention.md
├── AGENTS.md
├── manifest.yaml
├── rules/
├── workflows/
├── templates/
├── tools/
├── adapters/
├── knowledge/
├── registry.yaml
└── changes/
    ├── inbox/
    ├── active/
    └── archive/
```

## 初始化内容透明清单

onboard 完成后，业务项目内会拥有这些类别的文件：

| 路径 | 用途 |
|---|---|
| `.specforge/AGENTS.md` | 项目内 Agent 入口和加载顺序 |
| `.specforge/attention.md` | 每次进入项目都应先看的短注意事项 |
| `.specforge/manifest.yaml` | SpecForge 版本、workflow、路径和 gate 策略 |
| `.specforge/registry.yaml` | active / blocked / archive change 索引 |
| `.specforge/rules/` | 稳定流程、边界、测试、安全和 review 规则 |
| `.specforge/workflows/` | lite / standard / bugfix workflow 描述 |
| `.specforge/schemas/` | artifact graph schema |
| `.specforge/templates/` | 各阶段产物模板 |
| `.specforge/tools/` | 本地 runtime 命令 |
| `.specforge/knowledge/` | 轻量长期知识库：产品、架构、术语、风险、决策 |
| `.specforge/changes/inbox/` | 暂存请求 |
| `.specforge/changes/active/` | 正在推进的 change |
| `.specforge/changes/archive/` | 已关闭 change，只读历史证据 |

onboard 只应创建或补齐 `.specforge/`。不要在业务项目根目录额外创建 `specs/`、`scripts/` 或强制修改 `package.json`。

## Starter 来源与预判方式

初始化素材来自：

```text
specforge-onboard/assets/starter/.specforge/
```

用户或维护者可以在运行 onboard 前直接查看这个目录，预判会复制哪些文件。CLI 的直接初始化路径也是复制同一个 starter：

```bash
npx specforge init --dir .
```

如果只是想看安装后结构，不要在业务项目里试探性运行破坏性命令；优先查看 starter 目录或在临时目录运行。

starter 是发行快照，不是第二份源头。保留 `assets/starter/.specforge/` 的原因是：`specforge-onboard` 作为独立 skill 安装后，可能只能访问自己的 skill 目录；这个快照让 onboard 在离线或没有 npm CLI 的环境中仍可初始化项目。

维护 SpecForge 自身时，静态 runtime 资产以根 `.specforge/` 为母本，并按 `.specforge/starter.manifest.json` 生成 starter：

```bash
node .specforge/tools/sync-starter-assets.mjs
node .specforge/tools/sync-starter-assets.mjs --check
```

manifest 会复制 rules、templates、tools、skills 等静态资产，并生成空 registry、空 changes 工作区和轻量 knowledge 占位。`.specforge/knowledge/`、`.specforge/changes/` 和 `.specforge/registry.yaml` 属于项目事实或动态证据，不会从源码仓库原样同步到 starter。

## 已有项目的覆盖规则

| 已存在内容 | onboard 行为 |
|---|---|
| `.specforge/knowledge/` | 保留，不覆盖长期项目知识 |
| `.specforge/changes/` | 保留，不覆盖 active / archive evidence |
| `.specforge/registry.yaml` | 保留，不重建索引 |
| `.specforge/rules/` | 可用 starter 补齐或刷新稳定规则 |
| `.specforge/templates/` | 可用 starter 补齐或刷新模板 |
| `.specforge/tools/` | 可用 starter 补齐或刷新 runtime 工具 |
| 旧版根 `specs/`、根 `scripts/` | 只报告迁移建议，不自动移动或删除 |

低置信度迁移必须先问用户，不要把看起来像规格的文档自动塞进 `.specforge/knowledge/`。

## 启动扫描

1. 检查 `.specforge/` 是否存在。
2. Glob 全仓库 Markdown 文档，排除 `.git/`、`node_modules/`、`.specforge/changes/archive/`。
3. 检查是否有旧版根 `specs/` 或根 `scripts/`。
4. 汇报走空仓库路径还是迁移路径。

## 空仓库路径

执行：

```bash
cp -rf <本技能目录>/assets/starter/.specforge/. .specforge/
node .specforge/tools/doctor.mjs
```

只允许根据用户已给出的项目信息填写 `.specforge/attention.md`，不要凭空补业务事实。

## 迁移路径

生成映射表：

| 现有文件 | 推测内容类型 | 建议归入 SpecForge | 置信度 |
|---|---|---|---|
| `docs/ARCHITECTURE.md` | 架构现状 | `.specforge/knowledge/architecture.md` | 高 |
| `SPEC.md` | 需求或功能规格 | 需用户确认 | 低 |

规则：

- 高置信度可列出后执行。
- 中/低置信度必须问用户。
- 不移动、不删除用户未确认的文件。
- `.specforge/rules/`、`.specforge/templates/`、`.specforge/tools/` 可用 starter 刷新。
- `.specforge/knowledge/`、`.specforge/changes/`、`.specforge/registry.yaml` 保留已有内容。

## 关联规则

- 初始化边界：`.specforge/rules/boundaries/README.md`
- 上下文加载：`.specforge/rules/context/README.md`
- 中文输出：`.specforge/rules/localization.md`

## 验收

- `.specforge/attention.md` 存在。
- `.specforge/registry.yaml` 存在。
- `.specforge/knowledge/`、`.specforge/changes/`、`.specforge/tools/` 存在。
- `node .specforge/tools/doctor.mjs` 通过。

## 不做

- 不在项目根目录创建 `specs/` 或 `scripts/`。
- 不把全局 skill 文件复制进业务项目。
- 不替用户迁移低置信度文档。
