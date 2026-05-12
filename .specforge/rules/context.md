# 上下文规则

上下文应渐进加载。更多上下文不一定更好。

## 加载原则

- 从 `AGENTS.md`、`.specforge/manifest.yaml`、`.specforge/registry.yaml` 和当前 `change.yaml` 开始。
- 只加载当前任务需要的 workflow、rules、templates 和 project SSoT。
- 当前事实优先使用 project SSoT，不优先使用 archived change。
- archived change 只用于历史原因、回归背景或用户明确要求。
- 涉及库、API、框架或外部工具时，版本敏感事实必须查官方当前文档。

## 上下文预算

| 任务规模 | 默认处理 |
|---|---|
| 小 | 直接实现或 lite workflow |
| 中 | standard workflow，包含 requirements、design、tasks、review、verification |
| 大 | 先 discovery，再拆成多个 change 或 initiative |

## 反模式

- 还不知道任务就加载整个仓库。
- 复制旧规格文本而不检查是否仍适用。
- 把旧 implementation report 当成当前架构。
- 发现歧义后继续推进却不记录。
