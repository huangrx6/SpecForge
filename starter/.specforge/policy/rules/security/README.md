# 安全规则入口

安全规则适用于任何影响认证、授权、密钥、个人数据、生产配置、供应链、日志、外部集成或权限边界的变更。安全不是最后补一条测试，而是贯穿 requirements、design、implementation、verification 到 closure 的证据链。

## 什么时候启用

- 登录、权限、密钥、个人数据。
- 文件上传、导入导出、Webhook、外部系统。
- Docker、Kubernetes、CI/CD、生产环境配置。
- 依赖升级、构建插件、代码生成器、第三方二进制。

## 按需加载参考

| 场景 | 继续读取 |
|---|---|
| 密钥、配置、泄露响应 | `references/secrets-config.md` |
| 认证、授权、租户隔离 | `references/auth-access.md` |
| 输入校验、输出编码、数据保护、日志 | `references/input-data-logging.md` |
| 供应链、依赖、验证证据 | `references/supply-chain-verification.md` |

## 核心原则

- 默认最小权限、最小暴露、最小保留。
- 安全敏感 work item 不允许跳过 code review 和 verification。
- 对安全有影响的长期决策必须记录到 `.specforge/workspace/knowledge/decisions/`。
- 发现 secret 泄露，不是删掉文件就结束，必须轮换并评估历史影响。

NIST SSDF 把安全开发视为完整生命周期实践，而不是事后检查；OWASP 的 secrets 与 logging 指南也都强调集中管理、审计、轮换和最小暴露。
