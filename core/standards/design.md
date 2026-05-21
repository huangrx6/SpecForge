# 体验设计标准

本标准回答：有 UI 变化时，怎样确认风格、页面、流程、状态和 Pencil 原型证据；无 UI 变化时如何写 N/A。

## UI 影响判断

有以下任一情况，必须产出 `ui-design.md`：

- 新增或修改页面、弹窗、表单、列表、后台操作台、导航。
- 用户流程、角色视图、权限展示、错误反馈发生变化。
- 视觉风格、布局密度、组件库或响应式行为需要确认。

纯后端、配置、日志、任务调度、数据迁移且没有用户可见变化时，`ui-design.md` 可写 N/A，并说明验证方式。

## 风格确认

设计前必须确认视觉方向，方式任选其一：

- 沿用现有设计系统或组件库。
- 用户选择风格方向或参考产品。
- Agent 给出 2-3 个候选体验方向并说明适用场景、风险和推荐项；复杂场景可扩展到 5 个。
- 低风险内部工具可记录默认假设，但在用户未确认前只能作为待确认输入，不能直接推进 Pencil 原型。

Style brief 至少包含：产品气质、布局密度、主色或 token、组件形态、禁用风格、参考来源。

用户确认必须可追溯。上游 `brief.md`、`brainstorm.md`、`prd.md` 或 `requirements.md` 至少保留以下任一标记，`instructions.mjs` 才允许进入正式 `ui_design`：

- `[UI DECISION CONFIRMED]`
- `UI Direction Status: confirmed`
- 表格项 `UI direction confirmed | yes`

如果缺少这些确认，下一步是 `sf-brainstorm` 的 UI 方向取舍，而不是 `sf-ui-design`。

## Pencil 是唯一正式原型通道

SpecForge UI design 阶段只接受 Pencil 作为正式原型证据：

| 产物 | 要求 |
|---|---|
| `01-spec/ui-design.md` | 页面地图、用户流程、Visual Style Brief、状态矩阵、验证策略 |
| `01-spec/ui-mockup.pen` | Pencil 源文件 |
| `01-spec/ui-mockup-export/*.png` | 关键页面和关键状态截图 |

Figma、HTML、ASCII、竞品截图、公开网站和第三方设计 skill 只能作为参考输入。它们的价值必须转译为 Visual Style Brief、页面规则、状态矩阵和 Pencil 原型，不能替代 Pencil 产物。

Pencil 操作规则：

- 可参考 `core/skills/pencil` 的 MCP 操作流程。
- 不要用普通文件读取 `.pen`。
- 空 `.pen` / 空画布只能读取一次；确认没有节点后必须直接创建第一屏。
- 禁止反复 `batch_get` 或 `find_empty_space_on_canvas`。
- Pencil 连续创建失败 2 次时，停止并记录阻断原因；不要降级为 HTML / ASCII 当正式证据。

## 视觉质量门禁

UI design 不是“控件摆上去就算完成”。有 UI 影响时，必须留下可审查的视觉质量证据：

- 用户提供示例设计、截图、规范或参考产品时，先提取设计语言：信息密度、布局网格、导航模式、颜色 token、字体层级、按钮 / 表单 / 表格形态、空 / 错误 / 成功反馈方式。
- 原型必须体现 Visual Style Brief，而不是默认灰白表单、无层级卡片堆叠或通用后台模板。
- 对复杂后台、审批流、上传 / 配置 / 执行类工具，必须至少覆盖关键列表页、详情 / 配置页、错误态或审批态；不能只画一个 happy path 页面。
- Pencil 原型必须有导出截图。
- 在 `ui-design.md` 中记录一次 UI guideline / design review：列出发现的问题、修改动作和最终结论。
- 没有自检迭代的 UI 证据不能视为完成。

## UI Design 必须包含

- 影响范围：新增、修改、不在范围。
- 页面地图：入口、跳转、返回路径。
- 用户流程：正常路径和异常出口。
- Visual Style Brief 和参考设计语言归一化。
- Pencil 原型证据：`.pen` 源文件和 PNG 导出截图。
- 视觉质量自检和至少一轮修正记录。
- 交互状态矩阵：默认、空、加载、成功、错误、禁用、边界值、移动端、无障碍。
- 与 requirements 的追踪关系。

## 状态覆盖底线

实现阶段最常漏的是状态。`ui-design.md` 必须明确：

- 表单校验错误显示在哪。
- 网络失败是否可重试。
- 权限不足时按钮隐藏还是禁用。
- 列表为空时展示什么。
- 长文本、超多数据、上传失败、重复提交如何处理。

如果某状态沿用组件库默认，也要写“沿用默认”，不能留空。

## 阻断项

- 有 UI 变化但没有风格确认。
- Agent 自行选择视觉方向，并在用户未确认时开始写 UI design 或 Pencil 原型。
- 有复杂流程但没有页面地图和状态矩阵。
- 原型只覆盖 happy path。
- UI 原型只有控件堆叠，没有视觉层级、信息密度、状态反馈或参考设计语言落地。
- 有 Pencil 原型但没有截图级质量自检和修正记录。
- 设计功能超出 requirements。
- UI 证据无法被 reviewer 查看。
- Pencil MCP 在空画布上重复读取而没有进入创建步骤。

