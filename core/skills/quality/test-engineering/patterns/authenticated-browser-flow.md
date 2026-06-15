# Authenticated Browser Flow

每个需要登录的 Playwright flow 必须先写 auth plan。

## Flow 字段

- Role
- Account source
- Auth strategy
- Base URL
- Route
- Preconditions
- Steps
- Assertions
- Screenshots
- Trace strategy
- Cleanup

## 禁止

- 在测试文件中硬编码密码。
- 把 `storageState`、cookies、token 提交到仓库。
- 用“用户会自己登录”替代 auth plan。
