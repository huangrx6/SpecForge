# Pencil Quality Gate

Pencil 交付不是“生成了 `.pen` 文件”就结束。它必须证明 design-system 的契约被实际用到，并且截图没有结构、排版、空间和状态问题。

## Section Gate

每完成一个 section，立即验证：

| 检查 | 必须动作 | Fail signal |
| --- | --- | --- |
| 截图 | `pencil_get_screenshot` | 只看 node tree，不看画面 |
| 布局 | `pencil_snapshot_layout(problemsOnly: true)` | 文本溢出、重叠、越界 |
| Token | 搜索散落属性 | raw hex、随机字号、随机 gap |
| 组件 | 检查 ref / reusable | 重画按钮、输入框、卡片 |
| Product UI | 对照 Product UI Layout Audit | KPI 空壳、大空白、死快捷入口 |

## Final Gate

交付前输出：

```md
Pencil Quality Result:
| Gate | Result | Evidence | Fix / Accepted reason |
| --- | --- | --- | --- |
| Persistence | pass / blocked | | |
| Token sync | pass / issue | | |
| Component reuse | pass / issue | | |
| Layout snapshot | pass / issue | | |
| Visual screenshot | pass / issue | | |
| Product UI layout | pass / issue / N/A | | |
| Text overflow | pass / issue | | |
| Design Contract adherence | pass / issue | | |
```

## High Severity Issues

以下问题必须修复，不能只写“后续优化”：

- `.pen` 为空或保存后无法重读。
- 截图有明显文本截断、重叠、越界。
- Product UI 首屏缺 primary work surface。
- 设计和 `foundation_system` 不一致，例如 contract 是 compact，但画布是大留白卡片。
- 只同步颜色，没有同步字体、间距、圆角、阴影和动效变量。
- 使用未记录在 Design Contract 的新色值、新字号、新圆角或新阴影。
- high severity Visual QA Detector 标记为 issue 但没有修复动作。

## Screenshot Review Lens

看截图时按这个顺序判断：

1. 用户是否知道第一步该做什么？
2. 主业务对象是否可见？
3. 字体层级是否足够，但不过度戏剧化？
4. 间距是否表达分组，而不是把内容推散？
5. 圆角和阴影是否统一，不显玩具化？
6. 状态、错误、空态、权限是否有真实恢复动作？
7. 动效说明是否能被实现，不是空泛描述？
8. 是否能从截图反推 Design Contract JSON 的选择？