---

## Design Token 基准

SpecForge 项目的 UI 不接受"默认灰白表单"。有 UI 影响时，必须从以下基准中选择或基于用户参考产品定制。

### 产品类型与默认风格基准

| 产品类型 | 风格基调 | 颜色模式 | 密度 | 参考产品 |
|---|---|---|---|---|
| **ToB SaaS 管理后台** | 专业、清晰、信息密度高 | 浅色为主，支持深色 | 紧凑（compact） | Linear, Notion, Vercel Dashboard |
| **ToC 消费应用** | 温暖、有品牌感、引导性强 | 品牌主色，渐变可用 | 宽松（comfortable） | Airbnb, Stripe, Figma |
| **开发者工具 / CLI 辅助** | 简洁、代码感、低干扰 | 深色为主 | 极简（minimal） | VS Code, Linear, Railway |
| **AI 助手 / Chat 产品** | 对话感、轻量、聚焦内容 | 浅色或双模 | 宽松 | Claude, ChatGPT, Perplexity |
| **数据分析 / BI** | 数据可读性优先、图表清晰 | 浅色，图表用对比色 | 紧凑 | Metabase, Grafana, Retool |

### Visual Style Brief 必须定义的 Token

写入 `ui-design.md` 的 Visual Style Brief 必须包含以下所有字段：

```yaml
# 产品气质（必填）
personality: "专业 / 温暖 / 极简 / 活力 / 权威"
product_type: "ToB管理后台 / ToC消费应用 / 开发者工具 / AI助手 / 数据分析"

# 颜色系统
primary_color: "具体色值或色系描述，如 HSL(220, 90%, 56%) 科技蓝"
neutral_palette: "灰度体系，如 slate / zinc / stone / gray"
semantic_colors:
  success: "绿系，如 #22c55e"
  warning: "橙/黄系，如 #f59e0b"
  error:   "红系，如 #ef4444"
  info:    "蓝系，如 #3b82f6"
dark_mode: "required / optional / not-required"

# 字体
font_family: "必须用 Google Fonts 或系统字体，如 Inter / Geist / PingFang SC"
type_scale:
  heading_1: "28-32px, weight 700"
  heading_2: "20-24px, weight 600"
  body:      "14-16px, weight 400"
  caption:   "12px, weight 400"

# 间距与圆角（必须基于 4px/8px 栅格）
spacing_unit: "4px 或 8px"
border_radius:
  sm:   "4px（输入框、小按钮）"
  md:   "8px（卡片、中等组件）"
  lg:   "12-16px（大卡片、面板）"
  full: "9999px（pill 按钮、头像、标签）"

# 阴影层次
elevation:
  low:    "0 1px 3px rgba(0,0,0,0.08)"
  medium: "0 4px 12px rgba(0,0,0,0.12)"
  high:   "0 8px 24px rgba(0,0,0,0.16)"

# 组件形态
button_primary:   "filled + 品牌主色"
button_secondary: "outlined 或 ghost"
input_style:      "bordered / underline / filled-subtle"
table_row_height: "compact=32px / default=44px / comfortable=56px"
```

### 视觉质量自审评分（Pencil 原型完成后必须执行）

按以下 6 个维度自评（A/B/C），**任何维度评 C 必须修改后才能进入 spec review**：

| 维度 | A（通过） | B（可接受） | C（必须修改） |
|---|---|---|---|
| **信息层级** | 明显视觉重量差异，用户视线有引导 | 层级存在但不突出 | 所有元素相同重量，"控件堆叠" |
| **颜色一致性** | 全页面用同一套 token，无临时颜色 | 大部分一致，有少量例外 | 随机颜色，无 token 体系 |
| **间距规律** | 严格使用 4px/8px 栅格 | 基本规律，有个别例外 | 间距随机，视觉嘈杂 |
| **状态完整性** | hover/focus/error/empty/loading 全覆盖 | 覆盖主要状态 | 只有默认态 |
| **响应式** | 移动端断点已定义，布局有适配 | 提及响应式但未细化 | 只有桌面端设计 |
| **现代感** | 渐变/阴影/圆角/毛玻璃等现代元素到位 | 设计克制但不陈旧 | 纯 2010 年代灰白平面表单风格 |

### 现代 UI 常用模式（实现参考）

```css
/* 渐变背景 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 毛玻璃卡片 */
backdrop-filter: blur(12px);
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.12);

/* 微妙阴影 */
box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.08);

/* 卡片悬浮动效 */
transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
&:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.14); }

/* 品牌渐变按钮 */
background: linear-gradient(90deg, #6366f1, #8b5cf6);
border-radius: 8px; color: white; font-weight: 600;
```

**禁止的陈旧模式：**
- 没有品牌色的纯灰白表单
- 没有阴影层次的完全扁平 UI
- 使用系统默认 `<select>` 下拉（必须自定义）
- 所有按钮相同颜色和大小
- 表格无 hover 高亮效果
- 错误/空状态没有视觉设计
