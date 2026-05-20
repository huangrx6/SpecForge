# 实现报告

状态：待填写

## 1. 摘要

- 实现结论：
- 对应 tasks：
- 主要变更范围：
- 未完成 / 延后：
- 是否存在偏离：

## 1.1 任务状态语义

| 状态 | 含义 |
|---|---|
| DONE | 代码、证据、changed-files 和 task 勾选一致 |
| DONE_WITH_CONCERNS | 已实现但存在需 review / verify 特别关注的风险 |
| BLOCKED | 因环境、依赖、权限或外部服务阻塞 |
| NEEDS_SPEC | 发现规格缺口或需要扩大范围，必须回到 spec |

## 2. 任务执行

| 任务 | 状态 | 变更文件 | 失败优先 / 快速验证证据 | 备注 |
|---|---|---|---|---|
| T001 | DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_SPEC | | | |

## 3. 变更内容

| 模块 / 文件 | 变更说明 | 对应任务 | 批准边界来源 | 风险 |
|---|---|---|---|---|
| | | | | |

## 4. Technical Design 影响面实现对账

> 仅在 `technical-design.md` 适用时填写；否则写 N/A。`yes` 必须有实现和验证；`no` 不应出现未经批准的真实 diff；`unknown` 必须退回澄清，不能直接实现。

| 影响面 | Approved status | 实际处理 | 关联文件 / 任务 | 快速验证 | 偏离 / 备注 |
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

## 5. 启动与运行基线

| 检查项 | 命令 / 方法 | 结果 | 备注 |
|---|---|---|---|
| 依赖安装 | | 通过 / 失败 / 未运行 / N/A | |
| 构建 / typecheck / lint | | 通过 / 失败 / 未运行 / N/A | |
| 开发服务 / 后端服务启动 | | 通过 / 失败 / 未运行 / N/A | |
| 数据库迁移 / 回滚 | | 通过 / 失败 / 未运行 / N/A | |
| 冒烟验证 / 健康检查 | | 通过 / 失败 / 未运行 / N/A | |

## 6. 验证记录

| 验证类型 | 命令 / 方法 | 结果 | 覆盖任务 |
|---|---|---|---|
| 单元 / 组件 | | 通过 / 失败 / 未运行 / N/A | |
| 集成 / 契约 | | 通过 / 失败 / 未运行 / N/A | |
| E2E / UI | | 通过 / 失败 / 未运行 / N/A | |
| 启动 / 配置 | | 通过 / 失败 / 未运行 / N/A | |
| 安全 / 权限 | | 通过 / 失败 / 未运行 / N/A | |
| 迁移 / 回滚 | | 通过 / 失败 / 未运行 / N/A | |

## 7. Figma / UI 实现备注

> 无 Figma / UI 实现可写 N/A。

| 项 | 结论 / 证据 |
|---|---|
| Figma Frame / Section | |
| design context 获取 | 通过 / 失败 / N/A |
| screenshot 获取 | 通过 / 失败 / N/A |
| 项目组件复用 | |
| token 映射 | |
| 与 Figma 偏离 | |
| 待 verification 视觉证据 | |

## 8. 与规格的对应关系

| 来源项 | 来源产物 | 实现位置 | 验证方式 |
|---|---|---|---|
| REQ / GAP / UI / TD / TASK | | | |

## 9. 偏离与补偿

| 偏离项 | 原因 | 风险 | 补偿验证 / 后续处理 |
|---|---|---|---|
| | | | |

## 10. 真实 Diff 对账

| 检查项 | 结果 | 备注 |
|---|---|---|
| `git status --short --untracked-files=all` 已检查 | 是 / 否 | |
| `git diff --name-only` 已与 changed-files 对齐 | 是 / 否 | |
| `git diff --stat` 已与变更摘要对齐 | 是 / 否 | |
| 未追踪文件已登记或排除 | 是 / 否 / N/A | |
| 登记但无真实 diff 的文件已有解释 | 是 / 否 / N/A | |
| 无批准范围外文件改动 | 是 / 否 | |
| 未完成 task 已写明原因 | 是 / 否 | |

## 11. Code Review 准备清单

| 检查项 | 结果 | 备注 |
|---|---|---|
| 每个完成 task 有实现证据 | 是 / 否 | |
| 每个完成 task 有验证证据或可信 N/A | 是 / 否 | |
| 每个真实 diff 文件在 changed-files 中登记 | 是 / 否 | |
| technical_design `yes` 影响面均已实现或记录偏离 | 是 / 否 / N/A | |
| technical_design `no` 影响面无未经批准改动 | 是 / 否 / N/A | |
| 没有直接实现 unresolved `unknown` | 是 / 否 / N/A | |

## 12. 审查提示

- 重点审查：
- 已知风险：
- 需要 reviewer 特别确认：

## 13. Wiki 回写提示

| 长期事实 | 建议 wiki 文件 | 原因 |
|---|---|---|
| | | |
