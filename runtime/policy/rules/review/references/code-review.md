# 代码审查

## 输入

- 当前 diff。
- `requirements.md`、`ui-design.md`（存在时）、`technical-design.md`（存在时）、`tasks.md`。
- `changed-files.md`、implementation report。
- 测试和验证证据。

## 必查项

- 实现是否满足验收标准。
- 是否越过 `technical-design.md` 写入范围，或偏离 `ui-design.md` 中已确认的体验边界。
- 是否引入未声明行为。
- 是否破坏 API、数据、权限或部署契约。
- 错误处理、日志、并发、资源释放是否符合场景。
- 测试是否覆盖关键路径和失败路径。
- 是否需要 SSoT sync。

## 代码健康视角

Google 的 review 指南强调：

- 不接受明显恶化代码健康的 work item。
- 测试必须有意义。
- 风格偏好不应伪装成阻断项。
- 要看 diff，也要看上下文。

## 典型阻断项

- 实现和 spec 不一致。
- 权限、安全、数据迁移缺少设计或验证。
- 公共契约破坏兼容但没有迁移策略。
- 关键路径没有测试，也没有替代证据。
