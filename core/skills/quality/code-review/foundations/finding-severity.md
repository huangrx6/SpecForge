# Finding Severity

Finding 分级决定 gate 影响。先分级，再写 decision，避免把阻断问题写成普通建议。

| 等级 | 含义 | Gate 影响 |
| --- | --- | --- |
| P0 | 错误交付、数据 / 权限 / 安全事故、明显违反 approved spec、生产不可恢复、secret / 敏感数据泄露、未授权外部调用 | `REJECTED` 或 `REQUEST_CHANGES` |
| P1 | verification 前必须修复：关键功能缺失、AC 未覆盖、required 测试缺失、新依赖 / env / migration 未说明、错误处理 / 权限 / 数据边界缺失 | `REQUEST_CHANGES` |
| P2 | 可进入 verification，但必须记录残余风险：弱证据、deferred 验证、可维护性风险、可观测性不足 | 可 `APPROVED`，但写 residual risks |
| P3 | 非阻断建议：命名、组织、可读性、后续重构建议 | 不阻断 |

## 字段要求

每条 finding 必须包含：

- `severity`
- `location`
- `source`
- `problem`
- `impact`
- `required_fix`
- `evidence_needed`
- `gate_effect`

## Gate 规则

- 有 P0：不得批准。
- 有 P1：不得批准。
- 只有 P2 / P3：可批准，但必须写 residual risks 和 verification notes。
- 无 finding：仍需写明 evidence matrix 和 verification notes。
