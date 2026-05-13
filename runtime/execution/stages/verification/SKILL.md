---
name: verification
description: SpecForge 内部验证技能。用于证明 change 可工作，记录 verification report、CI result、evidence links 和 known gaps。
---

# Verification Skill

本技能证明 change 可工作，并留下可追溯验证证据。验证不等于“跑一下测试”，而是让风险和证据匹配。

## 读取

- `01-spec/requirements.md`
- `01-spec/design.md`
- `01-spec/tasks.md`
- `03-implementation/report.md`
- `04-code-review/code-review-v1.md`
- `.specforge/policy/rules/testing/README.md`
- `.specforge/policy/rules/gates/README.md`
- `.specforge/policy/rules/delivery/README.md`

## 写入

- `05-verification/report.md`
- `05-verification/ci-result.md`
- 通过 `node .specforge/execution/tools/gate.mjs verification <status> --evidence 05-verification/report.md` 更新门禁

## 验证流程

1. 根据 requirements 和 design 列出必须验证的行为。
2. 根据风险选择测试层级：单元、集成、E2E、手工、静态检查、构建或 CI。
3. 实际运行可用命令，记录命令、结果、时间和关键输出摘要。
4. 无法运行时说明原因、替代证据和残余风险。
5. 有 CI 时记录链接、状态和失败摘要。

## 证据要求

- 写明实际执行，不写“应该通过”。
- 失败测试不得标成通过。
- 手工验证必须有步骤和结果。
- 跳过验证必须有理由和 owner。

## 停止条件

- code review 未批准。
- 阻断测试失败。
- 缺少运行环境且没有替代验证方案。
- 发现实现偏离 spec。

## 完成标准

- verification report 足以支撑发布或关闭判断。
- verification gate 状态与证据一致。
- known gaps、风险和后续 owner 清楚。
