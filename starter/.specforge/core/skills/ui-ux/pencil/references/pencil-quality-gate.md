# Pencil Quality Gate

Pencil gate 只检查原型文件、工具执行和证据完整性。设计质量标准来自 design-system，不在这里重复定义。

## Section Gate

每完成一个 section 或批量修改后，执行：

| 检查 | 工具 | Fail signal |
| --- | --- | --- |
| 节点存在 | `batch_get` | 目标节点缺失、命名不可读 |
| 布局结构 | `snapshot_layout` | 溢出、重叠、越界、文本截断 |
| 截图 | `get_screenshot` | 空白、错画板、明显破损 |
| 变量 | `get_variables` | 应绑定变量但实际散落值无法解释 |
| 保存 | 重读 `.pen` / `get_editor_state` | 文件为空、目标画板丢失 |

## Final Gate

```md
Pencil Quality Result:
| Gate | Result | Evidence | Fix / Accepted reason |
| --- | --- | --- | --- |
| Editor state | pass / blocked | | |
| Variable sync | pass / partial / blocked | | |
| Component / asset reuse | pass / issue / N/A | | |
| Layout snapshot | pass / issue / blocked | | |
| Screenshot | pass / issue / blocked | | |
| Export | pass / N/A / blocked | | |
| Persistence | pass / blocked | | |
```

## 必须修复的问题

- `.pen` 为空或保存后无法重读。
- 目标 artboard 不存在。
- `snapshot_layout` 发现未处理的 overlap / overflow / clipped text。
- 截图是空白、错误画板或明显不完整。
- 需要复用组件 / 资产但没有先用 `batch_get` 检查。
- 变量同步失败却没有记录阻塞原因。

## 交付证据

每次 Pencil 交付至少提供：

- `.pen` 路径。
- 截图导出路径。
- `snapshot_layout` 结果摘要。
- 变量同步摘要。
- 组件 / 资产复用摘要。
- 保存和重读结果。
