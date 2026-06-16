# SpecForge Design Contract Handoff

Pencil 只消费已确认的 SpecForge UI 设计结果，不在画布阶段重新做设计决策。

## 输入

| 输入 | 用途 | 缺失时 |
| --- | --- | --- |
| `01-spec/ui-design.md#Design Contract Summary` | 获取 design mode、token 来源、组件策略、motion 边界和 verification hooks | 回到 `sf-ui-design` |
| Design Contract JSON | 机器读取变量、组件、布局和 QA 约束 | 记录 blocked |
| Component Contract | 判断是否创建 reusable component / ref / slot | 不直接拼 primitive |
| Visual QA / Product UI Layout Audit | 作为截图和 layout snapshot 的验收依据 | 不在 Pencil 内补写规则 |
| 用户确认 / 授权默认 | 判断能否执行原型 | pending 时停止 |

## Pencil 转译动作

| Contract 内容 | Pencil 动作 | 证据 |
| --- | --- | --- |
| `scan_manifest` | 记录本次读了哪些 UI artifact | Handoff 表 |
| `color_system` / `foundation_system` | 同步为 Pencil variables | `get_variables` / `set_variables` 结果 |
| `component_strategy` / component contracts | 查找 reusable components，必要时创建 component / ref / slot | `batch_get` 结果 |
| `layout` / page map | 创建或更新目标 artboard / frame | `batch_design` 操作摘要 |
| `visual_qa` / verification hooks | 转成截图、layout snapshot 和导出检查 | `get_screenshot`、`snapshot_layout` |

## 输出格式

```md
Pencil Handoff:
| 项 | 结果 | 证据 |
| --- | --- | --- |
| Contract source | | |
| Target .pen | | |
| Variables sync | complete / partial / blocked | |
| Component reuse | reused / created / N/A | |
| Screenshot export | path / blocked | |
| Layout snapshot | pass / issue / blocked | |
| Persistence check | pass / blocked | |
| Remaining risk | | |
```

## 停止条件

- Design Contract JSON 不可解析。
- 用户确认状态是 `pending`。
- 目标 `.pen` 无法打开或保存。
- Design Contract 要求的关键组件 / 状态 / 页面不存在，且没有授权创建。
- Pencil 执行会改变已确认的设计方向，而不是落地它。
