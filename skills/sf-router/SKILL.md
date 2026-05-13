---
name: sf-router
description: SpecForge 工作流根入口。用于用户只说“sf”、询问当前到哪一步、提出新需求、说继续、想自动推进或不知道该用哪个 SpecForge 能力时；本技能只扫描仓库、判断状态并路由到一个 sf-* 子技能。
---

# sf-router

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

## 启动必读

开始任何判断前，先检查当前仓库是否接入 SpecForge：

1. 看是否存在 `.specforge/`。
2. 存在时读取 `.specforge/attention.md`；缺失则提示骨架不完整，先补齐或运行 `sf-onboard`。
3. 运行 `node .specforge/execution/tools/doctor.mjs`。
4. 有 active change 时，再运行 `node .specforge/execution/tools/instructions.mjs`。

`sf-router` 只做路由，不写规格、不实现代码、不批准 gate。

## 内部技能母本

- 状态判断优先读取 `.specforge/execution/stages/status/SKILL.md`。
- 新请求分诊或 discovery 判断优先读取 `.specforge/execution/stages/discovery/SKILL.md`。
- 根级 skill 只负责扫描和路由；阶段行为以对应内部 skill 为准。

## 体系速读

SpecForge 分成两层：

```text
全局技能：sf-router / sf-*     负责让 AI 工具知道怎么工作
项目目录：.specforge/          保存规则、模板、tools、项目事实和 change
```

在 Agent 技能列表里输入 `sf` 前缀，应能看到 `sf-router` 和所有 `sf-*` 生命周期技能。

项目接入后只落一个目录：

```text
.specforge/
├── attention.md
├── manifest.yaml
├── registry.yaml
├── policy/
├── artifacts/
├── execution/
└── workspace/
```

## 场景路由表

| 用户说什么 / 当前状态 | 路由到 |
|---|---|
| 仓库没有 `.specforge/` | `sf-onboard` |
| 问“现在到哪一步 / 健康状态 / 能不能继续” | `sf-doctor` |
| 提出新需求、新 bug、重构想法，且没有 active change | `sf-intake` |
| active change 需要深度分析 / brief 不足以支撑 requirements | `sf-discovery` |
| active change 下一步是 gap_report / research | `sf-discovery` |
| active change 是产品型，需要对齐产品目标和功能边界 | `sf-prd` |
| active change 下一步是 requirements | `sf-requirements` |
| active change 下一步是 design | `sf-design` |
| active change 下一步是 tasks | `sf-tasking` |
| active change 下一步是 spec_review gate | `sf-spec-review` |
| spec_review 已批准，准备写代码 | `sf-implement` |
| 下一步是 code_review gate | `sf-code-review` |
| code_review 已批准，需要测试和证据 | `sf-verify` |
| verification 已批准，需要 SSoT sync / release / rollback / archive | `sf-close` |
| 用户明确说“继续做完 / 自动推进 / 不要停” | `sf-work` |
| （兼容）active change 下一步是 requirements / design / tasks / spec_review | `sf-spec` |
| （兼容）下一步是 spec_review 或 code_review gate | `sf-review` |

## 路由决策树

1. 检查 `.specforge/` 是否存在。
   - 不存在：路由到 `sf-onboard`。
2. 读取 `.specforge/registry.yaml`。
   - 没有 active change，且用户提出新需求 / bug / 重构：路由到 `sf-intake`。
   - 没有 active change，且用户问状态：路由到 `sf-doctor`。
3. 有多个 active change。
   - 列出 active change 的 id、title、status、path。
   - 要求用户指定要继续哪一个，不要猜。
4. 有一个 active change。
   - 运行 `node .specforge/execution/tools/instructions.mjs`。
   - 根据 ready artifact 路由：
     - `requirements` → `sf-requirements`
     - `gap_report` → `sf-discovery`
     - `research` → `sf-discovery`
     - `design` → `sf-design`
     - `tasks` → `sf-tasking`
     - `spec_review` → `sf-spec-review`
     - `implementation` → `sf-implement`
     - `code_review` → `sf-code-review`
     - `verification` → `sf-verify`
     - `ssot_sync` / `closure` → `sf-close`
5. 用户明确要求自动推进。
   - 路由到 `sf-work`。
   - 仍然必须保留 doctor、instructions、gate evidence 和 verification 检查。

根路由只推荐下一步，不直接替子技能写产物。

## 扫描时必须关联的规则

- 状态判断：`.specforge/policy/rules/context/README.md`、`.specforge/policy/rules/artifact-graph.md`
- 阶段推进：`.specforge/policy/rules/gates/README.md`
- 范围判断：`.specforge/policy/rules/boundaries/README.md`

## 输出格式

只输出：

- 当前仓库是否接入 SpecForge。
- active change、stage、gate 状态。
- 建议路由到哪个 `sf-*`。
- 一句话原因。

## 不做

- 不直接写 requirements / design / tasks。
- 不直接实现代码。
- 不批准 gate。
- 不把动态资产写到 `.specforge/` 之外。
