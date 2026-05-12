# Gate 规则

Gate 是决策点，用来防止范围不清、边界破损或证据不足的工作进入下一阶段。Gate 不是形式签字，而是“是否允许进入下一阶段”的机器可读记录。

## Gate 状态值

只能使用这些状态：

- `PENDING`
- `APPROVED`
- `REQUEST_CHANGES`
- `REJECTED`
- `SKIPPED`

`SKIPPED` 必须写明原因，并且只在 workflow 允许该 gate 可选时使用。

## Gate 记录要求

每个 gate 必须记录：

- `required`：当前 workflow 是否要求。
- `status`：只能使用允许状态值。
- `evidence`：证据文件路径，不能只写口头说明。
- `reviewer` 或执行者：可以是人，也可以是执行该 gate 的 Agent。
- `checked_at`：检查日期。
- `notes`：批准、拒绝或跳过的简要理由。

如果工具暂未支持全部字段，证据文件中必须补齐这些信息。

## Required Gates

| Gate | 适用范围 | Evidence |
|---|---|---|
| `spec_review` | standard、偏企业级的变更 | `02-spec-review/spec-review-v1.md` |
| `code_review` | standard、bugfix、安全敏感变更 | `04-code-review/code-review-v1.md` |
| `verification` | 所有变更 | `05-verification/report.md` 或 `ci-result.md` |
| `ssot_sync` | 所有 closed changes | `06-closure/ssot-sync.md` |

## Gate 输入和输出

| Gate | 输入 | 批准条件 | 拒绝或要求修改条件 |
|---|---|---|---|
| `spec_review` | `requirements.md`、`design.md`、`tasks.md` | 需求可验证、设计可实现、任务可执行、边界清晰 | 验收不可测、owner 不清、任务不可执行、风险未处理 |
| `code_review` | diff、`changed-files.md`、spec 产物 | 实现匹配 spec、风险可接受、无明显回归 | 越界改动、安全问题、缺测试、行为偏离 |
| `verification` | 测试命令、CI、手工证据 | 关键验收通过，缺口已记录 | 无证据、失败未解释、只跑无关测试 |
| `ssot_sync` | release、rollback、project SSoT diff | 长期事实已同步或明确无需同步 | API、架构、数据、配置变化未回写 |

## 阶段推进规则

- spec review 未批准，不进入 implementation。
- code review 未批准，不进入 verification。
- verification 未批准，不进入 closure。
- SSoT sync 未批准，不归档。
- 如果下游 change 因上游契约缺陷失败，先修上游 owner。
- `REQUEST_CHANGES` 后必须修改对应产物或记录拒绝修改的理由，不能直接改状态为 `APPROVED`。
- `REJECTED` 表示当前方向不可继续，应关闭、重建或重新 intake。
- `SKIPPED` 不等于通过。被跳过的 gate 不得作为后续质量背书。

## 自动推进规则

`specforge-work` 可以自动推进，但必须遵守：

- 自动推进前先运行 doctor / status。
- 每个 gate 独立生成 evidence。
- 不得因为用户说“继续”而跳过 required gate。
- 如果遇到高风险项，应停止并在当前产物中写明阻断原因。
- 如果测试或外部命令无法运行，应记录原因、影响和替代证据。

## 阻断条件

出现以下任一情况，gate 必须为 `REQUEST_CHANGES` 或 `REJECTED`：

- 当前产物没有对应 workflow 要求的输入文件。
- 变更目标、非目标、owner 或验收标准不清。
- 安全、权限、数据迁移、生产配置变更没有设计和验证。
- 代码改动超出批准范围且没有补充说明。
- 验证证据无法支撑验收结论。
- 长期项目事实改变但没有 SSoT sync。

## 参考来源

- Kiro Specs 使用 requirements、design、tasks 三阶段形成可跟踪执行流：https://kiro.dev/docs/specs/
- GitHub Spec Kit 强调规格先于实现，并通过多步骤 refinement 降低一次性生成风险：https://github.github.com/spec-kit/
