# Code Review Playbook

本文件是 code review 能力包的执行总纲。它合并原 `foundations/` 的职责：review 阶段边界、finding 分级、diff triage 和 spec compliance。

## Review Boundary

Code review 是 gate 审查，不是实现阶段的延伸。审查员只判断当前实现是否可进入 verification，不能在 review 阶段顺手重写实现。

可以判断：

- 真实 diff 是否落在 approved spec 和 tasks 边界内。
- 实现是否满足 requirements、gap report、UI design、technical design 和 tasks。
- implementation report、changed-files、git diff 是否一致。
- 测试、启动、迁移、回滚、截图、trace 或日志证据是否足够支撑下一阶段。
- 残余风险是否可进入 verification。

不应判断：

- 不因个人代码风格偏好阻断。
- 不要求超出 approved spec 的新功能。
- 不把 verification 阶段才应执行的真实环境验证提前包装为已通过。
- 不把外部 review 模板、第三方 agent 或泛泛建议当 gate decision。

退回规则：

| 情况 | 退回 |
| --- | --- |
| spec 本身冲突或缺少核心决策 | `sf-spec-review` 或对应 spec 阶段 |
| implementation report 与 diff 不一致 | `sf-implement` |
| P0 / P1 finding 可修复 | `sf-implement` |
| 实现方向明显偏离 | `REJECTED`，回到前序 spec |
| 只有弱证据但风险可控 | 可批准，写入 residual risks 和 verification notes |

## Finding Severity

Finding 分级决定 gate 影响。先分级，再写 decision，避免把阻断问题写成普通建议。

| 等级 | 含义 | Gate 影响 |
| --- | --- | --- |
| P0 | 错误交付、数据 / 权限 / 安全事故、明显违反 approved spec、生产不可恢复、secret / 敏感数据泄露、未授权外部调用 | `REJECTED` 或 `REQUEST_CHANGES` |
| P1 | verification 前必须修复：关键功能缺失、AC 未覆盖、required 测试缺失、新依赖 / env / migration 未说明、错误处理 / 权限 / 数据边界缺失 | `REQUEST_CHANGES` |
| P2 | 可进入 verification，但必须记录残余风险：弱证据、deferred 验证、可维护性风险、可观测性不足 | 可 `APPROVED`，但写 residual risks |
| P3 | 非阻断建议：命名、组织、可读性、后续重构建议 | 不阻断 |

字段要求：

- `severity`
- `location`
- `source`
- `problem`
- `impact`
- `required_fix`
- `evidence_needed`
- `gate_effect`

Gate 规则：

- 有 P0：不得批准。
- 有 P1：不得批准。
- 只有 P2 / P3：可批准，但必须写 residual risks 和 verification notes。
- 无 finding：仍需写明 evidence matrix 和 verification notes。

## Diff Triage

Diff triage 的目标是确认“仓库真实发生了什么”，而不是只相信实现报告。

必查命令：

```bash
git status --short --untracked-files=all
git diff --name-only
git diff --stat
```

必要时读取关键文件 diff。若 review 范围是某个 commit 或 PR，对应记录 commit range。

三向对账：

| 来源 | 检查点 |
| --- | --- |
| `03-implementation/changed-files.md` | 是否列出所有真实变更和新增文件 |
| `03-implementation/report.md` | 是否说明实现内容、偏离、验证和风险 |
| `git diff / status` | 是否存在未登记、无来源、越界或未追踪变更 |

常见 finding：

- changed-files 漏掉真实 diff 文件。
- changed-files 登记了文件，但 git diff 没有对应变化。
- untracked 文件未登记。
- 实现报告声称完成任务，但 diff 没有支撑。
- diff 超出 task `_Boundary:_`，且没有 approved spec 或偏离说明。
- 生成文件、锁文件、配置文件改变但未解释影响。

## Spec Compliance

先审查规格符合度，再审查代码质量。实现偏离 approved spec 时，不能用“代码写得还行”掩盖。

对照来源：

| Workflow | 对照 |
| --- | --- |
| feature / standard / lite | requirements、ui-design、technical-design、tasks |
| bugfix / issue | gap-report 根因、修复策略、回归测试、tasks |
| refactor | technical-design 的行为不变边界、回归策略、tasks |

检查重点：

- 每个关键 REQ / AC 是否被实现或明确 N/A。
- UI design 的页面、状态、角色、权限、错误和响应式是否被实现或进入 verification notes。
- Technical design 的 `yes` 影响面是否有代码 / 配置 / 文档变更和验证证据。
- Technical design 的 `no` 影响面是否出现未经批准 diff。
- Technical design 的 `unknown` 是否被直接实现。
- Architecture Contract、Implementation Handoff、Operability & Maintenance 是否被 diff、tasks 和 implementation report 承接。
- 新依赖、环境变量、迁移、外部调用或权限路径是否已批准。

结果写法：

| Source | Expected | Evidence | Result |
| --- | --- | --- | --- |

`Result` 使用 `pass / warn / fail / N/A`。`fail` 通常对应 P0 / P1。
