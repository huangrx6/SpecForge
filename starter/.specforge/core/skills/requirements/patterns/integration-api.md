# Integration / API Pattern

用于外部服务、webhook、SDK、API 契约、第三方 provider 和跨系统同步。

## requirements 应定义

- 外部可观察行为和错误处理。
- 必须支持的输入 / 输出语义。
- 超时、重试、幂等、回滚或人工介入。
- provider 不可用时的降级行为。
- 需要 technical design 确认的契约。

## requirements 不定义

- 最终 API 路由、schema、client、SDK 版本。
- 具体数据库表和服务类。
- provider 选择，除非用户已确认。
