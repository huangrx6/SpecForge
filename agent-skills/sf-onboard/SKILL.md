---
name: sf-onboard
description: 将新仓库或已有仓库接入 SpecForge；初始化唯一项目目录 .specforge/，复制 core、wiki、hooks、registry 与 work 工作区。
---

# sf-onboard

## 运行目录

开始 onboard 前，先确认当前目录是要接入 SpecForge 的业务项目根。若当前在 `frontend/`、`backend/` 等子目录，先回到仓库根；不要在子目录里初始化 `.specforge/`，除非用户明确说明该子目录就是独立项目。

本技能把业务仓库接入 SpecForge。它只做三件事：搭骨架、识别存量项目、归旧档。骨架完成后其他 `sf-*` 技能才能运行；已有代码的项目应先进入 `sf-steering` 建立 wiki 基线，再处理新需求或 bug。

## 前置关系

本技能需要先安装到 AI 工具。当前不要使用 `npx specforge ...`：npm registry 上的 `specforge` 包不是本仓库发行版，命令集不兼容。

推荐从 GitHub 安装最新版：

```bash
npx github:huangrx6/SpecForge skill add --target codex --apply
npx github:huangrx6/SpecForge skill add --target claude-code --apply
npx github:huangrx6/SpecForge skill add --target cc-switch --apply
```

也可以一次性安装到所有目标：

```bash
npx github:huangrx6/SpecForge skill add --target all --apply
```

## 内部技能母本

初始化或迁移前，读取 `.specforge/core/workflows/stages/steering/SKILL.md`。项目边界、长期约束和 wiki 归档判断以内置母本为准。

## 核心原则

- 项目接入后只新增或补齐 `.specforge/`。
- 不创建根 `specs/`、根 `scripts/`，也不强制修改业务项目 `package.json`。
- 初始化素材来自 CLI 生成的唯一 starter 快照：GitHub 发行包中的 `starter/.specforge/`。
- 项目内命令直接运行 `node .specforge/core/scripts/<name>.mjs`。
- 已有 `.specforge/wiki/`、`.specforge/work/`、`.specforge/registry.yaml` 不覆盖。
- 已有业务代码的项目，onboard 后不直接开始需求实现；先运行代码地图并路由到 `sf-steering`。

## 标准骨架

```text
.specforge/
├── AGENTS.md
├── manifest.yaml
├── registry.yaml
├── project.yaml
├── core/
│   ├── standards/
│   ├── profiles/
│   ├── workflows/
│   ├── artifacts/
│   ├── scripts/
│   ├── skills/
│   ├── hooks/
│   └── commands/
├── hooks/
│   └── local/
├── wiki/
└── work/
    ├── inbox/
    ├── active/
    └── archive/
```

## 初始化内容透明清单

onboard 完成后，业务项目内会拥有这些类别的文件：

| 路径 | 用途 |
|---|---|
| `.specforge/AGENTS.md` | 项目内 Agent 入口、加载顺序、项目约束和状态传递协议 |
| `.specforge/manifest.yaml` | SpecForge 版本、workflow、路径和 gate 策略 |
| `.specforge/registry.yaml` | active / blocked / archive work item 索引 |
| `.specforge/core/standards/` | 稳定流程、边界、测试、安全和 review 规则 |
| `.specforge/core/profiles/` | 可组合技术栈 profile，用于 technical_design 阶段选型 |
| `.specforge/core/workflows/definitions/` | lite / feature / standard / bugfix / issue / refactor / discovery workflow 描述 |
| `.specforge/core/artifacts/schemas/` | artifact graph schema |
| `.specforge/core/artifacts/templates/` | 各阶段产物模板 |
| `.specforge/core/scripts/` | 本地工具脚本 |
| `.specforge/core/hooks/events/` | 默认 noop 生命周期钩子，业务项目可覆盖 |
| `.specforge/core/workflows/stages/` | 阶段行为母本，供 Agent 运行时读取 |
| `.specforge/wiki/` | 轻量长期知识库：产品、架构、术语、风险、决策 |
| `.specforge/work/inbox/` | 暂存请求 |
| `.specforge/work/active/` | 正在推进的 work item |
| `.specforge/work/archive/` | 已关闭 work item，只读历史证据 |

onboard 只应创建或补齐 `.specforge/`。不要在业务项目根目录额外创建 `specs/`、`scripts/` 或强制修改 `package.json`。

## Starter 来源与预判方式

唯一 starter 快照位于 GitHub 仓库：

```text
starter/.specforge/
```

用户或维护者可以在运行 onboard 前直接查看这个目录，预判会生成哪些文件。`starter/.specforge/` 是隐藏目录；如果普通目录列表看起来为空，使用 `ls -la starter` 或 `find starter -maxdepth 2` 查看。

初始化业务项目时优先调用 GitHub 版 CLI：

```bash
npx github:huangrx6/SpecForge init --dir .
```

