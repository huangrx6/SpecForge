# Radius And Shadow

圆角和阴影决定产品的材质语言。Product UI 的质感通常来自边框、背景层级和稳定密度，不来自厚重阴影。先从 `data/radius-shadow-recipes.csv` 选择 `recipe_id`。

## Token

| Token | Product UI 默认 | 用途 |
|---|---|---|
| `--radius-control` | `6px` | 按钮、输入框、badge、tab |
| `--radius-panel` | `8px` | 卡片、表格容器、侧栏面板 |
| `--radius-overlay` | `10px` | Dialog、Popover、Dropdown、Drawer 内面板 |
| `--border-surface` | `1px solid var(--color-border)` | 页面结构分割 |
| `--shadow-card` | `none` | Product UI 默认不用卡片阴影 |
| `--shadow-overlay` | `0 16px 40px rgba(15, 23, 42, 0.14)` | 浮层层级 |

## 质感规则

- Product UI 默认圆角 4-8px；超大圆角只用于 Brand Surface、Avatar-IP 或特殊 signature。
- 阴影只表达浮层和临时层级，不做装饰。
- 表格、输入框、卡片优先用边框 + 背景层级，避免厚重投影。
- Modal / Popover / Dropdown 的阴影和边框必须统一。
- 同一页面不要同时使用粗边框、重阴影、半透明材质和大圆角。
- 玻璃拟态只能用于 Brand Surface 或 Hybrid 展示面，不能进入高密表格和表单主体。

## Recipe 映射

| 场景 | 推荐 recipe_id | 说明 |
|---|---|---|
| 后台 / 管理端 / 审批台 | `product-border-first` | 边框优先，可信克制 |
| 工作台 / 运营台 | `product-soft-ops` | 轻量阴影只给关键面板 |
| AI / 数据 / 开发者工具 | `data-flat` | 高密扫描，层级扁平 |
| 品牌页 / 活动页 | `brand-material` | 材质服务主体对象 |
| IP / 空态局部 | `toy-local` | 只影响局部，不污染主系统 |

## 常见问题

- 所有容器都大圆角，会显得玩具化。
- 每张卡都有彩色阴影，会显得廉价。
- 边框、阴影、背景三者同时很重，会增加视觉噪音。

## 输出

记录 `recipe_id`、control / panel / overlay radius、surface border、card shadow、overlay shadow、禁止样式，并写入 `Design Contract JSON.foundation_system.radius_shadow`。
