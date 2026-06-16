# Design To Code Handoff

Pencil 不决定前端技术方案。本文件只规定从 `.pen` 到 `sf-tech-design`、`sf-tasking`、`sf-implement` 的证据交接。

## 什么时候使用

- 用户要求从 Pencil 原型进入实现。
- `sf-tech-design` 需要读取 `.pen` 作为视觉证据。
- `sf-implement` 需要确认某个页面或组件的截图、节点结构、变量和资产来源。

## Pencil 交接内容

| 内容 | 工具 / 来源 | 后续使用 |
| --- | --- | --- |
| 目标 artboard 截图 | `get_screenshot` / `export_nodes` | visual verification |
| 节点结构 | `batch_get` | component / section implementation planning |
| 变量清单 | `get_variables` | token delivery review |
| reusable components | `batch_get` with `{ reusable: true }` | component task split |
| layout snapshot | `snapshot_layout` | overflow / bounds risk |
| 资产来源 | `batch_get` / asset notes | license and reuse check |

## 不在 Pencil 中完成的事

- Tailwind class 映射。
- shadcn-vue / Element Plus / React 组件选择。
- CSS variables 命名最终决策。
- breakpoint / responsive strategy 设计。
- 依赖引入和代码目录结构。
- accessibility 实现细节。

这些必须在 `sf-tech-design` 或 `sf-implement` 中根据 Design Contract、组件契约和代码库现状决定。

## 输出格式

```md
Pencil To Code Handoff:
| 项 | 证据 | 后续阶段 |
| --- | --- | --- |
| Artboard screenshot | | sf-verify / implementation |
| Node tree summary | | sf-tech-design / sf-tasking |
| Variables | | token delivery |
| Reusable components | | component tasks |
| Layout snapshot | | visual regression risk |
| Assets | | license / reuse check |
```

## 禁止

- 把 Pencil 节点直接等同于前端组件。
- 在 Pencil skill 中生成完整 React / Vue / Tailwind 实现规则。
- 复制 `.pen` 里的未知资产到代码。
- 跳过 technical design 直接按画布写代码。
