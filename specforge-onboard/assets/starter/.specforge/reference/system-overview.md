# SpecForge 体系总览

SpecForge 的分发形态是 root-level skill bundle：仓库根目录直接暴露 `specforge` 和 `specforge-*` 技能目录，兼容 `npx skills add <github-url>`。

## 三层结构

| 层 | 位置 | 职责 |
|---|---|---|
| 分发层 | GitHub repo 根目录 / npm 包 | 暴露可安装 skills 和 CLI |
| AI 技能层 | `specforge*` 根目录 | 让 AI 工具知道如何路由和执行 |
| 项目工作流层 | 业务项目 `.specforge/` | 保存 rules、templates、tools、project SSoT、changes |

## 项目目录

```text
.specforge/
├── attention.md
├── manifest.yaml
├── rules/
├── workflows/
├── schemas/
├── templates/
├── tools/
├── adapters/
├── reference/
├── project/
├── registry.yaml
└── changes/
```

## 技能与规则

| 技能 | 主要规则 |
|---|---|
| `specforge` | context、artifact-graph、gates、boundaries |
| `specforge-onboard` | boundaries、context、localization |
| `specforge-intake` | context、boundaries、spec-quality、localization |
| `specforge-spec` | spec-quality、boundaries、gates、testing、localization |
| `specforge-implement` | engineering、boundaries、security、testing、context |
| `specforge-review` | gates、boundaries、spec-quality、security、testing |
| `specforge-verify` | testing、gates、boundaries、security |
| `specforge-close` | gates、engineering、boundaries、localization |
| `specforge-work` | artifact-graph、gates、testing、boundaries、security |

## 原则

- 可安装技能只放在仓库根目录。
- `.specforge/` 不放 `SKILL.md`，避免被安装器误识别。
- 业务项目只初始化 `.specforge/`。
- 不跳过 required gate。
