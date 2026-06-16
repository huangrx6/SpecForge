# Pencil Components

本文件只处理 Pencil 的组件复用机制。组件应该长什么样、有哪些状态、如何映射前端组件，由 design-system 和 component contract 决定。

## 官方机制

- `reusable: true`：把节点标记为可复用组件。
- `type: "ref"`：创建组件实例。
- `ref`：指向组件 id。
- `descendants`：覆盖实例内部指定子节点。
- `slot`：声明组件内部可替换的容器区域。

## 发现组件

开始修改前先读取现有组件：

```md
batch_get:
- patterns: [{ reusable: true }]
- readDepth: 2-4
- searchDepth: 根据画布结构选择
```

同时按名称检索常见组件：Button、Input、Table、Card、Dialog、Drawer、Sidebar、Navbar、Toolbar、Badge、Avatar、Chart、Empty、Toast。

## 使用组件

| 场景 | Pencil 动作 |
| --- | --- |
| 已有组件可用 | 用 `batch_design` 插入 `{ "type": "ref", "ref": "<component-id>" }` |
| 只改文案 / 图标 / 状态 | 用 descendants 或子路径覆盖内部节点 |
| 组件有内容槽 | 使用 slot / descendants 替换 slot 内容 |
| 没有可复用组件 | 按 component contract 创建新节点，并设置 `reusable: true` |
| 组件结构不满足需求 | 记录 blocked 或请求 design-system / component contract 更新 |

## 复用记录

```md
Pencil Component Reuse:
| 需求 | 组件 / ref | 操作 | 状态 | 证据 |
| --- | --- | --- | --- | --- |
| | | reused / created / blocked / N/A | | |
```

## 禁止

- 在 `.pen` 内重新定义组件 anatomy、variants、states。
- 已有 reusable component 时重新画一个外观相似的节点。
- 直接把 React / Vue / shadcn 组件 API 写进 Pencil reference。
- 用截图相似度替代 component contract。
