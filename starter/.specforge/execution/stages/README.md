# 阶段技能母本

`runtime/execution/stages/` 保存 SpecForge 生命周期的内部阶段技能母本。它们不是全局安装入口，而是项目运行时可以按需读取的阶段能力包。`skills/sf-*` 技能负责触发和路由；本目录负责定义阶段行为、输入输出、停止条件和完成标准。

## 结构约定

每个内部技能使用标准 skill 形态：

```text
stages/<name>/
└── SKILL.md
```

`SKILL.md` 必须包含 YAML frontmatter：

```yaml
---
name: <folder-name>
description: <说明此技能做什么，以及什么时候使用>
---
```

## 与入口技能的对应关系

| 内部技能 | 入口技能 |
|---|---|
| `discovery/SKILL.md` | `sf`、`sf-intake`、`sf-discovery` |
| `gap-report/SKILL.md` | `sf-spec`（兼容）、`sf-discovery` |
| `research/SKILL.md` | `sf-spec`（兼容）、`sf-discovery` |
| `requirements/SKILL.md` | `sf-spec`（兼容）、`sf-requirements` |
| `design/SKILL.md` | `sf-spec`（兼容）、`sf-design` |
| `task-planning/SKILL.md` | `sf-spec`（兼容）、`sf-tasking` |
| `spec-review/SKILL.md` | `sf-review`（兼容）、`sf-spec-review` |
| `implementation/SKILL.md` | `sf-implement` |
| `code-review/SKILL.md` | `sf-review`（兼容）、`sf-code-review` |
| `verification/SKILL.md` | `sf-verify` |
| `ssot-sync/SKILL.md` | `sf-close` |
| `status/SKILL.md` | `sf-doctor`、`sf-work` |
| `steering/SKILL.md` | `sf-onboard`、`sf-close` |

> `sf-prd` 不对应固定的内部 stage 技能母本；它直接在 `discovery/SKILL.md` 的候选功能池章节和 `product-discovery` 规则基础上生成 PRD。

## 维护规则

- 阶段行为变化时，先更新 `runtime/execution/stages/<name>/SKILL.md`，再更新对应 `skills/sf-*` skill。
- 入口 skill 只保留运行时入口、动作、停止条件和完成标准，不复制内部技能的全部内容。
- 业务项目通过 onboard 会获得本目录的发行快照，保证离线环境也能读取内部技能。
- 不要在这里写项目特定事实。长期项目知识放在 project knowledge，阶段证据放在 change 目录中。

## 验证命令

```bash
node runtime/execution/tools/sync-starter-assets.mjs
node runtime/execution/tools/validate-skills.mjs
node runtime/execution/tools/validate-structure.mjs
node .specforge/execution/tools/doctor.mjs
```
