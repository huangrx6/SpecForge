# Authoring Prompts

这些模板用于让输出直接符合 SpecForge 验证 artifact，而不是生成泛泛测试建议。

## Test Case Authoring

生成 `TC-*` 前先回答：

- Source artifact 和 source id 是什么？
- 风险等级是什么？
- 该用 unit、integration、contract、Playwright、smoke 还是 manual？
- 前置条件和测试数据能否真实准备？
- 断言是否可观察？
- 证据目标是 `proven`、`observed`、`mocked`、`manual-confirmed`、`deferred` 还是 `missing`？

输出字段：

| 字段 | 要求 |
| --- | --- |
| Source | REQ / AC / GAP / TASK / UI / TD / CR / wiki |
| Preconditions | 可执行前置条件 |
| Test data | 数据来源、seed、唯一前缀或 N/A |
| Steps | 可执行步骤，不写泛泛描述 |
| Assertions | 可观察结果 |
| Evidence | log / screenshot / trace / report / command |
| Automation | type、file、command 或 manual reason |
| Cleanup | 清理动作 |

## Unit Test Generation

生成单测前先回答：

- 被测对象是什么？
- 行为契约来自哪个 REQ / AC / risk？
- 是否可纯函数测试？
- 需要 mock 的外部边界是什么？
- 哪些输入是边界值？
- 回归样例来自哪个 bug / code review finding？

输出 test file path、command、覆盖的 source 和未覆盖 gap。

## Playwright Flow Generation

生成浏览器流程前先写：

- source `TC-*`
- baseURL
- auth strategy
- role
- route
- preconditions
- stable locators
- steps with assertions
- screenshot points
- trace strategy
- console/network checks
- cleanup

如果缺账号、baseURL、locator 或测试数据，写 pending reason、owner 和补证方式；不要编造。

## Runtime Runbook Generation

生成 runbook 前读取 package scripts、README、docker compose、env example、technical design 和 implementation report。

输出：

- install command
- env required
- start command
- expected port
- health check
- logs path
- stop / cleanup
- failure triage

## Failure Triage

测试失败时按以下顺序判断：

1. 是否实现行为不满足 approved spec。
2. 是否测试数据、fixture、seed、cleanup 有问题。
3. 是否 env、port、服务依赖或外部系统不可用。
4. 是否 selector / locator 不稳定。
5. 是否 auth strategy、session 或权限角色错误。
6. 是否第三方依赖需要 mock、sandbox 或 deferred real check。

输出必须给出下一步：回 implementation、修测试数据、补环境、补 locator、修 auth-plan 或记录 external dependency deferred。
