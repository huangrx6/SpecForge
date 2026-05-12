# 发布和配置

## 配置

- 配置项应有名称、含义、默认值、示例和生效范围。
- 配置校验失败应尽早失败，并给出可操作错误。
- 敏感配置通过环境变量、密钥系统或部署平台注入。
- Docker Compose、Kubernetes、CI/CD 中的环境变量变更必须写入 release 或 deployment 说明。

## release 说明

必须包含：

- 发布内容。
- 构建版本、镜像、包或 commit。
- 目标环境。
- 配置变更。
- 数据迁移或兼容要求。
- 验证步骤。
- 回滚方式。

## 发布原则

- 构建产物应可追溯到源码 commit。
- 不要手工修改构建产物后发布。
- 发布过程应可重复。

Google SRE Release Engineering 特别强调可重复、自动化、可追溯的 release process。
