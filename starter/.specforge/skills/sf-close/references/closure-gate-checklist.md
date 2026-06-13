# Closure Gate Checklist

本文件保存关闭阶段的 wiki sync、release、rollback、archive 和安装提示边界。`SKILL.md` 只保留入口和执行序列。

## 关闭阶段的目标

关闭必须回答四个问题：

| 问题 | 产物 |
|---|---|
| 长期事实有没有回写？ | `06-close/wiki-sync.md` + `.specforge/wiki/*` |
| 交付了什么，怎么发布或为什么不发布？ | `06-close/release.md` |
| 出问题怎么退？ | `06-close/rollback.md` |
| work item 是否可以归档？ | doctor + archive dry-run + archive |

## Wiki Sync 判断

需要回写 wiki 的典型变化：

| 变化 | 目标 |
|---|---|
| 产品规则、角色、流程、术语 | `02-product-rules.md` / `07-glossary.md` |
| UI 设计系统、PC 端业务系统规范、页面规则 | `design-system.md` 或现有 UI wiki |
| 架构、模块边界、技术选型 | `03-architecture.md` / `06-decisions.md` |
| API、事件、SDK、契约 | `api-*.md` |
| 数据模型、迁移注意事项 | `04-data-model.md` |
| 配置、启动、发布、回滚、观测 | `05-operations.md` |
| 风险、技术债、遗留事项 | `08-risks.md` |

不更新 wiki 也要写明具体理由，例如：

- 本次只是局部样式修复，没有长期规则变化。
- 本次只补测试，没有产品或架构事实变化。
- 相关事实已在现有 wiki 中，且无需修改。

不要创建日期版、work item 版、v2 版重复 wiki；同一知识项只有一个 current 文件。

## Release 写法

`release.md` 必须引用证据：

- `05-verification/report.md`
- `06-close/wiki-sync.md`
- `03-implementation/report.md`
- `04-code-review/code-review-v1.md`

发布前检查至少覆盖：

- verification gate approved。
- wiki_sync gate approved。
- verification 残余风险已进入观察点。
- rollback 触发条件覆盖关键风险。
- doctor 可运行。

不涉及生产发布时，不要空过；写：

- 为什么不涉及。
- 当前交付状态。
- 后续触发生产发布的条件。

## Rollback 写法

回滚触发条件必须来自：

- verification 残余风险。
- release 发布后观察项。
- 数据 / 配置 / 权限 / 外部契约风险。
- 用户可见关键路径风险。

回滚步骤要能执行：

- 代码 / 版本回退。
- 数据库 / migration / 回填回退。
- 配置 / feature flag 回退。
- 外部服务 / webhook / job 开关处理。
- 回滚后验证命令或手工检查。

不可回滚时必须写：

- 为什么不可回滚。
- 谁接受风险。
- 补偿措施。
- 发现问题后的缓解路径。

## SpecForge 本体特殊规则

如果当前仓库是 SpecForge 本体，并且 work item 修改了：

- `skills/sf*/SKILL.md`
- `skills/sf*/references/**`
- `skills/<sf-*>/constraints/**`
- `skills/<sf-*>/scripts/commands.json`
- `core/workflows/stages/**` compatibility mirrors
- `core/skills/**`
- `core/standards/**`

release 备注中只提示：

> 本次修改影响 SpecForge skill / runtime 母本；是否同步安装到 Codex / Claude Code / cc-switch / Trae CN 需要用户另行决定。

不要自动执行安装或同步到用户本地 agent 目录，除非用户明确要求。

## Archive 前自检

归档前确认：

- `instructions.mjs` route 到 closure。
- wiki_sync gate approved。
- verification gate approved。
- release / rollback 不为空模板。
- doctor 通过。
- archive dry-run 通过。
- 没有 hook 阻断。

archive 失败时不要手工搬目录；按脚本错误修复后重试。

## 关闭后的 follow-up

关闭后发现新缺陷、遗漏、体验问题或测试漏测，不重新打开已归档 work item。

处理方式：

1. 用 `sf-intake` 新建 follow-up work item。
2. 在新 work item 的 `relations.parent` 关联已归档 id。
3. 在新 brief 中引用原 verification / release / rollback 证据。
