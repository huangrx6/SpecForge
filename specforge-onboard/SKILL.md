---
name: specforge-onboard
description: 将新仓库或已有仓库接入 SpecForge；初始化唯一项目目录 .specforge/，复制规范、模板、工具和参考资料，并建立空 registry、project SSoT 与 changes 工作区。
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
- 已有 `.specforge/project/`、`.specforge/changes/`、`.specforge/registry.yaml` 不覆盖。

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
├── reference/
├── project/
├── registry.yaml
└── changes/
    ├── inbox/
    ├── active/
    └── archive/
```

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
| `docs/ARCHITECTURE.md` | 架构现状 | `.specforge/project/engineering/architecture.md` | 高 |
| `SPEC.md` | 需求或功能规格 | 需用户确认 | 低 |

规则：

- 高置信度可列出后执行。
- 中/低置信度必须问用户。
- 不移动、不删除用户未确认的文件。
- `.specforge/rules/`、`.specforge/templates/`、`.specforge/tools/`、`.specforge/reference/` 可用 starter 刷新。
- `.specforge/project/`、`.specforge/changes/`、`.specforge/registry.yaml` 保留已有内容。

## 关联规则

- 初始化边界：`.specforge/rules/boundaries.md`
- 上下文加载：`.specforge/rules/context.md`
- 中文输出：`.specforge/rules/localization.md`

## 验收

- `.specforge/attention.md` 存在。
- `.specforge/registry.yaml` 存在。
- `.specforge/project/`、`.specforge/changes/`、`.specforge/tools/` 存在。
- `node .specforge/tools/doctor.mjs` 通过。

## 不做

- 不在项目根目录创建 `specs/` 或 `scripts/`。
- 不把全局 skill 文件复制进业务项目。
- 不替用户迁移低置信度文档。
