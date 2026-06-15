# Runtime Smoke

Runtime smoke 证明项目能启动、健康检查能通过、关键日志可读。

## Runbook 字段

- install command
- env required
- start command
- health check URL
- expected port
- reset / cleanup command
- logs path
- failure triage

## 优先级

1. technical-design 的 server / runbook
2. implementation report
3. package.json scripts
4. README
5. docker-compose
6. framework defaults
