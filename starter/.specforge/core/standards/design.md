# 体验设计标准

本标准回答：有 UI 变化时，怎样确认风格、页面、流程、状态和 Pencil 原型证据；无 UI 变化时如何写 N/A。

## UI 影响判断

有以下任一情况，必须产出 `ui-design.md`：

- 新增或修改页面、弹窗、表单、列表、后台操作台、导航。
- 用户流程、角色视图、权限展示、错误反馈发生变化。
- 视觉风格、布局密度、组件库或响应式行为需要确认。

纯后端、配置、日志、任务调度、数据迁移且没有用户可见变化时，`ui-design.md` 可写 N/A，并说明验证方式。

## 设计模式

有 UI 影响时，先判断设计模式，再选择参考 skill、设计系统和质量门禁。设计模式只用于收敛规则，不替代用户确认。

| 模式 | 适用场景 | 设计重点 | 默认参考 |
|---|---|---|---|
| **Product UI** | SaaS、后台、管理台、配置台、数据表格、审批和内部工具 | 信息架构、任务效率、状态覆盖、权限和密度 | 现有设计系统、`pc-ui-design-spec.md`、产品型 UI reference |
| **Brand Surface** | 官网、landing、portfolio、品牌页、活动页、redesign | 叙事、气质、视觉记忆点、首屏表达 | 用户参考、品牌素材、`design-taste-frontend` |
| **Hybrid** | 同一项目同时有管理端和公开展示页 | 分区处理，不混用质量标准 | Product UI 与 Brand Surface 分别确认 |

规则：

- Product UI 不追求营销页式“惊艳”；首要目标是扫描、比较、批量操作、异常恢复和长期使用不疲劳。
- Brand Surface 可以参考 `design-taste-frontend` 的 anti-slop 视觉判断，但必须转译成 Visual Style Brief、页面规则和 Pencil 原型，不直接替代 SpecForge artifact。
- Hybrid 必须把管理端和品牌展示页拆开确认：同一个产品可以有两套密度、色彩和动效边界，但不能在同一个工作区里混成四不像。
- 当 Product UI 使用 shadcn/ui 时，shadcn 只是底层 primitive / registry / theming 工具，不等于设计方向；必须在 `ui-design.md` 写清上层管理端组件契约。

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

- 可参考 `core/skills/ui-ux/pencil` 的 MCP 操作流程。
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

## 无障碍与包容性设计（WCAG 2.1 AA 红线）

无障碍设计在很多法域是法律要求，在 SpecForge 中是最底层红线。**任何维度评 C 且与无障碍相关的项，直接阻断进入 spec review。**

### 感知性（Perceivable）

- **颜色对比度**：常规文本 ≥ 4.5:1，大文本（18px bold 或 24px+）≥ 3:1。
- **文字替代**：所有图片必须有描述性 `alt` 文本；纯装饰图片使用 `alt=""`。
- **字幕**：视频内容提供同步字幕。
- **可适应**：CSS 禁用或布局变更时，内容含义保持不变。

### 可操作性（Operable）

- **键盘无障碍**：所有交互元素可通过键盘抵达和使用。
- **焦点可见**：焦点指示器清晰可见（最低 2px、高对比度），推荐 `:focus-visible` 样式。
- **跳转链接**：为键盘用户提供"Skip to main content"。
- **触摸目标**：触摸界面最小 44×44 CSS 像素。
- **无时间陷阱**：用户可延长或取消时间限制。
- **无闪烁**：内容每秒闪烁不超过 3 次。

### 可理解性（Understandable）

- **标签**：所有表单输入必须有可见的关联 `<label>` 或 `aria-label`。
- **错误识别**：错误用文字描述，不仅用颜色。
- **错误预防**：破坏性操作必须确认，允许撤销。
- **导航一致**：跨页面保持相同导航顺序。
- **语言声明**：HTML 的 `lang` 属性正确设置。

### 健壮性（Robust）

- **语义 HTML**：使用正确元素（`<button>`, `<nav>`, `<main>`, `<header>`）。
- **ARIA**：仅在语义 HTML 不足时使用 ARIA 角色。
- **兼容性**：至少测试一种主流屏幕阅读器。

### 包容性设计扩展

- 支持单手移动端操作。
- 支持 Light/Dark 双模式和 200% 缩放。
- 使用简洁语言（6-8 年级阅读水平）。
- 颜色不作为唯一语义指示器（例如错误不仅用红色，还要加图标或文字）。
- 支持 RTL 语言和文本扩展场景。

---

## 信息架构（Information Architecture）

信息架构决定内容的结构、标签和导航方式。用户找不到的功能等于不存在。

### 导航结构原则

- 主导航限制在 5-7 项。
- 使用清晰描述性标签（节名用名词，操作用动词）。
- 按用户心智模型分组，不按组织架构。
- 用卡片排序和树测试验证标签。
- 超过 2 级层次时提供面包屑。

### 导航模式选择

| 模式 | 适用场景 |
|---|---|
| **顶部导航栏** | 桌面端 3-7 个主要分区 |
| **侧边导航** | 深层级工具类产品 |
| **底部导航栏** | 移动端 3-5 个主要操作（最佳可达性） |
| **汉堡菜单** | 仅用于次要导航，隐藏导航降低可发现性 |
| **标签页** | 同层级相关视图切换 |

### 移动端信息架构

