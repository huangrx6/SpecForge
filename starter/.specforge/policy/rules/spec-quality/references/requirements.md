# Requirements 质量

`requirements.md` 应回答“要什么”和“如何验收”，不提前绑定实现细节。

## 必须包含

- 背景和目标。
- 分析依据：需求理解、代码库探索、外部研究 / 跳过理由、用户澄清。
- 范围和非目标。
- 用户、系统或调用方视角的行为。
- 已确认的功能选择、明确延后项和默认假设。
- 可验证的验收标准。
- 依赖的上游契约和影响的下游区域。
- 歧义、假设和待确认问题。

## 推荐写法

- 行为需求优先使用 EARS。
- 非功能需求写成可验证约束。
- 不确定项使用 `[NEEDS CLARIFICATION: question]`。
- 不要把 Agent 推荐的默认 MVP 写成用户已确认的需求。
- bugfix 必须写清当前行为、期望行为、保持不变的行为和复现条件。

## EARS 示例

```text
WHEN <event>, THE SYSTEM SHALL <response>.
IF <condition>, THE SYSTEM SHALL <response>.
WHILE <state>, THE SYSTEM SHALL <response>.
WHERE <feature applies>, THE SYSTEM SHALL <response>.
```

Kiro 在 requirements-first 工作流中同样强调用户故事、可测试验收标准和 EARS 表达。
