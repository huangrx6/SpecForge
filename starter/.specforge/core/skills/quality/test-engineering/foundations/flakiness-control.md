# Flakiness Control

| 反复失败来源 | 控制方式 |
| --- | --- |
| 固定 timeout | 用 web-first assertion、health check 或事件等待 |
| 脆弱 selector | 优先 role / label / text / testid |
| 测试数据不存在 | 写 seed / fixture / precondition |
| 登录态过期 | auth.setup、manual checkpoint 或 API login |
| 外部依赖不稳定 | mock / contract / deferred real check |
| 并行污染 | 独立数据、唯一前缀、cleanup |
| 动画 / loading | 等待可见结果，不等任意秒数 |
