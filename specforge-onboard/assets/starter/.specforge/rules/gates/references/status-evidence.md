# 门禁状态和值证据

## 状态值

只能使用：

- `PENDING`
- `APPROVED`
- `REQUEST_CHANGES`
- `REJECTED`
- `SKIPPED`

## 记录要求

每个 gate 必须记录：

- `required`
- `status`
- `evidence`
- `reviewer` 或执行者
- `checked_at`
- `notes`

如果工具暂未支持全部字段，证据文件中必须补齐。

## Evidence 要求

证据文件必须：

- 位于当前 change 目录内。
- 能解释决策为何成立。
- 能让后续 reviewer 复核。
- 不依赖纯聊天上下文。

## `SKIPPED`

`SKIPPED` 只有在 workflow 允许 gate 可选时才合法，并且必须写明：

- 为什么可跳过。
- 风险是什么。
- 替代验证是什么。

## Review Checklist

- 状态值是否合法。
- evidence 是否存在。
- notes 是否足以解释 gate 决策。
- 是否出现“先 APPROVED，证据之后补”的违规做法。
