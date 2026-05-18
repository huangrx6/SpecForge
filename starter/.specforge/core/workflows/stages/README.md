# 阶段技能母本

`core/workflows/stages/` 保存 SpecForge 生命周期的内部阶段技能母本。它们不是全局安装入口，而是项目运行时可以按需读取的阶段能力包。`agent-skills/sf-*` 技能负责触发和路由；本目录负责定义阶段行为、输入输出、停止条件和完成标准。

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
| `gap-report/SKILL.md` | `sf-discovery` |
| `research/SKILL.md` | `sf-discovery` |
| `requirements/SKILL.md` | `sf-requirements` |
| `ui-design/SKILL.md` | `sf-ui-design` |
| `technical-design/SKILL.md` | `sf-tech-design` |
| `task-planning/SKILL.md` | `sf-tasking` |
| `spec-review/SKILL.md` | `sf-spec-review` |
| `implementation/SKILL.md` | `sf-implement` |
| `code-review/SKILL.md` | `sf-code-review` |
| `verification/SKILL.md` | `sf-verify` |
| `wiki-sync/SKILL.md` | `sf-wiki`、`sf-close` |
| `closure/SKILL.md` | `sf-close` |
| `status/SKILL.md` | `sf-doctor`、`sf-work` |
| `steering/SKILL.md` | `sf-onboard`、`sf-close` |

> `sf-prd` 不对应固定的内部 stage 技能母本；它直接在 `discovery/SKILL.md` 的候选功能池章节和 `product-discovery` 规则基础上生成 PRD。

## 维护规则

- 阶段行为变化时，先更新 `core/workflows/stages/<name>/SKILL.md`，再更新对应 `agent-skills/sf-*` skill。
- 不要把 UI 体验设计和技术架构设计重新合并成一个长期维护的 stage。
- 入口 skill 只保留运行时入口、动作、停止条件和完成标准，不复制内部技能的全部内容。
- 业务项目通过 onboard 会获得本目录的发行快照，保证离线环境也能读取内部技能。
- 不要在这里写项目特定事实。长期项目知识放在 `.specforge/wiki/`，阶段证据放在 work item 目录中。

## 验证命令

```bash
node core/scripts/sync-starter.mjs
node core/scripts/validate-skills.mjs
node core/scripts/validate-structure.mjs
node .specforge/core/scripts/doctor.mjs
```
