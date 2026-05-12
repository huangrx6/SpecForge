# SpecForge

SpecForge 是一套面向 AI Agent 协作的软件规格驱动开发协议。

它的分发形态和 CodeStable 一样：仓库根目录就是 skill bundle，`npx skills add <github-url>` 可以直接安装根目录下的 `specforge*` 技能。

## 安装技能

推荐方式：

```bash
npx skills add https://github.com/huangrx6/SpecForge
```

指定安装目标：

```bash
# 只安装到 Codex，全局安装
npx skills add https://github.com/huangrx6/SpecForge -g -a codex -s '*'

# 只安装到 Claude Code，全局安装
npx skills add https://github.com/huangrx6/SpecForge -g -a claude-code -s '*'

# 同时安装到 Codex 和 Claude Code
npx skills add https://github.com/huangrx6/SpecForge -g -a codex -a claude-code -s '*'

# 先看这个仓库里有哪些 skill
npx skills add https://github.com/huangrx6/SpecForge --list
```

参数说明：

| 参数 | 含义 |
|---|---|
| `-g` / `--global` | 安装到用户级目录，不是当前项目目录 |
| `-a` / `--agent` | 指定目标工具，比如 `codex`、`claude-code` |
| `-s` / `--skill` | 指定安装哪些技能，`'*'` 表示全部 |

本地开发或 npm 包方式：

```bash
npx specforge skill add --target codex --apply
npx specforge skill add --target claude-code --apply
npx specforge skill add --target cc-switch --apply
```

### 安装方式怎么选

| 场景 | 推荐方式 |
|---|---|
| 首次安装、快速体验 | `npx skills add https://github.com/huangrx6/SpecForge` |
| 指定安装到某个 Agent | `npx skills add https://github.com/huangrx6/SpecForge -a codex -s '*'` |
| 本地开发 SpecForge 自身 | `npm run install:skills` 或 `node bin/specforge.mjs skill add --target all --apply` |
| 从 npm 包或离线分发安装 | `npx specforge skill add --target <agent> --apply` |

两条安装链路安装的是同一组根级 `specforge*` skills，区别主要是分发渠道和调试场景。

| 安装链路 | 本质职责 | 适合谁 | 为什么保留 |
|---|---|---|---|
| `npx skills add https://github.com/huangrx6/SpecForge` | 使用通用 skills 安装器，从 GitHub 读取根级 skills | 普通用户、想直接跟随仓库最新版的人 | 零发布负担，fork 后也能直接安装 |
| `npx specforge skill add --target <agent> --apply` | 使用 SpecForge 自带 CLI，从 npm 包或本地源码复制根级 skills | 本地开发者、离线/私有分发、需要调试安装路径的人 | 不依赖上游安装器行为，便于验证 Codex / Claude Code / cc-switch 目标目录 |

这两者都只安装全局技能，不会初始化业务项目。业务项目初始化使用 `specforge-onboard` 或：

```bash
npx specforge init --dir .
```

## 使用

进入业务项目后，对 AI 工具说：

```text
specforge-onboard
```

它会初始化唯一项目目录：

```text
.specforge/
```

之后日常不知道该用哪个技能时，喊根入口：

```text
specforge
```

## 技能总览

| 技能 | 用途 |
|---|---|
| `specforge` | 根入口：扫描仓库、判断状态、路由到具体子技能 |
| `specforge-onboard` | 初始化业务项目的 `.specforge/` |
| `specforge-intake` | 把用户请求整理成 active change |
| `specforge-spec` | 生成 requirements / design / tasks / spec_review |
| `specforge-implement` | 按批准任务实现代码 |
| `specforge-review` | 执行 spec_review / code_review gate |
| `specforge-verify` | 运行测试并记录验证证据 |
| `specforge-close` | SSoT sync、release、rollback、archive |
| `specforge-doctor` | 健康检查和下一步判断 |
| `specforge-work` | 一键推进，但不跳过 gate |

## 仓库结构

```text
specforge*/                 # 可被 npx skills add 识别的根级 skills
.specforge/                 # SpecForge 自身的规范包、runtime、starter
bin/specforge.mjs           # npm/GitHub CLI
README.md
```

内部阶段技能在 `.specforge/skills/`，不作为全局技能安装。

`.specforge/skills/` 与根级 skills 的关系：

- `.specforge/skills/*/SKILL.md` 是阶段行为母本，适合放阶段流程、输入输出、边界、停止条件和完成标准。
- `specforge-* / SKILL.md` 是发行给 Agent 的运行时指令，应该短、聚焦、可执行。
- 修改阶段行为时，先更新内部 skill，再同步对应 root skill。
- `node .specforge/tools/validate-skills.mjs` 会检查内部 skill 与 root skill 的基础映射是否完整。

Starter 不是第二份源头，而是按 `.specforge/starter.manifest.json` 从根 `.specforge/` 生成的发行快照。改动 rules、templates、tools、skills 等静态资产后，运行：

```bash
npm run sync:starter
npm run check:starter
```

`sync:starter` 会按 manifest 复制静态资产，并生成空的 `registry.yaml`、`changes/*/.gitkeep` 和轻量 `knowledge/` 占位。它不会把 SpecForge 自身的 `.specforge/changes/` 和 `.specforge/registry.yaml` 原样复制到业务项目 starter。

## 项目内命令

```bash
node .specforge/tools/doctor.mjs
node .specforge/tools/create-change.mjs "变更标题"
node .specforge/tools/instructions.mjs
```

## 5 分钟快速上手

假设你要给业务项目添加“用户登录功能”：

1. 初始化项目：对 AI 说 `specforge-onboard`。它会在项目内创建唯一的 `.specforge/` 工作区。
2. 录入需求：对 AI 说 `specforge-intake`，或直接说你的需求并让根入口 `specforge` 路由。
3. 生成规格：对 AI 说 `specforge-spec`，产出 `requirements.md`、`design.md`、`tasks.md` 和规格审查记录。
4. 评审规格：对 AI 说 `specforge-review`。`spec_review` 未批准前不进入实现。
5. 实现代码：对 AI 说 `specforge-implement`。实现必须跟随已批准的 tasks 和写入范围。
6. 代码审查：再次对 AI 说 `specforge-review`，这次执行 `code_review` gate。
7. 验证证据：对 AI 说 `specforge-verify`，运行测试或记录替代验证证据。
8. 关闭变更：对 AI 说 `specforge-close`，完成 SSoT sync、release、rollback 记录并 archive。

如果你明确想自动推进，可以说 `specforge-work`。它会循环读取 artifact graph 和 instructions，但仍然必须在 gate、测试失败、高风险操作或澄清项处停下来。

## 状态与图谱

SpecForge 用 artifact graph 判断下一步，而不是只看目录顺序：

```bash
node .specforge/tools/artifact-graph-status.mjs
node .specforge/tools/instructions.mjs
node .specforge/tools/instructions.mjs -- apply
```

- `artifact-graph-status.mjs` 是地图：显示每个 artifact 是 `done`、`ready`、`blocked` 还是 `partial`。
- `instructions.mjs` 是行动卡：输出当前 ready artifact、依赖、输出文件、gate 和应该加载的 rules。
- `gate.mjs` 是门禁写入工具：`APPROVED` 必须绑定已存在的 evidence 文件。

更多协议细节见 `.specforge/PROTOCOL.md`。
