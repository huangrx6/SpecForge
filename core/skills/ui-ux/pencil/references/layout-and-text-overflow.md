# Layout And Text Overflow

本文件只定义 Pencil 画布层面的布局检查和修复动作，不定义 spacing scale、断点体系或 Product UI 页面规则。

## 构建原则

- 优先用 `.pen` 的 layout 属性组织节点：`layout: "vertical"` / `layout: "horizontal"`。
- 对需要自适应的子节点使用 `width: "fill_container"`、`height: "fill_container"` 或 `fit_content`。
- 文本节点必须有明确宽度或位于可约束容器内。
- 长文案、中文标题、按钮文字、表格字段必须用截图验证是否截断。
- 不确定布局是否安全时，先小范围 section 构建，再截图和 snapshot。

## 检查工具

```md
snapshot_layout:
- parentId: target section / artboard
- maxDepth: 3-5
- problemsOnly: true
```

关注：

- clipped text
- sibling overlap
- children outside parent bounds
- unintended empty frame
- content wider than artboard
- fixed-size node breaking parent layout

## 修复动作

| 问题 | Pencil 修复 |
| --- | --- |
| 文本超出容器 | 设置 text width、max lines、换行或扩大容器 |
| 子节点越界 | 改为 fill / fit sizing，或调整父节点 layout |
| 节点重叠 | 修正 layout direction、gap、position 或移入正确父级 |
| 画板空白异常 | 检查节点是否在可视范围外或父级尺寸为 0 |
| 组件实例内部破版 | 用 descendants 调整 slot / text；必要时回到 component contract |

## 输出

```md
Pencil Layout Check:
| Target | Tool | Result | Fix |
| --- | --- | --- | --- |
| | snapshot_layout / get_screenshot | pass / issue / blocked | |
```
