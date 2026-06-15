# Spec Compliance

先审查规格符合度，再审查代码质量。实现偏离 approved spec 时，不能用“代码写得还行”掩盖。

## 对照来源

| Workflow | 对照 |
| --- | --- |
| feature / standard / lite | requirements、ui-design、technical-design、tasks |
| bugfix / issue | gap-report 根因、修复策略、回归测试、tasks |
| refactor | technical-design 的行为不变边界、回归策略、tasks |

## 检查重点

- 每个关键 REQ / AC 是否被实现或明确 N/A。
- UI design 的页面、状态、角色、权限、错误和响应式是否被实现或进入 verification notes。
- Technical design 的 `yes` 影响面是否有代码 / 配置 / 文档变更和验证证据。
- Technical design 的 `no` 影响面是否出现未经批准 diff。
- Technical design 的 `unknown` 是否被直接实现。
- Architecture Contract、Implementation Handoff、Operability & Maintenance 是否被 diff、tasks 和 implementation report 承接。
- 新依赖、环境变量、迁移、外部调用或权限路径是否已批准。

## 结果写法

每项结论写成：

| Source | Expected | Evidence | Result |
| --- | --- | --- | --- |

`Result` 使用 `pass / warn / fail / N/A`。`fail` 通常对应 P0 / P1。
