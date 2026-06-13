# 阶段技能母本

`core/workflows/stages/` 是兼容镜像和底层发行资产。日常维护优先进入对应 `skills/<sf-*>/constraints/stages/` 技能包；每个 `sf-*` 技能包聚合自己的入口说明、阶段约束、参考资料和脚本命令索引。

## 结构约定

每个内部技能使用标准 skill 形态：

```text
stages/<name>/
└── SKILL.md
```

跨 public skill、stage constraint 和 gate evidence 的术语契约保存在 `drift-rules.json`。修改 gate 名称、artifact id、证据路径或入口 skill 映射时，必须同步 `skills/sf-router/constraints/workflow/` 中的技能包副本，并运行 framework audit。阶段输出评分维度保存在 `score-rubric.json`，用于把“好输出长什么样”从主观感觉沉淀为可审计规则。

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
| `brainstorm/SKILL.md` | `sf-brainstorm`、`sf-intake`、`sf-prd`、`sf-requirements`、`sf-ui-design`、`sf-tech-design` |
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
| `steering/SKILL.md` | `sf-steering`、`sf-onboard`、`sf-intake`、`sf-wiki`、`sf-close` |

> `brainstorm` 是 graph 外阶段：它可以生成 `00-intake/brainstorm.md` 并回写 brief，但不强制每个 work item 都经过它。`sf-prd` 不对应固定的内部 stage 技能母本；它读取 brief / brainstorm 的已确认选择后生成 PRD。

## Artifact / Entry / Stage Alias

外部入口、artifact id 和内部目录不总是一一同名；维护时先看本表，避免误以为缺少 stage。

| Artifact id | Public entry | Internal stage directory | 说明 |
|---|---|---|---|
| `intake` | `sf-intake` | `status` / `steering` / `brainstorm` as needed | intake 是路由与建项动作，不是单一 stage skill |
| `research` | `sf-discovery` | `research` | 研究结论和来源质量 |
| `gap_report` | `sf-discovery` | `gap-report` | issue / bugfix 的现象、根因和修复方向 |
| `requirements` | `sf-requirements` | `requirements` | 可测试行为规格 |
| `ui_design` | `sf-ui-design` | `ui-design` | UI / UX 设计与 Pencil 证据 |
| `technical_design` | `sf-tech-design` | `technical-design` | 技术方案和影响面 |
| `tasks` | `sf-tasking` | `task-planning` | `tasks` 是 artifact 名；内部目录沿用动词式 planning 以表达拆解过程 |
| `spec_review` | `sf-spec-review` | `spec-review` | 规格审查 gate |
| `implementation` | `sf-implement` | `implementation` | 实现记录 |
| `code_review` | `sf-code-review` | `code-review` | 代码审查 gate |
| `verification` | `sf-verify` | `verification` | 验证 gate |
| `wiki_sync` | `sf-wiki` | `wiki-sync` | 长期知识回写 gate |
| `closure` | `sf-close` | `closure` | release / rollback / archive |

## 维护规则

- 阶段行为变化时，先更新对应 `skills/<sf-*>/constraints/stages/<name>/SKILL.md`，再同步兼容镜像和 starter。
- gate、artifact、证据路径或入口映射变化时，同步 `skills/sf-router/constraints/workflow/drift-rules.json`；不要让 public skill 和 stage constraint 各自维护一套说法。
- 新增或重命名 stage 时，同步 `eval-fixtures.json` 和 `score-rubric.json`；前者定义阻断样例，后者定义质量评分关注点。
- 不要把 UI 体验设计和技术架构设计重新合并成一个长期维护的 stage。
- 入口 skill 保留运行时入口、动作、停止条件和完成标准；关联约束、脚本索引和参考资料放在同一个 `skills/<sf-*>/` 技能包内。
- 业务项目通过 onboard 会获得本目录的发行快照，保证离线环境也能读取内部技能。
- 不要在这里写项目特定事实。长期项目知识放在 `.specforge/wiki/`，阶段证据放在 work item 目录中。

## 验证命令

```bash
node core/scripts/sync-starter.mjs
node core/scripts/validate-skills.mjs
node core/scripts/validate-structure.mjs
node .specforge/core/scripts/doctor.mjs
```
