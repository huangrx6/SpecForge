# Test Engineering Anti-Patterns

| 反模式 | 表现 | 修正 |
| --- | --- | --- |
| Happy path only | 只测正常提交 | 补错误、空态、权限、边界 |
| Login guessed | 测试里猜账号密码或硬编码 | 写 auth-plan，使用 env / manual / storage-state |
| Browser without assertions | 打开页面但没有断言 | 每步补可见结果 |
| CSS selector fragile | 依赖深层 CSS 路径 | 改用 role / label / text / testid |
| Test data unknown | 不知道数据是否存在 | 写 seed / fixture / precondition |
| External dependency real call | 直接依赖外部服务 | mock / contract / deferred real check |
| Screenshot as only proof | 只有截图 | 补 trace / assertion / command output |
| Unit test overmocking | mock 掉核心逻辑 | 测真实纯函数或真实 adapter contract |
| Environment drift | 本地能跑但缺 env 说明 | 写 runtime-runbook |
| Hidden deferred | 失败项写“后续处理” | 写 owner / needed by / trigger |
