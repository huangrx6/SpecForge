# API Contract Checklist

| 检查项 | Fail signal |
| --- | --- |
| 请求契约 | 参数名、类型、必填项、默认值与 spec 不一致 |
| 响应契约 | 缺少字段、状态码错误、错误结构不稳定 |
| 兼容性 | 破坏现有调用方且无迁移说明 |
| 认证授权 | API 未按角色 / 权限 / tenant 校验 |
| 超时重试 | 外部 API 缺少 timeout、retry、rate limit 或 fallback |
| 版本化 | 公开 API 变更未说明版本、兼容期或弃用路径 |
| 测试 | 缺少 contract / integration 覆盖 |
