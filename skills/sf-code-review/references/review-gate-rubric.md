# Code Review Gate Rubric

本文件保存 code review 的 diff 对账、spec compliance、本地 `quality/code-review` 主能力、finding 分级和 gate 决策。`SKILL.md` 只保留入口执行顺序和硬门禁。

## 主能力包

每次 code_review gate 前先读取 `.specforge/core/skills/quality/code-review/SKILL.md`，再按风险读取其 foundations、checklists 和 references。不要读取或恢复外部代码审查 skill。

## Review 顺序

1. Gate 和证据完整性。
2. 真实 diff 收集。
3. Tasks 覆盖和三向对账。
4. Spec Compliance Review。
5. Code Quality / Risk Review。
6. 测试、运行、回滚、wiki 影响。
7. Gate decision。

不要先看代码风格。若 implementation 与 approved spec 不一致，先记录 P0 / P1，再谈工程质量。

## 三向对账

必须同时对齐：

| 来源 | 作用 |
|---|---|
| `01-spec/tasks.md` | 实现边界、预期文件、验证和回滚 |
| `03-implementation/report.md` + `changed-files.md` | 实施者声明的真实工作 |
| `git status` / `git diff` | 仓库事实 |

常见 finding：

- 真实 diff 文件未出现在 `changed-files.md`。
- `changed-files.md` 登记了文件但无真实 diff。
- 未追踪文件未登记。
- 任务标记完成，但没有对应 diff 或验证证据。
- diff 超出 `_Boundary:_`，implementation report 没有偏离说明。

## Spec Compliance Review

按 workflow 对照：

| Workflow | 对照 |
|---|---|
| feature / standard / lite | requirements、ui-design、technical-design、tasks |
| bugfix / issue | gap-report 根因、修复策略、回归测试、tasks |
| refactor | technical-design 的行为不变边界、回归策略、tasks |

重点：

- Requirements 的每个关键 AC 是否被实现或明确 N/A。
- UI design 的页面、状态、角色、权限、错误和响应式是否被实现或留下 verification 风险。
- Technical design 的 `yes` 影响面是否有代码 / 配置 / 文档变更和验证证据。
- Technical design 的 `no` 影响面是否出现未经批准 diff。
- Technical design 的 `unknown` 是否被直接实现。
- Architecture Contract 是否被真实 diff 遵守：边界、职责、接口、状态、数据、安全、运行和维护成本没有越界。
- Implementation Handoff 是否被实现报告和 diff 承接：change slices、sequence、files/modules、test seams、rollout、rollback seam、do-not-touch 和 open assumptions。
- Operability & Maintenance 是否被保留：日志 / 指标 / trace、health check、owner、extension point、deprecation path、wiki target、technical debt 和 revisit trigger。
- 实现是否新增依赖、环境变量、迁移、外部调用或权限路径，而 spec 没批准。

## Risk Review 清单

| 领域 | 检查 |
|---|---|
| 安全 / 权限 | 越权、对象级授权、敏感数据、日志脱敏、secret、危险默认配置 |
| 输入 / 输出 | 校验、边界值、错误响应、空状态、兼容性 |
| 数据 / 迁移 | schema、索引、回填、幂等、回滚、降级 |
| API / 外部调用 | 契约、认证、超时、重试、限流、失败兜底 |
| 后台任务 | 并发、幂等、重试、死信、恢复 |
| UI | 状态矩阵、权限视图、错误、loading、empty、a11y、响应式 |
| 配置 / 环境 | env var、默认值、密钥处理、文档 |
| 测试 | happy path、失败路径、边界、权限、回归、启动验证 |
| 架构契约 | Architecture Contract、Implementation Handoff、Operability & Maintenance 是否被 diff / report / tasks 对账 |
| Wiki | API、数据模型、配置、运行方式、产品规则或术语是否需要同步 |

## Finding 格式

每条 finding 包含：

| 字段 | 要求 |
|---|---|
| Severity | `P0 / P1 / P2 / P3` |
| Location | `file:line` 或 artifact section |
| Problem | 具体问题，不写泛泛建议 |
| Impact | 为什么影响交付、数据、安全、验证或维护 |
| Required fix | 具体修复方向 |
| Evidence needed | 需要补的测试、截图、日志、命令或说明 |

## Gate 决策

| 状态 | 使用条件 |
|---|---|
| `APPROVED` | 没有 P0 / P1 finding，残余风险可接受，并已记录 verification 提示 |
| `REQUEST_CHANGES` | 有可修复缺口，修完后回到 `sf-implement` 再重审 |
| `REJECTED` | 实现方向明显偏离 spec、风险不可接受或需要回到前序 spec |

批准前自检：

- review 文件已写入。
- 真实 diff、changed-files、implementation report 已对账。
- 所有完成任务都有实现和验证证据或可信 N/A。
- 没有 P0 / P1 finding。
- 残余 P2 / P3 已写入 `Residual Risks` 和 `Verification Notes`。
- Gate 命令：`APPROVED` 带 evidence，其他状态不带 evidence。
