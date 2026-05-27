# PC 端业务系统 UI 模板

本模板用于把用户提供的 PC 端业务系统规范接入 `sf-ui-design`。它不是新的外部 skill，而是 SpecForge UI 设计阶段的可选 design-system reference。

权威标准文件：

- Embedded / Lightweight 模式：优先读取 `.specforge/core/standards/pc-ui-design-spec.md`。
- Standalone 模式：按本文件的“核心 token”和“artifact 写法”输出 `specforge-import-ready.md`，后续导入时再落到 `ui-design.md`。

## 什么时候启用

出现以下任一条件时启用：

- 用户明确说使用“PC 端 UI 设计规范”“业务系统规范”“1920x920 规范”。
- 产品是运营后台、管理系统、审批台、配置台、数据管理系统。
- 页面主体是顶部导航、侧边导航、筛选表单、表格、弹窗、抽屉、图表。

不适用：

- 营销官网、品牌落地页、移动 App、游戏、内容社区。
- 已有项目设计系统与本模板冲突，且用户要求沿用项目设计系统。

## 使用顺序

1. 在 `ui-design.md#1 输入依据` 写入：`PC 端业务系统 UI 设计规范（.specforge/core/standards/pc-ui-design-spec.md）`。
2. 在 `ui-design.md#3 UI 设计访谈与方向选择` 记录用户确认或默认假设来源。
3. 在 `ui-design.md#4 Visual Style Brief` 写明采用本模板，并把核心 token 填完整。
4. 在页面地图、状态矩阵和 Pencil 原型中落地布局、组件和状态。
5. 在视觉质量 review 中逐项检查：尺寸、颜色、字号、行高、间距、圆角、状态、响应式是否与模板一致。

## 核心 token

| 类别 | Token |
|---|---|
| 画布 | `1920x920px` |
| 顶栏 | `64px`，扩展 `64 + 8*n` |
| 侧栏 | `208px`，缩进 `68px`，扩展 `200 + 8*n` |
| 字体 | 中文 `"阿里巴巴普惠体 3.0", "Alibaba PuHuiTi 3.0", sans-serif`；英文 / 数字 `"D-DIN EXP", "DIN", monospace` |
| 字号 / 行高 | `12/20`, `14/22`, `16/24`, `18/26`, `20/28`, `22/30`, `24/32` |
| 主色 | `#277DEA`，hover `#4998FC`，active `#1D6BD0` |
| 功能色 | success `#28CE89`，warning `#FFB92E`，danger `#F56C6C` |
| 中性色 | `#333333`, `#666666`, `#999999`, `#F5F7FA`, `#F5F5F5`, `#E8E8E8`, `rgba(0,0,0,.10)` |
| 圆角 | `8px` |
| 控件高度 | `32px` |
| 表格行高 | `46px` |
| 间距 | `4px`, `8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px` |

## `ui-design.md` 写法

在 Visual Style Brief 中建议这样落：

```markdown
| 项 | 结论 |
|---|---|
| 用户确认 / 默认假设 | 采用 PC 端业务系统 UI 设计规范；来源：用户确认 / 项目默认 |
| 产品气质 | 专业、稳定、信息清晰 |
| 信息密度 | 标准 / 紧凑 |
| 色彩方向 | 主色 #277DEA；功能色 success #28CE89 / warning #FFB92E / danger #F56C6C |
| 组件形态 | 8px 圆角；32px 控件；46px 表格行；顶部导航 64px；侧边导航 208px |
| 排版倾向 | 中文阿里巴巴普惠体 3.0；英文/数字 D-DIN EXP；14px/22px 正文 |
| 动效范围 | drawer 300ms ease；遮罩 200ms；按钮 hover / active 按 token |
| 响应式策略 | 24 列栅格；lg>=1200 多列，md>=992 缩减，sm>=576 单/双列 |
| 不采用 | 营销页 hero、大圆角、渐变毛玻璃、emoji 图标、未确认的外部主题默认值 |
```

## 页面结构模板

```text
App Shell
├─ TopNav: height 64px
├─ SideNav: width 208px / collapsed 68px
└─ Work Area
   ├─ Page Header: title + primary action
   ├─ Filter Bar: 32px controls, wrap when action gap < 40px
   ├─ Data Table / Form / Chart
   └─ Pagination / Footer Actions
```

## 组件落地检查

| 组件 | 必查点 |
|---|---|
| Button | 32px 高、8px 圆角、16px 左右内边距；每页 1 个主 primary |
| Form | label 左对齐 100px；错误内联；必填 `*`；禁用背景 `#F5F5F5` |
| Input / Select | 32px 高、8px 圆角、12px 左内边距、focus `#277DEA` |
| Table | 46px 行高、12px 左内边距、表头 `#F5F7FA`、hover `#F5F7FA`、操作列 100px |
| Modal | 最小宽 520px、内容 padding 24px、遮罩 `rgba(0,0,0,.4)` |
| Drawer | 480 / 720 / 960px；顶部 48px；底部 64px；内容 padding 24px；内部滚动 |
| Chart | ECharts 优先；主色 `#277DEA`；图例 12px `#666666` |

## HTML / CSS 约束

如果后续实现生成 HTML/CSS：

- 必须定义并使用规范 token。
- 可用 UI 库，但必须覆盖主题 token。
- 不得使用外部未定义 CSS 的默认值作为视觉依据。
- 不得用 emoji 做图标。
- 不得擅自引入渐变、毛玻璃、营销页 hero 或超大圆角。

## 视觉 review 额外检查

在 `ui-design.md#12` 增加或合并以下检查：

| 检查项 | 通过标准 |
|---|---|
| PC 规范 token | 颜色、字号、行高、间距、圆角、控件高度均来自模板 |
| App Shell | 顶栏 64px、侧栏 208px / 68px、模块间距 16px |
| 数据效率 | 表格、筛选、分页、固定列和状态反馈适合后台高频操作 |
| 图标一致性 | SVG、统一图标集、16/18px，不使用 emoji |
| 响应式 | 24 列栅格，低分辨率不溢出 |