只有在明确处于 SpecForge 源码仓库维护场景时，才使用本地源码 CLI：

```bash
node cli/specforge.mjs init --dir /path/to/project
```

如果只是想看安装后结构，不要在业务项目里试探性运行破坏性命令；优先查看根级 starter 目录或在临时目录运行。

starter 是发行快照，不是第二份源头。不要在 `agent-skills/sf-onboard/assets/` 下维护第二份 starter；`sf-onboard` 只负责指导用户调用 CLI 或检查生成后的 `.specforge/`。

维护 SpecForge 自身时，静态核心资产以 `core/` 为母本，并按 `core/starter.manifest.json` 生成 starter：

```bash
node core/scripts/sync-starter.mjs
node core/scripts/sync-starter.mjs --check
```

manifest 会复制 core/standards、core/artifacts、core/workflows、必要运行时 scripts、core/hooks 等静态资产，并生成空 registry、空 work 工作区和轻量 wiki 占位。`.specforge/wiki/`、`.specforge/work/`、`.specforge/hooks/local/` 和 `.specforge/registry.yaml` 属于项目事实或动态证据，不会从源码仓库原样同步到 starter。

## 已有项目的覆盖规则

| 已存在内容 | onboard 行为 |
|---|---|
| `.specforge/wiki/` | 保留，不覆盖长期项目知识 |
| `.specforge/work/` | 保留，不覆盖 active / archive evidence |
| `.specforge/registry.yaml` | 保留，不重建索引 |
| `.specforge/core/standards/` | 可用 starter 补齐或刷新稳定规则 |
| `.specforge/core/artifacts/templates/` | 可用 starter 补齐或刷新模板 |
| `.specforge/core/scripts/` | 可用 starter 补齐或刷新工具脚本 |
| 旧版根 `specs/`、根 `scripts/` | 只报告迁移建议，不自动移动或删除 |

低置信度迁移必须先问用户，不要把看起来像规格的文档自动塞进 `.specforge/wiki/`。

## 启动扫描

1. 检查 `.specforge/` 是否存在。
2. Glob 全仓库 Markdown 文档，排除 `.git/`、`node_modules/`、`.specforge/work/archive/`。
3. 检查是否有旧版根 `specs/` 或根 `scripts/`。
4. 如果 `.specforge/` 已存在，运行 `node .specforge/core/scripts/codebase-map.mjs --json` 判断是否已有业务代码。
5. 汇报走空仓库路径、存量项目路径还是迁移路径。

## 空仓库路径

执行：

```bash
npx github:huangrx6/SpecForge init --dir .
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/codebase-map.mjs --json
```

不要在普通业务项目中搜索 `/Users/.../workspace/specforge` 或其他个人目录来寻找 CLI。只有用户明确说“用本地 SpecForge 源码版本测试”时，才改用：

```bash
node cli/specforge.mjs init --dir /path/to/project
```

只允许根据用户已给出的项目信息补充 `.specforge/AGENTS.md` 的项目约束段，不要凭空补业务事实。

如果 `codebase-map.mjs` 显示 `has_codebase: true`，说明这不是纯空仓库，而是已有项目接入。此时输出下一步为 `sf-steering`，先建立 `.specforge/wiki/` 项目画像，不要直接进入 `sf-intake`。

## 迁移路径

生成映射表：

| 现有文件 | 推测内容类型 | 建议归入 SpecForge | 置信度 |
|---|---|---|---|
| `docs/ARCHITECTURE.md` | 架构现状 | `.specforge/wiki/architecture.md` | 高 |
| `SPEC.md` | 需求或功能规格 | 需用户确认 | 低 |

规则：

- 高置信度可列出后执行。
- 中/低置信度必须问用户。
- 不移动、不删除用户未确认的文件。
- `.specforge/core/standards/`、`.specforge/core/artifacts/templates/`、`.specforge/core/scripts/` 可用 starter 刷新。
- `.specforge/wiki/`、`.specforge/work/`、`.specforge/registry.yaml` 保留已有内容。
- 迁移后运行 `node .specforge/core/scripts/codebase-map.mjs --json`；只要仓库已有业务代码，就把下一步路由到 `sf-steering`。

## 关联标准

- `.specforge/core/standards/workflow.md`：初始化边界、上下文加载和中文输出。

## 验收

- `.specforge/AGENTS.md` 存在。
- `.specforge/registry.yaml` 存在。
- `.specforge/wiki/`、`.specforge/work/`、`.specforge/core/scripts/` 存在。
- `node .specforge/core/scripts/doctor.mjs` 通过。
- 已有业务代码时，已明确提示下一步 `sf-steering`，用于生成项目画像和 wiki 基线。

## 不做

- 不在项目根目录创建 `specs/` 或 `scripts/`。
- 不把全局 skill 文件复制进业务项目。
- 不替用户迁移低置信度文档。
