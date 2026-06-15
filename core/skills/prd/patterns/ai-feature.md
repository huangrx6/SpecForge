# AI Feature PRD Pattern

适用：

- LLM 问答。
- 意图识别。
- 分类 / 抽取 / 生成。
- Agent 工具调用。
- RAG / 知识库。
- AI 自动化判断。

## 必须确认

- AI 任务是什么。
- 输入是什么。
- 输出是什么。
- 成功质量如何定义。
- 失败如何兜底。
- 是否需要人工复核。
- 是否有敏感数据。
- 成本、延迟、限流边界。
- 是否需要日志、审计、可解释性。
- 是否允许模型不确定 / 拒答。

## PRD 输出重点

- AI Task。
- Evaluation Strategy。
- Human Review / Override。
- Safety / Privacy。
- Cost / Latency Boundary。
- Failure Modes。
- Handoff To Requirements。

## AI 指标示例

- 抽检准确率。
- 拒答率。
- 人工复核通过率。
- 平均响应时延。
- 单次调用成本。
- 工具调用成功率。
- 安全拦截率。
