# Pencil Asset Reuse

本文件处理 `.pen` 内已有资产的查找、复制和证据记录。品牌、版权、外部素材使用边界来自 design-system 和相关 spec；Pencil 只负责不重复生成、不丢失资产和不破坏一致性。

## 先查再用

需要 logo、品牌图形、图标、产品图、头像或插画时，先用 `batch_get` 检索：

```md
batch_get:
- patterns:
  - { name: "logo|brand|wordmark" }
  - { name: "image|hero|illustration|avatar|icon" }
  - { reusable: true }
- readDepth: 2-4
```

## 使用决策

| 情况 | 动作 |
| --- | --- |
| 已有 logo / 品牌资产 | 复制节点或复用包含该资产的 component / ref |
| 已有图标组件 | 使用 `ref` 或 icon node，不重新生成 |
| 已有图片用于同一对象 | 复制或引用同一资产 |
| 没有资产但 spec 要求 | 记录需要用户提供或授权生成 |
| 外部来源 license 不明 | 只记录 pattern，不复制资产 |

## 资产证据

```md
Pencil Asset Reuse:
| 资产 | 来源节点 / 文件 | 操作 | 状态 | 说明 |
| --- | --- | --- | --- | --- |
| | | reused / copied / generated-with-approval / blocked | | |
```

## 禁止

- 已有 logo 时重新生成一个类似 logo。
- 复制外部截图、插画、商业素材或付费模板资产。
- 把来源不明图片直接写入 `.pen`。
- 不记录资产来源就导出截图。
