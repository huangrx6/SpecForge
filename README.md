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

内部阶段参考在 `.specforge/stage-guides/`，不作为全局技能安装。

## 项目内命令

```bash
node .specforge/tools/doctor.mjs
node .specforge/tools/create-change.mjs "Change title"
node .specforge/tools/instructions.mjs
```
