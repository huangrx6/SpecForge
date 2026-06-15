# Technical Design To Runtime Checks

| Technical design 内容 | Runtime check |
| --- | --- |
| API / contract | integration / contract command |
| 数据 / migration | migration dry-run / rollback check |
| 权限 / security | permission matrix / negative test |
| 配置 / env | env validation / startup smoke |
| 外部依赖 | mocked contract + deferred real check |
| rollout / rollback | runbook step |
| observability | log / metric / trace evidence |
