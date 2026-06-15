# Project Startup Contract

启动前记录：

- install command
- env required
- start command
- expected port
- health check URL
- logs path
- stop command
- cleanup command

如果无法启动，归因：

| 类型 | 例子 |
| --- | --- |
| env issue | 缺 env、端口冲突、依赖服务缺失 |
| implementation bug | 启动时报错来自本次 diff |
| external dependency | 数据库、队列、第三方 API 不可达 |
| test setup issue | 命令错误、路径错误、fixture 缺失 |
