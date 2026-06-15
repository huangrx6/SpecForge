# NFR Taxonomy

NFR 不是泛泛的“性能好、安全高”。它必须有触发条件、阈值、验证方式和下游 owner。

## 类型

| 类型 | 常见触发 | 写法 |
|---|---|---|
| Performance | 响应时间、吞吐、并发、批处理 | 写阈值、样本规模和验证方式 |
| Security | 权限、敏感数据、审计、导出 | 写禁止行为、角色差异和审计证据 |
| Reliability | 重试、失败恢复、幂等、任务状态 | 写失败响应和恢复路径 |
| Compatibility | 浏览器、设备、运行时、文件格式 | 写支持矩阵和 fallback |
| Observability | 日志、指标、告警、审计 | 写事件、字段、可见位置 |
| Accessibility | 键盘、语义、对比度、读屏 | 写可检查标准和关键路径 |
| Data quality | AI 质量、导入校验、去重、口径 | 写阈值、人工复核和异常处理 |

## 输出格式

```md
| ID | 类型 | 约束 | 验证方式 | 触发下游 |
|---|---|---|---|---|
| NFR-001 | Security | THE SYSTEM SHALL record an audit event when... | inspection / automated | technical_design / verification |
```
