# Test Data / Auth

测试前必须写清 auth strategy 和测试数据来源，不能让 Agent 临场猜。

## Auth strategy

| 策略 | 使用场景 | 约束 |
| --- | --- | --- |
| none | 公开页面或无需登录 | 说明为什么无需登录 |
| ui-login | 用户希望看到登录过程或真实登录路径 | 账号密码来自用户、安全 env 或测试账号说明，不写死 |
| api-login | 后端支持测试登录 API | 快速稳定，适合非登录流程 |
| storage-state | 通过 auth.setup.ts 保存登录态 | `playwright/.auth` 必须 gitignore，不提交 cookies / token |
| manual | 验证码、MFA、企业 SSO | 记录手动步骤和继续点 |

## Auth artifact

`05-verification/test-engineering/auth-plan.md` 必须包含：

- Role
- Account source
- Auth method
- Sensitive data handling
- Expiration handling
- Parallel execution risk
- Cleanup
