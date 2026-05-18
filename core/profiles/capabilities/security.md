# Security Capability

用于技术选型阶段识别认证、授权、敏感数据、输入输出和供应链风险。具体安全质量标准见 `core/standards/engineering.md`。

## 适用

- 登录、会话、权限、租户隔离。
- 文件上传、导入导出、Webhook、外部集成。
- 密钥、Token、个人信息、审计日志。
- 依赖升级、构建插件、第三方二进制。

## Design 必填

- 认证方式：Session / JWT / OAuth2 / API Key。
- 授权模型：RBAC / ABAC / ACL / ownership check。
- 敏感数据：存储、传输、日志脱敏、保留周期。
- 输入输出：校验、清洗、编码、文件类型和大小。
- 验证：越权、非法输入、敏感日志、依赖扫描。

## 选择说明

安全能力通常不作为“采用某库”的理由，而是作为任何涉及边界和权限变更的强制 profile。若确认不涉及安全影响，在 technical design 中写 N/A。
