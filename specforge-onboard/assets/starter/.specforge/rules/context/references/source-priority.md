# 事实优先级和冲突处理

本参考用于判断：当多种资料彼此冲突时，应该信谁。

## 上下文优先级

| 优先级 | 来源 | 用途 |
|---|---|---|
| 1 | 当前用户指令、系统 / 开发者指令 | 当前任务最高约束 |
| 2 | `.specforge/AGENTS.md`、`manifest.yaml` | SpecForge 加载协议和路径约定 |
| 3 | 当前 `change.yaml` 和 active change 产物 | 当前工作状态、gate 和证据 |
| 4 | `.specforge/knowledge/` | 长期项目知识和 SSoT |
| 5 | `.specforge/rules/`、workflow、schema | 长期流程和工程规则 |
| 6 | archived change | 历史原因、回归背景、决策证据 |
| 7 | 外部官方文档 | 版本敏感事实、第三方 API、工具行为 |

说明：

- 外部官方文档在“版本敏感事实”上可能比本地旧文档更权威。
- 但外部资料不能自动覆盖项目内部已决策的实现约束，除非当前任务就是升级或纠偏。

## 冲突处理

发现冲突时，不要静默选择一个版本，要显式记录：

- 冲突双方是什么。
- 哪个被采用。
- 为什么采用。
- 是否需要更新 SSoT。
- 是否需要标记 `[NEEDS CLARIFICATION: ...]`。

## archive 的边界

archived change 只适合：

- 解释“为什么当时这么做”。
- 追溯旧决策。
- 做回归背景比对。
- 用户明确要求查历史。

archived change 不适合：

- 直接当作当前系统真相。
- 覆盖 `.specforge/knowledge/`。
- 覆盖现行 design / requirements。

## SSoT 和 change 的关系

- `.specforge/knowledge/` 记录长期有效事实。
- active change 记录“正在变化中的事实”。
- closure 阶段通过 `ssot-sync` 决定哪些 change 内容应回流 SSoT。

## Review Checklist

- 是否把历史 archive 当成了当前事实。
- 是否用旧研究结论覆盖了现行项目约束。
- 是否在冲突出现时留下决策记录。
- 是否应该触发 SSoT sync。
