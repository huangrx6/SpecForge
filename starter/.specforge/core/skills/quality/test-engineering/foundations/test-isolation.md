# Test Isolation

测试必须尽量可重复、可清理、可并行。

| 风险 | 规则 |
| --- | --- |
| 数据污染 | 使用 seed / fixture / factory，写 cleanup |
| 共享账号 | 标记 parallel execution risk |
| 外部服务 | 优先 mock / contract，真实调用需用户确认 |
| 时间依赖 | 控制 clock 或写容忍范围 |
| 文件上传下载 | 使用临时目录，校验 cleanup |
| 数据库 | 使用事务、测试 schema、临时库或明确 N/A |
