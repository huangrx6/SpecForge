# AI Quality Requirements Pattern

用于 LLM、分类、推荐、抽取、生成、工具调用、RAG、人工复核和 AI 质量阈值。

## 什么时候使用

- 系统会自动生成、总结、分类、抽取、推荐或调用工具。
- AI 输出会影响用户决策、业务状态、数据写入或自动执行。
- 需要定义低置信度、拒答、敏感内容、幻觉、超时、成本、日志和人工复核。
- 需求涉及 prompt、模型、provider 或上下文边界，但 requirements 不应提前选实现方案。

## 必须问清

- AI 输入边界：能接收什么数据，不能接收什么？
- AI 输出是否自动生效，还是必须人工确认？
- 质量目标是什么：正确率、人工接受率、抽检规则、解释要求、来源引用？
- 低置信度、超时、拒答、敏感内容、工具失败如何处理？
- 是否需要人工 fallback，谁复核，如何覆盖 AI 结果？
- 数据是否可记录、脱敏、保留、用于训练或发送给外部 provider？
- AI 成本、限流或配额是否影响需求边界？

## REQ 模板

| 场景 | REQ 写法 |
|---|---|
| 输入边界 | `THE SYSTEM SHALL accept <allowed inputs> for AI processing and reject or redact <disallowed inputs>.` |
| 低置信度 | `IF the AI confidence is below <threshold/rule>, THE SYSTEM SHALL route the result to human review instead of auto-applying it.` |
| 来源证据 | `WHEN the AI produces <answer>, THE SYSTEM SHALL expose the source evidence or mark the answer as unsupported.` |
| 人工复核 | `WHEN a reviewer overrides an AI result, THE SYSTEM SHALL preserve the reviewer decision as the applied result.` |
| 失败降级 | `IF the AI provider times out or refuses the request, THE SYSTEM SHALL expose a recoverable failure state and avoid applying incomplete output.` |
| 隐私 | `THE SYSTEM SHALL NOT send <sensitive data> to external AI providers unless explicitly approved by the requirement source.` |

## AC 模板

| Given | When | Then | 验证方式 |
|---|---|---|---|
| 输入符合允许范围 | 用户触发 AI 处理 | 系统返回结果并展示适用证据或解释 | E2E / manual |
| AI 结果低置信度 | 处理完成 | 系统进入人工复核而不是自动写入 | automated / E2E |
| provider 超时或拒答 | 用户等待结果 | 系统展示可恢复失败状态并保留原数据 | E2E |
| 用户覆盖 AI 结果 | 复核人提交人工结果 | 系统使用人工结果并保留覆盖记录 | E2E / inspection |

## 常见漏项

- 只写“使用 AI 生成”，不写输入、输出、质量、失败和人工复核。
- 把模型名、prompt、SDK 或 provider 选择写成已批准需求。
- AI 输出直接自动生效，没有低置信度和人工确认边界。
- 不写隐私、日志、保留、外部传输和成本限制。
- 不写来源证据，导致幻觉结果无法被验证。
