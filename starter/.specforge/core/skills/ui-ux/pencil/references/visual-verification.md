# Visual Verification

Pencil 验证必须基于渲染截图和布局快照。节点树成功不等于画面成功。

## 验证流程

1. 用 `get_screenshot` 截取目标 artboard 或 section。
2. 用 `snapshot_layout` 检查 computed bounds 和 layout problem。
3. 对照 Design Contract / Visual QA 的检查项判断是否需要修正。
4. 用 `batch_design` 修复。
5. 重新截图和 snapshot。
6. 保存并重读 `.pen`。

## 截图时机

| 时机 | 截图对象 |
| --- | --- |
| 完成一个 section | section root |
| 批量变量更新后 | 至少一个代表性 artboard |
| 修改组件实例后 | 组件实例或使用它的区域 |
| 交付前 | 每个目标 artboard |
| 变体比较 | 相关变体并排或逐个截图 |

## 记录格式

```md
Pencil Visual Evidence:
| Target | Screenshot | Layout snapshot | Result | Notes |
| --- | --- | --- | --- | --- |
| | | pass / issue / blocked | pass / issue / blocked | |
```

## 不通过信号

- 截图为空白或不是目标画板。
- 文本明显截断、重叠、越界。
- 组件实例丢失内容或 slot 未替换。
- 图片 / logo 丢失或被拉伸。
- `snapshot_layout` 报告未处理问题。
- 截图无法证明本轮修改确实发生。
