# 内部技能库说明

`.specforge/skills/` 保存 SpecForge 生命周期的内部技能。它们不是全局安装入口，而是项目运行时可以按需读取的阶段能力包。根级 `specforge-*` 技能负责触发和路由；本目录的内部技能负责定义阶段行为、输入输出、停止条件和完成标准。

## 结构约定

每个内部技能使用标准 skill 形态：

```text
skills/<name>/
└── SKILL.md
```

`SKILL.md` 必须包含 YAML frontmatter：

```yaml
---
name: <folder-name>
description: <说明此技能做什么，以及什么时候使用>
---
```

保持入口短而可执行；如果某个内部技能后续变长，再拆 `references/`。不要把所有规则、模板和示例都塞进一个文件。

## 与根级技能的对应关系

| 内部技能 | 根级技能 |
|---|---|
| `discovery/SKILL.md` | `specforge`、`specforge-intake` |
| `requirements/SKILL.md` | `specforge-spec` |
| `design/SKILL.md` | `specforge-spec` |
| `task-planning/SKILL.md` | `specforge-spec` |
| `spec-review/SKILL.md` | `specforge-review` |
| `implementation/SKILL.md` | `specforge-implement` |
| `code-review/SKILL.md` | `specforge-review` |
| `verification/SKILL.md` | `specforge-verify` |
| `ssot-sync/SKILL.md` | `specforge-close` |
| `status/SKILL.md` | `specforge-doctor`、`specforge-work` |
| `steering/SKILL.md` | `specforge-onboard`、`specforge-close` |

## 维护规则

- 阶段行为变化时，先更新 `.specforge/skills/<name>/SKILL.md`，再更新对应根级 skill。
- 根级 skill 只保留运行时入口、动作、停止条件和完成标准，不复制内部技能的全部内容。
- 业务项目通过 onboard 会获得本目录的发行快照，保证离线环境也能读取内部技能。
- 不要在这里写项目特定事实。长期项目知识放在 `.specforge/knowledge/`，阶段证据放在 change 目录中。

## 验证命令

```bash
node .specforge/tools/sync-starter-assets.mjs
node .specforge/tools/sync-starter-assets.mjs --check
node .specforge/tools/validate-skills.mjs
node .specforge/tools/doctor.mjs
```
