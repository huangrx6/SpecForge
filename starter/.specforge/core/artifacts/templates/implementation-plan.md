# 实现计划

状态：草稿

## 范围

| 项目 | 值 |
|---|---|
| 工作项 | |
| 工作流 | |
| 规格审查门禁 | APPROVED / REQUEST_CHANGES / REJECTED |
| 输入产物 | requirements / gap_report / ui_design / technical_design / tasks |
| 选中技术选择卡 | |
| 本次不做 | |

## 任务执行图

| 任务 | 批次 | Trace | Boundary | Depends | 可并行 | Verification | 风险 |
|---|---|---|---|---|---|---|---|
| T001 | W0 | | | | yes / no | | |

## Technical Design 影响面实现计划

> 仅在 `technical-design.md` 适用时填写；否则写 N/A。来源为 `technical-design.md#0. 影响面与读取计划`。`unknown` 不得直接进入实现。

| 影响面 | Approved status | 预计实现动作 / N/A 理由 | 关联任务 | 预计变更范围 | 快速验证 |
|---|---|---|---|---|---|
| Frontend engineering | yes / no / unknown / N/A | | | | |
| Backend engineering | yes / no / unknown / N/A | | | | |
| Domain model / state machine | yes / no / unknown / N/A | | | | |
| API / SDK / Events | yes / no / unknown / N/A | | | | |
| Data / DB / Migration | yes / no / unknown / N/A | | | | |
| Auth / Permission / Security | yes / no / unknown / N/A | | | | |
| Config / Env / Delivery | yes / no / unknown / N/A | | | | |
| Jobs / Queue / Scheduler | yes / no / unknown / N/A | | | | |
| Observability / Reliability | yes / no / unknown / N/A | | | | |

## 脚手架与启动基线

| 检查项 | 命令 / 方法 | 预期结果 | 备注 |
|---|---|---|---|
| 脚手架 / 模板生成 | | | |
| 依赖安装 | | | |
| 构建 / 类型检查 | | | |
| 开发服务 / 后端服务启动 | | | |
| 冒烟验证 | | | |

## 预计变更文件

| 文件 / 目录 | 对应任务 | 批准边界来源 | 变更目的 |
|---|---|---|---|
| | | | |

## 真实 Diff 对账计划

| 检查项 | 命令 / 方法 | 预期处理 |
|---|---|---|
| 工作区状态 | `git status --short --untracked-files=all` | 区分本 work item 改动、无关已有改动、生成产物和临时文件 |
| 真实 diff 文件 | `git diff --name-only` | 全部登记到 `changed-files.md` 或写明排除理由 |
| 真实 diff 摘要 | `git diff --stat` | 与 report 的变更摘要一致 |

## 验证计划

| 验证项 | 命令 / 方法 | 覆盖任务 | 证据写入位置 |
|---|---|---|---|
| | | | |

## 风险与回退

| 风险 | 触发条件 | 缓解 / 回退方式 | 负责人 |
|---|---|---|---|
| | | | |
