# ADR-0004: Artifact Graph 驱动工作流

## 状态

Accepted

## 背景

v0.1 初始版本用固定阶段目录表达流程。这能快速搭骨架，但无法准确回答：

- 当前 change 下一个可执行产物是什么？
- 哪些产物已完成，哪些只是模板？
- 哪些产物被哪些依赖阻塞？
- 不同 workflow 是否能有不同产物图？

OpenSpec 的实现表明，artifact graph 是比固定阶段列表更适合 Agent 的控制模型。

## 决策

SpecForge 引入 `.specforge/schemas/<workflow>.json` 作为 workflow 的机器可读 artifact graph。标准流程先落地 `.specforge/schemas/standard.json`。

每个 artifact 至少声明：

- `id`
- `stage`
- `title`
- `description`
- `outputs`
- `requires`

Gate 型 artifact 额外声明：

- `gate`

## 后果

- 后续 CLI 可以根据 artifact graph 生成下一步指令。
- `status` 可以区分 done / ready / blocked / missing。
- workflow 不再被固定目录顺序限制。
- v0.2 需要调整 change scaffolding，避免一次性创建所有 artifact 模板。

