# Failure Triage Prompt

测试失败时归因：

| 类型 | 信号 | 下一步 |
| --- | --- | --- |
| product bug | 用户可见行为不满足 spec | 回 `sf-implement` |
| test data issue | 前置数据不存在或污染 | 修 fixture / seed |
| env issue | 服务、端口、env、依赖不可用 | 修 runtime runbook |
| selector issue | 元素存在但 locator 不稳定 | 补 locator contract |
| auth issue | 登录失败、session 过期、权限不符 | 修 auth-plan |
| external dependency | 第三方不可达 | mock / deferred real check |