- 使用底部导航处理 3-5 个主要操作（拇指最易触及）。
- 汉堡菜单仅用于二级导航。
- 在导航栏中高亮当前分区。
- 导航不应占用超过 20% 视口面积。

### 内容组织

- **渐进式披露**：只展示当前需要的内容，按需展开细节。
- **可扫描性**：清晰标题、短段落、视觉间隔。
- 将最重要的内容放在高可见区域。
- F/Z 扫描模式：关键信息放在左上，CTA 放在视觉终点。

---

## 交互设计（Interaction Design）

交互设计覆盖用户流程和微文案（Microcopy）——这是最直接决定用户完成任务还是放弃的两个因素。

### 用户流程最佳实践

- 先绘制 happy path，再设计错误和边缘情况。
- 最小化步骤——每增加一步都会流失一定比例用户。
- 3 步以上流程必须提供清晰的进度指示器。
- 允许用户后退且不丢失已填数据。
- 尽可能在每步自动保存表单数据。
- 所有破坏性操作必须确认，并明确告知后果。

### 多步骤流程

- 显示总步骤数和当前位置（如"第 2 步，共 4 步"）。
- 允许跳过可选步骤。
- 在最终提交前汇总已输入数据。
- 重要事务完成后通过邮件或通知发送确认。

### 错误恢复

- 尽早检测错误（内联验证）。
- 用通俗语言解释错误原因和修复方法。
- 保留所有有效输入——绝不因错误清空整个表单。
- 主路径失败时提供替代路径。

### 微文案（Microcopy）规范

| 类型 | 原则 | 示例 |
|---|---|---|
| **按钮** | 用"动词 + 名词"清晰描述操作结果 | ✅ "保存草稿" ❌ "确定" |
| **空态提示** | 告诉用户下一步做什么 | ✅ "还没有项目，点击创建第一个" |
| **错误文案** | 具体、可操作、无责备 | ✅ "密码至少 8 位" ❌ "输入无效" |
| **确认对话框** | 明确说明后果 | ✅ "删除后无法恢复，确定删除？" |
| **加载文案** | 解释正在发生什么 | ✅ "正在上传文件…" ❌ "请稍候" |

---

## 视觉层级（Visual Hierarchy）

视觉设计传达层次、建立品牌一致性、引导用户注意力——用户不需要刻意思考即可感知。

### 建立层级的六大手段

1. **尺寸**：大元素先吸引注意力；用于标题和主 CTA。
2. **对比度**：高对比度吸引视线；用于关键操作和重要信息。
3. **颜色**：品牌色 / 饱和色用于强调；灰色调用于次要元素。
4. **位置**：LTR 用户先扫描左上角；关键内容遵循 F 形 / Z 形扫描模式。
5. **留白**：充裕的间距隔离并抬升重要元素。
6. **字体排版**：字重、字号、风格创造清晰的内容层级。

### 字体层级规则

- 每屏限制 3-4 种不同字号。
- 层级间保持一致比例（1.25× 或 1.333× 字体缩放）。
- 使用字重（粗体 vs 常规）在同一字号内做区分。
- 全大写字母仅用于非常短的标签（按钮、标签）。

### 颜色使用规则

- 主色用于主 CTA 和关键交互元素。
- 中性色（灰色系）用于正文和次要元素。
- 语义色用于反馈：绿（成功）、红（错误）、黄（警告）、蓝（信息）。
- 每屏重点色限制在 1-2 个以保持聚焦。

---

## Design Token 基准

SpecForge 项目的 UI 不接受"默认灰白表单"。有 UI 影响时，必须从以下基准中选择或基于用户参考产品定制。

### PC 端业务系统固定规范

当项目是 PC 端业务系统、运营后台、管理控制台、数据表格工具，或用户明确提供 PC 端 UI 规范时，读取 `pc-ui-design-spec.md`，并让该文件的具体数值覆盖本节后续通用基准。

如果实现层采用 shadcn/ui，仍优先遵守本规范或项目现有设计系统：通过 token、CSS variables、组件 wrapper 和组合组件覆盖默认样式，不把 shadcn 官方基础示例当成最终管理端设计。

采用该规范时，`ui-design.md#4 Visual Style Brief` 必须写明：

- 规范来源：`.specforge/core/standards/pc-ui-design-spec.md`。
- 基准画布：`1920x920px`。
- App shell：顶部导航 `64px`，侧边导航 `208px` / 缩进 `68px`，模块间距 `16px`。
- 主色：`#277DEA`；hover `#4998FC`；active `#1D6BD0`。
- 控件与组件：按钮 / 输入 / 选择器 `32px`，圆角 `8px`，表格行高 `46px`，弹窗最小宽 `520px`，抽屉 `480 / 720 / 960px`。
- 字体：中文 `"阿里巴巴普惠体 3.0", "Alibaba PuHuiTi 3.0", sans-serif`，英文/数字 `"D-DIN EXP", "DIN", monospace`。
- HTML/CSS 约束：必须使用规范 token；可用 UI 库但必须覆盖主题 token；不得用 emoji 图标；不得擅自引入渐变、毛玻璃、营销页 hero 或未确认的大圆角风格。

若现有项目设计系统与 `pc-ui-design-spec.md` 冲突，以项目设计系统为准，但必须在 `ui-design.md` 写明偏离原因、替代 token 和验证方式。

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
