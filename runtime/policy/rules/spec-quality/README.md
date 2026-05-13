# 规格质量规则入口

好规格应约束 Agent，而不是把每个变更都拖成瀑布项目。

## 什么时候启用

- 生成 requirements、design、tasks。
- spec review。
- 发现产物写得像“口号”“代码清单”或“任务大杂烩”。

## 按需加载参考

| 场景 | 继续读取 |
|---|---|
| 需求清晰度、EARS、验收标准 | `references/requirements.md` |
| 设计文档质量、方案取舍、风险 | `references/design.md` |
| 任务拆解、依赖、证据、并行性 | `references/tasks.md` |

## 规格重量

- 小变更可以走 lite workflow 或直接实现。
- 中等变更应成为一个 standard change。
- 大变更应拆成多个 change，并明确契约。

如果规格显得很重，先判断是不是变更本身太大。

Kiro Specs 与 Spec Kit 都把需求、设计、任务作为 SDD 的核心三段式工件，用来把 intent 收敛成可执行计划。
