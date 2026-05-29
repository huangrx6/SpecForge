# 发布记录

状态：待填写

## 1. 发布摘要

| 项目 | 值 |
|---|---|
| 工作项 | |
| 发布类型 | local / CI / staging / production / N/A |
| 影响范围 | |
| 发布结论 | 已发布 / 待发布 / 不涉及生产发布 |

## 2. 交付内容

| 内容 | 来源任务 / 规格 | 影响用户 / 模块 |
|---|---|---|
| | | |

## 3. 发布前检查

| 检查项 | 结果 | 证据 |
|---|---|---|
| verification gate 已批准 | 是 / 否 | |
| wiki_sync gate 已批准 | 是 / 否 | |
| verification 残余风险已进入观察点 | 是 / 否 / N/A | |
| rollback 触发条件已覆盖关键风险 | 是 / 否 / N/A | |
| doctor 通过 | 是 / 否 | |
| release / rollback 已填写 | 是 / 否 | |

## 4. 证据引用

| 证据 | 路径 / 链接 | 结论 |
|---|---|---|
| verification report | `05-verification/report.md` | |
| wiki sync | `06-close/wiki-sync.md` | |
| implementation report | `03-implementation/report.md` | |
| code review | `04-code-review/code-review-v1.md` | |

## 5. 发布步骤

> 不涉及生产发布时写 N/A 理由。

1. 

## 6. 发布后观察

| 观察项 | 方法 | 预期 | 负责人 |
|---|---|---|---|
| 日志 / 指标 / trace / 业务数据 | | | |

## 7. 不涉及生产发布的说明

| 原因 | 交付状态 | 后续触发条件 |
|---|---|---|
| | 已交付 / 待发布 / N/A | |

## 8. 备注

- 

## 9. SpecForge 本体同步提示

> 仅当当前仓库是 SpecForge 本体，且本次修改影响 `skills/`、`core/workflows/stages/`、`core/skills/` 或 `core/standards/` 时填写；否则写 N/A。

| 项 | 值 |
|---|---|
| 是否影响 Agent skill / runtime 母本 | 是 / 否 / N/A |
| 影响范围 | |
| 是否需要用户另行决定同步安装到 Codex / Claude Code / cc-switch / Trae CN | 是 / 否 / N/A |
| 备注 | 不自动执行安装或同步命令，除非用户单独明确要求 |
