---
name: gap-report
description: SpecForge 内部根因分析技能。专门用于 Bugfix 工作流，定位线上或测试阶段暴露的缺陷的深层代码与架构原因。
---

# Gap Report Skill

本技能专注于“诊断和溯源”，它取代了功能开发中的 Requirements 阶段。

## 读取

- `00-intake/original-request.md`
- `00-intake/brief.md`
- `.specforge/policy/rules/engineering/README.md`
- `.specforge/policy/rules/testing/README.md`
- `.specforge/policy/rules/analysis-workflow/README.md`
- `.specforge/policy/rules/boundaries/README.md`
- 相关的代码库源文件及日志片段

## 写入

- `01-spec/gap-report.md`

## 分析流程

1. 判定缺陷类型、严重级别、影响范围和是否需要临时缓解。
2. 重建现场：明确当前行为、期望行为、环境版本和精准复现步骤。
3. 采集证据：日志、失败测试、截图、命令输出或用户报告都要落到 evidence 表。
4. 源码级追踪：定位直接代码触点、触发条件和因果链路；能到行号就到行号。
5. 规格缺口反思：说明为什么既有需求、设计、测试或观测没能拦截。
6. 给出优选和备选修复方案，评估影响范围、兼容性、回滚或临时开关。
7. 设计回归防护：新增或调整 Unit / Integration / E2E / Manual / Observability 证据。

## 必含章节

- 判定摘要。
- 当前行为、期望行为、复现路径、环境和影响。
- 证据与复现记录。
- 根因追踪：系统层级、触发条件、因果链路和代码触点。
- 规格缺口反思。
- 修复方案选型。
- 采纳方案与边界。
- 防止回归策略。

## 停止条件

- 无法在本地或沙盒环境重现 Bug 且缺乏足够日志。
- 需要外部依赖方提供关键错误信息。
- 缺少现象证据，无法区分真实 bug、预期行为或环境问题。
- 修复方案会扩大到未批准的功能或重构范围。

## 完成标准

- 确切列出了将要修改的文件范围。
- 给出了防止同类错误再次发生的自动化防御策略（Regression Prevention）。
- `gap-report.md` 足以支撑 task-planning 或直接进入 bugfix implementation。
