# sf-onboard 结构与迁移参考

本文件保存 `sf-onboard` 的长清单和迁移规则。`SKILL.md` 只保留运行顺序；需要解释生成内容、安装方式或迁移边界时再读本文件。

## 技能安装

当前不要使用 `npx specforge ...`：npm registry 上的 `specforge` 包不是本仓库发行版，命令集不兼容。

Agent skills 推荐使用官方 `skills` CLI，从仓库里的标准 `skills/` 发布视图安装：

```bash
npx skills add https://github.com/huangrx6/SpecForge --skill '*' --agent codex --global
npx skills add https://github.com/huangrx6/SpecForge --skill '*' --agent claude-code --global
npx skills add https://github.com/huangrx6/SpecForge --skill '*' --agent trae-cn --global
```

公司内部仓库推荐固定 tag 或 commit SHA：

```bash
npx skills add git@git.company.com:team/specforge.git#v0.3.0-company.1 --skill '*' --agent codex --global
```

项目级安装：

```bash
npx skills add https://github.com/huangrx6/SpecForge --skill '*' --agent codex
npx skills add https://github.com/huangrx6/SpecForge --skill '*' --agent claude-code
npx skills add https://github.com/huangrx6/SpecForge --skill '*' --agent trae-cn
```

日常安装统一使用官方 `skills` CLI；`specforge` CLI 只负责项目 `.specforge/` 初始化和诊断。

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
│   └── hooks/
├── hooks/
│   └── local/
├── wiki/
└── work/
    ├── inbox/
    ├── active/
    └── archive/
```

## 初始化内容透明清单

| 路径 | 用途 |
|---|---|
| `.specforge/AGENTS.md` | 项目内 Agent 入口、加载顺序、项目约束和状态传递协议 |
| `.specforge/manifest.yaml` | SpecForge 版本、workflow、路径和 gate 策略 |
| `.specforge/registry.yaml` | active / blocked / archive work item 索引 |
| `.specforge/core/standards/` | 稳定流程、边界、测试、安全和 review 规则 |
| `.specforge/core/profiles/` | 可组合技术栈 profile，用于 technical_design 阶段选型 |
| `.specforge/core/workflows/definitions/` | workflow 描述 |
| `.specforge/core/artifacts/schemas/` | artifact graph schema |
| `.specforge/core/artifacts/templates/` | 各阶段产物模板 |
| `.specforge/core/scripts/` | 本地工具脚本 |
| `.specforge/core/hooks/events/` | 默认 noop 生命周期钩子，业务项目可覆盖 |
| `.specforge/core/workflows/stages/` | 阶段行为母本，供 Agent 运行时读取 |
| `.specforge/core/skills/` | 经审查的外部 skill 快照和编排规则 |
| `.specforge/wiki/` | 轻量长期知识库 |
| `.specforge/work/inbox/` | 暂存请求 |
| `.specforge/work/active/` | 正在推进的 work item |
| `.specforge/work/archive/` | 已关闭 work item，只读历史证据 |

onboard 只应创建或补齐 `.specforge/`。不要在业务项目根目录额外创建 `specs/`、`scripts/` 或强制修改 `package.json`。

## Starter 来源

唯一 starter 快照位于 GitHub 仓库：

```text
starter/.specforge/
```

用户或维护者可以在运行 onboard 前查看这个目录，预判会生成哪些文件。`starter/.specforge/` 是隐藏目录；如果普通目录列表看起来为空，使用 `ls -la starter` 或 `find starter -maxdepth 2` 查看。

初始化业务项目时优先调用 GitHub 版 CLI：

```bash
npx github:huangrx6/SpecForge init --dir .
```

公司内部仓库使用 `npm exec --package` 指向内部地址，并固定 tag：

```bash
npm exec --yes --package=git+ssh://git@git.company.com/team/specforge.git#v0.3.0-company.1 -- specforge init --dir .
```

只有在明确处于 SpecForge 源码仓库维护场景时，才使用本地源码 CLI：

```bash
node cli/specforge.mjs init --dir /path/to/project
```

starter 是发行快照，不是第二份源头。维护 SpecForge 自身时，静态核心资产以 `core/` 为母本，并按 `core/starter.manifest.json` 生成 starter：

```bash
node core/scripts/sync-starter.mjs
node core/scripts/sync-starter.mjs --check
```

`.specforge/wiki/`、`.specforge/work/`、`.specforge/hooks/local/` 和 `.specforge/registry.yaml` 属于项目事实或动态证据，不会从源码仓库原样同步到 starter。

## 覆盖规则

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

## 迁移映射

生成映射表：

| 现有文件 | 推测内容类型 | 建议归入 SpecForge | 置信度 |
|---|---|---|---|
| `docs/ARCHITECTURE.md` | 架构现状 | `.specforge/wiki/architecture.md` | 高 |
| `SPEC.md` | 需求或功能规格 | 需用户确认 | 低 |

规则：

- 高置信度可列出后执行。
- 中/低置信度必须问用户。
- 不移动、不删除用户未确认的文件。
- `.specforge/wiki/`、`.specforge/work/`、`.specforge/registry.yaml` 保留已有内容。
- 迁移后运行 `node .specforge/core/scripts/codebase-index.mjs --json`；只要仓库已有业务代码，就把下一步路由到 `sf-steering`。
