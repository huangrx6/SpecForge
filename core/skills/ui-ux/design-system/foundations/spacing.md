# Spacing

空间不是把内容“放开一点”。空间要表达任务优先级、扫描路径和信息密度。先从 `data/spacing-density-scales.csv` 选择 `density_id`，再决定页面 padding、section gap、控件高度和表格行高。

## 密度模式

| 模式 | 场景 | 特征 |
|---|---|---|
| Compact | 运营后台、配置台、表格密集页 | 8px 网格，行高稳定，筛选区紧凑 |
| Comfortable | 普通 SaaS、工作台 | 8px 网格，区块留白适中 |
| Editorial | 品牌页、介绍页 | 更大留白和叙事节奏 |

## 默认 Token

| Token | Compact | Comfortable | 用途 |
|---|---|---|---|
| `--space-page-x` | `24px` | `32px` | 桌面页面左右边距 |
| `--space-section` | `16px` | `24px` | 主要区块间距 |
| `--space-panel` | `16px` | `20px` | 面板 / 卡片内边距 |
| `--space-card-gap` | `12px` | `16px` | 同组卡片或控件间距 |
| `--height-toolbar` | `44px` | `52px` | 工具栏高度 |
| `--height-control` | `32px` | `36px` | 输入框 / 按钮高度 |
| `--height-table-row` | `40px` | `44px` | 表格行高 |
| `--width-sidebar` | `240px` | `260px` | PC 侧栏宽度 |

## 栅格

- 基础间距使用 4 / 8 的倍数。
- 页面左右边距、表单列宽、表格列宽要有稳定规则。
- 卡片不嵌套卡片；section 用全宽带或无框布局。
- 响应式要定义断点下导航、表格和操作区如何折叠。
- Product UI 第一屏空白 framed area 不能超过 40%；空白必须服务扫描、分组或状态。
- 同一页面只允许一个主密度；侧栏、表格、表单和卡片不能各用一套节奏。
- Brand Surface 的大留白不能直接带到后台工作区。

## 场景映射

| 场景 | 推荐 density_id | 说明 |
|---|---|---|
| 后台 / 审批 / 表格密集页 | `compact` | 把空间留给数据和操作 |
| 工作台 / 普通 SaaS | `comfortable` | 第一屏仍需有主工作表面 |
| 数据分析 / 监控 | `analytical` | 图表和指标密度一致 |
| 品牌页 / 活动页 | `editorial` | 叙事节奏和下一屏露出 |
| AI 助手 / 客户门户 | `hybrid` | 展示区和工作区分开定义 |

## 输出

写清 `density_id`、页面容器宽度、主栅格、行间距、表单间距、表格行高、移动端折叠策略，并写入 `Design Contract JSON.foundation_system.spacing`。
