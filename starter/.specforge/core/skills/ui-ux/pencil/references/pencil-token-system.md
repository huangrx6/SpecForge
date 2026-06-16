# Pencil Variable System

本文件只说明 Pencil variables 的同步和绑定方式，不定义 token 命名体系。变量名称和值来自 `Design Contract JSON` 和 `token_delivery_hint.pencil_variables`；若契约未提供，Pencil 不自行发明设计系统。

## 官方能力边界

- `get_variables`：读取当前 `.pen` 变量。
- `set_variables`：创建或更新变量。
- `.pen` 节点可以用 `$variable` 绑定颜色、数字、字体尺寸、padding、gap、radius、opacity 等属性。
- `.pen` 支持 themes；Pencil 只记录和应用已确认主题，不决定 dark mode 策略。

## 同步步骤

1. 从 Design Contract JSON 读取变量来源：
   - `color_system.tokens`
   - `foundation_system`
   - `token_delivery_hint.pencil_variables`
   - 组件契约里的局部变量需求
2. 调用 `get_variables` 获取当前 `.pen` 变量。
3. 对比缺失、冲突、未使用变量。
4. 调用 `set_variables` 同步可确认变量。
5. 用 `batch_design` 把节点属性绑定到 `$variable`，不把值散落到节点上。
6. 用 `get_screenshot` 和 `snapshot_layout` 验证变量应用后的画面和布局。

## 冲突处理

| 情况 | 处理 |
| --- | --- |
| `.pen` 已有变量且与 Design Contract 一致 | 保留 |
| `.pen` 已有变量但值冲突 | 以 Design Contract 为准，记录变更 |
| Design Contract 未提供变量 | 不新增，记录 blocked / pending |
| 现有节点存在散落值 | 只在能确定对应变量时替换；否则记录待确认 |
| 主题轴缺失 | 不临时生成主题策略，回到 design-system / tech-design |

## 输出格式

```md
Pencil Variable Sync:
| 变量 | 来源 | 旧值 | 新值 | 状态 | 说明 |
| --- | --- | --- | --- | --- | --- |
| | Design Contract / component contract | | | synced / unchanged / blocked | |
```

## 禁止

- 只同步颜色却声称完整 token sync。
- 新增 Design Contract 没有的随机字号、间距、圆角、阴影或 motion token。
- 使用未确认工具名搜索 / 替换散落值。
- 把 Pencil variable 映射写成 Tailwind / shadcn 实现规则。
