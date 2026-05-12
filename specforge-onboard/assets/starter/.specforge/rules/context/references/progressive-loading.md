# 渐进加载和阶段上下文

本参考用于决定“现在该读什么，不该读什么”。

## 加载原则

- 从控制面开始，不从全仓库开始。
- 按当前 artifact 读取 rules、templates、knowledge。
- 当前事实优先使用 knowledge，不优先使用 archive。
- 读取代码时先定位入口、边界和命名，不做无目标的全量浏览。
- 对外部资料只沉淀结论、适用范围和链接，不搬运大段原文。

## 进入仓库

1. 读取根 `AGENTS.md` 或 `.specforge/AGENTS.md`。
2. 读取 `.specforge/manifest.yaml`。
3. 读取 `.specforge/registry.yaml`。
4. 如果有 active change，读取对应 `change.yaml`。
5. 根据当前 artifact 加载 rules、templates 和必要 SSoT。

## 按阶段加载

| 阶段 | 默认加载 |
|---|---|
| intake | 上下文入口、边界入口、registry、knowledge |
| requirements | spec-quality、boundaries、相关项目事实 |
| design | engineering、security、boundaries、API 规则、delivery |
| tasks | artifact graph、testing、boundaries |
| implementation | requirements、design、tasks、工程 / 安全 / 测试规则、目标代码 |
| review | review、gates、changed-files、相关验证证据 |
| verification | testing、gates、实现产物、外部执行结果 |
| closure | delivery、gates、knowledge、release / rollback / sync |

Kiro 的 specs 把 requirements、design、tasks 作为结构化阶段产物；OpenSpec 也要求每个 artifact 为下一个 artifact 提供上下文。SpecForge 的阶段加载应沿用这条路，尽量只读当前阶段真正需要的东西。

## 上下文预算

| 任务规模 | 默认策略 |
|---|---|
| 小 | lite workflow 或直接实现 |
| 中 | standard workflow，完整 requirements / design / tasks / review / verification |
| 大 | 先 discovery，再拆 change 或 initiative |

## 代码阅读策略

优先顺序：

1. `rg` 搜索领域词、函数名、路由名、schema 名。
2. 读入口文件和索引文件。
3. 读直接依赖模块。
4. 再补测试、配置和边界适配层。

不要：

- 先递归浏览整个仓库。
- 因为一个名词相似就把相邻模块全读了。
- 一次任务里同时展开多个无关方向。

## Review Checklist

- 当前 artifact 需要的上下文是否齐全。
- 是否读了明显与当前阶段无关的内容。
- 是否还缺关键项目事实或约束。
- 是否已经足够行动，不需要继续漫游。
