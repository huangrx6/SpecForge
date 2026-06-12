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

## Pencil

Pencil variables 应和实现 token 对齐：颜色、字号、间距、圆角、阴影都要有对应关系。
