# AI Quality Pattern

用于 LLM、分类、推荐、抽取、生成、工具调用、人工复核和质量阈值。

## 必填

| 项 | 要求 |
|---|---|
| Input boundary | AI 能接收什么，不能接收什么 |
| Quality target | 正确率、人工接受率、抽检规则或可解释性 |
| Failure mode | 低置信度、超时、拒答、幻觉、敏感内容 |
| Human fallback | 谁复核，如何覆盖 AI 结果 |
| Privacy | 数据使用、日志、保留、脱敏 |

## 输出

```md
| REQ-AI-001 | MUST | IF the AI confidence is below the accepted threshold, THE SYSTEM SHALL route the result to human review instead of auto-applying it. | source | AC-AI-001 |
```
