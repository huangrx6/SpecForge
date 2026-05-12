---
name: specforge
description: SpecForge 工作流根入口。用于用户只说“specforge”、询问当前到哪一步、提出新需求、说继续、想自动推进或不知道该用哪个 SpecForge 能力时；本技能只扫描仓库、判断状态并路由到一个 specforge-* 子技能。
---

# specforge

## 启动必读

开始任何判断前，先检查当前仓库是否接入 SpecForge：

1. 看是否存在 `.specforge/`。
2. 存在时读取 `.specforge/attention.md`；缺失则提示骨架不完整，先补齐或运行 `specforge-onboard`。
3. 读取 `.specforge/reference/system-overview.md`，只取结构速览。
4. 运行 `node .specforge/tools/doctor.mjs`。
5. 有 active change 时，再运行 `node .specforge/tools/instructions.mjs`。

`specforge` 只做路由，不写规格、不实现代码、不批准 gate。

## 体系速读

SpecForge 分成两层：

```text
全局技能：specforge / specforge-*     负责让 AI 工具知道怎么工作
项目目录：.specforge/                 保存规则、模板、tools、项目事实和 change
```

项目接入后只落一个目录：

```text
.specforge/
├── attention.md
├── manifest.yaml
├── rules/
├── workflows/
├── templates/
├── tools/
├── reference/
├── project/
├── registry.yaml
└── changes/
```

## 场景路由表

| 用户说什么 / 当前状态 | 路由到 |
|---|---|
| 仓库没有 `.specforge/` | `specforge-onboard` |
| 问“现在到哪一步 / 健康状态 / 能不能继续” | `specforge-doctor` |
| 提出新需求、新 bug、重构想法，且没有 active change | `specforge-intake` |
| active change 下一步是 requirements / design / tasks / spec_review | `specforge-spec` |
| spec_review 已批准，准备写代码 | `specforge-implement` |
| 下一步是 spec_review 或 code_review gate | `specforge-review` |
| code_review 已批准，需要测试和证据 | `specforge-verify` |
| verification 已批准，需要 SSoT sync / release / rollback / archive | `specforge-close` |
| 用户明确说“继续做完 / 自动推进 / 不要停” | `specforge-work` |

## 扫描时必须关联的规则

- 状态判断：`.specforge/rules/context.md`、`.specforge/rules/artifact-graph.md`
- 阶段推进：`.specforge/rules/gates.md`
- 范围判断：`.specforge/rules/boundaries.md`

## 输出格式

只输出：

- 当前仓库是否接入 SpecForge。
- active change、stage、gate 状态。
- 建议路由到哪个 `specforge-*`。
- 一句话原因。

## 不做

- 不直接写 requirements / design / tasks。
- 不直接实现代码。
- 不批准 gate。
- 不把动态资产写到 `.specforge/` 之外。
