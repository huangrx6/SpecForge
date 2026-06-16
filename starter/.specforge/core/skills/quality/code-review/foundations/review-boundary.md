# Review Boundary

Code review 是 gate 审查，不是实现阶段的延伸。审查员只判断当前实现是否可进入 verification，不能在 review 阶段顺手重写实现。

## 可以判断

- 真实 diff 是否落在 approved spec 和 tasks 边界内。
- 实现是否满足 requirements、gap report、UI design、technical design 和 tasks。
- implementation report、changed-files、git diff 是否一致。
- 测试、启动、迁移、回滚、截图、trace 或日志证据是否足够支撑下一阶段。
- 残余风险是否可进入 verification。

## 不应判断

- 不因个人代码风格偏好阻断。
- 不要求超出 approved spec 的新功能。
- 不把 verification 阶段才应执行的真实环境验证提前包装为已通过。
- 不把外部 review 模板、第三方 agent 或泛泛建议当 gate decision。

## 退回规则

| 情况 | 退回 |
| --- | --- |
| spec 本身冲突或缺少核心决策 | `sf-spec-review` 或对应 spec 阶段 |
| implementation report 与 diff 不一致 | `sf-implement` |
| P0 / P1 finding 可修复 | `sf-implement` |
| 实现方向明显偏离 | `REJECTED`，回到前序 spec |
| 只有弱证据但风险可控 | 可批准，写入 residual risks 和 verification notes |
