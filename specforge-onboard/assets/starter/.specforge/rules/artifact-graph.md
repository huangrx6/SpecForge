# Artifact Graph Rule

SpecForge 不应只依赖固定目录顺序来判断流程状态。标准流程必须同时具备：

- `schema`：声明 artifact、输出文件、依赖关系、gate 和归档要求。
- `change.yaml`：记录单个变更的状态、当前阶段、gate 状态和证据。
- `registry.yaml`：记录 active / blocked / archive 索引。

## 规则

1. 新流程优先从 `.specforge/schemas/<workflow>.json` 读取 artifact 图。
2. Artifact 的 `requires` 决定可执行顺序，不由目录名隐式推断。
3. Gate 型 artifact 必须以 `change.yaml` 中对应 gate 的 `APPROVED` 状态作为完成条件。
4. 非 gate 型 artifact 在 v0.1 过渡期可通过 `stage` 推断完成状态；v0.2 应改为按文件内容和结构校验判断。
5. 归档前必须满足 `archive.requires`。

## 后续要求

v0.2 应停止一次性生成所有阶段模板，改为按 artifact 图逐步生成下一个产物。否则仅凭文件存在无法判断“已完成”和“只是模板”。
