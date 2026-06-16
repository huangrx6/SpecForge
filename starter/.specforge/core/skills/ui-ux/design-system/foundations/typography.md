# Typography

字体系统不是“选一个好看的字体”。它要决定阅读速度、信息密度、数字可信度和品牌气质。先读 `references/font-source-index.md` 确定字体来源、许可和 fallback，再从 `data/font-pairing-recipes.csv` 选择 `font_pairing_id`，最后从 `data/type-scales.csv` 选择 `scale_id`。

## Token

| Token | Product UI 默认 | 用途 |
|---|---|---|
| `--font-sans` | `system-ui, PingFang SC, Microsoft YaHei, sans-serif` | 中文后台、表单、正文 |
| `--font-heading` | 默认继承 sans | 页面标题；Brand Surface 可覆盖 |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, monospace` | 代码、ID、日志 |
| `--text-page-title` | `20px / 28px` | Product UI 页面标题 |
| `--text-section-title` | `15px / 22px` | 卡片、表格、分区标题 |
| `--text-body` | `14px / 22px` | 表单、描述、列表 |
| `--text-body-sm` | `13px / 20px` | 表格单元格、辅助说明 |
| `--text-caption` | `12px / 18px` | 时间、来源、辅助说明 |
| `--text-metric` | `28px / 34px` | 指标、金额、百分比 |

## 字体来源

| 场景 | 推荐 font_source_id | 推荐 font_pairing_id | 说明 |
|---|---|---|---|
| 后台 / 管理端 / 表格 | `system-cn-ui` | `system-productive-cn` | 默认使用系统栈，加载稳定、许可风险最低 |
| 政企 / Windows 内网 | `system-cn-windows` | `system-productive-cn` | 优先兼容 Windows 字体环境 |
| 商业后台 / 电商运营 | `alibaba-puhuiti` 或 `system-cn-ui` | `enterprise-puhuiti` | 需要品牌增强时才引入外部字体 |
| AI / 数据 / 开发者工具 | `system-cn-ui` + `system-mono` | `ai-mono-product` | 正文可读，日志 / 代码 / ID 用 mono |
| 科技品牌 / 移动端 | `harmonyos-sans` 或 `misans` | `harmonyos-hybrid` / `mi-brand-system` | 适合 Hybrid 或 Brand Surface |
| 活动页 / 专题页 | `zcool-fonts` / `youshe-title` + system body | `zcool-display-system` | display 字体只做标题，不进入正文 |
| 文化 / 教育 / 阅读 | `source-han-serif` + `source-han-sans` | `sourcehan-reading` | 阅读和品牌气质优先，不用于高密表格 |

## 规则

- Product UI 默认不用下载字体；除非有品牌或用户明确要求，优先 system stack。
- 外部字体必须记录官方 URL、license note、是否内置字体文件、fallback；聚合站只能做发现入口。
- 管理端标题克制，优先信息清晰；Brand Surface 才允许 display scale。
- 表格和密集数据优先 13-14px，行高稳定；不要为了“高级”把正文降到 12px。
- 指标数字使用 tabular / 等宽策略，单位和口径清楚。
- 按钮、标签、导航不要靠加粗堆层级；用位置、尺寸、状态和分组区分。
- 中文界面避免负字距；英文缩写要配解释或 tooltip。
- 字重最多使用 3 档：regular / medium / semibold；过多字重会显得杂。
- muted 文案不能承载关键事实、错误、权限和金额。

## 模式建议

| 场景 | 推荐 scale_id | 说明 |
|---|---|---|
| 审批 / 工单 / 数据后台 | `product-compact` | 扫描效率优先 |
| 工作台 / 普通 SaaS | `product-comfortable` | 清晰和亲和之间平衡 |
| 政企后台 / 审计 / 权限 | `enterprise-productive` | 借鉴 productive type，稳定和密度优先 |
| 商家后台 / 订单 / 库存 | `commerce-admin` | 用字号、字重、位置建立层级，不只靠颜色 |
| 协作 / 项目管理 | `collaboration-workflow` | 文本角色和空间分组一起决定 |
| AI / 数据 / 开发者工具 | `data-command` | 数字、日志和状态更重要 |
| 跨端 / 移动优先 | `material-adaptive` | 角色层级和响应式适配 |
| 企业桌面工具 | `fluent-enterprise` | 稳定基线和快速扫描 |
| 官网 / 活动页 | `editorial-brand` | 允许标题对比更强 |
| 客户门户 / 低频入口 | `warm-service` | 展示区柔和，工作区回到 Product UI |
| 品牌叙事 | `brand-expressive` | 标题表达强，正文仍保持可读 |

## 输出

记录 `font_source_id`、`font_pairing_id`、`scale_id`、字体家族、字号范围、行高、数字展示、长文本截断规则、官方 URL / license note，并写入 `Design Contract JSON.scan_manifest.selected_data` 和 `Design Contract JSON.foundation_system.typography`。
