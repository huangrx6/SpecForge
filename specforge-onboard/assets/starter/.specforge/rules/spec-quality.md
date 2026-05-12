# 规格质量规则

好规格应约束 Agent，而不是把每个变更都拖成瀑布项目。

## 合适的规格重量

- 小变更可以走 lite workflow 或直接实现。
- 中等变更应成为一个 standard change。
- 大变更应拆成多个 change，并明确契约。

如果规格显得很重，先判断是不是变更本身太大。

## 必备质量标记

- requirements 在合适时使用 EARS 风格描述。
- 歧义用 `[NEEDS CLARIFICATION: question]` 标记。
- 非目标明确。
- 验收标准可验证。
- 设计决策能追溯到需求。
- 任务足够小，可以在一次聚焦实现中完成。

## EARS 示例

```text
WHEN <event>, THE SYSTEM SHALL <response>.
IF <condition>, THE SYSTEM SHALL <response>.
WHILE <state>, THE SYSTEM SHALL <response>.
WHERE <feature applies>, THE SYSTEM SHALL <response>.
```

## 避免

- 没有证据的未来能力。
- 没有证据的 future-proofing。
- 过早描述实现细节的需求。
- 变成代码转储的设计文档。
- 没有依赖信息的任务列表。
