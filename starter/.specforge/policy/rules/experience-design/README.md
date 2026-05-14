# 体验设计规则

本规则用于页面、应用、后台、前端组件和全栈产品的 UX / UI 设计。UI 设计独立落在 `ui-design.md`，不要和前后端架构、API、数据设计混在一个技术设计里。

## 什么时候必须启用

- 新增或大改用户可见页面、组件、路由、表单或多步骤流程。
- 新增后台、仪表盘、编辑器、内容管理、工作台、审批台或运营控制台。
- 用户提到页面、设计、主题、线稿、原型、交互、视觉风格、Figma、Pencil、截图或参考产品。
- 实现需要选择编辑器、图表、富文本、Markdown、拖拽、文件上传、复杂表单或角色差异化视图。

## 核心原则

1. **先确认风格，再选择工具。** UI design 阶段必须先判断是否已有品牌 / 设计系统约束；没有约束时，需要向用户确认视觉风格方向或提供 2-4 个可选方向。
2. **UI design 是实现合同，不是随手草图。** 前端实现者应能根据 `ui-design.md` 和原型证据开始实现，不需要再反问页面状态、交互出口和错误态怎么处理。
3. **设计服务需求，不扩大范围。** 每个页面、流程和状态都要能追溯到 requirements、brief、用户澄清或现有设计系统。
4. **中保真优先。** 交付目标是布局关系、关键文案、状态和交互清楚；像素级高保真只在已有 Figma / 设计系统或用户明确要求时才需要。

## 必含内容

### 1. 影响范围

列出新增、修改和明确不在范围内的页面 / 组件 / 流程。

| 页面 / 组件 | 新增 / 修改 / 不在范围 | 路径或入口 | 使用者 | 主要状态 |
|---|---|---|---|---|

### 2. 视觉风格确认

如果项目已有设计系统，引用其约束；如果没有，必须在 UI design 阶段先给用户确认。

必须记录：

- 风格关键词：例如企业后台、开发者工具、内容平台、消费级、编辑器、数据密集、极简、品牌化等。
- 参考方向：可来自现有产品、截图、Figma、Pencil、品牌手册，或 getdesign.md 这类 DESIGN.md 风格库。
- 信息密度：宽松 / 标准 / 紧凑。
- 色彩气质：主色倾向、背景明暗、强调色使用范围，不直接硬编码无来源的十六进制色。
- 排版倾向：系统字体 / 品牌字体 / 等宽字体使用位置。
- 圆角、阴影、边框、表格、卡片、导航、按钮的形态倾向。
- 暗色模式、响应式、动效是否在本次范围内。
- 用户确认记录或默认假设。

当用户未指定风格且没有现成设计系统时，Agent 应提出少量候选方向供选择，而不是直接生成默认 UI。

### 3. 页面地图

列出页面、路径、主要目标、入口和跳转关系。可以用表格、ASCII 树或 Mermaid。

| 页面 | 路径 | 用户目标 | 入口 | 出口 / 下一步 | 权限 |
|---|---|---|---|---|---|

### 4. 用户流程

至少覆盖主成功路径、空状态 / 首次使用路径和失败路径。涉及角色时，普通用户与管理员要分开写。

### 5. 线稿或原型证据

UI 设计工具选择发生在 `ui_design` 阶段，而不是 onboard 阶段。Spec Review Gate 只关心是否有可评审、可追踪、可验证的 UI 证据，不强制某一种工具。

| 路径 | 适用场景 | 必交证据 |
|---|---|---|
| Pencil MCP | 本地可入库、需要 AI 直接生成或修改中保真原型 | `01-spec/ui-mockup.pen` 和 `01-spec/ui-mockup-export/*.png` |
| Figma MCP | 已有 Figma 文件、设计系统、设计师协作或需要高保真还原 | Figma 文件 / Frame URL 和关键截图备份 |
| HTML mockup | 需要浏览器直接预览、Playwright 验证或无设计工具可用 | `01-spec/ui-mockup.html` |
| ASCII / Markdown | 1-2 个简单页面、纯文字布局或临时快速对齐 | 嵌入 `ui-design.md` 的线稿代码块 |

详细工具规则参考：

```text
.specforge/policy/rules/experience-design/references/ui-mockup-protocol.md
.specforge/policy/rules/experience-design/references/visual-style.md
.specforge/policy/rules/experience-design/references/pencil.md
.specforge/policy/rules/experience-design/references/figma.md
.specforge/policy/rules/experience-design/references/html-mockup.md
.specforge/policy/rules/experience-design/references/ascii-mockup.md
```

### 6. 交互状态

以下状态必须逐项判断，写 `yes / no / N/A` 和处理方式，不能留空：

| 状态类型 | 说明 |
|---|---|
| 默认态 | 用户首次进入或有正常数据时的界面 |
| 空状态 | 无数据、无结果、未配置、首次使用 |
| 加载中 | 请求、上传、执行、审批、后台任务运行时 |
| 成功反馈 | Toast、Banner、状态流转、列表刷新 |
| 表单验证错误 | 字段级错误、表单级错误、提示文案 |
| 网络 / 服务错误 | 请求失败、重试、回退、保留输入 |
| 权限 / 禁用 | 无权限、未审批、条件不满足、按钮禁用 |
| 危险操作确认 | 删除、上线、撤回、覆盖、批量执行 |
| 边界值 | 长文本、大文件、大列表、特殊字符、空分隔符 |
| 响应式 | 桌面、平板、移动端断点和导航变化 |
| 无障碍 | 键盘、Focus、aria、对比度、错误提示非纯颜色 |

## 与技术设计的边界

`ui-design.md` 只写用户看见和操作的东西：

- 页面地图、用户流程、视觉风格、线稿 / 原型和交互状态。
- Figma / Pencil / HTML / ASCII 的证据链接。
- 用户确认或待确认的体验决策。

`technical-design.md` 才写工程实现：

- 使用哪个前端框架 / 组件库 / 样式方案。
- 编辑器、Markdown、富文本、图表、拖拽或复杂交互使用什么库。
- 为什么选它，为什么不选备选方案。
- 与 `.specforge/policy/tech-profiles/` 中哪个 profile 对齐。

## Spec Review 阻断条件

- 有用户可见页面但没有页面地图。
- 有 UI 变更但没有视觉风格确认，也没有明确沿用现有设计系统。
- 有 UI 变更但没有至少一种可验收原型 / 线稿证据。
- 有交互流程但缺少 loading、empty、error、permission、success 等状态覆盖。
- 有编辑器、图表、富文本、拖拽、文件上传等复杂控件，但 UI design 没有交互行为，technical design 也没有技术选型。
- 用户没有确认关键体验选择，却进入 implementation。
