# Dependency / Env / Config Checklist

| 检查项 | Fail signal |
| --- | --- |
| 新依赖 | 未在 spec / tasks / implementation report 中确认用途、风险和许可证 |
| 锁文件 | lockfile 变更无说明或和 package 变更不一致 |
| 环境变量 | 新 env 缺少示例、默认值、验证和部署说明 |
| 配置默认值 | 默认值可能破坏生产、安全或成本 |
| feature flag | 开关缺少 rollout、rollback 或默认策略 |
| secrets | secret 写入代码、测试、日志、截图或仓库 |
| 构建运行 | 缺少启动、构建、健康检查或失败排查说明 |
