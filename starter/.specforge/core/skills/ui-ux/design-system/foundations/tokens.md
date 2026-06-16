# Tokens

Tokens 是设计语言和实现之间的桥。不要直接把视觉值散落在页面里。

## 命名

| 类型 | 示例 | 用途 |
|---|---|---|
| semantic | `--color-bg-page`, `--color-text-primary` | 面向业务语义 |
| component | `--button-height-md`, `--table-row-height` | 组件封装 |
| state | `--color-danger`, `--color-success` | 状态反馈 |

## Tailwind / shadcn-vue

- Tailwind v4 可用 `@theme` 暴露语义 token。
- shadcn-vue theme 只作为 primitive 主题，项目仍需要语义 token。
- 禁止大量 arbitrary value 直接写在业务页面中。

## Pencil Variable Hints

design-system 只输出 Pencil variable hints，让 `pencil` skill 知道哪些 token group 需要同步。实际 `get_variables`、`set_variables`、节点绑定、截图和保存验证由 `core/skills/ui-ux/pencil` 执行。
