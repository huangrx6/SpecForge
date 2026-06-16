# SpecForge Design Contract Handoff

Pencil 原型只能消费已确认的 SpecForge 设计契约，不能自己重新决定审美、布局模式或动效层级。

## 输入检查

开始 Pencil 前必须确认：

| 输入 | 必须存在 | 缺失时 |
| --- | --- | --- |
| Design Contract JSON | `design_mode`、`color_system`、`foundation_system`、`motion` | 回到 `sf-ui-design` |
| Composition Recipe | Typography、Spacing、Radius / Shadow、Motion、Signature | 回到 design-system 补齐 |
| Product UI Layout Audit | Product UI 时必填 | 不能生成工作台 / Dashboard |
| Component Contract | 复杂或复用组件必填 | 不能直接拼 primitive |
| Visual QA Detectors | high severity issue 有结果 | 不能交付截图 |

## Handoff Matrix

| Design Contract 字段 | Pencil 动作 | 验证 |
| --- | --- | --- |
| `design_mode` | 决定 artboard 类型和密度 | 截图符合模式 |
| `color_system` | 写入 color variables | 无散落 hex |
| `foundation_system.typography` | 写入字体、字号、行高、数字变量 | 标题 / 正文 / 数字层级一致 |
| `foundation_system.spacing` | 写入 page padding、gap、control height、row height | 布局遵循密度 |
| `foundation_system.radius_shadow` | 写入 radius、border、shadow variables | 材质层级一致 |
| `foundation_system.motion` | 标注 motion token 和原型说明 | 不把动效硬编码进实现 |
| `layout` | 生成导航、滚动区、primary work surface | 首屏有主任务 |
| `product_ui_quality` | 工作台 / Dashboard 专项 QA | 无空壳后台 |
| `anti_slop_rules` | 转成截图审查项 | high issue 已处理 |

## Pencil Handoff Output

```md
Pencil Handoff:
| 项 | 结果 | 证据 |
| --- | --- | --- |
| Contract source | 01-spec/ui-design.md#Design Contract Summary | |
| Token sync | complete / partial / blocked | |
| Component reuse | reused / created / N/A | |
| Product UI layout | pass / issue / N/A | |
| Screenshot export | path | |
| Layout check | pass / issue | |
| Persistence check | pass / blocked | |
```

## Stop Conditions

- Design Contract JSON 不可解析。
- `foundation_system` 缺失。
- `design_mode` 是 Product UI，但没有 Product UI Layout Audit。
- Pencil variables 只能覆盖颜色，无法覆盖字体 / 空间 / 圆角 / 阴影 / 动效，且没有补救计划。
- `.pen` 保存后重读为空。
